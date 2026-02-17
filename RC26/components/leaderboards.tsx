"use client"

import { useTournament } from "@/lib/tournament-context"
import { Target, Handshake } from "lucide-react"
import Image from "next/image"
import { getLogoUrl } from "@/lib/logo"

export function Leaderboards() {
  const { getTopScorers, getTopAssists } = useTournament()
  const scorers = getTopScorers()
  const assists = getTopAssists()

  if (scorers.length === 0 && assists.length === 0) {
    return (
      <section className="py-12">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
          Golden Boot
        </h2>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-8 py-16 text-center">
          <p className="text-lg text-muted-foreground">
            Leaderboard data will appear once players are added and matches are played.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
        Golden Boot
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Top Scorers */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Top Scorers
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {scorers.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">No goals scored yet</p>
            ) : (
              scorers.map((entry, i) => (
                <div
                  key={entry.player.id}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0
                          ? "bg-chart-4 text-background"
                          : i === 1
                          ? "bg-muted-foreground/30 text-foreground"
                          : i === 2
                          ? "bg-chart-2 text-background"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={getLogoUrl(entry.team.logo_url)}
                        alt={entry.team.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.player.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.team.name}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary">{entry.player.goals}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Assists */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
            <Handshake className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Top Assists
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {assists.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">No assists recorded yet</p>
            ) : (
              assists.map((entry, i) => (
                <div
                  key={entry.player.id}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0
                          ? "bg-chart-4 text-background"
                          : i === 1
                          ? "bg-muted-foreground/30 text-foreground"
                          : i === 2
                          ? "bg-chart-2 text-background"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={getLogoUrl(entry.team.logo_url)}
                        alt={entry.team.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.player.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.team.name}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary">{entry.player.assists}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
