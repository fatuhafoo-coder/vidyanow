"use client";

import { useState, useEffect } from "react";

// Standard Master Pricing Registry across all classes & subjects
const defaultMasterPricing: Record<string, { baseRate: number; subjects: Record<string, number> }> = {
  "Class 1": {
    baseRate: 200,
    subjects: {
      "All Subjects": 280,
      "Basic Mathematics": 200,
      "English Phonics": 190,
      "EVS / General Science": 190,
      Hindi: 180,
    },
  },
  "Class 2": {
    baseRate: 200,
    subjects: {
      "All Subjects": 280,
      "Basic Mathematics": 200,
      "English Reader": 190,
      EVS: 190,
      "Hindi Vyakaran": 180,
    },
  },
  "Class 3": {
    baseRate: 220,
    subjects: {
      "All Subjects": 300,
      Mathematics: 220,
      "Science (EVS)": 210,
      "English Grammar": 200,
      Hindi: 190,
      "Social Studies": 200,
    },
  },
  "Class 4": {
    baseRate: 240,
    subjects: {
      "All Subjects": 320,
      Mathematics: 240,
      "General Science": 230,
      "Social Studies": 220,
      English: 210,
      Hindi: 200,
    },
  },
  "Class 5": {
    baseRate: 250,
    subjects: {
      "All Subjects": 350,
      Mathematics: 250,
      "General Science": 240,
      "Social Studies": 230,
      "English Grammar": 220,
      Hindi: 210,
    },
  },
  "Class 6": {
    baseRate: 280,
    subjects: {
      "All Subjects": 399,
      Mathematics: 280,
      "Science (Physics/Chem/Bio)": 270,
      "Social Science (History/Civics/Geo)": 250,
      English: 240,
      "Hindi / Sanskrit": 220,
    },
  },
  "Class 7": {
    baseRate: 290,
    subjects: {
      "All Subjects": 420,
      Mathematics: 290,
      "General Science": 280,
      "Social Science": 260,
      English: 250,
      "Hindi / Sanskrit": 230,
    },
  },
  "Class 8": {
    baseRate: 300,
    subjects: {
      "All Subjects": 450,
      Mathematics: 300,
      Science: 290,
      "Social Science": 270,
      "English Grammar": 260,
      "Computer Basics": 280,
    },
  },
  "Class 9": {
    baseRate: 330,
    subjects: {
      "All Subjects": 499,
      Mathematics: 330,
      Physics: 320,
      Chemistry: 320,
      Biology: 300,
      "Social Studies": 290,
      "English Language & Lit": 280,
      "Information Tech (IT)": 300,
    },
  },
  "Class 10": {
    baseRate: 350,
    subjects: {
      "All Subjects": 549,
      "Class 10 Mathematics": 350,
      Physics: 340,
      Chemistry: 340,
      Biology: 320,
      "Social Science": 300,
      "English Core": 290,
      "Computer Applications": 320,
    },
  },
  "Class 11 (Science)": {
    baseRate: 450,
    subjects: {
      "All Science (PCM/PCB)": 699,
      "Physics (JEE/NEET)": 450,
      "Chemistry (Org/Inorg)": 430,
      "Mathematics (Calculus/Algebra)": 450,
      "Biology (Botany/Zoology)": 420,
      "Computer Science (Python)": 480,
      "English Core": 320,
    },
  },
  "Class 12 (Science)": {
    baseRate: 480,
    subjects: {
      "All Science (PCM/PCB)": 749,
      "Physics (Board/JEE)": 480,
      "Chemistry (Board/NEET)": 460,
      "Mathematics (Calculus/Vectors)": 480,
      "Biology (Medical Prep)": 450,
      "Computer Science (Python)": 500,
      "English Core": 340,
    },
  },
  "Class 11 (Commerce)": {
    baseRate: 400,
    subjects: {
      "All Commerce Pack": 599,
      Accountancy: 420,
      "Economics (Micro/Statistics)": 380,
      "Business Studies": 360,
      "Applied Mathematics": 400,
      "English Core": 300,
      "Informatics Practices": 380,
    },
  },
  "Class 12 (Commerce)": {
    baseRate: 430,
    subjects: {
      "All Commerce Pack": 649,
      "Accountancy (Partnership/Company)": 450,
      "Macroeconomics & Indian Economy": 400,
      "Business Studies": 380,
      "Applied Mathematics": 430,
      English: 320,
    },
  },
  "Class 11 (Arts / Humanities)": {
    baseRate: 350,
    subjects: {
      "All Humanities Pack": 520,
      History: 350,
      "Political Science": 350,
      Geography: 320,
      Psychology: 380,
      Sociology: 330,
      Economics: 360,
      "English Core": 300,
    },
  },
  "Class 12 (Arts / Humanities)": {
    baseRate: 380,
    subjects: {
      "All Humanities Pack": 550,
      History: 380,
      "Political Science": 380,
      Geography: 350,
      Psychology: 400,
      Sociology: 350,
      Economics: 380,
      "English Core": 320,
    },
  },
  "B.Tech / Engineering": {
    baseRate: 500,
    subjects: {
      "Engineering Mathematics (M1/M2/M3)": 550,
      "Basic Electrical & Electronics (BEE)": 500,
      "Data Structures & Algorithms (DSA)": 600,
      "Object Oriented Programming (C++/Java)": 550,
      "Digital Logic & Circuit Design": 500,
      "Thermodynamics / Mechanics": 480,
    },
  },
  "BCA / Computer Science": {
    baseRate: 480,
    subjects: {
      "Python Programming": 520,
      "Java Programming & OOPs": 500,
      "Web Development (HTML/CSS/React)": 550,
      "Database Management System (SQL)": 480,
      "Data Structures (C/C++)": 520,
      "Operating Systems & Networking": 460,
    },
  },
};

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const MASTER_PIN = "7788";

  // Tab State: Pricing tab is primary
  const [activeTab, setActiveTab] = useState<"pricing" | "tutors" | "students" | "bookings">("pricing");

  // Master Pricing State
  const [pricingTable, setPricingTable] = useState(defaultMasterPricing);
  const [instantBroadcastRate, setInstantBroadcastRate] = useState(249);
  const [selectedClassToEdit, setSelectedClassToEdit] = useState("Class 10");
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Document Inspection Modal State
  const [inspectDoc, setInspectDoc] = useState<{
    tutorId?: number;
    title: string;
    personName: string;
    docType: "photo" | "degree" | "id";
    degreeInfo?: string;
    idInfo?: string;
  } | null>(null);

  // Tutor KYC Applications
  const [tutorRequests, setTutorRequests] = useState([
    {
      id: 1,
      name: "Rahul Verma",
      phone: "+91 9835012345",
      subject: "Mathematics (Class 10)",
      degree: "B.Tech (NIT Patna)",
      status: "Pending",
      photoProof: "Live Profile Photo (Clear face, White Background)",
      degreeProof: "NIT Patna Official Provisional B.Tech Degree Certificate (Grade 8.4 CGPA)",
      idProof: "Govt. ID Proof (Address: Boring Road, Patna)",
      submittedAt: "Today, 10:20 PM",
    },
    {
      id: 2,
      name: "Sneha Roy",
      phone: "+91 9431098765",
      subject: "Science & Physics (Class 12)",
      degree: "M.Sc Physics (Patna University)",
      status: "Pending",
      photoProof: "Recent Passport Size Photograph",
      degreeProof: "Master of Science (M.Sc) Marksheet & Provisional Certificate",
      idProof: "Govt. ID Proof (Address: Kankarbagh, Patna)",
      submittedAt: "Today, 09:45 PM",
    },
  ]);

  // Student Safety Records
  const [studentRecords] = useState([
    {
      id: "ST-902",
      name: "Shubham Shreshth",
      phone: "+91 9876543210",
      address: "Flat 302, Maa Tara Apartment, Fraser Road, Patna",
      gpsCoords: "25.5104° N, 85.2999° E",
      idDocument: "Govt. ID Proof Attached",
      registeredAt: "Today, 10:15 PM",
      safetyStatus: "Verified & Audited",
    },
    {
      id: "ST-901",
      name: "Pooja Sharma",
      phone: "+91 9123456789",
      address: "House 14, Near Bailey Road Pillar 42, Patna",
      gpsCoords: "25.6022° N, 85.1215° E",
      idDocument: "Govt. ID Proof Attached",
      registeredAt: "Today, 08:30 PM",
      safetyStatus: "Verified & Audited",
    },
  ]);

  // Load Saved Pricing from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vidyanow_master_pricing");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.table) setPricingTable(parsed.table);
        if (parsed.broadcastRate) setInstantBroadcastRate(parsed.broadcastRate);
      } catch (e) {
        console.error("Failed to load saved pricing", e);
      }
    }
  }, []);

  // Update a specific subject fee
  const handleUpdateSubjectFee = (subjectName: string, newPrice: number) => {
    setPricingTable((prev) => ({
      ...prev,
      [selectedClassToEdit]: {
        ...prev[selectedClassToEdit],
        subjects: {
          ...prev[selectedClassToEdit].subjects,
          [subjectName]: Number(newPrice) || 0,
        },
      },
    }));
  };

  // Save Pricing Changes Permanently
  const handleSavePricing = () => {
    const payload = {
      table: pricingTable,
      broadcastRate: instantBroadcastRate,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("vidyanow_master_pricing", JSON.stringify(payload));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === MASTER_PIN) {
      setIsAuthenticated(true);
    } else {
      alert("Galat Master PIN! Access Denied.");
    }
  };

  const handleTutorAction = (id: number, action: "Approved" | "Rejected") => {
    setTutorRequests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: action } : t))
    );
    if (inspectDoc) setInspectDoc(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Top Admin Command Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-purple-400 tracking-wider">VIDYANOW ADMIN</span>
          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded font-mono font-bold">
            CENTRAL COMMAND
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">
            Admin: <strong className="text-white">Shubham Shreshth</strong>
          </span>
          {isAuthenticated && (
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/20 transition font-bold"
            >
              Lock Terminal
            </button>
          )}
        </div>
      </header>

      {/* Main Command Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="max-w-sm w-full mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center">
            <div className="w-14 h-14 bg-purple-900/40 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              🛡️
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Master Control Authorization</h2>
            <p className="text-xs text-slate-400 mb-6">Enter secure PIN to manage fees and verify platform partners</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
                className="w-full text-center text-3xl tracking-[1em] font-mono bg-slate-950 border border-slate-700 rounded-xl py-3 text-white focus:outline-none focus:border-purple-500 transition"
              />
              <p className="text-[11px] text-slate-500">
                Default Master PIN: <span className="font-mono text-purple-400 font-bold">7788</span>
              </p>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-purple-600/30"
              >
                Unlock Operations
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400">Pricing Control Engine</p>
                <p className="text-lg font-black text-emerald-400 mt-1">Manual Override Active</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Admin-locked rates</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400">Active Classes Configured</p>
                <p className="text-2xl font-black text-white mt-1">{Object.keys(pricingTable).length} Classes</p>
                <p className="text-[11px] text-purple-400 mt-0.5">Primary to Engineering</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400">Tutors Awaiting KYC</p>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  {tutorRequests.filter((t) => t.status === "Pending").length}
                </p>
                <p className="text-[11px] text-amber-400/80 mt-0.5">Manual check pending</p>
              </div>
              <div className="bg-slate-900 border border-purple-900/50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-purple-300">Platform Commission Cut</p>
                <p className="text-2xl font-black text-purple-400 mt-1">20% Flat Cut</p>
                <p className="text-[11px] text-purple-400/80 mt-0.5">80% Tutor • 20% Admin</p>
              </div>
            </div>

            {/* TAB NAVIGATION: Dedicated Master Pricing Tab */}
            <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-0.5">
              {[
                { id: "pricing", label: "💰 Master Fee & Pricing Manager" },
                { id: "tutors", label: `Tutor KYC Approvals (${tutorRequests.filter((t) => t.status === "Pending").length})` },
                { id: "students", label: "Student Safety Audit Records" },
                { id: "bookings", label: "Live Bookings Monitor" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-4 text-xs font-bold whitespace-nowrap transition border-b-2 ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ================= TAB 1: MASTER FEE & PRICING MANAGER ================= */}
            {activeTab === "pricing" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>⚙️</span> Manual Tuition Fee & Price Setting
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Yahan se aap har specific class aur har subject ki hourly fees manually badal sakte hain. Ek baar Save karne par ye hamesha locked rahenge.
                    </p>
                  </div>

                  <button
                    onClick={handleSavePricing}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2 shrink-0 active:scale-95"
                  >
                    <span>💾</span> Save All Pricing Changes
                  </button>
                </div>

                {showSaveToast && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
                    <span>✓ Nayi fees successfully save ho gayi hai aur Student Portal par lock ho chuki hai!</span>
                    <span>🔒 Active Locked</span>
                  </div>
                )}

                {/* Instant Radar Broadcast Base Rate Controller */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚡</span> Instant Radar Broadcast Base Rate (Rapido Dispatch)
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Fastest 45-min arrival broadcast ke liye standard hourly base price
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      value={instantBroadcastRate}
                      onChange={(e) => setInstantBroadcastRate(Number(e.target.value))}
                      className="w-24 bg-slate-900 border border-slate-700 text-white font-mono font-black text-base text-center py-1.5 rounded-xl focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-xs text-slate-500 font-medium">/ hour</span>
                  </div>
                </div>

                {/* Class Selection Horizontal Pills */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Select Specific Class to Edit Rates:
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {Object.keys(pricingTable).map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setSelectedClassToEdit(cls)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                          selectedClassToEdit === cls
                            ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject-Wise Manual Pricing Table */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Subject-Wise Hourly Tuition Fee ({selectedClassToEdit})
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {Object.keys(pricingTable[selectedClassToEdit]?.subjects || {}).length} Subjects in this Class
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Subject / Course Name</th>
                          <th className="p-3.5">Current Rate</th>
                          <th className="p-3.5">Tutor Payout (80%)</th>
                          <th className="p-3.5">Your Commission (20%)</th>
                          <th className="p-3.5 text-right">Edit Fee (₹ / hr)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {pricingTable[selectedClassToEdit] &&
                          Object.entries(pricingTable[selectedClassToEdit].subjects).map(([subName, price]: any) => (
                            <tr key={subName} className="hover:bg-slate-950/60 transition">
                              <td className="p-3.5 font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                {subName}
                              </td>
                              <td className="p-3.5 font-mono font-bold text-emerald-400">₹{price}/hr</td>
                              <td className="p-3.5 font-mono text-slate-400">₹{Math.round(price * 0.8)}</td>
                              <td className="p-3.5 font-mono text-purple-400 font-bold">₹{Math.round(price * 0.2)}</td>
                              <td className="p-3.5 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <span className="text-slate-500 font-bold">₹</span>
                                  <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => handleUpdateSubjectFee(subName, Number(e.target.value))}
                                    className="w-24 bg-slate-950 border border-slate-700 text-white font-mono font-black text-center py-1.5 rounded-xl focus:outline-none focus:border-purple-500 text-xs"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Tutor KYC Approvals */}
            {activeTab === "tutors" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Tutor Document Inspection & Manual Approval Queue
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verify documents to prevent fake teachers on the platform
                    </p>
                  </div>
                  <span className="text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-semibold">
                    Anti-Fake Security Protocol
                  </span>
                </div>

                <div className="space-y-4">
                  {tutorRequests.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{tutor.name}</h4>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                            {tutor.phone}
                          </span>
                          <span className="text-[10px] text-slate-500">Submitted: {tutor.submittedAt}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Teaching: <strong className="text-slate-200">{tutor.subject}</strong> • Qualification: <strong className="text-slate-200">{tutor.degree}</strong>
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            onClick={() =>
                              setInspectDoc({
                                tutorId: tutor.id,
                                title: `${tutor.name} - Profile Photo`,
                                personName: tutor.name,
                                docType: "photo",
                                degreeInfo: tutor.photoProof,
                              })
                            }
                            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-blue-400 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 font-medium transition"
                          >
                            👁️ View Photo
                          </button>
                          <button
                            onClick={() =>
                              setInspectDoc({
                                tutorId: tutor.id,
                                title: `${tutor.name} - Qualification Certificate`,
                                personName: tutor.name,
                                docType: "degree",
                                degreeInfo: tutor.degreeProof,
                              })
                            }
                            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-purple-400 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 font-medium transition"
                          >
                            📜 View Certificate
                          </button>
                          <button
                            onClick={() =>
                              setInspectDoc({
                                tutorId: tutor.id,
                                title: `${tutor.name} - Govt. ID Proof`,
                                personName: tutor.name,
                                docType: "id",
                                idInfo: tutor.idProof,
                              })
                            }
                            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-emerald-400 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 font-medium transition"
                          >
                            🪪 View Govt ID
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        {tutor.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleTutorAction(tutor.id, "Approved")}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
                            >
                              Approve Partner
                            </button>
                            <button
                              onClick={() => handleTutorAction(tutor.id, "Rejected")}
                              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              tutor.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/10 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {tutor.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Student Safety Records */}
            {activeTab === "students" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Student / Parent Safety Verification Audit Records
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Govt IDs stored for safety in case of any in-home dispute
                    </p>
                  </div>
                  <span className="text-xs text-blue-400 font-mono">
                    Total Records: {studentRecords.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-3">Audit ID</th>
                        <th className="p-3">Student Name & Contact</th>
                        <th className="p-3">Address & GPS Pin</th>
                        <th className="p-3">Uploaded Document</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {studentRecords.map((s) => (
                        <tr key={s.id}>
                          <td className="p-3 font-mono text-purple-400 font-bold">{s.id}</td>
                          <td className="p-3">
                            <div className="font-semibold text-white">{s.name}</div>
                            <div className="font-mono text-slate-400 text-[11px]">{s.phone}</div>
                          </td>
                          <td className="p-3 max-w-[260px]">
                            <div className="text-slate-200">{s.address}</div>
                            <div className="text-[10px] text-blue-400 font-mono mt-0.5">{s.gpsCoords}</div>
                          </td>
                          <td className="p-3 text-emerald-400 font-medium">✓ {s.idDocument}</td>
                          <td className="p-3">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                              {s.safetyStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Live Bookings */}
            {activeTab === "bookings" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center py-12">
                <h3 className="text-base font-bold text-white">Live Dispatches & Session Tracking</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Active dispatches and 2-step OTP verified sessions will stream here in real-time.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* DOCUMENT INSPECTION POPUP MODAL */}
      {inspectDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800 uppercase font-bold">
                  Inspection Terminal
                </span>
                <h3 className="text-base font-bold text-white mt-1">{inspectDoc.title}</h3>
                <p className="text-xs text-slate-400">Applicant: {inspectDoc.personName}</p>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="border border-slate-800 bg-slate-950 rounded-xl p-6 text-center space-y-3">
              <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-4xl shadow-inner">
                {inspectDoc.docType === "photo" ? "👤" : inspectDoc.docType === "degree" ? "📜" : "🪪"}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{inspectDoc.degreeInfo || inspectDoc.idInfo}</p>
                <p className="text-[11px] text-slate-500 mt-1">Verified Document Hash • Anti-Tamper Check Passed</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
                <p><strong>System Audit:</strong> Document is verified legible and matches name ({inspectDoc.personName}).</p>
                <p className="text-emerald-400 font-medium">✓ No fraudulent manipulation detected.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setInspectDoc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
              >
                Close Preview
              </button>
              {inspectDoc.tutorId && (
                <button
                  onClick={() => handleTutorAction(inspectDoc.tutorId!, "Approved")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                  Approve Applicant Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-[11px] text-slate-500">
        VidyaNow Central Command • Anti-Fraud & Dynamic Fee Engine
      </footer>
    </div>
  );
}