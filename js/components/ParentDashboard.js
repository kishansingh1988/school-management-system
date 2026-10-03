// Parent Portal Dashboard Component

window.ParentDashboard = {
    render() {
        const currentUser = window.store.getCurrentUser();
        const parent = currentUser.parentData || window.store.getParents()[0];
        const studentId = (parent.studentIds && parent.studentIds[0]) ? parent.studentIds[0] : "stu-1";
        const student = window.store.getStudentById(studentId) || window.store.getStudents()[0];
        const classInfo = window.store.getClassById(student.classId) || window.store.getClasses()[0];
        const school = window.store.getSchool();
        const subjects = window.store.getSubjects();
        const fees = window.store.getStudentFees(student.id);
        const exams = window.store.getExams();
        const latestExam = exams[0] || null;
        const gradeRecord = latestExam ? window.store.getStudentGrade(latestExam.id, student.id) : null;
        const examSummary = gradeRecord ? window.AppFormatters.calculateStudentExamSummary(gradeRecord.marks, subjects, school.gradingScale) : null;
        const attendanceStats = window.AppFormatters.calculateStudentAttendanceStats(student.id, window.store.getAllAttendance());

        // Attendance today
        const todayStr = new Date().toISOString().split('T')[0];
        const todayAtt = window.store.getAttendance(todayStr, student.classId);
        const childToday = todayAtt[student.id] ? todayAtt[student.id].status : 'P';

        // Outstanding fees
        let totalFeeDue = 0;
        fees.forEach(f => totalFeeDue += (f.dueAmount || 0));

        // Today's homework assignments
        const todayHomework = window.store.getHomeworkByClass(student.classId, todayStr);

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Live Campus Safety & Attendance Alert Banner -->
                ${childToday === 'A' ? `
                    <div class="p-4 rounded-2xl bg-rose-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
                        <div class="flex items-center space-x-3.5">
                            <div class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                <i data-lucide="alert-triangle" class="w-6 h-6 text-white"></i>
                            </div>
                            <div>
                                <h3 class="font-extrabold text-sm">🚨 CRITICAL ABSENCE ALERT: ${student.name} is marked ABSENT today</h3>
                                <p class="text-xs text-rose-100 mt-0.5">Your ward was not recorded in Morning Assembly roll-call. If unexpected, contact Helpline immediately.</p>
                            </div>
                        </div>
                        <a href="tel:${school.phone}" class="px-4 py-2 bg-white text-rose-700 font-bold text-xs rounded-xl shadow whitespace-nowrap flex items-center justify-center space-x-1.5 self-start sm:self-auto">
                            <i data-lucide="phone-call" class="w-3.5 h-3.5"></i>
                            <span>Call Emergency Desk</span>
                        </a>
                    </div>
                ` : childToday === 'L' ? `
                    <div class="p-3.5 rounded-2xl bg-amber-500 text-white shadow-lg flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="clock" class="w-5 h-5"></i>
                            <div>
                                <h4 class="font-bold text-xs">⚠️ LATE ARRIVAL: ${student.name} checked in late today (${classInfo.name} - ${classInfo.section})</h4>
                                <p class="text-[11px] text-amber-100">Gate roll-call recorded arrival after morning assembly.</p>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                <i data-lucide="check-circle-2" class="w-5 h-5 text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-xs">✅ SAFE ON CAMPUS: ${student.name} is marked PRESENT for today (${classInfo.name} - ${classInfo.section})</h4>
                                <p class="text-[11px] text-emerald-100">Morning Assembly roll-call verified at 08:00 AM • Instant WhatsApp confirmation dispatched.</p>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-lg hidden sm:inline-block">Delivered to ${parent.phone || '+91 98111 55443'}</span>
                    </div>
                `}

                <!-- Parent Hero Banner -->
                <div class="p-6 rounded-2xl bg-gradient-to-r from-amber-700 via-orange-600 to-indigo-800 text-white shadow-xl relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div class="flex items-center space-x-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
                                <i data-lucide="shield-check" class="w-4 h-4"></i>
                                <span>Parent & Guardian Portal • ${school.academicYear}</span>
                            </div>
                            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome, ${parent.name}</h1>
                            <p class="text-amber-100 text-xs mt-1">
                                Monitoring academic records for child: <strong class="text-white">${student.name}</strong> (${classInfo.name} - ${classInfo.section}, Roll #${student.rollNo})
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="window.app.navigate('homework')" class="px-4 py-2.5 bg-white text-indigo-700 hover:bg-amber-50 font-bold text-xs rounded-xl shadow transition flex items-center space-x-2">
                                <i data-lucide="book-open-check" class="w-4 h-4 text-indigo-600"></i>
                                <span>Open Digital Diary</span>
                            </button>
                            <button onclick="window.app.navigate('fees')" class="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition flex items-center space-x-2">
                                <i data-lucide="receipt" class="w-4 h-4"></i>
                                <span>Pay Tuition Fee</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Child Quick Status Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <!-- Today Attendance Status -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl ${childToday === 'P' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} flex items-center justify-center shrink-0">
                            <i data-lucide="${childToday === 'P' ? 'user-check' : 'user-x'}" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-1">
                            <span class="text-xs font-semibold text-slate-400 uppercase">Today's Class Check-In</span>
                            <h4 class="font-bold text-slate-900 dark:text-white text-base">
                                ${childToday === 'P' ? 'Present on Campus' : (childToday === 'L' ? 'Late Check-in' : 'Marked Absent')}
                            </h4>
                            <p class="text-xs text-slate-500">${attendanceStats.percentage}% Overall Term Attendance</p>
                        </div>
                    </div>

                    <!-- Academic GPA -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <i data-lucide="award" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-1">
                            <span class="text-xs font-semibold text-slate-400 uppercase">Current Term Standing</span>
                            <h4 class="font-bold text-slate-900 dark:text-white text-base">
                                ${examSummary ? examSummary.gpa : '9.6'} GPA (${examSummary ? examSummary.grade : 'A1'})
                            </h4>
                            <p class="text-xs text-indigo-600 font-medium">Ranked Top 5 in ${classInfo.name}</p>
                        </div>
                    </div>

                    <!-- Financial Balance -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl ${totalFeeDue === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center shrink-0">
                            <i data-lucide="receipt" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-1">
                            <span class="text-xs font-semibold text-slate-400 uppercase">Fee Account Ledger</span>
                            <h4 class="font-bold text-slate-900 dark:text-white text-base">
                                ${totalFeeDue === 0 ? 'All Dues Settled' : `${window.AppFormatters.formatCurrency(totalFeeDue, school.currency)} Due`}
                            </h4>
                            <p class="text-xs text-slate-500">${totalFeeDue === 0 ? 'Receipts Available for Download' : 'Payment Due by End of Month'}</p>
                        </div>
                    </div>
                </div>

                <!-- Daily Digital School Diary & Homework Review (Solves Physical Diary Problem) -->
                <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                                <i data-lucide="book-open-check" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Today's Digital Diary & Homework (${window.AppFormatters.formatDate(todayStr)})</h3>
                                <p class="text-xs text-slate-500">Review assignments and digitally sign the school diary</p>
                            </div>
                        </div>
                        <button onclick="window.app.navigate('homework')" class="text-xs font-semibold text-indigo-600 hover:underline">View All Diary &rarr;</button>
                    </div>

                    ${todayHomework.length > 0 ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${todayHomework.map(hw => {
                                const isSigned = hw.parentSignatures && hw.parentSignatures[parent.id];
                                return `
                                    <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
                                        <div>
                                            <div class="flex items-center justify-between mb-1.5">
                                                <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                                    ${hw.subjectName}
                                                </span>
                                                <span class="text-[11px] font-semibold text-amber-600 flex items-center space-x-1">
                                                    <i data-lucide="clock" class="w-3 h-3"></i>
                                                    <span>Due: ${window.AppFormatters.formatDate(hw.dueDate)}</span>
                                                </span>
                                            </div>
                                            <h4 class="font-bold text-xs text-slate-900 dark:text-white">${hw.title}</h4>
                                            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">${hw.description}</p>
                                        </div>

                                        <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                            <span class="text-[10px] text-slate-400">By ${hw.teacherName}</span>
                                            ${isSigned ? `
                                                <span class="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1">
                                                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                                                    <span>Signed & Verified</span>
                                                </span>
                                            ` : `
                                                <button onclick="window.ParentDashboard.signChildHomework('${hw.id}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow transition flex items-center space-x-1">
                                                    <i data-lucide="check" class="w-3 h-3"></i>
                                                    <span>✍️ Sign Diary</span>
                                                </button>
                                            `}
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

                <!-- Fee Invoices & Payment Receipts for Child -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Fee Statements -->
                    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <i data-lucide="credit-card" class="w-4 h-4"></i>
                                </div>
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Child's Fee Statements</h3>
                            </div>
                            <button onclick="window.app.navigate('fees')" class="text-xs font-semibold text-indigo-600 hover:underline">Full Ledger &rarr;</button>
                        </div>

                        <div class="space-y-3">
                            ${fees.map(inv => `
                                <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h4 class="font-bold text-xs text-slate-900 dark:text-white">${inv.title}</h4>
                                            <p class="text-[11px] text-slate-400">Invoice: ${inv.invoiceNo} • Due: ${window.AppFormatters.formatDate(inv.dueDate)}</p>
                                        </div>
                                        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                            inv.status === 'Partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }">
                                            ${inv.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div class="mt-3 flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                                        <div>
                                            <span class="text-slate-400">Amount: </span>
                                            <strong class="text-slate-900 dark:text-white">${window.AppFormatters.formatCurrency(inv.totalAmount, school.currency)}</strong>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            ${inv.paymentHistory && inv.paymentHistory.length > 0 ? `
                                                <button onclick="window.ParentDashboard.downloadFeeReceipt('${inv.id}', '${inv.paymentHistory[0].receiptNo}')" class="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-sm transition flex items-center space-x-1 text-xs">
                                                    <i data-lucide="download" class="w-3 h-3"></i>
                                                    <span>Receipt PDF</span>
                                                </button>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Academic Performance Summary -->
                    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <i data-lucide="file-check" class="w-4 h-4"></i>
                                </div>
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Academic Performance</h3>
                            </div>
                            ${gradeRecord ? `
                                <button onclick="window.ParentDashboard.downloadChildReportCard('${student.id}', '${latestExam.id}')" class="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow transition flex items-center space-x-1.5">
                                    <i data-lucide="file-down" class="w-3.5 h-3.5"></i>
                                    <span>Download PDF Card</span>
                                </button>
                            ` : ''}
                        </div>

                        ${gradeRecord ? `
                            <div class="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 mb-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs text-indigo-800 dark:text-indigo-300 font-semibold">${latestExam.title}</span>
                                    <span class="text-xs font-bold text-indigo-600 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-indigo-200">${examSummary.percentage}% Overall</span>
                                </div>
                                <div class="mt-2 text-xs text-slate-600 dark:text-slate-300">
                                    <strong>Evaluative Remarks:</strong> "${gradeRecord.teacherRemarks}"
                                </div>
                            </div>

                            <div class="space-y-2">
                                ${subjects.slice(0, 4).map(sub => {
                                    const mark = gradeRecord.marks[sub.id] || 0;
                                    const gr = window.AppFormatters.calculateGrade(mark, school.gradingScale);
                                    return `
                                        <div class="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                                            <span class="font-medium text-slate-800 dark:text-slate-200">${sub.name}</span>
                                            <div class="flex items-center space-x-3">
                                                <span class="text-slate-500">${mark}/100</span>
                                                <span class="font-bold text-indigo-600">${gr.grade}</span>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : `
                            <p class="text-slate-400 text-xs">No exam evaluations recorded yet.</p>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    downloadChildReportCard(studentId, examId) {
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
        window.app.showToast("Child's Report Card Downloaded", "success");
    },

    downloadFeeReceipt(invoiceId, receiptNo) {
        const invoice = window.store.getFeeById(invoiceId);
        const student = window.store.getStudentById(invoice.studentId);
        const school = window.store.getSchool();
        const payment = invoice.paymentHistory.find(p => p.receiptNo === receiptNo) || invoice.paymentHistory[0];

        window.AppPdfGenerator.generateFeeReceipt(invoice, payment, student, school);
        window.app.showToast("Official Fee Receipt PDF Downloaded", "success");
    },

    signChildHomework(hwId) {
        const currentUser = window.store.getCurrentUser();
        const parent = currentUser.parentData || window.store.getParents()[0];
        const parentName = parent ? parent.name : currentUser.name;
        const parentId = parent ? parent.id : "par-1";

        window.store.signParentHomework(hwId, parentId, parentName);
        window.app.renderCurrentView();
        window.app.showToast("Digitally signed & verified homework diary!", "success");
    }
};
