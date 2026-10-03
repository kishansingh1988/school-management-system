// System Settings & Database Management Module

window.SettingsModule = {
    render() {
        const school = window.store.getSchool();
        const currentUser = window.store.getCurrentUser();
        const canEdit = currentUser.role === 'admin';

        return `
            <div class="space-y-6 animate-fade-in max-w-4xl">
                <!-- Header -->
                <div>
                    <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Institution Profile & System Settings</h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customize institutional details, academic parameters, and manage local database backups</p>
                </div>

                <!-- School Identity Form -->
                <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div class="flex items-center space-x-3 mb-5">
                        <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                            <i data-lucide="building" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900 dark:text-white text-base">Academy Information</h3>
                            <p class="text-xs text-slate-500">Official information shown on PDF Report Cards and Invoices</p>
                        </div>
                    </div>

                    <form onsubmit="window.SettingsModule.handleSchoolSave(event)" class="space-y-4 text-xs">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">School / Academy Name *</label>
                                <input name="name" value="${school.name}" required ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Motto / Tagline</label>
                                <input name="tagline" value="${school.tagline}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Address</label>
                            <input name="address" value="${school.address}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Session Year</label>
                                <input name="academicYear" value="${school.academicYear}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Term</label>
                                <input name="currentTerm" value="${school.currentTerm}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency Symbol</label>
                                <input name="currency" value="${school.currency}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                                <input name="email" value="${school.email}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                <input name="phone" value="${school.phone}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        ${canEdit ? `
                            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition">
                                    Save Institutional Profile
                                </button>
                            </div>
                        ` : ''}
                    </form>
                </div>

                <!-- Database Backup & Data Management -->
                <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div class="flex items-center space-x-3 mb-5">
                        <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                            <i data-lucide="database" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900 dark:text-white text-base">Database Backup & Recovery</h3>
                            <p class="text-xs text-slate-500">Export, import, or reset school records across sessions</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <!-- Export -->
                        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
                            <div>
                                <h4 class="font-bold text-slate-900 dark:text-white">Export Database</h4>
                                <p class="text-slate-500 mt-1 text-[11px]">Download all student records, faculty rosters, exam marks, and fee ledgers as a clean JSON backup file.</p>
                            </div>
                            <button onclick="window.store.exportJSON()" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm">
                                <i data-lucide="download-cloud" class="w-4 h-4"></i>
                                <span>Export JSON Backup</span>
                            </button>
                        </div>

                        <!-- Import -->
                        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
                            <div>
                                <h4 class="font-bold text-slate-900 dark:text-white">Import Database</h4>
                                <p class="text-slate-500 mt-1 text-[11px]">Restore your previously exported JSON backup to reinstate all student data and school state.</p>
                            </div>
                            <div>
                                <input type="file" id="jsonFileInput" accept=".json" class="hidden" onchange="window.SettingsModule.handleJSONImport(event)">
                                <button onclick="document.getElementById('jsonFileInput').click()" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm">
                                    <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                                    <span>Restore from JSON</span>
                                </button>
                            </div>
                        </div>

                        <!-- Reset -->
                        <div class="p-4 rounded-xl border border-rose-200 dark:border-rose-950/40 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col justify-between space-y-3">
                            <div>
                                <h4 class="font-bold text-rose-900 dark:text-rose-300">Reset Demo Data</h4>
                                <p class="text-rose-600 dark:text-rose-400 mt-1 text-[11px]">Revert all student records, exams, attendance, and fees back to the initial sample seed database.</p>
                            </div>
                            <button onclick="window.SettingsModule.confirmReset()" class="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm">
                                <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                                <span>Reset to Defaults</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    handleSchoolSave(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const updated = {
            name: formData.get("name"),
            tagline: formData.get("tagline"),
            address: formData.get("address"),
            academicYear: formData.get("academicYear"),
            currentTerm: formData.get("currentTerm"),
            currency: formData.get("currency"),
            email: formData.get("email"),
            phone: formData.get("phone")
        };

        window.store.updateSchool(updated);
        window.app.showToast("Institutional settings updated", "success");
        window.app.renderCurrentView();
    },

    handleJSONImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const result = window.store.importJSON(event.target.result);
                if (result.success) {
                    window.app.showToast("School database restored successfully!", "success");
                    window.app.renderCurrentView();
                } else {
                    alert("Import failed: " + result.error);
                }
            } catch (err) {
                alert("Invalid JSON file: " + err.message);
            }
        };
        reader.readAsText(file);
    },

    confirmReset() {
        if (confirm("Are you sure you want to reset all records to the original demo dataset? Any custom additions will be reverted.")) {
            window.store.resetToSeedData();
            window.app.showToast("System reset to sample dataset", "info");
            window.app.renderCurrentView();
        }
    }
};
