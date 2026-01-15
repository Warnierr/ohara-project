import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Ghibli-style Cel-Shading Material
 * 4 color bands for cartoon-like shading
 */
export const GhibliMaterial = shaderMaterial(
    // Uniforms
    {
        uLightPosition: new THREE.Vector3(10, 10, 5),
        uColorShadow: new THREE.Color('#2d5a4a'),
        uColorMid: new THREE.Color('#4a9d7a'),
        uColorLight: new THREE.Color('#7ec8a8'),
        uColorHighlight: new THREE.Color('#b8e8d4'),
    },
  // Vertex Shader
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  /* glsl */ `
    uniform vec3 uLightPosition;
    uniform vec3 uColorShadow;
    uniform vec3 uColorMid;
    uniform vec3 uColorLight;
    uniform vec3 uColorHighlight;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightPosition - vPosition);
      float NdotL = dot(normal, lightDir);
      
      // 4-band cel-shading
      vec3 color;
      if (NdotL > 0.7) {
        color = uColorHighlight;
      } else if (NdotL > 0.4) {
        color = uColorLight;
      } else if (NdotL > 0.1) {
        color = uColorMid;
      } else {
        color = uColorShadow;
      }
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

// Register the material
extend({ GhibliMaterial })
