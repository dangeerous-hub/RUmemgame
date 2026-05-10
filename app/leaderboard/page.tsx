'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LeaderboardPage() {
  const [scores, setScores] = useState<any[]>([])

  useEffect(() => {
    const loadScores = async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("time_seconds", { ascending: true })
        .limit(20)

      if (error) {
        console.log(error)
        return
      }

      if (data) setScores(data)
    }

    loadScores()
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>🏆 Leaderboard</h1>

      <p style={{ marginTop: 5 }}>
        Fastest time to reach <b>3 pairs</b>.
      </p>

      <div style={{ marginTop: 20 }}>
        {scores.length === 0 && <p>No winners yet.</p>}

        {scores.map((s, index) => (
          <div
            key={s.id}
            style={{
              padding: 10,
              border: "1px solid #ddd",
              marginBottom: 8,
              borderRadius: 8
            }}
          >
            <b>#{index + 1}</b> {s.username} — {s.time_seconds}s
          </div>
        ))}
      </div>
    </main>
  )
}