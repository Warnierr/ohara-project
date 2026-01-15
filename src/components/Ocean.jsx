import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import '../shaders/ghibliShader' // Re-use ghibli shader for water base

export default function Ocean() {
    const meshRef = useRef()

    // Create a custom shader for water
    const waterMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorDeep: { value: new THREE.Color('#1a44a0') },
                uColorSurface: { value: new THREE.Color('#4fa4d6') },
            },
            vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Simple sine wave animation
          float elevation = sin(pos.x * 2.0 + uTime) * 0.2 
                          + sin(pos.z * 1.5 + uTime * 0.5) * 0.2;
                          
          pos.y += elevation;
          vElevation = elevation;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 uColorDeep;
        uniform vec3 uColorSurface;
        varying float vElevation;

        void main() {
          float mixStrength = (vElevation + 0.2) * 2.0;
          vec3 color = mix(uColorDeep, uColorSurface, mixStrength);
          
          gl_FragColor = vec4(color, 0.9); // 0.9 opacity
        }
      `,
            transparent: true,
        })
    }, [])

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
        }
    })

    return (
        <mesh ref={meshRef} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1000, 1000, 32, 32]} />
            <primitive object={waterMaterial} />
        </mesh>
    )
}
