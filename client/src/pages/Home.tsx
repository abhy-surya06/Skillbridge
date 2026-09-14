import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Compass,
  FileCheck2,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Moon,
  MoreHorizontal,
  Network,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

type Role = "talent" | "hiring" | "academia";

type Skill = {
  id?: number;
  name: string;
  family: string;
  level: string;
  score: number;
  status: "verified" | "claimed" | "decaying";
  detail: string;
  icon: typeof Code2;
};

const skills: Skill[] = [
  {
    name: "React architecture",
    family: "Frontend engineering",
    level: "Proficient",
    score: 84,
    status: "verified",
    detail: "Challenge passed 12 days ago",
    icon: Code2,
  },
  {
    name: "Product thinking",
    family: "Product & strategy",
    level: "Working",
    score: 68,
    status: "verified",
    detail: "Challenge passed 28 days ago",
    icon: Compass,
  },
  {
    name: "TypeScript",
    family: "Frontend engineering",
    level: "Working",
    score: 62,
    status: "decaying",
    detail: "Last practiced 47 days ago",
    icon: Zap,
  },
  {
    name: "User research",
    family: "Product & strategy",
    level: "Familiar",
    score: 46,
    status: "claimed",
    detail: "Added from resume",
    icon: Users,
  },
];

const matches = [
  { company: "Northstar Labs", role: "Product engineer", score: 94, color: "coral", tag: "Strong fit", initials: "NL" },
  { company: "Hearth & Co.", role: "Frontend developer", score: 88, color: "mint", tag: "Good fit", initials: "HC" },
  { company: "Fieldwork", role: "Design technologist", score: 81, color: "lilac", tag: "Potential", initials: "FW" },
];

const institutionStats = [
  { label: "Verified skill coverage", value: "78%", delta: "+12%", accent: "blue" },
  { label: "Assessment completion", value: "64%", delta: "+8%", accent: "mint" },
  { label: "Industry readiness", value: "7.8/10", delta: "+0.6", accent: "coral" },
];

const skillIconMap: Record<string, typeof Code2> = {
  code: Code2,
  compass: Compass,
  zap: Zap,
  users: Users,
  sparkles: Sparkles,
};

function Logo() {
  return (
    <div className="brand-lockup" aria-label="SkillBridge home">
      <div className="brand-mark"><span /><span /><span /></div>
      <span>skill<span>bridge</span></span>
    </div>
  );
}

function StatusBadge({ status }: { status: Skill["status"] }) {
  const config = {
    verified: { label: "Verified", className: "badge-verified", icon: ShieldCheck },
    claimed: { label: "Claimed", className: "badge-claimed", icon: FileCheck2 },
    decaying: { label: "Needs practice", className: "badge-decaying", icon: Clock3 },
  }[status];
  const Icon = config.icon;
  return <span className={`status-badge ${config.className}`}><Icon size={12} strokeWidth={2.5} />{config.label}</span>;
}

function SkillMeter({ score, status }: { score: number; status: Skill["status"] }) {
  return (
    <div className="skill-meter" aria-label={`${score} out of 100 skill confidence`}>
      <div className={`skill-meter-fill ${status}`} style={{ width: `${score}%` }} />
      <span className="skill-meter-notch" style={{ left: `${score}%` }} />
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <article className={`skill-card ${skill.status}`}>
      <div className="skill-card-top">
        <div className={`skill-icon ${skill.status}`}><Icon size={18} /></div>
        <StatusBadge status={skill.status} />
        <button className="icon-button ghost" aria-label={`More options for ${skill.name}`}><MoreHorizontal size={17} /></button>
      </div>
      <div className="skill-card-copy">
        <p className="eyebrow">{skill.family}</p>
        <h3>{skill.name}</h3>
        <div className="skill-level-row"><span>{skill.level}</span><strong>{skill.score}%</strong></div>
        <SkillMeter score={skill.score} status={skill.status} />
        <p className="skill-detail">{skill.detail}</p>
      </div>
    </article>
  );
}

