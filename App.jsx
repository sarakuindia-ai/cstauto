import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from "recharts";

// ─── HARDCODED DATA ────────────────────────────────────────────────────────────

const BRANDS = ["GAC Motor","JAC Motors","Maxus","LeapMotor","Suzuki","Subaru","Jaecoo"];
const BRANCHES = ["Ipoh HQ","Kota Damansara"];
const STAGES = ["New Lead","Contacted","Test Drive","Proposal","Negotiation","Closed Won","Closed Lost"];

const SALES_TEAM = [
  { id:1, name:"Ahmad Fadzli",   branch:"Ipoh HQ",         avatar:"AF", target:8,  closed:6,  calls:42, tours:14, color:"#3b82f6" },
  { id:2, name:"Nurul Ain",      branch:"Ipoh HQ",         avatar:"NA", target:7,  closed:7,  calls:38, tours:18, color:"#10b981" },
  { id:3, name:"Kevin Tan",      branch:"Kota Damansara",  avatar:"KT", target:9,  closed:5,  calls:55, tours:11, color:"#f59e0b" },
  { id:4, name:"Priya Nair",     branch:"Kota Damansara",  avatar:"PN", target:6,  closed:6,  calls:31, tours:16, color:"#8b5cf6" },
  { id:5, name:"Hafiz Zulkifli", branch:"Ipoh HQ",         avatar:"HZ", target:8,  closed:3,  calls:22, tours:8,  color:"#ef4444" },
  { id:6, name:"Siti Rahimah",   branch:"Kota Damansara",  avatar:"SR", target:7,  closed:8,  calls:47, tours:20, color:"#06b6d4" },
];

const LEADS = [
  { id:1,  name:"Lim Wei Jian",       phone:"+60123456789", email:"lim.weijian@gmail.com",   source:"Facebook",   brand:"Suzuki",    model:"Swift",        stage:"Negotiation",  assigned:1, created:"2025-06-01", lastContact:"2025-06-10", value:85000,  notes:"Interested in Sport variant. Trade-in possible.",  followUp:"2025-06-14" },
  { id:2,  name:"Rashidah Binti Omar", phone:"+60198765432", email:"rashidah.omar@yahoo.com", source:"Walk-in",    brand:"GAC Motor", model:"GS8",          stage:"Test Drive",   assigned:2, created:"2025-06-03", lastContact:"2025-06-11", value:185000, notes:"Looking for family SUV. Comparing with Honda CR-V.", followUp:"2025-06-13" },
  { id:3,  name:"Daniel Fernandez",   phone:"+60112345678", email:"daniel.f@outlook.com",     source:"Instagram",  brand:"LeapMotor", model:"C10",          stage:"Proposal",     assigned:3, created:"2025-06-05", lastContact:"2025-06-09", value:145000, notes:"Very interested in EV. Price sensitive.",           followUp:"2025-06-15" },
  { id:4,  name:"Azizul Hakim",       phone:"+60134567890", email:"azizul.h@gmail.com",       source:"WhatsApp",   brand:"Maxus",     model:"T90",          stage:"Contacted",    assigned:4, created:"2025-06-06", lastContact:"2025-06-08", value:120000, notes:"Needs pickup truck for business.",                  followUp:"2025-06-12" },
  { id:5,  name:"Tan Mei Ling",       phone:"+60167890123", email:"tanmei.ling@gmail.com",    source:"Website",    brand:"Subaru",    model:"Forester",     stage:"New Lead",     assigned:5, created:"2025-06-07", lastContact:"2025-06-07", value:168000, notes:"First contact. Requested brochure.",                followUp:"2025-06-13" },
  { id:6,  name:"Mohd Izzat",         phone:"+60145678901", email:"izzat.m@hotmail.com",      source:"Referral",   brand:"JAC Motors",model:"JS6",          stage:"Closed Won",   assigned:6, created:"2025-05-20", lastContact:"2025-06-01", value:110000, notes:"Deal closed! Delivery scheduled June 20.",          followUp:null },
  { id:7,  name:"Kavitha Rajan",      phone:"+60156789012", email:"kavitha.r@gmail.com",      source:"Facebook",   brand:"Jaecoo",    model:"J7",           stage:"Proposal",     assigned:1, created:"2025-06-02", lastContact:"2025-06-10", value:138000, notes:"Comparing Jaecoo J7 vs Proton X70.",                followUp:"2025-06-14" },
  { id:8,  name:"Farouk Abdullah",    phone:"+60178901234", email:"farouk.ab@gmail.com",      source:"Walk-in",    brand:"Suzuki",    model:"Ertiga",       stage:"Test Drive",   assigned:2, created:"2025-06-04", lastContact:"2025-06-11", value:82000,  notes:"Family MPV. Budget conscious.",                     followUp:"2025-06-12" },
  { id:9,  name:"Grace Loh",          phone:"+60189012345", email:"grace.loh@company.com",    source:"LinkedIn",   brand:"GAC Motor", model:"Aion S",       stage:"Negotiation",  assigned:3, created:"2025-05-28", lastContact:"2025-06-09", value:128000, notes:"Corporate fleet enquiry x3 units.",                 followUp:"2025-06-13" },
  { id:10, name:"Hafiz Ismail",       phone:"+60190123456", email:"hafiz.is@gmail.com",       source:"WhatsApp",   brand:"LeapMotor", model:"T03",          stage:"Closed Lost",  assigned:5, created:"2025-05-15", lastContact:"2025-05-30", value:88000,  notes:"Went with Perodua EV instead.",                     followUp:null },
  { id:11, name:"Norlina Hamid",      phone:"+60111234567", email:"norlina.h@gmail.com",      source:"Instagram",  brand:"Maxus",     model:"D90 Pro",      stage:"Contacted",    assigned:6, created:"2025-06-08", lastContact:"2025-06-10", value:195000, notes:"High-end SUV buyer. VIP treatment required.",       followUp:"2025-06-14" },
  { id:12, name:"Jason Wong",         phone:"+60122345678", email:"jason.w@startup.io",       source:"Website",    brand:"Subaru",    model:"Outback",      stage:"New Lead",     assigned:4, created:"2025-06-09", lastContact:"2025-06-09", value:175000, notes:"New lead from website enquiry form.",               followUp:"2025-06-15" },
];

