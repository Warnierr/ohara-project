import { useState } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { Html } from '@react-three/drei'
import { useGameStore } from '../stores/useGameStore'

export default function InteractiveBook({ position, title, content }) {
    const [hovered, setHovered] = useState(false)
    const showDialog = useGameStore((state) => state.showDialog)

    const { scale, emissiveIntensity } = useSpring({
        scale: hovered ? 1.1 : 1,
        emissiveIntensity: hovered ? 0.3 : 0,
        config: { tension: 300, friction: 10 }
    })

    const handleClick = () => {
        showDialog({
            speaker: 'Livre',
            title,
            content
        })
    }

    return (
        <animated.mesh
            position={position}
            scale={scale}
            onClick={handleClick}
            onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
                setHovered(false)
                document.body.style.cursor = 'auto'
            }}
            castShadow
        >
            <boxGeometry args={[0.3, 0.4, 0.05]} />
            <animated.meshStandardMaterial
                color="#8B4513"
                emissive="#ffd700"
                emissiveIntensity={emissiveIntensity}
            />

            {hovered && (
                <Html position={[0, 0.5, 0]} center>
                    <div style={{
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        whiteSpace: 'nowrap'
                    }}>
                        Cliquer pour lire
                    </div>
                </Html>
            )}
        </animated.mesh>
    )
}
