// Student Portal Dashboard Component

window.StudentDashboard = {
    render() {
        const currentUser = window.store.getCurrentUser();
        const student = currentUser.studentData || window.store.getStudents()[0];
        const classInfo = window.store.getClassById(student.classId) || window.store.getClasses()[0];
        const school = window.store.getSchool();
        const subjects = window.store.getSubjects();
        const timetable = window.store.getTimetable(student.classId);
        const fees = window.store.getStudentFees(student.id);
        const exams = window.store.getExams();
        const latestExam = exams[0] || null;
        const gradeRecord = latestExam ? window.store.getStudentGrade(latestExam.id, student.id) : null;
        const examSummary = gradeRecord ? window.AppFormatters.calculateStudentExamSummary(gradeRecord.marks, subjects, school.gradingScale) : null;
        const attendanceStats = window.AppFormatters.calculateStudentAttendanceStats(student.id, window.store.getAllAttendance());

        // Calculate Fee status
        let totalFeeDue = 0;
        fees.forEach(f => totalFeeDue += (f.dueAmount || 0));

        // Today's classes
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[new Date().getDay()] || 'Monday';
        const todaySlots = timetable.filter(s => s.day === (dayName === 'Sunday' || dayName === 'Saturday' ? 'Monday' : dayName));

        // Today's homework assignments
        const todayDateStr = new Date().toISOString().split('T')[0];
        const todayHomework = window.store.getHomeworkByClass(student.classId, todayDateStr);

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Student Hero Banner -->
                <div class="p-6 rounded-2xl bg-gradient-to-r from-sky-700 via-indigo-700 to-purple-800 text-white shadow-xl relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <img src="${student.avatar}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-lg" alt="${student.name}">
                            <div>
                                <div class="flex items-center space-x-2 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <span>${classInfo.name} - ${classInfo.section}</span>
                                    <span>•</span>
                                    <span>Roll #${student.rollNo} • Adm: ${student.admissionNo}</span>
                                </div>
                                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome, ${student.name}</h1>
                                <p class="text-sky-100 text-xs mt-1">
                                    Academic Session ${school.academicYear} | Room ${classInfo.room}
                                </p>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap items-center gap-2">
                            <button onclick="window.app.navigate('homework')" class="px-4 py-2.5 bg-white text-indigo-700 hover:bg-sky-50 font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2">
                                <i data-lucide="book-open-check" class="w-4 h-4 text-indigo-600"></i>
                                <span>My Homework Diary</span>
                            </button>
                            ${gradeRecord ? `
                                <button onclick="window.StudentDashboard.downloadMyReportCard('${student.id}', '${latestExam.id}')" class="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition flex items-center space-x-2">
                                    <i data-lucide="file-down" class="w-4 h-4"></i>
                                    <span>Report Card (PDF)</span>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- 4 Performance Metric Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <!-- Attendance Rate -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Attendance Rate</span>
                            <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                                <i data-lucide="calendar-check" class="w-5 h-5"></i>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${attendanceStats.percentage}%</h3>
                            <p class="text-xs text-emerald-600 font-medium mt-1">${attendanceStats.presentDays} of ${attendanceStats.totalDays} sessions attended</p>
                        </div>
                    </div>

                    <!-- Cumulative GPA -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Mid-Term GPA</span>
                            <div class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                                <i data-lucide="award" class="w-5 h-5"></i>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${examSummary ? examSummary.gpa : '9.6'} / 10.0</h3>
                            <p class="text-xs text-indigo-600 font-medium mt-1">CBSE Grade: ${examSummary ? examSummary.grade : 'A1'} (${examSummary ? examSummary.percentage : '94.2'}%)</p>
                        </div>
                    </div>

                    <!-- Next Exam -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Exam</span>
                            <div class="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                                <i data-lucide="clock" class="w-5 h-5"></i>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="text-base font-bold text-slate-900 dark:text-white truncate">Final Board Exam</h3>
                            <p class="text-xs text-purple-600 font-medium mt-1">Starts March 2026</p>
                        </div>
                    </div>

                    <!-- Fee Status -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Tuition Status</span>
                            <div class="w-9 h-9 rounded-xl ${totalFeeDue === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center">
                                <i data-lucide="receipt" class="w-5 h-5"></i>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${totalFeeDue === 0 ? 'Fully Paid' : window.AppFormatters.formatCurrency(totalFeeDue, school.currency)}</h3>
                            <p class="text-xs ${totalFeeDue === 0 ? 'text-emerald-600' : 'text-amber-600'} font-medium mt-1">${totalFeeDue === 0 ? 'No outstanding dues' : 'Payment due soon'}</p>
                        </div>
                    </div>
                </div>

                <!-- Today's Homework Digital Diary Section -->
                <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                                <i data-lucide="book-open-check" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Today's Digital Diary & Homework (${window.AppFormatters.formatDate(todayDateStr)})</h3>
                                <p class="text-xs text-slate-500">Mark assignments as complete as you finish them</p>
                            </div>
                        </div>
                        <button onclick="window.app.navigate('homework')" class="text-xs font-semibold text-indigo-600 hover:underline">Full Diary &rarr;</button>
                    </div>

                    ${todayHomework.length > 0 ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${todayHomework.map(hw => {
                                const isDone = hw.studentCompletions && hw.studentCompletions[student.id];
                                return `
                                    <div class="p-4 rounded-xl border ${isDone ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'} flex flex-col justify-between space-y-3">
                                        <div>
                                            <div class="flex items-center justify-between mb-1.5">
                                                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                                    ${hw.subjectName}
                                                </span>
                                                <span class="text-[11px] font-semibold text-amber-600">
                                                    Due: ${window.AppFormatters.formatDate(hw.dueDate)}
                                                </span>
                                            </div>
                                            <h4 class="font-bold text-xs text-slate-900 dark:text-white">${hw.title}</h4>
                                            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">${hw.description}</p>
                                        </div>

                                        <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                            <span class="text-[10px] text-slate-400">By ${hw.teacherName}</span>
                                            <button onclick="window.HomeworkModule.toggleComplete('${hw.id}')" class="px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                                                isDone
                                                    ? 'bg-emerald-600 text-white shadow'
                                                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-500'
                                            }">
                                                <i data-lucide="${isDone ? 'check-check' : 'circle'}" class="w-3 h-3"></i>
                                                <span>${isDone ? 'Done' : 'Mark Done'}</span>
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `
                        <div class="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                            <p class="text-xs">No pending diary tasks recorded for today. Great job!</p>
                        </div>
                    `}
                </div>

                <!-- Two Column Layout: Class Timetable & Grades Overview -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Today's Classes -->
                    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Today's Schedule</h3>
                                <p class="text-xs text-slate-500">${dayName} Curriculum</p>
                            </div>
                            <button onclick="window.app.navigate('timetable')" class="text-xs font-semibold text-sky-600 hover:underline">Full Grid &rarr;</button>
                        </div>

                        <div class="space-y-3">
                            ${(todaySlots.length > 0 ? todaySlots : timetable.slice(0, 5)).map((slot, i) => `
                                <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <span class="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                                            ${slot.period}
                                        </span>
                                        <div>
                                            <h4 class="text-xs font-bold text-slate-900 dark:text-white">${slot.subject}</h4>
                                            <p class="text-[11px] text-slate-400">${slot.teacher} • ${slot.room}</p>
                                        </div>
                                    </div>
                                    <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                        ${slot.time.split(' - ')[0]}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Academic Performance & Grades Breakdown -->
                    <div class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Academic Marks - ${latestExam ? latestExam.title : 'Assessment'}</h3>
                                <p class="text-xs text-slate-500">Official subject scores, grading, and teacher comments</p>
                            </div>
                            ${gradeRecord ? `
                                <button onclick="window.StudentDashboard.downloadMyReportCard('${student.id}', '${latestExam.id}')" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition flex items-center space-x-1.5">
                                    <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                    <span>Download PDF</span>
                                </button>
                            ` : ''}
                        </div>

                        ${gradeRecord ? `
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-xs">
                                    <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px]">
                                        <tr>
                                            <th class="p-2.5">Subject</th>
                                            <th class="p-2.5 text-center">Max Marks</th>
                                            <th class="p-2.5 text-center">Score</th>
                                            <th class="p-2.5 text-center">Grade</th>
                                            <th class="p-2.5 text-center">GPA</th>
                                            <th class="p-2.5 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                        ${subjects.map(sub => {
                                            const mark = gradeRecord.marks[sub.id] || 0;
                                            const grade = window.AppFormatters.calculateGrade(mark, school.gradingScale);
                                            return `
                                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                                    <td class="p-2.5 font-medium text-slate-800 dark:text-slate-200">${sub.name}</td>
                                                    <td class="p-2.5 text-center text-slate-500">${sub.maxMarks || 100}</td>
                                                    <td class="p-2.5 text-center font-bold text-slate-900 dark:text-white">${mark}</td>
                                                    <td class="p-2.5 text-center font-bold text-indigo-600">${grade.grade}</td>
                                                    <td class="p-2.5 text-center text-slate-600">${grade.gpa.toFixed(1)}</td>
                                                    <td class="p-2.5 text-center">
                                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${mark >= sub.passMarks ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}">
                                                            ${mark >= sub.passMarks ? 'PASS' : 'FAIL'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>

                            <div class="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start space-x-3 text-xs">
                                <div class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
                                </div>
                                <div>
                                    <span class="font-bold text-slate-900 dark:text-white">Teacher's Evaluation Remark:</span>
                                    <p class="text-slate-600 dark:text-slate-300 italic mt-0.5">"${gradeRecord.teacherRemarks || 'Consistent performance throughout the term.'}"</p>
                                </div>
                            </div>
                        ` : `
                            <div class="text-center py-8 text-slate-400">
                                <i data-lucide="file-question" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
                                <p>No exam marks recorded yet for this session.</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    downloadMyReportCard(studentId, examId) {
        const student = window.store.getStudentById(studentId);
        const exam = window.store.getExamById(examId);
        const classInfo = window.store.getClassById(student.classId);
        const gradeRecord = window.store.getStudentGrade(examId, studentId);
        const subjects = window.store.getSubjects();
        const school = window.store.getSchool();

        window.AppPdfGenerator.generateReportCard(
            student,
            exam,
            classInfo,
            gradeRecord,
            subjects,
            school,
            school.gradingScale
        );
        window.app.showToast("Official Report Card PDF Downloaded", "success");
    }
};
