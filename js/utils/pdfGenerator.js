// jsPDF Report Card and Fee Receipt Generator for Indian School Framework (CBSE / State Board)

window.AppPdfGenerator = {
    // Generate and download student official CBSE / Indian School report card
    generateReportCard(student, exam, classInfo, gradeRecord, subjects, school, gradingScale) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("jsPDF library is still loading. Please try again in a moment.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;

        // 1. Header Banner & School Identity (Indian School / CBSE Format)
        doc.setFillColor(30, 58, 138); // Deep Navy Blue (CBSE Theme)
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(school.name.toUpperCase(), pageWidth / 2, 10, { align: 'center' });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(school.tagline || 'Knowledge Bestows Humility', pageWidth / 2, 15.5, { align: 'center' });
        doc.text(school.affiliation || 'Affiliated to CBSE, New Delhi', pageWidth / 2, 20.5, { align: 'center' });
        doc.text(`${school.address} | Ph: ${school.phone}`, pageWidth / 2, 25.5, { align: 'center' });

        // Document Title Badge
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin, 34, pageWidth - (margin * 2), 9, 1.5, 1.5, 'FD');
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`ANNUAL SCHOLASTIC PROGRESS REPORT - ${exam ? exam.title.toUpperCase() : 'HALF-YEARLY ASSESSMENT'}`, pageWidth / 2, 40, { align: 'center' });

        // 2. Student & Academic Information Box (Indian School Format)
        const startY = 46;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.4);
        doc.roundedRect(margin, startY, pageWidth - (margin * 2), 30, 2, 2, 'D');

        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Student Name:", margin + 4, startY + 6);
        doc.text("Admission / SR No:", margin + 4, startY + 12);
        doc.text("Class & Section:", margin + 4, startY + 18);
        doc.text("Father's Name:", margin + 4, startY + 24);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(student.name, margin + 34, startY + 6);
        doc.text(student.admissionNo, margin + 34, startY + 12);
        doc.text(`${classInfo ? classInfo.name + ' - ' + classInfo.section : 'N/A'} (Roll No: ${student.rollNo})`, margin + 34, startY + 18);
        doc.text(student.parentName || 'Shri Parent', margin + 34, startY + 24);

        const midCol = pageWidth / 2 + 10;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text("Academic Session:", midCol, startY + 6);
        doc.text("Student PEN:", midCol, startY + 12);
        doc.text("Date of Birth:", midCol, startY + 18);
        doc.text("Date of Issue:", midCol, startY + 24);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(school.academicYear, midCol + 32, startY + 6);
        doc.text(student.pen || 'PEN-2025-DL-001', midCol + 32, startY + 12);
        doc.text(window.AppFormatters.formatDate(student.dob), midCol + 32, startY + 18);
        doc.text(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }), midCol + 32, startY + 24);

        // 3. Scholastic Areas Subject-wise Marks Table
        const marksObj = (gradeRecord && gradeRecord.marks) ? gradeRecord.marks : {};
        const tableRows = [];

        let totalMarks = 0;
        let totalMax = 0;
        let totalGpa = 0;
        let count = 0;

        subjects.forEach((sub, idx) => {
            const mark = marksObj[sub.id] !== undefined ? Number(marksObj[sub.id]) : 0;
            const max = sub.maxMarks || 100;
            const pass = sub.passMarks || 33;
            const gradeInfo = window.AppFormatters.calculateGrade(mark, gradingScale);
            const status = mark >= pass ? "PASS" : "FAIL";

            totalMarks += mark;
            totalMax += max;
            totalGpa += gradeInfo.gpa;
            count++;

            tableRows.push([
                String(idx + 1),
                sub.code || `SUB-${idx + 1}`,
                sub.name,
                String(max),
                String(pass),
                String(mark),
                gradeInfo.grade,
                gradeInfo.gpa.toFixed(1),
                status
            ]);
        });

        const percentage = count > 0 ? Math.round((totalMarks / totalMax) * 100 * 10) / 10 : 0;
        const avgGpa = count > 0 ? (totalGpa / count).toFixed(1) : "0.0";
        const overallGrade = window.AppFormatters.calculateGrade(percentage, gradingScale);

        doc.autoTable({
            startY: startY + 34,
            margin: { left: margin, right: margin },
            head: [['S.No', 'Subject Code', 'Scholastic Subjects', 'Max Marks', 'Pass Marks', 'Marks Obtained', 'CBSE Grade', 'Grade Point', 'Result']],
            body: tableRows,
            theme: 'grid',
            headStyles: {
                fillColor: [30, 58, 138],
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold',
                halign: 'center'
            },
            styles: {
                fontSize: 8,
                cellPadding: 2,
                textColor: [30, 41, 59]
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { halign: 'center', cellWidth: 22 },
                2: { cellWidth: 'auto' },
                3: { halign: 'center', cellWidth: 16 },
                4: { halign: 'center', cellWidth: 16 },
                5: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
                6: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
                7: { halign: 'center', cellWidth: 18 },
                8: { halign: 'center', fontStyle: 'bold', cellWidth: 16 }
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            }
        });

        // 4. Performance Summary Box
        const tableEndY = doc.lastAutoTable.finalY + 5;

        doc.setFillColor(238, 242, 255);
        doc.setDrawColor(199, 210, 254);
        doc.roundedRect(margin, tableEndY, pageWidth - (margin * 2), 20, 2, 2, 'FD');

        doc.setFontSize(8);
        doc.setTextColor(67, 56, 202);
        doc.setFont('helvetica', 'bold');
        doc.text("SCHOLASTIC EVALUATION SUMMARY", margin + 4, tableEndY + 5);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);

        const colW = (pageWidth - (margin * 2)) / 5;
        doc.text("Grand Total:", margin + 4, tableEndY + 10);
        doc.text("Overall Percentage:", margin + colW + 4, tableEndY + 10);
        doc.text("Cumulative GPA:", margin + (colW * 2) + 4, tableEndY + 10);
        doc.text("Overall CBSE Grade:", margin + (colW * 3) + 4, tableEndY + 10);
        doc.text("Promotion Status:", margin + (colW * 4) + 4, tableEndY + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${totalMarks} / ${totalMax}`, margin + 4, tableEndY + 16);
        doc.text(`${percentage}%`, margin + colW + 4, tableEndY + 16);
        doc.text(`${avgGpa} / 10.0`, margin + (colW * 2) + 4, tableEndY + 16);

        doc.setTextColor(67, 56, 202);
        doc.text(overallGrade.grade, margin + (colW * 3) + 4, tableEndY + 16);

        doc.setTextColor(percentage >= 33 ? 16 : 220, percentage >= 33 ? 185 : 38, percentage >= 33 ? 129 : 38);
        doc.text(percentage >= 33 ? "PASSED & PROMOTED" : "ESSENTIAL REPEAT", margin + (colW * 4) + 4, tableEndY + 16);

        // 5. Co-Scholastic & Teacher Remarks Box
        const remarksY = tableEndY + 23;
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, remarksY, pageWidth - (margin * 2), 24, 2, 2, 'D');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text("Co-Scholastic Assessment & Teacher's Evaluative Remarks:", margin + 4, remarksY + 5.5);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(71, 85, 105);
        const remarkText = (gradeRecord && gradeRecord.teacherRemarks)
            ? gradeRecord.teacherRemarks
            : "Displays dedicated intellectual effort and active engagement in academic activities.";
        doc.text(`"${remarkText}"`, margin + 4, remarksY + 11.5, { maxWidth: pageWidth - (margin * 2) - 8 });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        const attendanceStr = gradeRecord && gradeRecord.attendancePercentage ? `${gradeRecord.attendancePercentage}%` : "95%";
        const conductStr = gradeRecord && gradeRecord.conduct ? gradeRecord.conduct : "Exemplary (Grade A)";
        doc.text(`General Conduct & Discipline: `, margin + 4, remarksY + 18.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(conductStr, margin + 45, remarksY + 18.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Total Attendance: `, margin + 95, remarksY + 18.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(attendanceStr, margin + 120, remarksY + 18.5);

        // 6. CBSE 8-Point Grading Scale Legend
        const scaleY = remarksY + 27;
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, scaleY, pageWidth - (margin * 2), 10, 'F');
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text("CBSE Grading Scale: A1 (91-100), A2 (81-90), B1 (71-80), B2 (61-70), C1 (51-60), C2 (41-50), D (33-40 Pass), E (32 & Below - Essential Repeat)", pageWidth / 2, scaleY + 6, { align: 'center' });

        // 7. Official Signatures
        const footerY = 250;
        doc.setDrawColor(148, 163, 184);
        doc.setLineWidth(0.3);

        const sigCol1 = margin + 15;
        const sigCol2 = pageWidth / 2;
        const sigCol3 = pageWidth - margin - 35;

        doc.line(sigCol1 - 10, footerY + 16, sigCol1 + 25, footerY + 16);
        doc.line(sigCol2 - 20, footerY + 16, sigCol2 + 20, footerY + 16);
        doc.line(sigCol3 - 25, footerY + 16, sigCol3 + 10, footerY + 16);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text("Class Teacher Signature", sigCol1 + 7.5, footerY + 20, { align: 'center' });
        doc.text("Exam In-Charge Seal", sigCol2, footerY + 20, { align: 'center' });
        doc.text("Principal's Signature & Seal", sigCol3 - 7.5, footerY + 20, { align: 'center' });

        // Footnote
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text(`${school.name} • CBSE Affiliation No: 2130849 • Generated electronically on ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, 282, { align: 'center' });

        // Save PDF
        const safeStudentName = student.name.replace(/[^a-zA-Z0-9]/g, "_");
        const filename = `ReportCard_${safeStudentName}_${exam ? exam.title.replace(/\s+/g, "_") : 'Assessment'}.pdf`;
        doc.save(filename);
    },

    // Generate and download Official Indian School Fee Invoice & Receipt in INR
    generateFeeReceipt(invoice, payment, student, school) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("jsPDF library is still loading. Please try again in a moment.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;

        // Header
        doc.setFillColor(30, 58, 138); // Navy Blue
        doc.rect(0, 0, pageWidth, 28, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text(school.name.toUpperCase(), pageWidth / 2, 10, { align: 'center' });

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text(`OFFICIAL COMPOSITE SCHOOL FEE RECEIPT & TAX INVOICE`, pageWidth / 2, 16, { align: 'center' });
        doc.text(`${school.affiliation || 'CBSE Affiliated'} | ${school.address} | Accounts: ${school.phone}`, pageWidth / 2, 21.5, { align: 'center' });

        // Invoice Header Details Box
        const startY = 34;
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, startY, pageWidth - (margin * 2), 34, 2, 2, 'D');

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Receipt Number:", margin + 4, startY + 6);
        doc.text("Invoice Number:", margin + 4, startY + 12);
        doc.text("Academic Session:", margin + 4, startY + 18);
        doc.text("Fee Term / Quarter:", margin + 4, startY + 24);
        doc.text("Payment Date:", margin + 4, startY + 30);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(payment ? payment.receiptNo : "REC/2025/PENDING", margin + 32, startY + 6);
        doc.text(invoice.invoiceNo, margin + 32, startY + 12);
        doc.text(invoice.academicYear || school.academicYear, margin + 32, startY + 18);
        doc.text(invoice.title, margin + 32, startY + 24);
        doc.text(payment ? window.AppFormatters.formatDate(payment.date) : window.AppFormatters.formatDate(invoice.dueDate), margin + 32, startY + 30);

        const midCol = pageWidth / 2 + 10;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text("Student Name:", midCol, startY + 6);
        doc.text("Admission / SR No:", midCol, startY + 12);
        doc.text("Class / Section:", midCol, startY + 18);
        doc.text("Father's Name:", midCol, startY + 24);
        doc.text("Payment Method:", midCol, startY + 30);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(student ? student.name : invoice.studentName, midCol + 32, startY + 6);
        doc.text(student ? student.admissionNo : "ADM/CURRENT", midCol + 32, startY + 12);
        doc.text(student ? student.classId.toUpperCase().replace('CLS-', 'CLASS ') : "CLASS 10-A", midCol + 32, startY + 18);
        doc.text(student ? (student.parentName || 'Shri Parent') : 'Parent on Record', midCol + 32, startY + 24);
        doc.text(payment ? payment.method : 'Direct Accounts Settlement', midCol + 32, startY + 30);

        // Line Items Table
        const breakdownRows = (invoice.breakdown || []).map((item, idx) => [
            String(idx + 1),
            item.item,
            "Tuition / Academic Services",
            window.AppFormatters.formatCurrency(item.amount, school.currency || "₹")
        ]);

        doc.autoTable({
            startY: startY + 39,
            margin: { left: margin, right: margin },
            head: [['S.No', 'Fee Component Particulars', 'Category', 'Amount (INR ₹)']],
            body: breakdownRows,
            theme: 'grid',
            headStyles: {
                fillColor: [30, 58, 138],
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 8,
                cellPadding: 2.5
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 12 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 50 },
                3: { halign: 'right', fontStyle: 'bold', cellWidth: 38 }
            }
        });

        // Totals Box
        const tableEndY = doc.lastAutoTable.finalY + 6;
        const summaryWidth = 88;
        const summaryX = pageWidth - margin - summaryWidth;

        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(summaryX, tableEndY, summaryWidth, 32, 2, 2, 'D');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text("Total Billed Amount:", summaryX + 4, tableEndY + 7);
        doc.text("Amount Received (INR):", summaryX + 4, tableEndY + 14);
        doc.text("Outstanding Balance:", summaryX + 4, tableEndY + 21);
        doc.text("Payment Status:", summaryX + 4, tableEndY + 28);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(window.AppFormatters.formatCurrency(invoice.totalAmount, school.currency || "₹"), pageWidth - margin - 4, tableEndY + 7, { align: 'right' });

        doc.setTextColor(16, 185, 129);
        doc.text(window.AppFormatters.formatCurrency(invoice.paidAmount, school.currency || "₹"), pageWidth - margin - 4, tableEndY + 14, { align: 'right' });

        doc.setTextColor(invoice.dueAmount > 0 ? 239 : 100, invoice.dueAmount > 0 ? 68 : 116, invoice.dueAmount > 0 ? 68 : 139);
        doc.text(window.AppFormatters.formatCurrency(invoice.dueAmount, school.currency || "₹"), pageWidth - margin - 4, tableEndY + 21, { align: 'right' });

        doc.setTextColor(invoice.status === 'Paid' ? 16 : 245, invoice.status === 'Paid' ? 185 : 158, invoice.status === 'Paid' ? 129 : 11);
        doc.text(invoice.status.toUpperCase(), pageWidth - margin - 4, tableEndY + 28, { align: 'right' });

        // Transaction Details on left
        doc.setDrawColor(241, 245, 249);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, tableEndY, summaryX - margin - 6, 32, 2, 2, 'FD');

        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'bold');
        doc.text("PAYMENT SETTLEMENT INFO", margin + 4, tableEndY + 6);

        doc.setFont('helvetica', 'normal');
        doc.text(`Payment Mode: ${payment ? payment.method : 'Direct Accounts Desk'}`, margin + 4, tableEndY + 13);
        doc.text(`Bank / UPI Ref: ${payment ? payment.transactionId : 'N/A'}`, margin + 4, tableEndY + 19);
        doc.text(`Due Date for Dues: ${window.AppFormatters.formatDate(invoice.dueDate)}`, margin + 4, tableEndY + 25);

        // Signatures
        const footerY = 246;
        doc.setDrawColor(148, 163, 184);
        doc.line(margin + 15, footerY + 18, margin + 65, footerY + 18);
        doc.line(pageWidth - margin - 65, footerY + 18, pageWidth - margin - 15, footerY + 18);

        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Depositor / Guardian Signature", margin + 40, footerY + 22, { align: 'center' });
        doc.text("School Accounts Officer & Cashier Seal", pageWidth - margin - 40, footerY + 22, { align: 'center' });

        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text(`Official Receipt Generated by ${school.name} Accounts System. Valid for Income Tax 80C Education Rebate.`, pageWidth / 2, 282, { align: 'center' });

        // Save PDF
        const filename = `Receipt_${invoice.invoiceNo.replace(/[\/\\]/g, '_')}_${student ? student.name.replace(/\s+/g, '_') : 'Student'}.pdf`;
        doc.save(filename);
    },

    // Generate Official Indian Staff Payslip (Salary Statement with EPF/TDS/HRA Breakdown)
    generateStaffPayslip(staff, salaryRecord, school) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("PDF library is still loading. Please try again.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;

        // 1. School Header Banner
        doc.setFillColor(15, 23, 42); // Slate Navy Theme
        doc.rect(0, 0, pageWidth, 28, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text(school.name.toUpperCase(), pageWidth / 2, 9, { align: 'center' });

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text(school.tagline || 'Knowledge Bestows Humility', pageWidth / 2, 14, { align: 'center' });
        doc.text(school.affiliation || 'Affiliated to CBSE, New Delhi', pageWidth / 2, 18.5, { align: 'center' });
        doc.text(`${school.address} | Ph: ${school.phone}`, pageWidth / 2, 23, { align: 'center' });

        // Document Title
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin, 31, pageWidth - (margin * 2), 8, 1.5, 1.5, 'FD');
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.text(`STAFF MONTHLY SALARY PAYSLIP - ${salaryRecord.monthYear ? salaryRecord.monthYear.toUpperCase() : 'CURRENT MONTH'}`, pageWidth / 2, 36.5, { align: 'center' });

        // 2. Staff Details Box
        const startY = 42;
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, startY, pageWidth - (margin * 2), 32, 2, 2, 'D');

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Staff Employee Name:", margin + 4, startY + 6);
        doc.text("Designation / Role:", margin + 4, startY + 12);
        doc.text("Employee ID:", margin + 4, startY + 18);
        doc.text("Income Tax PAN:", margin + 4, startY + 24);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(salaryRecord.staffName || (staff ? staff.name : 'Faculty'), margin + 42, startY + 6);
        doc.text(salaryRecord.designation || (staff ? staff.designation : 'Teaching Staff'), margin + 42, startY + 12);
        doc.text(salaryRecord.staffId || (staff ? staff.id : 'N/A'), margin + 42, startY + 18);
        doc.text(salaryRecord.pan || 'ABFPS8821K', margin + 42, startY + 24);

        // Right side staff info
        const rightColX = pageWidth / 2 + 10;
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text("Disbursement Month:", rightColX, startY + 6);
        doc.text("Bank Account No:", rightColX, startY + 12);
        doc.text("Bank Name & IFSC:", rightColX, startY + 18);
        doc.text("EPF / UAN No:", rightColX, startY + 24);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(salaryRecord.monthYear || 'August 2025', rightColX + 38, startY + 6);
        doc.text(salaryRecord.bankAccount || '50100491823190', rightColX + 38, startY + 12);
        doc.text(`${salaryRecord.bankName || 'HDFC Bank'} (${salaryRecord.ifsc || 'HDFC0001204'})`, rightColX + 38, startY + 18);
        doc.text(salaryRecord.uan || '100928374821', rightColX + 38, startY + 24);

        // 3. Earnings & Deductions Dual Grid Table
        const tableY = 78;
        const halfWidth = (pageWidth - (margin * 2) - 4) / 2;

        // Earnings Header
        doc.setFillColor(240, 253, 244); // Light Emerald
        doc.setDrawColor(187, 247, 208);
        doc.rect(margin, tableY, halfWidth, 7, 'FD');
        doc.setTextColor(22, 101, 52);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text("EARNINGS & ALLOWANCES", margin + 4, tableY + 5);
        doc.text("AMOUNT (₹)", margin + halfWidth - 4, tableY + 5, { align: 'right' });

        // Deductions Header
        const rightTableX = margin + halfWidth + 4;
        doc.setFillColor(254, 242, 242); // Light Rose
        doc.setDrawColor(254, 202, 202);
        doc.rect(rightTableX, tableY, halfWidth, 7, 'FD');
        doc.setTextColor(153, 27, 27);
        doc.text("DEDUCTIONS & TAXES", rightTableX + 4, tableY + 5);
        doc.text("AMOUNT (₹)", rightTableX + halfWidth - 4, tableY + 5, { align: 'right' });

        // Earnings & Deductions Rows based on Pay Structure
        let earnings = [];
        let deductions = [];

        if (salaryRecord.payType === "fixed") {
            earnings = [
                { item: "Fixed Consolidated Monthly Pay", amount: salaryRecord.fixedSalary || salaryRecord.grossSalary || 0 },
                { item: "Special / Performance Allowance", amount: salaryRecord.specialAllowance || 0 },
                { item: "Conveyance / Travel Allowance", amount: salaryRecord.transportAllowance || 0 }
            ];
            deductions = [
                { item: "Unpaid Leaves / Loss of Pay (LOP)", amount: salaryRecord.lopDeduction || 0 },
                { item: "Advance / Loan Adjustment", amount: salaryRecord.advanceDeduction || 0 },
                { item: "Professional Tax (PT)", amount: salaryRecord.professionalTax || 0 },
                { item: "TDS / Income Tax Withholding", amount: salaryRecord.tdsDeduction || 0 },
                { item: "Other Deductions", amount: salaryRecord.otherDeduction || 0 }
            ];
        } else if (salaryRecord.payType === "daily") {
            const days = salaryRecord.daysWorked || 0;
            const rate = salaryRecord.dailyRate || 0;
            earnings = [
                { item: `Daily Wage Base (${days} Days @ ₹${rate}/day)`, amount: salaryRecord.baseEarned || (days * rate) || 0 },
                { item: "Overtime / Extra Duty Allowance", amount: salaryRecord.overtimeAllowance || 0 },
                { item: "Special Allowance", amount: salaryRecord.specialAllowance || 0 }
            ];
            deductions = [
                { item: "Advance / Cash Adjustment", amount: salaryRecord.advanceDeduction || 0 },
                { item: "Other Institutional Deductions", amount: salaryRecord.otherDeduction || 0 }
            ];
        } else if (salaryRecord.payType === "lecture") {
            const periods = salaryRecord.periodsDelivered || 0;
            const rate = salaryRecord.periodRate || 0;
            earnings = [
                { item: `Lecture Base (${periods} Periods @ ₹${rate}/period)`, amount: salaryRecord.baseEarned || (periods * rate) || 0 },
                { item: "Special Coaching Allowance", amount: salaryRecord.specialAllowance || 0 }
            ];
            deductions = [
                { item: "Advance / TDS Adjustment", amount: salaryRecord.advanceDeduction || salaryRecord.tdsDeduction || 0 },
                { item: "Other Deductions", amount: salaryRecord.otherDeduction || 0 }
            ];
        } else {
            // Formal 7th Pay Commission Scale
            earnings = [
                { item: "Basic Salary Pay", amount: salaryRecord.basicPay || 0 },
                { item: "Dearness Allowance (DA 40%)", amount: salaryRecord.dearnessAllowance || 0 },
                { item: "House Rent Allowance (HRA 25%)", amount: salaryRecord.houseRentAllowance || 0 },
                { item: "Special Academic Allowance", amount: salaryRecord.specialAllowance || 0 },
                { item: "Conveyance / Transport Allowance", amount: salaryRecord.transportAllowance || 0 }
            ];
            deductions = [
                { item: "Employees' Provident Fund (EPF 12%)", amount: salaryRecord.epfDeduction || 0 },
                { item: "Employees' State Insurance (ESIC)", amount: salaryRecord.esicDeduction || 0 },
                { item: "Professional Tax (PT)", amount: salaryRecord.professionalTax || 0 },
                { item: "Income Tax (TDS Deduction)", amount: salaryRecord.tdsDeduction || 0 },
                { item: "Other Institutional Deductions", amount: salaryRecord.otherDeduction || 0 }
            ];
        }

        let currY = tableY + 7;
        const maxRows = Math.max(earnings.length, deductions.length);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        for (let i = 0; i < maxRows; i++) {
            const e = earnings[i];
            const d = deductions[i];
            const rowHeight = 7;

            // Draw row background
            doc.setDrawColor(241, 245, 249);
            if (i % 2 === 1) {
                doc.setFillColor(248, 250, 252);
                doc.rect(margin, currY, halfWidth, rowHeight, 'F');
                doc.rect(rightTableX, currY, halfWidth, rowHeight, 'F');
            }

            // Left Earnings cell
            if (e) {
                doc.setTextColor(51, 65, 85);
                doc.text(e.item, margin + 4, currY + 5);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text(window.AppFormatters.formatCurrency(e.amount, "₹"), margin + halfWidth - 4, currY + 5, { align: 'right' });
                doc.setFont('helvetica', 'normal');
            }

            // Right Deductions cell
            if (d) {
                doc.setTextColor(51, 65, 85);
                doc.text(d.item, rightTableX + 4, currY + 5);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text(window.AppFormatters.formatCurrency(d.amount, "₹"), rightTableX + halfWidth - 4, currY + 5, { align: 'right' });
                doc.setFont('helvetica', 'normal');
            }

            currY += rowHeight;
        }

        // Totals Row
        doc.setDrawColor(203, 213, 225);
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, currY, halfWidth, 8, 'FD');
        doc.rect(rightTableX, currY, halfWidth, 8, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text("GROSS EARNINGS (A):", margin + 4, currY + 5.5);
        doc.setTextColor(22, 101, 52);
        doc.text(window.AppFormatters.formatCurrency(salaryRecord.grossSalary || 0, "₹"), margin + halfWidth - 4, currY + 5.5, { align: 'right' });

        doc.setTextColor(15, 23, 42);
        doc.text("TOTAL DEDUCTIONS (B):", rightTableX + 4, currY + 5.5);
        doc.setTextColor(153, 27, 27);
        doc.text(window.AppFormatters.formatCurrency(salaryRecord.totalDeductions || 0, "₹"), rightTableX + halfWidth - 4, currY + 5.5, { align: 'right' });

        // 4. Net Salary Take-Home Banner Box
        const netY = currY + 12;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(0.6);
        doc.roundedRect(margin, netY, pageWidth - (margin * 2), 20, 2, 2, 'FD');

        doc.setFontSize(9);
        doc.setTextColor(79, 70, 229);
        doc.text("NET SALARY PAYABLE (A - B):", margin + 6, netY + 8);

        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(window.AppFormatters.formatCurrency(salaryRecord.netSalary || 0, "₹"), margin + 6, netY + 15);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Payment Status: ${salaryRecord.status || 'Paid & Disbursed'} (${salaryRecord.paymentMode || 'NEFT/RTGS Transfer'})`, pageWidth - margin - 6, netY + 8, { align: 'right' });
        doc.text(`Disbursed On: ${window.AppFormatters.formatDate(salaryRecord.paymentDate || '2025-08-31')}`, pageWidth - margin - 6, netY + 14, { align: 'right' });

        // Signatures Block
        const footerY = 246;
        doc.setDrawColor(148, 163, 184);
        doc.line(margin + 15, footerY + 16, margin + 65, footerY + 16);
        doc.line(pageWidth - margin - 65, footerY + 16, pageWidth - margin - 15, footerY + 16);

        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Employee / Faculty Signature", margin + 40, footerY + 20, { align: 'center' });
        doc.text("Accounts Officer & Principal Seal", pageWidth - margin - 40, footerY + 20, { align: 'center' });

        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text(`Computer generated official salary statement issued by ${school.name}. Valid for Income Tax return filing.`, pageWidth / 2, 282, { align: 'center' });

        const filename = `Payslip_${(salaryRecord.staffName || 'Staff').replace(/\s+/g, '_')}_${(salaryRecord.monthYear || 'Aug_2025').replace(/\s+/g, '_')}.pdf`;
        doc.save(filename);
    }
};

