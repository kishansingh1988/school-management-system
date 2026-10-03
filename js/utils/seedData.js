// Seed Data for Apex Horizon Public School (Indian K-10 Schooling Model: Playgroup to Class 10th)

window.SEED_DATA = {
    activeSchoolId: "sch-01",

    // Multi-Tenant Client Schools Directory (SaaS Managed)
    schools: [
        {
            id: "sch-01",
            name: "Apex Horizon Public School",
            branch: "Rohini Sector 14, New Delhi",
            city: "New Delhi",
            state: "Delhi NCR",
            code: "AHPS-DEL-01",
            tagline: "Vidya Dadati Vinayam (Knowledge Bestows Humility)",
            address: "Sector 14, Institutional Area, Rohini, New Delhi - 110085",
            phone: "+91 11 2789 4400 / +91 98112 34567",
            email: "principal@apexhorizon.edu.in",
            website: "www.apexhorizon.edu.in",
            principal: "Dr. Meenakshi Sundaram, M.Sc., M.Ed., Ph.D.",
            affiliation: "Affiliated to CBSE, New Delhi • Affiliation No. 2130849 • School Code: 71204 • UDISE+: 07010200301",
            academicYear: "2025 - 2026",
            currentTerm: "Term 1 (Half-Yearly / Mid-Term 2025)",
            currency: "₹",
            // SaaS Subscription & Billing Control
            subscription: {
                plan: "CBSE Pro (Enterprise)",
                monthlyFee: 18500,
                billingCycle: "Monthly Auto-Renew",
                paymentStatus: "Paid & Active", // "Paid & Active" | "Payment Overdue" | "Active Trial" | "Suspended"
                lastPaymentDate: "2025-08-01",
                nextDueDate: "2025-09-01",
                licenseKey: "LIC-AHPS-PRO-2025-9982"
            },
            // Per-Facility Stop / Resume Authority Switches
            facilities: {
                attendance: true,
                homework: true,
                smsAlerts: true,
                gradebook: true,
                fees: true,
                timetable: true,
                notices: true,
                students: true,
                teachers: true,
                transport: true,
                library: true,
                payroll: true
            },
            gradingScale: [
                { min: 91, grade: "A1", gpa: 10.0, remark: "Outstanding" },
                { min: 81, grade: "A2", gpa: 9.0, remark: "Excellent" },
                { min: 71, grade: "B1", gpa: 8.0, remark: "Very Good" },
                { min: 61, grade: "B2", gpa: 7.0, remark: "Good" },
                { min: 51, grade: "C1", gpa: 6.0, remark: "Fair / Satisfactory" },
                { min: 41, grade: "C2", gpa: 5.0, remark: "Average" },
                { min: 33, grade: "D", gpa: 4.0, remark: "Marginal / Pass" },
                { min: 0, grade: "E", gpa: 0.0, remark: "Needs Improvement (Essential Repeat)" }
            ]
        },
        {
            id: "sch-02",
            name: "Delhi Public Heritage Academy",
            branch: "Sector 62, Noida",
            city: "Noida",
            state: "Uttar Pradesh",
            code: "DPHA-NOI-02",
            tagline: "Service Before Self",
            address: "Plot 8, Institutional Area, Sector 62, Noida - 201309",
            phone: "+91 120 4567 890 / +91 98110 99887",
            email: "info@dphnoida.edu.in",
            website: "www.dphnoida.edu.in",
            principal: "Shri Rajeshwar Nath Sharma",
            affiliation: "Affiliated to CBSE, New Delhi • Affiliation No. 2130990 • School Code: 81402",
            academicYear: "2025 - 2026",
            currentTerm: "Term 1 (Mid-Term)",
            currency: "₹",
            subscription: {
                plan: "Standard Academic Tier",
                monthlyFee: 12000,
                billingCycle: "Quarterly",
                paymentStatus: "Paid & Active",
                lastPaymentDate: "2025-07-01",
                nextDueDate: "2025-10-01",
                licenseKey: "LIC-DPHA-STD-2025-4421"
            },
            facilities: {
                attendance: true,
                homework: true,
                smsAlerts: true,
                gradebook: true,
                fees: false, // School opted out of online fees (offline payments)
                timetable: true,
                notices: true,
                students: true,
                teachers: true,
                transport: true,
                library: true,
                payroll: true
            },
            gradingScale: [
                { min: 90, grade: "A+", gpa: 10.0, remark: "Outstanding" },
                { min: 80, grade: "A", gpa: 9.0, remark: "Excellent" },
                { min: 70, grade: "B", gpa: 8.0, remark: "Good" },
                { min: 60, grade: "C", gpa: 7.0, remark: "Satisfactory" },
                { min: 33, grade: "D", gpa: 4.0, remark: "Pass" },
                { min: 0, grade: "E", gpa: 0.0, remark: "Fail" }
            ]
        },
        {
            id: "sch-03",
            name: "St. Xavier's International School",
            branch: "Golf Course Road, Gurugram",
            city: "Gurugram",
            state: "Haryana",
            code: "SXIS-GGN-03",
            tagline: "Excellence in Leadership & Character",
            address: "Sector 54, Golf Course Extension, Gurugram - 122002",
            phone: "+91 124 9876 543 / +91 98118 77665",
            email: "contact@stxaviersggn.edu.in",
            website: "www.stxaviersggn.edu.in",
            principal: "Fr. Thomas Anthony, S.J.",
            affiliation: "Affiliated to CISCE / CBSE • School Code: 91024",
            academicYear: "2025 - 2026",
            currentTerm: "Term 1 Review",
            currency: "₹",
            subscription: {
                plan: "Premium Custom Tier",
                monthlyFee: 22000,
                billingCycle: "Monthly",
                paymentStatus: "Payment Overdue", // Payment is overdue
                lastPaymentDate: "2025-07-15",
                nextDueDate: "2025-08-15 (Overdue)",
                licenseKey: "LIC-SXIS-CUST-2025-1109"
            },
            facilities: {
                attendance: true,
                homework: true,
                smsAlerts: false, // SMS Gateway paused by SaaS Owner due to overdue balance
                gradebook: true,
                fees: true,
                timetable: true,
                notices: true,
                students: true,
                teachers: true,
                transport: false, // Transport tracking stopped due to billing
                library: true,
                payroll: true
            },
            gradingScale: [
                { min: 91, grade: "A1", gpa: 10.0, remark: "Outstanding" },
                { min: 81, grade: "A2", gpa: 9.0, remark: "Excellent" },
                { min: 33, grade: "D", gpa: 4.0, remark: "Pass" },
                { min: 0, grade: "E", gpa: 0.0, remark: "Needs Improvement" }
            ]
        },
        {
            id: "sch-04",
            name: "Little Blossoms Pre-School & Kindergarten",
            branch: "Malviya Nagar, Jaipur",
            city: "Jaipur",
            state: "Rajasthan",
            code: "LBPS-JAI-04",
            tagline: "Nurturing Little Minds with Joy & Love",
            address: "C-42, Malviya Nagar Industrial Area, Jaipur - 302017",
            phone: "+91 141 2541 234 / +91 98290 12345",
            email: "director@littleblossoms.edu.in",
            website: "www.littleblossoms.edu.in",
            principal: "Mrs. Gayatri Devi Rathore",
            affiliation: "Early Childhood Association (ECA) Certified • Playgroup to Class 5th",
            academicYear: "2025 - 2026",
            currentTerm: "Term 1 (Foundational Stage)",
            currency: "₹",
            subscription: {
                plan: "Starter Free Trial (30 Days)",
                monthlyFee: 6500,
                billingCycle: "Trial Period",
                paymentStatus: "Active Trial",
                lastPaymentDate: "N/A",
                nextDueDate: "2025-09-30",
                licenseKey: "LIC-LBPS-TRIAL-2025-0041"
            },
            facilities: {
                attendance: true,
                homework: true,
                smsAlerts: true,
                gradebook: false, // Gradebook locked in Starter Trial
                fees: false, // Online fees locked in Starter Trial
                timetable: true,
                notices: true,
                students: true,
                teachers: true,
                transport: true,
                library: false, // Library locked in Starter Trial
                payroll: false // Payroll locked in Starter Trial
            },
            gradingScale: [
                { min: 85, grade: "Star Performer", gpa: 10.0, remark: "Outstanding" },
                { min: 65, grade: "Good Effort", gpa: 8.0, remark: "Good" },
                { min: 0, grade: "Developing", gpa: 5.0, remark: "Developing" }
            ]
        }
    ],

    school: {
        name: "Apex Horizon Public School",
        tagline: "Vidya Dadati Vinayam (Knowledge Bestows Humility)",
        address: "Sector 14, Institutional Area, Rohini, New Delhi - 110085",
        phone: "+91 11 2789 4400 / +91 98112 34567",
        email: "principal@apexhorizon.edu.in",
        website: "www.apexhorizon.edu.in",
        principal: "Dr. Meenakshi Sundaram, M.Sc., M.Ed., Ph.D.",
        affiliation: "Affiliated to CBSE, New Delhi • Affiliation No. 2130849 • School Code: 71204 • UDISE+: 07010200301",
        academicYear: "2025 - 2026",
        currentTerm: "Term 1 (Half-Yearly / Mid-Term 2025)",
        currency: "₹",
        gradingScale: [
            { min: 91, grade: "A1", gpa: 10.0, remark: "Outstanding" },
            { min: 81, grade: "A2", gpa: 9.0, remark: "Excellent" },
            { min: 71, grade: "B1", gpa: 8.0, remark: "Very Good" },
            { min: 61, grade: "B2", gpa: 7.0, remark: "Good" },
            { min: 51, grade: "C1", gpa: 6.0, remark: "Fair / Satisfactory" },
            { min: 41, grade: "C2", gpa: 5.0, remark: "Average" },
            { min: 33, grade: "D", gpa: 4.0, remark: "Marginal / Pass" },
            { min: 0, grade: "E", gpa: 0.0, remark: "Needs Improvement (Essential Repeat)" }
        ]
    },

    // Classes starting from Playgroup through 10th Standard with Multiple Sections (A, B, C, D)
    classes: [
        { id: "cls-play-a", name: "Playgroup", section: "A", stage: "Foundational (Pre-School)", room: "Room K-01 (Kids Wing)", teacherId: "tch-play", studentCount: 18 },
        { id: "cls-play-b", name: "Playgroup", section: "B", stage: "Foundational (Pre-School)", room: "Room K-02 (Kids Wing)", teacherId: "tch-play", studentCount: 16 },
        { id: "cls-nur-a", name: "Nursery", section: "A", stage: "Foundational (Pre-School)", room: "Room K-03", teacherId: "tch-nur", studentCount: 22 },
        { id: "cls-nur-b", name: "Nursery", section: "B", stage: "Foundational (Pre-School)", room: "Room K-04", teacherId: "tch-nur", studentCount: 20 },
        { id: "cls-lkg-a", name: "LKG", section: "A", stage: "Foundational (Kindergarten)", room: "Room K-05", teacherId: "tch-lkg", studentCount: 25 },
        { id: "cls-lkg-b", name: "LKG", section: "B", stage: "Foundational (Kindergarten)", room: "Room K-06", teacherId: "tch-lkg", studentCount: 24 },
        { id: "cls-ukg-a", name: "UKG", section: "A", stage: "Foundational (Kindergarten)", room: "Room K-07", teacherId: "tch-ukg", studentCount: 28 },
        { id: "cls-ukg-b", name: "UKG", section: "B", stage: "Foundational (Kindergarten)", room: "Room K-08", teacherId: "tch-ukg", studentCount: 26 },
        { id: "cls-1a", name: "Class 1", section: "A", stage: "Primary", room: "Room 101", teacherId: "tch-prt1", studentCount: 30 },
        { id: "cls-1b", name: "Class 1", section: "B", stage: "Primary", room: "Room 102", teacherId: "tch-prt1", studentCount: 30 },
        { id: "cls-1c", name: "Class 1", section: "C", stage: "Primary", room: "Room 103", teacherId: "tch-prt2", studentCount: 28 },
        { id: "cls-2a", name: "Class 2", section: "A", stage: "Primary", room: "Room 104", teacherId: "tch-prt2", studentCount: 32 },
        { id: "cls-2b", name: "Class 2", section: "B", stage: "Primary", room: "Room 105", teacherId: "tch-prt2", studentCount: 30 },
        { id: "cls-3a", name: "Class 3", section: "A", stage: "Preparatory", room: "Room 201", teacherId: "tch-prt1", studentCount: 32 },
        { id: "cls-3b", name: "Class 3", section: "B", stage: "Preparatory", room: "Room 202", teacherId: "tch-prt1", studentCount: 31 },
        { id: "cls-4a", name: "Class 4", section: "A", stage: "Preparatory", room: "Room 203", teacherId: "tch-prt2", studentCount: 34 },
        { id: "cls-4b", name: "Class 4", section: "B", stage: "Preparatory", room: "Room 204", teacherId: "tch-prt2", studentCount: 33 },
        { id: "cls-5a", name: "Class 5", section: "A", stage: "Preparatory", room: "Room 205", teacherId: "tch-prt1", studentCount: 35 },
        { id: "cls-5b", name: "Class 5", section: "B", stage: "Preparatory", room: "Room 206", teacherId: "tch-prt1", studentCount: 34 },
        { id: "cls-6a", name: "Class 6", section: "A", stage: "Middle Stage", room: "Room 301", teacherId: "tch-tgt1", studentCount: 36 },
        { id: "cls-6b", name: "Class 6", section: "B", stage: "Middle Stage", room: "Room 302", teacherId: "tch-tgt1", studentCount: 35 },
        { id: "cls-6c", name: "Class 6", section: "C", stage: "Middle Stage", room: "Room 303", teacherId: "tch-tgt1", studentCount: 34 },
        { id: "cls-7a", name: "Class 7", section: "A", stage: "Middle Stage", room: "Room 304", teacherId: "tch-2", studentCount: 35 },
        { id: "cls-7b", name: "Class 7", section: "B", stage: "Middle Stage", room: "Room 305", teacherId: "tch-2", studentCount: 36 },
        { id: "cls-8a", name: "Class 8", section: "A", stage: "Middle Stage", room: "Room 306", teacherId: "tch-2", studentCount: 36 },
        { id: "cls-8b", name: "Class 8", section: "B", stage: "Middle Stage", room: "Room 307", teacherId: "tch-2", studentCount: 35 },
        { id: "cls-9a", name: "Class 9", section: "A", stage: "Secondary Stage", room: "Room 401", teacherId: "tch-3", studentCount: 38 },
        { id: "cls-9b", name: "Class 9", section: "B", stage: "Secondary Stage", room: "Room 402", teacherId: "tch-3", studentCount: 37 },
        { id: "cls-9c", name: "Class 9", section: "C", stage: "Secondary Stage", room: "Room 403", teacherId: "tch-3", studentCount: 36 },
        { id: "cls-10a", name: "Class 10", section: "A", stage: "Secondary (Board Exam)", room: "Room 404 (Senior Block)", teacherId: "tch-1", studentCount: 40 },
        { id: "cls-10b", name: "Class 10", section: "B", stage: "Secondary (Board Exam)", room: "Room 405 (Senior Block)", teacherId: "tch-2", studentCount: 39 },
        { id: "cls-10c", name: "Class 10", section: "C", stage: "Secondary (Board Exam)", room: "Room 406 (Senior Block)", teacherId: "tch-1", studentCount: 38 },
        { id: "cls-10d", name: "Class 10", section: "D", stage: "Secondary (Board Exam)", room: "Room 407 (Senior Block)", teacherId: "tch-2", studentCount: 38 }
    ],

    // Indian School Curriculum Subjects (CBSE / State Board alignment)
    subjects: [
        { id: "sub-eng", name: "English Language & Literature", code: "ENG-184", maxMarks: 100, passMarks: 33 },
        { id: "sub-hin", name: "Hindi Course (Course-A)", code: "HIN-002", maxMarks: 100, passMarks: 33 },
        { id: "sub-math", name: "Mathematics (Standard / Basic)", code: "MTH-041", maxMarks: 100, passMarks: 33 },
        { id: "sub-sci", name: "Science (Physics, Chemistry, Biology)", code: "SCI-086", maxMarks: 100, passMarks: 33 },
        { id: "sub-sst", name: "Social Science (Hist, Geo, Civics, Econ)", code: "SST-087", maxMarks: 100, passMarks: 33 },
        { id: "sub-it", name: "Information Technology & AI", code: "IT-402", maxMarks: 100, passMarks: 33 },
        { id: "sub-sans", name: "Sanskrit / 3rd Language", code: "SKT-122", maxMarks: 100, passMarks: 33 },
        { id: "sub-phe", name: "Health, Yoga & Physical Education", code: "PHE-502", maxMarks: 100, passMarks: 33 }
    ],

    teachers: [
        {
            id: "tch-1",
            employeeId: "EMP-AH-101",
            name: "Sunita Sharma",
            gender: "Female",
            email: "s.sharma@apexhorizon.edu.in",
            phone: "+91 98111 22334",
            qualification: "M.Sc. (Mathematics), B.Ed (Delhi University)",
            designation: "PGT Mathematics & Senior Coordinator (Class 10-A Mentor)",
            assignedClass: "cls-10a",
            subjects: ["Mathematics (Standard / Basic)", "Information Technology & AI"],
            experience: "14 Years",
            joiningDate: "2012-07-15",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "tch-2",
            employeeId: "EMP-AH-102",
            name: "Rajesh Kumar Verma",
            gender: "Male",
            email: "r.verma@apexhorizon.edu.in",
            phone: "+91 98222 33445",
            qualification: "M.A. (English Literature), M.Ed (Jamia Millia Islamia)",
            designation: "TGT English & Head of Languages",
            assignedClass: "cls-10b",
            subjects: ["English Language & Literature", "Social Science (Hist, Geo, Civics, Econ)"],
            experience: "11 Years",
            joiningDate: "2015-04-01",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "tch-3",
            employeeId: "EMP-AH-103",
            name: "Dr. Ananya Mukherjee",
            gender: "Female",
            email: "a.mukherjee@apexhorizon.edu.in",
            phone: "+91 98333 44556",
            qualification: "Ph.D. (Chemistry), M.Sc., B.Ed (BHU Varanasi)",
            designation: "PGT Science & Atal Tinkering Lab (ATL) Head",
            assignedClass: "cls-9a",
            subjects: ["Science (Physics, Chemistry, Biology)"],
            experience: "12 Years",
            joiningDate: "2014-06-10",
            avatar: "https://images.unsplash.com/photo-1580894732484-82a859f518e8?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "tch-play",
            employeeId: "EMP-AH-110",
            name: "Pooja Malhotra",
            gender: "Female",
            email: "p.malhotra@apexhorizon.edu.in",
            phone: "+91 98444 55667",
            qualification: "B.A., NTT (Nursery Teacher Training, Gold Medalist)",
            designation: "Pre-Primary Head & Playgroup Class Teacher",
            assignedClass: "cls-play",
            subjects: ["English Rhymes & Phonics", "Art & Craft", "Early Mathematics"],
            experience: "8 Years",
            joiningDate: "2018-03-20",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "tch-nur",
            employeeId: "EMP-AH-111",
            name: "Kavita Deshmukh",
            gender: "Female",
            email: "k.deshmukh@apexhorizon.edu.in",
            phone: "+91 98555 66778",
            qualification: "B.Sc., NTT, Child Psychology Specialist",
            designation: "Nursery In-charge",
            assignedClass: "cls-nur",
            subjects: ["English Phonics", "Hindi Rhymes", "Activity & Play"],
            experience: "6 Years",
            joiningDate: "2020-01-10",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "tch-lkg",
            employeeId: "EMP-AH-112",
            name: "Meera Nair",
            gender: "Female",
            email: "m.nair@apexhorizon.edu.in",
            phone: "+91 98666 77889",
            qualification: "B.Ed, Early Childhood Educator (IGNOU)",
            designation: "LKG Class Mentor",
            assignedClass: "cls-lkg",
            subjects: ["Basic Numbers", "Environmental Awareness", "Music & Movement"],
            experience: "7 Years",
            joiningDate: "2019-08-01",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "tch-ukg",
            employeeId: "EMP-AH-113",
            name: "Deepa Ranganathan",
            gender: "Female",
            email: "d.ranganathan@apexhorizon.edu.in",
            phone: "+91 98777 88990",
            qualification: "M.A. (Psychology), B.Ed",
            designation: "UKG Class Mentor & Kindergarten Lead",
            assignedClass: "cls-ukg",
            subjects: ["Reading Readiness", "Introductory EVS", "Number Work"],
            experience: "9 Years",
            joiningDate: "2017-06-15",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "tch-prt1",
            employeeId: "EMP-AH-114",
            name: "Neha Aggarwal",
            gender: "Female",
            email: "n.aggarwal@apexhorizon.edu.in",
            phone: "+91 98888 99001",
            qualification: "B.Sc., D.El.Ed, B.Ed (SCERT Delhi)",
            designation: "PRT Senior Educator (Class 1-A)",
            assignedClass: "cls-1a",
            subjects: ["English", "Mathematics", "Environmental Studies (EVS)"],
            experience: "5 Years",
            joiningDate: "2021-04-10",
            avatar: "https://images.unsplash.com/photo-1580894732484-82a859f518e8?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "tch-tgt1",
            employeeId: "EMP-AH-118",
            name: "Vikramaditya Rathore",
            gender: "Male",
            email: "v.rathore@apexhorizon.edu.in",
            phone: "+91 98999 00112",
            qualification: "M.A. (Hindi & Sanskrit), B.Ed",
            designation: "TGT Hindi & Sanskrit Specialist (Class 6-A)",
            assignedClass: "cls-6a",
            subjects: ["Hindi Course (Course-A)", "Sanskrit / 3rd Language"],
            experience: "10 Years",
            joiningDate: "2016-07-01",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
        }
    ],

    students: [
        {
            id: "stu-1",
            admissionNo: "ADM/2015/0101",
            rollNo: "01",
            pen: "PEN-2025-DL-883901",
            name: "Aarav Sharma",
            gender: "Male",
            dob: "2010-04-14",
            classId: "cls-10a",
            bloodGroup: "B+",
            email: "aarav.sharma@student.apexhorizon.edu.in",
            phone: "+91 98111 88990",
            address: "Flat 402, Shivalik Apartments, Sector 14, Rohini, New Delhi - 110085",
            parentId: "par-1",
            parentName: "Ramesh Sharma",
            parentPhone: "+91 98111 55443",
            parentEmail: "ramesh.sharma@tcs.com",
            admissionDate: "2015-04-01",
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "stu-2",
            admissionNo: "ADM/2015/0102",
            rollNo: "02",
            pen: "PEN-2025-DL-883902",
            name: "Ananya Iyer",
            gender: "Female",
            dob: "2010-08-22",
            classId: "cls-10a",
            bloodGroup: "O+",
            email: "ananya.iyer@student.apexhorizon.edu.in",
            phone: "+91 98222 88991",
            address: "B-2/45, Ashok Vihar Phase II, Delhi - 110052",
            parentId: "par-2",
            parentName: "Venkat Iyer",
            parentPhone: "+91 98222 66554",
            parentEmail: "venkat.iyer@sbi.co.in",
            admissionDate: "2015-04-01",
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "stu-3",
            admissionNo: "ADM/2016/0145",
            rollNo: "03",
            pen: "PEN-2025-DL-883903",
            name: "Rohan Verma",
            gender: "Male",
            dob: "2010-11-05",
            classId: "cls-10a",
            bloodGroup: "A+",
            email: "rohan.verma@student.apexhorizon.edu.in",
            phone: "+91 98333 88992",
            address: "C-12, Model Town III, New Delhi - 110009",
            parentId: "par-3",
            parentName: "Sanjay Verma",
            parentPhone: "+91 98333 77665",
            parentEmail: "sanjay.verma@infosys.com",
            admissionDate: "2016-04-01",
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "stu-4",
            admissionNo: "ADM/2015/0104",
            rollNo: "04",
            pen: "PEN-2025-DL-883904",
            name: "Diya Patel",
            gender: "Female",
            dob: "2010-02-18",
            classId: "cls-10a",
            bloodGroup: "AB+",
            email: "diya.patel@student.apexhorizon.edu.in",
            phone: "+91 98444 88993",
            address: "Pocket D-14, Sector 8, Rohini, Delhi - 110085",
            parentId: "par-4",
            parentName: "Hitesh Patel",
            parentPhone: "+91 98444 88776",
            parentEmail: "hitesh.patel@pateltextiles.in",
            admissionDate: "2015-04-01",
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "stu-5",
            admissionNo: "ADM/2017/0210",
            rollNo: "05",
            pen: "PEN-2025-DL-883905",
            name: "Vihaan Deshmukh",
            gender: "Male",
            dob: "2010-06-30",
            classId: "cls-10a",
            bloodGroup: "O-",
            email: "vihaan.deshmukh@student.apexhorizon.edu.in",
            phone: "+91 98555 88994",
            address: "Plot 88, Prashant Vihar, Outer Ring Road, Delhi - 110085",
            parentId: "par-5",
            parentName: "Anand Deshmukh",
            parentPhone: "+91 98555 99887",
            parentEmail: "anand.deshmukh@ongc.co.in",
            admissionDate: "2017-04-01",
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "stu-play1",
            admissionNo: "ADM/2025/0801",
            rollNo: "01",
            pen: "PEN-2025-DL-991001",
            name: "Aadit Malhotra",
            gender: "Male",
            dob: "2023-01-15",
            classId: "cls-play",
            bloodGroup: "B+",
            email: "aadit.malhotra@student.apexhorizon.edu.in",
            phone: "+91 98666 11223",
            address: "House 24, Sector 15, Rohini, Delhi",
            parentId: "par-play1",
            parentName: "Gaurav Malhotra",
            parentPhone: "+91 98666 11223",
            parentEmail: "g.malhotra@delhicorp.in",
            admissionDate: "2025-04-01",
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "stu-play2",
            admissionNo: "ADM/2025/0802",
            rollNo: "02",
            pen: "PEN-2025-DL-991002",
            name: "Myra Kapoor",
            gender: "Female",
            dob: "2023-03-20",
            classId: "cls-play",
            bloodGroup: "O+",
            email: "myra.kapoor@student.apexhorizon.edu.in",
            phone: "+91 98777 22334",
            address: "Tower 2, Flat 601, Unity Heights, Pitampura, Delhi",
            parentId: "par-play2",
            parentName: "Sameer Kapoor",
            parentPhone: "+91 98777 22334",
            parentEmail: "sameer.kapoor@hcl.com",
            admissionDate: "2025-04-01",
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256"
        },
        {
            id: "stu-1a1",
            admissionNo: "ADM/2023/0401",
            rollNo: "01",
            pen: "PEN-2025-DL-887101",
            name: "Ishaan Gupta",
            gender: "Male",
            dob: "2019-05-12",
            classId: "cls-1a",
            bloodGroup: "A+",
            email: "ishaan.gupta@student.apexhorizon.edu.in",
            phone: "+91 98888 33445",
            address: "45-A, Deepali Enclave, Pitampura, Delhi",
            parentId: "par-1a1",
            parentName: "Vivek Gupta",
            parentPhone: "+91 98888 33445",
            parentEmail: "vivek.gupta@airtel.in",
            admissionDate: "2023-04-01",
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
        }
    ],

    parents: [
        {
            id: "par-1",
            name: "Ramesh Sharma",
            email: "ramesh.sharma@tcs.com",
            phone: "+91 98111 55443",
            relation: "Father",
            occupation: "Principal Consultant, Tata Consultancy Services",
            studentIds: ["stu-1"],
            address: "Flat 402, Shivalik Apartments, Sector 14, Rohini, New Delhi - 110085"
        },
        {
            id: "par-2",
            name: "Venkat Iyer",
            email: "venkat.iyer@sbi.co.in",
            phone: "+91 98222 66554",
            relation: "Father",
            occupation: "Assistant General Manager, State Bank of India",
            studentIds: ["stu-2"],
            address: "B-2/45, Ashok Vihar Phase II, Delhi - 110052"
        },
        {
            id: "par-3",
            name: "Sanjay Verma",
            email: "sanjay.verma@infosys.com",
            phone: "+91 98333 77665",
            relation: "Father",
            occupation: "Senior Technical Architect, Infosys Ltd.",
            studentIds: ["stu-3"],
            address: "C-12, Model Town III, New Delhi - 110009"
        }
    ],

    // Attendance records
    attendance: {
        "2025-09-01": {
            "cls-10a": {
                "stu-1": { status: "P", remark: "Present in Morning Assembly" },
                "stu-2": { status: "P", remark: "Present in Morning Assembly" },
                "stu-3": { status: "L", remark: "Late by 10 mins (Traffic at Ring Road)" },
                "stu-4": { status: "P", remark: "Present in Morning Assembly" },
                "stu-5": { status: "A", remark: "Leave application submitted (Fever)" }
            },
            "cls-play": {
                "stu-play1": { status: "P", remark: "Active in Play Activity" },
                "stu-play2": { status: "P", remark: "Active in Play Activity" }
            },
            "cls-1a": {
                "stu-1a1": { status: "P", remark: "On time" }
            }
        },
        "2025-08-31": {
            "cls-10a": {
                "stu-1": { status: "P", remark: "On time" },
                "stu-2": { status: "P", remark: "On time" },
                "stu-3": { status: "P", remark: "On time" },
                "stu-4": { status: "P", remark: "On time" },
                "stu-5": { status: "P", remark: "On time" }
            }
        }
    },

    // CBSE / Indian School Examination Framework
    exams: [
        {
            id: "ex-mid-2025",
            title: "Half-Yearly Examination / Periodic Assessment 2 (2025-26)",
            term: "Term 1 (Mid-Term)",
            session: "2025-2026",
            startDate: "2025-09-15",
            endDate: "2025-09-27",
            status: "Completed",
            classes: ["cls-10a", "cls-10b", "cls-9a", "cls-8a", "cls-7a", "cls-6a", "cls-5a", "cls-4a", "cls-3a", "cls-2a", "cls-1a"]
        },
        {
            id: "ex-pt1-2025",
            title: "Periodic Test 1 (PT-1 Unit Test)",
            term: "Term 1",
            session: "2025-2026",
            startDate: "2025-07-20",
            endDate: "2025-07-28",
            status: "Completed",
            classes: ["cls-10a", "cls-10b", "cls-9a", "cls-8a", "cls-7a", "cls-6a"]
        },
        {
            id: "ex-preboard-2026",
            title: "CBSE Class 10 Pre-Board Examination I (2026)",
            term: "Term 2 (Pre-Board)",
            session: "2025-2026",
            startDate: "2026-01-05",
            endDate: "2026-01-18",
            status: "Upcoming",
            classes: ["cls-10a", "cls-10b"]
        }
    ],

    grades: [
        {
            examId: "ex-mid-2025",
            studentId: "stu-1",
            classId: "cls-10a",
            marks: {
                "sub-eng": 92,
                "sub-hin": 88,
                "sub-math": 96,
                "sub-sci": 94,
                "sub-sst": 90,
                "sub-it": 98,
                "sub-sans": 91,
                "sub-phe": 95
            },
            teacherRemarks: "Exemplary academic dedication. Brilliant analytical mindset in Mathematics and AI.",
            conduct: "Exemplary (Grade A)",
            attendancePercentage: 96
        },
        {
            examId: "ex-mid-2025",
            studentId: "stu-2",
            classId: "cls-10a",
            marks: {
                "sub-eng": 96,
                "sub-hin": 94,
                "sub-math": 91,
                "sub-sci": 95,
                "sub-sst": 97,
                "sub-it": 92,
                "sub-sans": 95,
                "sub-phe": 93
            },
            teacherRemarks: "Outstanding scholastic achievement. Excellent comprehension in Social Science and Languages.",
            conduct: "Outstanding (Grade A)",
            attendancePercentage: 98
        },
        {
            examId: "ex-mid-2025",
            studentId: "stu-3",
            classId: "cls-10a",
            marks: {
                "sub-eng": 82,
                "sub-hin": 78,
                "sub-math": 85,
                "sub-sci": 81,
                "sub-sst": 76,
                "sub-it": 90,
                "sub-sans": 80,
                "sub-phe": 88
            },
            teacherRemarks: "Very good grasp in Information Technology. Advised regular revision in Hindi and Social Science.",
            conduct: "Very Good (Grade A)",
            attendancePercentage: 92
        },
        {
            examId: "ex-mid-2025",
            studentId: "stu-4",
            classId: "cls-10a",
            marks: {
                "sub-eng": 95,
                "sub-hin": 91,
                "sub-math": 89,
                "sub-sci": 92,
                "sub-sst": 96,
                "sub-it": 88,
                "sub-sans": 94,
                "sub-phe": 90
            },
            teacherRemarks: "Gifted writer and insightful orator in English debates. High leadership acumen.",
            conduct: "Exemplary (Grade A)",
            attendancePercentage: 95
        },
        {
            examId: "ex-mid-2025",
            studentId: "stu-5",
            classId: "cls-10a",
            marks: {
                "sub-eng": 74,
                "sub-hin": 70,
                "sub-math": 68,
                "sub-sci": 72,
                "sub-sst": 69,
                "sub-it": 82,
                "sub-sans": 75,
                "sub-phe": 96
            },
            teacherRemarks: "Outstanding school athletic team captain. Needs consistent practice in Science numericals.",
            conduct: "Good (Grade B)",
            attendancePercentage: 89
        }
    ],

    // Indian School Timetable (08:00 AM to 02:00 PM)
    timetable: {
        "cls-10a": [
            { day: "Monday", period: 1, time: "08:00 - 08:45", subject: "Mathematics (Standard / Basic)", teacher: "Sunita Sharma", room: "Room 402" },
            { day: "Monday", period: 2, time: "08:45 - 09:30", subject: "Science (Physics, Chemistry, Biology)", teacher: "Dr. Ananya Mukherjee", room: "Composite Science Lab" },
            { day: "Monday", period: 3, time: "09:45 - 10:30", subject: "English Language & Literature", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Monday", period: 4, time: "10:30 - 11:15", subject: "Social Science (Hist, Geo, Civics, Econ)", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Monday", period: 5, time: "11:45 - 12:30", subject: "Information Technology & AI", teacher: "Sunita Sharma", room: "Computer Lab 1" },
            { day: "Monday", period: 6, time: "12:30 - 01:15", subject: "Hindi Course (Course-A)", teacher: "Vikramaditya Rathore", room: "Room 402" },
            { day: "Monday", period: 7, time: "01:15 - 02:00", subject: "Health, Yoga & Physical Education", teacher: "Pooja Malhotra", room: "School Playground" },

            { day: "Tuesday", period: 1, time: "08:00 - 08:45", subject: "English Language & Literature", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Tuesday", period: 2, time: "08:45 - 09:30", subject: "Mathematics (Standard / Basic)", teacher: "Sunita Sharma", room: "Room 402" },
            { day: "Tuesday", period: 3, time: "09:45 - 10:30", subject: "Science (Physics, Chemistry, Biology)", teacher: "Dr. Ananya Mukherjee", room: "Composite Science Lab" },
            { day: "Tuesday", period: 4, time: "10:30 - 11:15", subject: "Social Science (Hist, Geo, Civics, Econ)", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Tuesday", period: 5, time: "11:45 - 12:30", subject: "Hindi Course (Course-A)", teacher: "Vikramaditya Rathore", room: "Room 402" },
            { day: "Tuesday", period: 6, time: "12:30 - 01:15", subject: "Information Technology & AI", teacher: "Sunita Sharma", room: "Computer Lab 1" },
            { day: "Tuesday", period: 7, time: "01:15 - 02:00", subject: "Library & Self-Study Period", teacher: "Rajesh Kumar Verma", room: "Central Library" },

            { day: "Wednesday", period: 1, time: "08:00 - 08:45", subject: "Mathematics (Standard / Basic)", teacher: "Sunita Sharma", room: "Room 402" },
            { day: "Wednesday", period: 2, time: "08:45 - 09:30", subject: "Science (Physics, Chemistry, Biology)", teacher: "Dr. Ananya Mukherjee", room: "Composite Science Lab" },
            { day: "Wednesday", period: 3, time: "09:45 - 10:30", subject: "English Language & Literature", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Wednesday", period: 4, time: "10:30 - 11:15", subject: "Social Science (Hist, Geo, Civics, Econ)", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Wednesday", period: 5, time: "11:45 - 12:30", subject: "Sanskrit / 3rd Language", teacher: "Vikramaditya Rathore", room: "Room 402" },
            { day: "Wednesday", period: 6, time: "12:30 - 01:15", subject: "Information Technology & AI", teacher: "Sunita Sharma", room: "Computer Lab 1" },
            { day: "Wednesday", period: 7, time: "01:15 - 02:00", subject: "Health, Yoga & Physical Education", teacher: "Pooja Malhotra", room: "Sports Complex" },

            { day: "Thursday", period: 1, time: "08:00 - 08:45", subject: "Science (Physics, Chemistry, Biology)", teacher: "Dr. Ananya Mukherjee", room: "Composite Science Lab" },
            { day: "Thursday", period: 2, time: "08:45 - 09:30", subject: "Mathematics (Standard / Basic)", teacher: "Sunita Sharma", room: "Room 402" },
            { day: "Thursday", period: 3, time: "09:45 - 10:30", subject: "English Language & Literature", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Thursday", period: 4, time: "10:30 - 11:15", subject: "Information Technology & AI", teacher: "Sunita Sharma", room: "Computer Lab 1" },
            { day: "Thursday", period: 5, time: "11:45 - 12:30", subject: "Social Science (Hist, Geo, Civics, Econ)", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Thursday", period: 6, time: "12:30 - 01:15", subject: "Hindi Course (Course-A)", teacher: "Vikramaditya Rathore", room: "Room 402" },
            { day: "Thursday", period: 7, time: "01:15 - 02:00", subject: "Art, Music & Value Education", teacher: "Pooja Malhotra", room: "Auditorium" },

            { day: "Friday", period: 1, time: "08:00 - 08:45", subject: "Mathematics (Standard / Basic)", teacher: "Sunita Sharma", room: "Room 402" },
            { day: "Friday", period: 2, time: "08:45 - 09:30", subject: "Science (Physics, Chemistry, Biology)", teacher: "Dr. Ananya Mukherjee", room: "Composite Science Lab" },
            { day: "Friday", period: 3, time: "09:45 - 10:30", subject: "English Language & Literature", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Friday", period: 4, time: "10:30 - 11:15", subject: "Social Science (Hist, Geo, Civics, Econ)", teacher: "Rajesh Kumar Verma", room: "Room 402" },
            { day: "Friday", period: 5, time: "11:45 - 12:30", subject: "Hindi Course (Course-A)", teacher: "Vikramaditya Rathore", room: "Room 402" },
            { day: "Friday", period: 6, time: "12:30 - 01:15", subject: "Debate, Quiz & ATL Robotics Club", teacher: "Dr. Ananya Mukherjee", room: "ATL Innovation Lab" },
            { day: "Friday", period: 7, time: "01:15 - 02:00", subject: "Health, Yoga & Physical Education", teacher: "Pooja Malhotra", room: "Playground" }
        ]
    },

    // Indian School Fee Structure (Quarterly / Half-Yearly Composite School Fee)
    fees: [
        {
            id: "inv-2025-001",
            invoiceNo: "AHPS/2025-26/Q2/0101",
            studentId: "stu-1",
            studentName: "Aarav Sharma",
            classId: "cls-10a",
            title: "Quarter 2 Tuition, ATL Lab & Composite School Fee",
            academicYear: "2025-2026",
            dueDate: "2025-10-15",
            breakdown: [
                { item: "Tuition Fee (Q2: Jul - Sep 2025)", amount: 28500 },
                { item: "Science & Atal Tinkering Lab (ATL) Fund", amount: 4500 },
                { item: "Computer / Smart Class & Digital Learning Levy", amount: 3500 },
                { item: "Annual Development & Examination Assessment Fee", amount: 3500 },
                { item: "School Bus Transport Fee (Route #14: Sector 14 Rohini)", amount: 6000 }
            ],
            totalAmount: 46000,
            paidAmount: 46000,
            dueAmount: 0,
            status: "Paid",
            paymentHistory: [
                {
                    receiptNo: "REC/2025/88901",
                    date: "2025-08-28",
                    amount: 46000,
                    method: "UPI (GooglePay / PhonePe / BHIM)",
                    transactionId: "UPI/524098114201/AHPS",
                    status: "Completed"
                }
            ]
        },
        {
            id: "inv-2025-002",
            invoiceNo: "AHPS/2025-26/Q2/0102",
            studentId: "stu-2",
            studentName: "Ananya Iyer",
            classId: "cls-10a",
            title: "Quarter 2 Tuition, ATL Lab & Composite School Fee",
            academicYear: "2025-2026",
            dueDate: "2025-10-15",
            breakdown: [
                { item: "Tuition Fee (Q2: Jul - Sep 2025)", amount: 28500 },
                { item: "Science & Atal Tinkering Lab (ATL) Fund", amount: 4500 },
                { item: "Computer / Smart Class & Digital Learning Levy", amount: 3500 },
                { item: "Annual Development & Examination Assessment Fee", amount: 3500 },
                { item: "School Bus Transport Fee (Route #08: Ashok Vihar)", amount: 6000 }
            ],
            totalAmount: 46000,
            paidAmount: 30000,
            dueAmount: 16000,
            status: "Partial",
            paymentHistory: [
                {
                    receiptNo: "REC/2025/88905",
                    date: "2025-08-25",
                    amount: 30000,
                    method: "NEFT / RTGS Bank Transfer",
                    transactionId: "NEFT-SBIN20250825001928",
                    status: "Completed"
                }
            ]
        },
        {
            id: "inv-2025-003",
            invoiceNo: "AHPS/2025-26/Q2/0103",
            studentId: "stu-3",
            studentName: "Rohan Verma",
            classId: "cls-10a",
            title: "Quarter 2 Tuition, ATL Lab & Composite School Fee",
            academicYear: "2025-2026",
            dueDate: "2025-08-31",
            breakdown: [
                { item: "Tuition Fee (Q2: Jul - Sep 2025)", amount: 28500 },
                { item: "Science & Atal Tinkering Lab (ATL) Fund", amount: 4500 },
                { item: "Computer / Smart Class & Digital Learning Levy", amount: 3500 },
                { item: "Annual Development & Examination Assessment Fee", amount: 3500 },
                { item: "School Bus Transport Fee (Route #04: Model Town)", amount: 6000 }
            ],
            totalAmount: 46000,
            paidAmount: 0,
            dueAmount: 46000,
            status: "Overdue",
            paymentHistory: []
        },
        {
            id: "inv-2025-004",
            invoiceNo: "AHPS/2025-26/Q2/0104",
            studentId: "stu-4",
            studentName: "Diya Patel",
            classId: "cls-10a",
            title: "Quarter 2 Tuition, ATL Lab & Composite School Fee",
            academicYear: "2025-2026",
            dueDate: "2025-10-15",
            breakdown: [
                { item: "Tuition Fee (Q2: Jul - Sep 2025)", amount: 28500 },
                { item: "Science & Atal Tinkering Lab (ATL) Fund", amount: 4500 },
                { item: "Computer / Smart Class & Digital Learning Levy", amount: 3500 },
                { item: "Annual Development & Examination Assessment Fee", amount: 3500 },
                { item: "School Bus Transport Fee (Route #12: Sector 8 Rohini)", amount: 6000 }
            ],
            totalAmount: 46000,
            paidAmount: 46000,
            dueAmount: 0,
            status: "Paid",
            paymentHistory: [
                {
                    receiptNo: "REC/2025/88920",
                    date: "2025-08-20",
                    amount: 46000,
                    method: "Debit Card at School Accounts Desk",
                    transactionId: "POS-HDFC-8829104",
                    status: "Completed"
                }
            ]
        },
        {
            id: "inv-2025-005",
            invoiceNo: "AHPS/2025-26/Q2/0105",
            studentId: "stu-5",
            studentName: "Vihaan Deshmukh",
            classId: "cls-10a",
            title: "Quarter 2 Tuition, ATL Lab & Composite School Fee",
            academicYear: "2025-2026",
            dueDate: "2025-10-15",
            breakdown: [
                { item: "Tuition Fee (Q2: Jul - Sep 2025)", amount: 28500 },
                { item: "Science & Atal Tinkering Lab (ATL) Fund", amount: 4500 },
                { item: "Computer / Smart Class & Digital Learning Levy", amount: 3500 },
                { item: "Annual Development & Examination Assessment Fee", amount: 3500 },
                { item: "School Bus Transport Fee (Route #10: Prashant Vihar)", amount: 6000 }
            ],
            totalAmount: 46000,
            paidAmount: 46000,
            dueAmount: 0,
            status: "Paid",
            paymentHistory: [
                {
                    receiptNo: "REC/2025/88935",
                    date: "2025-08-22",
                    amount: 46000,
                    method: "Net Banking (SBI Portal)",
                    transactionId: "SBIN-TXN-449102",
                    status: "Completed"
                }
            ]
        }
    ],

    // Indian School Noticeboard (CBSE, Holidays, PTM, Events)
    notices: [
        {
            id: "not-1",
            title: "CBSE Class 10 Board Examination Registration (LOC 2026)",
            category: "Exam",
            priority: "Urgent",
            targetAudience: "All",
            date: "2025-09-01",
            author: "Examination Branch / Vice Principal",
            content: "All parents of Class 10 students are requested to verify their ward's details (Spellings of Student, Mother and Father's Name, Date of Birth as per Aadhaar & Birth Certificate) for final submission of the CBSE List of Candidates (LOC) for Board Exam 2026. Signed verification forms must be submitted to the class teacher by Friday, September 12th.",
            attachments: ["CBSE_LOC_Verification_Form.pdf", "CBSE_Guidelines_2026.pdf"]
        },
        {
            id: "not-2",
            title: "Parent-Teacher Meeting (PTM) for Term 1 Half-Yearly Review",
            category: "General",
            priority: "High",
            targetAudience: "Parents",
            date: "2025-08-30",
            author: "Principal Dr. Meenakshi Sundaram",
            content: "The Parent-Teacher Meeting (PTM) for all classes from Playgroup to Class 10th will be held on Saturday, September 27th between 8:30 AM and 1:00 PM. Parents will be able to discuss their child's academic progress, attendance, and co-scholastic developments with class and subject teachers.",
            attachments: ["PTM_Schedule_Slot_Booking.pdf"]
        },
        {
            id: "not-3",
            title: "Half-Yearly Examination Datesheet & Syllabus Released (Classes 1 to 10)",
            category: "Academic",
            priority: "High",
            targetAudience: "All",
            date: "2025-08-28",
            author: "Examination Controller",
            content: "The official datesheet for Half-Yearly Assessments commencing from September 15th to September 27th is now uploaded. Blueprints for question papers and chapter-wise weightage as per CBSE norms are accessible on the student portal.",
            attachments: ["HalfYearly_Datesheet_Sept2025.pdf", "Syllabus_Blueprint.pdf"]
        },
        {
            id: "not-4",
            title: "Inter-House Sports Meet & Yoga Championship 2025",
            category: "Sports",
            priority: "Normal",
            targetAudience: "Students",
            date: "2025-08-25",
            author: "Sports & Physical Education Dept",
            content: "Inter-House Athletic Trials (Shivaji House, Tagore House, Ashoka House, Raman House) for 100m, 200m, Relay, Kho-Kho, Badminton, and Yoga asanas will start next Tuesday after school hours. Interested students should register with their House Captains.",
            attachments: ["House_Trials_Schedule.pdf"]
        },
        {
            id: "not-5",
            title: "Diwali & Chhath Puja Festive Vacation Advisory",
            category: "Holiday",
            priority: "Normal",
            targetAudience: "All",
            date: "2025-08-20",
            author: "Administration Office",
            content: "The school will remain closed for Diwali and Chhath Puja break from October 20th to October 26th. Holiday homework projects focusing on eco-friendly celebrations will be shared by respective subject teachers.",
            attachments: []
        }
    ],

    // Daily Digital School Diary & Homework Assignments
    homework: [
        {
            id: "hw-10a-01",
            classId: "cls-10a",
            subjectId: "sub-math",
            subjectName: "Mathematics (Standard / Basic)",
            teacherName: "Sunita Sharma",
            assignedDate: "2025-09-01",
            dueDate: "2025-09-02",
            title: "NCERT Chapter 4: Quadratic Equations - Exercise 4.3 (Q1 to Q6)",
            description: "Complete Exercise 4.3 (Questions 1 to 6) in your Mathematics Homework register. Focus on completing the square method and verifying discriminants (b² - 4ac). Practice example problems 8 & 9 before starting.",
            attachments: ["NCERT_Math_Ex4.3_Notes.pdf"],
            type: "Written Practice",
            parentSignatures: {
                "par-1": { signedAt: "2025-09-01T18:30:00Z", parentName: "Ramesh Sharma", status: "Signed & Verified" }
            },
            studentCompletions: {
                "stu-1": { completedAt: "2025-09-01T17:45:00Z", status: "Done" }
            }
        },
        {
            id: "hw-10a-02",
            classId: "cls-10a",
            subjectId: "sub-sci",
            subjectName: "Science (Physics, Chemistry, Biology)",
            teacherName: "Dr. Ananya Mukherjee",
            assignedDate: "2025-09-01",
            dueDate: "2025-09-03",
            title: "Ray Diagrams of Concave Mirrors & Digestive Enzymes Worksheet",
            description: "1. Draw ray diagrams for object placed (a) at C, (b) between C and F, and (c) between F and P in Practical File.\n2. Fill in the enzyme action chart for salivary amylase, pepsin, and trypsin in Biology notebook.",
            attachments: ["Light_Reflection_RayDiagram_Guide.pdf", "Digestive_System_Worksheet.pdf"],
            type: "Diagram & Worksheet",
            parentSignatures: {
                "par-1": { signedAt: "2025-09-01T18:35:00Z", parentName: "Ramesh Sharma", status: "Signed & Verified" }
            },
            studentCompletions: {
                "stu-1": { completedAt: "2025-09-01T19:00:00Z", status: "Done" }
            }
        },
        {
            id: "hw-10a-03",
            classId: "cls-10a",
            subjectId: "sub-eng",
            subjectName: "English Language & Literature",
            teacherName: "Rajesh Kumar Verma",
            assignedDate: "2025-09-01",
            dueDate: "2025-09-04",
            title: "Formal Letter: Letter to the Editor regarding Road Safety",
            description: "Draft a formal letter (100-120 words) to the Editor of a national daily highlighting the urgent need for a zebra crossing and speed breakers near the school entrance. Follow CBSE format strictly.",
            attachments: ["CBSE_Letter_To_Editor_Format.pdf"],
            type: "Writing Skill",
            parentSignatures: {},
            studentCompletions: {}
        },
        {
            id: "hw-1a-01",
            classId: "cls-1a",
            subjectId: "sub-eng",
            subjectName: "English Phonics",
            teacherName: "Neha Aggarwal",
            assignedDate: "2025-09-01",
            dueDate: "2025-09-02",
            title: "Phonics Reading - 'at' and 'an' Sound Words",
            description: "Read aloud page 16 of Radiant Reader 3 times. Write 5 rhyming words with '-at' (cat, bat, mat, rat, hat) and 5 words with '-an' (pan, van, man, can, fan) with drawings in English 4-line notebook.",
            attachments: ["Phonics_Family_at_an.pdf"],
            type: "Reading & Writing",
            parentSignatures: {},
            studentCompletions: {}
        },
        {
            id: "hw-play-01",
            classId: "cls-play-a",
            subjectId: "sub-phe",
            subjectName: "Sensory & Fine Motor Activity",
            teacherName: "Pooja Malhotra",
            assignedDate: "2025-09-01",
            dueDate: "2025-09-02",
            title: "Yellow Day Flower Thumb-Printing Activity",
            description: "Parents are requested to guide the child in thumb-printing with yellow watercolor on the sunflower outline page in the Art Activity Book. Also dress up the child in yellow tomorrow for Yellow Day celebration!",
            attachments: ["Yellow_Day_Sunflower_Sheet.pdf"],
            type: "Parent-Child Activity",
            parentSignatures: {},
            studentCompletions: {}
        }
    ],

    // Automated Safety & Attendance Parent Alerts Log
    notifications: [
        {
            id: "notif-01",
            studentId: "stu-1",
            studentName: "Aarav Sharma",
            parentId: "par-1",
            parentName: "Ramesh Sharma",
            parentPhone: "+91 98111 55443",
            classId: "cls-10a",
            className: "Class 10 - Section A",
            date: "2025-09-01",
            time: "08:02 AM",
            status: "P",
            title: "✅ Safe Campus Check-In: Aarav Sharma",
            message: "Dear Ramesh Sharma, your ward Aarav Sharma (Class 10 - Section A) has safely arrived on campus and is marked PRESENT in Morning Assembly at 08:02 AM at Apex Horizon Public School.",
            severity: "success",
            channel: "SMS & WhatsApp",
            deliveryStatus: "Delivered (WhatsApp API + SMS Gateway)",
            read: false,
            timestamp: "2025-09-01T08:02:15Z"
        },
        {
            id: "notif-02",
            studentId: "stu-4",
            studentName: "Devansh Singhania",
            parentId: "par-4",
            parentName: "Sanjay Singhania",
            parentPhone: "+91 98450 11223",
            classId: "cls-10a",
            className: "Class 10 - Section A",
            date: "2025-09-01",
            time: "08:05 AM",
            status: "A",
            title: "🚨 URGENT: Devansh Singhania Marked ABSENT Today",
            message: "Dear Sanjay Singhania, your ward Devansh Singhania (Class 10 - Section A, Roll #04) has been marked ABSENT for Morning Assembly today (01 Sep 2025) at Apex Horizon Public School. If this absence is unexpected, please contact the School Helpline: +91 11 2789 4400 immediately.",
            severity: "urgent",
            channel: "SMS & WhatsApp",
            deliveryStatus: "Delivered (WhatsApp API + SMS Gateway)",
            read: false,
            timestamp: "2025-09-01T08:05:00Z"
        }
    ],

    // GPS School Bus Transport & Live Fleet Management
    transportRoutes: [
        {
            id: "route-01",
            routeNo: "Route #04",
            name: "Rohini Sec 14 to Pitampura & Campus",
            busNumber: "DL-1V-A-4821",
            busModel: "Tata Starbus 42-Seater (CCTV & GPS Enabled)",
            driverName: "Surinder Singh",
            driverPhone: "+91 98711 22334",
            attendantName: "Manju Devi",
            attendantPhone: "+91 98711 55667",
            speed: "36 km/h",
            speedStatus: "Normal Speed (Governed at 40 km/h max)",
            tripStatus: "En Route to School (Morning Trip)",
            currentLocation: "Approaching Madhuban Chowk (Stop 3 of 6)",
            etaToCampus: "14 Mins",
            departureTime: "07:05 AM",
            campusArrivalTime: "07:55 AM",
            studentsAssigned: ["stu-1", "stu-2", "stu-4"],
            stops: [
                { id: "st-1", name: "Prashant Vihar Power House", morningPickup: "07:10 AM", eveningDrop: "02:40 PM", status: "Passed ✅" },
                { id: "st-2", name: "Sec 9 Rohini Metro Gate #2", morningPickup: "07:18 AM", eveningDrop: "02:48 PM", status: "Passed ✅" },
                { id: "st-3", name: "Madhuban Chowk Red Light (Aarav Stop)", morningPickup: "07:26 AM", eveningDrop: "02:56 PM", status: "Current Approaching 🟡" },
                { id: "st-4", name: "Pitampura Club & AP Block", morningPickup: "07:35 AM", eveningDrop: "03:05 PM", status: "Upcoming ⏳" },
                { id: "st-5", name: "Kohat Enclave Main Market", morningPickup: "07:42 AM", eveningDrop: "03:12 PM", status: "Upcoming ⏳" },
                { id: "st-6", name: "Apex Horizon Public School Campus", morningPickup: "07:55 AM", eveningDrop: "02:30 PM", status: "Destination 🏫" }
            ]
        },
        {
            id: "route-02",
            routeNo: "Route #08",
            name: "Shalimar Bagh to Model Town & Campus",
            busNumber: "DL-1V-B-5902",
            busModel: "Eicher Skyline 36-Seater",
            driverName: "Gurmeet Singh",
            driverPhone: "+91 98108 44332",
            attendantName: "Kamla Bai",
            attendantPhone: "+91 98108 99001",
            speed: "32 km/h",
            speedStatus: "Normal Speed",
            tripStatus: "En Route",
            currentLocation: "Shalimar Bagh Club Road",
            etaToCampus: "18 Mins",
            departureTime: "07:00 AM",
            campusArrivalTime: "07:50 AM",
            studentsAssigned: ["stu-3", "stu-5"],
            stops: [
                { id: "st-11", name: "Model Town Metro Station", morningPickup: "07:05 AM", eveningDrop: "02:45 PM", status: "Passed ✅" },
                { id: "st-12", name: "Shalimar Bagh Club Road", morningPickup: "07:20 AM", eveningDrop: "03:00 PM", status: "Current 🟡" },
                { id: "st-13", name: "Apex Horizon Public School Campus", morningPickup: "07:50 AM", eveningDrop: "02:30 PM", status: "Destination 🏫" }
            ]
        }
    ],

    // Library Book Catalog & Resource Circulation
    libraryBooks: [
        {
            id: "bk-01",
            accessionNo: "ACC-10492",
            isbn: "978-8177091793",
            title: "Concepts of Physics (Vol 1 & 2 Combined)",
            author: "Dr. H.C. Verma (IIT Kanpur)",
            publisher: "Bharati Bhawan",
            category: "Science & Physics",
            edition: "2024 Revised Edition",
            totalCopies: 8,
            availableCopies: 5,
            shelfLocation: "Rack P-02 (Senior Science Section)"
        },
        {
            id: "bk-02",
            accessionNo: "ACC-10493",
            isbn: "978-9352535033",
            title: "Mathematics for Class 10 (CBSE Standard & Basic)",
            author: "Dr. R.D. Sharma",
            publisher: "Dhanpat Rai Publications",
            category: "Mathematics Reference",
            edition: "2025 Edition",
            totalCopies: 10,
            availableCopies: 7,
            shelfLocation: "Rack M-01 (Mathematics Aisle)"
        },
        {
            id: "bk-03",
            accessionNo: "ACC-10494",
            isbn: "978-8171673407",
            title: "Wings of Fire: An Autobiography",
            author: "Dr. A.P.J. Abdul Kalam & Arun Tiwari",
            publisher: "Universities Press",
            category: "Biography & Inspiration",
            edition: "Special Illustrated Edition",
            totalCopies: 6,
            availableCopies: 4,
            shelfLocation: "Rack B-04 (Inspirational Section)"
        },
        {
            id: "bk-04",
            accessionNo: "ACC-10495",
            isbn: "978-0143330837",
            title: "The Blue Umbrella & Other Mountain Stories",
            author: "Ruskin Bond",
            publisher: "Puffin India",
            category: "Children & Young Fiction",
            edition: "2023 Edition",
            totalCopies: 12,
            availableCopies: 9,
            shelfLocation: "Rack E-01 (English Literature)"
        },
        {
            id: "bk-05",
            accessionNo: "ACC-10496",
            isbn: "978-8121905640",
            title: "Science Chemistry & Biology Laboratory Companion",
            author: "Lakhmir Singh & Manjit Kaur",
            publisher: "S. Chand Publishing",
            category: "Science & Practical",
            edition: "2024 Edition",
            totalCopies: 7,
            availableCopies: 6,
            shelfLocation: "Rack S-03 (Lab Reference)"
        },
        {
            id: "bk-06",
            accessionNo: "ACC-10497",
            isbn: "978-0195629163",
            title: "The Discovery of India (Centenary Edition)",
            author: "Pt. Jawaharlal Nehru",
            publisher: "Oxford University Press",
            category: "History & Social Science",
            edition: "Centenary Edition",
            totalCopies: 5,
            availableCopies: 3,
            shelfLocation: "Rack H-05 (Indian History Section)"
        }
    ],

    // Library Book Lending Records (Issue / Return Desk)
    libraryLoans: [
        {
            id: "loan-01",
            bookId: "bk-01",
            bookTitle: "Concepts of Physics (Vol 1 & 2 Combined)",
            accessionNo: "ACC-10492",
            borrowerType: "student",
            borrowerId: "stu-1",
            borrowerName: "Aarav Sharma",
            borrowerClass: "Class 10 - Section A",
            issueDate: "2025-08-20",
            dueDate: "2025-09-03",
            returnDate: null,
            status: "Active Borrowed",
            fineAmount: 0
        },
        {
            id: "loan-02",
            bookId: "bk-03",
            bookTitle: "Wings of Fire: An Autobiography",
            accessionNo: "ACC-10494",
            borrowerType: "student",
            borrowerId: "stu-2",
            borrowerName: "Diya Verma",
            borrowerClass: "Class 10 - Section A",
            issueDate: "2025-08-14",
            dueDate: "2025-08-28",
            returnDate: null,
            status: "Overdue (4 Days)",
            fineAmount: 20 // ₹5 per day overdue
        }
    ],

    // Staff Payroll & Salary Structures (INR ₹)
    staffPayroll: [
        {
            id: "pay-01",
            staffId: "tch-1",
            staffName: "Sunita Sharma",
            designation: "PGT Mathematics & Senior Coordinator",
            payType: "formal",
            payTypeLabel: "7th Pay Scale (CBSE Standard)",
            monthYear: "August 2025",
            basicPay: 48000,
            dearnessAllowance: 19200, // 40% DA
            houseRentAllowance: 12000, // 25% HRA
            specialAllowance: 6500,
            transportAllowance: 3200,
            grossSalary: 88900,
            epfDeduction: 5760, // 12% on Basic
            esicDeduction: 0,
            professionalTax: 200,
            tdsDeduction: 4500,
            totalDeductions: 10460,
            netSalary: 78440,
            status: "Paid & Disbursed",
            paymentDate: "2025-08-31",
            paymentMode: "Direct Bank Transfer (NEFT/RTGS)",
            bankName: "HDFC Bank (Rohini Institutional Branch)",
            bankAccount: "50100491823190",
            ifsc: "HDFC0001204",
            pan: "ABFPS8821K",
            uan: "100928374821"
        },
        {
            id: "pay-02",
            staffId: "tch-lkg",
            staffName: "Kavita Verma",
            designation: "LKG Kindergarten Educator",
            payType: "fixed",
            payTypeLabel: "Direct Fixed Monthly Pay",
            monthYear: "August 2025",
            fixedSalary: 24000,
            grossSalary: 24000,
            advanceDeduction: 0,
            lopDeduction: 1000, // 1 day unpaid leave
            otherDeduction: 0,
            totalDeductions: 1000,
            netSalary: 23000,
            status: "Paid & Disbursed",
            paymentDate: "2025-08-31",
            paymentMode: "UPI Transfer (GPay / PhonePe)",
            bankName: "Paytm Payments Bank / UPI",
            bankAccount: "9866677889@paytm",
            ifsc: "PYTM0123456",
            pan: "BKVPR9912A",
            notes: "Fixed consolidated monthly pay. ₹1,000 deducted for 1-day LOP."
        },
        {
            id: "pay-03",
            staffId: "drv-01",
            staffName: "Balwinder Singh",
            designation: "School Bus Senior Driver (Fleet Lead)",
            payType: "daily",
            payTypeLabel: "Per-Day Daily Wage (24 Days @ ₹750/day)",
            monthYear: "August 2025",
            dailyRate: 750,
            daysWorked: 24,
            baseEarned: 18000,
            overtimeAllowance: 1500,
            grossSalary: 19500,
            advanceDeduction: 500,
            totalDeductions: 500,
            netSalary: 19000,
            status: "Paid & Disbursed",
            paymentDate: "2025-08-31",
            paymentMode: "Cash at Accounts Counter",
            bankName: "Counter Cash Disbursement",
            bankAccount: "N/A (Cash Pay Slip)",
            notes: "24 Duty days @ ₹750 + ₹1,500 weekend trip overtime - ₹500 advance."
        },
        {
            id: "pay-04",
            staffId: "tch-tgt1",
            staffName: "Vikramaditya Rathore",
            designation: "TGT Hindi & Sanskrit Specialist",
            payType: "formal",
            payTypeLabel: "7th Pay Scale (CBSE Standard)",
            monthYear: "August 2025",
            basicPay: 42000,
            dearnessAllowance: 16800,
            houseRentAllowance: 10500,
            specialAllowance: 5000,
            transportAllowance: 3200,
            grossSalary: 77500,
            epfDeduction: 5040,
            esicDeduction: 0,
            professionalTax: 200,
            tdsDeduction: 3200,
            totalDeductions: 8440,
            netSalary: 69060,
            status: "Paid & Disbursed",
            paymentDate: "2025-08-31",
            paymentMode: "Direct Bank Transfer (NEFT/RTGS)",
            bankName: "ICICI Bank (Pitampura Branch)",
            bankAccount: "089201998312",
            ifsc: "ICIC0000892",
            pan: "BVKPR1190E",
            uan: "100772819201"
        }
    ],

    // Staff Leave Requests & Allocation Balances
    staffLeaves: {
        balances: {
            "tch-1": { clTotal: 12, clUsed: 2, elTotal: 15, elUsed: 0, mlTotal: 10, mlUsed: 1 },
            "tch-2": { clTotal: 12, clUsed: 1, elTotal: 15, elUsed: 2, mlTotal: 10, mlUsed: 2 },
            "tch-3": { clTotal: 12, clUsed: 0, elTotal: 15, elUsed: 0, mlTotal: 10, mlUsed: 0 }
        },
        requests: [
            {
                id: "leave-01",
                staffId: "tch-1",
                staffName: "Sunita Sharma",
                designation: "PGT Mathematics",
                leaveType: "Casual Leave (CL)",
                fromDate: "2025-09-08",
                toDate: "2025-09-09",
                totalDays: 2,
                reason: "Attending CBSE Regional Mathematics Pedagogy Workshop at India Habitat Centre, New Delhi",
                appliedOn: "2025-08-30",
                status: "Approved",
                approvedBy: "Dr. Meenakshi Sundaram (Principal)",
                decisionNote: "Sanctioned. Substitute duty assigned to Rajesh Kumar Verma."
            },
            {
                id: "leave-02",
                staffId: "tch-2",
                staffName: "Rajesh Kumar Verma",
                designation: "TGT English",
                leaveType: "Medical Leave (ML)",
                fromDate: "2025-09-04",
                toDate: "2025-09-05",
                totalDays: 2,
                reason: "Scheduled dental surgery and medical rest as advised by physician",
                appliedOn: "2025-09-01",
                status: "Pending Review",
                approvedBy: null,
                decisionNote: null
            }
        ]
    }
};
