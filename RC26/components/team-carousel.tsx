"use client"

import { useState, useCallback } from "react"
import { useTournament } from "@/lib/tournament-context"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { getLogoUrl } from "@/lib/logo"

export function TeamCarousel() {
  const { teams } = useTournament()
  const [activeIndex, setActiveIndex] = useState(0)

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? teams.length - 1 : i - 1))
  }, [teams.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i === teams.length - 1 ? 0 : i + 1))
  }, [teams.length])

  return (
    <section className="py-12">
      <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
        Competing Teams
      </h2>
      <div className="relative flex items-center justify-center px-4">
        <button
          onClick={prev}
          className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground md:left-8"
          aria-label="Previous team"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-center gap-2 overflow-hidden py-4 md:gap-4">
          {teams.map((team, index) => {
            const distance = Math.abs(index - activeIndex)
            const wrappedDistance = Math.min(distance, teams.length - distance)
            const isActive = wrappedDistance === 0
            const isNear = wrappedDistance <= 2

            if (!isNear) return null

            return (
              <button
                key={team.id}
                onClick={() => setActiveIndex(index)}
                className="flex flex-col items-center transition-all duration-500 ease-out"
                style={{
                  transform: isActive ? "scale(1)" : `scale(${0.85 - wrappedDistance * 0.1})`,
                  opacity: isActive ? 1 : 0.4 + (1 - wrappedDistance * 0.15),
                  zIndex: isActive ? 10 : 5 - wrappedDistance,
                }}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                    isActive
                      ? "h-36 w-36 border-primary shadow-lg shadow-primary/20 md:h-48 md:w-48"
                      : "h-24 w-24 border-border md:h-32 md:w-32"
                  }`}
                >
                  <Image
                    src={getLogoUrl(team.logo_url)}
                    alt={team.name}
                    fill
                    className="object-cover"
                    sizes={isActive ? "192px" : "128px"}
                  />
                </div>
                <p
                  className={`mt-3 text-center font-semibold transition-all duration-500 ${
                    isActive ? "text-base text-foreground md:text-lg" : "text-xs text-muted-foreground md:text-sm"
                  }`}
                >
                  {team.name}
                </p>
                <span
                  className={`mt-1 rounded-full px-2 py-0.5 text-xs transition-all duration-500 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-transparent text-muted-foreground"
                  }`}
                >
                  {team.group_name}
                </span>
              </button>
            )
          })}
        </div>

        <button
          onClick={next}
          className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground md:right-8"
          aria-label="Next team"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        {teams.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-primary" : "w-2 bg-border"
            }`}
            aria-label={`Go to team ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
