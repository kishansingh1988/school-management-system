// Universal Mobile Number & OTP Authentication Modal (Indian School Ecosystem)

window.AuthModal = {
    step: 'phone', // 'phone' | 'otp'
    enteredPhone: '',
    detectedUser: null,
    generatedOtp: '4400',

    render() {
        const currentUser = window.store.getCurrentUser();
        return `
            <div id="authModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md hidden p-4">
                <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-scale-in">
                    <!-- Modal Header -->
                    <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-6 text-white text-center relative">
                        <button onclick="window.AuthModal.close()" class="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                        <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md shadow-inner">
                            <i data-lucide="smartphone" class="w-7 h-7 text-white"></i>
                        </div>
                        <h2 class="text-xl md:text-2xl font-black tracking-tight">Mobile Number & OTP Login</h2>
                        <p class="text-indigo-100 text-xs mt-1 max-w-sm mx-auto">
                            Login with your registered mobile number to automatically open your dedicated <strong>Admin</strong>, <strong>Teacher</strong>, or <strong>Parent</strong> portal.
                        </p>
                    </div>

                    <!-- Dynamic Form Area -->
                    <div id="authModalBody" class="p-6 space-y-5">
                        ${this.renderBodyContent()}
                    </div>

                    <!-- 1-Click Quick Demo Login Shortcuts -->
                    <div class="px-6 pb-6 pt-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
                        <div class="flex items-center justify-between mb-2.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">⚡ 1-Click Quick Demo Mobile Logins</span>
                            <span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Test Any Portal</span>
                        </div>
                        <!-- Master SaaS Owner Banner Pill -->
                        <div class="mb-2.5">
                            <button onclick="window.AuthModal.quickLogin('9999900000')" class="w-full p-2.5 rounded-xl border-2 border-amber-400/60 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 hover:border-amber-500 hover:from-amber-500/20 text-left transition flex items-center justify-between group">
                                <div class="flex items-center space-x-2.5 min-w-0">
                                    <div class="w-8 h-8 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center shrink-0 shadow font-bold">
                                        <i data-lucide="crown" class="w-4 h-4 text-slate-950"></i>
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center space-x-1.5">
                                            <h4 class="text-xs font-black text-amber-700 dark:text-amber-300 truncate">👑 SaaS Platform Master (Software Owner)</h4>
                                            <span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500 text-slate-950 uppercase">Master Authority</span>
                                        </div>
                                        <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">+91 99999 00000 • Stop/Resume Facilities & Manage All Client Schools</p>
                                    </div>
                                </div>
                                <span class="text-[10px] font-bold text-amber-700 dark:text-amber-400 shrink-0 group-hover:translate-x-0.5 transition">&rarr;</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <!-- Principal / Admin Demo -->
                            <button onclick="window.AuthModal.quickLogin('9810011223')" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-left transition flex items-center space-x-2 group">
                                <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
                                    <i data-lucide="shield" class="w-4 h-4"></i>
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">Principal</h4>
                                    <p class="text-[9px] text-slate-400 font-mono truncate">+91 98100 11223</p>
                                </div>
                            </button>

                            <!-- Accountant / Cashier Demo -->
                            <button onclick="window.AuthModal.quickLogin('9811833445')" class="p-2.5 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/40 dark:bg-teal-950/30 hover:border-teal-500 hover:bg-teal-50 text-left transition flex items-center space-x-2 group">
                                <div class="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <i data-lucide="receipt" class="w-4 h-4"></i>
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-xs font-bold text-teal-950 dark:text-teal-200 truncate">Accountant</h4>
                                    <p class="text-[9px] text-teal-700 dark:text-teal-400 font-mono truncate">+91 98118 33445</p>
                                </div>
                            </button>

                            <!-- Teacher Demo -->
                            <button onclick="window.AuthModal.quickLogin('9811122334')" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-left transition flex items-center space-x-2 group">
                                <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                                    <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">Teacher</h4>
                                    <p class="text-[9px] text-slate-400 font-mono truncate">+91 98111 22334</p>
                                </div>
                            </button>

                            <!-- Parent Demo -->
                            <button onclick="window.AuthModal.quickLogin('9811155443')" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 text-left transition flex items-center space-x-2 group">
                                <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                                    <i data-lucide="users" class="w-4 h-4"></i>
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">Parent</h4>
                                    <p class="text-[9px] text-slate-400 font-mono truncate">+91 98111 55443</p>
                                </div>
                            </button>

                            <!-- Student Demo -->
                            <button onclick="window.AuthModal.quickLogin('9876543210')" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/40 text-left transition flex items-center space-x-2 group">
                                <div class="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center shrink-0">
                                    <i data-lucide="book-open" class="w-4 h-4"></i>
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">Student</h4>
                                    <p class="text-[9px] text-slate-400 font-mono truncate">+91 98765 43210</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderBodyContent() {
        if (this.step === 'otp') {
            return `
                <div class="space-y-4 animate-fade-in text-center">
                    <div class="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-left flex items-start space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            <i data-lucide="${this.detectedUser.role === 'admin' ? 'shield' : (this.detectedUser.role === 'teacher' ? 'graduation-cap' : (this.detectedUser.role === 'parent' ? 'users' : 'book-open'))}" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">${this.detectedUser.roleName}</span>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white">${this.detectedUser.user.name}</h4>
                            <p class="text-xs text-slate-500 font-mono mt-0.5">+91 ${this.enteredPhone}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Enter 4-Digit OTP Code sent to +91 ${this.enteredPhone}
                        </label>
                        <input id="otpInput" type="text" maxlength="4" value="4400" autofocus class="w-48 mx-auto text-center text-2xl font-mono tracking-widest p-3 rounded-2xl border-2 border-indigo-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20">
                        <p class="text-[11px] text-slate-400 mt-1.5">
                            Demo OTP: <strong class="text-indigo-600 font-mono font-bold">4400</strong> (Pre-filled for rapid testing)
                        </p>
                    </div>

                    <div class="pt-2 flex items-center space-x-3">
                        <button onclick="window.AuthModal.step = 'phone'; window.AuthModal.updateBody();" class="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition">
                            Back
                        </button>
                        <button onclick="window.AuthModal.verifyOtp()" class="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2">
                            <i data-lucide="check-circle" class="w-4 h-4"></i>
                            <span>Verify & Enter Portal</span>
                        </button>
                    </div>
                </div>
            `;
        }

        // Phone Step
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Enter Registered Mobile Number *
                    </label>
                    <div class="relative flex items-center">
                        <div class="absolute left-3 flex items-center space-x-1.5 text-slate-500 font-bold text-xs pointer-events-none border-r border-slate-200 dark:border-slate-700 pr-2">
                            <span>🇮🇳</span>
                            <span>+91</span>
                        </div>
                        <input id="mobilePhoneInput" type="tel" maxlength="10" placeholder="e.g. 9811155443" value="${this.enteredPhone}" oninput="window.AuthModal.handlePhoneInput(this.value)" class="w-full pl-20 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold">
                    </div>
                </div>

                <!-- Real-Time Role Detection Pill -->
                <div id="detectedRoleBox">
                    ${this.renderDetectedBox()}
                </div>

                <button onclick="window.AuthModal.proceedToOtp()" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2">
                    <span>Send OTP & Continue</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </div>
        `;
    },

    renderDetectedBox() {
        if (!this.enteredPhone || this.enteredPhone.length < 5) {
            return `
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
                    <i data-lucide="info" class="w-4 h-4 shrink-0 text-slate-400"></i>
                    <span>Type any registered mobile number or click a 1-Click Demo login below.</span>
                </div>
            `;
        }

        const match = window.store.findUserByPhone(this.enteredPhone);
        if (match) {
            this.detectedUser = match;
            return `
                <div class="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center space-x-3 animate-fade-in">
                    <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        <i data-lucide="check" class="w-4 h-4"></i>
                    </div>
                    <div class="min-w-0">
                        <span class="text-[10px] uppercase font-extrabold text-emerald-700 dark:text-emerald-300 block">${match.roleName}</span>
                        <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">${match.user.name} (${match.label})</h4>
                    </div>
                </div>
            `;
        }

        return `
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-700 dark:text-amber-300 flex items-center space-x-2">
                <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 text-amber-600"></i>
                <span>Number not recognized in active roster. Try one of the demo numbers below.</span>
            </div>
        `;
    },

    handlePhoneInput(val) {
        this.enteredPhone = val.replace(/[^0-9]/g, '');
        const box = document.getElementById("detectedRoleBox");
        if (box) {
            box.innerHTML = this.renderDetectedBox();
            if (window.lucide) window.lucide.createIcons();
        }
    },

    proceedToOtp() {
        if (!this.enteredPhone || this.enteredPhone.length < 5) {
            window.app.showToast("Please enter a valid 10-digit mobile number", "error");
            return;
        }

        const match = window.store.findUserByPhone(this.enteredPhone);
        if (!match) {
            window.app.showToast("Mobile number not registered in school database", "error");
            return;
        }

        this.detectedUser = match;
        this.step = 'otp';
        this.updateBody();
        window.app.showToast(`Simulated 4-Digit OTP (4400) sent to +91 ${this.enteredPhone}`, "info");
    },

    verifyOtp() {
        const input = document.getElementById("otpInput");
        const code = input ? input.value : "4400";
        if (code !== "4400" && code.length !== 4) {
            window.app.showToast("Invalid OTP code. Please enter 4400.", "error");
            return;
        }

        if (this.detectedUser) {
            window.store.saveSession(this.detectedUser.user);
            this.close();
            this.step = 'phone';
            this.enteredPhone = '';
            this.detectedUser = null;
            window.app.navigate('dashboard');
            window.app.showToast(`Logged in successfully to ${this.detectedUser ? this.detectedUser.roleName : 'Portal'}!`, 'success');
        }
    },

    quickLogin(phone) {
        this.enteredPhone = phone;
        const match = window.store.findUserByPhone(phone);
        if (match) {
            this.detectedUser = match;
            window.store.saveSession(match.user);
            this.close();
            this.step = 'phone';
            this.enteredPhone = '';
            this.detectedUser = null;
            window.app.navigate('dashboard');
            window.app.showToast(`Switched to ${match.roleName} (${match.user.name})`, 'success');
        }
    },

    updateBody() {
        const body = document.getElementById("authModalBody");
        if (body) {
            body.innerHTML = this.renderBodyContent();
            if (window.lucide) window.lucide.createIcons();
        }
    },

    open() {
        this.step = 'phone';
        this.enteredPhone = '';
        this.detectedUser = null;
        const modal = document.getElementById("authModal");
        if (modal) {
            modal.classList.remove("hidden");
            this.updateBody();
            if (window.lucide) window.lucide.createIcons();
        }
    },

    close() {
        const modal = document.getElementById("authModal");
        if (modal) {
            modal.classList.add("hidden");
        }
    },

    selectRole(role) {
        window.store.switchRole(role);
        this.close();
        window.app.navigate('dashboard');
        window.app.showToast(`Switched to ${role.toUpperCase()} Portal`, 'success');
    }
};
