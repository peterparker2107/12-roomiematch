export interface RoommateProfile {
  id: string;
  name: string;
  rollNo: string;
  avatar: string;
  branch: string;
  year: string;
  hostel: 'Hostel J' | 'Hostel M' | 'Hostel PG' | 'Hostel Q' | 'Hostel N' | 'Hostel B/C';
  roomType: '2-Seater AC' | '4-Seater AC' | '1-Seater AC' | '2-Seater Non-AC';
  gender: 'Male' | 'Female';
  traits: string[];
  bio: string;
  // Normalized metrics 0-100 for radar chart & distance calculation
  metrics: {
    sleepHour: number;      // 0 (10 PM early bird) to 100 (4 AM night owl)
    acTemp: number;         // 0 (18°C polar) to 100 (26°C warm eco)
    studyNoise: number;     // 0 (pin-drop silence) to 100 (lo-fi/group calls)
    cleanliness: number;    // 0 (casual weekly) to 100 (daily perfectionist)
    nightActivity: number;  // 0 (deep sleeper) to 100 (mech keyboard & gaming)
    socialVibe: number;     // 0 (introvert sanctuary) to 100 (open door hangout)
  };
  diet: 'Vegetarian' | 'Non-Veg Friendly' | 'Jain Food Only' | 'Flexitarian';
  canteenSpot: string;
  matchScore?: number;
}

export interface HostelBlock {
  id: string;
  name: string;
  tagline: string;
  capacity: number;
  occupancyPercent: number;
  acTiming: string;
  curfew: string;
  messRating: number;
  gymAvailable: boolean;
  laundryUnits: number;
  proximityToCsed: string;
  description: string;
  accentColor: string;
}

