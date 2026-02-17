"use client"

import { useTournament } from "@/lib/tournament-context"
import Image from "next/image"
import { getLogoUrl } from "@/lib/logo"

export function StandingsSection() {
  return (
    <section className="py-12">
      <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
        Group Standings
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        <GroupTable groupName="Group 1" />
        <GroupTable groupName="Group 2" />
      </div>
    </section>
  )
}

function GroupTable({ groupName }: { groupName: string }) {
  const { getStandings } = useTournament()
  const standings = getStandings(groupName)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-secondary px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          {groupName}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted-foreground">
              <th className="px-3 py-3 text-left">#</th>
              <th className="px-3 py-3 text-left">Team</th>
              <th className="px-3 py-3 text-center">MP</th>
              <th className="px-3 py-3 text-center">W</th>
              <th className="px-3 py-3 text-center">D</th>
              <th className="px-3 py-3 text-center">L</th>
              <th className="hidden px-3 py-3 text-center sm:table-cell">GF</th>
              <th className="hidden px-3 py-3 text-center sm:table-cell">GA</th>
              <th className="px-3 py-3 text-center">GD</th>
              <th className="px-3 py-3 text-center font-bold text-primary">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr
                key={s.team.id}
                className={`border-b border-border/50 transition-colors hover:bg-secondary/50 ${
                  i < 2 ? "bg-primary/5" : ""
                }`}
              >
                <td className="px-3 py-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      i < 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full">
                      <Image
                        src={getLogoUrl(s.team.logo_url)}
                        alt={s.team.name}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </div>
                    <span className="font-medium text-foreground">{s.team.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.mp}</td>
                <td className="px-3 py-3 text-center text-foreground">{s.w}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.d}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.l}</td>
                <td className="hidden px-3 py-3 text-center text-muted-foreground sm:table-cell">{s.gf}</td>
                <td className="hidden px-3 py-3 text-center text-muted-foreground sm:table-cell">{s.ga}</td>
                <td
                  className={`px-3 py-3 text-center font-medium ${
                    s.gd > 0 ? "text-primary" : s.gd < 0 ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {s.gd > 0 ? `+${s.gd}` : s.gd}
                </td>
                <td className="px-3 py-3 text-center font-bold text-primary">{s.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
