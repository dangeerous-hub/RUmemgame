export type CardType = {
  id: string
  match: string
  img: string
}

export function generateDeck(): CardType[] {
  const base = [
    "locked",
    "unlock",
    "comment",
    "update",
    "matched",
    "approved",
    "reproprose",
    "xls"
  ]

  const deck: CardType[] = []

  base.forEach((name) => {
    deck.push({
      id: crypto.randomUUID(),
      match: name,
      img: `/cards/${name}.jpg`
    })

    deck.push({
      id: crypto.randomUUID(),
      match: name,
      img: `/cards/${name}.jpg`
    })
  })

  // unmatched cards (no match)
  deck.push({
    id: crypto.randomUUID(),
    match: "brokenchain",
    img: "/cards/brokenchain.jpg"
  })

  deck.push({
    id: crypto.randomUUID(),
    match: "investigate",
    img: "/cards/investigate.jpg"
  })

  return deck.sort(() => Math.random() - 0.5)
}