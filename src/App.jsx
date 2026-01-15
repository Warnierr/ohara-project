import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import LoadingScreen from './components/UI/LoadingScreen'
import HUD from './components/UI/HUD'
import DialogBox from './components/UI/DialogBox'
import ErrorLog from './components/UI/ErrorLog'
import Viewer from './components/Viewer'
import { useGameStore } from './stores/useGameStore'

export default function App() {
    const [loading, setLoading] = useState(true)
    const currentZone = useGameStore((state) => state.currentZone)
    const activeDialog = useGameStore((state) => state.activeDialog)

    // Viewer mode for testing models
    const isViewer = new URLSearchParams(window.location.search).has('viewer')

    useEffect(() => {
        // Simulate asset loading (skip in viewer mode)
        if (isViewer) return

        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [isViewer])

    if (isViewer) {
        return <Viewer />
    }

    return (
        <>
            {loading && <LoadingScreen />}
            <Scene />
            <HUD zoneName={currentZone} />
            {activeDialog && <DialogBox dialog={activeDialog} />}
            <ErrorLog />
        </>
    )
}
