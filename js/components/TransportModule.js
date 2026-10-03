// GPS School Bus Transport & Live Fleet Management Component

window.TransportModule = {
    activeRouteId: "route-01",

    render() {
        const routes = window.store.getTransportRoutes();
        const activeRoute = routes.find(r => r.id === this.activeRouteId) || routes[0] || {};
        const user = window.store.getCurrentUser();
        const school = window.store.getSchool();

        // If parent is logged in, find their child's specific route
        let parentAssignedRoute = null;
        if (user.role === 'parent' && user.parentData && user.parentData.studentIds) {
            const studentId = user.parentData.studentIds[0];
            parentAssignedRoute = window.store.getStudentTransport(studentId);
        }

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Top Header & Live Fleet Summary Banner -->
                <div class="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-900 text-white shadow-xl relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0">
                                <i data-lucide="bus" class="w-7 h-7 text-amber-300"></i>
                            </div>
                            <div>
                                <div class="flex items-center space-x-2 text-amber-100 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <span class="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">Live GPS Telematics</span>
                                    <span>•</span>
                                    <span>Fleet Safety & Speed Governance</span>
                                </div>
                                <h1 class="text-2xl md:text-3xl font-black tracking-tight text-white">GPS Transport & Fleet Tracker</h1>
                                <p class="text-amber-100 text-xs mt-1 max-w-xl leading-relaxed">
                                    Real-time satellite GPS monitoring for all ${school.name} school buses with stop ETA, CCTV surveillance, speed control, and instant parent route updates.
                                </p>
                            </div>
                        </div>

                        ${user.role === 'admin' || user.role === 'superadmin' ? `
                            <button onclick="window.TransportModule.openAddRouteModal()" class="px-4 py-2.5 bg-white text-slate-900 hover:bg-amber-50 font-bold text-xs rounded-xl shadow transition flex items-center space-x-2 shrink-0">
                                <i data-lucide="plus-circle" class="w-4 h-4 text-orange-600"></i>
                                <span>+ Add Bus Route</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                ${parentAssignedRoute ? `
                    <!-- Parent Dedicated Ward Bus Safety Card -->
                    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border-2 border-emerald-500/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-center space-x-3.5">
                            <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow">
                                <i data-lucide="shield-check" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase">
                                    Ward's Assigned Transport
                                </span>
                                <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                    ${parentAssignedRoute.routeNo}: ${parentAssignedRoute.name} (${parentAssignedRoute.busNumber})
                                </h3>
                                <p class="text-xs text-slate-500">
                                    Driver: <strong>${parentAssignedRoute.driverName}</strong> (<a href="tel:${parentAssignedRoute.driverPhone}" class="text-indigo-600 font-semibold">${parentAssignedRoute.driverPhone}</a>) • Attendant: <strong>${parentAssignedRoute.attendantName}</strong>
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Live Status</span>
                            <span class="text-xs font-black text-emerald-600">${parentAssignedRoute.tripStatus}</span>
                            <span class="text-[11px] font-bold text-indigo-600 block mt-0.5">ETA: ${parentAssignedRoute.etaToCampus}</span>
                        </div>
                    </div>
                ` : ''}

                <!-- Main GPS Telematics Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Left Column: Bus Routes List -->
                    <div class="space-y-4">
                        <h3 class="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                            <i data-lucide="navigation" class="w-4 h-4 text-indigo-600"></i>
                            <span>Active Bus Routes (${routes.length})</span>
                        </h3>

                        <div class="space-y-3">
                            ${routes.map(r => {
                                const isSelected = r.id === activeRoute.id;
                                return `
                                    <div onclick="window.TransportModule.selectRoute('${r.id}')" class="p-4 rounded-2xl border transition cursor-pointer ${
                                        isSelected 
                                            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20 shadow-md' 
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300'
                                    }">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                                ${r.routeNo}
                                            </span>
                                            <span class="flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
                                                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <span>Live GPS</span>
                                            </span>
                                        </div>
                                        <h4 class="text-xs font-bold text-slate-900 dark:text-white">${r.name}</h4>
                                        <p class="text-[11px] text-slate-500 font-mono mt-0.5">${r.busNumber} • ${r.busModel}</p>

                                        <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                            <span class="text-slate-500 truncate max-w-[150px]"><i data-lucide="user" class="w-3 h-3 inline mr-1 text-slate-400"></i>${r.driverName}</span>
                                            <span class="font-bold text-amber-600">${r.speed}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Right 2 Columns: Live Map Tracker & Stop Timeline -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Live GPS Telematics Card -->
                        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                            <!-- Route Header Row -->
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div>
                                    <div class="flex items-center space-x-2">
                                        <h2 class="text-base font-black text-slate-900 dark:text-white">${activeRoute.routeNo}: ${activeRoute.name}</h2>
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                            ${activeRoute.busNumber}
                                        </span>
                                    </div>
                                    <p class="text-xs text-slate-500 mt-0.5">
                                        Current Waypoint: <strong class="text-indigo-600">${activeRoute.currentLocation}</strong>
                                    </p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="text-right px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <span class="text-[10px] uppercase font-bold text-slate-400 block">ETA to Campus</span>
                                        <span class="text-xs font-black text-emerald-600">${activeRoute.etaToCampus}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Simulated Live GPS Map Screen -->
                            <div class="relative w-full h-56 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden border border-slate-800 p-4 flex flex-col justify-between text-white shadow-inner">
                                <!-- Grid Lines Simulation -->
                                <div class="absolute inset-0 opacity-10" style="background-size: 20px 20px; background-image: linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px);"></div>
                                
                                <!-- Top Bar overlay on map -->
                                <div class="relative z-10 flex items-center justify-between">
                                    <div class="flex items-center space-x-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                                        <span class="font-mono font-bold text-emerald-300">SAT-GPS LOCKED: 28.7041° N, 77.1025° E</span>
                                    </div>
                                    <div class="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-300 flex items-center space-x-1.5">
                                        <i data-lucide="gauge" class="w-3.5 h-3.5"></i>
                                        <span>${activeRoute.speed} (${activeRoute.speedStatus})</span>
                                    </div>
                                </div>

                                <!-- Center Moving Bus Marker -->
                                <div class="relative z-10 flex flex-col items-center justify-center my-auto">
                                    <div class="relative">
                                        <div class="w-14 h-14 rounded-full bg-amber-500/20 animate-ping absolute -inset-1"></div>
                                        <div class="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white font-bold relative z-10">
                                            <i data-lucide="bus" class="w-6 h-6"></i>
                                        </div>
                                    </div>
                                    <div class="mt-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-bold border border-amber-400/40 text-amber-300 shadow">
                                        🚍 ${activeRoute.busNumber} • ${activeRoute.currentLocation}
                                    </div>
                                </div>

                                <!-- Bottom Status Bar -->
                                <div class="relative z-10 flex items-center justify-between text-[11px] text-slate-300">
                                    <span>Driver: <strong>${activeRoute.driverName}</strong> (${activeRoute.driverPhone})</span>
                                    <span>Departure: <strong>${activeRoute.departureTime}</strong> • Expected: <strong>${activeRoute.campusArrivalTime}</strong></span>
                                </div>
                            </div>

                            <!-- Route Stop Progression Timeline -->
                            <div class="space-y-3">
                                <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                                    <i data-lucide="git-commit" class="w-4 h-4 text-indigo-600"></i>
                                    <span>Route Stop Progression & Schedule</span>
                                </h4>

                                <div class="space-y-2">
                                    ${(activeRoute.stops || []).map((st, sIdx) => {
                                        const isCurrent = st.status.includes('Current');
                                        const isPassed = st.status.includes('Passed');
                                        return `
                                            <div class="p-3 rounded-xl border flex items-center justify-between text-xs ${
                                                isCurrent 
                                                    ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-bold' 
                                                    : isPassed 
                                                    ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/10 text-slate-600 dark:text-slate-400' 
                                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                                            }">
                                                <div class="flex items-center space-x-3">
                                                    <span class="w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[10px] ${
                                                        isCurrent ? 'bg-amber-500 text-slate-950' : isPassed ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                                                    }">
                                                        ${sIdx + 1}
                                                    </span>
                                                    <div>
                                                        <span class="font-bold">${st.name}</span>
                                                        <span class="text-[10px] text-slate-400 block">Morning: ${st.morningPickup} • Evening: ${st.eveningDrop}</span>
                                                    </div>
                                                </div>
                                                <span class="text-[11px] font-extrabold ${isCurrent ? 'text-amber-600' : isPassed ? 'text-emerald-600' : 'text-slate-400'}">
                                                    ${st.status}
                                                </span>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Container -->
                <div id="transportModalContainer"></div>
            </div>
        `;
    },

    selectRoute(routeId) {
        this.activeRouteId = routeId;
        window.app.renderCurrentView();
    },

    openAddRouteModal() {
        const container = document.getElementById("transportModalContainer");
        if (!container) return;

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Add New School Bus Route</h3>
                            <p class="text-xs text-amber-100">Assign vehicle, driver contact, and route stops</p>
                        </div>
                        <button onclick="document.getElementById('transportModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="window.TransportModule.handleAddRouteSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Route Number *</label>
                                <input name="routeNo" required placeholder="e.g. Route #12" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bus Reg Number *</label>
                                <input name="busNumber" required placeholder="e.g. DL-1V-C-8812" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Route Description *</label>
                            <input name="name" required placeholder="e.g. Ashok Vihar to Campus via Wazirpur" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Driver Name *</label>
                                <input name="driverName" required placeholder="e.g. Rajesh Yadav" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Driver Phone (+91) *</label>
                                <input name="driverPhone" required placeholder="+91 98110 00000" value="+91 98110 44556" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono">
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('transportModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow">Save Bus Route</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    handleAddRouteSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const fd = new FormData(form);

        const newRoute = {
            routeNo: fd.get("routeNo"),
            busNumber: fd.get("busNumber"),
            busModel: "Tata Starbus 36-Seater",
            name: fd.get("name"),
            driverName: fd.get("driverName"),
            driverPhone: fd.get("driverPhone"),
            attendantName: "Staff Attendant",
            attendantPhone: "+91 98100 11111",
            speed: "35 km/h",
            speedStatus: "Normal Speed",
            tripStatus: "Scheduled",
            currentLocation: "Campus Depot",
            etaToCampus: "20 Mins",
            departureTime: "07:10 AM",
            campusArrivalTime: "07:55 AM",
            studentsAssigned: [],
            stops: [
                { id: "st-101", name: "Starting Point Stop 1", morningPickup: "07:10 AM", eveningDrop: "02:40 PM", status: "Scheduled ⏳" },
                { id: "st-102", name: "Midpoint Stop 2", morningPickup: "07:25 AM", eveningDrop: "02:55 PM", status: "Scheduled ⏳" },
                { id: "st-103", name: "School Campus", morningPickup: "07:55 AM", eveningDrop: "02:30 PM", status: "Destination 🏫" }
            ]
        };

        window.store.addTransportRoute(newRoute);
        document.getElementById('transportModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Added ${newRoute.routeNo} to GPS fleet tracker!`, 'success');
    }
};
