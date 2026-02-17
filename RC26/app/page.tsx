"use client"

import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { TeamCarousel } from "@/components/team-carousel"
import { StandingsSection } from "@/components/standings-table"
import { MatchCenter } from "@/components/match-center"
import { Leaderboards } from "@/components/leaderboards"
import { useTournament } from "@/lib/tournament-context"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { loading } = useTournament()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading tournament data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4">
        <HeroBanner />
        <TeamCarousel />
        <StandingsSection />
        <MatchCenter />
        <Leaderboards />
        <footer className="border-t border-border py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Hackshot Arena &middot; Ramadan Tournament
          </p>
        </footer>
      </main>
    </div>
  )
}
