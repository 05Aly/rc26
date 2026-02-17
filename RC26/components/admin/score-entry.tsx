"use client"

import { useState } from "react"
import { useTournament } from "@/lib/tournament-context"
import { Check, ClipboardList } from "lucide-react"
import Image from "next/image"
import { getLogoUrl } from "@/lib/logo"

export function ScoreEntry() {
  const { matches, teams, updateScore } = useTournament()

  const getTeam = (id: string) => teams.find((t) => t.id === id)

  const pendingMatches = matches.filter((m) => !m.is_completed && m.home_team_id && m.away_team_id)
  const completedMatches = matches.filter((m) => m.is_completed)

  return (
    <div className="space-y-6">
      {/* Pending Matches */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
          <ClipboardList className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Pending Matches ({pendingMatches.length})
          </h3>
        </div>
        {pendingMatches.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No pending matches. Generate a schedule first or all matches are completed.
          </p>
        ) : (
          <div className="divide-y divide-border/50">
            {pendingMatches.map((match) => (
              <ScoreInput key={match.id} match={match} getTeam={getTeam} onSubmit={updateScore} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Matches */}
      {completedMatches.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
            <Check className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Completed ({completedMatches.length})
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {completedMatches.map((match) => {
              const home = getTeam(match.home_team_id)
              const away = getTeam(match.away_team_id)
              if (!home || !away) return null
              const stageLabel =
                match.stage === "semi" ? "Semi-Final" : match.stage === "final" ? "Final" : `${match.group_name} - R${match.round_number}`
              return (
                <div key={match.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 overflow-hidden rounded-full">
                      <Image src={getLogoUrl(home.logo_url)} alt={home.name} fill className="object-cover" sizes="24px" />
                    </div>
                    <span className="text-sm text-foreground">{home.name}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">{stageLabel}</span>
                    <span className="font-bold text-foreground">
                      {match.home_score} - {match.away_score}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{away.name}</span>
                    <div className="relative h-6 w-6 overflow-hidden rounded-full">
                      <Image src={getLogoUrl(away.logo_url)} alt={away.name} fill className="object-cover" sizes="24px" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreInput({
  match,
  getTeam,
  onSubmit,
}: {
  match: { id: string; home_team_id: string; away_team_id: string; group_name: string; round_number: number; stage: string }
  getTeam: (id: string) => { name: string; logo_url: string } | undefined
  onSubmit: (matchId: string, homeScore: number, awayScore: number) => void
}) {
  const [homeScore, setHomeScore] = useState("")
  const [awayScore, setAwayScore] = useState("")
  const home = getTeam(match.home_team_id)
  const away = getTeam(match.away_team_id)

  if (!home || !away) return null

  const stageLabel =
    match.stage === "semi" ? "Semi-Final" : match.stage === "final" ? "Final" : `${match.group_name} - R${match.round_number}`

  const handleSubmit = () => {
    const h = parseInt(homeScore)
    const a = parseInt(awayScore)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return
    onSubmit(match.id, h, a)
    setHomeScore("")
    setAwayScore("")
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 overflow-hidden rounded-full">
            <Image src={getLogoUrl(home.logo_url)} alt={home.name} fill className="object-cover" sizes="28px" />
          </div>
          <span className="text-sm font-medium text-foreground">{home.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">{stageLabel}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{away.name}</span>
          <div className="relative h-7 w-7 overflow-hidden rounded-full">
            <Image src={getLogoUrl(away.logo_url)} alt={away.name} fill className="object-cover" sizes="28px" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          className="w-14 rounded-lg border border-border bg-input px-2 py-1.5 text-center text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="H"
        />
        <span className="text-muted-foreground">-</span>
        <input
          type="number"
          min="0"
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          className="w-14 rounded-lg border border-border bg-input px-2 py-1.5 text-center text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="A"
        />
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Save
        </button>
      </div>
    </div>
  )
}
