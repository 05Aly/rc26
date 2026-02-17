export interface Team {
  id: string
  name: string
  group_name: string
  logo_url: string
}

export interface Player {
  id: string
  name: string
  team_id: string
  goals: number
  assists: number
}

export interface Match {
  id: string
  home_team_id: string
  away_team_id: string
  home_score: number | null
  away_score: number | null
  group_name: string
  round_number: number
  is_completed: boolean
  stage: "group" | "semi" | "final"
}

export interface Standing {
  team: Team
  mp: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  pts: number
}

export interface GoalEvent {
  match_id: string
  player_id: string
  type: "goal" | "assist"
}
