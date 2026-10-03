// Staff Payroll & Leave Management Component
// Supports Formal 7th Pay CTC, Fixed Monthly Lump-Sum, Per-Day Daily Wages, and Per-Period Guest Lecture Rates

window.PayrollLeavesModule = {
    activeTab: "payroll", // "payroll" | "leaves"

    render() {
        const payrolls = window.store.getStaffPayroll();
        const leaves = window.store.getStaffLeaves();
        const user = window.store.getCurrentUser();
        const school = window.store.getSchool();
        const teachers = window.store.getTeachers();

        const canManage = user.role === 'admin' || user.role === 'superadmin' || user.role === 'accountant';

        // Calculate Payroll Totals
        let totalDisbursed = 0;
        let totalEPF = 0;
        let totalTDS = 0;
        payrolls.forEach(p => {
            totalDisbursed += (p.netSalary || 0);
            totalEPF += (p.epfDeduction || 0);
            totalTDS += (p.tdsDeduction || 0);
        });

        // Leave stats
        const pendingLeaves = (leaves.requests || []).filter(r => r.status === 'Pending Review').length;

        // If teacher is logged in, show their personal leave balance
        const teacherBal = user.role === 'teacher' ? window.store.getStaffLeaveBalances(user.id) : null;

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Top Header Banner -->
                <div class="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-xl relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0">
                                <i data-lucide="badge-percent" class="w-7 h-7 text-indigo-300"></i>
                            </div>
                            <div>
                                <div class="flex items-center space-x-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <span class="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">HR & Faculty Administration</span>
                                    <span>•</span>
                                    <span>Fixed / Daily Wage / 7th Pay Ready</span>
                                </div>
                                <h1 class="text-2xl md:text-3xl font-black tracking-tight text-white">Staff Payroll & Leave Management</h1>
                                <p class="text-indigo-200 text-xs mt-1 max-w-xl leading-relaxed">
                                    Manage direct fixed salaries, per-day staff wages, guest lecture rates, and formal 7th Pay CTC in INR (₹) for ${school.name}.
                                </p>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            ${canManage ? `
                                <button onclick="window.PayrollLeavesModule.openDirectSalaryModal()" class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 border border-white/20">
                                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                    <span>+ Feed Direct / Daily Salary</span>
                                </button>
                                <button onclick="window.PayrollLeavesModule.openProcessPayrollModal()" class="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 border border-white/20">
                                    <i data-lucide="receipt" class="w-4 h-4"></i>
                                    <span>Batch Process Pay</span>
                                </button>
                            ` : ''}
                            <button onclick="window.PayrollLeavesModule.openApplyLeaveModal()" class="px-4 py-2.5 bg-white text-slate-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5">
                                <i data-lucide="calendar-plus" class="w-4 h-4 text-indigo-600"></i>
                                <span>Apply for Leave</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- KPI Metric Pills -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                            <i data-lucide="indian-rupee" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Monthly Net Disbursal</span>
                            <h3 class="text-base font-black text-slate-900 dark:text-white">${window.AppFormatters.formatCurrency(totalDisbursed, '₹')}</h3>
                        </div>
                    </div>

                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
                            <i data-lucide="users" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Staff Disbursed</span>
                            <h3 class="text-base font-black text-slate-900 dark:text-white">${payrolls.length} Employees</h3>
                        </div>
                    </div>

                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                            <i data-lucide="shield-check" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">EPF / Tax Deducted</span>
                            <h3 class="text-base font-black text-slate-900 dark:text-white">${window.AppFormatters.formatCurrency(totalEPF + totalTDS, '₹')}</h3>
                        </div>
                    </div>

                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl ${pendingLeaves > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0">
                            <i data-lucide="${pendingLeaves > 0 ? 'alert-circle' : 'check'}" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Pending Leaves</span>
                            <h3 class="text-base font-black text-slate-900 dark:text-white">${pendingLeaves} Requests</h3>
                        </div>
                    </div>
                </div>

                ${teacherBal ? `
                    <!-- Teacher Personal Leave Quota Card -->
                    <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-900/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                                <i data-lucide="umbrella" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h3 class="text-xs font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-300">My Annual Faculty Leave Quota</h3>
                                <p class="text-[11px] text-slate-500">Track remaining casual, medical, and privilege leaves</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-3 text-center">
                            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span class="text-[10px] uppercase font-bold text-slate-400 block">Casual Leave (CL)</span>
                                <span class="text-xs font-extrabold text-indigo-600">${teacherBal.clTotal - teacherBal.clUsed} / ${teacherBal.clTotal} Left</span>
                            </div>
                            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span class="text-[10px] uppercase font-bold text-slate-400 block">Medical Leave (ML)</span>
                                <span class="text-xs font-extrabold text-emerald-600">${teacherBal.mlTotal - teacherBal.mlUsed} / ${teacherBal.mlTotal} Left</span>
                            </div>
                            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span class="text-[10px] uppercase font-bold text-slate-400 block">Earned Leave (EL)</span>
                                <span class="text-xs font-extrabold text-purple-600">${teacherBal.elTotal - teacherBal.elUsed} / ${teacherBal.elTotal} Left</span>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Sub-Navigation Tab Selector -->
                <div class="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <button onclick="window.PayrollLeavesModule.switchTab('payroll')" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                        this.activeTab === 'payroll'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }">
                        <i data-lucide="receipt" class="w-4 h-4"></i>
                        <span>Staff Salary Register (${payrolls.length})</span>
                    </button>

                    <button onclick="window.PayrollLeavesModule.switchTab('leaves')" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                        this.activeTab === 'leaves'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        <span>Leave Requests & Approvals (${leaves.requests ? leaves.requests.length : 0})</span>
                        ${pendingLeaves > 0 ? `<span class="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">${pendingLeaves}</span>` : ''}
                    </button>
                </div>

                <!-- Tab 1: Staff Salary Register Table -->
                ${this.activeTab === 'payroll' ? `
                    <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                            <div>
                                <h3 class="font-extrabold text-sm text-slate-900 dark:text-white">Staff Salary Register & Payment Ledger</h3>
                                <p class="text-xs text-slate-500">Supports Direct Fixed Salaries, Per-Day Daily Wages, and 7th Pay Scales.</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                    ${payrolls.length} Disbursed Records
                                </span>
                            </div>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-xs text-left">
                                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th class="p-3 rounded-l-xl">Faculty / Staff Member</th>
                                        <th class="p-3">Pay Structure Model</th>
                                        <th class="p-3">Month</th>
                                        <th class="p-3">Gross Earnings</th>
                                        <th class="p-3">Deductions</th>
                                        <th class="p-3">Net Take-Home</th>
                                        <th class="p-3">Payment Mode</th>
                                        <th class="p-3 text-right rounded-r-xl">Official Payslip</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                    ${payrolls.map(p => {
                                        const isFixed = p.payType === 'fixed';
                                        const isDaily = p.payType === 'daily';
                                        const isLecture = p.payType === 'lecture';
                                        return `
                                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                <td class="p-3">
                                                    <div class="font-bold text-slate-900 dark:text-white">${p.staffName}</div>
                                                    <div class="text-[10px] text-slate-400 font-mono">${p.designation} • ID: ${p.staffId}</div>
                                                </td>
                                                <td class="p-3">
                                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                        isFixed ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                                        isDaily ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                                                        isLecture ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                                                        'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                                    }">
                                                        ${isFixed ? '💵 Fixed Monthly' : isDaily ? `📅 Per-Day (${p.daysWorked} Days @ ₹${p.dailyRate})` : isLecture ? `🎓 Per-Period (${p.periodsDelivered} Periods)` : '🏢 7th Pay Scale'}
                                                    </span>
                                                </td>
                                                <td class="p-3 font-semibold text-slate-700 dark:text-slate-300">${p.monthYear}</td>
                                                <td class="p-3 font-semibold text-slate-900 dark:text-white">${window.AppFormatters.formatCurrency(p.grossSalary, '₹')}</td>
                                                <td class="p-3 text-rose-600 font-medium">
                                                    ${p.totalDeductions > 0 ? `-${window.AppFormatters.formatCurrency(p.totalDeductions, '₹')}` : '₹0'}
                                                </td>
                                                <td class="p-3 font-black text-emerald-600 text-sm">${window.AppFormatters.formatCurrency(p.netSalary, '₹')}</td>
                                                <td class="p-3 text-slate-600 dark:text-slate-300 text-[11px]">
                                                    <div class="font-medium">${p.paymentMode || 'Bank Transfer'}</div>
                                                    <div class="text-[10px] text-slate-400">${window.AppFormatters.formatDate(p.paymentDate)}</div>
                                                </td>
                                                <td class="p-3 text-right">
                                                    <button onclick="window.PayrollLeavesModule.downloadPayslip('${p.id}')" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded-lg border border-indigo-200 dark:border-indigo-800 transition flex items-center space-x-1 ml-auto shadow-sm">
                                                        <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                                        <span>PDF Payslip</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : `
                    <!-- Tab 2: Leave Requests & Approval Matrix -->
                    <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 class="font-extrabold text-sm text-slate-900 dark:text-white">Faculty Leave Applications & Sanctions</h3>
                            <span class="text-xs font-bold text-slate-500">${(leaves.requests || []).length} Total Applications</span>
                        </div>

                        <div class="space-y-4">
                            ${(leaves.requests || []).map(r => {
                                const isPending = r.status === 'Pending Review';
                                const isApproved = r.status === 'Approved';
                                return `
                                    <div class="p-4 rounded-2xl border ${
                                        isPending ? 'border-amber-300 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20' :
                                        isApproved ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900 dark:bg-emerald-950/10' :
                                        'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                                    } space-y-3">
                                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div class="flex items-center space-x-2.5">
                                                <div class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                                                    <i data-lucide="calendar" class="w-4 h-4"></i>
                                                </div>
                                                <div>
                                                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">${r.staffName} (${r.designation})</h4>
                                                    <span class="text-[10px] text-slate-400 block">Applied on: ${window.AppFormatters.formatDate(r.appliedOn)}</span>
                                                </div>
                                            </div>

                                            <div class="flex items-center space-x-2">
                                                <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                                    isPending ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse' :
                                                    isApproved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                }">
                                                    ${r.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div class="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                                            <div class="flex items-center justify-between font-semibold">
                                                <span class="text-indigo-600 font-bold">${r.leaveType} (${r.totalDays} Days)</span>
                                                <span class="text-slate-600 dark:text-slate-300">${window.AppFormatters.formatDate(r.fromDate)} &rarr; ${window.AppFormatters.formatDate(r.toDate)}</span>
                                            </div>
                                            <p class="text-slate-600 dark:text-slate-400 italic mt-1">"${r.reason}"</p>
                                            ${r.decisionNote ? `<p class="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold mt-1">Note: ${r.decisionNote}</p>` : ''}
                                        </div>

                                        ${canManage && isPending ? `
                                            <div class="flex items-center justify-end space-x-2 pt-1">
                                                <button onclick="window.PayrollLeavesModule.handleLeaveDecision('${r.id}', 'Rejected')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition">
                                                    Reject
                                                </button>
                                                <button onclick="window.PayrollLeavesModule.handleLeaveDecision('${r.id}', 'Approved')" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition">
                                                    Sanction & Approve
                                                </button>
                                            </div>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `}

                <!-- Modal Container -->
                <div id="payrollModalContainer"></div>
            </div>
        `;
    },

    switchTab(tab) {
        this.activeTab = tab;
        window.app.renderCurrentView();
    },

    downloadPayslip(payrollId) {
        const p = window.store.getStaffPayrollById(payrollId);
        const school = window.store.getSchool();
        if (p) {
            window.AppPdfGenerator.generateStaffPayslip(null, p, school);
            window.app.showToast(`Downloaded official salary payslip for ${p.staffName}!`, 'success');
        }
    },

    handleLeaveDecision(leaveId, status) {
        const decisionNote = status === 'Approved' ? 'Sanctioned by Principal' : 'Declined as per academic scheduling constraints';
        window.store.updateLeaveStatus(leaveId, status, decisionNote, 'Dr. Meenakshi Sundaram (Principal)');
        window.app.renderCurrentView();
        window.app.showToast(`Leave request ${status.toLowerCase()}!`, status === 'Approved' ? 'success' : 'warning');
    },

    // Open Direct Salary / Daily Wage Feed Modal
    openDirectSalaryModal() {
        const container = document.getElementById("payrollModalContainer");
        if (!container) return;

        const teachers = window.store.getTeachers();

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4 max-h-[90vh] overflow-y-auto">
                    <div class="p-5 bg-gradient-to-r from-amber-600 to-orange-700 text-white flex items-center justify-between sticky top-0 z-10">
                        <div>
                            <h3 class="font-bold text-base">Direct Salary & Wage Entry</h3>
                            <p class="text-xs text-amber-100">Feed Fixed Monthly Pay, Per-Day Daily Wages, or Guest Lecture Rates</p>
                        </div>
                        <button onclick="document.getElementById('payrollModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="window.PayrollLeavesModule.handleDirectSalarySubmit(event)" class="p-6 space-y-4 text-xs">
                        <!-- Pay Structure Mode Selector -->
                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Select Pay Structure / Model *</label>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <label class="p-2.5 rounded-xl border border-amber-300 bg-amber-50/50 dark:bg-amber-950/30 flex flex-col items-center text-center cursor-pointer hover:border-amber-500">
                                    <input type="radio" name="payType" value="fixed" checked onchange="window.PayrollLeavesModule.handlePayTypeChange(this.value)" class="mb-1">
                                    <span class="font-bold text-slate-800 dark:text-slate-200 text-[11px]">💵 Fixed Monthly</span>
                                    <span class="text-[9px] text-slate-400">Lump-Sum Pay</span>
                                </label>
                                <label class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center cursor-pointer hover:border-sky-500">
                                    <input type="radio" name="payType" value="daily" onchange="window.PayrollLeavesModule.handlePayTypeChange(this.value)" class="mb-1">
                                    <span class="font-bold text-slate-800 dark:text-slate-200 text-[11px]">📅 Per-Day Wage</span>
                                    <span class="text-[9px] text-slate-400">Rate × Days</span>
                                </label>
                                <label class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center cursor-pointer hover:border-purple-500">
                                    <input type="radio" name="payType" value="lecture" onchange="window.PayrollLeavesModule.handlePayTypeChange(this.value)" class="mb-1">
                                    <span class="font-bold text-slate-800 dark:text-slate-200 text-[11px]">🎓 Per-Lecture</span>
                                    <span class="text-[9px] text-slate-400">Guest Teacher</span>
                                </label>
                                <label class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center cursor-pointer hover:border-indigo-500">
                                    <input type="radio" name="payType" value="formal" onchange="window.PayrollLeavesModule.handlePayTypeChange(this.value)" class="mb-1">
                                    <span class="font-bold text-slate-800 dark:text-slate-200 text-[11px]">🏢 7th Pay CTC</span>
                                    <span class="text-[9px] text-slate-400">EPF/DA/HRA</span>
                                </label>
                            </div>
                        </div>

                        <!-- Staff Member Info -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Existing Faculty or Custom *</label>
                                <select id="staffSelectDropdown" onchange="window.PayrollLeavesModule.handleStaffSelect(this.value)" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                    <option value="custom">-- Type Custom Staff Name --</option>
                                    ${teachers.map(t => `<option value="${t.id}" data-name="${t.name}" data-desig="${t.designation}">${t.name} (${t.designation})</option>`).join('')}
                                    <option value="drv-01" data-name="Balwinder Singh" data-desig="School Bus Driver">Balwinder Singh (Bus Driver)</option>
                                    <option value="sup-01" data-name="Radha Devi" data-desig="Primary Ayah / Support Staff">Radha Devi (Ayah / Support Staff)</option>
                                    <option value="sec-01" data-name="Ram Bahadur" data-desig="Campus Security Guard">Ram Bahadur (Security Guard)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Staff / Employee Name *</label>
                                <input id="staffNameInput" name="staffName" required placeholder="e.g. Ramesh Kumar" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation / Role *</label>
                                <input id="staffDesigInput" name="designation" required placeholder="e.g. Computer Teacher / Peon / Driver" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary Month *</label>
                                <input name="monthYear" value="September 2025" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                            </div>
                        </div>

                        <!-- Dynamic Pay Fields Container -->
                        <div id="dynamicPayFields" class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                            <!-- Default: Fixed Monthly -->
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Fixed Monthly Salary (INR ₹) *</label>
                                    <input id="fixedSalaryInput" name="fixedSalary" type="number" step="100" value="22000" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-sm">
                                </div>
                                <div>
                                    <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Loss of Pay (LOP) / Unpaid Leaves (₹)</label>
                                    <input id="lopInput" name="lopDeduction" type="number" step="100" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 font-bold">
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Advance / Loan Deduction (₹)</label>
                                    <input id="advanceInput" name="advanceDeduction" type="number" step="100" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 font-bold">
                                </div>
                                <div>
                                    <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bonus / Extra Allowance (₹)</label>
                                    <input id="allowanceInput" name="specialAllowance" type="number" step="100" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 font-bold">
                                </div>
                            </div>
                        </div>

                        <!-- Payment Disbursement Mode -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Disbursement Payment Mode *</label>
                                <select name="paymentMode" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                    <option value="Cash at Accounts Counter">💵 Cash at Accounts Desk</option>
                                    <option value="Direct UPI (GPay / PhonePe / Paytm)">📱 Direct UPI Transfer (GPay/PhonePe)</option>
                                    <option value="Direct Bank Transfer (NEFT/RTGS)">🏦 Direct Bank Transfer (NEFT/RTGS)</option>
                                    <option value="Bank Cheque / Draft">📜 Bank Cheque</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Disbursement Date</label>
                                <input name="paymentDate" type="date" value="${new Date().toISOString().split('T')[0]}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <!-- Live Net Pay Calculated Card -->
                        <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200 dark:border-emerald-900 flex justify-between items-center">
                            <div>
                                <span class="text-[10px] uppercase font-bold text-slate-500 block">Calculated Net Take-Home Salary</span>
                                <strong id="netPayDisplay" class="text-xl font-black text-emerald-600">₹22,000</strong>
                            </div>
                            <span class="text-[11px] text-slate-500">1-Click PDF Payslip generated</span>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('payrollModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow">Disburse & Save Salary</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleStaffSelect(val) {
        const drop = document.getElementById("staffSelectDropdown");
        const selectedOpt = drop.options[drop.selectedIndex];
        const nameInput = document.getElementById("staffNameInput");
        const desigInput = document.getElementById("staffDesigInput");

        if (val !== "custom" && selectedOpt) {
            nameInput.value = selectedOpt.getAttribute("data-name") || "";
            desigInput.value = selectedOpt.getAttribute("data-desig") || "";
        }
    },

    handlePayTypeChange(payType) {
        const container = document.getElementById("dynamicPayFields");
        if (!container) return;

        if (payType === "fixed") {
            container.innerHTML = `
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Fixed Monthly Salary (INR ₹) *</label>
                        <input id="fixedSalaryInput" name="fixedSalary" type="number" step="100" value="22000" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-sm">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Loss of Pay (LOP) / Unpaid Leaves (₹)</label>
                        <input id="lopInput" name="lopDeduction" type="number" step="100" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 font-bold">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Advance / Loan Deduction (₹)</label>
                        <input id="advanceInput" name="advanceDeduction" type="number" step="100" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 font-bold">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bonus / Extra Allowance (₹)</label>
                        <input id="allowanceInput" name="specialAllowance" type="number" step="100" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 font-bold">
                    </div>
                </div>
            `;
        } else if (payType === "daily") {
            container.innerHTML = `
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Daily Wage Rate (₹ / Day) *</label>
                        <input id="dailyRateInput" name="dailyRate" type="number" step="50" value="750" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-sm">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Days Worked (Days) *</label>
                        <input id="daysWorkedInput" name="daysWorked" type="number" step="1" max="31" value="24" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sky-600 font-bold">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Overtime / Extra Duty Pay (₹)</label>
                        <input id="overtimeInput" name="overtimeAllowance" type="number" step="50" value="1000" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 font-bold">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Advance / Cash Adjustment (₹)</label>
                        <input id="advanceInput" name="advanceDeduction" type="number" step="50" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 font-bold">
                    </div>
                </div>
            `;
        } else if (payType === "lecture") {
            container.innerHTML = `
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rate per Period / Lecture (₹) *</label>
                        <input id="periodRateInput" name="periodRate" type="number" step="50" value="400" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-sm">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Periods Delivered *</label>
                        <input id="periodsDeliveredInput" name="periodsDelivered" type="number" step="1" value="40" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-purple-600 font-bold">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Special Incentive (₹)</label>
                        <input id="allowanceInput" name="specialAllowance" type="number" step="50" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 font-bold">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">TDS / Advance Deduction (₹)</label>
                        <input id="advanceInput" name="advanceDeduction" type="number" step="50" value="0" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 font-bold">
                    </div>
                </div>
            `;
        } else {
            // Formal 7th Pay
            container.innerHTML = `
                <div class="grid grid-cols-3 gap-2">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Basic Pay (₹) *</label>
                        <input id="basicPayInput" name="basicPay" type="number" step="500" value="45000" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">DA (40%)</label>
                        <input id="daDisplay" name="dearnessAllowance" readonly value="18000" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">HRA (25%)</label>
                        <input id="hraDisplay" name="houseRentAllowance" readonly value="11250" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">EPF Deduction (12%)</label>
                        <input id="epfDisplay" name="epfDeduction" readonly value="5400" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-rose-600 font-bold">
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">TDS Tax (₹)</label>
                        <input id="tdsInput" name="tdsDeduction" type="number" step="100" value="3500" oninput="window.PayrollLeavesModule.calculateNetPay()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 font-bold">
                    </div>
                </div>
            `;
        }
        this.calculateNetPay();
    },

    calculateNetPay() {
        const radios = document.getElementsByName("payType");
        let payType = "fixed";
        for (const r of radios) {
            if (r.checked) payType = r.value;
        }

        let gross = 0;
        let deductions = 0;

        if (payType === "fixed") {
            const fixed = Number(document.getElementById("fixedSalaryInput")?.value || 0);
            const allow = Number(document.getElementById("allowanceInput")?.value || 0);
            const lop = Number(document.getElementById("lopInput")?.value || 0);
            const adv = Number(document.getElementById("advanceInput")?.value || 0);
            gross = fixed + allow;
            deductions = lop + adv;
        } else if (payType === "daily") {
            const rate = Number(document.getElementById("dailyRateInput")?.value || 0);
            const days = Number(document.getElementById("daysWorkedInput")?.value || 0);
            const ot = Number(document.getElementById("overtimeInput")?.value || 0);
            const adv = Number(document.getElementById("advanceInput")?.value || 0);
            gross = (rate * days) + ot;
            deductions = adv;
        } else if (payType === "lecture") {
            const rate = Number(document.getElementById("periodRateInput")?.value || 0);
            const periods = Number(document.getElementById("periodsDeliveredInput")?.value || 0);
            const allow = Number(document.getElementById("allowanceInput")?.value || 0);
            const adv = Number(document.getElementById("advanceInput")?.value || 0);
            gross = (rate * periods) + allow;
            deductions = adv;
        } else {
            const basic = Number(document.getElementById("basicPayInput")?.value || 0);
            const da = Math.round(basic * 0.40);
            const hra = Math.round(basic * 0.25);
            const epf = Math.round(basic * 0.12);
            const tds = Number(document.getElementById("tdsInput")?.value || 0);

            const daEl = document.getElementById("daDisplay");
            const hraEl = document.getElementById("hraDisplay");
            const epfEl = document.getElementById("epfDisplay");
            if (daEl) daEl.value = da;
            if (hraEl) hraEl.value = hra;
            if (epfEl) epfEl.value = epf;

            gross = basic + da + hra;
            deductions = epf + tds + 200; // PT
        }

        const net = Math.max(0, gross - deductions);
        const netDisplay = document.getElementById("netPayDisplay");
        if (netDisplay) {
            netDisplay.innerText = window.AppFormatters.formatCurrency(net, '₹');
        }
    },

    handleDirectSalarySubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payType = fd.get("payType") || "fixed";
        const staffName = fd.get("staffName");
        const designation = fd.get("designation");
        const monthYear = fd.get("monthYear");
        const paymentMode = fd.get("paymentMode");
        const paymentDate = fd.get("paymentDate");

        let entry = {
            staffId: `emp-${Date.now().toString(36)}`,
            staffName: staffName,
            designation: designation,
            payType: payType,
            monthYear: monthYear,
            paymentMode: paymentMode,
            paymentDate: paymentDate,
            status: "Paid & Disbursed"
        };

        if (payType === "fixed") {
            const fixed = Number(fd.get("fixedSalary") || 0);
            const allow = Number(fd.get("specialAllowance") || 0);
            const lop = Number(fd.get("lopDeduction") || 0);
            const adv = Number(fd.get("advanceDeduction") || 0);
            entry.fixedSalary = fixed;
            entry.specialAllowance = allow;
            entry.lopDeduction = lop;
            entry.advanceDeduction = adv;
            entry.grossSalary = fixed + allow;
            entry.totalDeductions = lop + adv;
            entry.netSalary = entry.grossSalary - entry.totalDeductions;
            entry.payTypeLabel = `Direct Fixed Monthly (₹${fixed.toLocaleString('en-IN')})`;
        } else if (payType === "daily") {
            const rate = Number(fd.get("dailyRate") || 0);
            const days = Number(fd.get("daysWorked") || 0);
            const ot = Number(fd.get("overtimeAllowance") || 0);
            const adv = Number(fd.get("advanceDeduction") || 0);
            entry.dailyRate = rate;
            entry.daysWorked = days;
            entry.baseEarned = rate * days;
            entry.overtimeAllowance = ot;
            entry.advanceDeduction = adv;
            entry.grossSalary = entry.baseEarned + ot;
            entry.totalDeductions = adv;
            entry.netSalary = entry.grossSalary - entry.totalDeductions;
            entry.payTypeLabel = `Daily Wage (${days} Days @ ₹${rate}/day)`;
        } else if (payType === "lecture") {
            const rate = Number(fd.get("periodRate") || 0);
            const periods = Number(fd.get("periodsDelivered") || 0);
            const allow = Number(fd.get("specialAllowance") || 0);
            const adv = Number(fd.get("advanceDeduction") || 0);
            entry.periodRate = rate;
            entry.periodsDelivered = periods;
            entry.baseEarned = rate * periods;
            entry.specialAllowance = allow;
            entry.advanceDeduction = adv;
            entry.grossSalary = entry.baseEarned + allow;
            entry.totalDeductions = adv;
            entry.netSalary = entry.grossSalary - entry.totalDeductions;
            entry.payTypeLabel = `Lecture Rate (${periods} Periods @ ₹${rate})`;
        } else {
            const basic = Number(fd.get("basicPay") || 0);
            const da = Math.round(basic * 0.40);
            const hra = Math.round(basic * 0.25);
            const epf = Math.round(basic * 0.12);
            const tds = Number(fd.get("tdsDeduction") || 0);
            entry.basicPay = basic;
            entry.dearnessAllowance = da;
            entry.houseRentAllowance = hra;
            entry.epfDeduction = epf;
            entry.tdsDeduction = tds;
            entry.professionalTax = 200;
            entry.grossSalary = basic + da + hra;
            entry.totalDeductions = epf + tds + 200;
            entry.netSalary = entry.grossSalary - entry.totalDeductions;
            entry.payTypeLabel = "7th Pay Scale (CBSE Standard)";
        }

        window.store.addStaffPayrollEntry(entry);
        document.getElementById('payrollModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Salary disbursed & recorded for ${staffName}!`, "success");
    },

    openApplyLeaveModal() {
        const container = document.getElementById("payrollModalContainer");
        if (!container) return;

        const teachers = window.store.getTeachers();

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Submit Faculty Leave Application</h3>
                            <p class="text-xs text-indigo-100">Casual Leave, Medical Leave, or Academic Duty</p>
                        </div>
                        <button onclick="document.getElementById('payrollModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="window.PayrollLeavesModule.handleApplyLeaveSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Faculty Member *</label>
                            <select name="staffId" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.designation})</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Leave Category *</label>
                            <select name="leaveType" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                                <option value="Medical Leave (ML)">Medical Leave (ML)</option>
                                <option value="Earned / Privilege Leave (EL)">Earned / Privilege Leave (EL)</option>
                                <option value="Duty Leave (CBSE Workshop / Exam Duty)">Duty Leave (CBSE Workshop / Exam Duty)</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">From Date *</label>
                                <input name="fromDate" type="date" required value="${new Date().toISOString().split('T')[0]}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">To Date *</label>
                                <input name="toDate" type="date" required value="${new Date().toISOString().split('T')[0]}" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason for Absence *</label>
                            <textarea name="reason" rows="3" required placeholder="Provide clear reason for leave..." class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"></textarea>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('payrollModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleApplyLeaveSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const staffId = fd.get("staffId");
        const teacher = window.store.getTeacherById(staffId) || { name: "Faculty", designation: "Teacher" };

        const newLeave = {
            staffId: staffId,
            staffName: teacher.name,
            designation: teacher.designation,
            leaveType: fd.get("leaveType"),
            fromDate: fd.get("fromDate"),
            toDate: fd.get("toDate"),
            totalDays: 2,
            reason: fd.get("reason"),
            decisionNote: null,
            approvedBy: null
        };

        window.store.applyStaffLeave(newLeave);
        document.getElementById('payrollModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast("Leave application submitted to Principal Desk!", "success");
    },

    openProcessPayrollModal() {
        const container = document.getElementById("payrollModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Batch Process Staff Monthly Payroll</h3>
                            <p class="text-xs text-emerald-100">Disburse monthly staff salary register in 1-click</p>
                        </div>
                        <button onclick="document.getElementById('payrollModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="window.PayrollLeavesModule.handleProcessPayrollSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary Month *</label>
                            <input name="monthYear" value="September 2025" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                        </div>

                        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                            <div class="flex justify-between"><span>Active Employees on Payroll:</span> <strong>4 Staff Members</strong></div>
                            <div class="flex justify-between"><span>Fixed & Daily Staff:</span> <strong>2 Members (Driver & PRT)</strong></div>
                            <div class="flex justify-between"><span>7th Pay Staff:</span> <strong>2 PGT Teachers</strong></div>
                            <div class="flex justify-between text-emerald-600 font-bold"><span>Total Net Disbursal:</span> <strong>₹1,89,500</strong></div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('payrollModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow">Disburse All Monthly Payroll</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleProcessPayrollSubmit(e) {
        e.preventDefault();
        document.getElementById('payrollModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast("Batch processed monthly staff payroll!", "success");
    }
};
