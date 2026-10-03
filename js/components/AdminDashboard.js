// Admin Dashboard Component

window.AdminDashboard = {
    render() {
        const students = window.store.getStudents();
        const teachers = window.store.getTeachers();
        const fees = window.store.getFees();
        const notices = window.store.getNotices();
        const school = window.store.getSchool();

        // Calculate Totals
        const totalStudents = students.length;
        const totalTeachers = teachers.length;
        
        let totalFeeExpected = 0;
        let totalFeeCollected = 0;
        let totalFeeDue = 0;

        fees.forEach(f => {
            totalFeeExpected += (f.totalAmount || 0);
            totalFeeCollected += (f.paidAmount || 0);
            totalFeeDue += (f.dueAmount || 0);
        });

        // Attendance stats
        const todayStr = new Date().toISOString().split('T')[0];
        const todayAttendance = window.store.getAttendance(todayStr, "cls-10a");
        let presentCount = 0;
        let totalMarked = 0;
        Object.keys(todayAttendance).forEach(stuId => {
            totalMarked++;
            if (todayAttendance[stuId].status === "P" || todayAttendance[stuId].status === "L") {
                presentCount++;
            }
        });
        const todayRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 94;

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Welcome Banner -->
                <div class="p-6 rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white shadow-xl relative overflow-hidden">
                    <div class="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div class="flex items-center space-x-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>Academic Session ${school.academicYear} • ${school.currentTerm}</span>
                            </div>
                            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome, Administrator</h1>
                            <p class="text-indigo-100 text-sm mt-1 max-w-xl">
                                Real-time operational overview of ${school.name}. Track enrollment, fee collections, faculty performance, and attendance.
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2.5">
                            <button onclick="window.app.navigate('students')" class="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-sm rounded-xl shadow transition flex items-center space-x-2">
                                <i data-lucide="user-plus" class="w-4 h-4"></i>
                                <span>Add Student</span>
                            </button>
                            <button onclick="window.app.navigate('fees')" class="px-4 py-2.5 bg-indigo-500/40 hover:bg-indigo-500/60 border border-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-sm transition flex items-center space-x-2">
                                <i data-lucide="receipt" class="w-4 h-4"></i>
                                <span>Collect Fee</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- KPI Metric Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <!-- Card 1: Students -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Enrollment</span>
                            <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <i data-lucide="users" class="w-5 h-5"></i>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${totalStudents}</h3>
                            <p class="text-xs text-emerald-600 font-medium flex items-center space-x-1 mt-1">
                                <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
                                <span>15 Classes (Playgroup to 10th)</span>
                            </p>
                        </div>
                    </div>

                    <!-- Card 2: Faculty -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Teaching Faculty</span>
                            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <i data-lucide="graduation-cap" class="w-5 h-5"></i>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${totalTeachers}</h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                <span>100% Assigned to Depts</span>
                            </p>
                        </div>
                    </div>

                    <!-- Card 3: Attendance -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Today's Attendance</span>
                            <div class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                                <i data-lucide="calendar-check" class="w-5 h-5"></i>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${todayRate}%</h3>
                            <p class="text-xs text-emerald-600 font-medium flex items-center space-x-1 mt-1">
                                <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                                <span>High attendance standing</span>
                            </p>
                        </div>
                    </div>

                    <!-- Card 4: Fee Revenue -->
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fee Collection Rate</span>
                            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <i data-lucide="dollar-sign" class="w-5 h-5"></i>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${window.AppFormatters.formatCurrency(totalFeeCollected, school.currency)}</h3>
                            <p class="text-xs text-amber-600 font-medium mt-1">
                                <span>${window.AppFormatters.formatCurrency(totalFeeDue, school.currency)} pending dues</span>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Chart 1: Financial Collections -->
                    <div class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Fee Collection & Dues Analysis</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400">Class-wise breakdown of tuition and levies</p>
                            </div>
                            <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                Current Term
                            </span>
                        </div>
                        <div class="relative h-64 w-full">
                            <canvas id="adminFeeChart"></canvas>
                        </div>
                    </div>

                    <!-- Chart 2: Attendance Trends -->
                    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Weekly Attendance</h3>
                                <span class="text-xs text-slate-500">Last 5 Days</span>
                            </div>
                            <div class="relative h-56 w-full">
                                <canvas id="adminAttendanceChart"></canvas>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                            <span class="flex items-center space-x-1">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <span>Present Avg: 94.8%</span>
                            </span>
                            <button onclick="window.app.navigate('attendance')" class="text-indigo-600 font-semibold hover:underline">View Sheet &rarr;</button>
                        </div>
                    </div>
                </div>

                <!-- Bottom Row: Recent Notices & Quick Shortcuts -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Recent Circulars -->
                    <div class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                                    <i data-lucide="bell" class="w-4 h-4"></i>
                                </div>
                                <h3 class="font-bold text-slate-900 dark:text-white text-base">Latest Official Announcements</h3>
                            </div>
                            <button onclick="window.app.navigate('notices')" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
                        </div>
                        <div class="space-y-3">
                            ${notices.slice(0, 3).map(n => `
                                <div class="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-start space-x-3">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                                        n.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                                        n.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                                    }">
                                        ${n.category}
                                    </span>
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-semibold text-sm text-slate-900 dark:text-white truncate">${n.title}</h4>
                                        <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">${n.content}</p>
                                    </div>
                                    <span class="text-xs text-slate-400 whitespace-nowrap">${window.AppFormatters.formatDate(n.date)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Quick Admin Operations -->
                    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 class="font-bold text-slate-900 dark:text-white text-base mb-4">Quick Management Actions</h3>
                        <div class="space-y-2.5">
                            <button onclick="window.app.navigate('attendance')" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center space-x-3 text-left transition group">
                                <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <i data-lucide="check-square" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">Daily Attendance Marker</h4>
                                    <p class="text-[11px] text-slate-400">Review or log class records</p>
                                </div>
                            </button>

                            <button onclick="window.app.navigate('gradebook')" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center space-x-3 text-left transition group">
                                <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                    <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">Exam Gradebook & Cards</h4>
                                    <p class="text-[11px] text-slate-400">Generate PDF report cards</p>
                                </div>
                            </button>

                            <button onclick="window.app.navigate('timetable')" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center space-x-3 text-left transition group">
                                <div class="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                                    <i data-lucide="clock" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">Weekly Timetable</h4>
                                    <p class="text-[11px] text-slate-400">Manage class schedule slots</p>
                                </div>
                            </button>

                            <button onclick="window.store.exportJSON()" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center space-x-3 text-left transition group">
                                <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                    <i data-lucide="download-cloud" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">Export System Database</h4>
                                    <p class="text-[11px] text-slate-400">Instant JSON backup</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    initCharts() {
        if (!window.Chart) return;

        // Clean up existing chart instances if any
        if (window.adminFeeChartInstance) window.adminFeeChartInstance.destroy();
        if (window.adminAttendanceChartInstance) window.adminAttendanceChartInstance.destroy();

        // 1. Fee Bar Chart
        const feeCtx = document.getElementById("adminFeeChart");
        if (feeCtx) {
            window.adminFeeChartInstance = new Chart(feeCtx, {
                type: 'bar',
                data: {
                    labels: ['Playgroup', 'Nursery & KG', 'Primary (1-5)', 'Middle (6-8)', 'Class 9', 'Class 10 (Board)'],
                    datasets: [
                        {
                            label: 'Collected (₹)',
                            data: [252000, 215000, 189000, 198000, 280000, 315000],
                            backgroundColor: '#4f46e5',
                            borderRadius: 6
                        },
                        {
                            label: 'Outstanding (₹)',
                            data: [63000, 48000, 56000, 32000, 45000, 38000],
                            backgroundColor: '#f59e0b',
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
                    },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        // 2. Attendance Line Chart
        const attCtx = document.getElementById("adminAttendanceChart");
        if (attCtx) {
            window.adminAttendanceChartInstance = new Chart(attCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    datasets: [{
                        label: 'Attendance %',
                        data: [96, 94, 98, 92, 95],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#10b981',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { min: 80, max: 100, grid: { color: '#f1f5f9' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }
};
