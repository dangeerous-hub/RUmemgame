'use client'

import { useEffect, useState } from "react"
import { generateDeck, CardType } from "@/lib/cards"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [username, setUsername] = useState("")
  const [started, setStarted] = useState(false)

  const [deck, setDeck] = useState<CardType[]>([])
  const [flipped, setFlipped] = useState<CardType[]>([])
  const [matched, setMatched] = useState<string[]>([])

  const [pairs, setPairs] = useState(0)
  const [time, setTime] = useState(30)

  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)

  // TIMER
  useEffect(() => {
    if (!started || gameOver) return

    const interval = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(interval)
          setGameOver(true)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [started, gameOver])

  // WIN CHECK
  useEffect(() => {
  const saveWinner = async () => {
    if (pairs >= 3 && !win) {
      setWin(true)
      setGameOver(true)

      const timeTaken = 30 - time

      const { data, error } = await supabase
        .from("leaderboard")
        .insert([
          {
            username,
            time_seconds: timeTaken
          }
        ])
        .select()

      if (error) {
        console.error("SUPABASE ERROR:", error)
        alert("Supabase error: " + error.message)
      } else {
        console.log("SAVED TO SUPABASE:", data)
        alert("Score saved!")
      }
    }
  }

  saveWinner()
}, [pairs, time, username, win])

  const startGame = () => {
    if (!username.trim()) {
      alert("Please enter a username")
      return
    }

    setDeck(generateDeck())
    setStarted(true)
  }

  const handleFlip = (card: CardType) => {
    if (gameOver) return

    // already flipped?
    if (flipped.find((c) => c.id === card.id)) return

    // already matched?
    if (matched.includes(card.match)) return

    // already 2 flipped?
    if (flipped.length === 2) return

    const newFlipped = [...flipped, card]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped

      if (a.match === b.match) {
        setMatched((prev) => [...prev, a.match])
        setPairs((p) => p + 1)
      }

      setTimeout(() => {
        setFlipped([])
      }, 800)
    }
  }

  const restart = () => {
    setStarted(false)
    setDeck([])
    setFlipped([])
    setMatched([])
    setPairs(0)
    setTime(30)
    setGameOver(false)
    setWin(false)
  }

  // START SCREEN
  if (!started) {
    return (
      <main style={{ padding: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Memory Game</h1>
        <p style={{ marginTop: 5 }}>
          Match <b>3 pairs</b> within <b>30 seconds</b>.
        </p>

        <div style={{ marginTop: 15 }}>
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: 10,
              border: "1px solid gray",
              borderRadius: 6
            }}
          />

          <button
            onClick={startGame}
            style={{
              marginLeft: 10,
              padding: "10px 16px",
              background: "black",
              color: "white",
              cursor: "pointer",
              borderRadius: 6
            }}
          >
            Start
          </button>
        </div>
      </main>
    )
  }

  // GAME SCREEN
  return (
    <main style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 15,
          fontWeight: "bold"
        }}
      >
        <div>User: {username}</div>
        <div>Time: {time}s</div>
        <div>Pairs: {pairs}/3</div>
      </div>

      {/* BOARD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          maxWidth: 360
        }}
      >
        {deck.map((card) => {
          const isFlipped =
            flipped.find((c) => c.id === card.id) || matched.includes(card.match)

          return (
            <div
              key={card.id}
              onClick={() => handleFlip(card)}
              style={{
                height: 75,
                borderRadius: 12,
                background: isFlipped ? "#f5f5f5" : "#222",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: gameOver ? "default" : "pointer",
                border: "2px solid #444"
              }}
            >
              {isFlipped ? (
                <img
                  src={card.img}
                  alt={card.match}
                  style={{ width: 55, height: 55, objectFit: "contain" }}
                />
              ) : (
                <span style={{ fontSize: 26, color: "white" }}>?</span>
              )}
            </div>
          )
        })}
      </div>

      {/* RESULT */}
      {gameOver && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: "bold" }}>
            {win ? "🎉 YOU WIN!" : "❌ See you next year."}
          </h2>

          <button
            onClick={restart}
            style={{
              marginTop: 10,
              padding: "10px 16px",
              background: "black",
              color: "white",
              cursor: "pointer",
              borderRadius: 6
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  )
}