const MESSAGES = [
  { id:1,  lead:1,  channel:"Facebook",   content:"Hi, I saw your ad for the Suzuki Swift. What colours are available?",                        time:"10:32 AM", inbound:true,  read:false, date:"Today" },
  { id:2,  lead:1,  channel:"Facebook",   content:"We have 5 colours: Pearl White, Metallic Black, Burning Red, Cafe Grey & Prime Blue! Which is your preference?", time:"10:45 AM", inbound:false, read:true,  date:"Today" },
  { id:3,  lead:3,  channel:"Instagram",  content:"Is the LeapMotor C10 available for test drive this weekend?",                                time:"9:15 AM",  inbound:true,  read:false, date:"Today" },
  { id:4,  lead:4,  channel:"WhatsApp",   content:"What is the downpayment for Maxus T90?",                                                     time:"2:00 PM",  inbound:true,  read:false, date:"Today" },
  { id:5,  lead:7,  channel:"Facebook",   content:"Can you compare Jaecoo J7 and Proton X70 specs?",                                            time:"Yesterday",inbound:true,  read:true,  date:"Yesterday" },
  { id:6,  lead:9,  channel:"WhatsApp",   content:"We are looking for 3 units for our company fleet. Can we get corporate pricing?",            time:"11:00 AM", inbound:true,  read:true,  date:"Yesterday" },
  { id:7,  lead:11, channel:"Instagram",  content:"Love the D90 Pro! Is there a test drive slot this Saturday at Kota Damansara?",              time:"3:45 PM",  inbound:true,  read:false, date:"Today" },
  { id:8,  lead:2,  channel:"WhatsApp",   content:"The GS8 test drive was great! Can you send me the full pricing with loan simulation?",      time:"4:30 PM",  inbound:true,  read:false, date:"Today" },
];

const ACTIVITIES = [
  { id:1, type:"Call",      salesperson:1, lead:1,  note:"Discussed Swift Sport. Customer interested, needs financing info.",    time:"10:00 AM", date:"Today" },
  { id:2, type:"Test Drive",salesperson:2, lead:2,  note:"GS8 test drive completed. Very positive feedback.",                    time:"2:30 PM",  date:"Today" },
  { id:3, type:"Proposal",  salesperson:3, lead:3,  note:"Sent C10 EV proposal with 5yr warranty package.",                     time:"11:00 AM", date:"Today" },
  { id:4, type:"Follow-up", salesperson:4, lead:4,  note:"Reminded about T90 financing offer. Customer to decide by Friday.",   time:"9:00 AM",  date:"Today" },
  { id:5, type:"Deal Won",  salesperson:6, lead:6,  note:"JS6 deal closed at RM110k. Delivery June 20th.",                      time:"3:00 PM",  date:"Yesterday" },
  { id:6, type:"Call",      salesperson:5, lead:5,  note:"First contact with Tan Mei Ling. Sent Forester brochure via email.",  time:"10:45 AM", date:"Yesterday" },
  { id:7, type:"Message",   salesperson:1, lead:7,  note:"Replied to Facebook DM. Shared J7 vs X70 comparison sheet.",         time:"1:00 PM",  date:"Yesterday" },
];

const REMINDERS = [
  { id:1, lead:4,  salesperson:4, note:"Follow up on T90 decision",         dueDate:"Today",     urgent:true  },
  { id:2, lead:8,  salesperson:2, note:"Send loan simulation for Ertiga",   dueDate:"Today",     urgent:true  },
  { id:3, lead:1,  salesperson:1, note:"Call back after brochure review",   dueDate:"Tomorrow",  urgent:false },
  { id:4, lead:5,  salesperson:5, note:"Check if Tan received brochure",    dueDate:"Tomorrow",  urgent:false },
  { id:5, lead:11, salesperson:6, note:"VIP test drive booking confirmation",dueDate:"Today",     urgent:true  },
  { id:6, lead:9,  salesperson:3, note:"Send fleet discount proposal",      dueDate:"Tomorrow",  urgent:false },
];

const MONTHLY_SALES = [
  { month:"Jan", Ipoh:4,  KD:3,  revenue:612000  },
  { month:"Feb", Ipoh:5,  KD:4,  revenue:791000  },
  { month:"Mar", Ipoh:6,  KD:5,  revenue:955000  },
  { month:"Apr", Ipoh:4,  KD:6,  revenue:870000  },
  { month:"May", Ipoh:7,  KD:5,  revenue:1050000 },
  { month:"Jun", Ipoh:5,  KD:6,  revenue:980000  },
];

const BRAND_DIST = [
  { name:"Suzuki",    value:8,  color:"#3b82f6" },
  { name:"GAC Motor", value:6,  color:"#10b981" },
  { name:"Maxus",     value:5,  color:"#f59e0b" },
  { name:"LeapMotor", value:7,  color:"#8b5cf6" },
  { name:"Subaru",    value:4,  color:"#ef4444" },
  { name:"JAC Motors",value:5,  color:"#06b6d4" },
  { name:"Jaecoo",    value:3,  color:"#f97316" },
];

const PIPELINE_DATA = [
  { stage:"New Lead",    count:2,  value:343000  },
  { stage:"Contacted",   count:2,  value:315000  },
  { stage:"Test Drive",  count:2,  value:267000  },
  { stage:"Proposal",    count:2,  value:283000  },
  { stage:"Negotiation", count:2,  value:313000  },
  { stage:"Closed Won",  count:1,  value:110000  },
  { stage:"Closed Lost", count:1,  value:88000   },
];

