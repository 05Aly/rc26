// Static team data is no longer used directly.
// Teams are now fetched from Supabase `teams` table.
// This file is kept for reference only.

import { Team } from "./types"

export const FALLBACK_TEAMS: Team[] = [
  // Group 1
  { id: "1", name: "الحريفه", group_name: "Group 1", logo_url: "/assets/teams/4.jpg" },
  { id: "2", name: "الفراعنه FC", group_name: "Group 1", logo_url: "/assets/teams/7.jpg" },
  { id: "3", name: "الشياطين الحمر", group_name: "Group 1", logo_url: "/assets/teams/6.jpg" },
  { id: "4", name: "النسور", group_name: "Group 1", logo_url: "/assets/teams/3.jpg" },
  // Group 2
  { id: "5", name: "Blue Lock", group_name: "Group 2", logo_url: "/assets/teams/1.jpg" },
  { id: "6", name: "النازي الرياضي", group_name: "Group 2", logo_url: "/assets/teams/2.jpg" },
  { id: "7", name: "Northbridge", group_name: "Group 2", logo_url: "/assets/teams/8.jpg" },
  { id: "8", name: "Hackshot", group_name: "Group 2", logo_url: "/assets/teams/5.jpg" },
]
