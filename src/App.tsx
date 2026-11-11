import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Sliders,
  Sparkles,
  Heart,
  ShieldCheck,
  Check,
  Moon,
  Sun,
  MapPin,
  Building,
  QrCode,
  Coffee,
  Copy,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Thermometer,
  Compass
} from 'lucide-react';
import { ROOMMATES_DATA, HOSTEL_BLOCKS, RoommateProfile, HostelBlock } from './data/roommates';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const [activeTab, setActiveTab] = useState<'finder' | 'radar' | 'hostels' | 'pass'>('finder');

  // User's own lifestyle sliders (0 - 100)
  const [userMetrics, setUserMetrics] = useState({
    sleepHour: 80,      // ~3:00 AM night owl
    acTemp: 25,         // 20°C chilly AC
    studyNoise: 35,     // modest background sound
    cleanliness: 80,    // tidy and organized
    nightActivity: 75,  // active coding/gaming
    socialVibe: 50,     // balanced social
  });

  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [hostelFilter, setHostelFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<RoommateProfile>(ROOMMATES_DATA[0]);
  const [invitedList, setInvitedList] = useState<string[]>(['rm-1']);
  const [copiedToken, setCopiedToken] = useState(false);

  // Compute live match percentage based on Euclidean distance
  const calculateMatchScore = (cand: RoommateProfile) => {
    const keys: (keyof typeof userMetrics)[] = ['sleepHour', 'acTemp', 'studyNoise', 'cleanliness', 'nightActivity', 'socialVibe'];
    let sumSquaredDiff = 0;
    keys.forEach(k => {
      const diff = userMetrics[k] - cand.metrics[k];
      sumSquaredDiff += diff * diff;
    });
    // Maximum possible distance squared: 6 * 100^2 = 60,000
    const distance = Math.sqrt(sumSquaredDiff);
    const maxDist = Math.sqrt(6 * 10000);
    const similarity = 1 - (distance / maxDist);
    // Scale nicely between 60% and 99%
    const score = Math.round(60 + similarity * 39);
    return Math.min(99, Math.max(50, score));
  };

  // Re-ranked roommate list
  const rankedRoommates = useMemo(() => {
    return ROOMMATES_DATA
      .map(r => ({
        ...r,
        matchScore: calculateMatchScore(r)
      }))
      .filter(r => {
        const matchesGender = genderFilter === 'All' || r.gender === genderFilter;
        const matchesHostel = hostelFilter === 'All' || r.hostel === hostelFilter;
        const matchesSearch =
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.traits.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          r.bio.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGender && matchesHostel && matchesSearch;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [userMetrics, genderFilter, hostelFilter, searchQuery]);

  const topMatch = rankedRoommates[0] || ROOMMATES_DATA[0];

  const toggleInvite = (id: string) => {
    setInvitedList(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const copyAllotmentCode = () => {
    const code = `TIET-DOSA-ROOMIE-TOKEN:HJ204-${selectedCandidate.rollNo}-AUTHENTICATED`;
    navigator.clipboard.writeText(code);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // SVG Radar Chart calculations
  const radarDimensions = [
    { key: 'sleepHour', label: 'Night Owl' },
    { key: 'acTemp', label: 'AC Chiller' },
    { key: 'studyNoise', label: 'Sound Tolerance' },
    { key: 'cleanliness', label: 'Hygiene' },
    { key: 'nightActivity', label: 'Night Gaming' },
    { key: 'socialVibe', label: 'Social Vibe' },
  ] as const;

  const center = 140;
  const radius = 100;
  const numPoints = radarDimensions.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const userPolygonPoints = radarDimensions
    .map((dim, i) => {
      const coord = getCoordinates(i, userMetrics[dim.key]);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  const candidatePolygonPoints = radarDimensions
    .map((dim, i) => {
      const coord = getCoordinates(i, selectedCandidate.metrics[dim.key]);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Frosted Sticky Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-[#0f172a]/80 border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    RoomieMatch
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
                    TIET DOSA
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hostel Roommate Lifestyle & Compatibility Radar
                </p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center overflow-x-auto gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => setActiveTab('finder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'finder'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Find Roommates
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'radar'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Compatibility Radar
            </button>

            <button
              onClick={() => setActiveTab('hostels')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'hostels'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Hostel Blocks
            </button>

            <button
              onClick={() => setActiveTab('pass')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'pass'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Allotment Pass
            </button>
          </nav>

          {/* Right Status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono font-medium text-rose-700 dark:text-rose-300">
                PHASE 2 ALLOTMENT LIVE
              </span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Bento Grid KPI Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Seekers */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Verified Campus Room Seekers
              </span>
              <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                412
              </span>
              <span className="text-xs text-slate-400">students active</span>
            </div>
            <p className="mt-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              +38 registered in last 24 hrs
            </p>
          </div>

          {/* Card 2: Highest Match */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Top Lifestyle Match
              </span>
              <span className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
                {topMatch.matchScore ?? 95}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {topMatch.name} ({topMatch.hostel})
              </span>
            </div>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              Harmonious Sleep & AC sync
            </p>
          </div>

          {/* Card 3: Preferred Block */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Target Allocation Block
              </span>
              <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Building className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                Hostel J
              </span>
              <span className="text-xs text-slate-400">2-Seater AC</span>
            </div>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              Proximity: 200m from CSED Labs
            </p>
          </div>

          {/* Card 4: Invitations Handshake */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                DOSA Roommate Handshake
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                {invitedList.length} Active
              </span>
              <span className="text-xs text-slate-400">mutual requests</span>
            </div>
            <p className="mt-2.5 text-xs text-emerald-600 dark:text-emerald-400">
              Ready for single-click room allotment
            </p>
          </div>
        </div>

        {/* User Preferences Tuning Drawer / Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-500" />
                Your Roommate Lifestyle Preferences
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust sliders to dynamically re-calculate compatibility percentages across all campus candidates.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full">
              Real-Time Vector Distance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Slider 1: Sleep Schedule */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Sleep Schedule:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  {userMetrics.sleepHour < 30 ? '11:00 PM (Early Bird)' : userMetrics.sleepHour < 70 ? '01:30 AM (Moderate)' : '03:30 AM (Night Owl)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={userMetrics.sleepHour}
                onChange={(e) => setUserMetrics({ ...userMetrics, sleepHour: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10 PM</span>
                <span>4 AM</span>
              </div>
            </div>

            {/* Slider 2: AC Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">AC Climate Preference:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  {Math.round(18 + (userMetrics.acTemp / 100) * 8)}°C {userMetrics.acTemp < 40 ? '(Chilled)' : '(Moderate)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={userMetrics.acTemp}
                onChange={(e) => setUserMetrics({ ...userMetrics, acTemp: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>18°C (Polar)</span>
                <span>26°C (Eco)</span>
              </div>
            </div>

            {/* Slider 3: Study Sound */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Study Sound Atmosphere:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  {userMetrics.studyNoise < 30 ? 'Pin-Drop Silence' : userMetrics.studyNoise < 70 ? 'Lo-Fi Ambient' : 'Group Discussion'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={userMetrics.studyNoise}
                onChange={(e) => setUserMetrics({ ...userMetrics, studyNoise: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Silent Library</span>
                <span>Social Audio</span>
              </div>
            </div>

            {/* Slider 4: Cleanliness */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Cleanliness & Chores:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  {userMetrics.cleanliness < 40 ? 'Relaxed Weekly' : userMetrics.cleanliness < 75 ? 'Regular Tidy' : 'Daily Spotless'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={userMetrics.cleanliness}
                onChange={(e) => setUserMetrics({ ...userMetrics, cleanliness: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Casual</span>
                <span>Meticulous</span>
              </div>
            </div>

            {/* Slider 5: Night Activity */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Night Coding / Discord:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  {userMetrics.nightActivity < 30 ? 'Lights Off' : userMetrics.nightActivity < 70 ? 'Screen Light Only' : 'Mechanical Keeb'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={userMetrics.nightActivity}
                onChange={(e) => setUserMetrics({ ...userMetrics, nightActivity: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Quiet Sleep</span>
                <span>Night Builder</span>
              </div>
            </div>

            {/* Slider 6: Social Vibe */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Room Social Atmosphere:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  {userMetrics.socialVibe < 40 ? 'Private Zen' : userMetrics.socialVibe < 75 ? 'Friends Welcome' : 'Open Hangout'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={userMetrics.socialVibe}
                onChange={(e) => setUserMetrics({ ...userMetrics, socialVibe: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Introvert Hub</span>
                <span>Extrovert Lounge</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: FIND ROOMMATES */}
        {activeTab === 'finder' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, branch (COE, ENC), habits, or traits..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <span className="text-slate-400">Gender:</span>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="Male">Boys (J, M, Q, B/C)</option>
                    <option value="Female">Girls (PG, N)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <span className="text-slate-400">Hostel:</span>
                  <select
                    value={hostelFilter}
                    onChange={(e) => setHostelFilter(e.target.value)}
                    className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Blocks</option>
                    <option value="Hostel J">Hostel J</option>
                    <option value="Hostel M">Hostel M</option>
                    <option value="Hostel PG">Hostel PG</option>
                    <option value="Hostel Q">Hostel Q</option>
                    <option value="Hostel N">Hostel N</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Roommate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rankedRoommates.map(profile => {
                const isInvited = invitedList.includes(profile.id);
                const isSelected = selectedCandidate.id === profile.id;

                return (
                  <div
                    key={profile.id}
                    className={`rounded-2xl border p-5 transition-all duration-200 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-rose-500/60 shadow-md shadow-rose-500/5 ring-1 ring-rose-500/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-sm">
                          {profile.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                              {profile.name}
                            </h4>
                            <span className="text-[11px] font-mono font-medium text-slate-400">
                              {profile.rollNo}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {profile.branch} • {profile.year}
                          </p>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          {profile.matchScore}% Match
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          {profile.hostel} • {profile.roomType}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {profile.bio}
                    </p>

                    {/* Traits tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {profile.traits.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setSelectedCandidate(profile);
                          setActiveTab('radar');
                        }}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        Inspect Radar Vector
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCandidate(profile);
                          toggleInvite(profile.id);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
                          isInvited
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isInvited ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Invite Sent
                          </>
                        ) : (
                          'Send Roommate Invite'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COMPATIBILITY RADAR */}
        {activeTab === 'radar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Visualizer (2 Cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-rose-500" />
                    Multivariate Compatibility Spider Chart
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comparing your vector (Blue) vs <strong>{selectedCandidate.name}</strong> (Rose)
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span>You</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span>{selectedCandidate.name.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Spider Chart SVG */}
              <div className="flex justify-center py-4">
                <svg width="280" height="280" className="overflow-visible">
                  {/* Concentric Polygons */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, idx) => {
                    const gridPoints = radarDimensions
                      .map((_, i) => {
                        const coord = getCoordinates(i, ratio * 100);
                        return `${coord.x},${coord.y}`;
                      })
                      .join(' ');
                    return (
                      <polygon
                        key={idx}
                        points={gridPoints}
                        fill="none"
                        stroke={darkMode ? '#334155' : '#e2e8f0'}
                        strokeWidth="1"
                        strokeDasharray={ratio === 1.0 ? '' : '3 3'}
                      />
                    );
                  })}

                  {/* Axis lines */}
                  {radarDimensions.map((dim, i) => {
                    const outer = getCoordinates(i, 100);
                    const labelPos = getCoordinates(i, 122);
                    return (
                      <g key={i}>
                        <line
                          x1={center}
                          y1={center}
                          x2={outer.x}
                          y2={outer.y}
                          stroke={darkMode ? '#334155' : '#cbd5e1'}
                          strokeWidth="1"
                        />
                        <text
                          x={labelPos.x}
                          y={labelPos.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400 font-semibold"
                        >
                          {dim.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* User Polygon */}
                  <polygon
                    points={userPolygonPoints}
                    fill="rgba(99, 102, 241, 0.25)"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />

                  {/* Candidate Polygon */}
                  <polygon
                    points={candidatePolygonPoints}
                    fill="rgba(244, 63, 94, 0.25)"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Vector Delta Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                {radarDimensions.map(dim => {
                  const userVal = userMetrics[dim.key];
                  const candVal = selectedCandidate.metrics[dim.key];
                  const diff = Math.abs(userVal - candVal);

                  return (
                    <div key={dim.key} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span>{dim.label}</span>
                        <span className={`font-mono font-bold ${diff <= 15 ? 'text-emerald-500' : diff <= 35 ? 'text-amber-500' : 'text-rose-500'}`}>
                          Δ {diff}
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-700 dark:text-slate-300">
                        <span>You: {userVal}</span>
                        <span>Cand: {candVal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Candidate Focus Card (1 Col) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xl shadow-md">
                  {selectedCandidate.avatar}
                </div>
                <h4 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                  {selectedCandidate.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedCandidate.branch} • {selectedCandidate.year}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-mono font-bold text-xs">
                  {calculateMatchScore(selectedCandidate)}% Harmonic Match
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-b border-slate-100 dark:border-slate-800 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hostel Choice:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCandidate.hostel} ({selectedCandidate.roomType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dietary Style:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCandidate.diet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Favorite Spot:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCandidate.canteenSpot}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  toggleInvite(selectedCandidate.id);
                  setActiveTab('pass');
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <QrCode className="w-4 h-4" />
                Generate Allotment Agreement Pass
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: HOSTEL BLOCKS DIRECTORY */}
        {activeTab === 'hostels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOSTEL_BLOCKS.map(block => (
              <div
                key={block.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {block.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {block.occupancyPercent}% Full
                    </span>
                  </div>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                    {block.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {block.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">AC Timings</span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-[11px] truncate">{block.acTiming}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Curfew Entry</span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">{block.curfew}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Mess Food</span>
                    <p className="font-medium text-amber-500 text-[11px]">★ {block.messRating} / 5.0</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">CSED Distance</span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">{block.proximityToCsed}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Laundry: {block.laundryUnits} Units</span>
                  <span>{block.gymAvailable ? '✓ Gym on-site' : 'External Gym'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: DOSA ALLOTMENT PASS */}
        {activeTab === 'pass' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6 relative overflow-hidden">
              {/* Watermark accent */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-rose-500/5 pointer-events-none" />

              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 pb-5 flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    TIET DEAN OF STUDENT AFFAIRS (DOSA)
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Mutual Roommate Allotment Agreement
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hostel Allotment Cycle 2026-2027 • Form DOSA-HA-3B
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400">AGREEMENT PASS</span>
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400">#DOSA-HJ-204-B</p>
                </div>
              </div>

              {/* Roommates Pair View */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Applicant</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">Armaan Singh</p>
                  <p className="font-mono text-slate-500 text-[11px]">102203491 (COE, 3rd Year)</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Matched Roommate</span>
                  <p className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">{selectedCandidate.name}</p>
                  <p className="font-mono text-slate-500 text-[11px]">{selectedCandidate.rollNo} ({selectedCandidate.branch})</p>
                </div>
              </div>

              {/* Room details */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase">Allocated Block</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCandidate.hostel}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase">Room Type</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCandidate.roomType}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase">Match Score</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{calculateMatchScore(selectedCandidate)}%</p>
                </div>
              </div>

              {/* Mock QR Code for Hostel Gate Pass */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
                <div className="w-24 h-24 bg-slate-900 dark:bg-white rounded-xl p-2 flex items-center justify-center shrink-0">
                  <QrCode className="w-20 h-20 text-white dark:text-slate-900" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    VERIFIED BIOMETRIC CRYPTOGRAPHIC QR
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Present this pass at the Hostel Caretaker Desk or DOSA office during room key distribution. Includes verified anti-tamper hash.
                  </p>
                  <p className="font-mono text-[10px] text-slate-400">
                    HASH: 0x89E198C20019A4B • EXPIRES: 31-AUG-2026
                  </p>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={copyAllotmentCode}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                {copiedToken ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied DOSA Room Allotment Token!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Signed Room Allotment Token
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
