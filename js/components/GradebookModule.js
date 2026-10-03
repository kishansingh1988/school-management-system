// Gradebook, Examinations & PDF Report Card Module

window.GradebookModule = {
    selectedExam: 'ex-mid-2025',
    selectedClass: 'cls-10a',
    tempGrades: {},

    render() {
        const exams = window.store.getExams();
        const classes = window.store.getClasses();
        const subjects = window.store.getSubjects();
        const students = window.store.getStudentsByClass(this.selectedClass);
        const school = window.store.getSchool();
        const currentExam = window.store.getExamById(this.selectedExam) || exams[0];
        const currentUser = window.store.getCurrentUser();
        const canEdit = currentUser.role === 'admin' || currentUser.role === 'teacher';

        // Load existing grades into tempGrades
        this.tempGrades = {};
        students.forEach(s => {
            const existing = window.store.getStudentGrade(this.selectedExam, s.id);
            if (existing) {
                this.tempGrades[s.id] = JSON.parse(JSON.stringify(existing));
            } else {
                const defaultMarks = {};
                subjects.forEach(sub => defaultMarks[sub.id] = 85);
                this.tempGrades[s.id] = {
                    examId: this.selectedExam,
                    studentId: s.id,
                    classId: this.selectedClass,
                    marks: defaultMarks,
                    teacherRemarks: "Consistent academic progress demonstrated throughout the term.",
                    conduct: "Good",
                    attendancePercentage: 95
                };
            }
        });

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Examinations & Gradebook</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage assessments, input subject marks, and generate official downloadable PDF report cards</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        ${canEdit ? `
                            <button onclick="window.GradebookModule.openCreateExamModal()" class="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition flex items-center space-x-2">
                                <i data-lucide="plus" class="w-4 h-4 text-indigo-600"></i>
                                <span>Create Exam</span>
                            </button>
                            <button onclick="window.GradebookModule.saveAllGrades()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2">
                                <i data-lucide="save" class="w-4 h-4"></i>
                                <span>Save All Gradebook Marks</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Exam and Class Filter Bar -->
                <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-4">
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Select Examination</label>
                            <select onchange="window.GradebookModule.changeExam(this.value)" class="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                ${exams.map(e => `<option value="${e.id}" ${this.selectedExam === e.id ? 'selected' : ''}>${e.title} (${e.term})</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Select Class & Section</label>
                            <select onchange="window.GradebookModule.changeClass(this.value)" class="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                ${window.AppFormatters.renderGroupedClassOptions(classes, this.selectedClass)}
                            </select>
                        </div>
                    </div>

                    <div class="text-right">
                        <span class="text-xs text-slate-400 block">Grading Standard</span>
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900">
                            CBSE 8-Point Scale (A1 &ge; 91%, A2 &ge; 81%, B1 &ge; 71%, Pass &ge; 33%)
                        </span>
                    </div>
                </div>

                <!-- Grade Matrix Table -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th class="p-3 pl-5 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10">Student</th>
                                    ${subjects.map(sub => `
                                        <th class="p-3 text-center min-w-[70px]" title="${sub.name} (Max ${sub.maxMarks})">
                                            ${sub.name.split(' ')[0]}
                                            <span class="block text-[9px] text-slate-400 font-normal">/${sub.maxMarks}</span>
                                        </th>
                                    `).join('')}
                                    <th class="p-3 text-center">Total</th>
                                    <th class="p-3 text-center">%</th>
                                    <th class="p-3 text-center">Grade</th>
                                    <th class="p-3 text-center">GPA</th>
                                    <th class="p-3 pr-5 text-right">Report Card</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                ${students.map(s => {
                                    const record = this.tempGrades[s.id] || { marks: {} };
                                    const marks = record.marks || {};
                                    const summary = window.AppFormatters.calculateStudentExamSummary(marks, subjects, school.gradingScale);

                                    return `
                                        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                                            <td class="p-3 pl-5 sticky left-0 bg-white dark:bg-slate-900 z-10">
                                                <div class="flex items-center space-x-2.5 min-w-[150px]">
                                                    <img src="${s.avatar}" class="w-7 h-7 rounded-full object-cover border border-slate-200" alt="${s.name}">
                                                    <div>
                                                        <h4 class="font-bold text-slate-900 dark:text-white text-xs">${s.name}</h4>
                                                        <span class="text-[10px] text-slate-400">Roll #${s.rollNo}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            ${subjects.map(sub => {
                                                const score = marks[sub.id] !== undefined ? marks[sub.id] : 0;
                                                return `
                                                    <td class="p-2 text-center">
                                                        <input type="number" min="0" max="${sub.maxMarks || 100}" value="${score}" 
                                                            ${!canEdit ? 'disabled' : ''}
                                                            oninput="window.GradebookModule.updateMark('${s.id}', '${sub.id}', this.value)"
                                                            class="w-14 p-1.5 text-center text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500">
                                                    </td>
                                                `;
                                            }).join('')}

                                            <td class="p-3 text-center font-bold text-slate-800 dark:text-slate-200">
                                                ${summary.totalMarks} / ${summary.maxPossibleMarks}
                                            </td>

                                            <td class="p-3 text-center font-bold text-indigo-600">
                                                ${summary.percentage}%
                                            </td>

                                            <td class="p-3 text-center">
                                                <span class="px-2 py-0.5 rounded text-[11px] font-bold ${
                                                    summary.grade === 'A+' || summary.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                                                    summary.grade === 'B' || summary.grade === 'C' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                                                }">
                                                    ${summary.grade}
                                                </span>
                                            </td>

                                            <td class="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                                                ${summary.gpa.toFixed(1)}
                                            </td>

                                            <td class="p-3 pr-5 text-right">
                                                <button onclick="window.GradebookModule.downloadSingleReport('${s.id}')" title="Download Official PDF Report Card" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold rounded-lg transition flex items-center space-x-1.5 ml-auto text-[11px]">
                                                    <i data-lucide="file-down" class="w-3.5 h-3.5"></i>
                                                    <span>PDF Card</span>
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="gradebookModalContainer"></div>
            </div>
        `;
    },

    changeExam(examId) {
        this.selectedExam = examId;
        window.app.renderCurrentView();
    },

    changeClass(classId) {
        this.selectedClass = classId;
        window.app.renderCurrentView();
    },

    updateMark(studentId, subjectId, val) {
        if (!this.tempGrades[studentId]) return;
        this.tempGrades[studentId].marks[subjectId] = Number(val) || 0;
    },

    saveAllGrades() {
        Object.keys(this.tempGrades).forEach(stuId => {
            window.store.saveStudentGrade(this.tempGrades[stuId]);
        });
        window.app.showToast("Gradebook marks and evaluations saved successfully", "success");
        window.app.renderCurrentView();
    },

    downloadSingleReport(studentId) {
        const student = window.store.getStudentById(studentId);
        const exam = window.store.getExamById(this.selectedExam);
        const classInfo = window.store.getClassById(student.classId);
        const subjects = window.store.getSubjects();
        const school = window.store.getSchool();
        const gradeRecord = this.tempGrades[studentId] || window.store.getStudentGrade(this.selectedExam, studentId);

        window.AppPdfGenerator.generateReportCard(
            student,
            exam,
            classInfo,
            gradeRecord,
            subjects,
            school,
            school.gradingScale
        );
        window.app.showToast(`Downloaded Official Report Card for ${student.name}`, "success");
    },

    openCreateExamModal() {
        const container = document.getElementById("gradebookModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-base">Schedule New Examination</h3>
                        <button onclick="document.getElementById('gradebookModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.GradebookModule.handleCreateExamSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assessment Title *</label>
                            <input name="title" required placeholder="e.g. Unit Test 2 (Science & Math)" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Term</label>
                                <select name="term" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Term 1">Term 1</option>
                                    <option value="Term 2">Term 2</option>
                                    <option value="Final Board">Final Board</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select name="status" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Published">Published</option>
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                                <input name="startDate" type="date" value="2025-11-01" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                                <input name="endDate" type="date" value="2025-11-10" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('gradebookModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Create Assessment</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleCreateExamSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const newExam = {
            title: formData.get("title"),
            term: formData.get("term"),
            status: formData.get("status"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            session: window.store.getSchool().academicYear
        };

        const created = window.store.addExam(newExam);
        this.selectedExam = created.id;
        document.getElementById('gradebookModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Assessment "${created.title}" published`, "success");
    }
};
