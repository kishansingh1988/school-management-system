// Attendance Tracking & Reporting Module

window.AttendanceModule = {
    selectedClass: 'cls-10a',
    selectedDate: new Date().toISOString().split('T')[0],
    tempRecords: {},

    render() {
        const classes = window.store.getClasses();
        const students = window.store.getStudentsByClass(this.selectedClass);
        const storedAttendance = window.store.getAttendance(this.selectedDate, this.selectedClass);
        const currentUser = window.store.getCurrentUser();
        const canEdit = currentUser.role === 'admin' || currentUser.role === 'teacher';

        // Initialize tempRecords with stored data or defaults
        this.tempRecords = {};
        students.forEach(s => {
            if (storedAttendance && storedAttendance[s.id]) {
                this.tempRecords[s.id] = { ...storedAttendance[s.id] };
            } else {
                this.tempRecords[s.id] = { status: 'P', remark: 'On time' };
            }
        });

        // Compute summary metrics
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        let excusedCount = 0;

        Object.values(this.tempRecords).forEach(rec => {
            if (rec.status === 'P') presentCount++;
            else if (rec.status === 'A') absentCount++;
            else if (rec.status === 'L') lateCount++;
            else if (rec.status === 'E') excusedCount++;
        });

        const totalMarked = students.length;
        const currentPercentage = totalMarked > 0 ? Math.round(((presentCount + lateCount * 0.8) / totalMarked) * 100) : 100;

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daily Class Attendance</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record and monitor roll call, student absences, late arrivals, and trends</p>
                    </div>
                    <div class="flex items-center gap-2">
                        ${canEdit ? `
                            <button onclick="window.AttendanceModule.saveAll()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2">
                                <i data-lucide="save" class="w-4 h-4"></i>
                                <span>Save Class Attendance</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Class & Date Selector Filter Bar -->
                <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Select Class & Section</label>
                            <select onchange="window.AttendanceModule.changeClass(this.value)" class="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                ${window.AppFormatters.renderGroupedClassOptions(classes, this.selectedClass)}
                            </select>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Attendance Date</label>
                            <input type="date" value="${this.selectedDate}" onchange="window.AttendanceModule.changeDate(this.value)" class="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                        </div>
                    </div>

                    <!-- Quick Bulk Actions -->
                    ${canEdit ? `
                        <div class="flex items-center space-x-2 pt-2 md:pt-0">
                            <button onclick="window.AttendanceModule.markAll('P')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition flex items-center space-x-1">
                                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                                <span>Mark All Present</span>
                            </button>
                            <button onclick="window.AttendanceModule.markAll('A')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition flex items-center space-x-1">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i>
                                <span>Mark All Absent</span>
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- KPI Metric Pills -->
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400">Total Roll</span>
                            <h4 class="text-xl font-bold text-slate-900 dark:text-white">${totalMarked}</h4>
                        </div>
                        <span class="text-slate-400 text-xs font-semibold">100%</span>
                    </div>

                    <div class="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 shadow-sm flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Present</span>
                            <h4 class="text-xl font-bold text-emerald-700 dark:text-emerald-300">${presentCount}</h4>
                        </div>
                        <i data-lucide="user-check" class="w-5 h-5 text-emerald-600"></i>
                    </div>

                    <div class="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 shadow-sm flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300">Absent</span>
                            <h4 class="text-xl font-bold text-rose-700 dark:text-rose-300">${absentCount}</h4>
                        </div>
                        <i data-lucide="user-x" class="w-5 h-5 text-rose-600"></i>
                    </div>

                    <div class="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 shadow-sm flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">Late</span>
                            <h4 class="text-xl font-bold text-amber-700 dark:text-amber-300">${lateCount}</h4>
                        </div>
                        <i data-lucide="clock" class="w-5 h-5 text-amber-600"></i>
                    </div>

                    <div class="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 shadow-sm flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300">Class Rate</span>
                            <h4 class="text-xl font-bold text-indigo-700 dark:text-indigo-300">${currentPercentage}%</h4>
                        </div>
                        <i data-lucide="percent" class="w-5 h-5 text-indigo-600"></i>
                    </div>
                </div>

                <!-- Students Attendance Roll Table -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th class="p-3.5 pl-6">Roll #</th>
                                    <th class="p-3.5">Student Name</th>
                                    <th class="p-3.5">Term Attendance Avg</th>
                                    <th class="p-3.5 text-center">Status Selection</th>
                                    <th class="p-3.5 pr-6">Remarks / Absence Reason</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                ${students.map(s => {
                                    const record = this.tempRecords[s.id] || { status: 'P', remark: 'On time' };
                                    const stats = window.AppFormatters.calculateStudentAttendanceStats(s.id, window.store.getAllAttendance());
                                    return `
                                        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                                            <td class="p-3.5 pl-6 font-bold text-slate-800 dark:text-slate-200">
                                                #${s.rollNo}
                                            </td>
                                            <td class="p-3.5">
                                                <div class="flex items-center space-x-3">
                                                    <img src="${s.avatar}" class="w-8 h-8 rounded-full object-cover border border-slate-200" alt="${s.name}">
                                                    <div>
                                                        <h4 class="font-bold text-slate-900 dark:text-white text-xs">${s.name}</h4>
                                                        <span class="text-[10px] text-slate-400">${s.admissionNo}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="p-3.5">
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${stats.percentage >= 90 ? 'bg-emerald-100 text-emerald-700' : (stats.percentage >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}">
                                                    ${stats.percentage}% overall
                                                </span>
                                            </td>
                                            <td class="p-3.5 text-center">
                                                <div class="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl space-x-1 border border-slate-200 dark:border-slate-700">
                                                    <button onclick="window.AttendanceModule.setStatus('${s.id}', 'P')" class="px-3 py-1 text-xs font-bold rounded-lg transition ${record.status === 'P' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200'}">
                                                        P
                                                    </button>
                                                    <button onclick="window.AttendanceModule.setStatus('${s.id}', 'A')" class="px-3 py-1 text-xs font-bold rounded-lg transition ${record.status === 'A' ? 'bg-rose-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200'}">
                                                        A
                                                    </button>
                                                    <button onclick="window.AttendanceModule.setStatus('${s.id}', 'L')" class="px-3 py-1 text-xs font-bold rounded-lg transition ${record.status === 'L' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200'}">
                                                        L
                                                    </button>
                                                    <button onclick="window.AttendanceModule.setStatus('${s.id}', 'E')" class="px-3 py-1 text-xs font-bold rounded-lg transition ${record.status === 'E' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200'}">
                                                        E
                                                    </button>
                                                </div>
                                            </td>
                                            <td class="p-3.5 pr-6">
                                                <input type="text" value="${record.remark || ''}" onchange="window.AttendanceModule.setRemark('${s.id}', this.value)" placeholder="e.g. On time, Medical reason..." class="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    changeClass(classId) {
        this.selectedClass = classId;
        window.app.renderCurrentView();
    },

    changeDate(date) {
        this.selectedDate = date;
        window.app.renderCurrentView();
    },

    setStatus(studentId, status) {
        if (!this.tempRecords[studentId]) {
            this.tempRecords[studentId] = { status: 'P', remark: '' };
        }
        this.tempRecords[studentId].status = status;
        if (status === 'P') this.tempRecords[studentId].remark = 'On time';
        if (status === 'A') this.tempRecords[studentId].remark = 'Absent';
        if (status === 'L') this.tempRecords[studentId].remark = 'Late arrival';
        if (status === 'E') this.tempRecords[studentId].remark = 'Excused leave';

        window.app.renderCurrentView();
    },

    setRemark(studentId, remark) {
        if (!this.tempRecords[studentId]) {
            this.tempRecords[studentId] = { status: 'P', remark: '' };
        }
        this.tempRecords[studentId].remark = remark;
    },

    markAll(status) {
        const students = window.store.getStudentsByClass(this.selectedClass);
        students.forEach(s => {
            this.tempRecords[s.id] = {
                status,
                remark: status === 'P' ? 'On time' : 'Absent'
            };
        });
        window.app.renderCurrentView();
        window.app.showToast(`Marked all students as ${status === 'P' ? 'Present' : 'Absent'}`, 'info');
    },

    saveAll() {
        const result = window.store.saveAttendance(this.selectedDate, this.selectedClass, this.tempRecords);
        window.app.showToast(`Saved attendance & sent ${result.totalCount} instant parent alerts!`, 'success');
        this.showDispatchModal(result);
    },

    showDispatchModal(result) {
        let container = document.getElementById("attendanceModalContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "attendanceModalContainer";
            document.body.appendChild(container);
        }

        const classInfo = window.store.getClassById(this.selectedClass);
        const className = classInfo ? `${classInfo.name} - ${classInfo.section}` : "Class";

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                    <!-- Modal Header -->
                    <div class="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <i data-lucide="send" class="w-5 h-5 text-white"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-base">Instant Parent Notifications Dispatched!</h3>
                                <p class="text-xs text-emerald-100">${className} • Morning Roll Call (${window.AppFormatters.formatDate(this.selectedDate)})</p>
                            </div>
                        </div>
                        <button onclick="document.getElementById('attendanceModalContainer').innerHTML = ''; window.app.renderCurrentView();" class="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                        <!-- KPI Badges -->
                        <div class="grid grid-cols-3 gap-3">
                            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center">
                                <span class="text-[10px] font-bold uppercase text-emerald-600 block">Safe Check-Ins</span>
                                <strong class="text-xl text-emerald-700 dark:text-emerald-300">${result.presentCount} Delivered</strong>
                            </div>
                            <div class="p-3 rounded-xl ${result.absentCount > 0 ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900' : 'bg-slate-50 dark:bg-slate-800'} border text-center">
                                <span class="text-[10px] font-bold uppercase ${result.absentCount > 0 ? 'text-rose-600' : 'text-slate-400'} block">Urgent Absence Alerts</span>
                                <strong class="text-xl ${result.absentCount > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-slate-700 dark:text-slate-300'}">${result.absentCount} Sent</strong>
                            </div>
                            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-center">
                                <span class="text-[10px] font-bold uppercase text-amber-600 block">Late Alerts</span>
                                <strong class="text-xl text-amber-700 dark:text-amber-300">${result.lateCount} Sent</strong>
                            </div>
                        </div>

                        <!-- Live SMS & WhatsApp Delivery Preview Feed -->
                        <div>
                            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center justify-between">
                                <span>Simulated Parent Mobile Dispatch Logs (${result.alertsDispatched.length} Recipients)</span>
                                <span class="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Gateway Active (SMS + WhatsApp API)</span>
                                </span>
                            </h4>

                            <div class="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                                ${result.alertsDispatched.map(alert => `
                                    <div class="p-3.5 rounded-xl border ${
                                        alert.severity === 'urgent' ? 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/30' :
                                        alert.severity === 'warning' ? 'border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30' :
                                        'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
                                    }">
                                        <div class="flex items-center justify-between mb-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    alert.severity === 'urgent' ? 'bg-rose-600 text-white' :
                                                    alert.severity === 'warning' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                                                }">
                                                    ${alert.status === 'A' ? 'ABSENT' : (alert.status === 'L' ? 'LATE' : 'PRESENT')}
                                                </span>
                                                <strong class="text-slate-900 dark:text-white text-xs">${alert.parentName}</strong>
                                                <span class="text-[11px] text-slate-400 font-mono">(${alert.parentPhone})</span>
                                            </div>
                                            <span class="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                                                <i data-lucide="check-check" class="w-3 h-3 text-emerald-600"></i>
                                                <span>Delivered ${alert.time}</span>
                                            </span>
                                        </div>
                                        <p class="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">${alert.message}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span class="text-[11px] text-slate-400">All registered parent mobile numbers updated in real-time.</span>
                        <button onclick="document.getElementById('attendanceModalContainer').innerHTML = ''; window.app.renderCurrentView();" class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }
};
