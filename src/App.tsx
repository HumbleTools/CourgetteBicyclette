import './App.css'
import { useEffect, useState } from 'react'
import gameData from './assets/gameData.json'

const App = () => {
  const [showSplash, setShowSplash] = useState(true)
  const [points, setPoints] = useState(0)
  const [total, setTotal] = useState(0)
  const maxPoints = 10
  const [question, setQuestion] = useState<React.ReactNode>('Est-ce que ça se peut...')
  const [loading, setLoading] = useState(false)
  const [dots, setDots] = useState('.')
  const [inactive, setInactive] = useState(true)
  const [animatePoints, setAnimatePoints] = useState(false)
  const [finalScreen, setFinalScreen] = useState(false)

  useEffect(() => {
    if (loading) {
      let count = 0
      const interval = setInterval(() => {
        count = (count + 1) % 4
        setDots('.'.repeat(count || 1))
      }, 350)
      const timeout = setTimeout(() => {
        setLoading(false)
        setQuestion(getRandomCombo())
        setDots('.')
        setInactive(false)
      }, 3000) // délai passé à 3 secondes
      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [loading])

  const handleScreenTouch = () => {
    if (!loading) {
      setLoading(true)
      setInactive(true)
    }
  }

  const getRandomCombo = () => {
    const objets = gameData.objets
    const actions = gameData.actions
    const objet = objets[Math.floor(Math.random() * objets.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ marginBottom: '2.2rem' }}>Est-ce que ça se peut...</span>
        <span>
          <span className="courgette">{objet}</span> qui <span className="bicyclette">{action}</span> ?
        </span>
      </div>
    )
  }

  const handleAddPoint = () => {
    if (!inactive && points < maxPoints) {
      setPoints((prev) => prev + 1)
      setTotal((prev) => prev + 1)
      setAnimatePoints(true)
      setTimeout(() => setAnimatePoints(false), 400)
    }
  }

  const handleAddTotal = () => {
    if (!inactive && total < maxPoints) {
      setTotal((prev) => prev + 1)
    }
  }

  const handleReplay = () => {
    setFinalScreen(false);
    setPoints(0);
    setTotal(0);
    setInactive(true);
    setQuestion('Est-ce que ça se peut...');
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (points >= maxPoints) {
      setTimeout(() => setFinalScreen(true), 400)
    }
  }, [points])

  useEffect(() => {
    if (total >= maxPoints) {
      setTimeout(() => setFinalScreen(true), 400) // attend la fin de l'animation du score
    }
  }, [total])

  return showSplash ? (
    <div className="splash-screen" onClick={() => setShowSplash(false)}>
      <h1 className="splash-luckiest">
        Une <span className="courgette">courgette</span> à{' '}
        <span className="bicyclette">bicyclette</span>
      </h1>
    </div>
  ) : finalScreen ? (
    <div className="final-screen">
      <div className={`points-final`}>
        {points}/{total}
      </div>
      <div className="final-message">
        {points === 10 && 'Quelle équipe hors pair !'}
        {points >= 7 && points <= 9 && 'Vous êtes une équipe efficace !'}
        {points >= 4 && points <= 6 && 
          "C'est pas mal, mais vous pouvez mieux faire !"}
        {points >= 0 && points <= 3 &&
          "Vous ne jouez pas en équipe. Allez, tous ensemble !"}
        <button className="replay-btn" onClick={handleReplay}>Rejouer</button>
      </div>
    </div>
  ) : (
    <div className="app-root" onClick={handleScreenTouch} style={{ cursor: loading ? 'wait' : 'pointer' }}>
      <div className={`points-bar${animatePoints ? ' points-animate' : ''}`}>Points: {points}/{total}</div>
      <div className="main-question">
        {loading ? (
          <span style={{ fontFamily: 'Luckiest Guy', fontSize: '2.2rem', letterSpacing: '1px' }}>
            Est-ce que ça se peut<span className="loading-dots">{dots}</span>
          </span>
        ) : (
          question
        )}
      </div>
      <div className="choices-bar">
        <span className={`choice${inactive ? ' choice-inactive' : ''}`} onClick={inactive ? undefined : handleAddPoint}>Tous d'accord !</span>
        <span className={`choice${inactive ? ' choice-inactive' : ''}`} onClick={inactive ? undefined : handleAddPoint}>Tous pas d'accord !</span>
        <span className={`choice${inactive ? ' choice-inactive' : ''}`} onClick={inactive ? undefined : handleAddTotal}>En désaccord...</span>
      </div>
    </div>
  )
}

export default App
