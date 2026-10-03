// Teacher Directory & Faculty Management Module

window.TeacherDirectory = {
    searchQuery: '',

    render() {
        const teachers = window.store.getTeachers();
        const classes = window.store.getClasses();
        const currentUser = window.store.getCurrentUser();
        const canManage = currentUser.role === 'admin';

        let filtered = teachers.filter(t => {
            const q = this.searchQuery.toLowerCase();
            return !q || 
                t.name.toLowerCase().includes(q) || 
                t.employeeId.toLowerCase().includes(q) || 
                t.designation.toLowerCase().includes(q) ||
                (t.subjects && t.subjects.some(s => s.toLowerCase().includes(q)));
        });

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Faculty & Staff Directory</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage teaching faculty, subject specialists, and class teacher allocations</p>
                    </div>
                    <div class="flex items-center gap-2.5">
                        <div class="relative w-64">
                            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
                            <input type="text" value="${this.searchQuery}" oninput="window.TeacherDirectory.search(this.value)" placeholder="Search faculty name, subject..." class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                        ${canManage ? `
                            <button onclick="window.TeacherDirectory.openAddModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-2">
                                <i data-lucide="user-plus" class="w-4 h-4"></i>
                                <span>Add Faculty Member</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Faculty Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${filtered.map(t => {
                        const assignedClass = classes.find(c => c.id === t.assignedClass);
                        return `
                            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                                <div>
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center space-x-3.5">
                                            <img src="${t.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'}" class="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow" alt="${t.name}">
                                            <div>
                                                <h3 class="font-bold text-slate-900 dark:text-white text-sm">${t.name}</h3>
                                                <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">${t.designation}</span>
                                                <span class="text-[10px] text-slate-400 font-mono">${t.employeeId}</span>
                                            </div>
                                        </div>
                                        ${canManage ? `
                                            <div class="flex items-center space-x-1">
                                                <button onclick="window.TeacherDirectory.openEditModal('${t.id}')" title="Edit Teacher" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg">
                                                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                                                </button>
                                                <button onclick="window.TeacherDirectory.deleteTeacher('${t.id}')" title="Delete" class="p-1 hover:bg-red-50 text-red-500 rounded-lg">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                </button>
                                            </div>
                                        ` : ''}
                                    </div>

                                    <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                                        <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                            <span class="text-slate-400">Class Teacher:</span>
                                            <span class="font-semibold text-slate-900 dark:text-white">${assignedClass ? `${assignedClass.name} - ${assignedClass.section}` : 'None'}</span>
                                        </div>
                                        <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                            <span class="text-slate-400">Qualification:</span>
                                            <span class="font-medium text-slate-700 dark:text-slate-300 text-right truncate max-w-[170px]" title="${t.qualification}">${t.qualification}</span>
                                        </div>
                                        <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                            <span class="text-slate-400">Experience:</span>
                                            <span class="font-medium text-slate-700 dark:text-slate-300">${t.experience}</span>
                                        </div>
                                    </div>

                                    <div class="mt-3">
                                        <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">Specializations</span>
                                        <div class="flex flex-wrap gap-1.5">
                                            ${(t.subjects || []).map(sub => `
                                                <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    ${sub}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                                    <span class="truncate">${t.email}</span>
                                    <span>${t.phone}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div id="teacherModalContainer"></div>
            </div>
        `;
    },

    search(q) {
        this.searchQuery = q;
        window.app.renderCurrentView();
    },

    openAddModal() {
        const classes = window.store.getClasses();
        const container = document.getElementById("teacherModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-emerald-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-lg">Add Faculty Member</h3>
                        <button onclick="document.getElementById('teacherModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.TeacherDirectory.handleAddSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                                <input name="name" required placeholder="e.g. David Ross" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation *</label>
                                <input name="designation" required placeholder="e.g. Senior Lecturer" value="Senior Lecturer" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Class / Section</label>
                                <select name="assignedClass" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                    <option value="">None / Departmental Specialist</option>
                                    ${window.AppFormatters.renderGroupedClassOptions(classes)}
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience</label>
                                <input name="experience" placeholder="e.g. 5 Years" value="4 Years" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Qualification *</label>
                            <input name="qualification" required placeholder="e.g. M.Sc. Physics (Oxford)" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subjects (comma-separated) *</label>
                            <input name="subjects" required placeholder="e.g. Mathematics, Physics" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email *</label>
                                <input name="email" type="email" required placeholder="faculty@apexhorizon.edu" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                                <input name="phone" placeholder="+1 (555) 000-0000" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('teacherModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow">Save Faculty</button>
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

        const newTeacher = {
            name: formData.get("name"),
            designation: formData.get("designation"),
            assignedClass: formData.get("assignedClass") || null,
            experience: formData.get("experience"),
            qualification: formData.get("qualification"),
            subjects: formData.get("subjects").split(",").map(s => s.trim()).filter(s => s),
            email: formData.get("email"),
            phone: formData.get("phone") || "+1 (555) 301-0000",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256"
        };

        window.store.addTeacher(newTeacher);
        document.getElementById('teacherModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Added ${newTeacher.name} to faculty`, "success");
    },

    openEditModal(teacherId) {
        const t = window.store.getTeacherById(teacherId);
        if (!t) return;
        const classes = window.store.getClasses();
        const container = document.getElementById("teacherModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-emerald-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-lg">Edit Faculty Details</h3>
                        <button onclick="document.getElementById('teacherModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.TeacherDirectory.handleEditSubmit(event, '${t.id}')" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input name="name" value="${t.name}" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                                <input name="designation" value="${t.designation}" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Class / Section</label>
                                <select name="assignedClass" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                    <option value="">None / Departmental Specialist</option>
                                    ${window.AppFormatters.renderGroupedClassOptions(classes, t.assignedClass)}
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience</label>
                                <input name="experience" value="${t.experience}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
                            <input name="qualification" value="${t.qualification}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subjects (comma-separated)</label>
                            <input name="subjects" value="${(t.subjects || []).join(', ')}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('teacherModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleEditSubmit(e, teacherId) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const updated = {
            name: formData.get("name"),
            designation: formData.get("designation"),
            assignedClass: formData.get("assignedClass") || null,
            experience: formData.get("experience"),
            qualification: formData.get("qualification"),
            subjects: formData.get("subjects").split(",").map(s => s.trim()).filter(s => s)
        };

        window.store.updateTeacher(teacherId, updated);
        document.getElementById('teacherModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast("Faculty details updated", "success");
    },

    deleteTeacher(teacherId) {
        const t = window.store.getTeacherById(teacherId);
        if (!t) return;
        if (confirm(`Are you sure you want to remove ${t.name} from faculty directory?`)) {
            window.store.deleteTeacher(teacherId);
            window.app.renderCurrentView();
            window.app.showToast("Faculty record deleted", "info");
        }
    }
};