function WorkspaceInsights({ onToast, skillsData }: { onToast: (message: string) => void; skillsData: Skill[] }) {
  const verifiedCount = skillsData.filter((skill) => skill.status === "verified").length;
  const activeCount = skillsData.filter((skill) => skill.status !== "decaying").length;
  return (
    <section className="workspace-insights">
      <div className="insight-panel health-panel">
        <div className="section-heading compact"><div><p className="eyebrow">AT A GLANCE</p><h2>Skill health</h2><p>How your signal is holding up this week.</p></div><div className="health-score"><strong>84%</strong><span>healthy</span></div></div>
        <div className="health-track"><i style={{ width: "84%" }} /></div>
        <div className="health-breakdown"><div><span className="health-key blue" />Verified<strong>{verifiedCount || 2}</strong></div><div><span className="health-key mint" />Active<strong>{activeCount || 3}</strong></div><div><span className="health-key coral" />Needs practice<strong>{skillsData.filter((skill) => skill.status === "decaying").length || 1}</strong></div></div>
        <button className="text-button" onClick={() => onToast("Skill health details opened.")}>See health details <ArrowRight size={15} /></button>
      </div>
      <div className="insight-panel focus-panel">
        <div className="insight-panel-header"><div><p className="eyebrow">RECOMMENDED FOCUS</p><h2>Close your next gap</h2></div><div className="soft-icon lilac"><Target size={17} /></div></div>
        <div className="focus-item"><div className="focus-index">01</div><div><strong>Systems thinking</strong><span>Unlocks 3 more product roles</span></div><span className="focus-score">42%</span><ChevronRight size={16} /></div>
        <div className="focus-item"><div className="focus-index">02</div><div><strong>TypeScript practice</strong><span>+8% confidence within one challenge</span></div><span className="focus-score warm">62%</span><ChevronRight size={16} /></div>
        <button className="soft-action" onClick={() => onToast("Personalized learning plan opened.")}><BookOpen size={14} /> Build a 2-week plan</button>
      </div>
      <div className="insight-panel activity-panel">
        <div className="section-heading compact"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Verification trail</h2></div><button className="icon-button ghost" onClick={() => onToast("Full activity history opened.")} aria-label="View activity history"><MoreHorizontal size={18} /></button></div>
        <div className="activity-list"><div className="activity-item"><span className="activity-icon verified"><ShieldCheck size={14} /></span><div><strong>React architecture verified</strong><span>Challenge score 86 · 12 days ago</span></div><Award size={15} className="activity-award" /></div><div className="activity-item"><span className="activity-icon claimed"><FileCheck2 size={14} /></span><div><strong>User research claimed</strong><span>Added from resume · 18 days ago</span></div><span className="activity-tag">CLAIMED</span></div><div className="activity-item"><span className="activity-icon practice"><Flame size={14} /></span><div><strong>Product thinking practiced</strong><span>Challenge score 74 · 28 days ago</span></div><TrendingUp size={15} className="activity-trend" /></div></div>
      </div>
    </section>
  );
}

