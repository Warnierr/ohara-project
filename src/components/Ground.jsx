import { RigidBody } from '@react-three/rapier'
import '../shaders/ghibliShader'

export default function Ground() {
    return (
        <RigidBody type="fixed" colliders="cuboid">
            <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[50, 64]} />
                <ghibliMaterial
                    uColorShadow="#2d4a2d"
                    uColorMid="#5cb85c"
                    uColorLight="#7ec87e"
                    uColorHighlight="#b8e8d4"
                />
            </mesh>
        </RigidBody>
    )
}
