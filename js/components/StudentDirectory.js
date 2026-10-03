// Student Directory & Management Module

window.StudentDirectory = {
    selectedClass: 'all',
    searchQuery: '',
    selectedStudentForModal: null,

    render() {
        const classes = window.store.getClasses();
        const allStudents = window.store.getStudents();
        const currentUser = window.store.getCurrentUser();
        const canEdit = currentUser.role === 'admin' || currentUser.role === 'teacher';

        // Filter students
        let filtered = allStudents.filter(s => {
            const matchesClass = this.selectedClass === 'all' || s.classId === this.selectedClass;
            const q = this.searchQuery.toLowerCase();
            const matchesSearch = !q || 
                s.name.toLowerCase().includes(q) || 
                s.admissionNo.toLowerCase().includes(q) || 
                (s.rollNo && s.rollNo.toString().includes(q)) ||
                (s.parentName && s.parentName.toLowerCase().includes(q));
            return matchesClass && matchesSearch;
        });

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Top Header & Action Controls -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Directory</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage student admissions, academic rosters, parent records, and profiles</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2.5">
                        <button onclick="window.StudentDirectory.exportCSV()" class="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition flex items-center space-x-2">
                            <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-600"></i>
                            <span>Export CSV</span>
                        </button>
                        ${canEdit ? `
                            <button onclick="window.StudentDirectory.openAddSectionModal()" class="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center space-x-2">
                                <i data-lucide="layout-grid" class="w-4 h-4 text-indigo-600"></i>
                                <span>+ Add Section</span>
                            </button>
                            <button onclick="window.StudentDirectory.openAddModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-2">
                                <i data-lucide="user-plus" class="w-4 h-4"></i>
                                <span>Enroll New Student</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Filter & Search Bar -->
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div class="flex items-center space-x-3 w-full md:w-auto">
                        <label class="text-xs font-bold uppercase text-slate-400 whitespace-nowrap">Filter Class & Section:</label>
                        <select onchange="window.StudentDirectory.filterClass(this.value)" class="w-full md:w-72 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                            <option value="all" ${this.selectedClass === 'all' ? 'selected' : ''}>All Classes & Sections (${allStudents.length} Students)</option>
                            ${window.AppFormatters.renderGroupedClassOptions(classes, this.selectedClass)}
                        </select>
                    </div>

                    <div class="relative w-full md:w-72">
                        <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
                        <input type="text" value="${this.searchQuery}" oninput="window.StudentDirectory.search(this.value)" placeholder="Search name, roll #, adm, parent..." class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                </div>

                <!-- Students Table -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th class="p-3.5 pl-6">Student Information</th>
                                    <th class="p-3.5">Admission / Roll</th>
                                    <th class="p-3.5">Class & Section</th>
                                    <th class="p-3.5">Parent / Guardian</th>
                                    <th class="p-3.5 text-center">Attendance</th>
                                    <th class="p-3.5 text-center">Status</th>
                                    <th class="p-3.5 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                ${filtered.length > 0 ? filtered.map(s => {
                                    const classItem = window.store.getClassById(s.classId);
                                    const attStats = window.AppFormatters.calculateStudentAttendanceStats(s.id, window.store.getAllAttendance());
                                    return `
                                        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                                            <td class="p-3.5 pl-6">
                                                <div class="flex items-center space-x-3">
                                                    <img src="${s.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256'}" class="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="${s.name}">
                                                    <div>
                                                        <h4 class="font-bold text-slate-900 dark:text-white text-xs">${s.name}</h4>
                                                        <p class="text-[11px] text-slate-400">${s.email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="p-3.5">
                                                <div class="font-semibold text-slate-800 dark:text-slate-200">${s.admissionNo}</div>
                                                <div class="text-[11px] text-slate-400">Roll #${s.rollNo}</div>
                                            </td>
                                            <td class="p-3.5">
                                                <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                                                    ${classItem ? `${classItem.name} - ${classItem.section}` : 'Unassigned'}
                                                </span>
                                            </td>
                                            <td class="p-3.5">
                                                <div class="font-medium text-slate-800 dark:text-slate-200">${s.parentName || 'Parent On Record'}</div>
                                                <div class="text-[11px] text-slate-400">${s.parentPhone || s.phone}</div>
                                            </td>
                                            <td class="p-3.5 text-center">
                                                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${attStats.percentage >= 90 ? 'bg-emerald-100 text-emerald-700' : (attStats.percentage >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}">
                                                    ${attStats.percentage}%
                                                </span>
                                            </td>
                                            <td class="p-3.5 text-center">
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}">
                                                    ${s.status || 'Active'}
                                                </span>
                                            </td>
                                            <td class="p-3.5 pr-6 text-right">
                                                <div class="flex items-center justify-end space-x-1.5">
                                                    <button onclick="window.StudentDirectory.viewProfile('${s.id}')" title="View Detailed Profile" class="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition">
                                                        <i data-lucide="eye" class="w-4 h-4"></i>
                                                    </button>
                                                    ${canEdit ? `
                                                        <button onclick="window.StudentDirectory.openEditModal('${s.id}')" title="Edit Student" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition">
                                                            <i data-lucide="edit" class="w-4 h-4"></i>
                                                        </button>
                                                        <button onclick="window.StudentDirectory.deleteStudent('${s.id}')" title="Delete Student" class="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition">
                                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('') : `
                                    <tr>
                                        <td colspan="7" class="text-center py-12 text-slate-400">
                                            <i data-lucide="user-x" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
                                            <p>No student records match your query.</p>
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Modals Container -->
                <div id="studentModalContainer"></div>
            </div>
        `;
    },

    filterClass(classId) {
        this.selectedClass = classId;
        window.app.renderCurrentView();
    },

    search(query) {
        this.searchQuery = query;
        window.app.renderCurrentView();
    },

    viewProfile(studentId) {
        const s = window.store.getStudentById(studentId);
        if (!s) return;

        const classItem = window.store.getClassById(s.classId);
        const school = window.store.getSchool();
        const subjects = window.store.getSubjects();
        const exams = window.store.getExams();
        const latestExam = exams[0];
        const gradeRecord = latestExam ? window.store.getStudentGrade(latestExam.id, s.id) : null;
        const attStats = window.AppFormatters.calculateStudentAttendanceStats(s.id, window.store.getAllAttendance());
        const fees = window.store.getStudentFees(s.id);

        const container = document.getElementById("studentModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4 max-h-[90vh] flex flex-col">
                    <!-- Modal Header -->
                    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <img src="${s.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256'}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow" alt="${s.name}">
                            <div>
                                <h3 class="text-xl font-bold">${s.name}</h3>
                                <p class="text-xs text-indigo-100">${s.admissionNo} • Roll #${s.rollNo} • ${classItem ? classItem.name + ' - ' + classItem.section : 'Class N/A'}</p>
                            </div>
                        </div>
                        <button onclick="document.getElementById('studentModalContainer').innerHTML = ''" class="p-2 hover:bg-white/20 rounded-full text-white transition">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                        <!-- Demographics Grid -->
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                            <div>
                                <span class="text-slate-400 block text-[11px]">Date of Birth</span>
                                <strong class="text-slate-800 dark:text-slate-200">${window.AppFormatters.formatDate(s.dob)}</strong>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[11px]">Gender & Blood</span>
                                <strong class="text-slate-800 dark:text-slate-200">${s.gender} (${s.bloodGroup || 'O+'})</strong>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[11px]">Attendance Standing</span>
                                <strong class="text-emerald-600 font-bold">${attStats.percentage}% (${attStats.presentDays}/${attStats.totalDays} days)</strong>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[11px]">Parent / Guardian</span>
                                <strong class="text-slate-800 dark:text-slate-200">${s.parentName}</strong>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[11px]">Parent Contact</span>
                                <strong class="text-slate-800 dark:text-slate-200">${s.parentPhone || s.phone}</strong>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[11px]">Residential Address</span>
                                <strong class="text-slate-800 dark:text-slate-200 truncate block">${s.address || 'Springfield'}</strong>
                            </div>
                        </div>

                        <!-- Academic Record -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-slate-900 dark:text-white text-sm">Academic Performance (${latestExam ? latestExam.title : 'Assessment'})</h4>
                                ${gradeRecord ? `
                                    <button onclick="window.AppPdfGenerator.generateReportCard(window.store.getStudentById('${s.id}'), window.store.getExamById('${latestExam.id}'), window.store.getClassById('${s.classId}'), window.store.getStudentGrade('${latestExam.id}', '${s.id}'), window.store.getSubjects(), window.store.getSchool(), window.store.getSchool().gradingScale)" class="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center space-x-1">
                                        <i data-lucide="file-down" class="w-3.5 h-3.5"></i>
                                        <span>Download PDF Report</span>
                                    </button>
                                ` : ''}
                            </div>
                            ${gradeRecord ? `
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    ${subjects.map(sub => {
                                        const mark = gradeRecord.marks[sub.id] || 0;
                                        const gr = window.AppFormatters.calculateGrade(mark, school.gradingScale);
                                        return `
                                            <div class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
                                                <span class="text-slate-600 dark:text-slate-300 font-medium">${sub.name}</span>
                                                <span class="font-bold ${mark >= sub.passMarks ? 'text-indigo-600' : 'text-red-600'}">${mark} (${gr.grade})</span>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : '<p class="text-slate-400 italic">No grade evaluations recorded yet.</p>'}
                        </div>

                        <!-- Fee History -->
                        <div>
                            <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-2">Fee Ledger Invoices</h4>
                            <div class="space-y-2">
                                ${fees.map(f => `
                                    <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-800">
                                        <div>
                                            <span class="font-semibold text-slate-800 dark:text-slate-200">${f.title} (${f.invoiceNo})</span>
                                            <p class="text-[11px] text-slate-400">Total: ${window.AppFormatters.formatCurrency(f.totalAmount, school.currency)} • Paid: ${window.AppFormatters.formatCurrency(f.paidAmount, school.currency)}</p>
                                        </div>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                                            ${f.status.toUpperCase()}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                        <button onclick="document.getElementById('studentModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition">
                            Close Profile
                        </button>
                    </div>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    openAddSectionModal() {
        const teachers = window.store.getTeachers();
        const container = document.getElementById("studentModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Add New Class Section</h3>
                            <p class="text-xs text-indigo-100">Create a new section for any school grade (e.g. Class 10-C)</p>
                        </div>
                        <button onclick="document.getElementById('studentModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.StudentDirectory.handleAddSectionSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Grade / Class *</label>
                                <select name="name" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                                    <option value="Playgroup">Playgroup</option>
                                    <option value="Nursery">Nursery</option>
                                    <option value="LKG">LKG</option>
                                    <option value="UKG">UKG</option>
                                    <option value="Class 1">Class 1</option>
                                    <option value="Class 2">Class 2</option>
                                    <option value="Class 3">Class 3</option>
                                    <option value="Class 4">Class 4</option>
                                    <option value="Class 5">Class 5</option>
                                    <option value="Class 6">Class 6</option>
                                    <option value="Class 7">Class 7</option>
                                    <option value="Class 8">Class 8</option>
                                    <option value="Class 9">Class 9</option>
                                    <option value="Class 10" selected>Class 10</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Section Identifier *</label>
                                <input name="section" required placeholder="e.g. C, D, E" value="C" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold uppercase">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Curriculum Stage *</label>
                                <select name="stage" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Foundational (Pre-School)">Foundational (Pre-School)</option>
                                    <option value="Primary">Primary</option>
                                    <option value="Preparatory">Preparatory</option>
                                    <option value="Middle Stage">Middle Stage</option>
                                    <option value="Secondary (Board Exam)" selected>Secondary (Board Exam)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Room / Wing</label>
                                <input name="room" placeholder="e.g. Room 408 (Senior Block)" value="Room 408 (Senior Block)" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Class Mentor / In-Charge</label>
                            <select name="teacherId" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.designation || 'Faculty'})</option>`).join('')}
                            </select>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('studentModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Create Section</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleAddSectionSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const newClassSection = {
            name: formData.get("name"),
            section: formData.get("section").trim().toUpperCase(),
            stage: formData.get("stage"),
            room: formData.get("room"),
            teacherId: formData.get("teacherId"),
            studentCount: 0
        };

        window.store.addClassSection(newClassSection);
        document.getElementById('studentModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Added ${newClassSection.name} - Section ${newClassSection.section} successfully`, 'success');
    },

    openAddModal() {
        const classes = window.store.getClasses();
        const container = document.getElementById("studentModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-lg">Enroll New Student</h3>
                        <button onclick="document.getElementById('studentModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.StudentDirectory.handleAddSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                                <input name="name" required placeholder="e.g. Julian Hayes" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number *</label>
                                <input name="rollNo" required placeholder="e.g. 106" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Class & Section *</label>
                                <select name="classId" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                    ${window.AppFormatters.renderGroupedClassOptions(classes)}
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
                                <select name="gender" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                                <input name="dob" type="date" value="2009-05-15" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                                <input name="bloodGroup" placeholder="e.g. O+, A+, B-" value="O+" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent / Guardian Name *</label>
                                <input name="parentName" required placeholder="e.g. Michael Hayes" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Phone *</label>
                                <input name="parentPhone" required placeholder="+1 (555) 000-0000" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Residential Address</label>
                            <input name="address" placeholder="Street Address, City" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('studentModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Save Student</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleAddSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const newStudent = {
            name: formData.get("name"),
            rollNo: formData.get("rollNo"),
            classId: formData.get("classId"),
            gender: formData.get("gender"),
            dob: formData.get("dob"),
            bloodGroup: formData.get("bloodGroup"),
            parentName: formData.get("parentName"),
            parentPhone: formData.get("parentPhone"),
            address: formData.get("address"),
            email: `${formData.get("name").toLowerCase().replace(/\s+/g, '.')}@student.apexhorizon.edu`,
            status: "Active",
            avatar: `https://images.unsplash.com/photo-${formData.get("gender") === 'Female' ? '1544005313-94ddf0286df2' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&q=80&w=256`
        };

        window.store.addStudent(newStudent);
        document.getElementById('studentModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Enrolled ${newStudent.name} successfully`, 'success');
    },

    openEditModal(studentId) {
        const s = window.store.getStudentById(studentId);
        if (!s) return;
        const classes = window.store.getClasses();
        const container = document.getElementById("studentModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-lg">Edit Student Details</h3>
                        <button onclick="document.getElementById('studentModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.StudentDirectory.handleEditSubmit(event, '${s.id}')" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input name="name" value="${s.name}" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number</label>
                                <input name="rollNo" value="${s.rollNo}" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Class & Section</label>
                                <select name="classId" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                    ${window.AppFormatters.renderGroupedClassOptions(classes, s.classId)}
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select name="status" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Active" ${s.status === 'Active' ? 'selected' : ''}>Active</option>
                                    <option value="Inactive" ${s.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="Graduated" ${s.status === 'Graduated' ? 'selected' : ''}>Graduated</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Name</label>
                                <input name="parentName" value="${s.parentName || ''}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Phone</label>
                                <input name="parentPhone" value="${s.parentPhone || s.phone || ''}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                            <input name="address" value="${s.address || ''}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('studentModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Update Student</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleEditSubmit(e, studentId) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const updated = {
            name: formData.get("name"),
            rollNo: formData.get("rollNo"),
            classId: formData.get("classId"),
            status: formData.get("status"),
            parentName: formData.get("parentName"),
            parentPhone: formData.get("parentPhone"),
            address: formData.get("address")
        };

        window.store.updateStudent(studentId, updated);
        document.getElementById('studentModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast("Student details updated", "success");
    },

    deleteStudent(studentId) {
        const s = window.store.getStudentById(studentId);
        if (!s) return;
        if (confirm(`Are you sure you want to remove ${s.name} from the school directory?`)) {
            window.store.deleteStudent(studentId);
            window.app.renderCurrentView();
            window.app.showToast(`Student record deleted`, "info");
        }
    },

    exportCSV() {
        const students = window.store.getStudents();
        const classes = window.store.getClasses();

        let csv = "Admission No,Roll No,Full Name,Class,Gender,Date of Birth,Parent Name,Parent Phone,Address,Status\n";
        students.forEach(s => {
            const c = classes.find(cls => cls.id === s.classId);
            const className = c ? `${c.name} ${c.section}` : "N/A";
            csv += `"${s.admissionNo}","${s.rollNo}","${s.name}","${className}","${s.gender}","${s.dob}","${s.parentName || ''}","${s.parentPhone || ''}","${s.address || ''}","${s.status || 'Active'}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Students_Apex_Horizon_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        link.remove();
        window.app.showToast("Student roster CSV exported", "success");
    }
};
