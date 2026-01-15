import { Canvas, extend } from '@react-three/fiber'
import { Environment, AccumulativeShadows, RandomizedLight, Sky, KeyboardControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import Robin from './Robin'
import OharaTree from './OharaTree'
import Ground from './Ground'
import InteractiveBook from './InteractiveBook'
import Ocean from './Ocean'

export default function Scene() {
    const isDev = import.meta.env.DEV

    return (
        <Canvas
            shadows
            camera={{ position: [15, 8, 15], fov: 60 }}
            gl={{
                antialias: true,
                powerPreference: 'high-performance',
                pixelRatio: Math.min(window.devicePixelRatio, 2)
            }}
        >
            {/* Performance Monitor (Dev Only) */}
            {isDev && <Perf position="top-left" />}

            {/* Sky & Environment */}
            <Sky
                sunPosition={[100, 20, 100]}
                inclination={0.6}
                azimuth={0.25}
                turbidity={8}
                rayleigh={2}
            />

            {/* Lighting */}
            <directionalLight
                position={[10, 10, 5]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />
            <ambientLight intensity={0.4} />

            {/* Soft Shadows */}
            <AccumulativeShadows
                temporal
                frames={100}
                alphaTest={0.85}
                position={[0, 0, 0]}
                scale={50}
                opacity={0.7}
            >
                <RandomizedLight position={[10, 10, 5]} amount={8} radius={5} />
            </AccumulativeShadows>

            {/* Physics World */}
            <Physics gravity={[0, -9.81, 0]}>
                <Robin />
                <Ground />
                <OharaTree />

                {/* Interactive Book (MVP Demo) */}
                <InteractiveBook
                    position={[5, 0.5, 0]}
                    title="Histoire d'Ohara"
                    content="L'île d'Ohara était autrefois un centre de savoir et de recherche historique. Les archéologues cherchaient à comprendre le siècle oublié..."
                />
            </Physics>

            {/* Post-Processing */}
            <EffectComposer>
                <Bloom
                    intensity={1.2}
                    threshold={0.9}
                    luminanceThreshold={0.9}
                    luminanceSmoothing={0.9}
                />
                <Vignette darkness={0.5} />
                <ToneMapping mode={ToneMapping.ACES_FILMIC} />
            </EffectComposer>
        </Canvas>
    )
}
