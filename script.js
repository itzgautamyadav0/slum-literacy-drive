/* ==========================================================================
   Slum Literacy Drive And Evening Volunteer Teaching Coordinator
   Complete Interactive Frontend JavaScript (Fulfilling all 4 Course Modules)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------------------------------------------------
    // Shared Real-Data Storage Keys (Zero Dummy Data - Authentic Records Only)
    // -------------------------------------------------------------------------
    const STORAGE_KEY = "slum_literacy_real_candidates_only";
    const ROSTER_KEY = "slum_literacy_authentic_students_v5";
    const ATTENDANCE_MAP_KEY = "slum_literacy_authentic_daily_attendance_v5";
    const ATTENDANCE_HISTORY_KEY = "slum_literacy_authentic_attendance_history_v5";
    const TRACKER_STORAGE_KEY = "slum_literacy_authentic_diagnostic_records_v5";
    const ADMISSIONS_STORAGE_KEY = "slum_literacy_child_admissions_v1";

    function getChildAdmissions() {
        try {
            const raw = localStorage.getItem(ADMISSIONS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveChildAdmissions(list) {
        try {
            localStorage.setItem(ADMISSIONS_STORAGE_KEY, JSON.stringify(list));
        } catch (e) {}
    }

    // Clean up all old dummy storage keys from previous tests so they never show up
    try {
        localStorage.removeItem("bright_future_volunteers_master");
        localStorage.removeItem("bright_future_volunteers_data");
        localStorage.removeItem("bright_future_volunteers_list");
        localStorage.removeItem("slum_literacy_student_roster_v2");
        localStorage.removeItem("slum_literacy_student_roster");
        localStorage.removeItem("bright_future_students_list");
        localStorage.removeItem("slum_literacy_daily_attendance_records_v2");
        localStorage.removeItem("slum_literacy_diagnostic_benchmarks_v1");
        localStorage.removeItem("slum_literacy_diagnostic_benchmarks");
        localStorage.removeItem("slum_literacy_attendance_sessions_history_v2");
    } catch(e) {}

    function getRealVolunteers() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveRealVolunteers(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
            console.warn("Storage save error:", e);
        }
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // -------------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("open");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                if (navMenu.classList.contains("open")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // 2. Animated Stats Counter (on index.html)
    // -------------------------------------------------------------------------
    const statCounters = document.querySelectorAll(".stat-number[data-target]");
    if (statCounters.length > 0) {
        const animateCount = (el) => {
            const target = parseInt(el.getAttribute("data-target"), 10);
            const duration = 1800;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const current = Math.floor(progress * target);
                el.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target.toLocaleString();
                }
            };
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        statCounters.forEach(c => observer.observe(c));
    }

    // -------------------------------------------------------------------------
    // 3. Module 1: Volunteer Shift Registration (on volunteer.html)
    // -------------------------------------------------------------------------
    const volunteerForm = document.getElementById("volunteerForm");

    if (volunteerForm) {
        volunteerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            clearErrors();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const email = document.getElementById("email").value.trim();
            const subject = document.getElementById("subject").value;
            const centerEl = document.getElementById("center");
            const center = centerEl ? centerEl.value : "Center 01: Azad Nagar Community Hall";
            const time = document.getElementById("time").value;
            const address = document.getElementById("address").value.trim();

            const selectedDays = document.querySelectorAll('input[name="days"]:checked');

            let hasError = false;

            if (!name || name.length < 2) {
                showError("nameError", "Please enter your full name (minimum 2 letters).");
                hasError = true;
            }

            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                showError("phoneError", "Please enter a valid 10-digit mobile number.");
                hasError = true;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError("emailError", "Please enter a valid email address.");
                hasError = true;
            }

            if (!subject) {
                showError("subjectError", "Please choose a subject to teach.");
                hasError = true;
            }

            if (centerEl && !center) {
                showError("centerError", "Please select your preferred teaching center.");
                hasError = true;
            }

            if (selectedDays.length === 0) {
                showError("daysError", "Please select at least one available day.");
                hasError = true;
            }

            if (!time) {
                showError("timeError", "Please choose an evening shift timing.");
                hasError = true;
            }

            if (!address || address.length < 4) {
                showError("addressError", "Please enter your residential locality or address.");
                hasError = true;
            }

            const message = document.getElementById("formMessage");

            if (hasError) {
                if (message) {
                    message.className = "form-feedback-alert error";
                    message.style.display = "block";
                    message.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please correct the highlighted errors before submitting.';
                }
                return;
            }

            const daysList = Array.from(selectedDays).map(d => d.value);
            const now = new Date();
            const formattedDate = now.toLocaleDateString() + ", " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const newVolunteer = {
                id: Date.now(),
                name: name,
                phone: phone,
                email: email,
                subject: subject,
                center: center,
                days: daysList,
                time: time,
                address: address,
                date: formattedDate,
                status: "Pending Orientation"
            };

            const currentList = getRealVolunteers();
            currentList.unshift(newVolunteer);
            saveRealVolunteers(currentList);

            if (message) {
                message.className = "form-feedback-alert success";
                message.style.display = "block";
                message.innerHTML = `
                    <div style="font-size:1.15rem; margin-bottom:6px;">
                        <i class="fa-solid fa-circle-check"></i> <strong>Congratulations, ${escapeHtml(name)}!</strong>
                    </div>
                    <div>Your volunteer teacher application has been submitted successfully.</div>
                    <div style="margin-top:8px; font-size:0.85rem; color:#047857;">
                        Selected Subject: <strong>${escapeHtml(subject)}</strong> at <strong>${escapeHtml(center)}</strong>.<br>
                        <em>Our field coordinator will contact your mobile number <strong>${escapeHtml(phone)}</strong> shortly.</em>
                    </div>
                `;
                message.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            volunteerForm.reset();
        });
    }

    function showError(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function clearErrors() {
        document.querySelectorAll(".error-msg, .field-error").forEach(e => e.textContent = "");
        const message = document.getElementById("formMessage");
        if (message) message.style.display = "none";
    }

    // -------------------------------------------------------------------------
    // 3B. Child Admission Form Logic (on enroll.html)
    // -------------------------------------------------------------------------
    const childAdmissionForm = document.getElementById("childAdmissionForm");
    const enrollFormMessage = document.getElementById("enrollFormMessage");

    if (childAdmissionForm) {
        childAdmissionForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
            if (enrollFormMessage) enrollFormMessage.style.display = "none";

            const childFullName = document.getElementById("childFullName") ? document.getElementById("childFullName").value.trim() : "";
            const childAge = document.getElementById("childAge") ? document.getElementById("childAge").value.trim() : "";
            const childGender = document.getElementById("childGender") ? document.getElementById("childGender").value : "Child";
            const childCenter = document.getElementById("childCenter") ? document.getElementById("childCenter").value : "Center A: Math Camp (Azad Nagar)";
            const childSubject = document.getElementById("childSubject") ? document.getElementById("childSubject").value : "Foundational Math";
            const childSchoolStatus = document.getElementById("childSchoolStatus") ? document.getElementById("childSchoolStatus").value : "Never went to school";
            const guardianName = document.getElementById("guardianName") ? document.getElementById("guardianName").value.trim() : "";
            const guardianOccupation = document.getElementById("guardianOccupation") ? document.getElementById("guardianOccupation").value : "Daily Wage Laborer";
            const guardianPhone = document.getElementById("guardianPhone") ? document.getElementById("guardianPhone").value.trim() : "";
            const childAddress = document.getElementById("childAddress") ? document.getElementById("childAddress").value.trim() : "";

            let hasError = false;

            if (!childFullName) {
                const err = document.getElementById("errChildName");
                if (err) err.textContent = "Please enter the child's full name.";
                hasError = true;
            }

            if (!childAge) {
                const err = document.getElementById("errChildAge");
                if (err) err.textContent = "Please enter the child's age or grade.";
                hasError = true;
            }

            if (!guardianName) {
                const err = document.getElementById("errGuardianName");
                if (err) err.textContent = "Please enter parent/guardian's full name.";
                hasError = true;
            }

            // 10-digit Indian mobile validation
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!guardianPhone) {
                const err = document.getElementById("errGuardianPhone");
                if (err) err.textContent = "Please enter guardian's 10-digit mobile number.";
                hasError = true;
            } else if (!phoneRegex.test(guardianPhone)) {
                const err = document.getElementById("errGuardianPhone");
                if (err) err.textContent = "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
                hasError = true;
            }

            if (!childAddress) {
                const err = document.getElementById("errChildAddress");
                if (err) err.textContent = "Please specify slum locality or landmark.";
                hasError = true;
            }

            if (hasError) return;

            // Generate Application ID
            const existingAdmissions = getChildAdmissions();
            const nextAppNum = (existingAdmissions.length > 0)
                ? Math.max(...existingAdmissions.map(a => parseInt(String(a.appId || "").replace("APP-", "")) || 0)) + 1
                : 101;
            const appId = "APP-" + String(nextAppNum).padStart(3, "0");

            const newApplication = {
                appId: appId,
                childFullName: childFullName,
                childAge: childAge,
                childGender: childGender,
                childCenter: childCenter,
                childSubject: childSubject,
                childSchoolStatus: childSchoolStatus,
                guardianName: guardianName,
                guardianOccupation: guardianOccupation,
                guardianPhone: guardianPhone,
                childAddress: childAddress,
                status: "Pending Approval",
                appliedDate: new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }),
                appliedTimestamp: new Date().toISOString(),
                assignedStudentId: null
            };

            existingAdmissions.unshift(newApplication);
            saveChildAdmissions(existingAdmissions);

            // Display success message
            if (enrollFormMessage) {
                enrollFormMessage.className = "form-feedback-alert success";
                enrollFormMessage.style.display = "block";
                enrollFormMessage.style.background = "#ecfdf5";
                enrollFormMessage.style.color = "#065f46";
                enrollFormMessage.style.border = "1px solid #a7f3d0";
                enrollFormMessage.style.borderRadius = "12px";
                enrollFormMessage.style.padding = "20px";
                enrollFormMessage.style.marginBottom = "24px";
                enrollFormMessage.innerHTML = `
                    <div style="font-size:1.15rem; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-circle-check" style="font-size:1.4rem; color:#10b981;"></i>
                        <strong>Admission Request Registered! Application ID: ${appId}</strong>
                    </div>
                    <p style="margin:0 0 10px 0; font-size:0.95rem;">
                        Thank you, <strong>${escapeHtml(guardianName)}</strong>! Your admission request for <strong>${escapeHtml(childFullName)}</strong> has been registered in the Slum Literacy Drive database.
                    </p>
                    <div style="background:white; border-radius:8px; padding:12px 16px; border:1px solid #d1fae5; font-size:0.88rem; color:#047857;">
                        <div><strong>Assigned Center:</strong> ${escapeHtml(childCenter)} (Evening Shift: 4:00 PM – 7:00 PM)</div>
                        <div><strong>Learning Focus:</strong> ${escapeHtml(childSubject)}</div>
                        <div style="margin-top:6px;">
                            <em>Status: <strong>Pending Approval</strong> by Coordinator Siddharth Kumar. Once approved in the Admin Portal, an official Student ID (STU-xxx) will be assigned and the child can begin evening classes immediately!</em>
                        </div>
                    </div>
                `;
                enrollFormMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            childAdmissionForm.reset();
        });
    }

    // -------------------------------------------------------------------------
    // 4. Module 2: Foundational Diagnostic Tracker Logic (on tracker.html)
    // -------------------------------------------------------------------------
    const assessmentForm = document.getElementById("assessmentForm");
    const trackerTableBody = document.getElementById("trackerTableBody");
    const resetTrackerBtn = document.getElementById("resetTrackerBtn");

    function getDiagnosticRecords() {
        try {
            const raw = localStorage.getItem(TRACKER_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch(e) {
            return [];
        }
    }

    function saveDiagnosticRecords(list) {
        try {
            localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(list));
        } catch(e) {}
    }

    function renderDiagnosticTable() {
        if (!trackerTableBody) return;
        const list = getDiagnosticRecords();
        trackerTableBody.innerHTML = "";

        if (list.length === 0) {
            trackerTableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align:center; padding: 45px 20px; color:#64748b;">
                        <i class="fa-solid fa-stethoscope" style="font-size:2.4rem; margin-bottom:12px; color:#cbd5e1; display:block;"></i>
                        <h4 style="color:#12304a; font-size:1.1rem; margin-bottom:4px;">No Diagnostic Evaluations Recorded Yet</h4>
                        <p style="font-size:13px; max-width:440px; margin:0 auto;">Only authentic student assessments evaluated via the form on the left will appear here.</p>
                    </td>
                </tr>
            `;
            return;
        }

        list.forEach((item, idx) => {
            const tr = document.createElement("tr");
            const avg = Math.round((item.t1 + item.t2 + item.t3) / 3);
            let statusBadge = avg >= 75 
                ? '<span class="status-tag" style="background:#dcfce7; color:#15803d;"><i class="fa-solid fa-check"></i> Ready for School</span>'
                : (avg >= 50 
                    ? '<span class="status-tag" style="background:#fef3c7; color:#b45309;">Intermediate</span>'
                    : '<span class="status-tag" style="background:#fee2e2; color:#b91c1c;">Remedial Needed</span>');

            tr.innerHTML = `
                <td><strong>#${idx + 1}</strong></td>
                <td><strong>${escapeHtml(item.name)}</strong></td>
                <td>${item.age} yrs</td>
                <td><small>${escapeHtml(item.center)}</small></td>
                <td><div style="font-weight:700; color:#2563eb;">${item.t1}%</div></td>
                <td><div style="font-weight:700; color:#d97706;">${item.t2}%</div></td>
                <td><div style="font-weight:700; color:#16a34a;">${item.t3}%</div></td>
                <td>${statusBadge}</td>
                <td><small>${escapeHtml(item.evaluator)}</small></td>
            `;
            trackerTableBody.appendChild(tr);
        });
    }

    if (assessmentForm) {
        assessmentForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const childName = document.getElementById("childName").value.trim();
            const childAge = document.getElementById("childAge").value;
            const centerSelect = document.getElementById("centerSelect").value;
            const t1 = parseInt(document.getElementById("tier1Score").value, 10);
            const t2 = parseInt(document.getElementById("tier2Score").value, 10);
            const t3 = parseInt(document.getElementById("tier3Score").value, 10);
            const evaluatorName = document.getElementById("evaluatorName").value.trim() || "Coordinator";

            if (!childName) return;

            const records = getDiagnosticRecords();
            records.unshift({
                name: childName,
                age: childAge,
                center: centerSelect,
                t1: t1,
                t2: t2,
                t3: t3,
                evaluator: evaluatorName
            });
            saveDiagnosticRecords(records);
            renderDiagnosticTable();

            const alertBox = document.getElementById("trackerAlert");
            if (alertBox) {
                alertBox.className = "form-feedback-alert success";
                alertBox.style.display = "block";
                alertBox.innerHTML = `Diagnostic evaluation for <strong>${escapeHtml(childName)}</strong> saved successfully!`;
                setTimeout(() => { alertBox.style.display = "none"; }, 3500);
            }
            assessmentForm.reset();
            document.getElementById("t1Val").textContent = "70%";
            document.getElementById("t2Val").textContent = "50%";
            document.getElementById("t3Val").textContent = "40%";
        });
    }

    if (resetTrackerBtn) {
        resetTrackerBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all diagnostic evaluations?")) {
                saveDiagnosticRecords([]);
                renderDiagnosticTable();
            }
        });
    }

    renderDiagnosticTable();

    // -------------------------------------------------------------------------
    // 5. Module 3: Daily Attendance Logger & Participation Calculator (on attendance.html)
    // -------------------------------------------------------------------------
    function getStudentRoster() {
        try {
            const raw = localStorage.getItem(ROSTER_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveStudentRoster(list) {
        try {
            localStorage.setItem(ROSTER_KEY, JSON.stringify(list));
        } catch (e) {}
    }

    function getAllAttendanceRecords() {
        try {
            const raw = localStorage.getItem(ATTENDANCE_MAP_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function saveAllAttendanceRecords(map) {
        try {
            localStorage.setItem(ATTENDANCE_MAP_KEY, JSON.stringify(map));
        } catch (e) {}
    }

    function getAttendanceHistory() {
        try {
            const raw = localStorage.getItem(ATTENDANCE_HISTORY_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveAttendanceHistory(list) {
        try {
            localStorage.setItem(ATTENDANCE_HISTORY_KEY, JSON.stringify(list));
        } catch (e) {}
    }

    // Elements
    const attendanceGridBody = document.getElementById("attendanceGridBody");
    const attendanceHistoryBody = document.getElementById("attendanceHistoryBody");
    const participationRateDisplay = document.getElementById("participationRateDisplay");
    const rateStatusBadge = document.getElementById("rateStatusBadge");
    const presentCountDisplay = document.getElementById("presentCountDisplay");
    const absentCountDisplay = document.getElementById("absentCountDisplay");
    const totalEnrolledDisplay = document.getElementById("totalEnrolledDisplay");
    const participationProgressBar = document.getElementById("participationProgressBar");
    const attendanceDateInput = document.getElementById("attendanceDateInput");
    const attendanceCenterSelect = document.getElementById("attendanceCenterSelect");
    const attendanceShiftSelect = document.getElementById("attendanceShiftSelect");
    const attendanceSearchInput = document.getElementById("attendanceSearchInput");
    const activeDateLabel = document.getElementById("activeDateLabel");
    const attendanceFeedbackBadge = document.getElementById("attendanceFeedbackBadge");

    const markAllPresentBtn = document.getElementById("markAllPresentBtn");
    const markAllAbsentBtn = document.getElementById("markAllAbsentBtn");
    const saveAttendanceBtn = document.getElementById("saveAttendanceBtn");
    const exportAttendanceCsvBtn = document.getElementById("exportAttendanceCsvBtn");
    const loadDefaultRosterBtn = document.getElementById("loadDefaultRosterBtn");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    // Modal elements
    const enrollStudentModal = document.getElementById("enrollStudentModal");
    const openEnrollModalBtn = document.getElementById("openEnrollModalBtn");
    const closeEnrollModalBtn = document.getElementById("closeEnrollModalBtn");
    const cancelEnrollBtn = document.getElementById("cancelEnrollBtn");
    const enrollStudentForm = document.getElementById("enrollStudentForm");

    // Initialize Date
    if (attendanceDateInput) {
        const todayStr = new Date().toISOString().slice(0, 10);
        attendanceDateInput.value = todayStr;
        if (activeDateLabel) activeDateLabel.textContent = todayStr;
    }

    function getActiveDate() {
        return (attendanceDateInput && attendanceDateInput.value) ? attendanceDateInput.value : new Date().toISOString().slice(0, 10);
    }

    // Render Student Attendance Table
    function renderAttendanceTable() {
        if (!attendanceGridBody) return;

        const date = getActiveDate();
        if (activeDateLabel) activeDateLabel.textContent = date;

        const roster = getStudentRoster();
        const recordsMap = getAllAttendanceRecords();
        const dayRecord = recordsMap[date] || {};

        attendanceGridBody.innerHTML = "";

        // If no students enrolled in entire database
        if (roster.length === 0) {
            attendanceGridBody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding: 50px 20px; color:#64748b;">
                        <i class="fa-solid fa-user-graduate" style="font-size:2.8rem; margin-bottom:14px; color:#cbd5e1; display:block;"></i>
                        <h4 style="color:#12304a; font-size:1.15rem; margin-bottom:6px;">No Students Enrolled Yet</h4>
                        <p style="font-size:0.9rem; max-width:480px; margin:0 auto 18px;">The student database is completely empty and clean. Click <strong>Enroll Student</strong> above to register your authentic evening class students.</p>
                        <button class="btn btn-primary btn-sm" onclick="document.getElementById('openEnrollModalBtn').click();">
                            <i class="fa-solid fa-user-plus"></i> Enroll First Student
                        </button>
                    </td>
                </tr>
            `;
            updateMetrics(0, 0, 0);
            return;
        }

        const selectedCenter = attendanceCenterSelect ? attendanceCenterSelect.value : "All Centers";
        const query = attendanceSearchInput ? attendanceSearchInput.value.toLowerCase().trim() : "";

        // Filter students
        const filtered = roster.filter(stu => {
            const matchesCenter = (selectedCenter === "All Centers") || (stu.center === selectedCenter);
            const matchesQuery = !query || 
                (stu.name && stu.name.toLowerCase().includes(query)) ||
                (stu.id && stu.id.toLowerCase().includes(query)) ||
                (stu.subject && stu.subject.toLowerCase().includes(query));
            return matchesCenter && matchesQuery;
        });

        if (filtered.length === 0) {
            attendanceGridBody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding: 40px; color:#64748b;">
                        <i class="fa-solid fa-user-slash" style="font-size:2.2rem; color:#cbd5e1; margin-bottom:10px; display:block;"></i>
                        <h4 style="color:#12304a; margin-bottom:4px;">No Students Found in Selected Center</h4>
                        <p style="font-size:13px; max-width:420px; margin:0 auto 14px;">You can enroll new students for this center or change your filter.</p>
                        <button class="btn btn-primary btn-sm" onclick="document.getElementById('openEnrollModalBtn').click();">
                            <i class="fa-solid fa-user-plus"></i> Enroll Student Now
                        </button>
                    </td>
                </tr>
            `;
            updateMetrics(0, 0, 0);
            return;
        }

        let presentCount = 0;
        let absentCount = 0;

        filtered.forEach((stu, idx) => {
            const stuStatus = dayRecord[stu.id] || { present: false, time: null };
            const isPresent = Boolean(stuStatus.present);
            const arrivalTime = stuStatus.time || "—";

            if (isPresent) {
                presentCount++;
            } else {
                absentCount++;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>#${idx + 1}</strong></td>
                <td><code style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:700;">${escapeHtml(stu.id)}</code></td>
                <td>
                    <strong style="color:#12304a; font-size:14px;">${escapeHtml(stu.name)}</strong>
                </td>
                <td><small style="color:#475569;">${escapeHtml(stu.age)}</small></td>
                <td><small style="color:#2563eb; font-weight:600;">${escapeHtml(stu.center)}</small></td>
                <td><span class="badge-subject">${escapeHtml(stu.subject)}</span></td>
                <td><small style="color:#475569;"><i class="fa-solid fa-phone" style="font-size:10px;"></i> ${escapeHtml(stu.phone)}</small></td>
                <td style="text-align:center;">
                    <div class="attendance-toggle-wrap">
                        <button class="toggle-btn ${isPresent ? 'btn-is-present' : ''}" 
                                onclick="setStudentPresence('${stu.id}', true)" 
                                title="Mark Present">
                            <i class="fa-solid fa-check"></i> Present
                        </button>
                        <button class="toggle-btn ${!isPresent ? 'btn-is-absent' : ''}" 
                                onclick="setStudentPresence('${stu.id}', false)" 
                                title="Mark Absent">
                            <i class="fa-solid fa-xmark"></i> Absent
                        </button>
                    </div>
                </td>
                <td style="text-align:center;">
                    <span class="arrival-time-tag ${isPresent ? 'present' : 'absent'}">
                        ${isPresent ? `<i class="fa-regular fa-clock"></i> ${escapeHtml(arrivalTime)}` : 'Absent'}
                    </span>
                </td>
                <td style="text-align:center;">
                    <button class="btn-delete-student" onclick="deleteStudentRecord('${stu.id}')" title="Remove student from roster">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            attendanceGridBody.appendChild(tr);
        });

        updateMetrics(filtered.length, presentCount, absentCount);
    }

    // Dynamic Participation Metrics Calculation
    function updateMetrics(total, present, absent) {
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;

        if (participationRateDisplay) participationRateDisplay.textContent = rate + "%";
        if (presentCountDisplay) presentCountDisplay.textContent = present;
        if (absentCountDisplay) absentCountDisplay.textContent = absent;
        if (totalEnrolledDisplay) totalEnrolledDisplay.textContent = total;
        const tabAttendanceBadge = document.getElementById("tabAttendanceBadge");
        if (tabAttendanceBadge) tabAttendanceBadge.textContent = `${total} Students`;

        if (participationProgressBar) {
            participationProgressBar.style.width = rate + "%";
            if (rate >= 75) {
                participationProgressBar.style.background = "linear-gradient(90deg, #10b981, #059669)";
            } else if (rate >= 50) {
                participationProgressBar.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
            } else {
                participationProgressBar.style.background = "linear-gradient(90deg, #ef4444, #dc2626)";
            }
        }

        if (rateStatusBadge) {
            if (total === 0) {
                rateStatusBadge.style.background = "#f1f5f9";
                rateStatusBadge.style.color = "#64748b";
                rateStatusBadge.textContent = "No Students";
            } else if (rate >= 75) {
                rateStatusBadge.style.background = "#dcfce7";
                rateStatusBadge.style.color = "#15803d";
                rateStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> High Engagement';
            } else if (rate >= 50) {
                rateStatusBadge.style.background = "#fef3c7";
                rateStatusBadge.style.color = "#b45309";
                rateStatusBadge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Moderate Attendance';
            } else {
                rateStatusBadge.style.background = "#fee2e2";
                rateStatusBadge.style.color = "#b91c1c";
                rateStatusBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Follow-up Needed';
            }
        }
    }

    // Set Student Presence Live
    window.setStudentPresence = function(studentId, isPresent) {
        const date = getActiveDate();
        const recordsMap = getAllAttendanceRecords();
        if (!recordsMap[date]) recordsMap[date] = {};

        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        recordsMap[date][studentId] = {
            present: Boolean(isPresent),
            time: isPresent ? nowTime : null
        };

        saveAllAttendanceRecords(recordsMap);
        renderAttendanceTable();

        if (attendanceFeedbackBadge) {
            attendanceFeedbackBadge.innerHTML = `<i class="fa-solid fa-check"></i> Saved: Student Marked ${isPresent ? 'Present' : 'Absent'}!`;
            setTimeout(() => {
                attendanceFeedbackBadge.innerHTML = '<i class="fa-solid fa-bolt"></i> Live Auto-Save Enabled';
            }, 2500);
        }
    };

    // Delete Student from Roster
    window.deleteStudentRecord = function(studentId) {
        const roster = getStudentRoster();
        const target = roster.find(s => s.id === studentId);
        const name = target ? target.name : studentId;

        if (confirm(`Are you sure you want to remove ${name} from the student roster?`)) {
            const updated = roster.filter(s => s.id !== studentId);
            saveStudentRoster(updated);
            renderAttendanceTable();
        }
    };

    // Mark All Present
    if (markAllPresentBtn) {
        markAllPresentBtn.addEventListener("click", () => {
            const date = getActiveDate();
            const roster = getStudentRoster();
            const recordsMap = getAllAttendanceRecords();
            if (!recordsMap[date]) recordsMap[date] = {};

            const selectedCenter = attendanceCenterSelect ? attendanceCenterSelect.value : "All Centers";
            const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            roster.forEach(stu => {
                if (selectedCenter === "All Centers" || stu.center === selectedCenter) {
                    recordsMap[date][stu.id] = { present: true, time: nowTime };
                }
            });

            saveAllAttendanceRecords(recordsMap);
            renderAttendanceTable();
        });
    }

    // Mark All Absent
    if (markAllAbsentBtn) {
        markAllAbsentBtn.addEventListener("click", () => {
            const date = getActiveDate();
            const roster = getStudentRoster();
            const recordsMap = getAllAttendanceRecords();
            if (!recordsMap[date]) recordsMap[date] = {};

            const selectedCenter = attendanceCenterSelect ? attendanceCenterSelect.value : "All Centers";

            roster.forEach(stu => {
                if (selectedCenter === "All Centers" || stu.center === selectedCenter) {
                    recordsMap[date][stu.id] = { present: false, time: null };
                }
            });

            saveAllAttendanceRecords(recordsMap);
            renderAttendanceTable();
        });
    }

    // Save & Commit Session Log
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener("click", () => {
            const date = getActiveDate();
            const roster = getStudentRoster();
            const recordsMap = getAllAttendanceRecords();
            const dayRecord = recordsMap[date] || {};

            const center = attendanceCenterSelect ? attendanceCenterSelect.value : "All Centers";
            const shift = attendanceShiftSelect ? attendanceShiftSelect.value : "Primary Shift";

            const filtered = roster.filter(stu => (center === "All Centers" || stu.center === center));
            const total = filtered.length;
            const present = filtered.filter(stu => dayRecord[stu.id] && dayRecord[stu.id].present).length;
            const absent = total - present;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;

            const newSession = {
                id: Date.now(),
                date: date,
                center: center,
                shift: shift,
                total: total,
                present: present,
                absent: absent,
                rate: rate + "%",
                committedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            };

            const history = getAttendanceHistory();
            history.unshift(newSession);
            saveAttendanceHistory(history);
            renderAttendanceHistory();

            alert(`✅ Daily Attendance Session Committed Successfully!\n\nDate: ${date}\nCenter: ${center}\nPresent: ${present} / ${total}\nParticipation Rate: ${rate}%`);
        });
    }

    // Render Attendance History Table
    function renderAttendanceHistory() {
        if (!attendanceHistoryBody) return;
        const history = getAttendanceHistory();
        attendanceHistoryBody.innerHTML = "";

        if (history.length === 0) {
            attendanceHistoryBody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding: 25px; color:#64748b;">
                        <i class="fa-regular fa-clock" style="font-size:1.6rem; margin-bottom:8px; color:#cbd5e1; display:block;"></i>
                        No committed sessions yet. Click "Save Session" above to permanently record completed evening class sessions.
                    </td>
                </tr>
            `;
            return;
        }

        history.forEach((session, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>#${idx + 1}</strong></td>
                <td><strong>${escapeHtml(session.date)}</strong></td>
                <td><small>${escapeHtml(session.center)}</small></td>
                <td><small>${escapeHtml(session.shift)}</small></td>
                <td><strong>${session.total}</strong></td>
                <td><span style="color:#16a34a; font-weight:700;"><i class="fa-solid fa-check"></i> ${session.present}</span></td>
                <td><span style="color:#dc2626; font-weight:700;"><i class="fa-solid fa-xmark"></i> ${session.absent}</span></td>
                <td><strong style="color:#2563eb;">${escapeHtml(session.rate)}</strong></td>
                <td><small style="color:#64748b;">${escapeHtml(session.committedTime)}</small></td>
                <td>
                    <button class="btn-delete-student" onclick="deleteHistorySession(${session.id})" title="Delete session log">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            attendanceHistoryBody.appendChild(tr);
        });
    }

    window.deleteHistorySession = function(sessionId) {
        if (confirm("Delete this committed session log?")) {
            const history = getAttendanceHistory().filter(s => s.id !== sessionId);
            saveAttendanceHistory(history);
            renderAttendanceHistory();
        }
    };

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all committed attendance session history?")) {
                saveAttendanceHistory([]);
                renderAttendanceHistory();
            }
        });
    }

    // Export Attendance to CSV
    if (exportAttendanceCsvBtn) {
        exportAttendanceCsvBtn.addEventListener("click", () => {
            const date = getActiveDate();
            const roster = getStudentRoster();
            const recordsMap = getAllAttendanceRecords();
            const dayRecord = recordsMap[date] || {};

            const center = attendanceCenterSelect ? attendanceCenterSelect.value : "All Centers";
            const filtered = roster.filter(stu => (center === "All Centers" || stu.center === center));

            if (filtered.length === 0) {
                alert("No students to export for the selected filter.");
                return;
            }

            const headers = ["Serial No", "Student ID", "Child Full Name", "Age / Grade", "Center", "Subject", "Guardian Phone", "Attendance Date", "Status", "Arrival Time"];

            const rows = filtered.map((stu, index) => {
                const stuStatus = dayRecord[stu.id] || { present: false, time: null };
                return [
                    index + 1,
                    stu.id,
                    stu.name,
                    stu.age,
                    stu.center,
                    stu.subject,
                    stu.phone,
                    date,
                    stuStatus.present ? "Present" : "Absent",
                    stuStatus.time || "N/A"
                ];
            });

            let csvContent = headers.map(h => `"${h}"`).join(",") + "\n";
            rows.forEach(row => {
                csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
            });

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.setAttribute("href", url);
            downloadLink.setAttribute("download", `Slum_Literacy_Student_Attendance_${date}.csv`);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }

    // Clear Roster Button (Real Data Management)
    const clearRosterBtn = document.getElementById("clearRosterBtn");
    if (clearRosterBtn) {
        clearRosterBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all enrolled students? This will remove all student records.")) {
                saveStudentRoster([]);
                renderAttendanceTable();
            }
        });
    }

    // Modal: Enroll Student
    if (openEnrollModalBtn && enrollStudentModal) {
        openEnrollModalBtn.addEventListener("click", () => {
            enrollStudentModal.style.display = "flex";
        });
    }

    if (closeEnrollModalBtn && enrollStudentModal) {
        closeEnrollModalBtn.addEventListener("click", () => {
            enrollStudentModal.style.display = "none";
        });
    }

    if (cancelEnrollBtn && enrollStudentModal) {
        cancelEnrollBtn.addEventListener("click", () => {
            enrollStudentModal.style.display = "none";
        });
    }

    if (enrollStudentForm) {
        enrollStudentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("newStudentName").value.trim();
            const age = document.getElementById("newStudentAge").value.trim();
            const subject = document.getElementById("newStudentSubject").value;
            const center = document.getElementById("newStudentCenter").value;
            const phone = document.getElementById("newStudentPhone").value.trim();

            if (!name || !age || !phone) {
                alert("Please fill all required fields.");
                return;
            }

            const roster = getStudentRoster();
            const nextId = "STU-" + (101 + roster.length);

            const newStudent = {
                id: nextId,
                name: name,
                age: age,
                center: center,
                subject: subject,
                phone: "+91 " + phone
            };

            roster.push(newStudent);
            saveStudentRoster(roster);

            // Automatically mark present upon arrival if enrolled live
            const date = getActiveDate();
            const recordsMap = getAllAttendanceRecords();
            if (!recordsMap[date]) recordsMap[date] = {};
            const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            recordsMap[date][nextId] = { present: true, time: nowTime };
            saveAllAttendanceRecords(recordsMap);

            enrollStudentForm.reset();
            enrollStudentModal.style.display = "none";
            renderAttendanceTable();

            alert(`✅ Student Enrolled Successfully!\nID: ${nextId}\nName: ${name}\nStatus: Marked Present for today!`);
        });
    }

    // Filter Listeners
    if (attendanceDateInput) attendanceDateInput.addEventListener("change", renderAttendanceTable);
    if (attendanceCenterSelect) attendanceCenterSelect.addEventListener("change", renderAttendanceTable);
    if (attendanceSearchInput) attendanceSearchInput.addEventListener("input", renderAttendanceTable);

    // Initial Renders
    renderAttendanceTable();
    renderAttendanceHistory();

    // -------------------------------------------------------------------------
    // 6. Module 4: Lesson Plan Repository (Interactive Games & Stories)
    // -------------------------------------------------------------------------
    window.switchRepoTab = function(tabName, btn) {
        document.querySelectorAll(".repo-content-pane").forEach(p => p.style.display = "none");
        document.querySelectorAll(".repo-tab-btn").forEach(b => b.classList.remove("active"));
        const target = document.getElementById("repo-" + tabName);
        if (target) target.style.display = "block";
        if (btn) btn.classList.add("active");
    };

    // Mental Math Game Logic
    let mathScoreVal = 0;
    let mathAns = 12;

    window.nextMathQuestion = function() {
        const n1 = Math.floor(Math.random() * 9) + 2;
        const n2 = Math.floor(Math.random() * 9) + 2;
        mathAns = n1 + n2;
        document.getElementById("mathQNum1").textContent = n1;
        document.getElementById("mathQNum2").textContent = n2;

        const options = [mathAns, mathAns + 1, mathAns - 2, mathAns + 3].sort(() => Math.random() - 0.5);
        const container = document.getElementById("mathOptions");
        if (container) {
            container.innerHTML = "";
            options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "math-opt-btn";
                btn.textContent = opt;
                btn.onclick = () => checkMathAnswer(opt);
                container.appendChild(btn);
            });
        }
    };

    window.checkMathAnswer = function(chosen) {
        const feedback = document.getElementById("mathGameFeedback");
        if (chosen === mathAns) {
            mathScoreVal += 10;
            if (feedback) feedback.innerHTML = `<span style="color:#16a34a;"><i class="fa-solid fa-circle-check"></i> Correct! +10 Points! (Total: ${mathScoreVal})</span>`;
            setTimeout(nextMathQuestion, 1000);
        } else {
            if (feedback) feedback.innerHTML = `<span style="color:#dc2626;"><i class="fa-solid fa-circle-xmark"></i> Oops! Try again!</span>`;
        }
    };

    // Phonics Match Game Logic
    let phonicsScoreVal = 0;
    window.checkPhonicsAnswer = function(word) {
        const feedback = document.getElementById("phonicsFeedback");
        if (word === "Mango") {
            phonicsScoreVal += 1;
            document.getElementById("phonicsScore").textContent = phonicsScoreVal;
            if (feedback) feedback.innerHTML = `<span style="color:#16a34a;"><i class="fa-solid fa-star"></i> Perfect! /m/ sound matches Mango!</span>`;
        } else {
            if (feedback) feedback.innerHTML = `<span style="color:#dc2626;">Not quite! Try another picture!</span>`;
        }
    };

    window.nextPhonicsQuestion = function() {
        const letters = ["B", "C", "S", "T"];
        const rand = letters[Math.floor(Math.random() * letters.length)];
        const el = document.getElementById("phonicsLetter");
        if (el) el.textContent = rand;
        const feedback = document.getElementById("phonicsFeedback");
        if (feedback) feedback.innerHTML = `Sound streak: <strong>${phonicsScoreVal}</strong>`;
    };

    // Science Curiosity Trivia
    window.checkScienceAnswer = function(isCorrect) {
        const feedback = document.getElementById("scienceFeedback");
        if (isCorrect) {
            if (feedback) feedback.innerHTML = `<span style="color:#16a34a;"><i class="fa-solid fa-circle-check"></i> Exactly! Sunlight & Water are essential for photosynthesis!</span>`;
        } else {
            if (feedback) feedback.innerHTML = `<span style="color:#dc2626;">Think about how green plants grow in soil!</span>`;
        }
    };

    // Storybook Modal
    window.openStoryModal = function(title, content) {
        const modal = document.getElementById("storyModal");
        if (modal) {
            document.getElementById("storyModalTitle").textContent = title;
            document.getElementById("storyModalContent").innerHTML = content;
            modal.style.display = "flex";
        }
    };

    window.closeStoryModal = function() {
        const modal = document.getElementById("storyModal");
        if (modal) modal.style.display = "none";
    };

    // -------------------------------------------------------------------------
    // 7. Coordinator Admin Dashboard (on admin.html)
    // -------------------------------------------------------------------------
    const adminTableBody = document.getElementById("adminTableBody");
    const statTotalCount = document.getElementById("statTotalCount");
    const statActiveCount = document.getElementById("statActiveCount");
    const tableRecordCount = document.getElementById("tableRecordCount");
    const adminSearchInput = document.getElementById("adminSearchInput");
    const adminSubjectFilter = document.getElementById("adminSubjectFilter");
    const exportCsvBtn = document.getElementById("exportCsvBtn");
    const clearAllDataBtn = document.getElementById("clearAllDataBtn");

    function renderAdminDashboard() {
        if (!adminTableBody) return;

        const allList = getRealVolunteers();
        const searchQuery = adminSearchInput ? adminSearchInput.value.toLowerCase().trim() : "";
        const filterSubject = adminSubjectFilter ? adminSubjectFilter.value.trim() : "";

        const filtered = allList.filter(item => {
            const matchesSearch = !searchQuery || 
                (item.name && item.name.toLowerCase().includes(searchQuery)) ||
                (item.phone && item.phone.toLowerCase().includes(searchQuery)) ||
                (item.email && item.email.toLowerCase().includes(searchQuery)) ||
                (item.center && item.center.toLowerCase().includes(searchQuery)) ||
                (item.address && item.address.toLowerCase().includes(searchQuery));

            const matchesSubject = !filterSubject || 
                (item.subject && item.subject.toLowerCase().includes(filterSubject.toLowerCase()));

            return matchesSearch && matchesSubject;
        });

        if (statTotalCount) statTotalCount.textContent = allList.length;
        if (statActiveCount) statActiveCount.textContent = allList.length;
        const tabTeacherBadge = document.getElementById("tabTeacherBadge");
        if (tabTeacherBadge) tabTeacherBadge.textContent = allList.length;
        if (tableRecordCount) {
            tableRecordCount.textContent = allList.length === 0 
                ? "No applications yet" 
                : `Showing ${filtered.length} of ${allList.length} application${allList.length > 1 ? 's' : ''}`;
        }

        adminTableBody.innerHTML = "";

        if (allList.length === 0) {
            adminTableBody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding: 50px 20px; color:#64748b;">
                        <i class="fa-solid fa-inbox" style="font-size:2.8rem; margin-bottom:14px; color:#cbd5e1; display:block;"></i>
                        <h4 style="color:#12304a; font-size:1.1rem; margin-bottom:6px;">No Volunteer Applications Yet</h4>
                        <p style="font-size:0.9rem; max-width:480px; margin:0 auto 18px;">When candidates submit their application via <a href="volunteer.html" style="color:#25617b; font-weight:bold; text-decoration:underline;">volunteer.html</a>, their real records will appear here live.</p>
                        <a href="volunteer.html" class="btn btn-warning btn-sm">
                            <i class="fa-solid fa-user-plus"></i> Open Registration Form to Test
                        </a>
                    </td>
                </tr>
            `;
            return;
        }

        if (filtered.length === 0) {
            adminTableBody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding: 35px; color:#64748b;">
                        <i class="fa-solid fa-magnifying-glass" style="font-size:2rem; margin-bottom:10px; color:#cbd5e1; display:block;"></i>
                        No applications matched your search.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach((vol, idx) => {
            const tr = document.createElement("tr");
            const daysText = Array.isArray(vol.days) ? vol.days.join(", ") : (vol.days || "All Days");
            const rawPhone = (vol.phone || "").replace(/\D/g, "");

            tr.innerHTML = `
                <td><strong>#${idx + 1}</strong></td>
                <td><small style="color:#64748b;">${escapeHtml(vol.date || "Recent")}</small></td>
                <td>
                    <strong style="color:#12304a; font-size:0.95rem;">${escapeHtml(vol.name)}</strong>
                </td>
                <td>
                    <div style="display:flex; flex-direction:column; gap:3px;">
                        <a href="tel:${escapeHtml(rawPhone)}" style="color:#25617b; font-weight:600; text-decoration:none;">
                            <i class="fa-solid fa-phone" style="font-size:11px;"></i> ${escapeHtml(vol.phone)}
                        </a>
                        <a href="mailto:${escapeHtml(vol.email)}" style="color:#64748b; font-size:12px; text-decoration:none;">
                            <i class="fa-solid fa-envelope" style="font-size:11px;"></i> ${escapeHtml(vol.email)}
                        </a>
                    </div>
                </td>
                <td>
                    <span class="badge-subject">${escapeHtml(vol.subject)}</span>
                </td>
                <td><small>${escapeHtml(vol.center || "Center 01")}</small></td>
                <td><span style="font-size:12px; color:#334155;">${escapeHtml(daysText)}</span></td>
                <td><small>${escapeHtml(vol.time)}</small></td>
                <td><small style="max-width:180px; display:block; color:#475569;">${escapeHtml(vol.address)}</small></td>
                <td>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <a href="https://wa.me/91${rawPhone}?text=Hello%20${encodeURIComponent(vol.name)}%2C%20greetings%20from%20Slum%20Literacy%20Drive!" 
                           target="_blank" 
                           class="btn-action-icon btn-whatsapp" 
                           title="Chat on WhatsApp">
                            <i class="fa-brands fa-whatsapp"></i>
                        </a>
                        <button class="btn-action-icon btn-delete" data-id="${vol.id}" title="Delete Application">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            adminTableBody.appendChild(tr);
        });

        adminTableBody.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", function () {
                const idToDelete = this.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this volunteer application?")) {
                    const current = getRealVolunteers().filter(item => String(item.id) !== String(idToDelete));
                    saveRealVolunteers(current);
                    renderAdminDashboard();
                }
            });
        });
    }

    if (adminSearchInput) {
        adminSearchInput.addEventListener("input", renderAdminDashboard);
    }
    if (adminSubjectFilter) {
        adminSubjectFilter.addEventListener("change", renderAdminDashboard);
    }

    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener("click", function () {
            if (confirm("Are you sure you want to clear all registrations?")) {
                saveRealVolunteers([]);
                renderAdminDashboard();
            }
        });
    }

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", function () {
            const list = getRealVolunteers();
            if (list.length === 0) {
                alert("No volunteer registrations found to export. Please submit an application on volunteer.html first.");
                return;
            }

            const headers = ["Serial No", "Registration Date", "Full Name", "Mobile Number", "Email Address", "Teaching Subject", "Assigned Center", "Available Days", "Shift Timing", "Address", "Status"];

            const rows = list.map((item, index) => [
                index + 1,
                item.date || "N/A",
                item.name || "N/A",
                item.phone || "N/A",
                item.email || "N/A",
                item.subject || "N/A",
                item.center || "N/A",
                Array.isArray(item.days) ? item.days.join("; ") : (item.days || "N/A"),
                item.time || "N/A",
                item.address ? item.address.replace(/"/g, '""') : "N/A",
                item.status || "Active"
            ]);

            let csvContent = headers.map(h => `"${h}"`).join(",") + "\n";
            rows.forEach(row => {
                csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
            });

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.setAttribute("href", url);
            downloadLink.setAttribute("download", `Slum_Literacy_Registered_Teachers_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }

    // -------------------------------------------------------------------------
    // 7B. Student Admissions & Approvals Management (on admin.html)
    // -------------------------------------------------------------------------
    const admissionsTableBody = document.getElementById("admissionsTableBody");
    const statAdmissionTotal = document.getElementById("statAdmissionTotal");
    const statAdmissionPending = document.getElementById("statAdmissionPending");
    const statAdmissionApproved = document.getElementById("statAdmissionApproved");
    const tabAdmissionBadge = document.getElementById("tabAdmissionBadge");
    const admissionsRecordCount = document.getElementById("admissionsRecordCount");
    const admissionSearchInput = document.getElementById("admissionSearchInput");
    const admissionStatusFilter = document.getElementById("admissionStatusFilter");
    const admissionCenterFilter = document.getElementById("admissionCenterFilter");
    const exportAdmissionsCsvBtn = document.getElementById("exportAdmissionsCsvBtn");
    const clearAllAdmissionsBtn = document.getElementById("clearAllAdmissionsBtn");

    function renderAdmissionsDashboard() {
        if (!admissionsTableBody) return;

        const admissions = getChildAdmissions();

        const pendingCount = admissions.filter(a => a.status === "Pending Approval").length;
        const approvedCount = admissions.filter(a => a.status === "Admitted & Enrolled").length;

        if (statAdmissionTotal) statAdmissionTotal.textContent = admissions.length;
        if (statAdmissionPending) statAdmissionPending.textContent = pendingCount;
        if (statAdmissionApproved) statAdmissionApproved.textContent = approvedCount;
        if (tabAdmissionBadge) tabAdmissionBadge.textContent = pendingCount;

        const query = admissionSearchInput ? admissionSearchInput.value.toLowerCase().trim() : "";
        const statusVal = admissionStatusFilter ? admissionStatusFilter.value : "";
        const centerVal = admissionCenterFilter ? admissionCenterFilter.value : "";

        const filtered = admissions.filter(item => {
            const matchesQuery = !query ||
                (item.childFullName && item.childFullName.toLowerCase().includes(query)) ||
                (item.guardianName && item.guardianName.toLowerCase().includes(query)) ||
                (item.guardianPhone && item.guardianPhone.includes(query)) ||
                (item.appId && item.appId.toLowerCase().includes(query)) ||
                (item.childSubject && item.childSubject.toLowerCase().includes(query)) ||
                (item.childCenter && item.childCenter.toLowerCase().includes(query));

            const matchesStatus = !statusVal || item.status === statusVal;
            const matchesCenter = !centerVal || item.childCenter === centerVal;

            return matchesQuery && matchesStatus && matchesCenter;
        });

        if (admissionsRecordCount) {
            admissionsRecordCount.textContent = `${filtered.length} Application${filtered.length === 1 ? '' : 's'}`;
        }

        if (admissions.length === 0) {
            admissionsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 48px 20px; color: #64748b;">
                        <div style="font-size: 3rem; margin-bottom: 12px; color: #94a3b8;"><i class="fa-solid fa-child-reaching"></i></div>
                        <h3 style="font-size: 1.15rem; color: #1e293b; margin-bottom: 6px;">Zero Child Admissions In Database</h3>
                        <p style="font-size: 0.9rem; max-width: 500px; margin: 0 auto 16px auto; line-height: 1.5;">
                            No child admission applications have been submitted yet. Parents or field workers can register children via the public admission form.
                        </p>
                        <a href="enroll.html" target="_blank" class="btn btn-warning btn-sm" style="font-weight:700;">
                            <i class="fa-solid fa-user-plus"></i> Open Child Admission Form (enroll.html)
                        </a>
                    </td>
                </tr>
            `;
            return;
        }

        if (filtered.length === 0) {
            admissionsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 32px 20px; color: #64748b;">
                        <i class="fa-solid fa-filter-circle-xmark" style="font-size: 2rem; margin-bottom: 8px; color: #94a3b8; display:block;"></i>
                        <strong>No admissions match your search filter.</strong>
                    </td>
                </tr>
            `;
            return;
        }

        admissionsTableBody.innerHTML = filtered.map(item => {
            const isApproved = item.status === "Admitted & Enrolled";
            const cleanPhone = String(item.guardianPhone || "").replace(/\D/g, "");

            return `
                <tr>
                    <td>
                        <strong style="color:#25617b; font-size:13px; font-family:monospace;">${escapeHtml(item.appId)}</strong>
                        <div style="font-size:11px; color:#64748b; margin-top:2px;">
                            <i class="fa-regular fa-clock"></i> ${escapeHtml(item.appliedDate || "Recent")}
                        </div>
                    </td>
                    <td>
                        <strong style="color:#0f172a; font-size:14px;">${escapeHtml(item.childFullName)}</strong>
                        <div style="font-size:12px; color:#475569; margin-top:2px;">
                            <span class="badge-pill" style="font-size:10.5px; padding:2px 6px; background:#f1f5f9; color:#475569;">
                                ${escapeHtml(item.childGender || "Child")}
                            </span>
                            • ${escapeHtml(item.childAge)}
                        </div>
                    </td>
                    <td>
                        <div style="font-size:12.5px; font-weight:600; color:#1e293b;">${escapeHtml(item.childCenter)}</div>
                        <div style="font-size:11px; color:#059669; margin-top:2px;">
                            <i class="fa-regular fa-clock"></i> Evening Shift (4 PM – 7 PM)
                        </div>
                    </td>
                    <td>
                        <div style="font-size:12.5px; font-weight:700; color:#25617b;">${escapeHtml(item.childSubject)}</div>
                        <div style="font-size:11px; color:#64748b; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(item.childSchoolStatus)}">
                            ${escapeHtml(item.childSchoolStatus || "Not specified")}
                        </div>
                    </td>
                    <td>
                        <div style="font-weight:600; color:#1e293b; font-size:13px;">${escapeHtml(item.guardianName)}</div>
                        <div style="font-size:11px; color:#64748b;">${escapeHtml(item.guardianOccupation || "Daily Earner")}</div>
                        <div style="margin-top:4px; display:flex; gap:6px; align-items:center;">
                            <a href="tel:${escapeHtml(cleanPhone)}" style="font-size:11px; color:#0284c7; text-decoration:none; font-weight:600;">
                                <i class="fa-solid fa-phone"></i> +91 ${escapeHtml(cleanPhone)}
                            </a>
                            <a href="https://wa.me/91${escapeHtml(cleanPhone)}?text=Hello%20${encodeURIComponent(item.guardianName)}%2C%20regarding%20admission%20of%20${encodeURIComponent(item.childFullName)}%20at%20Slum%20Literacy%20Drive..." target="_blank" style="color:#10b981; font-size:12px;" title="Chat on WhatsApp">
                                <i class="fa-brands fa-whatsapp"></i>
                            </a>
                        </div>
                    </td>
                    <td>
                        ${isApproved ? `
                            <span class="status-tag" style="background:#ecfdf5; color:#059669; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px; padding:4px 8px; border-radius:6px;">
                                <i class="fa-solid fa-circle-check"></i> Admitted
                            </span>
                            <div style="font-size:11px; font-weight:700; color:#065f46; margin-top:4px; font-family:monospace;">
                                ${escapeHtml(item.assignedStudentId || "")}
                            </div>
                        ` : `
                            <span class="status-tag" style="background:#fef3c7; color:#b45309; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px; padding:4px 8px; border-radius:6px;">
                                <i class="fa-solid fa-hourglass-half"></i> Pending Review
                            </span>
                        `}
                    </td>
                    <td>
                        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                            ${!isApproved ? `
                                <button class="btn btn-primary btn-sm" onclick="approveChildAdmission('${item.appId}')" style="background:#10b981; border-color:#059669; font-size:12px; padding:6px 10px; font-weight:700;" title="Confirm admission and assign Student ID">
                                    <i class="fa-solid fa-check"></i> Approve & Admit
                                </button>
                                <button class="btn btn-outline-sm" onclick="deleteChildAdmission('${item.appId}')" style="color:#ef4444; border-color:#fca5a5; font-size:12px; padding:6px 8px;" title="Reject and remove application">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            ` : `
                                <a href="report.html" class="btn btn-secondary btn-sm" style="font-size:11px; padding:5px 8px; font-weight:600;" title="View Parent Progress Report">
                                    <i class="fa-solid fa-file-invoice"></i> Progress Card
                                </a>
                                <button class="btn btn-outline-sm" onclick="deleteChildAdmission('${item.appId}')" style="color:#94a3b8; border-color:#e2e8f0; font-size:11px; padding:5px 7px;" title="Remove Application Record">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            `}
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    window.approveChildAdmission = function(appId) {
        const admissions = getChildAdmissions();
        const appIndex = admissions.findIndex(a => a.appId === appId);
        if (appIndex === -1) {
            alert("Application not found.");
            return;
        }

        const app = admissions[appIndex];
        if (app.status === "Admitted & Enrolled") {
            alert(`This child has already been admitted with Student ID: ${app.assignedStudentId}`);
            return;
        }

        // Fetch roster and generate next official Student ID STU-xxx
        const roster = getStudentRoster();
        const nextNum = (roster.length > 0)
            ? Math.max(...roster.map(s => parseInt(String(s.id || "").replace("STU-", "")) || 0)) + 1
            : 1;
        const studentId = "STU-" + String(nextNum).padStart(3, "0");

        const newStudent = {
            id: studentId,
            name: app.childFullName,
            age: app.childAge,
            gender: app.childGender || "Child",
            subject: app.childSubject,
            center: app.childCenter,
            phone: app.guardianPhone,
            guardianName: app.guardianName,
            guardianOccupation: app.guardianOccupation || "Daily Earner",
            schoolStatus: app.childSchoolStatus,
            address: app.childAddress,
            enrollDate: new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }),
            appId: app.appId
        };

        // Add to active student roster
        roster.push(newStudent);
        saveStudentRoster(roster);

        // Update application status
        app.status = "Admitted & Enrolled";
        app.assignedStudentId = studentId;
        app.approvedDate = new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' });
        saveChildAdmissions(admissions);

        // Auto-refresh admissions and attendance views
        renderAdmissionsDashboard();
        renderAttendanceTable();

        alert(`🎉 Child Successfully Admitted!\n\nChild Name: ${app.childFullName}\nAssigned Student ID: ${studentId}\nAssigned Center: ${app.childCenter}\nGuardian Mobile: +91 ${app.guardianPhone}\n\n✅ This student is now permanently enrolled in the active roster!\nYou can mark their daily attendance in Tab 3 (Attendance Logger) and view their report card in the Parent Progress Portal.`);
    };

    window.deleteChildAdmission = function(appId) {
        if (!confirm(`Are you sure you want to delete application ${appId}?`)) return;
        const admissions = getChildAdmissions().filter(a => a.appId !== appId);
        saveChildAdmissions(admissions);
        renderAdmissionsDashboard();
    };

    if (admissionSearchInput) admissionSearchInput.addEventListener("input", renderAdmissionsDashboard);
    if (admissionStatusFilter) admissionStatusFilter.addEventListener("change", renderAdmissionsDashboard);
    if (admissionCenterFilter) admissionCenterFilter.addEventListener("change", renderAdmissionsDashboard);

    if (exportAdmissionsCsvBtn) {
        exportAdmissionsCsvBtn.addEventListener("click", function () {
            const list = getChildAdmissions();
            if (list.length === 0) {
                alert("No child admission applications found to export. Please register a student on enroll.html first.");
                return;
            }

            const headers = [
                "Application ID",
                "Applied Date",
                "Child Full Name",
                "Age / Grade",
                "Gender",
                "Preferred Center",
                "Primary Subject",
                "Schooling Background",
                "Guardian Name",
                "Guardian Occupation",
                "Guardian Mobile Phone",
                "Slum Locality / Address",
                "Admission Status",
                "Assigned Student ID"
            ];

            const rows = list.map(item => [
                item.appId || "N/A",
                item.appliedDate || "N/A",
                item.childFullName || "N/A",
                item.childAge || "N/A",
                item.childGender || "N/A",
                item.childCenter || "N/A",
                item.childSubject || "N/A",
                item.childSchoolStatus || "N/A",
                item.guardianName || "N/A",
                item.guardianOccupation || "N/A",
                item.guardianPhone || "N/A",
                item.childAddress ? String(item.childAddress).replace(/"/g, '""') : "N/A",
                item.status || "Pending Approval",
                item.assignedStudentId || "Not Assigned"
            ]);

            let csvContent = headers.map(h => `"${h}"`).join(",") + "\n";
            rows.forEach(row => {
                csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
            });

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.setAttribute("href", url);
            downloadLink.setAttribute("download", `Slum_Literacy_Child_Admissions_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }

    if (clearAllAdmissionsBtn) {
        clearAllAdmissionsBtn.addEventListener("click", function() {
            if (confirm("Are you sure you want to clear all child admission records? This cannot be undone.")) {
                saveChildAdmissions([]);
                renderAdmissionsDashboard();
            }
        });
    }

    renderAdminDashboard();
    renderAdmissionsDashboard();

    // Admin Dashboard Master Switcher (Teachers vs Admissions vs Attendance)
    window.switchAdminTab = function(tabName) {
        const paneTeachers = document.getElementById("paneTeachers");
        const paneAdmissions = document.getElementById("paneAdmissions");
        const paneAttendance = document.getElementById("paneAttendance");
        const tabBtnTeachers = document.getElementById("tabBtnTeachers");
        const tabBtnAdmissions = document.getElementById("tabBtnAdmissions");
        const tabBtnAttendance = document.getElementById("tabBtnAttendance");

        // Remove active from all panes
        if (paneTeachers) paneTeachers.classList.remove("active");
        if (paneAdmissions) paneAdmissions.classList.remove("active");
        if (paneAttendance) paneAttendance.classList.remove("active");

        // Remove active from all buttons
        if (tabBtnTeachers) tabBtnTeachers.classList.remove("active");
        if (tabBtnAdmissions) tabBtnAdmissions.classList.remove("active");
        if (tabBtnAttendance) tabBtnAttendance.classList.remove("active");

        if (tabName === "admissions") {
            if (paneAdmissions) paneAdmissions.classList.add("active");
            if (tabBtnAdmissions) tabBtnAdmissions.classList.add("active");
            renderAdmissionsDashboard();
        } else if (tabName === "attendance") {
            if (paneAttendance) paneAttendance.classList.add("active");
            if (tabBtnAttendance) tabBtnAttendance.classList.add("active");
            renderAttendanceTable();
            renderAttendanceHistory();
        } else {
            if (paneTeachers) paneTeachers.classList.add("active");
            if (tabBtnTeachers) tabBtnTeachers.classList.add("active");
            renderAdminDashboard();
        }
    };

    if (window.location.hash === "#attendance") {
        window.switchAdminTab("attendance");
    } else if (window.location.hash === "#admissions") {
        window.switchAdminTab("admissions");
    }

    // -------------------------------------------------------------------------
    // 8. Module 5: Student Progress Report & Parent Portal (on report.html)
    // -------------------------------------------------------------------------
    const reportStudentSelect = document.getElementById("reportStudentSelect");
    const reportSearchInput = document.getElementById("reportSearchInput");
    const printReportCardBtn = document.getElementById("printReportCardBtn");
    const whatsappShareBtn = document.getElementById("whatsappShareBtn");
    const quickStudentPillsContainer = document.getElementById("quickStudentPillsContainer");

    if (reportStudentSelect) {
        const roster = getStudentRoster();

        function renderEmptyReportCard() {
            const cardStudentId = document.getElementById("cardStudentId");
            const cardStudentName = document.getElementById("cardStudentName");
            const cardStudentAge = document.getElementById("cardStudentAge");
            const cardStudentCenter = document.getElementById("cardStudentCenter");
            const cardStudentSubject = document.getElementById("cardStudentSubject");
            const cardGuardianPhone = document.getElementById("cardGuardianPhone");

            if (cardStudentId) cardStudentId.textContent = "STU-000";
            if (cardStudentName) cardStudentName.textContent = "No Student Enrolled Yet";
            if (cardStudentAge) cardStudentAge.textContent = "—";
            if (cardStudentCenter) cardStudentCenter.textContent = "Please enroll a student in Admin Portal";
            if (cardStudentSubject) cardStudentSubject.textContent = "—";
            if (cardGuardianPhone) cardGuardianPhone.textContent = "—";

            const cardAttendanceRate = document.getElementById("cardAttendanceRate");
            const cardAttendanceBadge = document.getElementById("cardAttendanceBadge");
            const cardAttendanceDesc = document.getElementById("cardAttendanceDesc");

            if (cardAttendanceRate) cardAttendanceRate.textContent = "0%";
            if (cardAttendanceDesc) cardAttendanceDesc.textContent = "No attendance sessions logged yet";
            if (cardAttendanceBadge) {
                cardAttendanceBadge.style.background = "#f1f5f9";
                cardAttendanceBadge.style.color = "#64748b";
                cardAttendanceBadge.textContent = "Awaiting Data";
            }

            const cardTier1Score = document.getElementById("cardTier1Score");
            const cardTier1Bar = document.getElementById("cardTier1Bar");
            const cardTier1Status = document.getElementById("cardTier1Status");
            if (cardTier1Score) cardTier1Score.textContent = "0%";
            if (cardTier1Bar) cardTier1Bar.style.width = "0%";
            if (cardTier1Status) {
                cardTier1Status.textContent = "Not Assessed";
                cardTier1Status.style.background = "#f1f5f9";
                cardTier1Status.style.color = "#64748b";
            }

            const cardTier2Score = document.getElementById("cardTier2Score");
            const cardTier2Bar = document.getElementById("cardTier2Bar");
            const cardTier2Status = document.getElementById("cardTier2Status");
            if (cardTier2Score) cardTier2Score.textContent = "0%";
            if (cardTier2Bar) cardTier2Bar.style.width = "0%";
            if (cardTier2Status) {
                cardTier2Status.textContent = "Not Assessed";
                cardTier2Status.style.background = "#f1f5f9";
                cardTier2Status.style.color = "#64748b";
            }

            const cardTier3Score = document.getElementById("cardTier3Score");
            const cardTier3Bar = document.getElementById("cardTier3Bar");
            const cardTier3Status = document.getElementById("cardTier3Status");
            if (cardTier3Score) cardTier3Score.textContent = "0%";
            if (cardTier3Bar) cardTier3Bar.style.width = "0%";
            if (cardTier3Status) {
                cardTier3Status.textContent = "Not Assessed";
                cardTier3Status.style.background = "#f1f5f9";
                cardTier3Status.style.color = "#64748b";
            }

            const cardCompositeScore = document.getElementById("cardCompositeScore");
            const cardCompositeGrade = document.getElementById("cardCompositeGrade");
            const cardCompositeDesc = document.getElementById("cardCompositeDesc");
            const cardMilestoneTitle = document.getElementById("cardMilestoneTitle");
            const cardMentorFeedback = document.getElementById("cardMentorFeedback");

            if (cardCompositeScore) cardCompositeScore.textContent = "0%";
            if (cardCompositeGrade) {
                cardCompositeGrade.textContent = "Awaiting Enrollment";
                cardCompositeGrade.style.background = "#f1f5f9";
                cardCompositeGrade.style.color = "#64748b";
            }
            if (cardMilestoneTitle) cardMilestoneTitle.textContent = "No Enrolled Child";
            if (cardCompositeDesc) cardCompositeDesc.textContent = "Enroll students via Admin portal to generate official report card";
            if (cardMentorFeedback) cardMentorFeedback.textContent = `"Please enroll authentic students in the Admin portal. Once enrolled, their real attendance and diagnostic progress reports will appear here automatically."`;
        }

        // If no students enrolled in system
        if (roster.length === 0) {
            reportStudentSelect.innerHTML = '<option value="">-- No Enrolled Students in System Yet --</option>';
            if (quickStudentPillsContainer) {
                quickStudentPillsContainer.innerHTML = '<span style="font-size: 13px; color: #64748b; font-style: italic;"><i class="fa-solid fa-circle-info"></i> No students enrolled yet. Please enroll students via the Admin / Attendance portal first.</span>';
            }
            renderEmptyReportCard();
        } else {
            // Populate Dropdown
            reportStudentSelect.innerHTML = "";
            roster.forEach(stu => {
                const opt = document.createElement("option");
                opt.value = stu.id;
                opt.textContent = `${stu.name} (${stu.id} - ${stu.center})`;
                reportStudentSelect.appendChild(opt);
            });

            // Populate Quick Pills
            if (quickStudentPillsContainer) {
                quickStudentPillsContainer.innerHTML = '<span style="font-size: 12px; font-weight: 700; color: #64748b; margin-right: 6px;"><i class="fa-solid fa-bolt"></i> Quick Select:</span>';
                roster.slice(0, 6).forEach((stu, idx) => {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = `student-pill-btn ${idx === 0 ? 'active' : ''}`;
                    btn.textContent = stu.name.split(" ")[0];
                    btn.title = `${stu.name} (${stu.id})`;
                    btn.onclick = () => {
                        reportStudentSelect.value = stu.id;
                        updateActivePill(stu.id);
                        renderStudentReport(stu.id);
                    };
                    quickStudentPillsContainer.appendChild(btn);
                });
            }
        }

        function updateActivePill(studentId) {
            if (!quickStudentPillsContainer) return;
            const currentRoster = getStudentRoster();
            const targetStu = currentRoster.find(s => s.id === studentId);
            const targetName = targetStu ? targetStu.name.split(" ")[0] : "";
            quickStudentPillsContainer.querySelectorAll(".student-pill-btn").forEach(b => {
                if (b.textContent === targetName) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });
        }

        function renderStudentReport(studentId) {
            const currentRoster = getStudentRoster();
            if (currentRoster.length === 0) {
                renderEmptyReportCard();
                return;
            }

            const student = currentRoster.find(s => s.id === studentId) || currentRoster[0];
            if (!student) {
                renderEmptyReportCard();
                return;
            }

            // Student Bio
            const cardStudentId = document.getElementById("cardStudentId");
            const cardStudentName = document.getElementById("cardStudentName");
            const cardStudentAge = document.getElementById("cardStudentAge");
            const cardStudentCenter = document.getElementById("cardStudentCenter");
            const cardStudentSubject = document.getElementById("cardStudentSubject");
            const cardGuardianPhone = document.getElementById("cardGuardianPhone");

            if (cardStudentId) cardStudentId.textContent = student.id;
            if (cardStudentName) cardStudentName.textContent = student.name;
            if (cardStudentAge) cardStudentAge.textContent = student.age || "—";
            if (cardStudentCenter) cardStudentCenter.textContent = student.center;
            if (cardStudentSubject) cardStudentSubject.textContent = student.subject || "Foundational Literacy & Numeracy";
            if (cardGuardianPhone) cardGuardianPhone.textContent = student.phone || "—";

            // Calculate Attendance Rate for this student across all logged dates
            const allRecords = getAllAttendanceRecords();
            let totalSessions = 0;
            let attendedSessions = 0;

            Object.keys(allRecords).forEach(date => {
                const dayMap = allRecords[date];
                if (dayMap && dayMap[student.id]) {
                    totalSessions++;
                    if (dayMap[student.id].present) {
                        attendedSessions++;
                    }
                }
            });

            let attRate = 0;
            let attDesc = "";

            if (totalSessions > 0) {
                attRate = Math.round((attendedSessions / totalSessions) * 100);
                attDesc = `Present in ${attendedSessions} out of ${totalSessions} recorded sessions`;
            } else {
                attRate = 100;
                attDesc = `Newly enrolled student • 1st day record`;
            }

            const cardAttendanceRate = document.getElementById("cardAttendanceRate");
            const cardAttendanceBadge = document.getElementById("cardAttendanceBadge");
            const cardAttendanceDesc = document.getElementById("cardAttendanceDesc");

            if (cardAttendanceRate) cardAttendanceRate.textContent = attRate + "%";
            if (cardAttendanceDesc) cardAttendanceDesc.textContent = attDesc;
            if (cardAttendanceBadge) {
                if (attRate >= 80) {
                    cardAttendanceBadge.style.background = "#dcfce7";
                    cardAttendanceBadge.style.color = "#15803d";
                    cardAttendanceBadge.textContent = "Highly Regular";
                } else if (attRate >= 50) {
                    cardAttendanceBadge.style.background = "#fef3c7";
                    cardAttendanceBadge.style.color = "#b45309";
                    cardAttendanceBadge.textContent = "Moderate Attendance";
                } else {
                    cardAttendanceBadge.style.background = "#fee2e2";
                    cardAttendanceBadge.style.color = "#b91c1c";
                    cardAttendanceBadge.textContent = "Irregular (Follow-up)";
                }
            }

            // Diagnostic Marks (Module 2 Connection)
            const currentDiagnostics = getDiagnosticRecords();
            const diagRecord = currentDiagnostics.find(d => d.name.toLowerCase() === student.name.toLowerCase());

            let t1 = 0;
            let t2 = 0;
            let t3 = 0;
            let evaluator = "Siddharth Kumar (Coordinator)";
            let isAssessed = false;

            if (diagRecord) {
                t1 = diagRecord.t1;
                t2 = diagRecord.t2;
                t3 = diagRecord.t3;
                evaluator = diagRecord.evaluator || evaluator;
                isAssessed = true;
            }

            const composite = isAssessed ? Math.round((t1 + t2 + t3) / 3) : 0;

            // Tier 1
            const cardTier1Score = document.getElementById("cardTier1Score");
            const cardTier1Bar = document.getElementById("cardTier1Bar");
            const cardTier1Status = document.getElementById("cardTier1Status");
            if (cardTier1Score) cardTier1Score.textContent = isAssessed ? (t1 + "%") : "Pending";
            if (cardTier1Bar) cardTier1Bar.style.width = isAssessed ? (t1 + "%") : "0%";
            if (cardTier1Status) {
                if (isAssessed) {
                    cardTier1Status.textContent = t1 >= 75 ? "Proficient" : (t1 >= 50 ? "Intermediate" : "Emerging");
                    cardTier1Status.style.background = t1 >= 75 ? "#dcfce7" : (t1 >= 50 ? "#fef3c7" : "#fee2e2");
                    cardTier1Status.style.color = t1 >= 75 ? "#15803d" : (t1 >= 50 ? "#b45309" : "#b91c1c");
                } else {
                    cardTier1Status.textContent = "Not Tested";
                    cardTier1Status.style.background = "#f1f5f9";
                    cardTier1Status.style.color = "#64748b";
                }
            }

            // Tier 2
            const cardTier2Score = document.getElementById("cardTier2Score");
            const cardTier2Bar = document.getElementById("cardTier2Bar");
            const cardTier2Status = document.getElementById("cardTier2Status");
            if (cardTier2Score) cardTier2Score.textContent = isAssessed ? (t2 + "%") : "Pending";
            if (cardTier2Bar) cardTier2Bar.style.width = isAssessed ? (t2 + "%") : "0%";
            if (cardTier2Status) {
                if (isAssessed) {
                    cardTier2Status.textContent = t2 >= 75 ? "Proficient" : (t2 >= 50 ? "Intermediate" : "Emerging");
                    cardTier2Status.style.background = t2 >= 75 ? "#dcfce7" : (t2 >= 50 ? "#fef3c7" : "#fee2e2");
                    cardTier2Status.style.color = t2 >= 75 ? "#15803d" : (t2 >= 50 ? "#b45309" : "#b91c1c");
                } else {
                    cardTier2Status.textContent = "Not Tested";
                    cardTier2Status.style.background = "#f1f5f9";
                    cardTier2Status.style.color = "#64748b";
                }
            }

            // Tier 3
            const cardTier3Score = document.getElementById("cardTier3Score");
            const cardTier3Bar = document.getElementById("cardTier3Bar");
            const cardTier3Status = document.getElementById("cardTier3Status");
            if (cardTier3Score) cardTier3Score.textContent = isAssessed ? (t3 + "%") : "Pending";
            if (cardTier3Bar) cardTier3Bar.style.width = isAssessed ? (t3 + "%") : "0%";
            if (cardTier3Status) {
                if (isAssessed) {
                    cardTier3Status.textContent = t3 >= 75 ? "Proficient" : (t3 >= 50 ? "Intermediate" : "Emerging");
                    cardTier3Status.style.background = t3 >= 75 ? "#dcfce7" : (t3 >= 50 ? "#fef3c7" : "#fee2e2");
                    cardTier3Status.style.color = t3 >= 75 ? "#15803d" : (t3 >= 50 ? "#b45309" : "#b91c1c");
                } else {
                    cardTier3Status.textContent = "Not Tested";
                    cardTier3Status.style.background = "#f1f5f9";
                    cardTier3Status.style.color = "#64748b";
                }
            }

            // Composite Highlights
            const cardCompositeScore = document.getElementById("cardCompositeScore");
            const cardCompositeGrade = document.getElementById("cardCompositeGrade");
            const cardCompositeDesc = document.getElementById("cardCompositeDesc");
            const cardMilestoneTitle = document.getElementById("cardMilestoneTitle");
            const cardMentorName = document.getElementById("cardMentorName");
            const cardMentorFeedback = document.getElementById("cardMentorFeedback");

            if (cardCompositeScore) cardCompositeScore.textContent = isAssessed ? (composite + "%") : "Pending";
            if (cardMentorName) cardMentorName.textContent = evaluator;

            if (cardCompositeGrade) {
                if (isAssessed) {
                    if (composite >= 80) {
                        cardCompositeGrade.textContent = "Grade A (Advanced)";
                        cardCompositeGrade.style.background = "#dcfce7";
                        cardCompositeGrade.style.color = "#15803d";
                        if (cardMilestoneTitle) cardMilestoneTitle.textContent = "Ready For Formal School";
                        if (cardCompositeDesc) cardCompositeDesc.textContent = "Mastered foundational literacy & math curriculum";
                    } else if (composite >= 60) {
                        cardCompositeGrade.textContent = "Grade B+ (Intermediate)";
                        cardCompositeGrade.style.background = "#eff6ff";
                        cardCompositeGrade.style.color = "#1d4ed8";
                        if (cardMilestoneTitle) cardMilestoneTitle.textContent = "Progressing Well";
                        if (cardCompositeDesc) cardCompositeDesc.textContent = "Strong oral phonics and daily numeracy progress";
                    } else {
                        cardCompositeGrade.textContent = "Grade C (Foundational)";
                        cardCompositeGrade.style.background = "#fef3c7";
                        cardCompositeGrade.style.color = "#b45309";
                        if (cardMilestoneTitle) cardMilestoneTitle.textContent = "Remedial Coaching Active";
                        if (cardCompositeDesc) cardCompositeDesc.textContent = "Receiving dedicated 1-on-1 volunteer support";
                    }
                } else {
                    cardCompositeGrade.textContent = "Awaiting Diagnostic Test";
                    cardCompositeGrade.style.background = "#f1f5f9";
                    cardCompositeGrade.style.color = "#64748b";
                    if (cardMilestoneTitle) cardMilestoneTitle.textContent = "Enrolled Student";
                    if (cardCompositeDesc) cardCompositeDesc.textContent = "Evaluate child skills in Diagnostic Tracker to update marks";
                }
            }

            // Customized Feedback Quote
            if (cardMentorFeedback) {
                cardMentorFeedback.textContent = `"${student.name} is enrolled at ${student.center}. Current attendance is ${attRate}%. ${isAssessed ? `Composite diagnostic score is ${composite}%. Demonstrates respectful behavior toward teachers.` : 'Diagnostic assessment pending in Module 2.'}"`;
            }

            // WhatsApp Share link
            if (whatsappShareBtn) {
                const rawPhone = (student.phone || "").replace(/\D/g, "");
                const msg = `Dear Parent, here is the Official Progress Report for *${student.name}* at Slum Literacy Drive (${student.center}):\n- Attendance Rate: *${attRate}%*\n- Diagnostic Status: ${isAssessed ? `Alphabet (${t1}%), Reading (${t2}%), Math (${t3}%) • Grade: ${composite}%` : 'Assessment in progress'}\nThank you for supporting your child's education!`;
                whatsappShareBtn.onclick = () => {
                    const waUrl = `https://wa.me/91${rawPhone}?text=${encodeURIComponent(msg)}`;
                    window.open(waUrl, "_blank");
                };
            }
        }

        reportStudentSelect.addEventListener("change", function() {
            updateActivePill(this.value);
            renderStudentReport(this.value);
        });

        if (reportSearchInput) {
            reportSearchInput.addEventListener("input", function() {
                const q = this.value.toLowerCase().trim();
                if (!q) return;
                const currentRoster = getStudentRoster();
                const found = currentRoster.find(s => 
                    s.name.toLowerCase().includes(q) || 
                    s.id.toLowerCase().includes(q) || 
                    (s.phone && s.phone.replace(/\D/g, "").includes(q))
                );
                if (found) {
                    reportStudentSelect.value = found.id;
                    updateActivePill(found.id);
                    renderStudentReport(found.id);
                }
            });
        }

        if (printReportCardBtn) {
            printReportCardBtn.addEventListener("click", () => {
                window.print();
            });
        }

        // Render initial view
        if (roster.length > 0) {
            renderStudentReport(roster[0].id);
        } else {
            renderEmptyReportCard();
        }
    }

});
