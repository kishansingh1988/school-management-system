// Teacher Portal Dashboard Component

window.TeacherDashboard = {
    render() {
        const currentUser = window.store.getCurrentUser();
        const teacher = currentUser.teacherData || window.store.getTeachers()[0];
        const assignedClass = window.store.getClassById(teacher.assignedClass) || window.store.getClasses()[0];
        const students = window.store.getStudentsByClass(assignedClass.id);
        const exams = window.store.getExams();
        const timetable = window.store.getTimetable(assignedClass.id);
        const todayStr = new Date().toISOString().split('T')[0];
        const todayAttendance = window.store.getAttendance(todayStr, assignedClass.id);
        const isAttendanceMarked = Object.keys(todayAttendance).length > 0;

        // Filter today's timetable slots (e.g. Monday/Tuesday)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[new Date().getDay()] || 'Monday';
        const todaySlots = timetable.filter(s => s.day === (dayName === 'Sunday' || dayName === 'Saturday' ? 'Monday' : dayName));

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Teacher Header Banner -->
                <div class="p-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white shadow-xl relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <img src="${teacher.avatar}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow" alt="${teacher.name}">
                            <div>
                                <div class="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <span>${teacher.designation}</span>
                                    <span>•</span>
                                    <span>Class Teacher: ${assignedClass.name} - ${assignedClass.section}</span>
                                </div>
                                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Hello, Prof. ${teacher.name}</h1>
                                <p class="text-emerald-100 text-xs mt-1">
                                    Assigned Subjects: ${(teacher.subjects || []).join(', ')} | ${teacher.experience} Teaching Experience
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button onclick="window.app.navigate('attendance')" class="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-semibold text-sm rounded-xl shadow transition flex items-center space-x-2">
                                <i data-lucide="calendar-check" class="w-4 h-4 text-emerald-600"></i>
                                <span>${isAttendanceMarked ? 'Review Attendance' : 'Mark Daily Attendance'}</span>
                            </button>
                            <button onclick="window.app.navigate('homework')" class="px-4 py-2.5 bg-emerald-600/40 hover:bg-emerald-600/60 border border-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-sm transition flex items-center space-x-2">
                                <i data-lucide="book-open-check" class="w-4 h-4"></i>
                                <span>Post Daily Diary</span>
                            </button>
                            <button onclick="window.app.navigate('gradebook')" class="px-4 py-2.5 bg-emerald-600/40 hover:bg-emerald-600/60 border border-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-sm transition flex items-center space-x-2">
                                <i data-lucide="award" class="w-4 h-4"></i>
                                <span>Input Grades</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Status Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <!-- Card 1: Attendance Action -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl ${isAttendanceMarked ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60'} flex items-center justify-center shrink-0">
                            <i data-lucide="${isAttendanceMarked ? 'check-circle' : 'alert-circle'}" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-1">
                            <span class="text-xs font-semibold text-slate-400 uppercase">Today's Class Roll</span>
                            <h4 class="font-bold text-slate-900 dark:text-white text-base">
                                ${isAttendanceMarked ? 'Attendance Completed' : 'Attendance Pending'}
                            </h4>
                            <p class="text-xs text-slate-500">${assignedClass.name} - ${assignedClass.section} (${students.length} Registered Students)</p>
                        </div>
                    </div>

                    <!-- Card 2: Exams to Grade -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 flex items-center justify-center shrink-0">
                            <i data-lucide="file-edit" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-1">
                            <span class="text-xs font-semibold text-slate-400 uppercase">Active Exam Evaluation</span>
                            <h4 class="font-bold text-slate-900 dark:text-white text-base">Mid-Term Assessment</h4>
                            <p class="text-xs text-purple-600 font-medium">8 Submissions Ready for Evaluation</p>
                        </div>
                    </div>

                    <!-- Card 3: Next Period -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 flex items-center justify-center shrink-0">
                            <i data-lucide="clock" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-1">
                            <span class="text-xs font-semibold text-slate-400 uppercase">Upcoming Period Slot</span>
                            <h4 class="font-bold text-slate-900 dark:text-white text-base">Period 1 • 08:30 AM</h4>
                            <p class="text-xs text-slate-500">Mathematics in Room 301</p>
                        </div>
                    </div>
                </div>

                <!-- Two Column Layout: Today's Schedule & Student Academic Standings -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Schedule Table -->
                    <div class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                                    <i data-lucide="calendar" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold text-slate-900 dark:text-white text-base">Today's Class Schedule (${dayName})</h3>
                                    <p class="text-xs text-slate-500">Curriculum timetable for ${assignedClass.name} - ${assignedClass.section}</p>
                                </div>
                            </div>
                            <button onclick="window.app.navigate('timetable')" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Full Timetable &rarr;</button>
                        </div>

                        <div class="divide-y divide-slate-100 dark:divide-slate-800">
                            ${(todaySlots.length > 0 ? todaySlots : timetable.slice(0, 5)).map(slot => `
                                <div class="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-xl transition">
                                    <div class="flex items-center space-x-3.5">
                                        <span class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                                            P${slot.period}
                                        </span>
                                        <div>
                                            <h4 class="text-sm font-semibold text-slate-900 dark:text-white">${slot.subject}</h4>
                                            <p class="text-xs text-slate-500">Instructor: ${slot.teacher} • Room: ${slot.room}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900">
                                            ${slot.time}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Class 10-A Student Roster Preview -->
                    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold text-slate-900 dark:text-white text-base">Class Roster</h3>
                            <button onclick="window.app.navigate('students')" class="text-xs font-semibold text-emerald-600 hover:underline">Manage All</button>
                        </div>

                        <div class="space-y-3">
                            ${students.slice(0, 5).map(s => {
                                const stats = window.AppFormatters.calculateStudentAttendanceStats(s.id, window.store.getAllAttendance());
                                return `
                                    <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div class="flex items-center space-x-3">
                                            <img src="${s.avatar}" class="w-9 h-9 rounded-full object-cover border border-slate-200" alt="${s.name}">
                                            <div>
                                                <h4 class="text-xs font-bold text-slate-900 dark:text-white">${s.name}</h4>
                                                <p class="text-[11px] text-slate-400">Roll #${s.rollNo} • ${s.admissionNo}</p>
                                            </div>
                                        </div>
                                        <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${stats.percentage >= 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                                            ${stats.percentage}% Attd
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
