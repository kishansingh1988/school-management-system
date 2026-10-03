// Utility and Formatter Functions for School Management System

window.AppFormatters = {
    formatCurrency(amount, currency = "₹") {
        if (isNaN(amount) || amount === null || amount === undefined) return `${currency}0.00`;
        return `${currency}${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    formatDate(dateStr) {
        if (!dateStr) return "-";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    },

    formatDateTime(dateStr) {
        if (!dateStr) return "-";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateStr;
        }
    },

    calculateGrade(score, gradingScale) {
        if (!gradingScale || !gradingScale.length) {
            if (score >= 91) return { grade: "A1", gpa: 10.0, remark: "Outstanding" };
            if (score >= 81) return { grade: "A2", gpa: 9.0, remark: "Excellent" };
            if (score >= 71) return { grade: "B1", gpa: 8.0, remark: "Very Good" };
            if (score >= 61) return { grade: "B2", gpa: 7.0, remark: "Good" };
            if (score >= 51) return { grade: "C1", gpa: 6.0, remark: "Fair" };
            if (score >= 41) return { grade: "C2", gpa: 5.0, remark: "Average" };
            if (score >= 33) return { grade: "D", gpa: 4.0, remark: "Marginal / Pass" };
            return { grade: "E", gpa: 0.0, remark: "Needs Improvement" };
        }

        const sortedScale = [...gradingScale].sort((a, b) => b.min - a.min);
        for (const item of sortedScale) {
            if (score >= item.min) {
                return item;
            }
        }
        return sortedScale[sortedScale.length - 1] || { grade: "E", gpa: 0.0, remark: "Needs Improvement" };
    },

    calculateStudentExamSummary(marksObj, subjects, gradingScale) {
        if (!marksObj || Object.keys(marksObj).length === 0) {
            return { totalMarks: 0, maxPossibleMarks: 0, percentage: 0, gpa: 0, grade: "N/A", result: "N/A" };
        }

        let totalMarks = 0;
        let maxPossibleMarks = 0;
        let totalGpa = 0;
        let subjectCount = 0;
        let hasFailedSubject = false;

        subjects.forEach(sub => {
            const mark = marksObj[sub.id];
            if (mark !== undefined && mark !== null) {
                totalMarks += Number(mark);
                maxPossibleMarks += sub.maxMarks || 100;
                subjectCount++;

                const gradeInfo = this.calculateGrade(Number(mark), gradingScale);
                totalGpa += gradeInfo.gpa;
                if (Number(mark) < (sub.passMarks || 33)) {
                    hasFailedSubject = true;
                }
            }
        });

        if (subjectCount === 0) {
            return { totalMarks: 0, maxPossibleMarks: 0, percentage: 0, gpa: 0, grade: "N/A", result: "N/A" };
        }

        const percentage = Math.round((totalMarks / maxPossibleMarks) * 100 * 10) / 10;
        const avgGpa = Math.round((totalGpa / subjectCount) * 10) / 10;
        const overallGrade = this.calculateGrade(percentage, gradingScale);

        return {
            totalMarks,
            maxPossibleMarks,
            percentage,
            gpa: avgGpa,
            grade: overallGrade.grade,
            remark: overallGrade.remark,
            result: hasFailedSubject ? "Essential Repeat" : "PASSED (Promoted)"
        };
    },

    calculateStudentAttendanceStats(studentId, attendanceRecords) {
        let totalDays = 0;
        let presentDays = 0;
        let absentDays = 0;
        let lateDays = 0;
        let excusedDays = 0;

        if (!attendanceRecords) return { totalDays: 0, presentDays: 0, percentage: 100, rate: "100%" };

        Object.keys(attendanceRecords).forEach(date => {
            const dateClasses = attendanceRecords[date];
            Object.keys(dateClasses).forEach(classId => {
                const classRecord = dateClasses[classId];
                if (classRecord && classRecord[studentId]) {
                    totalDays++;
                    const status = classRecord[studentId].status;
                    if (status === "P") presentDays++;
                    else if (status === "A") absentDays++;
                    else if (status === "L") {
                        lateDays++;
                        presentDays += 0.8;
                    }
                    else if (status === "E") excusedDays++;
                }
            });
        });

        const effectiveTotal = totalDays - excusedDays;
        const percentage = effectiveTotal > 0 ? Math.round((presentDays / effectiveTotal) * 100) : 100;

        return {
            totalDays,
            presentDays: Math.floor(presentDays),
            absentDays,
            lateDays,
            excusedDays,
            percentage,
            rate: `${percentage}%`
        };
    },

    getInitials(name) {
        if (!name) return "??";
        return name
            .split(" ")
            .filter(n => n.length > 0)
            .map(n => n[0].toUpperCase())
            .slice(0, 2)
            .join("");
    },

    generateId(prefix = "id") {
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    },

    generateAdmissionNo(existingCount = 10) {
        const year = new Date().getFullYear();
        const num = String(existingCount + 1).padStart(4, '0');
        return `ADM/${year}/${num}`;
    },

    generateInvoiceNo(existingCount = 10) {
        const year = new Date().getFullYear();
        const nextYear = String(year + 1).slice(-2);
        const num = String(existingCount + 1).padStart(4, '0');
        return `AHPS/${year}-${nextYear}/INV-${num}`;
    },

    generateReceiptNo(existingCount = 100) {
        const year = new Date().getFullYear();
        const num = String(existingCount + 1).padStart(5, '0');
        return `REC/${year}/${num}`;
    },

    renderGroupedClassOptions(classes, selectedId) {
        if (!classes || !classes.length) return `<option value="">No classes found</option>`;
        const groups = {};
        classes.forEach(c => {
            if (!groups[c.name]) groups[c.name] = [];
            groups[c.name].push(c);
        });

        return Object.keys(groups).map(gradeName => `
            <optgroup label="${gradeName} (${groups[gradeName].length} Sections)">
                ${groups[gradeName].map(c => `
                    <option value="${c.id}" ${selectedId === c.id ? 'selected' : ''}>
                        ${c.name} - Section ${c.section} (${c.room || 'Main Block'})
                    </option>
                `).join('')}
            </optgroup>
        `).join('');
    }
};
