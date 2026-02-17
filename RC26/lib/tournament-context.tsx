"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"
import { Team, Player, Match, Standing } from "./types"
import { supabase } from "./supabase"

interface TournamentState {
  teams: Team[]
  players: Player[]
  matches: Match[]
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  addPlayer: (name: string, teamId: string) => void
  generateSchedule: () => void
  updateScore: (matchId: string, homeScore: number, awayScore: number) => void
  getStandings: (groupName: string) => Standing[]
  getTopScorers: () => { player: Player; team: Team }[]
  getTopAssists: () => { player: Player; team: Team }[]
  generateKnockout: () => void
  allGroupMatchesCompleted: boolean
  resetData: () => void
  addGoalToPlayer: (playerId: string) => void
  addAssistToPlayer: (playerId: string) => void
  refreshData: () => void
}

const TournamentContext = createContext<TournamentState | null>(null)

export function useTournament() {
  const ctx = useContext(TournamentContext)
  if (!ctx) throw new Error("useTournament must be used within TournamentProvider")
  return ctx
}

function generateRoundRobin(teamIds: string[], groupName: string): Omit<Match, "id">[] {
  const matches: Omit<Match, "id">[] = []
  const n = teamIds.length
  const ids = [...teamIds]
  const fixed = ids[0]
  const rotating = ids.slice(1)

  for (let round = 0; round < n - 1; round++) {
    const roundMatches: { home: string; away: string }[] = []
    const current = [fixed, ...rotating]

    for (let i = 0; i < n / 2; i++) {
      roundMatches.push({
        home: current[i],
        away: current[n - 1 - i],
      })
    }

    const shuffled = [...roundMatches].sort(() => Math.random() - 0.5)
    shuffled.forEach((m) => {
      matches.push({
        home_team_id: m.home,
        away_team_id: m.away,
        home_score: null,
        away_score: null,
        group_name: groupName,
        round_number: round + 1,
        is_completed: false,
        stage: "group",
      })
    })

    rotating.unshift(rotating.pop()!)
  }

  return matches
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch all data from Supabase on mount
  const fetchData = useCallback(async () => {
    try {
      const [teamsRes, playersRes, matchesRes] = await Promise.all([
        supabase.from("teams").select("*").order("id"),
        supabase.from("players").select("*").order("name"),
        supabase.from("matches").select("*").order("round_number").order("id"),
      ])

      if (teamsRes.data) {
        setTeams(
          teamsRes.data.map((t) => ({
            id: String(t.id),
            name: t.name,
            group_name: t.group_name,
            logo_url: t.logo_url ?? t.logo ?? "/assets/teams/1.jpg",
          }))
        )
      }

      if (playersRes.data) {
        setPlayers(
          playersRes.data.map((p) => ({
            id: String(p.id),
            name: p.name,
            team_id: String(p.team_id),
            goals: p.goals ?? 0,
            assists: p.assists ?? 0,
          }))
        )
      }

      if (matchesRes.data) {
        setMatches(
          matchesRes.data.map((m) => ({
            id: String(m.id),
            home_team_id: String(m.home_team_id),
            away_team_id: String(m.away_team_id),
            home_score: m.home_score,
            away_score: m.away_score,
            group_name: m.group_name,
            round_number: m.round_number,
            is_completed: m.is_completed ?? false,
            stage: m.stage ?? "group",
          }))
        )
      }
    } catch (err) {
      console.error("Error fetching tournament data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  const login = useCallback((email: string, password: string) => {
    if (email === "ali.admin@gmail.com" && password === "admin123") {
      setIsAdmin(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => setIsAdmin(false), [])

  const addPlayer = useCallback(
    async (name: string, teamId: string) => {
      const { data, error } = await supabase
        .from("players")
        .insert({ name, team_id: parseInt(teamId), goals: 0, assists: 0 })
        .select()
        .single()

      if (error) {
        console.error("Error adding player:", error)
        return
      }

      if (data) {
        setPlayers((prev) => [
          ...prev,
          {
            id: String(data.id),
            name: data.name,
            team_id: String(data.team_id),
            goals: data.goals ?? 0,
            assists: data.assists ?? 0,
          },
        ])
      }
    },
    []
  )

  const generateSchedule = useCallback(async () => {
    const g1Teams = teams.filter((t) => t.group_name === "Group 1").map((t) => t.id)
    const g2Teams = teams.filter((t) => t.group_name === "Group 2").map((t) => t.id)

    const g1Matches = generateRoundRobin(g1Teams, "Group 1")
    const g2Matches = generateRoundRobin(g2Teams, "Group 2")

    const allNewMatches: Omit<Match, "id">[] = []
    for (let round = 1; round <= 3; round++) {
      const r1 = g1Matches.filter((m) => m.round_number === round)
      const r2 = g2Matches.filter((m) => m.round_number === round)
      allNewMatches.push(...r1, ...r2)
    }

    // Delete existing matches first
    await supabase.from("matches").delete().neq("id", 0)

    // Insert new matches
    const rows = allNewMatches.map((m) => ({
      home_team_id: parseInt(m.home_team_id),
      away_team_id: parseInt(m.away_team_id),
      home_score: null,
      away_score: null,
      group_name: m.group_name,
      round_number: m.round_number,
      is_completed: false,
      stage: "group",
    }))

    const { data, error } = await supabase.from("matches").insert(rows).select()

    if (error) {
      console.error("Error generating schedule:", error)
      return
    }

    if (data) {
      setMatches(
        data.map((m) => ({
          id: String(m.id),
          home_team_id: String(m.home_team_id),
          away_team_id: String(m.away_team_id),
          home_score: m.home_score,
          away_score: m.away_score,
          group_name: m.group_name,
          round_number: m.round_number,
          is_completed: m.is_completed ?? false,
          stage: m.stage ?? "group",
        }))
      )
    }
  }, [teams])

  const updateScore = useCallback(async (matchId: string, homeScore: number, awayScore: number) => {
    const { error } = await supabase
      .from("matches")
      .update({ home_score: homeScore, away_score: awayScore, is_completed: true })
      .eq("id", parseInt(matchId))

    if (error) {
      console.error("Error updating score:", error)
      return
    }

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, home_score: homeScore, away_score: awayScore, is_completed: true }
          : m
      )
    )
  }, [])

  const getStandings = useCallback(
    (groupName: string): Standing[] => {
      const groupTeams = teams.filter((t) => t.group_name === groupName)
      const groupMatches = matches.filter(
        (m) => m.group_name === groupName && m.is_completed && m.stage === "group"
      )

      const standings: Standing[] = groupTeams.map((team) => {
        let mp = 0,
          w = 0,
          d = 0,
          l = 0,
          gf = 0,
          ga = 0

        groupMatches.forEach((match) => {
          if (match.home_team_id === team.id) {
            mp++
            gf += match.home_score ?? 0
            ga += match.away_score ?? 0
            if ((match.home_score ?? 0) > (match.away_score ?? 0)) w++
            else if ((match.home_score ?? 0) === (match.away_score ?? 0)) d++
            else l++
          } else if (match.away_team_id === team.id) {
            mp++
            gf += match.away_score ?? 0
            ga += match.home_score ?? 0
            if ((match.away_score ?? 0) > (match.home_score ?? 0)) w++
            else if ((match.away_score ?? 0) === (match.home_score ?? 0)) d++
            else l++
          }
        })

        return { team, mp, w, d, l, gf, ga, gd: gf - ga, pts: w * 3 + d }
      })

      standings.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts
        if (b.gd !== a.gd) return b.gd - a.gd
        return b.gf - a.gf
      })

      return standings
    },
    [teams, matches]
  )

  const getTopScorers = useCallback(() => {
    return players
      .filter((p) => p.goals > 0)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10)
      .map((p) => ({ player: p, team: teams.find((t) => t.id === p.team_id)! }))
      .filter((e) => e.team)
  }, [players, teams])

  const getTopAssists = useCallback(() => {
    return players
      .filter((p) => p.assists > 0)
      .sort((a, b) => b.assists - a.assists)
      .slice(0, 10)
      .map((p) => ({ player: p, team: teams.find((t) => t.id === p.team_id)! }))
      .filter((e) => e.team)
  }, [players, teams])

  const allGroupMatchesCompleted = useMemo(() => {
    const groupMatches = matches.filter((m) => m.stage === "group")
    return groupMatches.length > 0 && groupMatches.every((m) => m.is_completed)
  }, [matches])

  const generateKnockout = useCallback(async () => {
    const g1Standings = getStandings("Group 1")
    const g2Standings = getStandings("Group 2")

    if (g1Standings.length < 2 || g2Standings.length < 2) return

    // Delete existing knockout matches
    await supabase.from("matches").delete().neq("stage", "group")

    const knockoutRows = [
      {
        home_team_id: parseInt(g1Standings[0].team.id),
        away_team_id: parseInt(g2Standings[1].team.id),
        home_score: null,
        away_score: null,
        group_name: "Knockout",
        round_number: 4,
        is_completed: false,
        stage: "semi",
      },
      {
        home_team_id: parseInt(g2Standings[0].team.id),
        away_team_id: parseInt(g1Standings[1].team.id),
        home_score: null,
        away_score: null,
        group_name: "Knockout",
        round_number: 4,
        is_completed: false,
        stage: "semi",
      },
      {
        home_team_id: 0,
        away_team_id: 0,
        home_score: null,
        away_score: null,
        group_name: "Knockout",
        round_number: 5,
        is_completed: false,
        stage: "final",
      },
    ]

    const { data, error } = await supabase.from("matches").insert(knockoutRows).select()

    if (error) {
      console.error("Error generating knockout:", error)
      return
    }

    if (data) {
      setMatches((prev) => {
        const groupOnly = prev.filter((m) => m.stage === "group")
        const newKnockout = data.map((m) => ({
          id: String(m.id),
          home_team_id: String(m.home_team_id),
          away_team_id: String(m.away_team_id),
          home_score: m.home_score,
          away_score: m.away_score,
          group_name: m.group_name,
          round_number: m.round_number,
          is_completed: m.is_completed ?? false,
          stage: m.stage as "group" | "semi" | "final",
        }))
        return [...groupOnly, ...newKnockout]
      })
    }
  }, [getStandings])

  const addGoalToPlayer = useCallback(
    async (playerId: string) => {
      const player = players.find((p) => p.id === playerId)
      if (!player) return

      const newGoals = player.goals + 1
      const { error } = await supabase
        .from("players")
        .update({ goals: newGoals })
        .eq("id", parseInt(playerId))

      if (error) {
        console.error("Error adding goal:", error)
        return
      }

      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, goals: newGoals } : p))
      )
    },
    [players]
  )

  const addAssistToPlayer = useCallback(
    async (playerId: string) => {
      const player = players.find((p) => p.id === playerId)
      if (!player) return

      const newAssists = player.assists + 1
      const { error } = await supabase
        .from("players")
        .update({ assists: newAssists })
        .eq("id", parseInt(playerId))

      if (error) {
        console.error("Error adding assist:", error)
        return
      }

      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, assists: newAssists } : p))
      )
    },
    [players]
  )

  const resetData = useCallback(async () => {
    await Promise.all([
      supabase.from("matches").delete().neq("id", 0),
      supabase.from("players").delete().neq("id", 0),
    ])
    setPlayers([])
    setMatches([])
  }, [])

  const value = useMemo(
    () => ({
      teams,
      players,
      matches,
      isAdmin,
      loading,
      login,
      logout,
      addPlayer,
      generateSchedule,
      updateScore,
      getStandings,
      getTopScorers,
      getTopAssists,
      generateKnockout,
      allGroupMatchesCompleted,
      resetData,
      addGoalToPlayer,
      addAssistToPlayer,
      refreshData,
    }),
    [
      teams,
      players,
      matches,
      isAdmin,
      loading,
      login,
      logout,
      addPlayer,
      generateSchedule,
      updateScore,
      getStandings,
      getTopScorers,
      getTopAssists,
      generateKnockout,
      allGroupMatchesCompleted,
      resetData,
      addGoalToPlayer,
      addAssistToPlayer,
      refreshData,
    ]
  )

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>
}
