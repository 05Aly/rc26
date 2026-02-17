"use client"

import { useState } from "react"
import { useTournament } from "@/lib/tournament-context"
import { UserPlus, Target, Handshake } from "lucide-react"
import Image from "next/image"
import { getLogoUrl } from "@/lib/logo"

export function PlayerManagement() {
  const { teams, players, addPlayer, addGoalToPlayer, addAssistToPlayer } = useTournament()
  const [name, setName] = useState("")
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !teamId) return
    addPlayer(name.trim(), teamId)
    setName("")
  }

  return (
    <div className="space-y-6">
      {/* Add Player Form */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <UserPlus className="h-5 w-5 text-primary" />
          Add Player
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col gap-4 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player name"
            className="flex-1 rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add Player
          </button>
        </form>
      </div>

      {/* Player List by Team */}
      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((team) => {
          const teamPlayers = players.filter((p) => p.team_id === team.id)
          return (
            <div key={team.id} className="rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 border-b border-border bg-secondary px-4 py-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image src={getLogoUrl(team.logo_url)} alt={team.name} fill className="object-cover" sizes="32px" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{team.name}</h4>
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {teamPlayers.length} players
                </span>
              </div>
              <div className="divide-y divide-border/50">
                {teamPlayers.length === 0 ? (
                  <p className="px-4 py-4 text-center text-sm text-muted-foreground">No players added</p>
                ) : (
                  teamPlayers.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{p.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => addGoalToPlayer(p.id)}
                            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                            title="Add goal"
                          >
                            <Target className="h-3 w-3" />
                            {p.goals}
                          </button>
                          <button
                            onClick={() => addAssistToPlayer(p.id)}
                            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                            title="Add assist"
                          >
                            <Handshake className="h-3 w-3" />
                            {p.assists}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
