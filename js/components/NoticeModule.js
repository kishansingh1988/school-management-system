// Noticeboard & School Announcements Module

window.NoticeModule = {
    audienceFilter: 'All',
    categoryFilter: 'All',

    render() {
        const notices = window.store.getNotices();
        const currentUser = window.store.getCurrentUser();
        const canPost = currentUser.role === 'admin' || currentUser.role === 'teacher';

        // Filter notices
        let filtered = notices.filter(n => {
            const matchesAudience = this.audienceFilter === 'All' || n.targetAudience === 'All' || n.targetAudience === this.audienceFilter;
            const matchesCat = this.categoryFilter === 'All' || n.category === this.categoryFilter;
            return matchesAudience && matchesCat;
        });

        const categories = ["All", "Academic", "Exam", "Sports", "Holiday", "General"];
        const audiences = ["All", "Teachers", "Students", "Parents"];

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Noticeboard & Circulars</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">School announcements, official circulars, event notifications, and holiday advisories</p>
                    </div>
                    <div class="flex items-center gap-2">
                        ${canPost ? `
                            <button onclick="window.NoticeModule.openCreateNoticeModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-2">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                <span>Post Announcement</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Filter Controls -->
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="font-semibold text-slate-400 mr-1">Audience:</span>
                        ${audiences.map(aud => `
                            <button onclick="window.NoticeModule.filterAudience('${aud}')" class="px-3 py-1.5 rounded-lg font-semibold transition ${this.audienceFilter === aud ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                                ${aud}
                            </button>
                        `).join('')}
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <span class="font-semibold text-slate-400 mr-1">Category:</span>
                        ${categories.map(cat => `
                            <button onclick="window.NoticeModule.filterCategory('${cat}')" class="px-3 py-1.5 rounded-lg font-semibold transition ${this.categoryFilter === cat ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                                ${cat}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Notices Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    ${filtered.length > 0 ? filtered.map(n => `
                        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between gap-2 mb-2.5">
                                    <div class="flex items-center space-x-2">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            n.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                                            n.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                                        }">
                                            ${n.priority}
                                        </span>
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            ${n.category}
                                        </span>
                                    </div>
                                    <span class="text-[11px] text-slate-400 font-medium">${window.AppFormatters.formatDate(n.date)}</span>
                                </div>

                                <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug">${n.title}</h3>
                                <p class="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">${n.content}</p>

                                ${n.attachments && n.attachments.length > 0 ? `
                                    <div class="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Official Attachments</span>
                                        <div class="flex flex-wrap gap-2">
                                            ${n.attachments.map(att => `
                                                <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                                                    <i data-lucide="paperclip" class="w-3 h-3 text-indigo-500"></i>
                                                    <span>${att}</span>
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>

                            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                <span>Published by: <strong class="text-slate-700 dark:text-slate-300">${n.author}</strong></span>
                                <div class="flex items-center space-x-2">
                                    <span class="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-[10px] font-semibold text-slate-500">Audience: ${n.targetAudience}</span>
                                    ${canPost ? `
                                        <button onclick="window.NoticeModule.deleteNotice('${n.id}')" title="Delete Notice" class="p-1 text-slate-400 hover:text-rose-600 rounded">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="col-span-2 text-center py-12 text-slate-400">
                            <i data-lucide="bell-off" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
                            <p>No circulars found matching the filter criteria.</p>
                        </div>
                    `}
                </div>

                <div id="noticeModalContainer"></div>
            </div>
        `;
    },

    filterAudience(aud) {
        this.audienceFilter = aud;
        window.app.renderCurrentView();
    },

    filterCategory(cat) {
        this.categoryFilter = cat;
        window.app.renderCurrentView();
    },

    openCreateNoticeModal() {
        const container = document.getElementById("noticeModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-base">Publish School Announcement</h3>
                        <button onclick="document.getElementById('noticeModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.NoticeModule.handleCreateNoticeSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Announcement Title *</label>
                            <input name="title" required placeholder="e.g. Science Exhibition Registration Open" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="grid grid-cols-3 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                <select name="category" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Academic">Academic</option>
                                    <option value="Exam">Exam</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Holiday">Holiday</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                                <select name="priority" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Audience</label>
                                <select name="targetAudience" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="All">All</option>
                                    <option value="Teachers">Teachers</option>
                                    <option value="Students">Students</option>
                                    <option value="Parents">Parents</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Content *</label>
                            <textarea name="content" rows="4" required placeholder="Write the full circular description..." class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"></textarea>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Author / Signatory</label>
                            <input name="author" value="${window.store.getCurrentUser().name}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('noticeModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Post Circular</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleCreateNoticeSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const newNotice = {
            title: formData.get("title"),
            category: formData.get("category"),
            priority: formData.get("priority"),
            targetAudience: formData.get("targetAudience"),
            content: formData.get("content"),
            author: formData.get("author") || "Administration",
            attachments: []
        };

        window.store.addNotice(newNotice);
        document.getElementById('noticeModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast("Notice posted to the board", "success");
    },

    deleteNotice(id) {
        if (confirm("Are you sure you want to remove this announcement?")) {
            window.store.deleteNotice(id);
            window.app.renderCurrentView();
            window.app.showToast("Notice deleted", "info");
        }
    }
};