export const ROOMMATES_DATA: RoommateProfile[] = [
  {
    id: 'rm-1',
    name: 'Kabir Mehta',
    rollNo: '102203112',
    avatar: 'KM',
    branch: 'Computer Engineering (COE)',
    year: '3rd Year',
    hostel: 'Hostel J',
    roomType: '2-Seater AC',
    gender: 'Male',
    traits: ['LeetCode 500+', 'COS Midnight Chai', 'Dark Mode Only', 'Noise Cancelling Headphones'],
    bio: 'Late night dev and competitive coder. Keeps the desk clean. Usually asleep between 3:30 AM and 10:00 AM. Looking for a fellow builder in Hostel J.',
    metrics: {
      sleepHour: 88,
      acTemp: 25,
      studyNoise: 30,
      cleanliness: 75,
      nightActivity: 85,
      socialVibe: 40,
    },
    diet: 'Non-Veg Friendly',
    canteenSpot: 'Jaggi Canteen & COS Cafe'
  },
  {
    id: 'rm-2',
    name: 'Rohan Varma',
    rollNo: '102308044',
    avatar: 'RV',
    branch: 'Electronics & Computers (ENC)',
    year: '2nd Year',
    hostel: 'Hostel M',
    roomType: '2-Seater AC',
    gender: 'Male',
    traits: ['Morning 6 AM Gym', 'Daily Room Cleaning', 'Pure Veg Mess', 'Early Sleeper'],
    bio: 'Discipline enthusiast. Sleep by 11:30 PM, up by 6:00 AM for running at TIET Sports Track. Prefer pin-drop quiet after 11 PM and clean floors.',
    metrics: {
      sleepHour: 15,
      acTemp: 70,
      studyNoise: 15,
      cleanliness: 95,
      nightActivity: 10,
      socialVibe: 55,
    },
    diet: 'Vegetarian',
    canteenSpot: 'Main Mess & Verka Booth'
  },
  {
    id: 'rm-3',
    name: 'Simran Kaur',
    rollNo: '102215099',
    avatar: 'SK',
    branch: 'Computer Science & AI',
    year: '3rd Year',
    hostel: 'Hostel PG',
    roomType: '2-Seater AC',
    gender: 'Female',
    traits: ['Library 2nd Floor', 'Lo-Fi Chill Beats', 'Plants & Fairy Lights', 'Tea Enthusiast'],
    bio: 'Loves focused study sessions with ambient lo-fi music. Sleep around 1:00 AM. Friendly, respectful of personal boundaries, and keeps the AC at a comfortable 22°C.',
    metrics: {
      sleepHour: 50,
      acTemp: 45,
      studyNoise: 40,
      cleanliness: 85,
      nightActivity: 35,
      socialVibe: 65,
    },
    diet: 'Vegetarian',
    canteenSpot: 'Central Library Cafe'
  },
  {
    id: 'rm-4',
    name: 'Aarav Taneja',
    rollNo: '102103402',
    avatar: 'AT',
    branch: 'Computer Engineering (COE)',
    year: '4th Year',
    hostel: 'Hostel Q',
    roomType: '1-Seater AC',
    gender: 'Male',
    traits: ['GSoC Contributor', 'Mechanical Keyboard', 'Room Automation', 'Coffee Addict'],
    bio: 'Final year senior working on open source and remote internships. Chill vibe, flexible hours, keeps the room organized and chilled at 20°C.',
    metrics: {
      sleepHour: 80,
      acTemp: 20,
      studyNoise: 35,
      cleanliness: 70,
      nightActivity: 75,
      socialVibe: 45,
    },
    diet: 'Non-Veg Friendly',
    canteenSpot: 'Hostel Q Night Canteen'
  },
  {
    id: 'rm-5',
    name: 'Ananya Sharma',
    rollNo: '102312018',
    avatar: 'AS',
    branch: 'Biotechnology & Bioinformatics',
    year: '2nd Year',
    hostel: 'Hostel N',
    roomType: '2-Seater AC',
    gender: 'Female',
    traits: ['Bookworm', 'Early Morning Lectures', 'Organized Wardrobe', 'Acoustic Playlist'],
    bio: 'Looking for a calm, hygienic roommate in Hostel N. I like sleeping by midnight and keeping our shared room clutter-free. Always happy to share snacks!',
    metrics: {
      sleepHour: 25,
      acTemp: 60,
      studyNoise: 20,
      cleanliness: 90,
      nightActivity: 15,
      socialVibe: 50,
    },
    diet: 'Vegetarian',
    canteenSpot: 'Hostel N Garden Canteen'
  },
  {
    id: 'rm-6',
    name: 'Devansh Gupta',
    rollNo: '102305072',
    avatar: 'DG',
    branch: 'Mechanical Engineering',
    year: '2nd Year',
    hostel: 'Hostel J',
    roomType: '4-Seater AC',
    gender: 'Male',
    traits: ['Team Fateh FSAE', 'Late Night Workshop', 'Guitar Jamming', 'Weekend Outings'],
    bio: 'Formula student engineer. Often at the mechanical workshop till late. Super friendly, high social battery, and easy to get along with.',
    metrics: {
      sleepHour: 75,
      acTemp: 35,
      studyNoise: 60,
      cleanliness: 60,
      nightActivity: 70,
      socialVibe: 85,
    },
    diet: 'Non-Veg Friendly',
    canteenSpot: 'Jaggi Market Street Food'
  },
  {
    id: 'rm-7',
    name: 'Mehak Preet',
    rollNo: '102217085',
    avatar: 'MP',
    branch: 'Data Science & Business',
    year: '3rd Year',
    hostel: 'Hostel PG',
    roomType: '2-Seater AC',
    gender: 'Female',
    traits: ['Saturnalia Lead', 'Extrovert Dynamo', 'Matcha & Espresso', 'Debating Society'],
    bio: 'Active in college societies. Looking for a cheerful, proactive roommate in PG block. Bedtime around 1:30 AM. Super respectful of quiet study time during exam weeks.',
    metrics: {
      sleepHour: 65,
      acTemp: 50,
      studyNoise: 50,
      cleanliness: 80,
      nightActivity: 45,
      socialVibe: 80,
    },
    diet: 'Vegetarian',
    canteenSpot: 'COS Juice Bar'
  },
  {
    id: 'rm-8',
    name: 'Parth Singla',
    rollNo: '102203871',
    avatar: 'PS',
    branch: 'Computer Engineering (COE)',
    year: '3rd Year',
    hostel: 'Hostel M',
    roomType: '2-Seater AC',
    gender: 'Male',
    traits: ['Competitive Gaming', 'Discord Night Voice', 'Dual Monitors', 'Chill Attitude'],
    bio: 'Valorant + Codeforces enthusiast. Sleep between 2 AM and 4 AM. Uses silent keycaps and closed-back headphones to avoid disturbing anyone.',
    metrics: {
      sleepHour: 92,
      acTemp: 30,
      studyNoise: 45,
      cleanliness: 65,
      nightActivity: 90,
      socialVibe: 60,
    },
    diet: 'Non-Veg Friendly',
    canteenSpot: 'Hostel M Canteen'
  }
];

