// Central Reactive Data Store & LocalStorage Manager for School Management System

(function () {
    const STORAGE_KEY = "APEX_SCHOOL_DATA_V5";
    const SESSION_KEY = "APEX_SCHOOL_SESSION_V5";

    class SchoolStore {
        constructor() {
            this.listeners = new Map();
            this.state = this.loadState();
            this.currentUser = this.loadSession() || {
                id: "superadmin-1",
                name: "SaaS Platform Master (Software Owner)",
                role: "superadmin",
                email: "owner@schoolederp.in",
                phone: "+91 99999 00000",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
            };
        }

        loadState() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (!parsed.schools || parsed.schools.length === 0) {
                        parsed.schools = JSON.parse(JSON.stringify(window.SEED_DATA.schools || []));
                        parsed.activeSchoolId = window.SEED_DATA.activeSchoolId || "sch-01";
                    }
                    if (!parsed.transportRoutes) parsed.transportRoutes = JSON.parse(JSON.stringify(window.SEED_DATA.transportRoutes || []));
                    if (!parsed.libraryBooks) parsed.libraryBooks = JSON.parse(JSON.stringify(window.SEED_DATA.libraryBooks || []));
                    if (!parsed.libraryLoans) parsed.libraryLoans = JSON.parse(JSON.stringify(window.SEED_DATA.libraryLoans || []));
                    if (!parsed.staffPayroll) parsed.staffPayroll = JSON.parse(JSON.stringify(window.SEED_DATA.staffPayroll || []));
                    if (!parsed.staffLeaves) parsed.staffLeaves = JSON.parse(JSON.stringify(window.SEED_DATA.staffLeaves || { balances: {}, requests: [] }));
                    this.saveState(parsed);
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to load data from localStorage", e);
            }
            // Clone seed data as default
            const initial = JSON.parse(JSON.stringify(window.SEED_DATA));
            this.saveState(initial);
            return initial;
        }

        saveState(state = this.state) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                this.state = state;
            } catch (e) {
                console.error("Failed to save state to localStorage", e);
            }
        }

        loadSession() {
            try {
                const stored = localStorage.getItem(SESSION_KEY);
                if (stored) return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to load session", e);
            }
            return null;
        }

        saveSession(user) {
            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(user));
                this.currentUser = user;
                this.emit("auth:change", user);
            } catch (e) {
                console.error("Failed to save session", e);
            }
        }

        // Pub/Sub
        subscribe(event, callback) {
            if (!this.listeners.has(event)) {
                this.listeners.set(event, new Set());
            }
            this.listeners.get(event).add(callback);
            return () => this.listeners.get(event).delete(callback);
        }

        emit(event, data) {
            if (this.listeners.has(event)) {
                this.listeners.get(event).forEach(cb => {
                    try { cb(data); } catch (err) { console.error(err); }
                });
            }
            // General state change
            if (this.listeners.has("*")) {
                this.listeners.get("*").forEach(cb => {
                    try { cb({ event, data }); } catch (err) { console.error(err); }
                });
            }
        }

        // ================= AUTHENTICATION =================
        getCurrentUser() {
            return this.currentUser;
        }

        findUserByPhone(phoneInput) {
            if (!phoneInput) return null;
            const cleanInput = phoneInput.replace(/[^0-9]/g, '').slice(-10);
            if (!cleanInput || cleanInput.length < 5) return null;

            // 0. Check Super Admin (SaaS Software Owner)
            if (cleanInput === "9999900000" || cleanInput === "9999999999" || phoneInput.toLowerCase().includes("super") || phoneInput.toLowerCase().includes("saas")) {
                return {
                    user: {
                        id: "superadmin-1",
                        name: "SaaS Platform Master (Software Owner)",
                        role: "superadmin",
                        email: "owner@schoolederp.in",
                        phone: "+91 99999 00000",
                        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                    },
                    role: "superadmin",
                    roleName: "👑 SaaS Platform Master Authority",
                    label: "Commercial Software Creator & Multi-School Owner"
                };
            }

            // 1. Check Admin (Principal)
            const adminPhone = "9810011223";
            if (cleanInput === adminPhone || phoneInput.toLowerCase().includes("principal")) {
                return {
                    user: {
                        id: "admin-1",
                        name: "Dr. Meenakshi Sundaram (Principal)",
                        role: "admin",
                        email: "principal@apexhorizon.edu.in",
                        phone: "+91 98100 11223",
                        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
                    },
                    role: "admin",
                    roleName: "Institutional Administrator Portal",
                    label: "School Principal & Head of Institution"
                };
            }

            // 1.5 Check Accountant / Bursar / Cashier
            const accountantPhone = "9811833445";
            if (cleanInput === accountantPhone || phoneInput.toLowerCase().includes("account") || phoneInput.toLowerCase().includes("cashier") || phoneInput.toLowerCase().includes("bursar")) {
                return {
                    user: {
                        id: "acc-1",
                        name: "Manoj V. Agarwal (Senior Accounts Officer & Bursar)",
                        role: "accountant",
                        email: "accounts@apexhorizon.edu.in",
                        phone: "+91 98118 33445",
                        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256"
                    },
                    role: "accountant",
                    roleName: "School Accounts & Bursar Desk",
                    label: "Fee Collection Desk & Staff Payroll Officer"
                };
            }

            // 2. Check Teachers / Faculty
            const teachers = this.getTeachers();
            for (const t of teachers) {
                const tClean = (t.phone || "").replace(/[^0-9]/g, '').slice(-10);
                if (tClean && tClean === cleanInput) {
                    return {
                        user: {
                            id: t.id,
                            name: t.name,
                            role: "teacher",
                            email: t.email,
                            phone: t.phone,
                            teacherData: t,
                            avatar: t.avatar
                        },
                        role: "teacher",
                        roleName: "Teacher & Faculty Portal",
                        label: `${t.designation} (${t.name})`
                    };
                }
            }

            // 3. Check Parents / Guardians
            const parents = this.getParents();
            for (const p of parents) {
                const pClean = (p.phone || "").replace(/[^0-9]/g, '').slice(-10);
                if (pClean && pClean === cleanInput) {
                    return {
                        user: {
                            id: p.id,
                            name: p.name,
                            role: "parent",
                            email: p.email,
                            phone: p.phone,
                            parentData: p,
                            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
                        },
                        role: "parent",
                        roleName: "Parent & Guardian Portal",
                        label: `Parent of ${(p.studentIds && p.studentIds.length > 0) ? (this.getStudentById(p.studentIds[0]) ? this.getStudentById(p.studentIds[0]).name : 'Student') : 'Ward'}`
                    };
                }
            }

            // 4. Check Students
            const students = this.getStudents();
            for (const s of students) {
                const sClean = (s.phone || "").replace(/[^0-9]/g, '').slice(-10);
                if (sClean && sClean === cleanInput) {
                    return {
                        user: {
                            id: s.id,
                            name: s.name,
                            role: "student",
                            email: s.email,
                            phone: s.phone,
                            studentData: s,
                            avatar: s.avatar
                        },
                        role: "student",
                        roleName: "Student Learning Portal",
                        label: `Student (${s.name}, Roll #${s.rollNo})`
                    };
                }
            }

            return null;
        }

        loginWithMobile(phoneInput) {
            const result = this.findUserByPhone(phoneInput);
            if (!result) return null;
            this.saveSession(result.user);
            return result;
        }

        switchRole(role, specificEntityId = null) {
            let newUser = null;
            if (role === "superadmin") {
                newUser = {
                    id: "superadmin-1",
                    name: "SaaS Platform Master (Software Owner)",
                    role: "superadmin",
                    email: "owner@schoolederp.in",
                    phone: "+91 99999 00000",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                };
            } else if (role === "admin") {
                newUser = {
                    id: "admin-1",
                    name: "Dr. Meenakshi Sundaram (Principal)",
                    role: "admin",
                    email: "principal@apexhorizon.edu.in",
                    phone: "+91 98100 11223",
                    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
                };
            } else if (role === "accountant") {
                newUser = {
                    id: "acc-1",
                    name: "Manoj V. Agarwal (Senior Accounts Officer & Bursar)",
                    role: "accountant",
                    email: "accounts@apexhorizon.edu.in",
                    phone: "+91 98118 33445",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256"
                };
            } else if (role === "teacher") {
                const teacher = specificEntityId 
                    ? this.getTeacherById(specificEntityId) 
                    : this.state.teachers[0];
                newUser = {
                    id: teacher ? teacher.id : "tch-1",
                    name: teacher ? teacher.name : "Sunita Sharma",
                    role: "teacher",
                    email: teacher ? teacher.email : "s.sharma@apexhorizon.edu.in",
                    phone: teacher ? teacher.phone : "+91 98111 22334",
                    teacherData: teacher,
                    avatar: teacher ? teacher.avatar : ""
                };
            } else if (role === "student") {
                const student = specificEntityId 
                    ? this.getStudentById(specificEntityId) 
                    : this.state.students[0];
                newUser = {
                    id: student ? student.id : "stu-1",
                    name: student ? student.name : "Aarav Sharma",
                    role: "student",
                    email: student ? student.email : "aarav.sharma@student.apexhorizon.edu.in",
                    phone: student ? student.phone : "+91 98765 43210",
                    studentData: student,
                    avatar: student ? student.avatar : ""
                };
            } else if (role === "parent") {
                const parent = specificEntityId 
                    ? this.getParentById(specificEntityId) 
                    : this.state.parents[0];
                newUser = {
                    id: parent ? parent.id : "par-1",
                    name: parent ? parent.name : "Ramesh Sharma",
                    role: "parent",
                    email: parent ? parent.email : "ramesh.sharma@tcs.com",
                    phone: parent ? parent.phone : "+91 98111 55443",
                    parentData: parent,
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
                };
            }

            if (newUser) {
                this.saveSession(newUser);
            }
            return newUser;
        }

        // ================= MULTI-TENANT SAAS & FACILITY CONTROLS =================
        getAllSchools() {
            if (!this.state.schools || this.state.schools.length === 0) {
                this.state.schools = JSON.parse(JSON.stringify(window.SEED_DATA.schools || []));
                this.saveState();
            }
            return this.state.schools;
        }

        getActiveSchool() {
            const schools = this.getAllSchools();
            const activeId = this.state.activeSchoolId || (schools[0] ? schools[0].id : "sch-01");
            const found = schools.find(s => s.id === activeId);
            return found || schools[0] || this.state.school;
        }

        getSchool() {
            return this.getActiveSchool();
        }

        switchActiveSchool(schoolId) {
            const schools = this.getAllSchools();
            const school = schools.find(s => s.id === schoolId);
            if (school) {
                this.state.activeSchoolId = school.id;
                this.state.school = school;
                this.saveState();
                this.emit("school:updated", school);
                this.emit("state:changed", this.state);
                return school;
            }
            return null;
        }

        updateSchoolFacility(schoolId, facilityKey, isEnabled) {
            const schools = this.getAllSchools();
            const school = schools.find(s => s.id === schoolId);
            if (school) {
                if (!school.facilities) school.facilities = {};
                school.facilities[facilityKey] = Boolean(isEnabled);
                this.saveState();
                this.emit("school:facility:changed", { schoolId, facilityKey, isEnabled });
                this.emit("school:updated", school);
                return school;
            }
            return null;
        }

        updateSchoolSubscription(schoolId, subscriptionData) {
            const schools = this.getAllSchools();
            const school = schools.find(s => s.id === schoolId);
            if (school) {
                school.subscription = { ...school.subscription, ...subscriptionData };
                this.saveState();
                this.emit("school:subscription:changed", { schoolId, subscription: school.subscription });
                this.emit("school:updated", school);
                return school;
            }
            return null;
        }

        isFacilityEnabled(facilityKey) {
            // SuperAdmin always has full authority and access
            if (this.currentUser && this.currentUser.role === 'superadmin') {
                return true;
            }

            const currentSchool = this.getActiveSchool();
            if (!currentSchool) return true;

            // If school is Suspended due to unpaid bills, lock operational facilities
            if (currentSchool.subscription && currentSchool.subscription.paymentStatus === 'Suspended') {
                if (facilityKey === 'dashboard') return true;
                return false;
            }

            if (!currentSchool.facilities) return true;
            if (currentSchool.facilities[facilityKey] === undefined) return true;
            return Boolean(currentSchool.facilities[facilityKey]);
        }

        addSchoolTenant(schoolData) {
            const schools = this.getAllSchools();
            if (!schoolData.id) {
                schoolData.id = `sch-${Date.now().toString(36)}`;
            }
            if (!schoolData.facilities) {
                schoolData.facilities = {
                    attendance: true,
                    homework: true,
                    smsAlerts: true,
                    gradebook: true,
                    fees: true,
                    timetable: true,
                    notices: true,
                    students: true,
                    teachers: true
                };
            }
            schools.push(schoolData);
            this.saveState();
            this.emit("schools:changed", schools);
            return schoolData;
        }

        updateSchool(schoolData) {
            const school = this.getActiveSchool();
            if (school) {
                Object.assign(school, schoolData);
                this.state.school = school;
                this.saveState();
                this.emit("school:updated", school);
            }
        }

        // ================= CLASSES & SECTIONS =================
        getClasses() {
            return this.state.classes || [];
        }

        getClassById(id) {
            return (this.state.classes || []).find(c => c.id === id);
        }

        addClassSection(classData) {
            if (!classData.id) {
                const safeName = classData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const safeSec = (classData.section || 'A').toLowerCase().replace(/[^a-z0-9]/g, '');
                classData.id = `cls-${safeName}-${safeSec}-${Math.random().toString(36).substr(2, 4)}`;
            }
            if (!this.state.classes) this.state.classes = [];
            this.state.classes.push(classData);
            this.saveState();
            this.emit("classes:changed", this.state.classes);
            return classData;
        }

        deleteClassSection(id) {
            if (this.state.classes) {
                this.state.classes = this.state.classes.filter(c => c.id !== id);
                this.saveState();
                this.emit("classes:changed", this.state.classes);
            }
        }

        getSubjects() {
            return this.state.subjects || [];
        }

        // ================= TEACHERS =================
        getTeachers() {
            return this.state.teachers || [];
        }

        getTeacherById(id) {
            return (this.state.teachers || []).find(t => t.id === id);
        }

        addTeacher(teacher) {
            if (!teacher.id) teacher.id = window.AppFormatters.generateId("tch");
            if (!teacher.employeeId) teacher.employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
            this.state.teachers.push(teacher);
            this.saveState();
            this.emit("teachers:changed", this.state.teachers);
            return teacher;
        }

        updateTeacher(id, updatedFields) {
            const index = this.state.teachers.findIndex(t => t.id === id);
            if (index !== -1) {
                this.state.teachers[index] = { ...this.state.teachers[index], ...updatedFields };
                this.saveState();
                this.emit("teachers:changed", this.state.teachers);
                return this.state.teachers[index];
            }
            return null;
        }

        deleteTeacher(id) {
            this.state.teachers = this.state.teachers.filter(t => t.id !== id);
            this.saveState();
            this.emit("teachers:changed", this.state.teachers);
        }

        // ================= STUDENTS =================
        getStudents() {
            return this.state.students || [];
        }

        getStudentById(id) {
            return (this.state.students || []).find(s => s.id === id);
        }

        getStudentsByClass(classId) {
            return (this.state.students || []).filter(s => s.classId === classId);
        }

        addStudent(student) {
            if (!student.id) student.id = window.AppFormatters.generateId("stu");
            if (!student.admissionNo) student.admissionNo = window.AppFormatters.generateAdmissionNo(this.state.students.length);
            if (!student.status) student.status = "Active";
            this.state.students.push(student);

            // Also auto-generate initial fee invoice for new student
            this.createFeeInvoice({
                studentId: student.id,
                studentName: student.name,
                classId: student.classId,
                title: "Quarter 2 Tuition, ATL Lab & Composite School Fee",
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                breakdown: [
                    { item: "Tuition Fee (Quarterly)", amount: 28500 },
                    { item: "Science & Atal Tinkering Lab (ATL) Fund", amount: 4500 },
                    { item: "Smart Class & Digital Learning Levy", amount: 3500 },
                    { item: "Annual Development & Examination Assessment", amount: 3500 },
                    { item: "School Bus Transport Fee", amount: 6000 }
                ],
                totalAmount: 46000,
                paidAmount: 0,
                dueAmount: 46000,
                status: "Overdue",
                paymentHistory: []
            });

            this.saveState();
            this.emit("students:changed", this.state.students);
            return student;
        }

        updateStudent(id, updatedFields) {
            const index = this.state.students.findIndex(s => s.id === id);
            if (index !== -1) {
                this.state.students[index] = { ...this.state.students[index], ...updatedFields };
                this.saveState();
                this.emit("students:changed", this.state.students);
                return this.state.students[index];
            }
            return null;
        }

        deleteStudent(id) {
            this.state.students = this.state.students.filter(s => s.id !== id);
            this.saveState();
            this.emit("students:changed", this.state.students);
        }

        // ================= PARENTS =================
        getParents() {
            return this.state.parents || [];
        }

        getParentById(id) {
            return (this.state.parents || []).find(p => p.id === id);
        }

        getParentByStudentId(studentId) {
            return (this.state.parents || []).find(p => p.studentIds && p.studentIds.includes(studentId));
        }

        // ================= ATTENDANCE & AUTOMATED PARENT ALERTS =================
        getAttendance(date, classId) {
            if (!this.state.attendance) this.state.attendance = {};
            if (!this.state.attendance[date]) return {};
            return this.state.attendance[date][classId] || {};
        }

        getAllAttendance() {
            return this.state.attendance || {};
        }

        saveAttendance(date, classId, records) {
            if (!this.state.attendance) this.state.attendance = {};
            if (!this.state.attendance[date]) this.state.attendance[date] = {};
            this.state.attendance[date][classId] = records;

            // Initialize notifications store if not present
            if (!this.state.notifications) this.state.notifications = [];

            // Dispatch instant SMS / WhatsApp / In-App notifications to parents
            const classInfo = this.getClassById(classId);
            const className = classInfo ? `${classInfo.name} - ${classInfo.section}` : "Class";
            const school = this.getSchool();
            const alertsDispatched = [];

            let absentCount = 0;
            let presentCount = 0;
            let lateCount = 0;
            let excusedCount = 0;

            Object.keys(records).forEach(studentId => {
                const stu = this.getStudentById(studentId);
                if (!stu) return;

                const rec = records[studentId];
                const status = rec.status;
                const parentPhone = stu.parentPhone || stu.phone || "+91 98111 55443";
                const parentName = stu.parentName || "Parent / Guardian";
                const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

                let alertTitle = "";
                let alertMessage = "";
                let alertSeverity = "info"; // "urgent", "warning", "success"
                let channel = "SMS & WhatsApp";

                if (status === "A") {
                    absentCount++;
                    alertSeverity = "urgent";
                    alertTitle = `🚨 URGENT: ${stu.name} Marked ABSENT Today`;
                    alertMessage = `Dear ${parentName}, your ward ${stu.name} (${className}, Roll #${stu.rollNo}) has been marked ABSENT for Morning Assembly today (${window.AppFormatters.formatDate(date)}) at ${school.name}. If this absence is unexpected or an emergency, please contact the School Helpline: ${school.phone} immediately.`;
                } else if (status === "L") {
                    lateCount++;
                    alertSeverity = "warning";
                    alertTitle = `⚠️ Late Arrival Notice: ${stu.name}`;
                    alertMessage = `Dear ${parentName}, your ward ${stu.name} (${className}) arrived LATE at school campus today at ${nowTime}. Gate attendance recorded with remark: "${rec.remark || 'Late entry'}".`;
                } else if (status === "E") {
                    excusedCount++;
                    alertSeverity = "info";
                    alertTitle = `📋 Approved Leave Recorded: ${stu.name}`;
                    alertMessage = `Dear ${parentName}, formal leave application for ${stu.name} (${className}) is approved for ${window.AppFormatters.formatDate(date)}.`;
                } else {
                    presentCount++;
                    alertSeverity = "success";
                    alertTitle = `✅ Safe Campus Check-In: ${stu.name}`;
                    alertMessage = `Dear ${parentName}, your ward ${stu.name} (${className}) has safely arrived on campus and is marked PRESENT in Morning Assembly at ${nowTime}.`;
                }

                const notifItem = {
                    id: window.AppFormatters.generateId("notif"),
                    studentId: stu.id,
                    studentName: stu.name,
                    parentId: stu.parentId || "par-1",
                    parentName: parentName,
                    parentPhone: parentPhone,
                    classId: classId,
                    className: className,
                    date: date,
                    time: nowTime,
                    status: status,
                    title: alertTitle,
                    message: alertMessage,
                    severity: alertSeverity,
                    channel: channel,
                    deliveryStatus: "Delivered (WhatsApp API + SMS Gateway)",
                    read: false,
                    timestamp: new Date().toISOString()
                };

                this.state.notifications.unshift(notifItem);
                alertsDispatched.push(notifItem);
            });

            // Keep only latest 150 notifications in store
            if (this.state.notifications.length > 150) {
                this.state.notifications = this.state.notifications.slice(0, 150);
            }

            this.saveState();
            this.emit("attendance:changed", { date, classId, records });
            this.emit("notifications:changed", this.state.notifications);

            return {
                totalCount: alertsDispatched.length,
                absentCount,
                presentCount,
                lateCount,
                excusedCount,
                alertsDispatched
            };
        }

        getNotifications(userId = null, role = null) {
            const list = this.state.notifications || [];
            if (!userId && !role) return list;

            if (role === "parent") {
                const parent = this.getParentById(userId) || (this.state.parents && this.state.parents[0]);
                const stuIds = parent ? parent.studentIds || [] : [];
                return list.filter(n => n.parentId === userId || stuIds.includes(n.studentId));
            } else if (role === "student") {
                return list.filter(n => n.studentId === userId);
            }
            return list;
        }

        markNotificationRead(id) {
            if (!this.state.notifications) return;
            const notif = this.state.notifications.find(n => n.id === id);
            if (notif) {
                notif.read = true;
                this.saveState();
                this.emit("notifications:changed", this.state.notifications);
            }
        }

        markAllNotificationsRead() {
            if (!this.state.notifications) return;
            this.state.notifications.forEach(n => n.read = true);
            this.saveState();
            this.emit("notifications:changed", this.state.notifications);
        }

        // ================= EXAMS & GRADES =================
        getExams() {
            return this.state.exams || [];
        }

        getExamById(id) {
            return (this.state.exams || []).find(e => e.id === id);
        }

        addExam(exam) {
            if (!exam.id) exam.id = window.AppFormatters.generateId("ex");
            this.state.exams.push(exam);
            this.saveState();
            this.emit("exams:changed", this.state.exams);
            return exam;
        }

        getGrades() {
            return this.state.grades || [];
        }

        getGradesByExamAndClass(examId, classId) {
            return (this.state.grades || []).filter(g => g.examId === examId && g.classId === classId);
        }

        getStudentGrade(examId, studentId) {
            return (this.state.grades || []).find(g => g.examId === examId && g.studentId === studentId);
        }

        saveStudentGrade(gradeData) {
            if (!this.state.grades) this.state.grades = [];
            const index = this.state.grades.findIndex(
                g => g.examId === gradeData.examId && g.studentId === gradeData.studentId
            );

            if (index !== -1) {
                this.state.grades[index] = { ...this.state.grades[index], ...gradeData };
            } else {
                this.state.grades.push(gradeData);
            }

            this.saveState();
            this.emit("grades:changed", this.state.grades);
        }

        // ================= TIMETABLE =================
        getTimetable(classId) {
            if (!this.state.timetable) this.state.timetable = {};
            return this.state.timetable[classId] || [];
        }

        saveTimetableSlot(classId, slotData) {
            if (!this.state.timetable) this.state.timetable = {};
            if (!this.state.timetable[classId]) this.state.timetable[classId] = [];

            // Check if slot exists for same day & period
            const existingIdx = this.state.timetable[classId].findIndex(
                s => s.day === slotData.day && s.period === slotData.period
            );

            if (existingIdx !== -1) {
                this.state.timetable[classId][existingIdx] = slotData;
            } else {
                this.state.timetable[classId].push(slotData);
            }

            this.saveState();
            this.emit("timetable:changed", { classId });
        }

        deleteTimetableSlot(classId, day, period) {
            if (this.state.timetable && this.state.timetable[classId]) {
                this.state.timetable[classId] = this.state.timetable[classId].filter(
                    s => !(s.day === day && s.period === period)
                );
                this.saveState();
                this.emit("timetable:changed", { classId });
            }
        }

        // ================= FEES & INVOICES =================
        getFees() {
            return this.state.fees || [];
        }

        getFeeById(id) {
            return (this.state.fees || []).find(f => f.id === id);
        }

        getStudentFees(studentId) {
            return (this.state.fees || []).filter(f => f.studentId === studentId);
        }

        createFeeInvoice(invoiceData) {
            if (!this.state.fees) this.state.fees = [];
            if (!invoiceData.id) invoiceData.id = window.AppFormatters.generateId("inv");
            if (!invoiceData.invoiceNo) invoiceData.invoiceNo = window.AppFormatters.generateInvoiceNo(this.state.fees.length);
            this.state.fees.push(invoiceData);
            this.saveState();
            this.emit("fees:changed", this.state.fees);
            return invoiceData;
        }

        recordFeePayment(invoiceId, paymentData) {
            const invoice = this.getFeeById(invoiceId);
            if (!invoice) return null;

            const paidAmount = Number(paymentData.amount);
            invoice.paidAmount = (invoice.paidAmount || 0) + paidAmount;
            invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);

            if (invoice.dueAmount === 0) {
                invoice.status = "Paid";
            } else {
                invoice.status = "Partial";
            }

            if (!invoice.paymentHistory) invoice.paymentHistory = [];
            const paymentRecord = {
                receiptNo: window.AppFormatters.generateReceiptNo(invoice.paymentHistory.length + 100),
                date: paymentData.date || new Date().toISOString().split('T')[0],
                amount: paidAmount,
                method: paymentData.method || "Cash",
                transactionId: paymentData.transactionId || `TXN-${Date.now().toString(36).toUpperCase()}`,
                status: "Completed"
            };

            invoice.paymentHistory.unshift(paymentRecord);
            this.saveState();
            this.emit("fees:changed", this.state.fees);
            return { invoice, paymentRecord };
        }

        // ================= NOTICES =================
        getNotices() {
            return (this.state.notices || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        addNotice(noticeData) {
            if (!this.state.notices) this.state.notices = [];
            if (!noticeData.id) noticeData.id = window.AppFormatters.generateId("not");
            if (!noticeData.date) noticeData.date = new Date().toISOString().split('T')[0];
            this.state.notices.unshift(noticeData);
            this.saveState();
            this.emit("notices:changed", this.state.notices);
            return noticeData;
        }

        deleteNotice(id) {
            this.state.notices = (this.state.notices || []).filter(n => n.id !== id);
            this.saveState();
            this.emit("notices:changed", this.state.notices);
        }

        // ================= DIGITAL DIARY & HOMEWORK =================
        getHomework() {
            return (this.state.homework || []).sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate));
        }

        getHomeworkById(id) {
            return (this.state.homework || []).find(h => h.id === id);
        }

        getHomeworkByClass(classId, date = null) {
            let list = (this.state.homework || []).filter(h => h.classId === classId);
            if (date) {
                list = list.filter(h => h.assignedDate === date);
            }
            return list.sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate));
        }

        addHomework(hwData) {
            if (!this.state.homework) this.state.homework = [];
            if (!hwData.id) hwData.id = window.AppFormatters.generateId("hw");
            if (!hwData.assignedDate) hwData.assignedDate = new Date().toISOString().split('T')[0];
            if (!hwData.parentSignatures) hwData.parentSignatures = {};
            if (!hwData.studentCompletions) hwData.studentCompletions = {};
            if (!hwData.attachments) hwData.attachments = [];
            this.state.homework.unshift(hwData);
            this.saveState();
            this.emit("homework:changed", this.state.homework);
            return hwData;
        }

        deleteHomework(id) {
            this.state.homework = (this.state.homework || []).filter(h => h.id !== id);
            this.saveState();
            this.emit("homework:changed", this.state.homework);
        }

        toggleStudentHomeworkCompletion(hwId, studentId) {
            const hw = this.getHomeworkById(hwId);
            if (!hw) return;
            if (!hw.studentCompletions) hw.studentCompletions = {};
            if (hw.studentCompletions[studentId]) {
                delete hw.studentCompletions[studentId];
            } else {
                hw.studentCompletions[studentId] = {
                    completedAt: new Date().toISOString(),
                    status: "Done"
                };
            }
            this.saveState();
            this.emit("homework:changed", this.state.homework);
            return hw;
        }

        signParentHomework(hwId, parentId, parentName) {
            const hw = this.getHomeworkById(hwId);
            if (!hw) return;
            if (!hw.parentSignatures) hw.parentSignatures = {};
            hw.parentSignatures[parentId] = {
                signedAt: new Date().toISOString(),
                parentName: parentName || "Parent",
                status: "Signed & Verified"
            };
            this.saveState();
            this.emit("homework:changed", this.state.homework);
            return hw;
        }

        // ================= GPS TRANSPORT & BUS FLEET =================
        getTransportRoutes() {
            if (!this.state.transportRoutes) {
                this.state.transportRoutes = JSON.parse(JSON.stringify(window.SEED_DATA.transportRoutes || []));
                this.saveState();
            }
            return this.state.transportRoutes;
        }

        getRouteById(id) {
            return this.getTransportRoutes().find(r => r.id === id);
        }

        getStudentTransport(studentId) {
            const routes = this.getTransportRoutes();
            return routes.find(r => (r.studentsAssigned || []).includes(studentId));
        }

        addTransportRoute(routeData) {
            const routes = this.getTransportRoutes();
            if (!routeData.id) {
                routeData.id = `route-${Date.now().toString(36)}`;
            }
            routes.push(routeData);
            this.saveState();
            this.emit("transport:changed", routes);
            return routeData;
        }

        updateTransportRoute(id, updateData) {
            const routes = this.getTransportRoutes();
            const route = routes.find(r => r.id === id);
            if (route) {
                Object.assign(route, updateData);
                this.saveState();
                this.emit("transport:changed", routes);
                return route;
            }
            return null;
        }

        // ================= LIBRARY MANAGEMENT & LENDING =================
        getLibraryBooks() {
            if (!this.state.libraryBooks) {
                this.state.libraryBooks = JSON.parse(JSON.stringify(window.SEED_DATA.libraryBooks || []));
                this.saveState();
            }
            return this.state.libraryBooks;
        }

        getLibraryBookById(id) {
            return this.getLibraryBooks().find(b => b.id === id);
        }

        getLibraryLoans() {
            if (!this.state.libraryLoans) {
                this.state.libraryLoans = JSON.parse(JSON.stringify(window.SEED_DATA.libraryLoans || []));
                this.saveState();
            }
            return this.state.libraryLoans;
        }

        getStudentLoans(studentId) {
            return this.getLibraryLoans().filter(l => l.borrowerId === studentId);
        }

        issueBook(bookId, studentId, dueDate) {
            const book = this.getLibraryBookById(bookId);
            const student = this.getStudentById(studentId);
            if (!book || !student) return { success: false, error: "Book or student not found" };
            if (book.availableCopies <= 0) return { success: false, error: "No copies currently available" };

            book.availableCopies -= 1;
            const newLoan = {
                id: `loan-${Date.now().toString(36)}`,
                bookId: book.id,
                bookTitle: book.title,
                accessionNo: book.accessionNo,
                borrowerType: "student",
                borrowerId: student.id,
                borrowerName: student.name,
                borrowerClass: student.classId,
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                returnDate: null,
                status: "Active Borrowed",
                fineAmount: 0
            };

            const loans = this.getLibraryLoans();
            loans.unshift(newLoan);
            this.saveState();
            this.emit("library:changed", { books: this.state.libraryBooks, loans: this.state.libraryLoans });
            return { success: true, loan: newLoan };
        }

        returnBook(loanId) {
            const loans = this.getLibraryLoans();
            const loan = loans.find(l => l.id === loanId);
            if (!loan || loan.returnDate) return { success: false, error: "Loan not found or already returned" };

            loan.returnDate = new Date().toISOString().split('T')[0];
            loan.status = "Returned ✅";

            const book = this.getLibraryBookById(loan.bookId);
            if (book) {
                book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
            }

            this.saveState();
            this.emit("library:changed", { books: this.state.libraryBooks, loans: this.state.libraryLoans });
            return { success: true, loan };
        }

        addLibraryBook(bookData) {
            const books = this.getLibraryBooks();
            if (!bookData.id) {
                bookData.id = `bk-${Date.now().toString(36)}`;
            }
            if (!bookData.accessionNo) {
                bookData.accessionNo = `ACC-${Math.floor(10000 + Math.random() * 90000)}`;
            }
            bookData.availableCopies = bookData.totalCopies || 1;
            books.push(bookData);
            this.saveState();
            this.emit("library:changed", { books: this.state.libraryBooks, loans: this.state.libraryLoans });
            return bookData;
        }

        // ================= STAFF PAYROLL & LEAVES =================
        getStaffPayroll() {
            if (!this.state.staffPayroll) {
                this.state.staffPayroll = JSON.parse(JSON.stringify(window.SEED_DATA.staffPayroll || []));
                this.saveState();
            }
            return this.state.staffPayroll;
        }

        getStaffPayrollById(id) {
            return this.getStaffPayroll().find(p => p.id === id);
        }

        getStaffPayrollByStaffId(staffId) {
            return this.getStaffPayroll().filter(p => p.staffId === staffId);
        }

        addStaffPayrollEntry(entry) {
            const payrolls = this.getStaffPayroll();
            if (!entry.id) {
                entry.id = `pay-${Date.now().toString(36)}`;
            }
            if (!entry.paymentDate) {
                entry.paymentDate = new Date().toISOString().split('T')[0];
            }
            if (!entry.status) {
                entry.status = "Paid & Disbursed";
            }
            payrolls.unshift(entry);
            this.saveState();
            this.emit("payroll:changed", payrolls);
            return entry;
        }

        deleteStaffPayrollEntry(id) {
            const payrolls = this.getStaffPayroll();
            const idx = payrolls.findIndex(p => p.id === id);
            if (idx !== -1) {
                payrolls.splice(idx, 1);
                this.saveState();
                this.emit("payroll:changed", payrolls);
                return true;
            }
            return false;
        }

        getStaffLeaves() {
            if (!this.state.staffLeaves) {
                this.state.staffLeaves = JSON.parse(JSON.stringify(window.SEED_DATA.staffLeaves || { balances: {}, requests: [] }));
                this.saveState();
            }
            return this.state.staffLeaves;
        }

        getStaffLeaveBalances(staffId) {
            const leaves = this.getStaffLeaves();
            if (!leaves.balances) leaves.balances = {};
            if (!leaves.balances[staffId]) {
                leaves.balances[staffId] = { clTotal: 12, clUsed: 0, elTotal: 15, elUsed: 0, mlTotal: 10, mlUsed: 0 };
            }
            return leaves.balances[staffId];
        }

        applyStaffLeave(leaveData) {
            const leaves = this.getStaffLeaves();
            if (!leaves.requests) leaves.requests = [];
            if (!leaveData.id) {
                leaveData.id = `leave-${Date.now().toString(36)}`;
            }
            leaveData.appliedOn = new Date().toISOString().split('T')[0];
            leaveData.status = "Pending Review";
            leaves.requests.unshift(leaveData);
            this.saveState();
            this.emit("leaves:changed", leaves);
            return leaveData;
        }

        updateLeaveStatus(leaveId, status, decisionNote, approverName) {
            const leaves = this.getStaffLeaves();
            const req = (leaves.requests || []).find(r => r.id === leaveId);
            if (req) {
                req.status = status;
                req.decisionNote = decisionNote || (status === 'Approved' ? 'Sanctioned by Principal' : 'Rejected');
                req.approvedBy = approverName || 'Dr. Meenakshi Sundaram (Principal)';

                // Update balance if approved
                if (status === 'Approved') {
                    const bal = this.getStaffLeaveBalances(req.staffId);
                    if (req.leaveType.includes('CL')) bal.clUsed = Math.min(bal.clTotal, (bal.clUsed || 0) + (req.totalDays || 1));
                    else if (req.leaveType.includes('ML')) bal.mlUsed = Math.min(bal.mlTotal, (bal.mlUsed || 0) + (req.totalDays || 1));
                    else if (req.leaveType.includes('EL')) bal.elUsed = Math.min(bal.elTotal, (bal.elUsed || 0) + (req.totalDays || 1));
                }

                this.saveState();
                this.emit("leaves:changed", leaves);
                return req;
            }
            return null;
        }

        processStaffPayroll(payrollData) {
            const payrolls = this.getStaffPayroll();
            if (!payrollData.id) {
                payrollData.id = `pay-${Date.now().toString(36)}`;
            }
            payrollData.status = "Paid & Disbursed";
            payrollData.paymentDate = new Date().toISOString().split('T')[0];
            payrolls.unshift(payrollData);
            this.saveState();
            this.emit("payroll:changed", payrolls);
            return payrollData;
        }

        // ================= BACKUP & RESTORE =================
        exportJSON() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `Apex_Horizon_Backup_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        }

        importJSON(jsonData) {
            try {
                const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
                if (!parsed.school || !parsed.students) {
                    throw new Error("Invalid school database JSON format.");
                }
                this.saveState(parsed);
                this.emit("data:imported", this.state);
                return { success: true };
            } catch (err) {
                return { success: false, error: err.message };
            }
        }

        resetToSeedData() {
            const initial = JSON.parse(JSON.stringify(window.SEED_DATA));
            this.saveState(initial);
            this.emit("data:reset", this.state);
        }
    }

    window.store = new SchoolStore();
})();
