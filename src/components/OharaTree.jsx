import { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { RigidBody, CylinderCollider, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import '../shaders/ghibliShader'

export default function OharaTree() {
    // Load the tree model
    const [model, setModel] = useState(null)

    useEffect(() => {
        // Attempt load with proper GLTFLoader
        const loader = new GLTFLoader()
        loader.load(
            '/assets/models/tree.glb',
            (gltf) => setModel(gltf.scene),
            undefined,
            (error) => console.log('Waiting for tree.glb...', error)
        )
    }, [])

    // Apply Ghibli Shader
    useEffect(() => {
        if (!model) return
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true

                if (child.material.map) {
                    child.material = new THREE.MeshToonMaterial({
                        map: child.material.map,
                        color: 0xffffff,
                    })
                } else {
                    // Apply colors based on name
                    const isLeaf = child.name.toLowerCase().includes('leaf') ||
                        child.name.toLowerCase().includes('foliage') ||
                        child.name.toLowerCase().includes('green')

                    if (isLeaf) {
                        child.material = new THREE.MeshToonMaterial({ color: '#5cb85c' })
                    } else {
                        child.material = new THREE.MeshToonMaterial({ color: '#5a4a3a' }) // Brown trunk
                    }
                }
            }
        })
    }, [model])

    return (
        <group position={[0, 8, 0]}>
            {/* Physics Body - Fixed */}
            {/* Reverting to simple collider to avoid physics engine crash with high-poly model */}
            <RigidBody type="fixed" colliders={false}>
                <CylinderCollider args={[10, 5, 10]} position={[0, 10, 0]} />

                {/* Physical Trunk collision (Invisible helper) */}
                {/* We can add more primitives here if needed for roots */}

                {/* Visual Model */}
                {model && (
                    <primitive
                        object={model}
                        scale={12}
                        position={[0, 0, 0]}
                    />
                )}
            </RigidBody>

            {/* Door Trigger Zone */}
            <RigidBody type="fixed" sensor onIntersectionEnter={() => console.log("🚪 Enter Library (Triggered)")}>
                <CuboidCollider args={[0.8, 1, 0.8]} position={[2.5, -4, 1.5]} />
                {/* Debug helper to see the door zone (remove later) */}
                {import.meta.env.DEV && (
                    <mesh position={[2.5, -4, 1.5]}>
                        <boxGeometry args={[1.6, 2, 1.6]} />
                        <meshBasicMaterial color="yellow" wireframe />
                    </mesh>
                )}
            </RigidBody>

            {!model && (
                // Fallback procedural tree
                <group>
                    <mesh position={[0, 10, 0]} castShadow receiveShadow>
                        <cylinderGeometry args={[4, 6, 20, 16]} />
                        <ghibliMaterial uColorShadow="#2d3d5a" uColorMid="#4a5a8a" uColorLight="#6a7aaa" uColorHighlight="#8a9aca" />
                    </mesh>
                    <mesh position={[0, 22, 0]} castShadow>
                        <sphereGeometry args={[12, 16, 16]} />
                        <ghibliMaterial uColorShadow="#2d4a2d" uColorMid="#5cb85c" uColorLight="#7ec87e" uColorHighlight="#b8e8d4" />
                    </mesh>
                </group>
            )}
        </group>
    )
}
