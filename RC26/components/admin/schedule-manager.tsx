"use client"

import { useState } from "react"
import { useTournament } from "@/lib/tournament-context"
import { Calendar, AlertTriangle, Shuffle } from "lucide-react"
import Image from "next/image"
import { getLogoUrl } from "@/lib/logo"

export function ScheduleManager() {
  const { matches, teams, generateSchedule, resetData } = useTournament()
  const [showConfirmGenerate, setShowConfirmGenerate] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const getTeam = (id: string) => teams.find((t) => t.id === id)
  const groupMatches = matches.filter((m) => m.stage === "group")

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowConfirmGenerate(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Shuffle className="h-4 w-4" />
          Generate Schedule
        </button>
        <button
          onClick={() => setShowConfirmReset(true)}
          className="flex items-center gap-2 rounded-lg border border-destructive px-5 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          <AlertTriangle className="h-4 w-4" />
          Reset All Data
        </button>
      </div>

      {/* Confirmation Dialogs */}
      {showConfirmGenerate && (
        <ConfirmDialog
          title="Generate Schedule"
          message="This will generate a new round-robin schedule for both groups with randomized match order. Any existing schedule will be replaced."
          onConfirm={() => {
            generateSchedule()
            setShowConfirmGenerate(false)
          }}
          onCancel={() => setShowConfirmGenerate(false)}
        />
      )}

      {showConfirmReset && (
        <ConfirmDialog
          title="Reset All Data"
          message="This will permanently delete all matches, scores, and player data. This action cannot be undone."
          onConfirm={() => {
            resetData()
            setShowConfirmReset(false)
          }}
          onCancel={() => setShowConfirmReset(false)}
          destructive
        />
      )}

      {/* Schedule Display */}
      {groupMatches.length > 0 ? (
        <div className="space-y-6">
          {[1, 2, 3].map((round) => {
            const roundMatches = groupMatches.filter((m) => m.round_number === round)
            if (roundMatches.length === 0) return null
            return (
              <div key={round} className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Round {round}
                  </h3>
                </div>
                <div className="divide-y divide-border/50">
                  {roundMatches.map((match) => {
                    const home = getTeam(match.home_team_id)
                    const away = getTeam(match.away_team_id)
                    if (!home || !away) return null
                    return (
                      <div key={match.id} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <Image src={getLogoUrl(home.logo_url)} alt={home.name} fill className="object-cover" sizes="24px" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{home.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {match.is_completed ? (
                            <span className="font-bold text-foreground">
                              {match.home_score} - {match.away_score}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">vs</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{away.name}</span>
                          <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <Image src={getLogoUrl(away.logo_url)} alt={away.name} fill className="object-cover" sizes="24px" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card px-8 py-16 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg text-muted-foreground">
            No schedule generated yet. Click &quot;Generate Schedule&quot; to create the tournament bracket.
          </p>
        </div>
      )}
    </div>
  )
}

function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  destructive = false,
}: {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
