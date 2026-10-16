"use client";

import { useState, useEffect, ChangeEvent } from "react";

export default function Home() {
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Bottom Navigation Bar Active Tab
  const [activeBottomNav, setActiveBottomNav] = useState<"home" | "history" | "wallet" | "profile">("home");

  // Mandatory Phone state (if logged in via Email)
  const [contactPhone, setContactPhone] = useState("");

  // Student Safety KYC & Real Uploaded Documents
  const [studentName, setStudentName] = useState("");
  const [studentDocName, setStudentDocName] = useState("");
  const [studentDocData, setStudentDocData] = useState("");
  const [studentVerified, setStudentVerified] = useState(false);

  // Tutor Application & Real Uploaded Documents
  const [tutorName, setTutorName] = useState("");
  const [tutorSubject, setTutorSubject] = useState("Mathematics");
  const [tutorDegree, setTutorDegree] = useState("");
  
  // Real file states for Tutor
  const [tutorPhotoName, setTutorPhotoName] = useState("");
  const [tutorPhotoData, setTutorPhotoData] = useState("");
  
  const [tutorDegreeName, setTutorDegreeName] = useState("");
  const [tutorDegreeData, setTutorDegreeData] = useState("");
  
  const [tutorIdName, setTutorIdName] = useState("");
  const [tutorIdData, setTutorIdData] = useState("");

  const [tutorKycSubmitted, setTutorKycSubmitted] = useState(false);
  const [tutorApproved, setTutorApproved] = useState(true);
  const [tutorOnline, setTutorOnline] = useState(true);

  // Tutor Cockpit Job States
  const [incomingJob, setIncomingJob] = useState<{
    studentName: string;
    studentPhone: string;
    address: string;
    subject: string;
    duration: string;
    payout: number;
    distance: string;
  } | null>(null);

  const [activeJob, setActiveJob] = useState<{
    studentName: string;
    studentPhone: string;
    address: string;
    subject: string;
    duration: string;
    payout: number;
    distance: string;
    status: "navigating" | "in_class" | "completed";
  } | null>(null);

  // 2-Step OTP System (Start OTP & End OTP)
  const START_OTP = "5914";
  const END_OTP = "8342";
  const [tutorInputOtp, setTutorInputOtp] = useState("");

  // Live Timer for in-class simulation
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // DYNAMIC CLASS & SUBJECT MAPPING
  const classSubjectDirectory: Record<string, string[]> = {
    "Class 1": ["All Subjects", "Basic Mathematics", "English Phonics", "EVS / General Science", "Hindi"],
    "Class 2": ["All Subjects", "Basic Mathematics", "English Reader", "EVS", "Hindi Vyakaran"],
    "Class 3": ["All Subjects", "Mathematics", "Science (EVS)", "English Grammar", "Hindi", "Social Studies"],
    "Class 4": ["All Subjects", "Mathematics", "General Science", "Social Studies", "English", "Hindi"],
    "Class 5": ["All Subjects", "Mathematics", "General Science", "Social Studies", "English Grammar", "Hindi"],
    "Class 6": ["All Subjects", "Mathematics", "Science (Physics/Chem/Bio)", "Social Science (History/Civics/Geo)", "English", "Hindi / Sanskrit"],
    "Class 7": ["All Subjects", "Mathematics", "General Science", "Social Science", "English", "Hindi / Sanskrit"],
    "Class 8": ["All Subjects", "Mathematics", "Science", "Social Science", "English Grammar", "Computer Basics"],
    "Class 9": ["All Subjects", "Mathematics", "Physics", "Chemistry", "Biology", "Social Studies", "English Language & Lit", "Information Tech (IT)"],
    "Class 10": ["All Subjects", "Class 10 Mathematics", "Physics", "Chemistry", "Biology", "Social Science", "English Core", "Computer Applications"],
    "Class 11 (Science)": ["All Science (PCM/PCB)", "Physics (JEE/NEET)", "Chemistry (Org/Inorg)", "Mathematics (Calculus/Algebra)", "Biology (Botany/Zoology)", "Computer Science (Python)", "English Core"],
    "Class 12 (Science)": ["All Science (PCM/PCB)", "Physics (Board/JEE)", "Chemistry (Board/NEET)", "Mathematics (Calculus/Vectors)", "Biology (Medical Prep)", "Computer Science (Python)", "English Core"],
    "Class 11 (Commerce)": ["All Commerce Pack", "Accountancy", "Economics (Micro/Statistics)", "Business Studies", "Applied Mathematics", "English Core", "Informatics Practices"],
    "Class 12 (Commerce)": ["All Commerce Pack", "Accountancy (Partnership/Company)", "Macroeconomics & Indian Economy", "Business Studies", "Applied Mathematics", "English"],
    "Class 11 (Arts / Humanities)": ["All Humanities Pack", "History", "Political Science", "Geography", "Psychology", "Sociology", "Economics", "English Core"],
    "Class 12 (Arts / Humanities)": ["All Humanities Pack", "History", "Political Science", "Geography", "Psychology", "Sociology", "Economics", "English Core"],
    "B.Tech / Engineering": ["Engineering Mathematics (M1/M2/M3)", "Basic Electrical & Electronics (BEE)", "Data Structures & Algorithms (DSA)", "Object Oriented Programming (C++/Java)", "Digital Logic & Circuit Design", "Thermodynamics / Mechanics"],
    "BCA / Computer Science": ["Python Programming", "Java Programming & OOPs", "Web Development (HTML/CSS/React)", "Database Management System (SQL)", "Data Structures (C/C++)", "Operating Systems & Networking"],
  };

  const [selectedClass, setSelectedClass] = useState("Class 10");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Class 10 Mathematics"]);
  const [specificTopic, setSpecificTopic] = useState("");

  // Persistent Location States
  const [gpsAddress, setGpsAddress] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  // Student Step-by-Step Navigation
  const [bookingStep, setBookingStep] = useState<1 | 2>(1);
  const [durationHours, setDurationHours] = useState<number>(1);
  const [bookingMode, setBookingMode] = useState<"broadcast" | "manual">("broadcast");
  const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);

  // Dynamic Admin Pricing Registry Hook
  const [adminBroadcastRate, setAdminBroadcastRate] = useState(249);
  const [adminCustomPricingTable, setAdminCustomPricingTable] = useState<any>(null);

  // Payment Options
  const [paymentOption, setPaymentOption] = useState<"pay_now" | "pay_after">("pay_after");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod">("upi");

  // Booking Flow Status
  const [bookingStatus, setBookingStatus] = useState<"idle" | "searching" | "tutor_enroute" | "in_class" | "completed">("idle");

  const baseTutors = [
    {
      id: 1,
      name: "Rahul Verma",
      degree: "B.Tech (NIT Patna)",
      rating: "4.9 ★",
      sessions: "85+ classes",
      distance: "0.8 km",
      baseRatePerHour: 299,
    },
    {
      id: 2,
      name: "Sneha Roy",
      degree: "M.Sc Mathematics",
      rating: "5.0 ★",
      sessions: "110+ classes",
      distance: "1.4 km",
      baseRatePerHour: 349,
    },
    {
      id: 3,
      name: "Amit Ranjan",
      degree: "B.Sc (Hons)",
      rating: "4.8 ★",
      sessions: "42 classes",
      distance: "2.6 km",
      baseRatePerHour: 279,
    },
  ];

  // In-class stopwatch effect
  useEffect(() => {
    let interval: any = null;
    if (bookingStatus === "in_class") {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [bookingStatus]);

  // Sync Dynamic Pricing from Admin Master Fee Controller
  useEffect(() => {
    const savedMasterPricing = localStorage.getItem("vidyanow_master_pricing");
    if (savedMasterPricing) {
      try {
        const parsed = JSON.parse(savedMasterPricing);
        if (parsed.broadcastRate) {
          setAdminBroadcastRate(parsed.broadcastRate);
        }
        if (parsed.table) {
          setAdminCustomPricingTable(parsed.table);
        }
      } catch (e) {
        console.error("Error reading admin pricing", e);
      }
    }
  }, []);

  // Load Saved Session and Addresses from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("vidyanow_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.isLoggedIn) {
          setIsLoggedIn(true);
          setRole(parsed.role || "student");
          setIdentifier(parsed.identifier || "");
          setAuthMethod(parsed.authMethod || (parsed.identifier?.includes("@") ? "email" : "phone"));
          setContactPhone(parsed.contactPhone || (parsed.identifier?.includes("@") ? "" : parsed.identifier));
          setStudentVerified(parsed.studentVerified || false);
          setTutorKycSubmitted(parsed.tutorKycSubmitted || false);
          setTutorApproved(parsed.tutorApproved ?? true);
        }
      } catch (e) {
        console.error("Failed to load saved session", e);
      }
    }

    const savedGps = localStorage.getItem("vidyanow_saved_gps");
    const savedCustom = localStorage.getItem("vidyanow_saved_address");
    if (savedGps) setGpsAddress(savedGps);
    if (savedCustom) setCustomAddress(savedCustom);

    setIsInitializing(false);
  }, []);

  // Helper for real file to base64 conversion
  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setName: (name: string) => void,
    setData: (data: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size 5MB se chhota hona chahiye!");
      return;
    }

    setName(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
    const reader = new FileReader();
    reader.onloadend = () => {
      setData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert("Kripya valid mobile number ya email enter karein!");
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      alert("4 digit ka OTP daalein!");
      return;
    }
    const resolvedPhone = authMethod === "phone" ? identifier : contactPhone;
    const sessionData = {
      isLoggedIn: true,
      role,
      identifier,
      authMethod,
      contactPhone: resolvedPhone,
      studentVerified,
      tutorKycSubmitted,
      tutorApproved,
    };
    localStorage.setItem("vidyanow_user", JSON.stringify(sessionData));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("vidyanow_user");
    setIsLoggedIn(false);
    setOtpSent(false);
    setIdentifier("");
    setContactPhone("");
    setOtp("");
    setBookingStatus("idle");
    setBookingStep(1);
    setStudentVerified(false);
    setTutorKycSubmitted(false);
    setIncomingJob(null);
    setActiveJob(null);
  };

  const handleFetchGpsLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS not supported on this device.");
      return;
    }
    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lon = pos.coords.longitude.toFixed(4);
        const fetched = `GPS [${lat}, ${lon}] - Fraser Road Area`;
        setGpsAddress(fetched);
        localStorage.setItem("vidyanow_saved_gps", fetched);
        setIsFetchingGps(false);
      },
      () => {
        setIsFetchingGps(false);
        const fallback = "Fraser Road, Patna (GPS Detected)";
        setGpsAddress(fallback);
        localStorage.setItem("vidyanow_saved_gps", fallback);
      },
      { timeout: 7000 }
    );
  };

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    const available = classSubjectDirectory[newClass] || [];
    setSelectedSubjects(available.length > 0 ? [available[0]] : ["All Subjects"]);
  };

  const handleToggleSubject = (sub: string) => {
    if (sub.includes("All")) {
      setSelectedSubjects([sub]);
      return;
    }
    let updated = selectedSubjects.filter((s) => !s.includes("All"));
    if (updated.includes(sub)) {
      if (updated.length > 1) {
        updated = updated.filter((s) => s !== sub);
      }
    } else {
      updated.push(sub);
    }
    setSelectedSubjects(updated);
  };

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gpsAddress.trim() && !customAddress.trim()) {
      alert("Kripya apna address likhein ya GPS location use karein!");
      return;
    }
    if (customAddress.trim()) {
      localStorage.setItem("vidyanow_saved_address", customAddress.trim());
    }
    setBookingStep(2);
  };

  // Helper to read subject hourly rate (Admin set overrides defaults)
  const getSubjectHourlyRate = (cls: string, sub: string) => {
    if (adminCustomPricingTable && adminCustomPricingTable[cls]?.subjects?.[sub]) {
      return adminCustomPricingTable[cls].subjects[sub];
    }
    return 300;
  };

  const calculateFinalPrice = () => {
    if (bookingMode === "broadcast") {
      let baseRate = adminBroadcastRate;
      if (adminCustomPricingTable && adminCustomPricingTable[selectedClass]?.baseRate) {
        baseRate = adminCustomPricingTable[selectedClass].baseRate;
      }
      return Math.round(baseRate * durationHours);
    }

    const tutor = baseTutors.find((t) => t.id === selectedTutorId);
    let baseRate = tutor?.baseRatePerHour || 299;

    if (selectedSubjects.length === 1 && selectedSubjects[0].includes("All")) {
      baseRate = getSubjectHourlyRate(selectedClass, selectedSubjects[0]);
    } else if (selectedSubjects.length > 0) {
      let sum = 0;
      selectedSubjects.forEach((s) => {
        sum += getSubjectHourlyRate(selectedClass, s);
      });
      baseRate = selectedSubjects.length > 1 ? Math.round(sum * 0.85) : sum;
    }

    return Math.round(baseRate * durationHours);
  };

  const currentFinalPrice = calculateFinalPrice();

  const handleConfirmBooking = () => {
    if (bookingMode === "manual" && !selectedTutorId) {
      alert("Kripya list me se tutor chunein!");
      return;
    }

    setBookingStatus("searching");

    const effectivePhone = contactPhone || (authMethod === "phone" ? identifier : "+91 9835012345");

    setIncomingJob({
      studentName: studentName || "Pooja Sharma",
      studentPhone: effectivePhone,
      address: customAddress || gpsAddress || "Flat 302, Fraser Road, Patna",
      subject: `${selectedSubjects.join(", ")} (${selectedClass}) ${specificTopic ? `[Topic: ${specificTopic}]` : ""}`,
      duration: `${durationHours} Hours`,
      payout: Math.round(currentFinalPrice * 0.8),
      distance: "1.2 km away",
    });

    setTimeout(() => {
      setBookingStatus("tutor_enroute");
    }, 3500);
  };

  const handleStudentKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === "email" && !contactPhone.trim()) {
      alert("Calling & security verification ke liye valid mobile number daalna zaroori hai!");
      return;
    }
    if (!studentDocData) {
      alert("Safety verification ke liye Govt ID proof (PDF ya Image) upload karein!");
      return;
    }
    setStudentVerified(true);
    const updated = {
      isLoggedIn: true,
      role: "student",
      identifier,
      authMethod,
      contactPhone: contactPhone || identifier,
      studentVerified: true,
      studentDocName,
      studentDocData,
    };
    localStorage.setItem("vidyanow_user", JSON.stringify(updated));
  };

  const handleTutorKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === "email" && !contactPhone.trim()) {
      alert("Student direct contact ke liye verified Mobile Number daalna zaroori hai!");
      return;
    }
    if (!tutorPhotoData || !tutorDegreeData || !tutorIdData) {
      alert("Selfie Photo, Degree Certificate aur Govt. ID teeno documents upload karein!");
      return;
    }
    setTutorKycSubmitted(true);
    const updated = {
      isLoggedIn: true,
      role: "tutor",
      identifier,
      authMethod,
      contactPhone: contactPhone || identifier,
      tutorKycSubmitted: true,
      tutorApproved: true,
      tutorPhotoName,
      tutorDegreeName,
      tutorIdName,
    };
    localStorage.setItem("vidyanow_user", JSON.stringify(updated));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center text-slate-900 antialiased font-sans">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col justify-between shadow-2xl relative pb-20 select-none">
        
        {/* ================= HEADER ================= */}
        <header className="bg-white border-b border-slate-100 px-4 pt-3 pb-3 sticky top-0 z-40 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/20">
              V
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-base text-slate-900 tracking-tight">VidyaNow</span>
                <span className="text-[9px] bg-blue-100 text-blue-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  45M
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Home Tutors At Doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {role === "student" ? "Student" : "Partner"}
              </span>
            )}
            <button
              onClick={() => {
                if (isLoggedIn) handleLogout();
              }}
              className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-red-600 border border-slate-200 text-xs"
              title={isLoggedIn ? "Logout" : "User"}
            >
              {isLoggedIn ? "🚪" : "👤"}
            </button>
          </div>
        </header>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {!isLoggedIn ? (
            /* Login Form */
            <div className="pt-4 space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900">Get Verified Tutors</h2>
                <p className="text-xs text-slate-500">Fast 45-minute doorstep doubt clearing</p>
              </div>

              <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setRole("student"); setOtpSent(false); }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    role === "student" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Student / Parent
                </button>
                <button
                  type="button"
                  onClick={() => { setRole("tutor"); setOtpSent(false); }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    role === "tutor" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Tutor Partner
                </button>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Choose Sign-in Method:</span>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => { setAuthMethod("phone"); setIdentifier(""); }}
                        className={`font-bold ${authMethod === "phone" ? "text-blue-600 underline" : "text-slate-400"}`}
                      >
                        Phone
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => { setAuthMethod("email"); setIdentifier(""); }}
                        className={`font-bold ${authMethod === "email" ? "text-blue-600 underline" : "text-slate-400"}`}
                      >
                        Email
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {authMethod === "phone" ? "Mobile Phone Number" : "Email Address"}
                    </label>
                    <div className="relative">
                      {authMethod === "phone" && (
                        <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-500">+91</span>
                      )}
                      <input
                        type={authMethod === "phone" ? "tel" : "email"}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={authMethod === "phone" ? "9876543210" : "name@example.com"}
                        required
                        className={`w-full bg-slate-50 border border-slate-300 rounded-2xl py-2.5 px-3.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 ${
                          authMethod === "phone" ? "pl-11" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-2xl text-xs font-black text-white shadow-md transition active:scale-[0.98] ${
                      role === "student" ? "bg-blue-600 shadow-blue-500/25" : "bg-emerald-600 shadow-emerald-500/25"
                    }`}
                  >
                    Send Verification OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center p-3 bg-blue-50 border border-blue-100 rounded-2xl">
                    <p className="text-xs text-slate-600">OTP sent to <strong>{identifier}</strong></p>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-blue-600 font-bold underline mt-1"
                    >
                      Change Identifier
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                      Enter 4-Digit Verification OTP
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • •"
                      required
                      className="w-full text-center tracking-[1em] text-lg font-black bg-slate-50 border border-slate-300 rounded-2xl py-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[10px] text-slate-400 text-center mt-1">Demo code: enter any 4 digits</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition"
                  >
                    Verify & Enter App
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {role === "student" ? (
                /* ================= STUDENT EXPERIENCE ================= */
                !studentVerified ? (
                  <div className="space-y-4 pt-2">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Safety First
                      </span>
                      <h3 className="text-lg font-black text-slate-900">Student Safety Verification</h3>
                      <p className="text-xs text-slate-500">
                        Doorstep visit aur calling verification ke liye details complete karein.
                      </p>
                    </div>

                    <form onSubmit={handleStudentKycSubmit} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Shubham Shreshth"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* MANDATORY PHONE NUMBER IF SIGNED IN VIA EMAIL */}
                      {authMethod === "email" && (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Mobile Phone Number <span className="text-red-500 font-bold">*Mandatory</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">+91</span>
                            <input
                              type="tel"
                              required
                              placeholder="9876543210"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full pl-11 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Tutor navigation aur direct calling coordination ke liye anivarya hai.
                          </p>
                        </div>
                      )}

                      {/* REAL DOCUMENT FILE UPLOAD (PDF OR IMAGE) */}
                      <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50/50 space-y-2">
                        <div className="text-2xl">🪪</div>
                        <p className="text-xs font-bold text-slate-800">
                          Govt ID Proof (Aadhaar / Voter ID / Driving License)
                        </p>
                        <p className="text-[10px] text-slate-500">Formats: JPG, PNG, PDF (Max 5MB)</p>

                        <label className="inline-block cursor-pointer px-4 py-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-xs transition">
                          <span>{studentDocName ? "✓ Replace File" : "+ Choose File (PDF/Image)"}</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setStudentDocName, setStudentDocData)}
                          />
                        </label>

                        {studentDocName && (
                          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-bold flex items-center justify-center gap-1.5">
                            <span>📄</span>
                            <span className="truncate max-w-[240px]">{studentDocName}</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition"
                      >
                        Complete Safety Setup & Continue
                      </button>
                    </form>
                  </div>
                ) : (
                  /* ================= BOOKING FLOW ================= */
                  <div className="space-y-4">
                    {bookingStatus === "idle" && (
                      <>
                        {/* ================= STEP 1: CLASS, DYNAMIC SUBJECTS & LOCATION ================= */}
                        {bookingStep === 1 && (
                          <form onSubmit={handleProceedToStep2} className="space-y-4 animate-in fade-in">
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                                  <span>🏠</span> Home Delivery Location
                                </label>
                                <button
                                  type="button"
                                  onClick={handleFetchGpsLocation}
                                  className="text-[11px] text-blue-600 font-extrabold flex items-center gap-1 hover:underline"
                                >
                                  📍 {isFetchingGps ? "Detecting GPS..." : "Use Current GPS"}
                                </button>
                              </div>

                              <input
                                type="text"
                                placeholder="GPS location auto-fills here..."
                                value={gpsAddress}
                                onChange={(e) => {
                                  setGpsAddress(e.target.value);
                                  localStorage.setItem("vidyanow_saved_gps", e.target.value);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-700"
                              />

                              <input
                                type="text"
                                placeholder="Flat No., House No., Landmark (Always Saved)..."
                                value={customAddress}
                                onChange={(e) => {
                                  setCustomAddress(e.target.value);
                                  localStorage.setItem("vidyanow_saved_address", e.target.value);
                                }}
                                required
                                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-black text-slate-800">1. Select Specific Class / Course</label>
                                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                                  {selectedClass}
                                </span>
                              </div>
                              <select
                                value={selectedClass}
                                onChange={(e) => handleClassChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                              >
                                {Object.keys(classSubjectDirectory).map((cls) => (
                                  <option key={cls} value={cls}>
                                    {cls}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-black text-slate-800">
                                  2. Choose Subject(s) ({selectedClass})
                                </label>
                                <span className="text-[10px] text-slate-400">Multiple Select Allowed</span>
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {(classSubjectDirectory[selectedClass] || []).map((sub) => {
                                  const isSelected = selectedSubjects.includes(sub);
                                  return (
                                    <button
                                      key={sub}
                                      type="button"
                                      onClick={() => handleToggleSubject(sub)}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                                        isSelected
                                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                      }`}
                                    >
                                      {isSelected ? "✓ " : "+ "}
                                      {sub}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-black text-slate-800 block mb-1">
                                3. Specific Topic / Chapter (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Trigonometry Formulas, Newton's 2nd Law, Organic Reactions..."
                                value={specificTopic}
                                onChange={(e) => setSpecificTopic(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">
                                Teacher aane se pehle is specific topic ko prepare karke aayenge.
                              </p>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition mt-2"
                            >
                              Continue to Tutor Options →
                            </button>
                          </form>
                        )}

                        {/* ================= STEP 2: TIMING, RADAR DISPATCH & PAYMENT ================= */}
                        {bookingStep === 2 && (
                          <div className="space-y-4 animate-in fade-in">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                              <div>
                                <h4 className="text-xs font-black text-slate-900">Select Duration & Book</h4>
                                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                                  📍 {customAddress || gpsAddress}
                                </p>
                              </div>
                              <button
                                onClick={() => setBookingStep(1)}
                                className="text-[11px] text-blue-600 font-bold underline"
                              >
                                Edit Details
                              </button>
                            </div>

                            <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs flex justify-between items-center">
                              <div>
                                <span className="font-extrabold text-blue-900">{selectedClass}</span>
                                <p className="text-[10px] text-blue-700 font-medium truncate max-w-[220px]">
                                  {selectedSubjects.join(", ")}
                                </p>
                              </div>
                              {specificTopic && (
                                <span className="text-[9px] bg-white text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                                  Topic: {specificTopic}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { h: 1, label: "1 Hour", sub: "Regular" },
                                { h: 1.5, label: "1.5 Hrs", sub: "Deep" },
                                { h: 2, label: "2 Hours", sub: "Exam" },
                              ].map((item) => (
                                <button
                                  key={item.h}
                                  type="button"
                                  onClick={() => setDurationHours(item.h)}
                                  className={`p-2 rounded-xl border text-center transition ${
                                    durationHours === item.h
                                      ? "border-blue-600 bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-600"
                                      : "border-slate-200 bg-slate-50 text-slate-700"
                                  }`}
                                >
                                  <div className="text-xs font-black">{item.label}</div>
                                  <div className="text-[9px] opacity-75">{item.sub}</div>
                                </button>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <div
                                onClick={() => {
                                  setBookingMode("broadcast");
                                  setSelectedTutorId(null);
                                }}
                                className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center transition ${
                                  bookingMode === "broadcast"
                                    ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600"
                                    : "border-slate-200 bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                                    ⚡
                                  </div>
                                  <div>
                                    <div className="text-xs font-black text-slate-900">Instant Broadcast</div>
                                    <div className="text-[10px] text-slate-500">Fastest 45-min arrival</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-black text-slate-900">
                                    ₹{calculateFinalPrice()}
                                  </div>
                                  <div className="text-[9px] text-slate-400">for {durationHours} hr</div>
                                </div>
                              </div>

                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Or Pick Nearby Verified Tutor (3 km)
                                </span>
                                {baseTutors.map((tutor) => {
                                  const isSelected = bookingMode === "manual" && selectedTutorId === tutor.id;
                                  return (
                                    <div
                                      key={tutor.id}
                                      onClick={() => {
                                        setBookingMode("manual");
                                        setSelectedTutorId(tutor.id);
                                      }}
                                      className={`p-2.5 rounded-xl border cursor-pointer flex justify-between items-center transition ${
                                        isSelected
                                          ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600"
                                          : "border-slate-200 bg-white"
                                      }`}
                                    >
                                      <div>
                                        <div className="text-xs font-bold text-slate-900">{tutor.name}</div>
                                        <div className="text-[10px] text-slate-500">{tutor.degree} • {tutor.rating}</div>
                                        <div className="text-[9px] text-emerald-600 font-bold">📍 {tutor.distance}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-xs font-black text-slate-900">
                                          ₹{calculateFinalPrice()}
                                        </div>
                                        <div className={`text-[10px] font-bold ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                                          {isSelected ? "✓ Picked" : "Tap"}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                              <span className="text-[10px] font-bold uppercase text-slate-600 block">
                                Payment Options
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPaymentOption("pay_after")}
                                  className={`p-2 rounded-xl border text-left text-xs font-bold transition ${
                                    paymentOption === "pay_after"
                                      ? "bg-white border-emerald-600 text-emerald-800 shadow-2xs"
                                      : "bg-white/60 text-slate-600 border-slate-200"
                                  }`}
                                >
                                  💵 Pay After Class
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPaymentOption("pay_now")}
                                  className={`p-2 rounded-xl border text-left text-xs font-bold transition ${
                                    paymentOption === "pay_now"
                                      ? "bg-white border-blue-600 text-blue-800 shadow-2xs"
                                      : "bg-white/60 text-slate-600 border-slate-200"
                                  }`}
                                >
                                  ⚡ Pay Online UPI
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={handleConfirmBooking}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-blue-500/25 flex items-center justify-between px-4 transition active:scale-[0.98]"
                            >
                              <span>{bookingMode === "broadcast" ? "⚡ Request Radar Dispatch" : "Request Tutor"}</span>
                              <span className="bg-blue-800/80 px-2 py-0.5 rounded-lg">Pay ₹{currentFinalPrice}</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {/* RADAR MAP SCREEN */}
                    {bookingStatus === "searching" && (
                      <div className="py-6 text-center space-y-4 animate-in fade-in">
                        <div className="relative w-56 h-56 mx-auto rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex items-center justify-center">
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:14px_14px]"></div>
                          <div className="absolute w-44 h-44 rounded-full border border-sky-500/20"></div>
                          <div className="absolute w-28 h-28 rounded-full border border-sky-500/30"></div>
                          <div className="absolute inset-0 rounded-full animate-ping opacity-25 bg-blue-500"></div>

                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-bounce"></div>
                            <span className="text-[9px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-full mt-1">
                              You (Home)
                            </span>
                          </div>

                          <div className="absolute top-10 left-10 z-10 flex items-center gap-1 animate-pulse">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
                            <span className="text-[8px] text-emerald-300 font-mono">0.8 km</span>
                          </div>
                          <div className="absolute bottom-12 right-10 z-10 flex items-center gap-1 animate-pulse delay-150">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
                            <span className="text-[8px] text-emerald-300 font-mono">1.4 km</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-black text-slate-900 text-sm">Broadcasting on 3 km Radar...</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Finding nearest verified tutor</p>
                        </div>
                      </div>
                    )}

                    {/* 1. TUTOR EN-ROUTE & START OTP */}
                    {bookingStatus === "tutor_enroute" && (
                      <div className="space-y-4 animate-in fade-in">
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-lg space-y-2 relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-full">
                                🚗 Tutor On The Way
                              </span>
                              <h3 className="text-xl font-black mt-1">Arriving in ~12 Mins</h3>
                              <p className="text-[11px] text-blue-100">Distance: 0.8 km away • Fraser Road</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                              ⏱️
                            </div>
                          </div>

                          <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                            <div className="bg-amber-400 h-1.5 rounded-full w-2/3 animate-pulse"></div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-slate-200 border border-slate-300 flex items-center justify-center text-xl font-bold">
                                👨‍🏫
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-slate-900">Rahul Verma</h4>
                                <p className="text-[11px] text-emerald-700 font-bold">B.Tech (NIT Patna) • 4.9 ★</p>
                                <p className="text-[10px] text-slate-500">{selectedSubjects.join(", ")}</p>
                              </div>
                            </div>
                            <a
                              href="tel:+919835012345"
                              className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs"
                            >
                              📞
                            </a>
                          </div>

                          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center">
                            <div>
                              <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider">
                                1. Class Start OTP
                              </span>
                              <p className="text-2xl font-black text-emerald-600 tracking-widest leading-none mt-1">
                                {START_OTP}
                              </p>
                            </div>
                            <p className="text-[10px] text-emerald-800 font-medium text-right max-w-[130px]">
                              Tutor ghar pahunche tabhi ye OTP share karein.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setBookingStatus("in_class")}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          Simulate: Tutor Entered Start OTP →
                        </button>
                      </div>
                    )}

                    {/* 2. CLASS IN PROGRESS & 2ND END OTP */}
                    {bookingStatus === "in_class" && (
                      <div className="space-y-4 animate-in fade-in">
                        <div className="p-5 bg-emerald-600 text-white rounded-3xl shadow-lg space-y-2 text-center relative overflow-hidden">
                          <span className="text-[10px] font-black uppercase bg-white/25 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                            Live Class In Progress
                          </span>

                          <div className="pt-1">
                            <span className="text-[11px] text-emerald-100 uppercase tracking-widest font-bold">
                              Session Running Time
                            </span>
                            <p className="text-4xl font-black tracking-widest font-mono mt-0.5">
                              {formatTime(elapsedSeconds)}
                            </p>
                          </div>

                          <p className="text-xs text-emerald-100">
                            Teacher: <strong>Rahul Verma</strong> • Subject: <strong>{selectedSubjects[0]}</strong>
                          </p>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
                              2. Class End OTP (Give when class finishes)
                            </span>
                            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                              Required To Finish
                            </span>
                          </div>

                          <div className="p-3 bg-white rounded-2xl border border-amber-300 flex justify-between items-center">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Session Close Code</span>
                              <p className="text-2xl font-black text-amber-600 tracking-widest leading-none mt-0.5">
                                {END_OTP}
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-500 text-right max-w-[130px]">
                              Padhai khatam hone par teacher ko dein.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setBookingStatus("completed")}
                          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-md transition"
                        >
                          Simulate: Tutor Entered End OTP ({END_OTP}) →
                        </button>
                      </div>
                    )}

                    {/* 3. COMPLETED & SETTLEMENT */}
                    {bookingStatus === "completed" && (
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-3 animate-in fade-in">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-black">
                          ✓
                        </div>
                        <h4 className="text-base font-black text-slate-900">Class Finished & Verified via OTP!</h4>
                        <p className="text-xs text-slate-500">
                          Total Payable: <strong>₹{currentFinalPrice}</strong> ({paymentOption === "pay_now" ? "Paid Online" : "Pay in Cash/UPI to Tutor"})
                        </p>
                        <button
                          onClick={() => {
                            setBookingStatus("idle");
                            setBookingStep(1);
                          }}
                          className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl mt-2"
                        >
                          Book Next Session
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                /* ================= TUTOR PARTNER APP (COCKPIT) ================= */
                !tutorKycSubmitted ? (
                  <div className="space-y-4 pt-2">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Partner Verification
                      </span>
                      <h3 className="text-lg font-black text-slate-900">Tutor Partner Application</h3>
                      <p className="text-xs text-slate-500">Real documents aur phone verification mandatory hain.</p>
                    </div>

                    <form onSubmit={handleTutorKycSubmit} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Verma"
                          value={tutorName}
                          onChange={(e) => setTutorName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                        />
                      </div>

                      {/* MANDATORY PHONE NUMBER IF TUTOR SIGNED IN VIA EMAIL */}
                      {authMethod === "email" && (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Calling Mobile Phone Number <span className="text-red-500 font-bold">*Mandatory</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">+91</span>
                            <input
                              type="tel"
                              required
                              placeholder="9876543210"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full pl-11 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Student direct call aur OTP verification ke liye phone number anivarya hai.
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        {/* 1. SELFIE PHOTO UPLOAD */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">1. Selfie / Profile Photo (Image)</span>
                            <label className="cursor-pointer px-3 py-1 bg-white border border-slate-300 text-blue-600 rounded-lg text-xs font-bold shadow-2xs hover:bg-slate-50">
                              <span>{tutorPhotoName ? "Change" : "Browse Image"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, setTutorPhotoName, setTutorPhotoData)}
                              />
                            </label>
                          </div>
                          {tutorPhotoName && (
                            <p className="text-[10px] text-emerald-700 font-bold truncate">✓ {tutorPhotoName}</p>
                          )}
                        </div>

                        {/* 2. DEGREE CERTIFICATE UPLOAD */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">2. Qualification Degree (PDF/Image)</span>
                            <label className="cursor-pointer px-3 py-1 bg-white border border-slate-300 text-blue-600 rounded-lg text-xs font-bold shadow-2xs hover:bg-slate-50">
                              <span>{tutorDegreeName ? "Change" : "Browse File"}</span>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, setTutorDegreeName, setTutorDegreeData)}
                              />
                            </label>
                          </div>
                          {tutorDegreeName && (
                            <p className="text-[10px] text-emerald-700 font-bold truncate">✓ {tutorDegreeName}</p>
                          )}
                        </div>

                        {/* 3. GOVT ID PROOF UPLOAD */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">3. Govt ID Proof (Aadhaar / DL)</span>
                            <label className="cursor-pointer px-3 py-1 bg-white border border-slate-300 text-blue-600 rounded-lg text-xs font-bold shadow-2xs hover:bg-slate-50">
                              <span>{tutorIdName ? "Change" : "Browse File"}</span>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, setTutorIdName, setTutorIdData)}
                              />
                            </label>
                          </div>
                          {tutorIdName && (
                            <p className="text-[10px] text-emerald-700 font-bold truncate">✓ {tutorIdName}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-emerald-500/20 active:scale-[0.98] transition"
                      >
                        Submit Real Documents for Verification
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Tutor Cockpit */
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Partner Cockpit</h4>
                        <span className="text-[10px] text-emerald-600 font-bold">● Active in Patna Cluster</span>
                      </div>
                      <button
                        onClick={() => setTutorOnline(!tutorOnline)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          tutorOnline ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {tutorOnline ? "ONLINE" : "OFFLINE"}
                      </button>
                    </div>

                    {!incomingJob && !activeJob && (
                      <div className="space-y-2">
                        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-1">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-lg">
                            ⚡
                          </div>
                          <p className="text-xs font-bold text-slate-700">Waiting for requests...</p>
                          <p className="text-[10px] text-slate-400">Keep app active to receive nearby trips</p>
                        </div>
                        <button
                          onClick={() => {
                            const effectivePhone = contactPhone || (authMethod === "phone" ? identifier : "+91 9835012345");
                            setIncomingJob({
                              studentName: "Pooja Sharma",
                              studentPhone: effectivePhone,
                              address: "Flat 302, Fraser Road, Patna",
                              subject: "Mathematics (Class 10)",
                              duration: "1.5 Hours",
                              payout: Math.round(currentFinalPrice * 0.8),
                              distance: "1.2 km away",
                            });
                          }}
                          className="w-full py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold"
                        >
                          🔔 Test Student Alert
                        </button>
                      </div>
                    )}

                    {activeJob && (
                      <div className="p-4 bg-white border-2 border-emerald-500/30 rounded-2xl space-y-3 shadow-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              {activeJob.status === "navigating"
                                ? "🚗 En Route to Student"
                                : activeJob.status === "in_class"
                                ? "🟢 Class In Progress"
                                : "✓ Class Finished"}
                            </span>
                            <h4 className="text-sm font-black text-slate-900 mt-1">{activeJob.studentName}</h4>
                            <p className="text-xs text-slate-500">{activeJob.subject} • {activeJob.duration}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400">Earning</span>
                            <p className="text-lg font-black text-emerald-600">₹{activeJob.payout}</p>
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-0.5">
                          <p className="font-bold text-slate-700">📍 Destination:</p>
                          <p className="text-slate-800">{activeJob.address}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                              activeJob.address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs text-center shadow-xs"
                          >
                            🧭 Google Maps
                          </a>
                          <a
                            href={`tel:${activeJob.studentPhone}`}
                            className="bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs text-center shadow-xs"
                          >
                            📞 Call Student ({activeJob.studentPhone})
                          </a>
                        </div>

                        {/* 1. TUTOR VERIFIES CLASS START OTP */}
                        {activeJob.status === "navigating" && (
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            <span className="text-[11px] font-bold text-slate-700 block">
                              Enter 4-Digit Student Start OTP (5914)
                            </span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={4}
                                value={tutorInputOtp}
                                onChange={(e) => setTutorInputOtp(e.target.value)}
                                placeholder="5914"
                                className="w-full text-center text-sm font-black bg-slate-50 border border-slate-300 rounded-xl py-2"
                              />
                              <button
                                onClick={() => {
                                  if (tutorInputOtp === START_OTP) {
                                    setActiveJob({ ...activeJob, status: "in_class" });
                                    setTutorInputOtp("");
                                    alert("Start OTP Verified! Class timer has begun.");
                                  } else {
                                    alert("Wrong OTP! Ask student for Class Start OTP (Hint: 5914)");
                                  }
                                }}
                                className="bg-emerald-600 text-white font-bold px-3 py-2 rounded-xl text-xs whitespace-nowrap"
                              >
                                Start Class
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 2. TUTOR VERIFIES CLASS END OTP */}
                        {activeJob.status === "in_class" && (
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            <div className="p-2.5 bg-emerald-50 rounded-xl text-center">
                              <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Teaching in Progress ({activeJob.duration})
                              </span>
                            </div>

                            <span className="text-[11px] font-bold text-slate-700 block">
                              Enter Student's Class End OTP ({END_OTP}) to Complete:
                            </span>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={4}
                                value={tutorInputOtp}
                                onChange={(e) => setTutorInputOtp(e.target.value)}
                                placeholder="8342"
                                className="w-full text-center text-sm font-black bg-slate-50 border border-slate-300 rounded-xl py-2"
                              />
                              <button
                                onClick={() => {
                                  if (tutorInputOtp === END_OTP) {
                                    setActiveJob({ ...activeJob, status: "completed" });
                                    setTutorInputOtp("");
                                    alert("End OTP Verified! ₹" + activeJob.payout + " credited to your wallet.");
                                  } else {
                                    alert("Wrong End OTP! Ask student for Class End OTP (Hint: 8342)");
                                  }
                                }}
                                className="bg-amber-600 text-white font-bold px-3 py-2 rounded-xl text-xs whitespace-nowrap"
                              >
                                End Session
                              </button>
                            </div>
                          </div>
                        )}

                        {activeJob.status === "completed" && (
                          <div className="space-y-2 text-center pt-2 border-t border-slate-100">
                            <p className="text-xs font-bold text-emerald-700">✓ Session Completed & Payment Cleared</p>
                            <button
                              onClick={() => {
                                setActiveJob(null);
                                setTutorInputOtp("");
                              }}
                              className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                            >
                              Ready for Next Booking
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </main>

        {/* ================= TUTOR INCOMING POPUP MODAL (ONLY FOR TUTORS) ================= */}
        {role === "tutor" && incomingJob && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center p-3 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  ⚡ New Student Request
                </span>
                <span className="text-[11px] font-bold text-amber-600">45s remaining</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-[10px] text-slate-400">Payout</span>
                  <p className="text-2xl font-black text-emerald-600">₹{incomingJob.payout}</p>
                </div>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded-lg border border-slate-200">
                  📍 {incomingJob.distance}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p><strong>Student:</strong> {incomingJob.studentName}</p>
                <p><strong>Phone:</strong> {incomingJob.studentPhone}</p>
                <p><strong>Subject:</strong> {incomingJob.subject}</p>
                <p className="text-slate-500 text-[11px]">{incomingJob.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setIncomingJob(null)}
                  className="py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Reject ✕
                </button>
                <button
                  onClick={() => {
                    setActiveJob({ ...incomingJob, status: "navigating" });
                    setIncomingJob(null);
                  }}
                  className="py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md"
                >
                  Accept Job ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= BOTTOM NAVIGATION ================= */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 flex justify-between items-center z-40 text-slate-400">
          <button
            onClick={() => setActiveBottomNav("home")}
            className={`flex flex-col items-center gap-0.5 ${activeBottomNav === "home" ? "text-blue-600" : ""}`}
          >
            <span className="text-base">🏠</span>
            <span className="text-[10px] font-black">Home</span>
          </button>
          <button
            onClick={() => setActiveBottomNav("history")}
            className={`flex flex-col items-center gap-0.5 ${activeBottomNav === "history" ? "text-blue-600" : ""}`}
          >
            <span className="text-base">🕒</span>
            <span className="text-[10px] font-bold">History</span>
          </button>
          <button
            onClick={() => setActiveBottomNav("wallet")}
            className={`flex flex-col items-center gap-0.5 ${activeBottomNav === "wallet" ? "text-blue-600" : ""}`}
          >
            <span className="text-base">💳</span>
            <span className="text-[10px] font-bold">Wallet</span>
          </button>
          <button
            onClick={() => setActiveBottomNav("profile")}
            className={`flex flex-col items-center gap-0.5 ${activeBottomNav === "profile" ? "text-blue-600" : ""}`}
          >
            <span className="text-base">👤</span>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}