const AI_INSIGHTS = [
  { icon:"🤖", title:"Lead Scoring Alert",      body:"Rashidah Omar (GS8) shows 87% close probability. Recommend priority follow-up within 24h.",        type:"high"   },
  { icon:"📊", title:"Churn Risk Detected",     body:"Hafiz Ismail (T03) has been unresponsive for 12 days. Suggest re-engagement campaign.",              type:"medium" },
  { icon:"💡", title:"Best Time to Call",       body:"Data shows leads convert 3x more when called between 10–11am on weekdays.",                          type:"info"   },
  { icon:"🎯", title:"Upsell Opportunity",      body:"Grace Loh (Fleet) may qualify for extended warranty bundle — potential +RM18,000 revenue.",          type:"high"   },
  { icon:"🔔", title:"Follow-up Overdue x3",    body:"Ahmad Fadzli has 3 leads with overdue follow-ups. Reassign or auto-remind now.",                      type:"medium" },
  { icon:"📈", title:"Top Performer",           body:"Siti Rahimah has exceeded her monthly target by 14%. Recommend bonus trigger.",                       type:"success"},
];

const STAGE_COLORS = {
  "New Lead":"#94a3b8","Contacted":"#3b82f6","Test Drive":"#f59e0b",
  "Proposal":"#8b5cf6","Negotiation":"#f97316","Closed Won":"#10b981","Closed Lost":"#ef4444"
};
const SOURCE_ICONS = { Facebook:"📘", Instagram:"📷", WhatsApp:"💬", "Walk-in":"🚶", Website:"🌐", Referral:"🤝", LinkedIn:"💼" };
const CHANNEL_COLORS = { Facebook:"#1877f2", Instagram:"#e1306c", WhatsApp:"#25d366" };

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const Avatar = ({ initials, color, size=32 }) => (
  <div style={{
    width:size, height:size, borderRadius:"50%", background:color||"#334155",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.35, fontWeight:700, color:"#fff", flexShrink:0,
    fontFamily:"'DM Sans', sans-serif"
  }}>{initials}</div>
);

