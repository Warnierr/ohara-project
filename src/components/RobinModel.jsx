import { useState } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'

/**
 * Robin Character with Model Comparison
 * Switch between Meshy and Tripo3D generated models
 */
export default function RobinModel({ modelSource = 'meshy' }) {
    const [activeModel, setActiveModel] = useState(modelSource)

    // Preload both models
    const meshyModel = useGLTF('/assets/models/robin-meshy.glb', true)
    const tripoModel = useGLTF('/assets/models/robin-tripo.glb', true)

    const currentModel = activeModel === 'meshy' ? meshyModel : tripoModel

    return (
        <RigidBody
            colliders={false}
            mass={1}
            type="dynamic"
            position={[0, 2, 10]}
            enabledRotations={[false, false, false]}
            linearDamping={0.5}
            angularDamping={1.0}
        >
            <CapsuleCollider args={[0.4, 0.3]} />

            {/* 3D Model */}
            <group>
                <primitive
                    object={currentModel.scene.clone()}
                    scale={0.01} // Adjust based on model size
                />
            </group>

            {/* Model Switcher UI (Dev only) */}
            {import.meta.env.DEV && (
                <Html position={[0, 2, 0]} center>
                    <div style={{
                        background: 'rgba(0,0,0,0.8)',
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <button
                            onClick={() => setActiveModel('meshy')}
                            style={{
                                background: activeModel === 'meshy' ? '#4a9d7a' : '#333',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Meshy
                        </button>
                        <button
                            onClick={() => setActiveModel('tripo')}
                            style={{
                                background: activeModel === 'tripo' ? '#4a9d7a' : '#333',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Tripo3D
                        </button>
                    </div>
                </Html>
            )}
        </RigidBody>
    )
}

// Preload both models
useGLTF.preload('/assets/models/robin-meshy.glb')
useGLTF.preload('/assets/models/robin-tripo.glb')
