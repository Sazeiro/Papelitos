import { guess, nextRound, scorePoint, shuffle, skip, winners } from "./rules"

test("acertar saca el primer papelito y deja el resto", () => {
  expect(guess(["Batman", "Pizza", "Torre"])).toEqual(["Pizza", "Torre"])
})

test("pasar manda el papelito al final", () => {
  expect(skip(["Batman", "Pizza", "Torre"])).toEqual(["Pizza", "Torre", "Batman"])
})

test("el puntaje copia el equipo y no muta el anterior", () => {
  const teams = [
    { name: "Rojos", score: 1 },
    { name: "Azules", score: 0 },
  ]

  const next = scorePoint(teams, 0)

  expect(next[0]).toEqual({ name: "Rojos", score: 2 })
  expect(teams[0].score).toBe(1)
  expect(next[0]).not.toBe(teams[0])
  expect(next[1]).toBe(teams[1])
})

test("al vaciarse el bowl empieza la ronda siguiente con todos los papelitos", () => {
  const papers = ["Batman", "Pizza", "Torre", "Mate"]
  const result = nextRound({ round: 1, papers })

  expect(result.finished).toBe(false)
  expect(result.round).toBe(2)
  expect([...result.bowl].sort()).toEqual([...papers].sort())
})

test("la ronda 3 cierra el juego", () => {
  expect(nextRound({ round: 3, papers: ["Batman", "Pizza"] })).toEqual({
    finished: true,
    round: 3,
    bowl: [],
  })
})

test("un solo máximo es el ganador", () => {
  expect(
    winners([
      { name: "Rojos", score: 4 },
      { name: "Azules", score: 2 },
    ])
  ).toMatchObject({ type: "winner", label: "Rojos" })
})

test("si todos empatan el resultado es empate", () => {
  expect(
    winners([
      { name: "Rojos", score: 3 },
      { name: "Azules", score: 3 },
    ])
  ).toMatchObject({ type: "tie-all", label: "¡Empate!" })
})

test("un empate parcial nombra a los equipos del máximo", () => {
  expect(
    winners([
      { name: "Rojos", score: 5 },
      { name: "Azules", score: 5 },
      { name: "Verdes", score: 1 },
    ]).label
  ).toBe("Rojos & Azules")
})

test("mezclar conserva los papelitos sin modificar la lista original", () => {
  const papers = ["Batman", "Pizza", "Torre", "Mate"]
  const mixed = shuffle(papers)

  expect([...mixed].sort()).toEqual([...papers].sort())
  expect(papers).toEqual(["Batman", "Pizza", "Torre", "Mate"])
})
