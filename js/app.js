// Main Application Orchestrator & View Router

(function () {
    class SchoolApp {
        constructor() {
            this.currentRoute = 'dashboard';
            this.isDarkMode = localStorage.getItem('APEX_DARK_MODE') === 'true';
            this.isMobileMenuOpen = false;
            this.init();
        }

        init() {
            if (this.isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // Listen to auth & state changes
            window.store.subscribe("auth:change", () => {
                this.currentRoute = 'dashboard';
                this.isMobileMenuOpen = false;
                this.render();
            });

            window.store.subscribe("*", () => {
                // Re-render subviews if needed
            });

            // Initial render
            if (document.readyState === 'loading') {
                window.addEventListener('DOMContentLoaded', () => this.render());
            } else {
                this.render();
            }
        }

        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            localStorage.setItem('APEX_DARK_MODE', this.isDarkMode);
            if (this.isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            this.render();
        }

        toggleMobileMenu(forceState) {
            this.isMobileMenuOpen = (typeof forceState === 'boolean') ? forceState : !this.isMobileMenuOpen;
            const drawer = document.getElementById("mobileDrawer");
            const backdrop = document.getElementById("mobileDrawerBackdrop");
            if (drawer && backdrop) {
                if (this.isMobileMenuOpen) {
                    drawer.classList.remove('-translate-x-full');
                    drawer.classList.add('translate-x-0');
                    backdrop.classList.remove('hidden');
                    backdrop.classList.add('block');
                } else {
                    drawer.classList.remove('translate-x-0');
                    drawer.classList.add('-translate-x-full');
                    backdrop.classList.remove('block');
                    backdrop.classList.add('hidden');
                }
            }
        }

        closeMobileMenu() {
            this.toggleMobileMenu(false);
        }

        navigate(route) {
            this.currentRoute = route;
            this.closeMobileMenu();
            this.renderCurrentView();
            this.updateActiveNavStates();
            // Scroll main container to top
            const mainContainer = document.getElementById("mainContentArea");
            if (mainContainer) mainContainer.scrollTop = 0;
        }

        updateActiveNavStates() {
            // Update desktop & mobile drawer nav buttons
            document.querySelectorAll('.nav-item-btn').forEach(btn => {
                const route = btn.getAttribute('data-route');
                if (route === this.currentRoute) {
                    btn.className = 'nav-item-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition bg-indigo-600 text-white shadow-md shadow-indigo-600/20';
                } else {
                    btn.className = 'nav-item-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white';
                }
            });

            // Update bottom nav items
            document.querySelectorAll('.bottom-nav-item').forEach(btn => {
                const route = btn.getAttribute('data-route');
                if (!route) return; // 'More' button
                const iconWrap = btn.querySelector('.bottom-icon-wrap');
                if (route === this.currentRoute) {
                    btn.className = 'bottom-nav-item flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition text-indigo-600 dark:text-indigo-400 font-bold';
                    if (iconWrap) iconWrap.className = 'bottom-icon-wrap relative p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400';
                } else {
                    btn.className = 'bottom-nav-item flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition';
                    if (iconWrap) iconWrap.className = 'bottom-icon-wrap relative p-1 rounded-lg text-slate-500 dark:text-slate-400';
                }
            });
        }

        getNavItems() {
            const user = window.store.getCurrentUser();
            const role = user.role;

            const allNavs = [
                { id: 'saas_master', label: '👑 SaaS Master Suite', icon: 'crown', roles: ['superadmin'] },
                { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', roles: ['superadmin', 'admin', 'accountant', 'teacher', 'student', 'parent'] },
                { id: 'fees', label: 'Fees & Counter Collections', icon: 'receipt', roles: ['superadmin', 'admin', 'accountant', 'parent'] },
                { id: 'payroll', label: 'Staff Payroll & Leaves', icon: 'badge-percent', roles: ['superadmin', 'admin', 'accountant', 'teacher'] },
                { id: 'students', label: 'Student Directory', icon: 'users', roles: ['superadmin', 'admin', 'accountant', 'teacher'] },
                { id: 'teachers', label: 'Faculty Staff', icon: 'graduation-cap', roles: ['superadmin', 'admin'] },
                { id: 'attendance', label: 'Attendance Roll', icon: 'calendar-check', roles: ['superadmin', 'admin', 'teacher'] },
                { id: 'homework', label: 'Daily Diary & Homework', icon: 'book-open-check', roles: ['superadmin', 'admin', 'teacher', 'student', 'parent'] },
                { id: 'transport', label: 'GPS Bus Tracking', icon: 'bus', roles: ['superadmin', 'admin', 'accountant', 'teacher', 'student', 'parent'] },
                { id: 'library', label: 'Library & Lending', icon: 'book-marked', roles: ['superadmin', 'admin', 'teacher', 'student'] },
                { id: 'gradebook', label: 'Exams & Grades', icon: 'file-spreadsheet', roles: ['superadmin', 'admin', 'teacher'] },
                { id: 'timetable', label: 'Class Timetable', icon: 'clock', roles: ['superadmin', 'admin', 'teacher', 'student'] },
                { id: 'notices', label: 'Noticeboard', icon: 'bell', roles: ['superadmin', 'admin', 'accountant', 'teacher', 'student', 'parent'] },
                { id: 'settings', label: 'Settings & Data', icon: 'settings', roles: ['superadmin', 'admin', 'accountant'] }
            ];

            return allNavs.filter(n => {
                if (!n.roles.includes(role)) return false;
                if (role === 'superadmin') return true;
                if (n.id === 'dashboard' || n.id === 'settings') return true;
                return window.store.isFacilityEnabled(n.id);
            });
        }

        getBottomNavItems() {
            const user = window.store.getCurrentUser();
            const role = user.role;

            if (role === 'admin') {
                return [
                    { id: 'dashboard', label: 'Home', icon: 'layout-dashboard' },
                    { id: 'students', label: 'Students', icon: 'users' },
                    { id: 'fees', label: 'Fees', icon: 'receipt' },
                    { id: 'attendance', label: 'Roll', icon: 'calendar-check' }
                ];
            } else if (role === 'teacher') {
                return [
                    { id: 'dashboard', label: 'Home', icon: 'layout-dashboard' },
                    { id: 'attendance', label: 'Roll', icon: 'calendar-check' },
                    { id: 'homework', label: 'Diary', icon: 'book-open-check' },
                    { id: 'students', label: 'Students', icon: 'users' }
                ];
            } else if (role === 'parent') {
                return [
                    { id: 'dashboard', label: 'Home', icon: 'layout-dashboard' },
                    { id: 'homework', label: 'Diary', icon: 'book-open-check' },
                    { id: 'fees', label: 'Fees', icon: 'receipt' },
                    { id: 'transport', label: 'Bus', icon: 'bus' }
                ];
            } else if (role === 'student') {
                return [
                    { id: 'dashboard', label: 'Home', icon: 'layout-dashboard' },
                    { id: 'homework', label: 'Diary', icon: 'book-open-check' },
                    { id: 'timetable', label: 'Routine', icon: 'clock' },
                    { id: 'library', label: 'Library', icon: 'book-marked' }
                ];
            } else if (role === 'accountant') {
                return [
                    { id: 'dashboard', label: 'Home', icon: 'layout-dashboard' },
                    { id: 'fees', label: 'Fees', icon: 'receipt' },
                    { id: 'payroll', label: 'Payroll', icon: 'badge-percent' },
                    { id: 'students', label: 'Students', icon: 'users' }
                ];
            } else { // superadmin
                return [
                    { id: 'saas_master', label: 'Master', icon: 'crown' },
                    { id: 'dashboard', label: 'Overview', icon: 'layout-dashboard' },
                    { id: 'fees', label: 'Fees', icon: 'receipt' },
                    { id: 'settings', label: 'Settings', icon: 'settings' }
                ];
            }
        }

        switchSchool(schoolId) {
            window.store.switchActiveSchool(schoolId);
            this.render();
            this.showToast(`Switched active tenant to: ${window.store.getActiveSchool().name}`, 'info');
        }

        render() {
            const appRoot = document.getElementById("app");
            if (!appRoot) return;

            const user = window.store.getCurrentUser();
            const school = window.store.getSchool();
            const allSchools = window.store.getAllSchools();
            const navItems = this.getNavItems();
            const bottomNavItems = this.getBottomNavItems();

            appRoot.innerHTML = `
                <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                    
                    <!-- Mobile Backdrop Overlay -->
                    <div id="mobileDrawerBackdrop" onclick="window.app.closeMobileMenu()" class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 hidden md:hidden transition-opacity duration-300"></div>

                    <!-- Mobile Slide-Over Drawer Navigation -->
                    <aside id="mobileDrawer" class="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between md:hidden transform -translate-x-full transition-transform duration-300 ease-in-out shadow-2xl">
                        <div class="overflow-y-auto flex-1">
                            <!-- Mobile Drawer Header -->
                            <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div class="flex items-center space-x-3 min-w-0">
                                    <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                                        <i data-lucide="${user.role === 'superadmin' ? 'crown' : 'graduation-cap'}" class="w-5 h-5 text-${user.role === 'superadmin' ? 'amber-300' : 'white'}"></i>
                                    </div>
                                    <div class="min-w-0">
                                        <h1 class="font-bold text-xs text-slate-900 dark:text-white truncate leading-tight">${user.role === 'superadmin' ? 'SaaS Platform Owner' : school.name}</h1>
                                        <span class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block truncate">${user.role === 'superadmin' ? 'Master Authority Suite' : school.city}</span>
                                    </div>
                                </div>
                                <button onclick="window.app.closeMobileMenu()" class="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
                                    <i data-lucide="x" class="w-5 h-5"></i>
                                </button>
                            </div>

                            <!-- Role Switcher Quick Pill inside Drawer -->
                            <div class="p-3 mx-3 mt-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                                <div class="flex items-center space-x-2 min-w-0">
                                    <span class="w-2.5 h-2.5 rounded-full ${
                                        user.role === 'superadmin' ? 'bg-amber-500' :
                                        user.role === 'admin' ? 'bg-indigo-500' :
                                        user.role === 'teacher' ? 'bg-emerald-500' :
                                        user.role === 'student' ? 'bg-sky-500' : 'bg-amber-500'
                                    }"></span>
                                    <div class="min-w-0">
                                        <span class="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Active View</span>
                                        <span class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate capitalize block">${user.role === 'superadmin' ? '👑 SaaS Master' : `${user.role} Portal`}</span>
                                    </div>
                                </div>
                                <button onclick="window.app.closeMobileMenu(); window.AuthModal.open();" class="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold rounded-lg shadow-sm transition border border-slate-200 dark:border-slate-600">
                                    Switch
                                </button>
                            </div>

                            <!-- Mobile Navigation Links -->
                            <nav class="p-3 space-y-1 mt-2">
                                ${navItems.map(item => `
                                    <button onclick="window.app.navigate('${item.id}')" data-route="${item.id}" class="nav-item-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                                        this.currentRoute === item.id 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                    }">
                                        <i data-lucide="${item.icon}" class="w-4 h-4 shrink-0"></i>
                                        <span>${item.label}</span>
                                    </button>
                                `).join('')}
                            </nav>
                        </div>

                        <!-- Mobile Drawer Footer User Profile -->
                        <div class="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
                            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                                <div class="flex items-center space-x-2.5 min-w-0">
                                    <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}" class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0" alt="${user.name}">
                                    <div class="min-w-0">
                                        <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">${user.name.split(' ')[0]}</h4>
                                        <p class="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono truncate font-semibold">${user.phone || '+91 99999 00000'}</p>
                                    </div>
                                </div>
                                <button onclick="window.app.closeMobileMenu(); window.AuthModal.open();" title="Switch Mobile Login" class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg">
                                    <i data-lucide="log-out" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    </aside>

                    <!-- Desktop Left Sidebar (Visible on md: and above) -->
                    <aside class="hidden md:flex md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col justify-between shrink-0 z-30 transition-all">
                        <div class="overflow-y-auto flex-1">
                            <!-- Brand / Logo Header -->
                            <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                                    <i data-lucide="${user.role === 'superadmin' ? 'crown' : 'graduation-cap'}" class="w-6 h-6 text-${user.role === 'superadmin' ? 'amber-300' : 'white'}"></i>
                                </div>
                                <div class="min-w-0">
                                    <h1 class="font-bold text-sm text-slate-900 dark:text-white truncate leading-tight">${user.role === 'superadmin' ? 'SaaS Platform Owner' : school.name}</h1>
                                    <span class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block truncate">${user.role === 'superadmin' ? 'Master Authority Suite' : school.city}</span>
                                </div>
                            </div>

                            <!-- Role Switcher Quick Pill -->
                            <div class="p-3 mx-3 mt-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                                <div class="flex items-center space-x-2 min-w-0">
                                    <span class="w-2.5 h-2.5 rounded-full ${
                                        user.role === 'superadmin' ? 'bg-amber-500' :
                                        user.role === 'admin' ? 'bg-indigo-500' :
                                        user.role === 'teacher' ? 'bg-emerald-500' :
                                        user.role === 'student' ? 'bg-sky-500' : 'bg-amber-500'
                                    }"></span>
                                    <div class="min-w-0">
                                        <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Active View</span>
                                        <span class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate capitalize block">${user.role === 'superadmin' ? '👑 SaaS Master' : `${user.role} Portal`}</span>
                                    </div>
                                </div>
                                <button onclick="window.AuthModal.open()" class="px-2 py-1 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold rounded-lg shadow-sm transition border border-slate-200 dark:border-slate-600">
                                    Switch
                                </button>
                            </div>

                            <!-- Desktop Navigation Links -->
                            <nav class="p-3 space-y-1 mt-2">
                                ${navItems.map(item => `
                                    <button onclick="window.app.navigate('${item.id}')" data-route="${item.id}" class="nav-item-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                                        this.currentRoute === item.id 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                    }">
                                        <i data-lucide="${item.icon}" class="w-4 h-4 shrink-0"></i>
                                        <span>${item.label}</span>
                                    </button>
                                `).join('')}
                            </nav>
                        </div>

                        <!-- User Profile Bottom Bar -->
                        <div class="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
                            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                                <div class="flex items-center space-x-2.5 min-w-0">
                                    <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}" class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0" alt="${user.name}">
                                    <div class="min-w-0">
                                        <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">${user.name.split(' ')[0]}</h4>
                                        <p class="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono truncate font-semibold">${user.phone || '+91 99999 00000'}</p>
                                    </div>
                                </div>
                                <button onclick="window.AuthModal.open()" title="Switch Mobile Login" class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg">
                                    <i data-lucide="log-out" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    </aside>

                    <!-- Main Application Column -->
                    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                        <!-- Top Navigation Bar -->
                        <header class="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between shrink-0 z-20">
                            <div class="flex items-center space-x-2 sm:space-x-3 min-w-0">
                                <!-- Mobile Hamburger Menu Toggle Button -->
                                <button onclick="window.app.toggleMobileMenu()" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition md:hidden shrink-0" title="Open Navigation Menu">
                                    <i data-lucide="menu" class="w-5 h-5"></i>
                                </button>

                                <!-- Multi-Tenant School Switcher / Brand Header -->
                                ${user.role === 'superadmin' ? `
                                    <div class="flex items-center space-x-1 sm:space-x-2 min-w-0">
                                        <span class="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase hidden md:inline-flex items-center space-x-1">
                                            <i data-lucide="crown" class="w-3.5 h-3.5 mr-1 text-amber-500"></i>
                                            <span>Active Demo School:</span>
                                        </span>
                                        <select onchange="window.app.switchSchool(this.value)" class="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[220px] md:max-w-none truncate shadow-sm">
                                            ${allSchools.map(s => `<option value="${s.id}" ${s.id === school.id ? 'selected' : ''}>🏢 ${s.name} (${s.city})</option>`).join('')}
                                        </select>
                                    </div>
                                    <span class="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 hidden lg:inline-flex border border-amber-300/40">
                                        👑 SaaS Master Control
                                    </span>
                                ` : `
                                    <div class="flex items-center space-x-2 min-w-0">
                                        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                            <i data-lucide="graduation-cap" class="w-4 h-4 text-white"></i>
                                        </div>
                                        <div class="min-w-0">
                                            <h2 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-xs md:max-w-md">${school.name}</h2>
                                            <span class="text-[10px] text-slate-400 font-semibold truncate hidden sm:block">${school.city} • Affiliation: ${school.affiliation || 'CBSE'}</span>
                                        </div>
                                    </div>
                                    <span class="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hidden lg:inline-flex border border-indigo-200 dark:border-indigo-800">
                                        ${school.currentTerm || 'Term 1'} • Plan: ${(school.subscription ? school.subscription.plan : 'CBSE Pro')}
                                    </span>
                                `}
                            </div>

                            <!-- Right Controls -->
                            <div class="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
                                <!-- Dark Mode Toggle -->
                                <button onclick="window.app.toggleDarkMode()" title="Toggle Theme" class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                    <i data-lucide="${this.isDarkMode ? 'sun' : 'moon'}" class="w-4 h-4"></i>
                                </button>

                                <!-- Notifications Shortcut with Live Unread Counter -->
                                <button onclick="window.app.openNotificationModal()" title="Live Alerts & Notifications" class="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                    <i data-lucide="bell" class="w-4 h-4"></i>
                                    ${(window.store.getNotifications(user.id, user.role) || []).filter(n => !n.read).length > 0 ? `
                                        <span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                                            ${(window.store.getNotifications(user.id, user.role) || []).filter(n => !n.read).length}
                                        </span>
                                    ` : `
                                        <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                                    `}
                                </button>

                                <!-- PWA Install App Button (Hidden on small mobile headers) -->
                                <button onclick="window.installPwaApp()" title="Install App to Mobile Home Screen" class="hidden sm:flex px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs shadow transition items-center space-x-1.5 border border-white/20">
                                    <i data-lucide="smartphone" class="w-3.5 h-3.5"></i>
                                    <span>Install App</span>
                                </button>

                                <!-- Quick Switch Role Button -->
                                <button onclick="window.AuthModal.open()" class="px-2 sm:px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition flex items-center space-x-1.5 shrink-0">
                                    <i data-lucide="${user.role === 'superadmin' ? 'crown' : 'users'}" class="w-3.5 h-3.5 text-${user.role === 'superadmin' ? 'amber-500' : 'indigo-600'}"></i>
                                    <span class="hidden md:inline">Role:</span>
                                    <span class="hidden sm:inline capitalize font-bold">${user.role === 'superadmin' ? 'SaaS Master' : user.role}</span>
                                    <span class="sm:hidden text-[10px] font-extrabold capitalize bg-indigo-600 text-white px-1.5 py-0.5 rounded">${user.role === 'superadmin' ? 'SaaS' : user.role.substring(0,3)}</span>
                                </button>
                            </div>
                        </header>

                        <!-- Main Content View Area -->
                        <main id="mainContentArea" class="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 pb-24 md:pb-8">
                            <div id="routeContainer"></div>
                        </main>
                    </div>
                </div>

                <!-- Mobile Bottom Navigation Bar (Visible only on mobile screens < md) -->
                <nav class="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-1.5 px-1 shadow-lg safe-bottom">
                    ${bottomNavItems.map(item => `
                        <button onclick="window.app.navigate('${item.id}')" data-route="${item.id}" class="bottom-nav-item flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition ${
                            this.currentRoute === item.id 
                                ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                        }">
                            <div class="bottom-icon-wrap relative p-1 rounded-lg ${this.currentRoute === item.id ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' : ''}">
                                <i data-lucide="${item.icon}" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                            </div>
                            <span class="text-[10px] leading-tight tracking-tight mt-0.5 truncate max-w-[64px] text-center">${item.label}</span>
                        </button>
                    `).join('')}
                    <button onclick="window.app.toggleMobileMenu()" class="bottom-nav-item flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition">
                        <div class="bottom-icon-wrap relative p-1 rounded-lg">
                            <i data-lucide="menu" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                        </div>
                        <span class="text-[10px] leading-tight tracking-tight mt-0.5">More</span>
                    </button>
                </nav>

                <!-- Toast Notifications Container -->
                <div id="toastContainer" class="fixed bottom-20 md:bottom-5 right-4 sm:right-5 z-50 space-y-2 pointer-events-none"></div>

                <!-- Global Auth Modal Container -->
                <div id="globalAuthModal">
                    ${window.AuthModal.render()}
                </div>
            `;

            this.renderCurrentView();
        }

        renderCurrentView() {
            const container = document.getElementById("routeContainer");
            if (!container) return;

            const user = window.store.getCurrentUser();
            const activeSchool = window.store.getActiveSchool();
            const sub = activeSchool.subscription || {};

            // Check if facility is disabled or school suspended for non-superadmins
            if (user.role !== 'superadmin' && this.currentRoute !== 'dashboard' && this.currentRoute !== 'settings') {
                if (!window.store.isFacilityEnabled(this.currentRoute)) {
                    container.innerHTML = `
                        <div class="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto my-6 sm:my-12 animate-scale-in">
                            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="lock" class="w-7 h-7 sm:w-8 sm:h-8"></i>
                            </div>
                            <span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase ${sub.paymentStatus === 'Suspended' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'} mb-2 inline-block">
                                ${sub.paymentStatus === 'Suspended' ? 'Account Suspended (Dues Pending)' : 'Facility Paused by SaaS Provider'}
                            </span>
                            <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">This Facility is Currently Inactive</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                Access to this module (<strong>${this.currentRoute.toUpperCase()}</strong>) for <strong>${activeSchool.name}</strong> has been paused by the Software Administrator as per contract package terms or pending software renewal.
                            </p>
                            <div class="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1.5">
                                <div class="flex justify-between"><strong class="text-slate-600 dark:text-slate-400">Current Plan:</strong> <span class="font-semibold text-slate-900 dark:text-white">${sub.plan || 'Standard'}</span></div>
                                <div class="flex justify-between"><strong class="text-slate-600 dark:text-slate-400">Monthly Software Fee:</strong> <span class="font-semibold text-slate-900 dark:text-white">${window.AppFormatters.formatCurrency(sub.monthlyFee || 0, '₹')}</span></div>
                                <div class="flex justify-between"><strong class="text-slate-600 dark:text-slate-400">Billing Status:</strong> <span class="font-bold ${sub.paymentStatus === 'Suspended' ? 'text-rose-600' : 'text-amber-600'}">${sub.paymentStatus || 'Active'}</span></div>
                            </div>
                            <div class="mt-6 flex justify-center space-x-3">
                                <button onclick="window.AuthModal.quickLogin('9999900000')" class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5">
                                    <i data-lucide="crown" class="w-4 h-4"></i>
                                    <span>Log In as SaaS Owner to Resume</span>
                                </button>
                            </div>
                        </div>
                    `;
                    if (window.lucide) window.lucide.createIcons();
                    return;
                }
            }

            if (this.currentRoute === 'saas_master') {
                container.innerHTML = window.SuperAdminModule.render();
            } else if (this.currentRoute === 'dashboard') {
                if (user.role === 'superadmin') {
                    container.innerHTML = window.SuperAdminModule.render();
                } else if (user.role === 'admin') {
                    container.innerHTML = window.AdminDashboard.render();
                    window.AdminDashboard.initCharts();
                } else if (user.role === 'accountant') {
                    container.innerHTML = window.FeeModule.render();
                } else if (user.role === 'teacher') {
                    container.innerHTML = window.TeacherDashboard.render();
                } else if (user.role === 'student') {
                    container.innerHTML = window.StudentDashboard.render();
                } else if (user.role === 'parent') {
                    container.innerHTML = window.ParentDashboard.render();
                }
            } else if (this.currentRoute === 'students') {
                container.innerHTML = window.StudentDirectory.render();
            } else if (this.currentRoute === 'teachers') {
                container.innerHTML = window.TeacherDirectory.render();
            } else if (this.currentRoute === 'attendance') {
                container.innerHTML = window.AttendanceModule.render();
            } else if (this.currentRoute === 'homework') {
                container.innerHTML = window.HomeworkModule.render();
            } else if (this.currentRoute === 'transport') {
                container.innerHTML = window.TransportModule.render();
            } else if (this.currentRoute === 'library') {
                container.innerHTML = window.LibraryModule.render();
            } else if (this.currentRoute === 'payroll') {
                container.innerHTML = window.PayrollLeavesModule.render();
            } else if (this.currentRoute === 'gradebook') {
                container.innerHTML = window.GradebookModule.render();
            } else if (this.currentRoute === 'timetable') {
                container.innerHTML = window.TimetableModule.render();
            } else if (this.currentRoute === 'fees') {
                container.innerHTML = window.FeeModule.render();
            } else if (this.currentRoute === 'notices') {
                container.innerHTML = window.NoticeModule.render();
            } else if (this.currentRoute === 'settings') {
                container.innerHTML = window.SettingsModule.render();
            }

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }

        showToast(message, type = 'info') {
            const toastContainer = document.getElementById("toastContainer");
            if (!toastContainer) return;

            const toast = document.createElement("div");
            toast.className = `px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white pointer-events-auto flex items-center space-x-2 transform transition-all duration-300 translate-y-2 opacity-0 ${
                type === 'success' ? 'bg-emerald-600' :
                type === 'error' ? 'bg-rose-600' :
                type === 'warning' ? 'bg-amber-600' : 'bg-indigo-600'
            }`;

            const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info';
            toast.innerHTML = `
                <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
                <span>${message}</span>
            `;

            toastContainer.appendChild(toast);
            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                toast.classList.remove('translate-y-2', 'opacity-0');
            }, 10);

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 3200);
        }

        openNotificationModal() {
            let container = document.getElementById("globalNotificationModal");
            if (!container) {
                container = document.createElement("div");
                container.id = "globalNotificationModal";
                document.body.appendChild(container);
            }

            const user = window.store.getCurrentUser();
            const notifs = window.store.getNotifications(user.id, user.role);

            container.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-4 md:p-6 bg-slate-900/40 backdrop-blur-xs animate-fade-in" onclick="if(event.target === this) document.getElementById('globalNotificationModal').innerHTML = '';">
                    <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-12 sm:mt-14 mr-0 sm:mr-2 md:mr-6 animate-scale-in flex flex-col max-h-[80vh]">
                        <div class="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <i data-lucide="bell-ring" class="w-5 h-5"></i>
                                <h3 class="font-bold text-sm">Instant Safety & Attendance Alerts</h3>
                            </div>
                            <button onclick="document.getElementById('globalNotificationModal').innerHTML = ''" class="text-white/80 hover:text-white">
                                <i data-lucide="x" class="w-4 h-4"></i>
                            </button>
                        </div>

                        <div class="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span class="text-slate-500 font-semibold">${notifs.length} Alerts Dispatched</span>
                            <button onclick="window.store.markAllNotificationsRead(); window.app.openNotificationModal(); window.app.render();" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                                Mark All as Read
                            </button>
                        </div>

                        <div class="p-4 overflow-y-auto space-y-3 text-xs flex-1">
                            ${notifs.length > 0 ? notifs.map(n => `
                                <div class="p-3.5 rounded-xl border ${
                                    n.severity === 'urgent' ? 'border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30' :
                                    n.severity === 'warning' ? 'border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30' :
                                    'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40'
                                }">
                                    <div class="flex items-center justify-between mb-1">
                                        <span class="font-bold ${
                                            n.severity === 'urgent' ? 'text-rose-700 dark:text-rose-400' :
                                            n.severity === 'warning' ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                                        }">${n.title}</span>
                                        <span class="text-[10px] text-slate-400 font-medium">${n.time || 'Today'}</span>
                                    </div>
                                    <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${n.message}</p>
                                    <div class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                                        <span>Channel: ${n.channel || 'SMS & WhatsApp'}</span>
                                        <span class="text-emerald-600 font-semibold">${n.deliveryStatus || 'Delivered'}</span>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="text-center py-8 text-slate-400">
                                    <i data-lucide="bell-off" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
                                    <p>No new safety or attendance alerts recorded.</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    window.app = new SchoolApp();
})();
