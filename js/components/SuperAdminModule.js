// SaaS Platform Owner Master Authority, Multi-Tenant School Control & Smart RFID IoT Hub

window.SuperAdminModule = {
    activeTab: 'rfid_hub', // 'institutions' | 'rfid_hub'
    selectedRfidStudentId: 'stu-1',
    lastPunchResult: null,

    render() {
        const schools = window.store.getAllSchools();
        const activeSchool = window.store.getActiveSchool();
        const students = window.store.getStudents();
        const rfidDevices = window.store.getRfidDevices();
        const rfidLogs = window.store.getRfidLogs();

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

        // Selected student for RFID simulation
        const selectedStudent = window.store.getStudentById(this.selectedRfidStudentId) || students[0] || {};
        const studentClass = window.store.getClassById(selectedStudent.classId);

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
                                    <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">👑 SaaS Platform Owner</span>
                                    <span>•</span>
                                    <span>Commercial Software & IoT Hardware Hub</span>
                                </div>
                                <h1 class="text-2xl md:text-3xl font-black tracking-tight text-white">SaaS Platform Owner Authority Suite</h1>
                                <p class="text-indigo-200 text-xs mt-1 max-w-2xl leading-relaxed">
                                    Manage client school licenses, provision IoT Smart RFID Card hardware readers, demonstrate live parent WhatsApp alerts, and control facility switches.
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

                <!-- Navigation Tabs Bar -->
                <div class="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-1">
                    <button onclick="window.SuperAdminModule.switchTab('rfid_hub')" class="px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                        this.activeTab === 'rfid_hub' 
                            ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
                    }">
                        <i data-lucide="scan" class="w-4 h-4"></i>
                        <span>📇 Smart RFID Hardware & IoT Gateway Hub</span>
                        <span class="px-1.5 py-0.2 bg-white/20 text-white text-[10px] rounded-full uppercase font-extrabold">New</span>
                    </button>

                    <button onclick="window.SuperAdminModule.switchTab('institutions')" class="px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                        this.activeTab === 'institutions' 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
                    }">
                        <i data-lucide="building" class="w-4 h-4"></i>
                        <span>🏫 Client Schools & Facility Matrix (${schools.length})</span>
                    </button>
                </div>

                ${this.activeTab === 'rfid_hub' ? this.renderRfidHubView(activeSchool, students, selectedStudent, studentClass, rfidDevices, rfidLogs) : this.renderInstitutionsView(schools, activeSchool, totalMRR, activeCount, overdueCount, trialCount)}

                <!-- Modal Container -->
                <div id="superAdminModalContainer"></div>
            </div>
        `;
    },

    switchTab(tab) {
        this.activeTab = tab;
        window.app.renderCurrentView();
    },

    renderRfidHubView(activeSchool, students, selectedStudent, studentClass, rfidDevices, rfidLogs) {
        return `
            <div class="space-y-6 animate-fade-in">
                
                <!-- Commercial Value Pitch Banner -->
                <div class="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
                    <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div class="space-y-2 max-w-2xl">
                            <div class="flex items-center space-x-2">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase">Ready for Hardware Pitch</span>
                                <span class="text-xs text-emerald-300 font-semibold">• High-Margin Add-on Service</span>
                            </div>
                            <h2 class="text-xl md:text-2xl font-black tracking-tight">Automated Smart RFID ID-Card & WhatsApp Attendance Suite</h2>
                            <p class="text-xs text-emerald-100 leading-relaxed">
                                Offer turnkey Smart Campus Safety to schools. When students tap their RFID ID Cards at classroom doors, school turnstiles, or buses, our cloud IoT gateway instantly records attendance and dispatches automated WhatsApp messages to parents in under 1 second.
                            </p>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 space-y-2 text-xs">
                            <div class="flex justify-between space-x-6"><span class="text-emerald-200">Smart RFID Cards:</span> <strong class="text-white font-mono">₹25 / card</strong></div>
                            <div class="flex justify-between space-x-6"><span class="text-emerald-200">IoT Wall Scanner (4G/Wi-Fi):</span> <strong class="text-white font-mono">₹4,999 / device</strong></div>
                            <div class="flex justify-between space-x-6"><span class="text-emerald-200">WhatsApp Notification API:</span> <strong class="text-white font-mono">₹0.12 / message</strong></div>
                            <div class="flex justify-between space-x-6"><span class="text-emerald-200">Cloud IoT Sync AMC:</span> <strong class="text-amber-300 font-mono">₹1,499 / mo / school</strong></div>
                        </div>
                    </div>
                </div>

                <!-- Interactive Live RFID Tap Simulator (For Principal Live Demo) -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    <!-- Left: Interactive Scanner Controls (7 cols) -->
                    <div class="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div class="flex items-center space-x-2.5">
                                <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                                    <i data-lucide="scan" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h3 class="font-extrabold text-sm text-slate-900 dark:text-white">Live RFID Card Tap Simulator</h3>
                                    <p class="text-[11px] text-slate-400">Demonstrate instant ID-card tap & live WhatsApp trigger to school management</p>
                                </div>
                            </div>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center space-x-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>IoT Engine Online</span>
                            </span>
                        </div>

                        <!-- Step 1: Select Student -->
                        <div>
                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                1. Select Student (Smart ID Card Holder) *
                            </label>
                            <select id="rfidStudentSelect" onchange="window.SuperAdminModule.selectRfidStudent(this.value)" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                ${students.map(s => {
                                    const c = window.store.getClassById(s.classId);
                                    const cName = c ? `${c.name} - ${c.section}` : '';
                                    return `<option value="${s.id}" ${s.id === this.selectedRfidStudentId ? 'selected' : ''}>${s.name} (${cName} • Roll #${s.rollNo} • Parent: ${s.parentName || 'Rajesh Sharma'})</option>`;
                                }).join('')}
                            </select>
                        </div>

                        <!-- Step 2: Select IoT Scanner Reader Location -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    2. Scanner Device & Location *
                                </label>
                                <select id="rfidDeviceSelect" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                    <option value="RFID-CLS-10A|Smart Classroom 10-A Door Terminal (Room 301)">🚪 Classroom 10-A Door Reader</option>
                                    <option value="RFID-GATE-01|Main Campus Entrance Pedestrian Turnstile">🏫 Main Campus Entrance Gate 1</option>
                                    <option value="RFID-GATE-02|Junior & Primary Wing Turnstile">🎒 Junior Wing Turnstile Gate 2</option>
                                    <option value="RFID-BUS-04|School GPS Bus #04 On-Board Scanner">🚌 School GPS Bus #04 Scanner</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    3. Punch Direction *
                                </label>
                                <select id="rfidDirectionSelect" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                    <option value="IN">🟢 PUNCH IN (Morning Check-In / Arrival)</option>
                                    <option value="OUT">🔴 PUNCH OUT (Afternoon Departure / Exit)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Step 3: Interactive Card Preview & Tap Trigger -->
                        <div class="p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div class="flex items-center space-x-3 min-w-0">
                                <img src="${selectedStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}" class="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500 shadow shrink-0" alt="${selectedStudent.name}">
                                <div class="min-w-0">
                                    <div class="flex items-center space-x-1.5">
                                        <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-indigo-600 text-white rounded">RFID SMART CARD</span>
                                        <span class="text-[10px] font-mono text-slate-400">UID: NFC-98421008</span>
                                    </div>
                                    <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">${selectedStudent.name || 'Aarav Sharma'}</h4>
                                    <p class="text-[11px] text-slate-500 truncate">${studentClass ? studentClass.name + ' - ' + studentClass.section : 'Class 10-A'} • Roll #${selectedStudent.rollNo || 101}</p>
                                </div>
                            </div>

                            <button onclick="window.SuperAdminModule.handleRfidSimulateTap()" class="px-5 py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 shrink-0 transform active:scale-95 border border-white/20">
                                <i data-lucide="radio" class="w-4 h-4 animate-ping"></i>
                                <span>📇 TAP RFID CARD NOW</span>
                            </button>
                        </div>
                    </div>

                    <!-- Right: Live WhatsApp Notification Output Preview (5 cols) -->
                    <div class="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div class="flex items-center space-x-2">
                                <span class="text-lg">📲</span>
                                <h3 class="font-extrabold text-sm text-slate-900 dark:text-white">Instant Parent WhatsApp Message</h3>
                            </div>
                            <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                                Real-Time Trigger
                            </span>
                        </div>

                        <!-- WhatsApp UI Simulation Card -->
                        <div id="rfidWhatsAppPreviewBox" class="rounded-2xl bg-[#EFEAE2] dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div class="space-y-2">
                                <div class="flex items-center space-x-2 pb-2 border-b border-slate-300/60 dark:border-slate-800">
                                    <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                                        AH
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <h5 class="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">${activeSchool.name}</h5>
                                        <span class="text-[9px] text-emerald-600 font-semibold block">Official WhatsApp Business Verified ✔️</span>
                                    </div>
                                </div>

                                <!-- Message Bubble -->
                                <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-800 dark:text-slate-200 space-y-1.5">
                                    <p class="font-bold text-indigo-700 dark:text-indigo-400 text-[11px] flex items-center space-x-1">
                                        <span>🔔 CAMPUS ATTENDANCE NOTIFICATION</span>
                                    </p>
                                    <p id="rfidSimulatedMsgText" class="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                        ${this.lastPunchResult 
                                            ? this.lastPunchResult.alertMessage 
                                            : `Dear Rajesh Sharma, your ward Aarav Sharma (Class 10 - A, Roll #101) has tapped their Smart ID Card & safely ENTERED at Classroom 10-A Door at 08:04:12 AM today (${window.AppFormatters.formatDate(new Date().toISOString().split('T')[0])}). Status: PRESENT (On-time). - ${activeSchool.name}`
                                        }
                                    </p>
                                    <div class="flex items-center justify-end space-x-1 text-[10px] text-slate-400 pt-1">
                                        <span id="rfidSimulatedTime">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span class="text-sky-500 font-bold">✓✓</span>
                                    </div>
                                </div>
                            </div>

                            <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                                <span>WhatsApp Gateway Speed:</span>
                                <strong class="font-mono">⚡ 0.12s Cloud Dispatch</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- IoT Fleet Status & Live Scan Log -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    <!-- Left: Connected IoT Hardware Readers (5 cols) -->
                    <div class="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <h3 class="font-extrabold text-sm text-slate-900 dark:text-white">Active IoT Hardware Devices</h3>
                                <p class="text-[11px] text-slate-400">Classroom & Gate turnstiles connected to ${activeSchool.name}</p>
                            </div>
                            <span class="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
                                4 Devices Online
                            </span>
                        </div>

                        <div class="space-y-3">
                            ${rfidDevices.map(d => `
                                <div class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                                    <div class="flex items-center space-x-3 min-w-0">
                                        <div class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                            <i data-lucide="${d.id.includes('BUS') ? 'bus' : (d.id.includes('CLS') ? 'door-closed' : 'shield-check')}" class="w-4 h-4"></i>
                                        </div>
                                        <div class="min-w-0">
                                            <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">${d.name}</h4>
                                            <p class="text-[10px] text-slate-400 font-mono truncate">${d.location} • IP: ${d.ip}</p>
                                        </div>
                                    </div>
                                    <div class="text-right shrink-0">
                                        <span class="text-[10px] font-bold text-emerald-600 block">${d.status.split(' ')[0]} ✅</span>
                                        <span class="text-[9px] text-slate-400 font-mono">${d.scansToday} scans today</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Right: Live RFID Punch Activity Stream (7 cols) -->
                    <div class="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <h3 class="font-extrabold text-sm text-slate-900 dark:text-white">Real-Time RFID Card Tap Feed</h3>
                                <p class="text-[11px] text-slate-400">Live stream of student swipes synced to cloud & parent WhatsApp</p>
                            </div>
                            <span class="text-[11px] font-bold text-emerald-600 flex items-center space-x-1">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Live Feed</span>
                            </span>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs">
                                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
                                    <tr>
                                        <th class="p-2.5">Student</th>
                                        <th class="p-2.5">Location / Gate</th>
                                        <th class="p-2.5">Direction</th>
                                        <th class="p-2.5">Punch Time</th>
                                        <th class="p-2.5 text-right">WhatsApp Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                                    ${rfidLogs.map(log => `
                                        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td class="p-2.5">
                                                <div class="font-bold text-slate-900 dark:text-white">${log.studentName}</div>
                                                <div class="text-[10px] text-slate-400">${log.className} • Roll #${log.studentRoll}</div>
                                            </td>
                                            <td class="p-2.5 font-medium text-slate-700 dark:text-slate-300">
                                                ${log.deviceLocation.split('(')[0]}
                                            </td>
                                            <td class="p-2.5">
                                                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${log.direction === 'IN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}">
                                                    ${log.direction === 'IN' ? 'CHECK-IN' : 'CHECK-OUT'}
                                                </span>
                                            </td>
                                            <td class="p-2.5 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                                ${log.timeStr}
                                            </td>
                                            <td class="p-2.5 text-right font-bold text-emerald-600">
                                                ${log.whatsAppStatus}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- IoT Machine Webhook API Integration Specs (For Hardware Engineers) -->
                <div class="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-4">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div class="flex items-center space-x-2.5">
                            <i data-lucide="code-2" class="w-5 h-5 text-amber-400"></i>
                            <div>
                                <h3 class="font-extrabold text-sm text-white">IoT Biometric / RFID Machine REST Webhook Spec</h3>
                                <p class="text-[11px] text-slate-400">Plug-and-play webhook for Mantra, Matrix, eSSL, Hikvision, and ESP32 readers</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                                POST https://api.schoolerp.in/v1/iot/rfid-punch
                            </span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300">
                            <span class="text-amber-400 font-bold block mb-1">// Sample JSON Hardware Payload:</span>
                            <div>{</div>
                            <div class="pl-4">"deviceId": "<span class="text-emerald-400">RFID-CLS-10A</span>",</div>
                            <div class="pl-4">"schoolCode": "<span class="text-emerald-400">${activeSchool.code || 'AHPS-DEL-01'}</span>",</div>
                            <div class="pl-4">"rfidUid": "<span class="text-emerald-400">NFC-98421008</span>",</div>
                            <div class="pl-4">"direction": "<span class="text-emerald-400">IN</span>",</div>
                            <div class="pl-4">"timestamp": "<span class="text-emerald-400">${new Date().toISOString()}</span>"</div>
                            <div>}</div>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                            <span class="text-emerald-400 font-bold block">// Cloud ERP Automated Actions:</span>
                            <div class="flex items-center space-x-2 text-[11px]">
                                <span class="text-emerald-400">✓</span>
                                <span>Authenticates RFID Card UID with Student Roster</span>
                            </div>
                            <div class="flex items-center space-x-2 text-[11px]">
                                <span class="text-emerald-400">✓</span>
                                <span>Marks Daily Assembly Attendance Roll in 80ms</span>
                            </div>
                            <div class="flex items-center space-x-2 text-[11px]">
                                <span class="text-emerald-400">✓</span>
                                <span>Triggers WhatsApp Business Cloud API to Parent</span>
                            </div>
                            <div class="flex items-center space-x-2 text-[11px]">
                                <span class="text-emerald-400">✓</span>
                                <span>Updates Parent Portal Live Campus Status Banner</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    },

    selectRfidStudent(studentId) {
        this.selectedRfidStudentId = studentId;
        window.app.renderCurrentView();
    },

    playBeepSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch crisp 880Hz confirmation beep
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.18);
        } catch(e) {
            console.log("Web Audio API not supported", e);
        }
    },

    handleRfidSimulateTap() {
        const studentSelect = document.getElementById("rfidStudentSelect");
        const deviceSelect = document.getElementById("rfidDeviceSelect");
        const directionSelect = document.getElementById("rfidDirectionSelect");

        const studentId = studentSelect ? studentSelect.value : this.selectedRfidStudentId;
        const deviceVal = deviceSelect ? deviceSelect.value : "RFID-CLS-10A|Smart Classroom 10-A Door Terminal (Room 301)";
        const [deviceId, deviceLocation] = deviceVal.split("|");
        const direction = directionSelect ? directionSelect.value : "IN";

        // 1. Play hardware sound feedback
        this.playBeepSound();

        // 2. Record punch in store
        const res = window.store.recordRfidPunch({
            studentId: studentId,
            deviceId: deviceId,
            deviceLocation: deviceLocation,
            direction: direction
        });

        if (res) {
            this.lastPunchResult = res.logItem;
            window.app.showToast(`📇 RFID Scanned! WhatsApp alert sent to ${res.logItem.parentPhone}`, 'success');
            window.app.renderCurrentView();
        }
    },

    renderInstitutionsView(schools, activeSchool, totalMRR, activeCount, overdueCount, trialCount) {
        return `
            <div class="space-y-6 animate-fade-in">
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
