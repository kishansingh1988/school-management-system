// Library Management & Book Lending Circulation Desk Component

window.LibraryModule = {
    searchQuery: "",
    selectedCategory: "all",

    render() {
        const books = window.store.getLibraryBooks();
        const loans = window.store.getLibraryLoans();
        const user = window.store.getCurrentUser();
        const school = window.store.getSchool();

        // Filter Books
        const filteredBooks = books.filter(b => {
            const matchesCat = this.selectedCategory === 'all' || b.category.toLowerCase().includes(this.selectedCategory.toLowerCase());
            const q = this.searchQuery.toLowerCase();
            const matchesQuery = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.accessionNo.toLowerCase().includes(q);
            return matchesCat && matchesQuery;
        });

        // Summary Statistics
        const totalTitles = books.length;
        let totalCopiesCount = 0;
        let availableCopiesCount = 0;
        books.forEach(b => {
            totalCopiesCount += (b.totalCopies || 0);
            availableCopiesCount += (b.availableCopies || 0);
        });
        const activeLoansCount = loans.filter(l => !l.returnDate).length;

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Top Header Banner -->
                <div class="p-6 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-700 to-indigo-900 text-white shadow-xl relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0">
                                <i data-lucide="book-marked" class="w-7 h-7 text-emerald-300"></i>
                            </div>
                            <div>
                                <div class="flex items-center space-x-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <span class="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">Resource Center</span>
                                    <span>•</span>
                                    <span>Knowledge Circulation Desk</span>
                                </div>
                                <h1 class="text-2xl md:text-3xl font-black tracking-tight text-white">Library & Book Lending Desk</h1>
                                <p class="text-emerald-100 text-xs mt-1 max-w-xl leading-relaxed">
                                    Central catalog of academic reference textbooks, NCERT guides, competitive exam books, and student lending records for ${school.name}.
                                </p>
                            </div>
                        </div>

                        ${user.role === 'admin' || user.role === 'superadmin' || user.role === 'teacher' ? `
                            <div class="flex flex-wrap items-center gap-2">
                                <button onclick="window.LibraryModule.openIssueModal()" class="px-4 py-2.5 bg-white text-slate-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5">
                                    <i data-lucide="arrow-up-right" class="w-4 h-4 text-emerald-600"></i>
                                    <span>Issue Book</span>
                                </button>
                                <button onclick="window.LibraryModule.openAddBookModal()" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 border border-white/20">
                                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                    <span>+ Add Book</span>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- KPI Metric Pills -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
                            <i data-lucide="library" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Catalog Titles</span>
                            <h3 class="text-lg font-black text-slate-900 dark:text-white">${totalTitles} Titles</h3>
                        </div>
                    </div>

                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                            <i data-lucide="books" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Volume Copies</span>
                            <h3 class="text-lg font-black text-slate-900 dark:text-white">${totalCopiesCount} Copies</h3>
                        </div>
                    </div>

                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
                            <i data-lucide="check-circle" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Available on Shelves</span>
                            <h3 class="text-lg font-black text-slate-900 dark:text-white">${availableCopiesCount} Available</h3>
                        </div>
                    </div>

                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                            <i data-lucide="clock" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Active Student Loans</span>
                            <h3 class="text-lg font-black text-slate-900 dark:text-white">${activeLoansCount} Borrowed</h3>
                        </div>
                    </div>
                </div>

                <!-- Search & Category Filters -->
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div class="relative w-full sm:w-80">
                        <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        <input 
                            type="text" 
                            placeholder="Search by title, author, or accession #..." 
                            value="${this.searchQuery}"
                            oninput="window.LibraryModule.handleSearch(this.value)"
                            class="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div class="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        ${['all', 'Science', 'Mathematics', 'Literature', 'History', 'Biography'].map(cat => `
                            <button onclick="window.LibraryModule.filterCategory('${cat}')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                                this.selectedCategory.toLowerCase() === cat.toLowerCase()
                                    ? 'bg-emerald-600 text-white shadow'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                            }">
                                ${cat === 'all' ? 'All Shelves' : cat}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Book Catalog Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${filteredBooks.map(bk => {
                        const isAvail = bk.availableCopies > 0;
                        return `
                            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
                                <div>
                                    <div class="flex items-start justify-between gap-2 mb-2">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                                            ${bk.accessionNo}
                                        </span>
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                            isAvail 
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                        }">
                                            ${isAvail ? `${bk.availableCopies} Available` : 'All Borrowed'}
                                        </span>
                                    </div>
                                    <h3 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">${bk.title}</h3>
                                    <p class="text-xs text-slate-500 mt-1">Author: <strong>${bk.author}</strong></p>
                                    <p class="text-[11px] text-slate-400 mt-0.5">${bk.publisher} • ${bk.edition}</p>
                                </div>

                                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span class="text-[11px] text-slate-500 font-semibold flex items-center space-x-1">
                                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-600"></i>
                                        <span>${bk.shelfLocation}</span>
                                    </span>

                                    ${(user.role === 'admin' || user.role === 'superadmin' || user.role === 'teacher') && isAvail ? `
                                        <button onclick="window.LibraryModule.openIssueModal('${bk.id}')" class="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 transition">
                                            Issue &rarr;
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Active Circulation & Book Loans Table -->
                <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h3 class="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                            <i data-lucide="book-check" class="w-4 h-4 text-emerald-600"></i>
                            <span>Recent Book Circulation & Student Loans</span>
                        </h3>
                        <span class="text-xs font-bold text-slate-500">${loans.length} Total Records</span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                                <tr>
                                    <th class="p-3 rounded-l-xl">Accession #</th>
                                    <th class="p-3">Book Title</th>
                                    <th class="p-3">Borrower (Student)</th>
                                    <th class="p-3">Issue Date</th>
                                    <th class="p-3">Due Date</th>
                                    <th class="p-3">Status</th>
                                    <th class="p-3 text-right rounded-r-xl">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                ${loans.map(ln => {
                                    const isReturned = Boolean(ln.returnDate);
                                    const isOverdue = ln.status.includes('Overdue');
                                    return `
                                        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                            <td class="p-3 font-mono font-bold text-indigo-600">${ln.accessionNo}</td>
                                            <td class="p-3 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">${ln.bookTitle}</td>
                                            <td class="p-3 text-slate-700 dark:text-slate-300">
                                                <strong>${ln.borrowerName}</strong>
                                                <span class="text-[10px] text-slate-400 block">${ln.borrowerClass}</span>
                                            </td>
                                            <td class="p-3 text-slate-500">${window.AppFormatters.formatDate(ln.issueDate)}</td>
                                            <td class="p-3 ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}">${window.AppFormatters.formatDate(ln.dueDate)}</td>
                                            <td class="p-3">
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                                    isReturned ? 'bg-slate-100 text-slate-600 dark:bg-slate-800' :
                                                    isOverdue ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                                                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                }">
                                                    ${ln.status}
                                                </span>
                                            </td>
                                            <td class="p-3 text-right">
                                                ${!isReturned ? `
                                                    <button onclick="window.LibraryModule.returnBook('${ln.id}')" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg shadow transition">
                                                        Return Book
                                                    </button>
                                                ` : `
                                                    <span class="text-slate-400 font-medium">Returned on ${window.AppFormatters.formatDate(ln.returnDate)}</span>
                                                `}
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Modal Container -->
                <div id="libraryModalContainer"></div>
            </div>
        `;
    },

    handleSearch(query) {
        this.searchQuery = query;
        window.app.renderCurrentView();
    },

    filterCategory(cat) {
        this.selectedCategory = cat;
        window.app.renderCurrentView();
    },

    returnBook(loanId) {
        const res = window.store.returnBook(loanId);
        if (res.success) {
            window.app.renderCurrentView();
            window.app.showToast("Book returned to shelf inventory successfully!", "success");
        }
    },

    openIssueModal(preselectedBookId = "") {
        const container = document.getElementById("libraryModalContainer");
        if (!container) return;

        const books = window.store.getLibraryBooks().filter(b => b.availableCopies > 0);
        const students = window.store.getStudents();

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Issue Library Book to Student</h3>
                            <p class="text-xs text-teal-100">Select textbook and borrower student profile</p>
                        </div>
                        <button onclick="document.getElementById('libraryModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="window.LibraryModule.handleIssueSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Book Title *</label>
                            <select name="bookId" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                ${books.map(b => `<option value="${b.id}" ${b.id === preselectedBookId ? 'selected' : ''}>${b.title} (${b.accessionNo} - ${b.availableCopies} available)</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Borrower Student *</label>
                            <select name="studentId" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                ${students.map(s => `<option value="${s.id}">${s.name} (Roll #${s.rollNo}, Class 10-A)</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Return Due Date (Standard 14 Days) *</label>
                            <input name="dueDate" type="date" required value="${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('libraryModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow">Confirm Issue</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleIssueSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = window.store.issueBook(fd.get("bookId"), fd.get("studentId"), fd.get("dueDate"));
        if (res.success) {
            document.getElementById('libraryModalContainer').innerHTML = '';
            window.app.renderCurrentView();
            window.app.showToast("Book issued successfully to student!", "success");
        } else {
            window.app.showToast(res.error || "Failed to issue book", "error");
        }
    },

    openAddBookModal() {
        const container = document.getElementById("libraryModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Add New Book to Library Catalog</h3>
                            <p class="text-xs text-emerald-100">Register new textbook, shelf placement, and copies</p>
                        </div>
                        <button onclick="document.getElementById('libraryModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="window.LibraryModule.handleAddBookSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Book Title *</label>
                            <input name="title" required placeholder="e.g. NCERT Exemplar Problems - Mathematics" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Author Name *</label>
                                <input name="author" required placeholder="e.g. NCERT Panel" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category / Genre *</label>
                                <select name="category" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    <option value="Science & Physics">Science & Physics</option>
                                    <option value="Mathematics Reference">Mathematics Reference</option>
                                    <option value="Children & Young Fiction">Children & Young Fiction</option>
                                    <option value="History & Social Science">History & Social Science</option>
                                    <option value="Biography & Inspiration">Biography & Inspiration</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Shelf / Rack Location *</label>
                                <input name="shelfLocation" required placeholder="e.g. Rack M-03 (Class 10 Aisle)" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Copies *</label>
                                <input name="totalCopies" type="number" required value="5" min="1" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('libraryModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow">Add to Catalog</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleAddBookSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const copies = parseInt(fd.get("totalCopies"), 10) || 5;

        const newBook = {
            title: fd.get("title"),
            author: fd.get("author"),
            category: fd.get("category"),
            publisher: "Academic Press India",
            edition: "2025 Edition",
            shelfLocation: fd.get("shelfLocation"),
            totalCopies: copies,
            availableCopies: copies,
            isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`
        };

        window.store.addLibraryBook(newBook);
        document.getElementById('libraryModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Added "${newBook.title}" to library catalog!`, 'success');
    }
};
