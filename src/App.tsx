import { useEffect, useState } from 'react'
import gameData from './assets/gameData.json'
import styles from './App.module.css'

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
  const [shakePoints, setShakePoints] = useState(false)

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
      }, 2000)
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
      <span>
        <span className={styles['courgette']}>{objet}</span> qui <span className={styles['bicyclette']}>{action}</span> ?
      </span>
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
      setShakePoints(true)
      setTimeout(() => setShakePoints(false), 400)
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
      setTimeout(() => setFinalScreen(true), 400)
    }
  }, [total])

  return showSplash ? (
    <div className={styles['splash-screen']} onClick={() => setShowSplash(false)}>
      <h1 className={styles['splash-luckiest']}>
        Une<br /><span className={styles['courgette']}>courgette</span><br />à<br />
        <span className={styles['bicyclette']}>bicyclette</span>
      </h1>
    </div>
  ) : finalScreen ? (
    <div className={styles['final-screen']}>
      <div className={styles['points-final']}>
        {points}/{total}
      </div>
      <div className={styles['final-message']}>
        {points === 10 && 'Quelle équipe hors pair !'}
        {points >= 7 && points <= 9 && 'Vous êtes une équipe efficace !'}
        {points >= 4 && points <= 6 && 
          "C'est pas mal, mais vous pouvez mieux faire !"}
        {points >= 0 && points <= 3 &&
          "Vous ne jouez pas en équipe. Allez, tous ensemble !"}
        <button className={styles['replay-btn']} onClick={handleReplay}>Rejouer</button>
      </div>
    </div>
  ) : (
    <div className={styles['app-root']} onClick={handleScreenTouch}>
      <div className={
        styles['points-bar'] +
        (animatePoints ? ' ' + styles['points-animate'] : '') +
        (shakePoints ? ' ' + styles['points-shake'] : '')
      }>Points: {points}/{total}</div>
      <div className={styles['main-question']}>
        <div className={styles['main-question-inner']}>
          <span className={styles['main-question-title']}>
            Est-ce que ça se peut{loading ? <span className={styles['loading-dots']}>{dots}</span> : '...'}
          </span>
          {!loading && typeof question === 'object' && question !== 'Est-ce que ça se peut...' ? (
            <span className={styles['combo']}>{question}</span>
          ) : (
            <span className={styles['combo']}>&nbsp;</span>
          )}
        </div>
      </div>
      <div className={styles['choices-bar']}>
        <span className={styles['choice'] + (inactive ? ' ' + styles['choice-inactive'] : '')} onClick={inactive ? undefined : handleAddPoint}>Tous d'accord !</span>
        <span className={styles['choice'] + (inactive ? ' ' + styles['choice-inactive'] : '')} onClick={inactive ? undefined : handleAddPoint}>Tous pas d'accord !</span>
        <span className={styles['choice'] + (inactive ? ' ' + styles['choice-inactive'] : '')} onClick={inactive ? undefined : handleAddTotal}>En désaccord...</span>
      </div>
    </div>
  )
}

export default App
