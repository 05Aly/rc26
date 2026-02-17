"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTournament } from "@/lib/tournament-context"
import { Header } from "@/components/header"
import { PlayerManagement } from "@/components/admin/player-management"
import { ScheduleManager } from "@/components/admin/schedule-manager"
import { ScoreEntry } from "@/components/admin/score-entry"
import { KnockoutManager } from "@/components/admin/knockout-manager"
import { Users, Calendar, ClipboardList, Trophy } from "lucide-react"

const tabs = [
  { id: "players", label: "Players", icon: Users },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "scores", label: "Scores", icon: ClipboardList },
  { id: "knockout", label: "Knockout", icon: Trophy },
] as const

type TabId = (typeof tabs)[number]["id"]

export default function AdminPage() {
  const { isAdmin } = useTournament()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>("players")

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage players, schedule, and scores
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "players" && <PlayerManagement />}
        {activeTab === "schedule" && <ScheduleManager />}
        {activeTab === "scores" && <ScoreEntry />}
        {activeTab === "knockout" && <KnockoutManager />}
      </main>
    </div>
  )
}
