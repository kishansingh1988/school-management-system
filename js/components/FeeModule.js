// Student Fee Ledger & Payment Collection Module

window.FeeModule = {
    statusFilter: 'all',
    searchQuery: '',

    render() {
        let allFees = window.store.getFees();
        const school = window.store.getSchool();
        const currentUser = window.store.getCurrentUser();
        const canManage = currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'teacher';

        // If parent is logged in, filter to their ward's fees only
        if (currentUser.role === 'parent') {
            const studentIds = (currentUser.parentData && currentUser.parentData.studentIds) ? currentUser.parentData.studentIds : ['stu-1'];
            allFees = allFees.filter(f => studentIds.includes(f.studentId));
        } else if (currentUser.role === 'student') {
            allFees = allFees.filter(f => f.studentId === currentUser.id);
        }

        // Calculate Totals
        let totalExpected = 0;
        let totalCollected = 0;
        let totalDue = 0;
        let paidCount = 0;

        allFees.forEach(f => {
            totalExpected += (f.totalAmount || 0);
            totalCollected += (f.paidAmount || 0);
            totalDue += (f.dueAmount || 0);
            if (f.status === 'Paid') paidCount++;
        });

        // Filter fees
        let filtered = allFees.filter(f => {
            const matchesStatus = this.statusFilter === 'all' || f.status.toLowerCase() === this.statusFilter.toLowerCase();
            const q = this.searchQuery.toLowerCase();
            const matchesSearch = !q || 
                f.studentName.toLowerCase().includes(q) || 
                f.invoiceNo.toLowerCase().includes(q) ||
                f.title.toLowerCase().includes(q);
            return matchesStatus && matchesSearch;
        });

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Fee Ledger & Invoicing</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track student tuition fees, collect payments, and generate official PDF tax receipts</p>
                    </div>
                    <div class="flex items-center gap-2">
                        ${canManage ? `
                            <button onclick="window.FeeModule.openCreateInvoiceModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-2">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                <span>Create Fee Invoice</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Financial KPI Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span class="text-xs font-semibold uppercase text-slate-400">Total Billed Fees</span>
                        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-1">${window.AppFormatters.formatCurrency(totalExpected, school.currency)}</h3>
                        <p class="text-xs text-slate-500 mt-1">${allFees.length} Total Student Invoices</p>
                    </div>

                    <div class="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 shadow-sm">
                        <span class="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">Collected Revenue</span>
                        <h3 class="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">${window.AppFormatters.formatCurrency(totalCollected, school.currency)}</h3>
                        <p class="text-xs text-emerald-600 font-medium mt-1">${paidCount} Invoices Fully Settled</p>
                    </div>

                    <div class="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 shadow-sm">
                        <span class="text-xs font-semibold uppercase text-amber-700 dark:text-amber-400">Pending Receivables</span>
                        <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">${window.AppFormatters.formatCurrency(totalDue, school.currency)}</h3>
                        <p class="text-xs text-amber-600 font-medium mt-1">${Math.round((totalCollected / totalExpected) * 100)}% Collection Efficiency</p>
                    </div>

                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span class="text-xs font-semibold uppercase text-slate-400">Payment Term</span>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-1">${school.currentTerm}</h3>
                        <p class="text-xs text-indigo-600 font-medium mt-1">Due Date: End of Month</p>
                    </div>
                </div>

                <!-- Filter & Search Bar -->
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-xs font-semibold text-slate-500 mr-2">Status:</span>
                        <button onclick="window.FeeModule.filterStatus('all')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition ${this.statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                            All (${allFees.length})
                        </button>
                        <button onclick="window.FeeModule.filterStatus('paid')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition ${this.statusFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                            Paid
                        </button>
                        <button onclick="window.FeeModule.filterStatus('partial')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition ${this.statusFilter === 'partial' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                            Partial
                        </button>
                        <button onclick="window.FeeModule.filterStatus('overdue')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition ${this.statusFilter === 'overdue' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                            Overdue
                        </button>
                    </div>

                    <div class="relative w-full md:w-64">
                        <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
                        <input type="text" value="${this.searchQuery}" oninput="window.FeeModule.search(this.value)" placeholder="Search student or invoice..." class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                </div>

                <!-- Ledger Table -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th class="p-3.5 pl-6">Invoice #</th>
                                    <th class="p-3.5">Student / Class</th>
                                    <th class="p-3.5">Fee Particulars</th>
                                    <th class="p-3.5 text-right">Total Fee</th>
                                    <th class="p-3.5 text-right">Paid</th>
                                    <th class="p-3.5 text-right">Balance Due</th>
                                    <th class="p-3.5 text-center">Status</th>
                                    <th class="p-3.5 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                ${filtered.map(f => {
                                    const student = window.store.getStudentById(f.studentId);
                                    return `
                                        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                                            <td class="p-3.5 pl-6 font-mono font-bold text-indigo-600">
                                                ${f.invoiceNo}
                                            </td>
                                            <td class="p-3.5">
                                                <div class="font-bold text-slate-900 dark:text-white">${f.studentName}</div>
                                                <div class="text-[11px] text-slate-400">${student ? student.admissionNo : 'ADM-CURR'}</div>
                                            </td>
                                            <td class="p-3.5">
                                                <div class="font-medium text-slate-800 dark:text-slate-200">${f.title}</div>
                                                <div class="text-[11px] text-slate-400">Due Date: ${window.AppFormatters.formatDate(f.dueDate)}</div>
                                            </td>
                                            <td class="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                                                ${window.AppFormatters.formatCurrency(f.totalAmount, school.currency)}
                                            </td>
                                            <td class="p-3.5 text-right font-bold text-emerald-600">
                                                ${window.AppFormatters.formatCurrency(f.paidAmount, school.currency)}
                                            </td>
                                            <td class="p-3.5 text-right font-bold ${f.dueAmount > 0 ? 'text-rose-600' : 'text-slate-400'}">
                                                ${window.AppFormatters.formatCurrency(f.dueAmount, school.currency)}
                                            </td>
                                            <td class="p-3.5 text-center">
                                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                                    f.status === 'Partial' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                                }">
                                                    ${f.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td class="p-3.5 pr-6 text-right">
                                                <div class="flex items-center justify-end space-x-1.5">
                                                    ${canManage ? `
                                                        ${f.dueAmount > 0 ? `
                                                            <button onclick="window.FeeModule.openRecordPaymentModal('${f.id}')" title="Collect Payment at School Counter" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition flex items-center space-x-1 text-[11px] border border-emerald-200">
                                                                <i data-lucide="dollar-sign" class="w-3 h-3"></i>
                                                                <span>Collect Fee</span>
                                                            </button>
                                                        ` : ''}
                                                    ` : `
                                                        ${f.dueAmount > 0 ? `
                                                            <button onclick="window.FeeModule.openParentPayInfoModal('${f.id}')" title="School Counter / UPI Bank Deposit Instructions" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition flex items-center space-x-1 text-[11px] border border-indigo-200">
                                                                <i data-lucide="qr-code" class="w-3 h-3"></i>
                                                                <span>Deposit Slip & QR</span>
                                                            </button>
                                                        ` : ''}
                                                    `}
                                                    <button onclick="window.FeeModule.downloadReceipt('${f.id}')" title="Download Official Invoice / Receipt PDF" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition flex items-center space-x-1 text-[11px]">
                                                        <i data-lucide="file-text" class="w-3.5 h-3.5 text-indigo-600"></i>
                                                        <span class="hidden sm:inline">Receipt PDF</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="feeModalContainer"></div>
            </div>
        `;
    },

    filterStatus(st) {
        this.statusFilter = st;
        window.app.renderCurrentView();
    },

    search(q) {
        this.searchQuery = q;
        window.app.renderCurrentView();
    },

    downloadReceipt(invoiceId) {
        const invoice = window.store.getFeeById(invoiceId);
        const student = window.store.getStudentById(invoice.studentId);
        const school = window.store.getSchool();
        const payment = (invoice.paymentHistory && invoice.paymentHistory.length > 0) ? invoice.paymentHistory[0] : null;

        window.AppPdfGenerator.generateFeeReceipt(invoice, payment, student, school);
        window.app.showToast(`Downloaded Official Fee Receipt for ${invoice.invoiceNo}`, "success");
    },

    openParentPayInfoModal(invoiceId) {
        const inv = window.store.getFeeById(invoiceId);
        if (!inv) return;
        const school = window.store.getSchool();
        const container = document.getElementById("feeModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">School Fee Payment Instructions</h3>
                            <p class="text-xs text-indigo-100">Pay at Accounts Counter or Direct Bank Transfer</p>
                        </div>
                        <button onclick="document.getElementById('feeModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-6 space-y-4 text-xs">
                        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <span class="text-slate-400 block text-[11px]">Outstanding Due:</span>
                                <strong class="text-lg text-rose-600 font-black">${window.AppFormatters.formatCurrency(inv.dueAmount, school.currency)}</strong>
                            </div>
                            <div class="text-right">
                                <span class="text-[11px] text-slate-500 block">Due Date: <strong>${window.AppFormatters.formatDate(inv.dueDate)}</strong></span>
                                <span class="text-[10px] text-slate-400">Invoice: ${inv.invoiceNo}</span>
                            </div>
                        </div>

                        <!-- School Counter Instructions -->
                        <div class="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-2">
                            <div class="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold">
                                <i data-lucide="landmark" class="w-4 h-4 text-emerald-600"></i>
                                <span>1. Pay at School Accounts Counter (In-Person)</span>
                            </div>
                            <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                You can deposit fees directly at the <strong>School Accounts Block, Ground Floor</strong> between <strong>08:30 AM and 02:00 PM</strong> (Mon - Sat).
                            </p>
                            <div class="flex flex-wrap gap-1.5 pt-1">
                                <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200">💵 Cash</span>
                                <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200">📱 Counter UPI QR</span>
                                <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200">💳 POS Card Swipe</span>
                                <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200">🏦 Cheque / DD</span>
                            </div>
                        </div>

                        <!-- Direct Bank / UPI Details -->
                        <div class="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 space-y-2">
                            <div class="flex items-center space-x-2 text-indigo-900 dark:text-indigo-300 font-bold">
                                <i data-lucide="qr-code" class="w-4 h-4 text-indigo-600"></i>
                                <span>2. Direct Bank / NEFT / Official School UPI</span>
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-[11px]">
                                <div><span class="text-slate-400">Account Name:</span> <strong class="block truncate">${school.name} Society</strong></div>
                                <div><span class="text-slate-400">Bank & Branch:</span> <strong class="block truncate">HDFC Bank (Rohini)</strong></div>
                                <div><span class="text-slate-400">Account Number:</span> <strong class="font-mono font-bold">50100491823190</strong></div>
                                <div><span class="text-slate-400">IFSC Code:</span> <strong class="font-mono font-bold text-indigo-600">HDFC0001204</strong></div>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <button onclick="window.FeeModule.downloadReceipt('${inv.id}')" class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition flex items-center space-x-1.5">
                                <i data-lucide="download" class="w-4 h-4"></i>
                                <span>Download Invoice PDF</span>
                            </button>
                            <button onclick="document.getElementById('feeModalContainer').innerHTML = ''" class="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl shadow">
                                Got It
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    openRecordPaymentModal(invoiceId) {
        const inv = window.store.getFeeById(invoiceId);
        if (!inv) return;
        const school = window.store.getSchool();
        const container = document.getElementById("feeModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-emerald-600 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Collect Fee Payment</h3>
                            <p class="text-xs text-emerald-100">${inv.studentName} (${inv.invoiceNo})</p>
                        </div>
                        <button onclick="document.getElementById('feeModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.FeeModule.handleRecordPaymentSubmit(event, '${inv.id}')" class="p-6 space-y-4 text-xs">
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                            <div>
                                <span class="text-slate-400 block text-[11px]">Outstanding Due:</span>
                                <strong class="text-base text-rose-600 font-bold">${window.AppFormatters.formatCurrency(inv.dueAmount, school.currency)}</strong>
                            </div>
                            <span class="text-[11px] text-slate-500">Total: ${window.AppFormatters.formatCurrency(inv.totalAmount, school.currency)}</span>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Collection Amount (${school.currency}) *</label>
                            <input name="amount" type="number" step="0.01" max="${inv.dueAmount}" value="${inv.dueAmount}" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold">
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Method / Counter Mode *</label>
                            <select name="method" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                <option value="Cash at School Accounts Desk">💵 Cash at School Accounts Counter</option>
                                <option value="School Direct UPI QR (GPay / PhonePe / Paytm)">📱 School Counter UPI QR Scan (GPay/PhonePe)</option>
                                <option value="POS Card Swipe at Counter">💳 POS Card Swipe Machine (Debit/Credit)</option>
                                <option value="Bank Cheque / Demand Draft">🏦 Bank Cheque / Demand Draft (DD)</option>
                                <option value="NEFT / RTGS / Bank Transfer">💻 NEFT / RTGS / Direct Bank Transfer</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Date</label>
                                <input name="date" type="date" value="${new Date().toISOString().split('T')[0]}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Transaction Ref #</label>
                                <input name="transactionId" placeholder="TXN-..." value="TXN-${Date.now().toString(36).toUpperCase()}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono">
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('feeModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow">Confirm & Print Receipt</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleRecordPaymentSubmit(e, invoiceId) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const paymentData = {
            amount: Number(formData.get("amount")),
            method: formData.get("method"),
            date: formData.get("date"),
            transactionId: formData.get("transactionId")
        };

        const result = window.store.recordFeePayment(invoiceId, paymentData);
        document.getElementById('feeModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast("Payment recorded successfully", "success");

        // Automatically trigger receipt PDF
        if (result && result.paymentRecord) {
            this.downloadReceipt(invoiceId);
        }
    },

    openCreateInvoiceModal() {
        const students = window.store.getStudents();
        const container = document.getElementById("feeModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-base">Generate Student Fee Invoice</h3>
                        <button onclick="document.getElementById('feeModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.FeeModule.handleCreateInvoiceSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Student *</label>
                            <select name="studentId" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                ${students.map(s => {
                                    const cls = window.store.getClassById(s.classId);
                                    const classLabel = cls ? ` [${cls.name}-${cls.section}]` : '';
                                    return `<option value="${s.id}">${s.name}${classLabel} (Adm: ${s.admissionNo})</option>`;
                                }).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Title *</label>
                            <input name="title" required value="Term 2 Tuition & Activity Assessment" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Amount (₹) *</label>
                                <input name="totalAmount" type="number" required value="63000" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date *</label>
                                <input name="dueDate" type="date" value="2025-11-30" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('feeModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Create Invoice</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleCreateInvoiceSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const student = window.store.getStudentById(formData.get("studentId"));
        const amount = Number(formData.get("totalAmount"));

        const newInv = {
            studentId: student.id,
            studentName: student.name,
            classId: student.classId,
            title: formData.get("title"),
            dueDate: formData.get("dueDate"),
            breakdown: [
                { item: "Tuition Composite Fee", amount: amount * 0.75 },
                { item: "Laboratory & Technology Resource Fee", amount: amount * 0.15 },
                { item: "Library & Athletic Association Levy", amount: amount * 0.10 }
            ],
            totalAmount: amount,
            paidAmount: 0,
            dueAmount: amount,
            status: "Overdue",
            paymentHistory: []
        };

        window.store.createFeeInvoice(newInv);
        document.getElementById('feeModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast("New fee invoice generated", "success");
    }
};
