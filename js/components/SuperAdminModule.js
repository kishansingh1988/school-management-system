// SaaS Platform Owner Master Authority & Multi-Tenant School Control Center

window.SuperAdminModule = {
    render() {
        const schools = window.store.getAllSchools();
        const activeSchool = window.store.getActiveSchool();

        // Calculate SaaS Metrics
        let totalMRR = 0;
        let activeCount = 0;
        let overdueCount = 0;
        let trialCount = 0;

        schools.forEach(s => {
            const sub = s.subscription || {};
            totalMRR += (sub.monthlyFee || 0);
            if (sub.paymentStatus === 'Paid & Active') activeCount++;
            else if (sub.paymentStatus === 'Payment Overdue' || sub.paymentStatus === 'Suspended') overdueCount++;
            else if (sub.paymentStatus === 'Active Trial') trialCount++;
        });

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Master Authority Top Banner -->
                <div class="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
                    <div class="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0 border border-white/20">
                                <i data-lucide="crown" class="w-8 h-8 text-amber-300"></i>
                            </div>
                            <div>
                                <div class="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">Master License Controller</span>
                                    <span>•</span>
                                    <span>Commercial SaaS Platform Edition</span>
                                </div>
                                <h1 class="text-2xl md:text-3xl font-black tracking-tight text-white">SaaS Platform Owner Authority Suite</h1>
                                <p class="text-indigo-200 text-xs mt-1 max-w-2xl leading-relaxed">
                                    Central command to manage client schools, toggle individual facilities (stop/resume on demand), enforce payment suspensions, and onboard new institutions.
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2.5">
                            <button onclick="window.SuperAdminModule.openAddSchoolModal()" class="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2 border border-white/20">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                <span>+ Onboard New School</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- SaaS Revenue & Operational Metrics Bar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <!-- Total Schools -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <i data-lucide="school" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Client Schools</span>
                            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">${schools.length} Institutions</h3>
                            <p class="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">${activeCount} Active • ${trialCount} Trial</p>
                        </div>
                    </div>

                    <!-- Monthly SaaS Revenue -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <i data-lucide="indian-rupee" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly SaaS Revenue</span>
                            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">${window.AppFormatters.formatCurrency(totalMRR, '₹')}</h3>
                            <p class="text-[11px] text-emerald-600 font-medium">Recurring software subscriptions</p>
                        </div>
                    </div>

                    <!-- Payment Status -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl ${overdueCount > 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center shrink-0">
                            <i data-lucide="${overdueCount > 0 ? 'alert-triangle' : 'check-circle-2'}" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Billing Health</span>
                            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">${overdueCount > 0 ? `${overdueCount} Overdue` : 'All Paid'}</h3>
                            <p class="text-[11px] ${overdueCount > 0 ? 'text-amber-600' : 'text-emerald-600'} font-medium">${overdueCount > 0 ? 'Requires attention / suspension' : '100% On-time settlements'}</p>
                        </div>
                    </div>

                    <!-- Active Tenant -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                        <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <i data-lucide="eye" class="w-6 h-6"></i>
                        </div>
                        <div class="min-w-0">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Tenant View</span>
                            <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">${activeSchool.name}</h3>
                            <p class="text-[11px] text-purple-600 font-medium truncate">${activeSchool.city} (${activeSchool.subscription ? activeSchool.subscription.plan : 'Pro'})</p>
                        </div>
                    </div>
                </div>

                <!-- Client Schools Directory & Granular Facility Authority Matrix -->
                <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <h3 class="font-extrabold text-base text-slate-900 dark:text-white">Client Institutions & Facility Control Matrix</h3>
                            <p class="text-xs text-slate-500">Toggle individual features on or off in real-time based on contract terms, package purchases, or payment receipts.</p>
                        </div>
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-xl">
                            ${schools.length} Schools Enrolled
                        </span>
                    </div>

                    <!-- School Cards -->
                    <div class="space-y-6">
                        ${schools.map((sch, sIdx) => {
                            const sub = sch.subscription || {};
                            const fac = sch.facilities || {};
                            const isCurrentActive = sch.id === activeSchool.id;
                            const isSuspended = sub.paymentStatus === 'Suspended';
                            const isOverdue = sub.paymentStatus === 'Payment Overdue';

                            return `
                                <div class="p-6 rounded-2xl border ${isCurrentActive ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} shadow-sm space-y-5">
                                    <!-- School Header Row -->
                                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div class="flex items-start space-x-3.5">
                                            <div class="w-12 h-12 rounded-2xl ${
                                                isSuspended ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60' :
                                                isOverdue ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60' :
                                                'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60'
                                            } flex items-center justify-center font-black text-lg shrink-0">
                                                ${sIdx + 1}
                                            </div>
                                            <div>
                                                <div class="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 class="text-base font-extrabold text-slate-900 dark:text-white">${sch.name}</h3>
                                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        sub.paymentStatus === 'Paid & Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                                        sub.paymentStatus === 'Active Trial' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                                                        sub.paymentStatus === 'Payment Overdue' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                    }">
                                                        ${sub.paymentStatus || 'Active'}
                                                    </span>
                                                    ${isCurrentActive ? `
                                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                                                            Currently Selected Tenant
                                                        </span>
                                                    ` : ''}
                                                </div>
                                                <p class="text-xs text-slate-500">
                                                    ${sch.address} • Principal: <strong>${sch.principal || 'N/A'}</strong> • Code: <span class="font-mono text-indigo-600 font-bold">${sch.code || sch.id}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Billing & Quick Authority Controls -->
                                        <div class="flex flex-wrap items-center gap-2">
                                            <div class="text-right px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <span class="text-[10px] uppercase font-bold text-slate-400 block">SaaS Subscription Fee</span>
                                                <span class="text-xs font-bold text-slate-900 dark:text-white">${window.AppFormatters.formatCurrency(sub.monthlyFee || 0, '₹')} / mo</span>
                                            </div>

                                            ${!isCurrentActive ? `
                                                <button onclick="window.SuperAdminModule.switchToSchool('${sch.id}')" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5">
                                                    <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                                                    <span>Switch Tenant</span>
                                                </button>
                                            ` : ''}

                                            ${isSuspended ? `
                                                <button onclick="window.SuperAdminModule.setPaymentStatus('${sch.id}', 'Paid & Active')" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5">
                                                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                                                    <span>Resume All Services</span>
                                                </button>
                                            ` : `
                                                <button onclick="window.SuperAdminModule.setPaymentStatus('${sch.id}', 'Suspended')" class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-900 transition flex items-center space-x-1.5">
                                                    <i data-lucide="pause-circle" class="w-3.5 h-3.5"></i>
                                                    <span>Suspend (Unpaid)</span>
                                                </button>
                                            `}
                                        </div>
                                    </div>

                                    <!-- Granular Facility Authority Switches -->
                                    <div class="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                                        <div class="flex items-center justify-between mb-3">
                                            <span class="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                                                <i data-lucide="sliders" class="w-4 h-4 text-indigo-600"></i>
                                                <span>Facility Enable / Disable Authority (Stop or Resume per Payment)</span>
                                            </span>
                                            <span class="text-[11px] text-slate-400">Plan: <strong>${sub.plan || 'Standard'}</strong></span>
                                        </div>

                                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
                                            <!-- Attendance Toggle -->
                                            ${this.renderFacilityToggle(sch.id, 'attendance', 'Daily Attendance', fac.attendance, 'calendar-check')}

                                            <!-- Digital Diary & Homework -->
                                            ${this.renderFacilityToggle(sch.id, 'homework', 'Digital Diary & HW', fac.homework, 'book-open-check')}

                                            <!-- Instant SMS & WhatsApp -->
                                            ${this.renderFacilityToggle(sch.id, 'smsAlerts', 'SMS/WhatsApp Gateway', fac.smsAlerts, 'send')}

                                            <!-- CBSE Gradebook -->
                                            ${this.renderFacilityToggle(sch.id, 'gradebook', 'CBSE Gradebook', fac.gradebook, 'file-spreadsheet')}

                                            <!-- Fee Invoicing & Ledger -->
                                            ${this.renderFacilityToggle(sch.id, 'fees', 'Fee Invoicing', fac.fees, 'receipt')}

                                            <!-- Timetable Scheduling -->
                                            ${this.renderFacilityToggle(sch.id, 'timetable', 'Class Timetables', fac.timetable, 'clock')}

                                            <!-- Noticeboard -->
                                            ${this.renderFacilityToggle(sch.id, 'notices', 'Noticeboard', fac.notices, 'bell')}

                                            <!-- GPS Transport & Fleet Tracking -->
                                            ${this.renderFacilityToggle(sch.id, 'transport', 'GPS Bus Tracking', fac.transport, 'bus')}

                                            <!-- Library Book Lending -->
                                            ${this.renderFacilityToggle(sch.id, 'library', 'Library Lending', fac.library, 'book-marked')}

                                            <!-- Staff Payroll & Leaves -->
                                            ${this.renderFacilityToggle(sch.id, 'payroll', 'Staff Payroll & Leaves', fac.payroll, 'badge-percent')}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Modal Container -->
                <div id="superAdminModalContainer"></div>
            </div>
        `;
    },

    renderFacilityToggle(schoolId, facilityKey, label, isEnabled, icon) {
        const active = Boolean(isEnabled);
        return `
            <div class="p-3 rounded-xl border ${active ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 opacity-70'} flex flex-col justify-between space-y-2">
                <div class="flex items-center space-x-2">
                    <i data-lucide="${icon}" class="w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}"></i>
                    <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">${label}</span>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span class="text-[10px] font-extrabold uppercase ${active ? 'text-emerald-600' : 'text-slate-400'}">
                        ${active ? 'Active ✅' : 'Paused ⏸️'}
                    </span>
                    <button onclick="window.SuperAdminModule.toggleFacility('${schoolId}', '${facilityKey}', ${!active})" class="px-2 py-1 rounded text-[10px] font-bold transition ${
                        active
                            ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                    }">
                        ${active ? 'Stop' : 'Resume'}
                    </button>
                </div>
            </div>
        `;
    },

    toggleFacility(schoolId, facilityKey, newStatus) {
        window.store.updateSchoolFacility(schoolId, facilityKey, newStatus);
        window.app.renderCurrentView();
        window.app.showToast(`${newStatus ? 'Resumed' : 'Stopped'} ${facilityKey} for school!`, newStatus ? 'success' : 'warning');
    },

    setPaymentStatus(schoolId, status) {
        const isPaid = status === 'Paid & Active';
        window.store.updateSchoolSubscription(schoolId, { paymentStatus: status });

        // If resuming payment, also auto-resume key operational facilities
        if (isPaid) {
            ['attendance', 'homework', 'smsAlerts', 'gradebook', 'fees', 'timetable', 'notices'].forEach(f => {
                window.store.updateSchoolFacility(schoolId, f, true);
            });
        }

        window.app.renderCurrentView();
        window.app.showToast(`Updated billing status to: ${status}`, isPaid ? 'success' : 'error');
    },

    switchToSchool(schoolId) {
        const sch = window.store.switchActiveSchool(schoolId);
        if (sch) {
            window.app.render();
            window.app.showToast(`Switched active tenant to: ${sch.name}`, 'info');
        }
    },

    openAddSchoolModal() {
        const container = document.getElementById("superAdminModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Onboard New Client School</h3>
                            <p class="text-xs text-indigo-100">Provision a new multi-tenant school instance with custom license plan</p>
                        </div>
                        <button onclick="document.getElementById('superAdminModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="window.SuperAdminModule.handleAddSchoolSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">School Name *</label>
                                <input name="name" required placeholder="e.g. Modern Public School" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City / Region *</label>
                                <input name="city" required placeholder="e.g. Chandigarh" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Complete Campus Address *</label>
                            <input name="address" required placeholder="e.g. Sector 22-A, Institutional Road, Chandigarh" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Principal / Director Name *</label>
                                <input name="principal" required placeholder="e.g. Mrs. Simran Kaur" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Affiliation / Board</label>
                                <input name="affiliation" placeholder="e.g. CBSE Affiliated No. 2130123" value="Affiliated to CBSE, New Delhi" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subscription Tier *</label>
                                <select name="plan" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                                    <option value="CBSE Pro (Enterprise)">CBSE Pro (Enterprise)</option>
                                    <option value="Standard Academic Tier">Standard Academic Tier</option>
                                    <option value="Starter Free Trial">Starter Free Trial (30 Days)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly SaaS Fee (₹ INR) *</label>
                                <input name="monthlyFee" type="number" value="15000" required class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('superAdminModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Provision School Tenant</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    },

    handleAddSchoolSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const fd = new FormData(form);

        const newSch = {
            name: fd.get("name"),
            city: fd.get("city"),
            address: fd.get("address"),
            principal: fd.get("principal"),
            affiliation: fd.get("affiliation"),
            phone: "+91 11 0000 0000",
            email: "info@school.edu.in",
            academicYear: "2025 - 2026",
            currentTerm: "Term 1",
            currency: "₹",
            subscription: {
                plan: fd.get("plan"),
                monthlyFee: parseInt(fd.get("monthlyFee"), 10) || 15000,
                billingCycle: "Monthly",
                paymentStatus: "Paid & Active",
                lastPaymentDate: new Date().toISOString().split('T')[0],
                nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                licenseKey: `LIC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
            },
            facilities: {
                attendance: true,
                homework: true,
                smsAlerts: true,
                gradebook: true,
                fees: true,
                timetable: true,
                notices: true,
                students: true,
                teachers: true
            }
        };

        window.store.addSchoolTenant(newSch);
        document.getElementById('superAdminModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Successfully onboarded ${newSch.name}!`, 'success');
    }
};
