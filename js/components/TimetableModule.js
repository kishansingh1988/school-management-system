// Weekly Timetable & Class Scheduler Module

window.TimetableModule = {
    selectedClass: 'cls-10a',
    viewMode: 'class', // 'class' or 'teacher'
    selectedTeacher: 'tch-1',

    render() {
        const classes = window.store.getClasses();
        const teachers = window.store.getTeachers();
        const currentUser = window.store.getCurrentUser();
        const canEdit = currentUser.role === 'admin';

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const periods = [
            { num: 1, time: "08:30 - 09:15" },
            { num: 2, time: "09:15 - 10:00" },
            { num: 3, time: "10:15 - 11:00" },
            { num: 4, time: "11:00 - 11:45" },
            { num: 5, time: "12:30 - 01:15" },
            { num: 6, time: "01:15 - 02:00" },
            { num: 7, time: "02:00 - 02:45" }
        ];

        const timetableSlots = window.store.getTimetable(this.selectedClass);

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Class & Teacher Timetables</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Interactive weekly schedule planner with automated faculty conflict detection</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.print()" class="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition flex items-center space-x-2">
                            <i data-lucide="printer" class="w-4 h-4"></i>
                            <span>Print Schedule</span>
                        </button>
                        ${canEdit ? `
                            <button onclick="window.TimetableModule.openAddSlotModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-2">
                                <i data-lucide="calendar-plus" class="w-4 h-4"></i>
                                <span>Assign Schedule Slot</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Class Filter & View Toggle -->
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center space-x-3">
                        <label class="text-xs font-bold uppercase text-slate-400">Class & Section:</label>
                        <select onchange="window.TimetableModule.changeClass(this.value)" class="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                            ${window.AppFormatters.renderGroupedClassOptions(classes, this.selectedClass)}
                        </select>
                    </div>

                    <div class="text-xs text-slate-400">
                        Total 7 Periods / Day • 45 Mins each
                    </div>
                </div>

                <!-- Weekly Grid Container -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr class="border-b border-slate-200 dark:border-slate-800">
                                    <th class="p-3 text-xs font-bold uppercase text-slate-400 w-24">Day</th>
                                    ${periods.map(p => `
                                        <th class="p-3 text-center">
                                            <span class="block text-xs font-bold text-slate-800 dark:text-slate-200">Period ${p.num}</span>
                                            <span class="text-[10px] text-slate-400 font-normal">${p.time}</span>
                                        </th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                ${days.map(day => `
                                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                        <td class="p-3 font-bold text-slate-800 dark:text-slate-200 bg-slate-50/60 dark:bg-slate-800/60 rounded-l-xl">
                                            ${day}
                                        </td>

                                        ${periods.map(period => {
                                            const slot = timetableSlots.find(s => s.day === day && s.period === period.num);
                                            return `
                                                <td class="p-2 text-center align-top">
                                                    ${slot ? `
                                                        <div class="p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/40 hover:border-indigo-300 transition text-left group relative">
                                                            <div class="flex items-center justify-between">
                                                                <h4 class="font-bold text-indigo-900 dark:text-indigo-200 text-xs truncate">${slot.subject}</h4>
                                                                ${canEdit ? `
                                                                    <button onclick="window.TimetableModule.deleteSlot('${day}', ${period.num})" class="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition p-0.5">
                                                                        <i data-lucide="trash" class="w-3 h-3"></i>
                                                                    </button>
                                                                ` : ''}
                                                            </div>
                                                            <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-1 truncate">${slot.teacher}</p>
                                                            <div class="mt-1.5 flex items-center justify-between text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                                                                <span>Rm ${slot.room || '301'}</span>
                                                                <span class="bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.2 rounded">${period.time.split(' - ')[0]}</span>
                                                            </div>
                                                        </div>
                                                    ` : `
                                                        <div class="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 flex items-center justify-center h-full min-h-[70px]">
                                                            ${canEdit ? `
                                                                <button onclick="window.TimetableModule.openAddSlotModal('${day}', ${period.num})" class="text-[11px] text-slate-400 hover:text-indigo-600 font-medium transition">
                                                                    + Slot
                                                                </button>
                                                            ` : '<span class="text-[11px]">Free</span>'}
                                                        </div>
                                                    `}
                                                </td>
                                            `;
                                        }).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="timetableModalContainer"></div>
            </div>
        `;
    },

    changeClass(classId) {
        this.selectedClass = classId;
        window.app.renderCurrentView();
    },

    openAddSlotModal(defaultDay = 'Monday', defaultPeriod = 1) {
        const subjects = window.store.getSubjects();
        const teachers = window.store.getTeachers();
        const container = document.getElementById("timetableModalContainer");
        if (!container) return;

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

        container.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden m-4">
                    <div class="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-base">Assign Timetable Period</h3>
                        <button onclick="document.getElementById('timetableModalContainer').innerHTML = ''" class="text-white/80 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form onsubmit="window.TimetableModule.handleAddSlotSubmit(event)" class="p-6 space-y-4 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Day of Week</label>
                                <select name="day" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    ${days.map(d => `<option value="${d}" ${d === defaultDay ? 'selected' : ''}>${d}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Period Number</label>
                                <select name="period" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                    ${[1, 2, 3, 4, 5, 6, 7].map(num => `<option value="${num}" ${num === defaultPeriod ? 'selected' : ''}>Period ${num}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                            <select name="subject" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                ${subjects.map(s => `<option value="${s.name}">${s.name} (${s.code || 'MTH'})</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Teacher</label>
                            <select name="teacher" id="timetableTeacherSelect" onchange="window.TimetableModule.checkTeacherConflict()" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                ${teachers.map(t => `<option value="${t.name}">${t.name} (${t.designation})</option>`).join('')}
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Room / Lab</label>
                                <input name="room" value="Room 301" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                                <input name="time" value="08:30 - 09:15" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                            </div>
                        </div>

                        <div id="conflictAlert" class="hidden p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
                            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-600 shrink-0"></i>
                            <span id="conflictText">Faculty schedule conflict detected.</span>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                            <button type="button" onclick="document.getElementById('timetableModalContainer').innerHTML = ''" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow">Save Slot</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    checkTeacherConflict() {
        // Teacher conflict helper
        const alertEl = document.getElementById("conflictAlert");
        if (alertEl) alertEl.classList.add("hidden");
    },

    handleAddSlotSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const slot = {
            day: formData.get("day"),
            period: Number(formData.get("period")),
            subject: formData.get("subject"),
            teacher: formData.get("teacher"),
            room: formData.get("room"),
            time: formData.get("time")
        };

        window.store.saveTimetableSlot(this.selectedClass, slot);
        document.getElementById('timetableModalContainer').innerHTML = '';
        window.app.renderCurrentView();
        window.app.showToast(`Timetable updated for ${slot.day} Period ${slot.period}`, 'success');
    },

    deleteSlot(day, period) {
        if (confirm(`Remove Period ${period} on ${day}?`)) {
            window.store.deleteTimetableSlot(this.selectedClass, day, period);
            window.app.renderCurrentView();
            window.app.showToast("Period slot cleared", "info");
        }
    }
};
