"use client"

import { Trophy, Users, Calendar } from "lucide-react"
import { useTournament } from "@/lib/tournament-context"

export function HeroBanner() {
  const { teams, matches, players } = useTournament()

  const completedMatches = matches.filter((m) => m.is_completed).length
  const totalGoals = matches.reduce((acc, m) => {
    if (m.is_completed) {
      return acc + (m.home_score ?? 0) + (m.away_score ?? 0)
    }
    return acc
  }, 0)

  return (
    <section className="relative overflow-hidden py-16">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <Trophy className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Hackshot Arena
        </h1>
        <p className="mt-2 text-lg text-primary">Ramadan Tournament</p>
        <p className="mt-4 text-pretty text-sm text-muted-foreground md:text-base">
          8 teams compete for glory across 2 groups in this
          <br className="hidden sm:block" /> premier Ramadan football tournament
        </p>

        {/* Quick Stats */}
        <div className="mx-auto mt-8 flex max-w-lg items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <span className="mt-1.5 text-lg font-bold text-foreground">{teams.length}</span>
            <span className="text-xs text-muted-foreground">Teams</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <span className="mt-1.5 text-lg font-bold text-foreground">{completedMatches}</span>
            <span className="text-xs text-muted-foreground">Played</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <span className="mt-1.5 text-lg font-bold text-foreground">{totalGoals}</span>
            <span className="text-xs text-muted-foreground">Goals</span>
          </div>
        </div>
      </div>
    </section>
  )
}
