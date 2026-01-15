import { useState, useEffect } from 'react'

const loadingTips = [
    "L'Arbre de la Connaissance contient plus de 5000 ans d'histoire...",
    "Les archéologues d'Ohara étudient les Ponéglyphes depuis des générations",
    "Robin a appris à lire les Ponéglyphes dès l'âge de 8 ans",
    "L'île d'Ohara était connue comme le centre du savoir mondial",
    "Utilisez WASD pour vous déplacer et la souris pour regarder autour de vous"
]

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0)
    const [currentTip] = useState(
        loadingTips[Math.floor(Math.random() * loadingTips.length)]
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 10
            })
        }, 200)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="loading-screen">
            <h1 className="loading-title">OHARA</h1>
            <div className="loading-progress">
                <div className="loading-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="loading-tip">{currentTip}</p>
        </div>
    )
}
