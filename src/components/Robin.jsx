import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Robin() {
    const playerRef = useRef()
    const { camera } = useThree()

    // Load the model
    const { scene } = useGLTF('/assets/models/robin.glb')

    // Camera state
    const cameraState = useRef({
        horizontal: 0,
        vertical: 0.4,
        distance: 8
    })
    const isMouseDown = useRef(false)

    // Movement state
    const velocity = useRef(new THREE.Vector3(0, 0, 0))
    const direction = useRef(new THREE.Vector3())
    const isGrounded = useRef(true)
    const keys = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        reset: false
    })

    const logError = console.error

    // Apply Material (Toon Shader + Texture Preservation)
    useEffect(() => {
        if (!scene) return
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true

                // Check if mesh has texture
                if (child.material.map) {
                    // Use Toon material to keep texture but have anime shading
                    child.material = new THREE.MeshToonMaterial({
                        map: child.material.map,
                        color: 0xffffff,
                        gradientMap: null // Smooth toon
                    })
                } else {
                    // Keep original color if no texture
                    child.material = new THREE.MeshToonMaterial({
                        color: child.material.color || 0xffffff,
                    })
                }
            }
        })
    }, [scene])

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Mapping AZERTY & QWERTY physically
            if (e.code === 'KeyW' || e.code === 'KeyZ') keys.current.forward = true
            if (e.code === 'KeyS') keys.current.backward = true
            if (e.code === 'KeyA' || e.code === 'KeyQ') keys.current.left = true
            if (e.code === 'KeyD') keys.current.right = true

            if (e.code === 'Space') keys.current.jump = true

            // Reset
            if (e.code === 'KeyR' && playerRef.current) {
                playerRef.current.setTranslation({ x: 0, y: 2, z: 10 }, true)
                playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
                playerRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
                cameraState.current = { horizontal: 0, vertical: 0.4, distance: 8 }
            }
        }

        const handleKeyUp = (e) => {
            if (e.code === 'KeyW' || e.code === 'KeyZ') keys.current.forward = false
            if (e.code === 'KeyS') keys.current.backward = false
            if (e.code === 'KeyA' || e.code === 'KeyQ') keys.current.left = false
            if (e.code === 'KeyD') keys.current.right = false
            if (e.code === 'Space') keys.current.jump = false
        }

        const handleMouseDown = (e) => { if (e.button === 2) isMouseDown.current = true }
        const handleMouseUp = (e) => { if (e.button === 2) isMouseDown.current = false }

        const handleMouseMove = (e) => {
            if (isMouseDown.current) {
                cameraState.current.horizontal -= e.movementX * 0.003
                cameraState.current.vertical -= e.movementY * 0.002
                cameraState.current.vertical = Math.max(0.1, Math.min(1.5, cameraState.current.vertical))
            }
        }

        // Zoom handling
        const handleWheel = (e) => {
            const sensitivity = 0.005
            cameraState.current.distance += e.deltaY * sensitivity
            // Clamp zoom
            cameraState.current.distance = Math.max(3, Math.min(20, cameraState.current.distance))
        }

        const handleContextMenu = (e) => e.preventDefault()

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('wheel', handleWheel, { passive: true })
        window.addEventListener('contextmenu', handleContextMenu)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('wheel', handleWheel)
            window.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [])

    useFrame((state, delta) => {
        if (!playerRef.current) return

        try {
            const player = playerRef.current
            const pos = player.translation()
            const currentVel = player.linvel()

            const forward = keys.current.forward
            const backward = keys.current.backward
            const left = keys.current.left
            const right = keys.current.right
            const jump = keys.current.jump

            const camAngle = cameraState.current.horizontal
            const forwardDir = new THREE.Vector3(Math.sin(camAngle), 0, Math.cos(camAngle))
            const rightDir = new THREE.Vector3(Math.cos(camAngle), 0, -Math.sin(camAngle))

            direction.current.set(0, 0, 0)
            if (forward) direction.current.add(forwardDir)
            if (backward) direction.current.sub(forwardDir)

            // INVERTED LOGIC FIX for User
            if (right) direction.current.sub(rightDir) // Swapped from add
            if (left) direction.current.add(rightDir)  // Swapped from sub

            direction.current.normalize()

            const speed = 3
            velocity.current.x = direction.current.x * speed
            velocity.current.y = currentVel.y
            velocity.current.z = direction.current.z * speed

            if (jump && isGrounded.current && Math.abs(currentVel.y) < 0.5) {
                velocity.current.y = 5
                isGrounded.current = false
            }

            if (!forward && !backward && !left && !right) {
                velocity.current.x *= 0.8
                velocity.current.z *= 0.8
            }

            player.setLinvel(velocity.current, true)

            // Camera follows
            const camDist = cameraState.current.distance
            const targetCamPos = new THREE.Vector3(
                pos.x - Math.sin(camAngle) * camDist,
                pos.y + (camDist * 0.4) + 2,
                pos.z - Math.cos(camAngle) * camDist
            )

            camera.position.lerp(targetCamPos, delta * 8)
            camera.lookAt(pos.x, pos.y + 1.2, pos.z)

        } catch (error) {
            logError('Frame loop error', error)
        }
    })

    return (
        <RigidBody
            ref={playerRef}
            colliders={false}
            mass={1}
            type="dynamic"
            position={[0, 2, 10]}
            enabledRotations={[false, false, false]}
            linearDamping={2.0}
            angularDamping={1.0}
            onCollisionEnter={() => { isGrounded.current = true }}
        >
            <CapsuleCollider args={[0.3, 0.4]} position={[0, 0.7, 0]} />

            {/* 3D Model - Raised Y position to fix feet sinking */}
            <group rotation={[0, -Math.PI, 0]} position={[0, 0.38, 0]}>
                <primitive
                    object={scene}
                    scale={0.6}
                />
            </group>
        </RigidBody>
    )
}
useGLTF.preload('/assets/models/robin.glb')
