import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Stage, Html } from '@react-three/drei'
import { Suspense, useState } from 'react'

/**
 * Model Comparator
 * Loads 'robin-meshy.glb' and 'robin-tripo.glb' from /public/assets/models/
 * Allows simple switching to compare quality.
 */
function Model({ path, scale = 1 }) {
    const { scene } = useGLTF(path, true) // true = useDraco if needed, simplified
    // Clone scene to avoid re-use issues
    return <primitive object={scene.clone()} scale={scale} position={[0, 0, 0]} />
}

export default function Viewer() {
    const [activeModel, setActiveModel] = useState('meshy') // 'meshy' or 'tripo'

    // Paths assuming files are renamed correctly in public/assets/models/
    const models = {
        meshy: '/assets/models/robin-meshy.glb',
        tripo: '/assets/models/robin-tripo.glb'
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
            <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
                <Suspense fallback={<Html center><div style={{ color: 'white' }}>Loading 3D Model...</div></Html>}>
                    <Stage environment="city" intensity={0.6} adjustCamera={true}>
                        <Model
                            key={activeModel}
                            path={models[activeModel]}
                            scale={0.01} /* Often Meshy/Tripo models come in huge, adjusting scale down */
                        />
                    </Stage>
                </Suspense>
                <OrbitControls makeDefault />
            </Canvas>

            {/* UI Overlay */}
            <div style={{
                position: 'fixed',
                top: 20, left: 20,
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                fontFamily: 'sans-serif'
            }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>🕵️ Model Inspector</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setActiveModel('meshy')}
                        style={{
                            padding: '8px 16px',
                            background: activeModel === 'meshy' ? '#4a9d7a' : '#444',
                            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}
                    >
                        Meshy GLB
                    </button>
                    <button
                        onClick={() => setActiveModel('tripo')}
                        style={{
                            padding: '8px 16px',
                            background: activeModel === 'tripo' ? '#4a9d7a' : '#444',
                            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}
                    >
                        Tripo GLB
                    </button>
                </div>
                <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#aaa' }}>
                    Current: <b>robin-{activeModel}.glb</b>
                </p>
            </div>
        </div>
    )
}
