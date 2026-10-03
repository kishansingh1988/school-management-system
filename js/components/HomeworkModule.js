// Daily Digital School Diary & Homework Management Module (Indian School Ecosystem)

window.HomeworkModule = {
    selectedClass: 'cls-10a',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedSubject: 'all',

    render() {
        const classes = window.store.getClasses();
        const subjects = window.store.getSubjects();
        const currentUser = window.store.getCurrentUser();
        const role = currentUser.role;
        const canPost = role === 'admin' || role === 'teacher';

        // Get student or parent context if applicable
        let student = null;
        let parent = null;
        if (role === 'student') {
            student = currentUser.studentData || window.store.getStudents()[0];
            if (student) this.selectedClass = student.classId;
        } else if (role === 'parent') {
            parent = currentUser.parentData || window.store.getParents()[0];
            if (parent && parent.studentIds && parent.studentIds.length > 0) {
                student = window.store.getStudentById(parent.studentIds[0]);
                if (student) this.selectedClass = student.classId;
            }
        }

        // Fetch homework list
        let homeworkList = window.store.getHomeworkByClass(this.selectedClass, this.selectedDate);
        if (this.selectedSubject !== 'all') {
            homeworkList = homeworkList.filter(h => h.subjectId === this.selectedSubject);
        }

        // Selected class info
        const activeClass = window.store.getClassById(this.selectedClass);

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Top Header Banner -->
                <div class="p-6 rounded-2xl bg-gradient-to-r from-teal-700 via-indigo-700 to-purple-800 text-white shadow-xl relative overflow-hidden">
                    <div class="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div class="flex items-center space-x-2 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-1">
                                <i data-lucide="book-open-check" class="w-4 h-4"></i>
                                <span>Digital Student Diary & Daily Homework Broadcast</span>
                            </div>
                            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">
                                ${role === 'parent' ? "Ward's Daily Digital Diary" : (role === 'student' ? "My Daily Homework Diary" : "Class Daily Homework & Diary")}
                            </h1>
                            <p class="text-teal-100 text-xs mt-1 max-w-2xl">
                                Replaces physical school diaries with instant digital homework broadcasts, worksheet attachments, and 1-click verified parent signatures.
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2.5">
                            ${canPost ? `
                                <button onclick="window.HomeworkModule.openCreateModal()" class="px-4 py-2.5 bg-white text-indigo-700 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2">
                                    <i data-lucide="plus-circle" class="w-4 h-4 text-indigo-600"></i>
                                    <span>+ Post Daily Homework</span>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Diary Filter Controls Bar -->
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-3">
                        ${role !== 'student' && role !== 'parent' ? `
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Class & Section</label>
                                <select onchange="window.HomeworkModule.changeClass(this.value)" class="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                    ${window.AppFormatters.renderGroupedClassOptions(classes, this.selectedClass)}
                                </select>
                            </div>
                        ` : `
                            <div class="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-900">
                                <span class="text-[10px] uppercase font-bold text-indigo-500 block">Active Student Class</span>
                                <span class="text-xs font-bold text-slate-900 dark:text-white">${activeClass ? activeClass.name + ' - ' + activeClass.section : 'Class 10-A'}</span>
                            </div>
                        `}

                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Diary Date</label>
                            <input type="date" value="${this.selectedDate}" onchange="window.HomeworkModule.changeDate(this.value)" class="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Filter Subject</label>
                            <select onchange="window.HomeworkModule.changeSubject(this.value)" class="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                <option value="all">All Assigned Subjects</option>
                                ${subjects.map(s => `<option value="${s.id}" ${this.selectedSubject === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <!-- Quick Summary Count -->
                    <div class="text-right flex items-center space-x-3 pt-2 md:pt-0">
                        <div class="text-xs text-slate-500">
                            <span class="font-bold text-indigo-600 dark:text-indigo-400">${homeworkList.length}</span> Diary Entries for ${window.AppFormatters.formatDate(this.selectedDate)}
                        </div>
                    </div>
                </div>

                <!-- Diary Cards Feed -->
                ${homeworkList.length > 0 ? `
                    <div class="space-y-4">
                        ${homeworkList.map((hw, idx) => {
                            const isStudentDone = student && hw.studentCompletions && hw.studentCompletions[student.id];
                            const isParentSigned = parent && hw.parentSignatures && hw.parentSignatures[parent.id];
                            const signedCount = Object.keys(hw.parentSignatures || {}).length;
                            const doneCount = Object.keys(hw.studentCompletions || {}).length;

                            return `
                                <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                        <div class="flex items-start space-x-3.5">
                                            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                                                ${idx + 1}
                                            </div>
                                            <div>
                                                <div class="flex flex-wrap items-center gap-2 mb-1">
                                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                                        ${hw.subjectName}
                                                    </span>
                                                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        ${hw.type || 'Homework'}
                                                    </span>
                                                    <span class="text-xs text-slate-400">
                                                        By ${hw.teacherName}
                                                    </span>
                                                </div>
                                                <h3 class="text-base font-bold text-slate-900 dark:text-white">${hw.title}</h3>
                                            </div>
                                        </div>

                                        <div class="flex items-center space-x-2">
                                            <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 flex items-center space-x-1">
                                                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                                                <span>Due: ${window.AppFormatters.formatDate(hw.dueDate)}</span>
                                            </span>
                                            ${canPost ? `
                                                <button onclick="window.HomeworkModule.deleteHomework('${hw.id}')" title="Delete Homework" class="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 rounded-lg transition">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                </button>
                                            ` : ''}
                                        </div>
                                    </div>

                                    <!-- Description / Instructions -->
                                    <div class="mt-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                        ${hw.description}
                                    </div>

                                    <!-- Attachments & Links -->
                                    ${hw.attachments && hw.attachments.length > 0 ? `
                                        <div class="mt-3 flex flex-wrap items-center gap-2">
                                            <span class="text-[11px] font-bold text-slate-400 uppercase">Worksheets & Attachments:</span>
                                            ${hw.attachments.map(att => `
                                                <a href="#" onclick="alert('Downloading attachment: ${att}'); return false;" class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-100 flex items-center space-x-1.5 transition">
                                                    <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                                                    <span>${att}</span>
                                                </a>
                                            `).join('')}
                                        </div>
                                    ` : ''}

                                    <!-- Interactive Action Footer -->
                                    <div class="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <!-- Left Status Info -->
                                        <div class="flex flex-wrap items-center gap-3">
                                            ${role === 'parent' ? `
                                                ${isParentSigned ? `
                                                    <span class="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center space-x-1.5">
                                                        <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
                                                        <span>Signed & Acknowledged by You</span>
                                                    </span>
                                                ` : `
                                                    <button onclick="window.HomeworkModule.signHomework('${hw.id}')" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5">
                                                        <i data-lucide="check" class="w-4 h-4"></i>
                                                        <span>✍️ Sign & Acknowledge Diary</span>
                                                    </button>
                                                `}
                                            ` : role === 'student' ? `
                                                <button onclick="window.HomeworkModule.toggleComplete('${hw.id}')" class="px-3.5 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                                                    isStudentDone
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow'
                                                }">
                                                    <i data-lucide="${isStudentDone ? 'check-check' : 'circle'}" class="w-4 h-4"></i>
                                                    <span>${isStudentDone ? 'Completed / Done' : 'Mark as Done'}</span>
                                                </button>
                                            ` : `
                                                <div class="flex items-center space-x-4 text-slate-500 text-xs">
                                                    <span class="flex items-center space-x-1">
                                                        <i data-lucide="user-check" class="w-3.5 h-3.5 text-emerald-600"></i>
                                                        <span><strong>${doneCount}</strong> Student Submissions</span>
                                                    </span>
                                                    <span class="flex items-center space-x-1">
                                                        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-indigo-600"></i>
                                                        <span><strong>${signedCount}</strong> Parent Signatures</span>
                                                    </span>
                                                </div>
                                            `}
                                        </div>

                                        <!-- Right Broadcast Info -->
                                        <div class="text-[11px] text-slate-400 flex items-center space-x-2">
                                            <i data-lucide="send" class="w-3.5 h-3.5 text-emerald-500"></i>
                                            <span>Broadcasted to all parents & students of ${activeClass ? activeClass.name + ' ' + activeClass.section : 'Class 10-A'}</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                            <i data-lucide="book-check" class="w-8 h-8"></i>
                        </div>
                        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No Homework Assigned for this Date</h3>
                        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            No diary entries have been broadcasted for ${window.AppFormatters.formatDate(this.selectedDate)}.
                        </p>
                        ${canPost ? `
                            <button onclick="window.HomeworkModule.openCreateModal()" class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition inline-flex items-center space-x-2">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                                <span>Post First Homework Entry</span>
                            </button>
                        ` : ''}
                    </div>
                `}

                <!-- Modal Container -->
                <div id="homeworkModalContainer"></div>
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

    changeSubject(subjectId) {
        this.selectedSubject = subjectId;
        window.app.renderCurrentView();
    },

    openCreateModal() {
        const classes = window.store.getClasses();
        const subjects = window.store.getSubjects();
        const currentUser = window.store.getCurrentUser();
        const container = document.getElementById("homeworkModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Broadcast Daily Homework / Diary</h3>
                            <p class="text-xs text-indigo-100">Instantly publishes to student portals and parent mobile alerts</p>
                        </div>
                        <button onclick="document.getElementById('homeworkModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.HomeworkModule.handleCreateSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Class & Section *</label>
                                <select name="classId" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                    ${window.AppFormatters.renderGroupedClassOptions(classes, this.selectedClass)}
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject *</label>
                                <select name="subjectId" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assignment Title / Chapter Name *</label>
                            <input name="title" required placeholder="e.g. Chapter 5: Arithmetic Progressions - Ex 5.2" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assignment Type *</label>
                                <select name="type" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Written Practice">Written Practice</option>
                                    <option value="Reading & Memorization">Reading & Memorization</option>
                                    <option value="Worksheet / Project">Worksheet / Project</option>
                                    <option value="Diagram & Practical">Diagram & Practical</option>
                                    <option value="Parent-Child Activity">Parent-Child Activity</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Submission Due Date *</label>
                                <input name="dueDate" type="date" value="${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Instructions & Page Numbers *</label>
                            <textarea name="description" rows="3" required placeholder="Write clear instructions for students and parents (e.g. Complete Q1-Q10 in Homework copy. Bring tomorrow for correction)..." class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"></textarea>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Worksheet Attachment (PDF / File Name)</label>
                            <input name="attachments" placeholder="e.g. Math_Worksheet_Ch5.pdf (Optional)" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center space-x-2 text-[11px] text-emerald-800 dark:text-emerald-300">
                            <i data-lucide="bell-ring" class="w-4 h-4 shrink-0"></i>
                            <span>All parents of this section will immediately receive digital diary notifications on their parent app portal!</span>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('homeworkModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Broadcast to Class</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleCreateSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const subjects = window.store.getSubjects();
        const currentUser = window.store.getCurrentUser();
        const sub = subjects.find(s => s.id === formData.get("subjectId"));
        const attStr = formData.get("attachments");
        const attachments = attStr ? attStr.split(",").map(a => a.trim()).filter(a => a) : [];

        const newHw = {
            classId: formData.get("classId"),
            subjectId: formData.get("subjectId"),
            subjectName: sub ? sub.name : "Subject",
            teacherName: currentUser.name || "Class Teacher",
            assignedDate: new Date().toISOString().split('T')[0],
            dueDate: formData.get("dueDate"),
            title: formData.get("title"),
            type: formData.get("type"),
            description: formData.get("description"),
            attachments: attachments
        };

        window.store.addHomework(newHw);
        document.getElementById('homeworkModalContainer').innerHTML = '';
        this.selectedClass = newHw.classId;
        this.selectedDate = newHw.assignedDate;
        window.app.renderCurrentView();
        window.app.showToast(`Broadcasted ${newHw.title} to class diary!`, 'success');
    },

    signHomework(hwId) {
        const currentUser = window.store.getCurrentUser();
        const parent = currentUser.parentData || window.store.getParents()[0];
        const parentName = parent ? parent.name : currentUser.name;
        const parentId = parent ? parent.id : "par-1";

        window.store.signParentHomework(hwId, parentId, parentName);
        window.app.renderCurrentView();
        window.app.showToast("Digitally signed & verified homework diary!", "success");
    },

    toggleComplete(hwId) {
        const currentUser = window.store.getCurrentUser();
        const student = currentUser.studentData || window.store.getStudents()[0];
        const studentId = student ? student.id : "stu-1";

        window.store.toggleStudentHomeworkCompletion(hwId, studentId);
        window.app.renderCurrentView();
        window.app.showToast("Updated homework completion status", "info");
    },

    deleteHomework(hwId) {
        if (confirm("Are you sure you want to remove this homework assignment from the class diary?")) {
            window.store.deleteHomework(hwId);
            window.app.renderCurrentView();
            window.app.showToast("Homework entry removed", "info");
        }
    }
};
