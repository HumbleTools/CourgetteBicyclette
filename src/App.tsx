import './App.css'
import { useEffect, useState } from 'react'
import gameData from './assets/gameData.json'

const App = () => {
  const [showSplash, setShowSplash] = useState(true)
  const [points, setPoints] = useState(0)
  const maxPoints = 10
  const [question, setQuestion] = useState<React.ReactNode>('Est-ce que ça se peut...')
  const [hasQuestion, setHasQuestion] = useState(false)

  const getRandomCombo = () => {
    const objets = gameData.objets
    const actions = gameData.actions
    const objet = objets[Math.floor(Math.random() * objets.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    return (
      <>
        <span>Est-ce que ça se peut...</span>
        <br style={{ lineHeight: '2.5rem' }} />
        <span>
          <span className="courgette">{objet}</span> qui <span className="bicyclette">{action}</span> ?
        </span>
      </>
    )
  }

  const handleScreenTouch = () => {
    setQuestion(getRandomCombo())
    setHasQuestion(true)
  }

  const handleAddPoint = () => {
    setPoints((prev) => (prev < maxPoints ? prev + 1 : prev))
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return showSplash ? (
    <div className="splash-screen">
      <h1 className="splash-luckiest">
        Une <span className="courgette">courgette</span> à{' '}
        <span className="bicyclette">bicyclette</span>
      </h1>
    </div>
  ) : (
    <div className="app-root" onClick={handleScreenTouch} style={{ cursor: 'pointer' }}>
      <div className="points-bar">Points: {points}/{maxPoints}</div>
      <div className="main-question">{question}</div>
      {hasQuestion && (
        <div className="choices-bar">
          <span className="choice" onClick={handleAddPoint}>Tous d'accord !</span>
          <span className="choice" onClick={handleAddPoint}>Tous pas d'accord !</span>
          <span className="choice" onClick={() => {}}>En désaccord...</span>
        </div>
      )}
    </div>
  )
}

export default App