export const HOSTEL_BLOCKS: HostelBlock[] = [
  {
    id: 'hostel-j',
    name: 'Hostel J',
    tagline: 'Heart of Campus Life & CSED Proximity',
    capacity: 720,
    occupancyPercent: 94,
    acTiming: '6:00 PM - 8:00 AM (Central Chiller)',
    curfew: '10:30 PM (Biometric Sync)',
    messRating: 4.4,
    gymAvailable: true,
    laundryUnits: 16,
    proximityToCsed: '2 min walk (200m)',
    description: 'Renowned for its vibrant courtyards, 4-seater and 2-seater AC rooms, and immediate proximity to LP halls, Jaggi canteen, and CSED labs.',
    accentColor: 'indigo'
  },
  {
    id: 'hostel-m',
    name: 'Hostel M',
    tagline: 'Focused Academic Sanctuary',
    capacity: 580,
    occupancyPercent: 88,
    acTiming: '6:00 PM - 8:00 AM (Inverter AC)',
    curfew: '10:30 PM',
    messRating: 4.2,
    gymAvailable: true,
    laundryUnits: 12,
    proximityToCsed: '6 min walk (650m)',
    description: 'Known for peaceful study environments, modern reading halls on each floor, and spacious 2-seater rooms with attached balconies.',
    accentColor: 'emerald'
  },
  {
    id: 'hostel-pg',
    name: 'Hostel PG (Girls Suite)',
    tagline: 'Modern High-Rise Comfort',
    capacity: 640,
    occupancyPercent: 96,
    acTiming: '24x7 Climate Controlled',
    curfew: '09:30 PM (Turnstile Gate)',
    messRating: 4.6,
    gymAvailable: true,
    laundryUnits: 20,
    proximityToCsed: '4 min walk (400m)',
    description: 'State-of-the-art residential tower with high-speed elevators, indoor sports arena, premium dining mess, and adjacent to Central Library.',
    accentColor: 'purple'
  },
  {
    id: 'hostel-q',
    name: 'Hostel Q Tower',
    tagline: 'Premium High-Tech Suites',
    capacity: 520,
    occupancyPercent: 91,
    acTiming: '24x7 Individual VRV',
    curfew: '11:00 PM',
    messRating: 4.5,
    gymAvailable: true,
    laundryUnits: 18,
    proximityToCsed: '8 min walk (850m)',
    description: 'Featuring 1-seater single suites and 2-seater suites with automated climate controls, study cubicles, and gourmet dining facility.',
    accentColor: 'cyan'
  },
  {
    id: 'hostel-n',
    name: 'Hostel N',
    tagline: 'Serene Botanical Living',
    capacity: 480,
    occupancyPercent: 85,
    acTiming: '7:00 PM - 7:30 AM',
    curfew: '09:30 PM',
    messRating: 4.3,
    gymAvailable: false,
    laundryUnits: 10,
    proximityToCsed: '5 min walk (500m)',
    description: 'Surrounded by lush green botanical lawns, quiet reading corridors, and cozy double rooms preferred by senior and research students.',
    accentColor: 'rose'
  }
];
