export interface SquadMember {
  id?: number;
  name: string;
  number: number;
  position: "GK" | "DEF" | "MID" | "FWD";
  role?: string;
  email?: string;
  photoUrl?: string;
  foot?: "Right" | "Left" | "Both";
  isCaptain?: boolean;
  isViceCaptain?: boolean;
}

export interface OfficialClub {
  id: number;
  name: string;
  shortCode: string;
  color: string;
  homePitch: string;
  coachName: string;
  assistantCoach?: string;
  medicalStaff?: string;
  squad: SquadMember[];
}

export const OFFICIAL_CLUBS_DATA: OfficialClub[] = [
  {
    id: 1,
    name: "Samba",
    shortCode: "SAM",
    color: "#00ff85",
    homePitch: "Samba Arena (School Lower Pitch)",
    coachName: "Austin Brian Omondi",
    assistantCoach: "Carson Technical Bench",
    medicalStaff: "MFA Sports Medicine Staff",
    squad: [
      { name: "Brian", number: 1, position: "GK", role: "Goalkeeper", foot: "Right" },
      { name: "Gregory", number: 13, position: "GK", role: "Goalkeeper", foot: "Right" },
      { name: "Jattan", number: 2, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Atibu", number: 3, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Haron", number: 4, position: "DEF", role: "Team Captain & Defender", foot: "Right", isCaptain: true },
      { name: "Edgar", number: 5, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Mutwiri", number: 6, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Kichuma", number: 12, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Abdiaziz", number: 15, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Eugene", number: 7, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Shawn", number: 8, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Jaycrack", number: 10, position: "MID", role: "Team Captain & Playmaker", foot: "Right", isViceCaptain: true },
      { name: "Phisael", number: 14, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Opiyo", number: 16, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Abdirashid", number: 17, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Stafford", number: 18, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Vincent", number: 20, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Wokabi", number: 9, position: "FWD", role: "Forward", foot: "Right" },
      { name: "Edwin", number: 11, position: "FWD", role: "Forward", foot: "Right" },
      { name: "Carson", number: 19, position: "FWD", role: "Forward", foot: "Right" },
    ],
  },
  {
    id: 6,
    name: "Royal Rangers",
    shortCode: "RR",
    color: "#3b82f6",
    homePitch: "Ranger Fortress Field (Academy East)",
    coachName: "Levis Wanyama",
    assistantCoach: "George Victor Kibet",
    medicalStaff: "MFA Physical Therapy Unit",
    squad: [
      {
        name: "Idi Sebantu",
        number: 1,
        position: "GK",
        role: "Goalkeeper",
        foot: "Right",
        email: "idi.sebantu@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Ali Guyo",
        number: 2,
        position: "DEF",
        role: "Defender",
        foot: "Right",
        email: "ali.diba@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Dennis Thoya",
        number: 3,
        position: "DEF",
        role: "Defender",
        foot: "Right",
        email: "dennis.thoya@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Gabriel Ekitui",
        number: 4,
        position: "DEF",
        role: "Defender",
        foot: "Right",
        email: "gabriel.alukwar@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Ken Neepe",
        number: 5,
        position: "DEF",
        role: "Defender",
        foot: "Right",
        email: "ken.leneepa@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Levis Wanyama",
        number: 10,
        position: "MID",
        role: "Owner & Captain",
        foot: "Right",
        isCaptain: true,
        email: "levis.wanyama@mpesafoundationacademy.ac.ke",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Tonny Odundo",
        number: 7,
        position: "MID",
        role: "Vice Captain & Playmaker",
        foot: "Right",
        isViceCaptain: true,
        email: "tonny.odundo@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Chris Koome",
        number: 8,
        position: "MID",
        role: "Midfielder",
        foot: "Right",
        email: "chris.koome@mpesafoundationacademy.ac.ke",
      },
      {
        name: "George Victor",
        number: 6,
        position: "MID",
        role: "Midfielder",
        foot: "Right",
        email: "george.kibet@mpesafoundationacademy.ac.ke",
      },
      {
        name: "King David",
        number: 14,
        position: "MID",
        role: "Midfielder",
        foot: "Right",
        email: "king.amani@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Mahad Abdi",
        number: 12,
        position: "MID",
        role: "Midfielder",
        foot: "Right",
        email: "mahad.sihal@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Mark Tonny",
        number: 15,
        position: "MID",
        role: "Midfielder",
        foot: "Right",
        email: "tonny.odundo@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Elvis Kingoo",
        number: 9,
        position: "FWD",
        role: "Striker",
        foot: "Right",
        email: "elvis.kingoo@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Grout Olal",
        number: 11,
        position: "FWD",
        role: "Forward",
        foot: "Right",
        email: "grout.olal@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Lewis Trady",
        number: 17,
        position: "FWD",
        role: "Forward",
        foot: "Right",
        email: "trady.lewis@mpesafoundationacademy.ac.ke",
      },
    ],
  },
  {
    id: 7,
    name: "Young Stars City",
    shortCode: "YSC",
    color: "#f97316",
    homePitch: "Young Stars City Arena (North Pavilion)",
    coachName: "Samwel Reagan Wanyama",
    assistantCoach: "Adams Technical Bench",
    medicalStaff: "MFA Academy Health Unit",
    squad: [
      { name: "Ebeneza Moses", number: 1, position: "GK", role: "Goalkeeper", foot: "Right" },
      { name: "Emmanuel Kariuki", number: 16, position: "GK", role: "Goalkeeper", foot: "Right" },
      { name: "Hassan Siad", number: 2, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Bidan Mwaura", number: 3, position: "DEF", role: "Defender", foot: "Right" },
      { name: "John Owino", number: 4, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Mark Kwemoi", number: 5, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Dennis Macharia", number: 13, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Washington Murithi", number: 6, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Ibrahim Salat", number: 8, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Gabriel Maluki", number: 11, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Abdifatah", number: 12, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Elly Adams Otieno", number: 10, position: "FWD", role: "Team Captain (C)", foot: "Left", isCaptain: true },
      { name: "Raila Junior", number: 7, position: "FWD", role: "Forward", foot: "Right", isViceCaptain: true },
      { name: "Moffat Osoro", number: 9, position: "FWD", role: "Forward", foot: "Right" },
      { name: "Lucas Nawakan", number: 14, position: "FWD", role: "Forward", foot: "Right" },
    ],
  },
  {
    id: 8,
    name: "Mzinga Boyz",
    shortCode: "MZB",
    color: "#eab308",
    homePitch: "The Hive Stadium (West Campus Ground)",
    coachName: "Saidi Bakari",
    assistantCoach: "Meshach Wanjala",
    medicalStaff: "MFA Campus Athletic Care",
    squad: [
      { name: "Meshach Wanjala", number: 1, position: "GK", role: "Goalkeeper", foot: "Right" },
      { name: "Dennis Mwenda", number: 16, position: "GK", role: "Goalkeeper", foot: "Right" },
      { name: "Collins Mutinda", number: 2, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Kelvin Kibet", number: 3, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Alvin Kiprop", number: 4, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Brian Kiptoo", number: 5, position: "DEF", role: "Defender", foot: "Right" },
      { name: "Jeff Njoroge", number: 7, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Bavian Kipkorir", number: 8, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Titus Kiprotich", number: 6, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Samson Lomor", number: 11, position: "MID", role: "Midfielder", foot: "Right" },
      { name: "Hamard Adan", number: 10, position: "FWD", role: "Team Captain (C)", foot: "Right", isCaptain: true },
      { name: "Brandon Wandera", number: 9, position: "FWD", role: "Forward", foot: "Right", isViceCaptain: true },
      { name: "Victor Kipchirchir", number: 14, position: "FWD", role: "Forward", foot: "Right" },
      { name: "Daniel Epur", number: 15, position: "FWD", role: "Forward", foot: "Right" },
      { name: "Francis Lokidor", number: 17, position: "FWD", role: "Forward", foot: "Right" },
    ],
  },
];

export function getOfficialClub(teamId: number): OfficialClub | undefined {
  return OFFICIAL_CLUBS_DATA.find((c) => c.id === teamId);
}

export function getAllRegisteredPlayers(): (SquadMember & { teamId: number; teamName: string; teamColor: string; teamCode: string })[] {
  const result: (SquadMember & { teamId: number; teamName: string; teamColor: string; teamCode: string })[] = [];
  OFFICIAL_CLUBS_DATA.forEach((club) => {
    club.squad.forEach((player, pIdx) => {
      result.push({
        ...player,
        id: club.id * 100 + (player.number || pIdx + 1),
        teamId: club.id,
        teamName: club.name,
        teamColor: club.color,
        teamCode: club.shortCode,
      });
    });
  });
  return result;
}