function CoursesSection({ onToast }: { onToast: (message: string) => void }) {
  const courses = [
    { title: "Systems thinking for builders", meta: "4 lessons · 2h 15m", progress: 42, accent: "blue", icon: Network, label: "Recommended next" },
    { title: "TypeScript patterns in practice", meta: "6 lessons · 3h 40m", progress: 68, accent: "coral", icon: Code2, label: "In progress" },
    { title: "Product discovery studio", meta: "8 lessons · 5h 10m", progress: 100, accent: "mint", icon: Compass, label: "Completed" },
  ];
  return (
    <section className="section-block courses-section">
      <div className="section-heading"><div><p className="eyebrow">YOUR LEARNING PATH</p><h2>Courses</h2><p>Short, practical learning loops that strengthen your verified signal.</p></div><button className="text-button" onClick={() => onToast("Course library opened.")}>Browse course library <ChevronRight size={16} /></button></div>
      <div className="course-summary"><div className="course-summary-copy"><div className="soft-icon blue"><GraduationCap size={17} /></div><div><strong>Keep your momentum</strong><span>2 courses active · 3h 12m this week</span></div></div><div className="course-week"><span>WEEKLY GOAL</span><strong>3 / 4 sessions</strong><div><i style={{ width: "75%" }} /></div></div><button className="primary-button small" onClick={() => onToast("Your next lesson is ready.")}>Continue learning <ArrowRight size={15} /></button></div>
      <div className="courses-grid">{courses.map((course) => { const Icon = course.icon; return <article className="course-card" key={course.title}><div className={`course-art ${course.accent}`}><Icon size={22} /><span>{course.label}</span></div><div className="course-copy"><h3>{course.title}</h3><p>{course.meta}</p><div className="course-progress-row"><span>{course.progress === 100 ? "Complete" : `${course.progress}% complete`}</span><strong>{course.progress}%</strong></div><div className="course-progress"><i style={{ width: `${course.progress}%` }} /></div><button className="text-button" onClick={() => onToast(`${course.progress === 100 ? "Reviewing" : "Opening"} ${course.title}.`)}>{course.progress === 100 ? "Review course" : "Open course"}<ArrowRight size={14} /></button></div></article>; })}</div>
    </section>
  );
}

function RingChart({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 100 100" className="ring-chart" role="img" aria-label={`${value}% ${label}`}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="9" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bridge-blue)" strokeWidth="9" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 50 50)" />
      </svg>
      <div className="ring-label"><strong>{value}%</strong><span>{label}</span></div>
    </div>
  );
}

