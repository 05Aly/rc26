"use client"

import { useState } from "react"
import { useTournament } from "@/lib/tournament-context"
import { Trophy, ArrowRight } from "lucide-react"
import Image from "next/image"
import { getLogoUrl } from "@/lib/logo"

export function KnockoutManager() {
  const { matches, teams, allGroupMatchesCompleted, generateKnockout, getStandings, updateScore } =
    useTournament()
  const [showConfirm, setShowConfirm] = useState(false)

  const knockoutMatches = matches.filter((m) => m.stage !== "group")
  const semiMatches = knockoutMatches.filter((m) => m.stage === "semi")
  const finalMatch = knockoutMatches.find((m) => m.stage === "final")

  const getTeam = (id: string) => teams.find((t) => t.id === id)

  const g1Standings = getStandings("Group 1")
  const g2Standings = getStandings("Group 2")

  // Check if semis are done to update final
  const semisDone = semiMatches.length === 2 && semiMatches.every((m) => m.is_completed)

  // Determine finalists from semi results
  const getWinner = (match: (typeof semiMatches)[0]) => {
    if (!match.is_completed || match.home_score === null || match.away_score === null) return null
    return match.home_score > match.away_score ? match.home_team_id : match.away_team_id
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Knockout Stage</h3>
        </div>

        {!allGroupMatchesCompleted ? (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              All group stage matches must be completed before generating the knockout bracket.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <QualificationPreview title="Group 1" standings={g1Standings} />
              <QualificationPreview title="Group 2" standings={g2Standings} />
            </div>
          </div>
        ) : knockoutMatches.length === 0 ? (
          <div>
            <p className="mb-4 text-sm text-foreground">
              All group matches are complete! Ready to generate the knockout bracket.
            </p>
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <QualificationPreview title="Group 1" standings={g1Standings} />
              <QualificationPreview title="Group 2" standings={g2Standings} />
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Generate Knockout Bracket
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Semi Finals */}
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Semi-Finals
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {semiMatches.map((match, i) => {
                  const home = getTeam(match.home_team_id)
                  const away = getTeam(match.away_team_id)
                  return (
                    <div
                      key={match.id}
                      className="rounded-xl border border-border bg-secondary/30 p-4"
                    >
                      <p className="mb-3 text-xs font-medium text-primary">Semi-Final {i + 1}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {home && (
                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                              <Image
                                src={getLogoUrl(home.logo_url)}
                                alt={home.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-foreground">
                            {home?.name ?? "TBD"}
                          </span>
                        </div>
                        {match.is_completed ? (
                          <span className="text-lg font-bold text-foreground">
                            {match.home_score} - {match.away_score}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">vs</span>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {away?.name ?? "TBD"}
                          </span>
                          {away && (
                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                              <Image
                                src={getLogoUrl(away.logo_url)}
                                alt={away.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Final */}
            {finalMatch && (
              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Final
                </h4>
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
                  {semisDone ? (
                    (() => {
                      const finalist1 = getWinner(semiMatches[0])
                      const finalist2 = getWinner(semiMatches[1])
                      const team1 = finalist1 ? getTeam(finalist1) : null
                      const team2 = finalist2 ? getTeam(finalist2) : null

                      // If final hasn't been updated with finalists yet, we need to update it
                      const finalHome = finalMatch.home_team_id ? getTeam(finalMatch.home_team_id) : null
                      const finalAway = finalMatch.away_team_id ? getTeam(finalMatch.away_team_id) : null

                      if (!finalHome && !finalAway && team1 && team2) {
                        // Show the determined finalists and let admin enter score via score tab
                        return (
                          <div>
                            <p className="mb-4 text-sm text-primary">
                              Finalists determined! Enter the score in the Scores tab.
                            </p>
                            <div className="flex items-center justify-center gap-6">
                              <div className="flex flex-col items-center gap-2">
                                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                  <Image
                                    src={getLogoUrl(team1.logo_url)}
                                    alt={team1.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                                <span className="text-sm font-semibold text-foreground">
                                  {team1.name}
                                </span>
                              </div>
                              <div className="flex flex-col items-center">
                                <ArrowRight className="h-5 w-5 text-primary" />
                                <span className="mt-1 text-xs text-muted-foreground">VS</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                  <Image
                                    src={getLogoUrl(team2.logo_url)}
                                    alt={team2.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                                <span className="text-sm font-semibold text-foreground">
                                  {team2.name}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (finalist1 && finalist2) {
                                  // Update the final match with the determined finalists
                                  // We need to do this through the context
                                  updateScore(finalMatch.id, -1, -1)
                                }
                              }}
                              className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
                            >
                              Set Finalists (go to Scores tab)
                            </button>
                          </div>
                        )
                      }

                      return (
                        <p className="text-sm text-muted-foreground">
                          {finalMatch.is_completed
                            ? `Final: ${finalHome?.name ?? "?"} ${finalMatch.home_score} - ${finalMatch.away_score} ${finalAway?.name ?? "?"}`
                            : "Waiting for final match score..."}
                        </p>
                      )
                    })()
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Waiting for semi-final results to determine finalists...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-semibold text-foreground">Generate Knockout Bracket</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              This will create the semi-finals and final matches based on the current group standings.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  generateKnockout()
                  setShowConfirm(false)
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QualificationPreview({
  title,
  standings,
}: {
  title: string
  standings: { team: { id: string; name: string; logo_url: string }; pts: number; gd: number }[]
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h5>
      <div className="space-y-1.5">
        {standings.slice(0, 2).map((s, i) => (
          <div
            key={s.team.id}
            className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
              i < 2 ? "bg-primary/10" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">{i + 1}</span>
              <div className="relative h-5 w-5 overflow-hidden rounded-full">
                <Image src={getLogoUrl(s.team.logo_url)} alt={s.team.name} fill className="object-cover" sizes="20px" />
              </div>
              <span className="text-xs font-medium text-foreground">{s.team.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{s.pts} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