const Badge = ({ text, color }) => (
  <span style={{
    background:color+"22", color:color, border:`1px solid ${color}44`,
    padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600,
    fontFamily:"'DM Sans', sans-serif", letterSpacing:0.3
  }}>{text}</span>
);

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{
    background:"#0f172a", border:"1px solid #1e293b", borderRadius:14,
    padding:"20px 22px", flex:1, minWidth:160,
    borderLeft:`3px solid ${color}`
  }}>
    <div style={{ fontSize:22 }}>{icon}</div>
    <div style={{ fontSize:28, fontWeight:800, color:"#f1f5f9", marginTop:8, fontFamily:"'DM Mono', monospace" }}>{value}</div>
    <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{label}</div>
    {sub && <div style={{ fontSize:11, color:color, marginTop:4 }}>{sub}</div>}
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function CSTAutoCRM() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [notification, setNotification] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isTypingAI, setIsTypingAI] = useState(false);
  const [filterStage, setFilterStage] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");

  const showNotif = (msg) => { setNotification(msg); setTimeout(()=>setNotification(null),3000); };

  const sendReply = () => {
    if (!replyText.trim()) return;
    const newMsg = {
      id: messages.length+1, lead: activeMessage?.lead,
      channel: activeMessage?.channel, content: replyText,
      time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
      inbound: false, read: true, date:"Today"
    };
    setMessages(prev => [...prev, newMsg]);
    setReplyText("");
    showNotif("✅ Reply sent via " + activeMessage?.channel);
  };

  const generateAISuggestion = () => {
    setIsTypingAI(true);
    setAiSuggestion("");
    const suggestions = [
      "Hi! Thank you for your interest in the Suzuki Swift. We currently have a 0% interest promotion for 5 years. Would you like to schedule a test drive this weekend?",
      "Hello! The LeapMotor C10 is available for test drive this Saturday and Sunday. We have morning (10am) and afternoon (2pm) slots. Which works better for you?",
      "Hi! For the Maxus T90, our current best offer is RM5,000 cashback with RM15,000 downpayment on a 9-year loan. Shall I send you the full loan simulation?",
    ];
    const text = suggestions[Math.floor(Math.random()*suggestions.length)];
    let i = 0;
    const interval = setInterval(() => {
      setAiSuggestion(text.slice(0, i+1));
      i++;
      if (i >= text.length) { clearInterval(interval); setIsTypingAI(false); }
    }, 18);
  };

  const filteredLeads = LEADS.filter(l =>
    (filterStage === "All" || l.stage === filterStage) &&
    (filterBrand === "All" || l.brand === filterBrand)
  );

  const tabs = [
    { id:"dashboard",  label:"Dashboard",   icon:"📊" },
    { id:"leads",      label:"Leads & CRM", icon:"👥" },
    { id:"pipeline",   label:"Pipeline",    icon:"🔄" },
    { id:"messages",   label:"Messages",    icon:"💬", badge: messages.filter(m=>m.inbound&&!m.read).length },
    { id:"team",       label:"Team",        icon:"🏆" },
    { id:"reminders",  label:"Reminders",   icon:"🔔", badge: REMINDERS.filter(r=>r.urgent).length },
    { id:"ai",         label:"AI Insights", icon:"🤖" },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#020617", minHeight:"100vh", color:"#e2e8f0" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:9999,
          background:"#10b981", color:"#fff", padding:"12px 20px",
          borderRadius:10, fontWeight:600, fontSize:13,
          boxShadow:"0 4px 20px rgba(16,185,129,0.4)",
          animation:"slideIn 0.3s ease"
        }}>{notification}</div>
      )}

      {/* Sidebar */}
      <div style={{
        position:"fixed", left:0, top:0, bottom:0, width:220,
        background:"#0a0f1e", borderRight:"1px solid #1e293b",
        display:"flex", flexDirection:"column", zIndex:100
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid #1e293b" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:38, height:38, background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
              borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, fontWeight:800
            }}>C</div>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:"#f1f5f9", letterSpacing:0.5 }}>CST AUTO</div>
              <div style={{ fontSize:10, color:"#64748b", fontFamily:"'DM Mono', monospace" }}>CRM PORTAL</div>
            </div>
          </div>
          <div style={{ marginTop:10, fontSize:10, color:"#475569", lineHeight:1.5 }}>
            📍 Ipoh HQ · Kota Damansara
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
          {tabs.map(tab => (
            <div key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                borderRadius:9, marginBottom:4, cursor:"pointer",
                background: activeTab===tab.id ? "linear-gradient(135deg,#1e3a5f,#1e2a4f)" : "transparent",
                color: activeTab===tab.id ? "#60a5fa" : "#94a3b8",
                borderLeft: activeTab===tab.id ? "2px solid #3b82f6" : "2px solid transparent",
                transition:"all 0.2s", fontWeight: activeTab===tab.id ? 700 : 500,
                fontSize:13, position:"relative"
              }}>
              <span style={{ fontSize:15 }}>{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && (
                <span style={{
                  marginLeft:"auto", background:"#ef4444", color:"#fff",
                  borderRadius:20, fontSize:10, padding:"1px 7px", fontWeight:700
                }}>{tab.badge}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Brands */}
        <div style={{ padding:"12px 16px", borderTop:"1px solid #1e293b" }}>
          <div style={{ fontSize:10, color:"#475569", marginBottom:8, letterSpacing:1 }}>AUTHORIZED BRANDS</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {BRANDS.map(b => (
              <span key={b} style={{
                fontSize:9, background:"#1e293b", color:"#64748b",
                padding:"2px 6px", borderRadius:4
              }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft:220, minHeight:"100vh" }}>
        {/* Header */}
        <div style={{
          padding:"16px 28px", borderBottom:"1px solid #1e293b",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"#020617", position:"sticky", top:0, zIndex:50
        }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"#f1f5f9" }}>
              {tabs.find(t=>t.id===activeTab)?.icon} {tabs.find(t=>t.id===activeTab)?.label}
            </div>
            <div style={{ fontSize:12, color:"#475569" }}>
              {new Date().toLocaleDateString("en-MY",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:12, color:"#64748b", background:"#0f172a", padding:"6px 14px", borderRadius:8, border:"1px solid #1e293b" }}>
              🟢 6 agents online
            </div>
            <Avatar initials="AD" color="#3b82f6" size={36}/>
          </div>
        </div>

        <div style={{ padding:"24px 28px" }}>

          {/* ── DASHBOARD ── */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stats Row */}
              <div style={{ display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" }}>
                <StatCard icon="🎯" label="Total Leads" value={LEADS.length} sub="+3 this week" color="#3b82f6"/>
                <StatCard icon="✅" label="Closed Won" value={LEADS.filter(l=>l.stage==="Closed Won").length} sub="This month" color="#10b981"/>
                <StatCard icon="💰" label="Pipeline Value" value="RM 1.82M" sub="Active deals" color="#f59e0b"/>
                <StatCard icon="📱" label="Unread Messages" value={messages.filter(m=>m.inbound&&!m.read).length} sub="Across all channels" color="#8b5cf6"/>
                <StatCard icon="⏰" label="Follow-ups Due" value={REMINDERS.filter(r=>r.urgent).length} sub="Urgent today" color="#ef4444"/>
                <StatCard icon="🚗" label="Test Drives" value="4" sub="Scheduled this week" color="#06b6d4"/>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
                {/* Monthly Revenue */}
                <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, padding:20 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", marginBottom:16 }}>📈 Monthly Revenue (2025)</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={MONTHLY_SALES}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                      <XAxis dataKey="month" stroke="#475569" fontSize={11}/>
                      <YAxis stroke="#475569" fontSize={10} tickFormatter={v=>"RM"+(v/1000)+"k"}/>
                      <Tooltip formatter={(v)=>"RM "+v.toLocaleString()} contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,color:"#e2e8f0"}}/>
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#rev)" strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Branch Sales */}
                <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, padding:20 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", marginBottom:16 }}>🏢 Branch Performance (Units Sold)</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={MONTHLY_SALES}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                      <XAxis dataKey="month" stroke="#475569" fontSize={11}/>
                      <YAxis stroke="#475569" fontSize={11}/>
                      <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,color:"#e2e8f0"}}/>
                      <Legend/>
                      <Bar dataKey="Ipoh" fill="#3b82f6" radius={[4,4,0,0]}/>
                      <Bar dataKey="KD" fill="#8b5cf6" radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
                {/* Brand Distribution */}
                <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, padding:20 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", marginBottom:16 }}>🚗 Sales by Brand</div>
                  <div style={{ display:"flex", gap:10 }}>
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie data={BRAND_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                          {BRAND_DIST.map((b,i) => <Cell key={i} fill={b.color}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,color:"#e2e8f0"}}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, justifyContent:"center" }}>
                      {BRAND_DIST.map(b => (
                        <div key={b.name} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12 }}>
                          <div style={{ width:10, height:10, borderRadius:2, background:b.color, flexShrink:0 }}/>
                          <span style={{ color:"#94a3b8", flex:1 }}>{b.name}</span>
                          <span style={{ color:"#f1f5f9", fontWeight:700, fontFamily:"'DM Mono', monospace" }}>{b.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, padding:20 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", marginBottom:16 }}>⚡ Recent Activity</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {ACTIVITIES.slice(0,5).map(a => {
                      const sp = SALES_TEAM.find(s=>s.id===a.salesperson);
                      const lead = LEADS.find(l=>l.id===a.lead);
                      return (
                        <div key={a.id} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                          <Avatar initials={sp?.avatar} color={sp?.color} size={28}/>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:12, color:"#f1f5f9", fontWeight:600 }}>
                              {sp?.name} · <span style={{ color:"#64748b", fontWeight:400 }}>{a.type}</span>
                            </div>
                            <div style={{ fontSize:11, color:"#475569", marginTop:1 }}>{a.note.slice(0,60)}...</div>
                          </div>
                          <div style={{ fontSize:10, color:"#475569", whiteSpace:"nowrap" }}>{a.time}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AI Quick Insights Banner */}
              <div style={{ background:"linear-gradient(135deg,#1e1b4b,#0f172a)", border:"1px solid #3730a3", borderRadius:14, padding:20 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#a5b4fc", marginBottom:12 }}>🤖 AI Highlights for Today</div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  {AI_INSIGHTS.slice(0,3).map(i => (
                    <div key={i.title} style={{
                      flex:1, minWidth:200, background:"#0f172a", border:"1px solid #1e293b",
                      borderRadius:10, padding:"12px 14px"
                    }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", marginBottom:4 }}>{i.icon} {i.title}</div>
                      <div style={{ fontSize:11, color:"#64748b", lineHeight:1.5 }}>{i.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LEADS ── */}
          {activeTab === "leads" && (
            <div>
              {/* Filters */}
              <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ fontSize:12, color:"#94a3b8", alignSelf:"center" }}>Stage:</span>
                  {["All",...STAGES].map(s => (
                    <button key={s} onClick={()=>setFilterStage(s)} style={{
                      padding:"5px 12px", borderRadius:20, border:"1px solid",
                      borderColor: filterStage===s ? "#3b82f6" : "#1e293b",
                      background: filterStage===s ? "#1e3a5f" : "#0f172a",
                      color: filterStage===s ? "#60a5fa" : "#64748b",
                      fontSize:11, cursor:"pointer", fontWeight:600
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Leads Table */}
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid #1e293b" }}>
                      {["Lead","Source","Brand / Model","Stage","Assigned To","Value","Follow-up","Actions"].map(h => (
                        <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"#475569", fontWeight:600, letterSpacing:0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, idx) => {
                      const sp = SALES_TEAM.find(s=>s.id===lead.assigned);
                      const isOverdue = lead.followUp === "2025-06-12";
                      return (
                        <tr key={lead.id} style={{
                          borderBottom:"1px solid #0f1929",
                          background: idx%2===0 ? "#0f172a" : "#0a0f1e",
                          transition:"background 0.1s"
                        }}>
                          <td style={{ padding:"12px 16px" }}>
                            <div style={{ fontWeight:600, fontSize:13, color:"#f1f5f9" }}>{lead.name}</div>
                            <div style={{ fontSize:11, color:"#475569" }}>{lead.phone}</div>
                          </td>
                          <td style={{ padding:"12px 16px", fontSize:13 }}>
                            {SOURCE_ICONS[lead.source]} {lead.source}
                          </td>
                          <td style={{ padding:"12px 16px" }}>
                            <div style={{ fontSize:12, fontWeight:600, color:"#e2e8f0" }}>{lead.brand}</div>
                            <div style={{ fontSize:11, color:"#64748b" }}>{lead.model}</div>
                          </td>
                          <td style={{ padding:"12px 16px" }}>
                            <Badge text={lead.stage} color={STAGE_COLORS[lead.stage]}/>
                          </td>
                          <td style={{ padding:"12px 16px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                              <Avatar initials={sp?.avatar} color={sp?.color} size={24}/>
                              <span style={{ fontSize:12, color:"#94a3b8" }}>{sp?.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:"12px 16px", fontFamily:"'DM Mono', monospace", fontSize:12, color:"#f59e0b" }}>
                            RM {lead.value.toLocaleString()}
                          </td>
                          <td style={{ padding:"12px 16px", fontSize:11 }}>
                            {lead.followUp ? (
                              <span style={{ color: isOverdue ? "#ef4444" : "#10b981" }}>
                                {isOverdue ? "🔴" : "🟢"} {lead.followUp}
                              </span>
                            ) : <span style={{ color:"#475569" }}>—</span>}
                          </td>
                          <td style={{ padding:"12px 16px" }}>
                            <div style={{ display:"flex", gap:6 }}>
                              <button onClick={()=>setSelectedLead(lead)} style={{
                                padding:"4px 10px", borderRadius:6, border:"1px solid #1e293b",
                                background:"#1e293b", color:"#94a3b8", fontSize:11, cursor:"pointer"
                              }}>View</button>
                              <button onClick={()=>showNotif("📞 Calling " + lead.name)} style={{
                                padding:"4px 10px", borderRadius:6, border:"none",
                                background:"#1e3a5f", color:"#60a5fa", fontSize:11, cursor:"pointer"
                              }}>Call</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Lead Detail Modal */}
              {selectedLead && (
                <div style={{
                  position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200,
                  display:"flex", alignItems:"center", justifyContent:"center"
                }} onClick={()=>setSelectedLead(null)}>
                  <div style={{
                    background:"#0f172a", border:"1px solid #1e293b", borderRadius:16,
                    padding:28, width:520, maxHeight:"80vh", overflowY:"auto"
                  }} onClick={e=>e.stopPropagation()}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                      <div>
                        <div style={{ fontSize:18, fontWeight:800, color:"#f1f5f9" }}>{selectedLead.name}</div>
                        <div style={{ fontSize:12, color:"#64748b" }}>{selectedLead.phone} · {selectedLead.email}</div>
                      </div>
                      <Badge text={selectedLead.stage} color={STAGE_COLORS[selectedLead.stage]}/>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                      {[
                        ["Brand", selectedLead.brand],["Model", selectedLead.model],
                        ["Source", SOURCE_ICONS[selectedLead.source]+" "+selectedLead.source],
                        ["Value", "RM "+selectedLead.value.toLocaleString()],
                        ["Created", selectedLead.created],["Last Contact", selectedLead.lastContact],
                      ].map(([k,v]) => (
                        <div key={k} style={{ background:"#020617", borderRadius:8, padding:"10px 14px" }}>
                          <div style={{ fontSize:10, color:"#475569", marginBottom:2 }}>{k}</div>
                          <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:"#020617", borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
                      <div style={{ fontSize:10, color:"#475569", marginBottom:4 }}>Notes</div>
                      <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.6 }}>{selectedLead.notes}</div>
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      {["Move to Next Stage","Schedule Follow-up","Send Proposal","Mark Won"].map(action => (
                        <button key={action} onClick={()=>{ showNotif("✅ "+action); setSelectedLead(null); }} style={{
                          flex:1, padding:"8px 4px", borderRadius:8, border:"1px solid #1e293b",
                          background:"#1e293b", color:"#94a3b8", fontSize:11, cursor:"pointer", fontWeight:600
                        }}>{action}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── PIPELINE ── */}
          {activeTab === "pipeline" && (
            <div>
              <div style={{ display:"flex", gap:12, marginBottom:24, overflowX:"auto" }}>
                {PIPELINE_DATA.map(stage => {
                  const stageLeads = LEADS.filter(l=>l.stage===stage.stage);
                  return (
                    <div key={stage.stage} style={{
                      minWidth:200, background:"#0f172a", border:"1px solid #1e293b",
                      borderRadius:12, overflow:"hidden", flexShrink:0
                    }}>
                      <div style={{
                        padding:"10px 14px", borderBottom:"1px solid #1e293b",
                        background: STAGE_COLORS[stage.stage]+"18",
                        borderTop:`3px solid ${STAGE_COLORS[stage.stage]}`
                      }}>
                        <div style={{ fontSize:12, fontWeight:700, color:STAGE_COLORS[stage.stage] }}>{stage.stage}</div>
                        <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>
                          {stageLeads.length} leads · RM {(stageLeads.reduce((a,l)=>a+l.value,0)/1000).toFixed(0)}k
                        </div>
                      </div>
                      <div style={{ padding:10, display:"flex", flexDirection:"column", gap:8, minHeight:120 }}>
                        {stageLeads.map(lead => {
                          const sp = SALES_TEAM.find(s=>s.id===lead.assigned);
                          return (
                            <div key={lead.id} style={{
                              background:"#020617", borderRadius:8, padding:"10px 12px",
                              border:"1px solid #1e293b", cursor:"pointer"
                            }} onClick={()=>{ setSelectedLead(lead); setActiveTab("leads"); }}>
                              <div style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }}>{lead.name}</div>
                              <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{lead.brand} {lead.model}</div>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:6 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                                  <Avatar initials={sp?.avatar} color={sp?.color} size={18}/>
                                  <span style={{ fontSize:10, color:"#475569" }}>{sp?.name.split(" ")[0]}</span>
                                </div>
                                <span style={{ fontSize:11, color:"#f59e0b", fontFamily:"'DM Mono', monospace" }}>
                                  RM{(lead.value/1000).toFixed(0)}k
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pipeline Bar Chart */}
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, padding:20 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", marginBottom:16 }}>Pipeline Value by Stage</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={PIPELINE_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false}/>
                    <XAxis type="number" stroke="#475569" fontSize={10} tickFormatter={v=>"RM"+(v/1000)+"k"}/>
                    <YAxis dataKey="stage" type="category" stroke="#475569" fontSize={10} width={100}/>
                    <Tooltip formatter={v=>"RM "+v.toLocaleString()} contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,color:"#e2e8f0"}}/>
                    <Bar dataKey="value" radius={[0,6,6,0]}>
                      {PIPELINE_DATA.map((d,i)=><Cell key={i} fill={STAGE_COLORS[d.stage]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {activeTab === "messages" && (
            <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:20, height:"calc(100vh - 140px)" }}>
              {/* Inbox */}
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column" }}>
                <div style={{ padding:"14px 16px", borderBottom:"1px solid #1e293b", fontSize:13, fontWeight:700, color:"#f1f5f9" }}>
                  📥 Inbox · {messages.filter(m=>m.inbound&&!m.read).length} unread
                </div>
                <div style={{ overflowY:"auto", flex:1 }}>
                  {LEADS.filter(l => messages.some(m=>m.lead===l.id&&m.inbound)).map(lead => {
                    const lastMsg = [...messages].filter(m=>m.lead===lead.id).pop();
                    const unread = messages.filter(m=>m.lead===lead.id&&m.inbound&&!m.read).length;
                    return (
                      <div key={lead.id} onClick={()=>setActiveMessage(lastMsg)}
                        style={{
                          padding:"12px 16px", borderBottom:"1px solid #0f1929", cursor:"pointer",
                          background: activeMessage?.lead===lead.id ? "#0f1929" : "transparent",
                          display:"flex", gap:10
                        }}>
                        <div style={{ position:"relative" }}>
                          <div style={{
                            width:36, height:36, borderRadius:"50%",
                            background: CHANNEL_COLORS[lastMsg?.channel]+"33",
                            border:`1.5px solid ${CHANNEL_COLORS[lastMsg?.channel]}66`,
                            display:"flex", alignItems:"center", justifyContent:"center", fontSize:16
                          }}>
                            {lastMsg?.channel==="Facebook"?"📘":lastMsg?.channel==="Instagram"?"📷":"💬"}
                          </div>
                          {unread>0 && <div style={{
                            position:"absolute", top:-3, right:-3, width:16, height:16,
                            background:"#ef4444", borderRadius:"50%", fontSize:9,
                            display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700
                          }}>{unread}</div>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <span style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }}>{lead.name}</span>
                            <span style={{ fontSize:10, color:"#475569" }}>{lastMsg?.time}</span>
                          </div>
                          <div style={{ fontSize:11, color:"#64748b", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                            {lastMsg?.content}
                          </div>
                          <div style={{ marginTop:4 }}>
                            <span style={{
                              fontSize:9, padding:"1px 6px", borderRadius:4,
                              background: CHANNEL_COLORS[lastMsg?.channel]+"22",
                              color: CHANNEL_COLORS[lastMsg?.channel], fontWeight:600
                            }}>{lastMsg?.channel}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat View */}
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                {activeMessage ? (() => {
                  const lead = LEADS.find(l=>l.id===activeMessage.lead);
                  const convo = messages.filter(m=>m.lead===activeMessage.lead);
                  return (
                    <>
                      <div style={{ padding:"14px 20px", borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:40, height:40, borderRadius:"50%", background:"#1e293b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                          {activeMessage.channel==="Facebook"?"📘":activeMessage.channel==="Instagram"?"📷":"💬"}
                        </div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9" }}>{lead?.name}</div>
                          <div style={{ fontSize:11, color:"#64748b" }}>via {activeMessage.channel} · {lead?.brand} {lead?.model}</div>
                        </div>
                        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                          <Badge text={lead?.stage||""} color={STAGE_COLORS[lead?.stage||"New Lead"]}/>
                          <button onClick={()=>showNotif("📂 Lead profile opened")} style={{ padding:"6px 12px", borderRadius:8, border:"1px solid #1e293b", background:"#1e293b", color:"#94a3b8", fontSize:11, cursor:"pointer" }}>View Lead</button>
                        </div>
                      </div>

                      <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:12 }}>
                        {convo.map(msg => (
                          <div key={msg.id} style={{ display:"flex", justifyContent: msg.inbound ? "flex-start" : "flex-end" }}>
                            <div style={{
                              maxWidth:"75%", padding:"10px 14px", borderRadius:12,
                              background: msg.inbound ? "#1e293b" : "linear-gradient(135deg,#1e3a5f,#1e2a4f)",
                              border:`1px solid ${msg.inbound ? "#334155" : "#3b82f644"}`,
                              color:"#e2e8f0", fontSize:13, lineHeight:1.5
                            }}>
                              {msg.content}
                              <div style={{ fontSize:10, color:"#64748b", marginTop:4, textAlign:msg.inbound?"left":"right" }}>{msg.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* AI Suggestion */}
                      {aiSuggestion && (
                        <div style={{ margin:"0 20px", padding:"12px 14px", background:"#1e1b4b", borderRadius:10, border:"1px solid #3730a3", fontSize:12, color:"#a5b4fc", lineHeight:1.5, marginBottom:8 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:"#818cf8" }}>🤖 AI Suggested Reply:</span>
                          <div style={{ marginTop:4 }}>{aiSuggestion}{isTypingAI && <span style={{ animation:"blink 1s infinite" }}>▋</span>}</div>
                          {!isTypingAI && <button onClick={()=>{ setReplyText(aiSuggestion); setAiSuggestion(""); }} style={{
                            marginTop:8, padding:"4px 12px", borderRadius:6, border:"none",
                            background:"#3730a3", color:"#c7d2fe", fontSize:11, cursor:"pointer", fontWeight:600
                          }}>Use this reply</button>}
                        </div>
                      )}

                      <div style={{ padding:"12px 20px", borderTop:"1px solid #1e293b", display:"flex", gap:10, alignItems:"flex-end" }}>
                        <textarea
                          value={replyText}
                          onChange={e=>setReplyText(e.target.value)}
                          placeholder={`Reply via ${activeMessage.channel}...`}
                          rows={2}
                          style={{
                            flex:1, background:"#0a0f1e", border:"1px solid #1e293b", borderRadius:10,
                            padding:"10px 14px", color:"#e2e8f0", fontSize:13, resize:"none",
                            fontFamily:"'DM Sans', sans-serif", outline:"none"
                          }}
                        />
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <button onClick={generateAISuggestion} style={{
                            padding:"8px 14px", borderRadius:8, border:"1px solid #3730a3",
                            background:"#1e1b4b", color:"#a5b4fc", fontSize:12, cursor:"pointer", fontWeight:600
                          }}>🤖 AI Reply</button>
                          <button onClick={sendReply} style={{
                            padding:"8px 14px", borderRadius:8, border:"none",
                            background:"linear-gradient(135deg,#2563eb,#7c3aed)",
                            color:"#fff", fontSize:12, cursor:"pointer", fontWeight:700
                          }}>Send ➤</button>
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:"#475569" }}>
                    <div style={{ fontSize:40 }}>💬</div>
                    <div style={{ fontSize:14 }}>Select a conversation to start replying</div>
                    <div style={{ fontSize:12, color:"#334155" }}>Connected: WhatsApp · Facebook · Instagram</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TEAM ── */}
          {activeTab === "team" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:24 }}>
                {SALES_TEAM.map(sp => {
                  const pct = Math.round((sp.closed/sp.target)*100);
                  const teamLeads = LEADS.filter(l=>l.assigned===sp.id);
                  return (
                    <div key={sp.id} style={{
                      background:"#0f172a", border:"1px solid #1e293b",
                      borderTop:`3px solid ${sp.color}`, borderRadius:14, padding:20
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                        <Avatar initials={sp.avatar} color={sp.color} size={44}/>
                        <div>
                          <div style={{ fontSize:14, fontWeight:800, color:"#f1f5f9" }}>{sp.name}</div>
                          <div style={{ fontSize:11, color:"#64748b" }}>📍 {sp.branch}</div>
                        </div>
                        {pct >= 100 && <span style={{ marginLeft:"auto", fontSize:16 }}>🏆</span>}
                      </div>
                      <div style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#64748b", marginBottom:5 }}>
                          <span>Monthly Target</span>
                          <span style={{ color:sp.color, fontWeight:700 }}>{sp.closed}/{sp.target} units · {pct}%</span>
                        </div>
                        <div style={{ height:6, background:"#1e293b", borderRadius:99 }}>
                          <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background:sp.color, borderRadius:99, transition:"width 0.6s ease" }}/>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                        {[["Calls",sp.calls],["Test Drives",sp.tours],["Active Leads",teamLeads.filter(l=>!["Closed Won","Closed Lost"].includes(l.stage)).length]].map(([k,v])=>(
                          <div key={k} style={{ background:"#020617", borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                            <div style={{ fontSize:18, fontWeight:800, color:"#f1f5f9", fontFamily:"'DM Mono', monospace" }}>{v}</div>
                            <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>{k}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Leaderboard */}
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, padding:20 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", marginBottom:16 }}>🏆 Sales Leaderboard — June 2025</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[...SALES_TEAM].sort((a,b)=>b.closed-a.closed).map((sp,idx) => (
                    <div key={sp.id} style={{
                      display:"flex", alignItems:"center", gap:14,
                      padding:"12px 16px", borderRadius:10,
                      background: idx===0 ? "linear-gradient(135deg,#1a1400,#0f172a)" : "#020617",
                      border:`1px solid ${idx===0?"#f59e0b44":"#1e293b"}`
                    }}>
                      <div style={{
                        width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center",
                        justifyContent:"center", fontWeight:800, fontSize:13,
                        background: idx===0?"#f59e0b":idx===1?"#94a3b8":idx===2?"#cd7f32":"#1e293b",
                        color: idx<3?"#000":"#475569"
                      }}>{idx+1}</div>
                      <Avatar initials={sp.avatar} color={sp.color} size={32}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#f1f5f9" }}>{sp.name}</div>
                        <div style={{ fontSize:11, color:"#64748b" }}>{sp.branch}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:18, fontWeight:800, color:sp.color, fontFamily:"'DM Mono', monospace" }}>{sp.closed}</div>
                        <div style={{ fontSize:10, color:"#475569" }}>units sold</div>
                      </div>
                      <div style={{ width:80, height:6, background:"#1e293b", borderRadius:99 }}>
                        <div style={{ height:"100%", width:`${(sp.closed/8)*100}%`, background:sp.color, borderRadius:99 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── REMINDERS ── */}
          {activeTab === "reminders" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#ef4444", marginBottom:12 }}>🔴 Urgent — Due Today</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {REMINDERS.filter(r=>r.urgent).map(r => {
                      const lead = LEADS.find(l=>l.id===r.lead);
                      const sp = SALES_TEAM.find(s=>s.id===r.salesperson);
                      return (
                        <div key={r.id} style={{
                          background:"#0f172a", border:"1px solid #ef444433",
                          borderLeft:"3px solid #ef4444", borderRadius:10, padding:"14px 16px"
                        }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                            <span style={{ fontSize:13, fontWeight:700, color:"#f1f5f9" }}>{lead?.name}</span>
                            <Badge text="Urgent" color="#ef4444"/>
                          </div>
                          <div style={{ fontSize:12, color:"#94a3b8", marginBottom:8 }}>{r.note}</div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"space-between" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <Avatar initials={sp?.avatar} color={sp?.color} size={20}/>
                              <span style={{ fontSize:11, color:"#64748b" }}>{sp?.name}</span>
                            </div>
                            <div style={{ display:"flex", gap:6 }}>
                              <button onClick={()=>showNotif("✅ Reminder marked done")} style={{
                                padding:"4px 10px", borderRadius:6, border:"none",
                                background:"#10b981", color:"#fff", fontSize:11, cursor:"pointer", fontWeight:600
                              }}>Done</button>
                              <button onClick={()=>showNotif("📅 Snoozed for 1 hour")} style={{
                                padding:"4px 10px", borderRadius:6, border:"1px solid #1e293b",
                                background:"#1e293b", color:"#94a3b8", fontSize:11, cursor:"pointer"
                              }}>Snooze</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#f59e0b", marginBottom:12 }}>🟡 Upcoming — Tomorrow</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {REMINDERS.filter(r=>!r.urgent).map(r => {
                      const lead = LEADS.find(l=>l.id===r.lead);
                      const sp = SALES_TEAM.find(s=>s.id===r.salesperson);
                      return (
                        <div key={r.id} style={{
                          background:"#0f172a", border:"1px solid #1e293b",
                          borderLeft:"3px solid #f59e0b", borderRadius:10, padding:"14px 16px"
                        }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                            <span style={{ fontSize:13, fontWeight:700, color:"#f1f5f9" }}>{lead?.name}</span>
                            <Badge text="Tomorrow" color="#f59e0b"/>
                          </div>
                          <div style={{ fontSize:12, color:"#94a3b8", marginBottom:8 }}>{r.note}</div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <Avatar initials={sp?.avatar} color={sp?.color} size={20}/>
                            <span style={{ fontSize:11, color:"#64748b" }}>{sp?.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── AI INSIGHTS ── */}
          {activeTab === "ai" && (
            <div>
              <div style={{
                background:"linear-gradient(135deg,#1e1b4b,#0f172a)", border:"1px solid #3730a3",
                borderRadius:14, padding:"20px 24px", marginBottom:24
              }}>
                <div style={{ fontSize:16, fontWeight:800, color:"#a5b4fc", marginBottom:4 }}>🤖 AI Sales Intelligence</div>
                <div style={{ fontSize:13, color:"#64748b" }}>
                  Powered by predictive analytics · Real-time lead scoring · Automated follow-up recommendations
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
                {AI_INSIGHTS.map(i => (
                  <div key={i.title} style={{
                    background:"#0f172a", border:`1px solid ${
                      i.type==="high"?"#ef444444":i.type==="success"?"#10b98144":i.type==="medium"?"#f59e0b44":"#1e293b"
                    }`,
                    borderLeft:`3px solid ${
                      i.type==="high"?"#ef4444":i.type==="success"?"#10b981":i.type==="medium"?"#f59e0b":"#3b82f6"
                    }`,
                    borderRadius:12, padding:"16px 18px"
                  }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", marginBottom:6 }}>{i.icon} {i.title}</div>
                    <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{i.body}</div>
                    <button onClick={()=>showNotif("🤖 AI action initiated: "+i.title)} style={{
                      marginTop:12, padding:"6px 14px", borderRadius:8, border:"none",
                      background:"#1e293b", color:"#94a3b8", fontSize:11, cursor:"pointer", fontWeight:600
                    }}>Take Action →</button>
                  </div>
                ))}
              </div>

              {/* Use Cases */}
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, padding:24 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", marginBottom:16 }}>🚀 AI Use Case Roadmap for CST Auto Group</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                  {[
                    { phase:"Phase 1 · Now", items:["Lead scoring & priority queue","Best-time-to-call prediction","Overdue follow-up alerts","Auto-classify inbound messages"] },
                    { phase:"Phase 2 · Soon", items:["AI chatbot for WhatsApp/FB/IG","Deal win probability forecast","Churn risk detection","Personalized email/SMS drafts"] },
                    { phase:"Phase 3 · Future", items:["Dynamic pricing suggestions","Inventory demand forecasting","Customer lifetime value model","Voice-to-CRM call logging"] },
                  ].map(p => (
                    <div key={p.phase} style={{ background:"#020617", borderRadius:10, padding:16 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#60a5fa", marginBottom:10 }}>{p.phase}</div>
                      {p.items.map(item => (
                        <div key={item} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ color:"#10b981", marginTop:1 }}>✓</span>
                          <span style={{ fontSize:12, color:"#94a3b8", lineHeight:1.4 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }
        @keyframes slideIn { from { transform: translateX(100px); opacity:0; } to { transform: translateX(0); opacity:1; } }
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        button:hover { filter: brightness(1.15); }
        tr:hover td { background: #0a0f1e !important; }
      `}</style>
    </div>
  );
}