function AppNav({ role, setRole, darkMode, setDarkMode, onToast }: { role: Role; setRole: (role: Role) => void; darkMode: boolean; setDarkMode: (value: boolean) => void; onToast: (message: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleLabels = { talent: "Student", hiring: "Hiring", academia: "Academia" };
  return (
    <aside className={`app-rail ${mobileOpen ? "open" : ""}`}>
      <div className="rail-top">
        <Logo />
        <button className="mobile-close icon-button ghost" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
      </div>
      <div className="role-switcher">
        <span className="switcher-label">VIEW AS</span>
        <button className="role-trigger"><span className={`role-dot ${role}`} />{roleLabels[role]}<ChevronDown size={14} /></button>
        <div className="role-options">
          {(Object.keys(roleLabels) as Role[]).map((item) => (
            <button key={item} className={role === item ? "active" : ""} onClick={() => { setRole(item); setMobileOpen(false); }}><span className={`role-dot ${item}`} />{roleLabels[item]} {role === item && <Check size={14} />}</button>
          ))}
        </div>
      </div>
      <nav className="primary-nav" aria-label="Primary navigation">
        <span className="nav-label">WORKSPACE</span>
        {[
          { label: "Overview", icon: LayoutDashboard },
          { label: role === "talent" ? "My skill graph" : role === "hiring" ? "Intelligent search" : "Cohort pulse", icon: Network },
          { label: role === "talent" ? "Courses" : role === "hiring" ? "Shortlists" : "Curriculum map", icon: role === "talent" ? GraduationCap : BookOpen },
          { label: role === "talent" ? "Opportunities" : "Assessments", icon: role === "talent" ? BriefcaseBusiness : Target },
        ].map(({ label, icon: Icon }, index) => <button key={label} className={`nav-item ${index === 0 ? "active" : ""}`} onClick={() => onToast(`${label} is ready for your next session.`)}><Icon size={17} />{label}{index === 0 && <span className="nav-pip" />}</button>)}
        <span className="nav-label second">ACCOUNT</span>
        <button className="nav-item" onClick={() => onToast("Settings are coming to your workspace soon.")}><Settings2 size={17} />Settings</button>
        <button className="nav-item" onClick={() => onToast("Help center opened in a new workspace.")}><CircleHelp size={17} />Help center</button>
      </nav>
      <div className="rail-bottom">
        <div className="rail-promo">
          <div className="promo-icon"><Sparkles size={15} /></div>
          <div><strong>Bridge one more gap</strong><span>Take a 12 min challenge</span></div>
          <button onClick={() => onToast("Assessment queue opened.")} aria-label="Start assessment"><ArrowRight size={16} /></button>
        </div>
        <div className="profile-chip">
          <div className="avatar avatar-sage">AR</div>
          <div><strong>Amelia Reed</strong><span>Student profile</span></div>
          <button className="icon-button ghost" aria-label="Open profile menu"><MoreHorizontal size={17} /></button>
        </div>
      </div>
      <button className="mobile-nav-trigger icon-button ghost" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
    </aside>
  );
}

function TopBar({ role, darkMode, setDarkMode, onToast, isAuthenticated, onLogin }: { role: Role; darkMode: boolean; setDarkMode: (value: boolean) => void; onToast: (message: string) => void; isAuthenticated: boolean; onLogin: () => void }) {
  const headings = { talent: ["Good morning, Amelia", "Your profile is gaining signal."], hiring: ["Good morning, Rowan", "Find the signal behind the resume."], academia: ["Good morning, Dr. Chen", "A clearer read on learner readiness."] };
  return (
    <header className="topbar">
      <div className="mobile-brand"><Logo /></div>
      <div><p className="date-line">MONDAY, SEPTEMBER 14, 2026 <span className="live-dot" /> LIVE PROFILE</p><h1>{headings[role][0]}</h1><p className="topbar-subtitle">{headings[role][1]}</p></div>
      <div className="top-actions">
        <button className="icon-button" onClick={() => onToast("Search is ready. Try 'React architecture'.")} aria-label="Search"><Search size={18} /></button>
        <button className="icon-button notification" onClick={() => onToast("You have 3 new updates.")} aria-label="Notifications"><Bell size={18} /><i /></button>
        <button className="icon-button theme-button" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? "Use light theme" : "Use dark theme"}>{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button>
        {!isAuthenticated && <button className="primary-button small save-login" onClick={onLogin}>Sign in to save</button>}
        <button className="top-profile" onClick={() => onToast("Profile menu opened.")}><span className="avatar avatar-sage">AR</span><ChevronDown size={15} /></button>
      </div>
    </header>
  );
}

function TalentView({ onToast, skillsData, onChallenge }: { onToast: (message: string) => void; skillsData: Skill[]; onChallenge: (skillId?: number) => void }) {
  const [showAll, setShowAll] = useState(false);
  const visibleSkills = showAll ? skillsData : skillsData.slice(0, 3);
  return (
    <>
      <section className="hero-grid">
        <div className="hero-panel dark-panel">
          <div className="panel-kicker"><span className="kicker-line" /> PROFILE MOMENTUM</div>
          <div className="hero-panel-main"><div><p className="hero-number">72<span>/100</span></p><p className="hero-caption">Verified potential score</p></div><RingChart value={72} label="signal" /></div>
          <div className="momentum-track"><span style={{ width: "72%" }} /></div>
          <div className="hero-foot"><span><TrendingUp size={14} /> +6 this month</span><span>Top 18% of your cohort</span></div>
          <div className="panel-decoration"><span /><span /><span /><span /><span /></div>
        </div>
        <div className="next-action-card">
          <div className="action-card-head"><div className="soft-icon coral"><Flame size={17} /></div><span className="action-label">NEXT BEST ACTION</span><span className="action-time"><Clock3 size={13} /> 12 min</span></div>
          <h2>Make TypeScript active again.</h2>
          <p>Your confidence dipped 8% since your last practice. A short challenge can bring it back.</p>
          <div className="action-progress"><div><span>Current signal</span><strong>62%</strong></div><SkillMeter score={62} status="decaying" /></div>
          <button className="primary-button" onClick={() => onChallenge(skillsData.find((skill) => skill.name === "TypeScript")?.id)}>Start challenge <ArrowRight size={16} /></button>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">YOUR SIGNAL MAP</p><h2>Skill graph</h2><p>Capability that compounds with every real attempt.</p></div><button className="text-button" onClick={() => setShowAll(!showAll)}>{showAll ? "Show less" : "View all skills"}<ChevronRight size={16} /></button></div>
        <div className="skills-grid">{visibleSkills.map((skill) => <SkillCard key={skill.name} skill={skill} />)}<button className="add-skill-card" onClick={() => onToast("Choose a skill family to add to your graph.")}><span><Sparkles size={19} /></span><strong>Bridge a new gap</strong><small>Add a skill to verify</small><ArrowRight size={16} /></button></div>
      </section>

      <WorkspaceInsights onToast={onToast} skillsData={skillsData} />

      <CoursesSection onToast={onToast} />

      <section className="lower-grid">
        <div className="section-block matches-block"><div className="section-heading compact"><div><p className="eyebrow">DATA-BACKED DISCOVERY</p><h2>Good fits are finding you</h2></div><button className="icon-button ghost" onClick={() => onToast("All opportunities are loading.")} aria-label="More opportunities"><MoreHorizontal size={18} /></button></div><div className="match-list">{matches.map((match) => <div className="match-row" key={match.company}><div className={`company-mark ${match.color}`}>{match.initials}</div><div className="match-copy"><strong>{match.company}</strong><span>{match.role}</span></div><div className="match-score"><strong>{match.score}%</strong><span>{match.tag}</span></div><button className="icon-button ghost" onClick={() => onToast(`Opening ${match.company} opportunity.`)} aria-label={`View ${match.company}`}><ChevronRight size={17} /></button></div>)}</div></div>
        <div className="bridge-card"><div className="bridge-card-top"><div><p className="eyebrow">THE BRIDGE METHOD</p><h2>Trust is built in public.</h2></div><div className="bridge-badge"><ShieldCheck size={16} /> 04</div></div><p>Every verified skill has a source, a date, and a real attempt behind it. No black boxes.</p><div className="bridge-steps"><span className="done"><Check size={12} /> Learn</span><span className="done"><Check size={12} /> Practice</span><span className="current"><span /> Verify</span><span>Apply</span></div><button className="dark-button" onClick={() => onToast("Verification history opened.")}>See your verification history <ArrowRight size={16} /></button></div>
      </section>
    </>
  );
}

function HiringView({ onToast }: { onToast: (message: string) => void }) {
  const [query, setQuery] = useState("");
  return (
    <>
      <section className="search-hero dark-panel"><div className="search-hero-copy"><p className="panel-kicker"><span className="kicker-line" /> INTELLIGENT SEARCH</p><h2>Find what a resume can’t say.</h2><p>Search by demonstrated capability, not just self-reported keywords.</p></div><div className="search-input-wrap"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “React architecture” or “can ship fast”" /><kbd>⌘ K</kbd></div><div className="search-filters"><button className="filter-chip active"><ShieldCheck size={14} /> Verified only</button><button className="filter-chip">Experience <ChevronDown size={13} /></button><button className="filter-chip">Availability <ChevronDown size={13} /></button><span>{query ? `Showing signal for “${query}”` : "1,248 candidates with live signal"}</span></div></section>
      <section className="section-block"><div className="section-heading"><div><p className="eyebrow">SHORTLIST SIGNAL</p><h2>High-confidence matches</h2><p>Ranked by capability evidence, not resume polish.</p></div><button className="primary-button small" onClick={() => onToast("Saved search created.")}>Save search <ArrowRight size={15} /></button></div><div className="candidate-table"><div className="candidate-header"><span>CANDIDATE</span><span>MATCH BREAKDOWN</span><span>AVAILABILITY</span><span /></div>{[
        { name: "Amelia Reed", role: "Product engineer", score: 94, verified: "8 verified", availability: "Open to offers", avatar: "AR" },
        { name: "Noah Williams", role: "Frontend engineer", score: 91, verified: "6 verified", availability: "2 weeks", avatar: "NW" },
        { name: "Mina Patel", role: "Design technologist", score: 87, verified: "7 verified", availability: "Open to offers", avatar: "MP" },
      ].map((candidate) => <div className="candidate-row" key={candidate.name}><div className="candidate-person"><span className="avatar avatar-ink">{candidate.avatar}</span><div><strong>{candidate.name}</strong><span>{candidate.role}</span></div></div><div className="candidate-breakdown"><strong>{candidate.score}%</strong><div className="mini-bars"><i style={{ width: "92%" }} /><i style={{ width: "78%" }} /><i style={{ width: "64%" }} /></div><span><ShieldCheck size={12} /> {candidate.verified}</span></div><span className="availability"><i />{candidate.availability}</span><button className="icon-button ghost" onClick={() => onToast(`Opening ${candidate.name}'s verified profile.`)} aria-label={`Open ${candidate.name}`}><ChevronRight size={17} /></button></div>)}</div></section>
      <section className="lower-grid"><div className="insight-card light-blue"><div className="soft-icon blue"><Target size={17} /></div><p className="eyebrow">MATCH EXPLAINER</p><h3>Build trust into the yes.</h3><p>Match scores show their ingredients: challenge performance, recency, and role-specific behavior.</p><button className="text-button" onClick={() => onToast("Match methodology opened.")}>Read methodology <ArrowRight size={15} /></button></div><div className="insight-card dark-panel recruiter-note"><div className="soft-icon mint"><Send size={17} /></div><p className="eyebrow">RESPECTFUL OUTREACH</p><h3>Make the first message human.</h3><p>Start with a specific signal you noticed. Candidates can accept, decline, or ask for context.</p><button className="dark-button" onClick={() => onToast("Outreach templates opened.")}>Draft an introduction <ArrowRight size={15} /></button></div></section>
    </>
  );
}

function AcademiaView({ onToast }: { onToast: (message: string) => void }) {
  return (
    <>
      <section className="hero-grid academia-hero"><div className="hero-panel dark-panel"><div className="panel-kicker"><span className="kicker-line" /> COHORT PULSE</div><div className="hero-panel-main"><div><p className="hero-number">7.8<span>/10</span></p><p className="hero-caption">Industry readiness</p></div><div className="pulse-bars"><i style={{ height: "42%" }} /><i style={{ height: "60%" }} /><i style={{ height: "51%" }} /><i style={{ height: "77%" }} /><i style={{ height: "69%" }} /><i style={{ height: "88%" }} /><i style={{ height: "78%" }} /></div></div><div className="hero-foot"><span><TrendingUp size={14} /> +0.6 this term</span><span>Privacy-safe aggregate</span></div></div><div className="next-action-card institution-action"><div className="action-card-head"><div className="soft-icon mint"><GraduationCap size={17} /></div><span className="action-label">NEXT BEST ACTION</span></div><h2>Close the testing gap.</h2><p>Students are strongest in frontend fundamentals and need more evidence in systems thinking.</p><div className="gap-line"><span>Systems thinking</span><strong>42%</strong><div><i style={{ width: "42%" }} /></div></div><button className="primary-button" onClick={() => onToast("Curriculum recommendations opened.")}>View recommendations <ArrowRight size={16} /></button></div></section>
      <section className="section-block"><div className="section-heading"><div><p className="eyebrow">PROGRAM SIGNALS</p><h2>Where your cohort stands</h2><p>Aggregated enough to act, private enough to trust.</p></div><button className="text-button" onClick={() => onToast("Full cohort report exported.")}>Export report <ArrowRight size={16} /></button></div><div className="stats-grid">{institutionStats.map((stat) => <div className="stat-card" key={stat.label}><div className={`stat-orb ${stat.accent}`} /><p>{stat.label}</p><strong>{stat.value}</strong><span><TrendingUp size={13} /> {stat.delta} this term</span></div>)}</div></section>
      <section className="lower-grid"><div className="section-block chart-card"><div className="section-heading compact"><div><p className="eyebrow">VERIFIED COVERAGE</p><h2>Skill families</h2></div><button className="icon-button ghost" onClick={() => onToast("Chart filters opened.")} aria-label="Filter skill families"><MoreHorizontal size={18} /></button></div><div className="family-chart">{[["Frontend", 86, "blue"], ["Product", 72, "coral"], ["Systems", 42, "lilac"], ["Communication", 68, "mint"]].map(([label, value, accent]) => <div className="family-row" key={label as string}><span>{label}</span><div><i className={accent as string} style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>)}</div></div><div className="privacy-card"><div className="privacy-icon"><LockKeyhole size={18} /></div><p className="eyebrow">PRIVACY BY DESIGN</p><h3>No leaderboard. More signal.</h3><p>Individual results stay with students. You see patterns, readiness, and where teaching can have the most leverage.</p><button className="text-button" onClick={() => onToast("Privacy policy opened.")}>How aggregation works <ArrowRight size={15} /></button></div></section>
    </>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const dashboard = trpc.dashboard.snapshot.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const savePreferences = trpc.dashboard.savePreferences.useMutation();
  const startChallenge = trpc.dashboard.startChallenge.useMutation();
  const utils = trpc.useUtils();
  const [role, setRole] = useState<Role>("talent");
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");
  const onToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  useEffect(() => {
    if (!dashboard.data?.preferences) return;
    setRole(dashboard.data.preferences.activeRole as Role);
    setDarkMode(dashboard.data.preferences.theme === "dark");
  }, [dashboard.data?.preferences]);
  const persistPreferences = (next: Partial<{ role: Role; darkMode: boolean }>) => {
    if (!isAuthenticated) return;
    savePreferences.mutate({
      activeRole: next.role,
      theme: next.darkMode === undefined ? undefined : next.darkMode ? "dark" : "light",
    });
  };
  const changeRole = (nextRole: Role) => { setRole(nextRole); persistPreferences({ role: nextRole }); };
  const changeTheme = (nextDarkMode: boolean) => { setDarkMode(nextDarkMode); persistPreferences({ darkMode: nextDarkMode }); };
  const handleChallenge = (skillId?: number) => {
    if (!skillId || !isAuthenticated) {
      onToast("TypeScript challenge queued — you’ve got this.");
      return;
    }
    startChallenge.mutate({ skillId }, {
      onSuccess: async () => { await utils.dashboard.snapshot.invalidate(); onToast("Challenge saved — you’ve got this."); },
      onError: () => onToast("We couldn't save that challenge yet."),
    });
  };
  const skillsData = dashboard.data?.skills.map((skill) => ({ ...skill, icon: skillIconMap[skill.iconKey] ?? Sparkles })) ?? skills;
  const content = useMemo(() => role === "talent" ? <TalentView onToast={onToast} skillsData={skillsData} onChallenge={handleChallenge} /> : role === "hiring" ? <HiringView onToast={onToast} /> : <AcademiaView onToast={onToast} />, [role, skillsData]);
  return (
    <div className={`app-shell ${darkMode ? "theme-dark" : ""}`}>
      <AppNav role={role} setRole={changeRole} darkMode={darkMode} setDarkMode={changeTheme} onToast={onToast} />
      <main className="main-content"><TopBar role={role} darkMode={darkMode} setDarkMode={changeTheme} onToast={onToast} isAuthenticated={isAuthenticated} onLogin={startLogin} /><div className="page-content">{content}</div><footer className="site-footer"><span>SkillBridge / Verified potential, made visible.</span><span>{dashboard.isFetching ? "Syncing profile…" : isAuthenticated ? "Saved just now" : "Preview mode"} <span className="sync-dot" /></span></footer></main>
      {toast && <div className="toast"><Sparkles size={15} />{toast}</div>}
    </div>
  );
}
