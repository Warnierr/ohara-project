# 📚 CONTEXTE - Guide pour IA sur le projet OHARA

Ce document contient les spécifications techniques et les bonnes pratiques Three.js à **TOUJOURS** utiliser lors du développement assisté par IA.

## 🎯 Projet OHARA

**Inspiré de One Piece** - Mini-monde 3D multijoueur centré sur l'Arbre du Savoir, permettant aux joueurs d'explorer une pelouse paisible.

## 🔧 Stack Technique

| Composant | Version/Tech | Notes |
|-----------|--------------|-------|
| **Three.js** | `0.182.0` (r182) | Version fixée, ne PAS updater sans raison |
| **Build Tool** | Vite 7.2.4 | ES modules natifs |
| **Multijoueur** | Socket.io 4.8.3 | Client + Serveur Node.js |
| **Serveur** | Express 4.x | Port 3000 |
| **Client** | Vanilla JS ES6+ | Port 5173 (dev) |

---

## ⚠️ RÈGLES STRICTES POUR IA

### 1. Imports Three.js

**✅ TOUJOURS utiliser ces imports :**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
```

**❌ NE JAMAIS utiliser :**
```javascript
// FAUX - ancienne syntaxe
import { OrbitControls } from 'three/examples';
// FAUX - importmap non configuré
import THREE from 'https://cdn.jsdelivr.net/...';
```

### 2. Configuration Renderer (Template Obligatoire)

**Copier ce code exactement dans tous les nouveaux renderers :**
```javascript
this.renderer = new THREE.WebGLRenderer({ 
  antialias: window.devicePixelRatio < 2, // Désactive AA sur écrans haute densité
  powerPreference: "high-performance",
  alpha: false // Pas de transparence = gain perf
});

// CAP pixel ratio à 2x (mobile haute densité)
this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Ombres optimisées
this.renderer.shadowMap.enabled = true;
this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Compromis qualité/perf

// Frustum culling (automatique mais vérifier)
this.renderer.frustumCulled = true;
```

### 3. Loaders Asynchrones

**✅ UTILISER .loadAsync() avec async/await :**
```javascript
async loadModel(url) {
  const loader = new GLTFLoader();
  try {
    const gltf = await loader.loadAsync(url);
    this.scene.add(gltf.scene);
    return gltf;
  } catch (error) {
    console.error('Erreur chargement:', error);
  }
}
```

**❌ NE PAS utiliser callbacks :**
```javascript
// FAUX - ancien style
loader.load(url, (gltf) => { ... }, undefined, (error) => { ... });
```

### 4. Gestion Mémoire - DISPOSE OBLIGATOIRE

**Pattern à suivre pour tous les objets :**
```javascript
class MyComponent {
  dispose() {
    // Traverser récursivement
    this.object.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    
    // Supprimer de la scène
    this.scene.remove(this.object);
  }
}
```

### 5. Optimisations Performance

#### LOD (Level of Detail)
```javascript
const lod = new THREE.LOD();

// Proche (0-20m) - Détaillé
lod.addLevel(highDetailMesh, 0);

// Moyen (20-50m) - Normal
lod.addLevel(mediumDetailMesh, 20);

// Loin (50m+) - Simple
lod.addLevel(lowDetailMesh, 50);

scene.add(lod);
```

#### Instancing (pour objets répétés)
```javascript
// Au lieu de 100 meshes séparés (100 draw calls)
// Utiliser InstancedMesh (1 draw call)

const geometry = new THREE.SphereGeometry(0.5, 8, 8);
const material = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
const instancedMesh = new THREE.InstancedMesh(geometry, material, 100);

const dummy = new THREE.Object3D();
for (let i = 0; i < 100; i++) {
  dummy.position.set(Math.random() * 10, 0, Math.random() * 10);
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}

scene.add(instancedMesh);
```

#### Object Pooling (Multijoueur)
```javascript
class PlayerPool {
  constructor() {
    this.pool = [];
  }

  get() {
    return this.pool.pop() || this.createNewPlayer();
  }

  release(player) {
    player.visible = false;
    this.pool.push(player);
  }

  createNewPlayer() {
    // Création coûteuse une seule fois
    return new Player();
  }
}
```

### 6. Textures

**Règles strictes :**
- Taille en **power-of-2** : 256, 512, 1024, 2048 (max)
- Format : JPG pour photos, PNG pour transparence
- Compression : `texture.minFilter = THREE.LinearMipmapLinearFilter;`

```javascript
const textureLoader = new THREE.TextureLoader();
const texture = await textureLoader.loadAsync('grass.jpg');

// Vérifier taille (doit être 256, 512, 1024, 2048)
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
```

### 7. Animation Loop - Pas de New Objects

**❌ NE JAMAIS créer d'objets dans animate() :**
```javascript
// FAUX - memory leak
animate() {
  const cube = new THREE.Mesh(...); // ❌ INTERDIT
  scene.add(cube);
}
```

**✅ TOUJOURS réutiliser des objets existants :**
```javascript
// CORRECT
init() {
  this.cube = new THREE.Mesh(...);
  this.scene.add(this.cube);
}

animate() {
  this.cube.rotation.y += 0.01; // ✅ Modification d'existant
}
```

---

## 📊 Checklist Performance

Avant de déployer ou proposer du code, **VÉRIFIER** :

- [ ] `renderer.info.render.calls` **< 100** (draw calls)
- [ ] `renderer.info.memory.geometries` **stable** (pas de croissance)
- [ ] Textures **power-of-2** et **< 2048px**
- [ ] `dispose()` méthode **implémentée** sur tous les composants
- [ ] Pas de `new THREE.Object3D()` dans `animate()`
- [ ] LOD **activé** sur objets complexes (> 1000 polygones)
- [ ] Instancing **utilisé** si > 10 objets identiques
- [ ] PixelRatio **capped** à 2x

---

## 🎨 Structure du Projet OHARA

```
OHARA/
├── src/
│   ├── Scene.js          # Setup Three.js principal
│   ├── OharaTree.js      # Arbre du Savoir (LOD 3 niveaux)
│   ├── Environment.js    # Pelouse, fleurs, ciel
│   ├── Player.js         # Avatar joueur
│   ├── Controls.js       # Input WASD
│   └── Network.js        # Client Socket.io
├── server/
│   ├── index.js          # Serveur Express + Socket.io
│   └── Game.js           # State multijoueur
├── index.html            # UI (login, HUD)
└── main.js               # Point d'entrée
```

---

## 🧪 Debug & Testing

### Console Commands
```javascript
// Dans console navigateur
window.scene.renderer.info.render.calls; // Nombre draw calls
window.scene.renderer.info.memory.geometries; // Géométries en mémoire

// forcer update LOD
window.scene.oharaTree.lod.update(camera);
```

### Stats.js (Performance Monitor)
```javascript
import Stats from 'three/examples/jsm/libs/stats.module.js';

this.stats = new Stats();
document.body.appendChild(this.stats.dom);

animate() {
  this.stats.update(); // Affiche FPS
}
```

### Chrome DevTools
1. **Performance tab** → Enregistrer 10 secondes
2. Vérifier **FPS >= 55**
3. Chercher **Long Tasks** (> 50ms)
4. **Memory tab** → Heap snapshot avant/après
5. **Rendering** → Frame Rendering Stats

---

## 🚨 Erreurs Courantes à Éviter

### ❌ Problème : "OrbitControls is not a constructor"
**Cause :** Mauvais import path  
**Solution :**
```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

### ❌ Problème : Memory leak après 5 minutes
**Cause :** Géométries/matériaux non disposés  
**Solution :** Implémenter `dispose()` partout

### ❌ Problème : FPS < 30
**Cause :** Trop de draw calls ou geometries complexes  
**Solution :** LOD + Instancing + Frustum culling

### ❌ Problème : Textures floues
**Cause :** PixelRatio non configuré ou taille non power-of-2  
**Solution :** `setPixelRatio(Math.min(devicePixelRatio, 2))`

---

## 📝 Prompt Template pour IA

Utiliser ce template pour toute demande de code Three.js :

```
Génère du code Three.js r182 pour [DESCRIPTION].

CONTRAINTES :
- Utilise ES modules (import/export)
- Importe OrbitControls depuis 'three/examples/jsm/controls/OrbitControls.js'
- Configure renderer avec powerPreference: "high-performance" et pixelRatio capped à 2
- Implémente dispose() pour cleanup
- Vérifie que draw calls < 100
- Utilise LOD si > 1000 polygones
- Utilise InstancedMesh si > 10 objets identiques

CONTEXTE PROJET :
- Version Three.js : 0.182.0
- Build tool : Vite
- Target : 60 FPS, compatible mobile
```

---

## 🎯 Objectifs Performance

| Métrique | Cible | Critique |
|----------|-------|----------|
| **FPS** | >= 55 | >= 30 |
| **Draw Calls** | < 50 | < 100 |
| **Memory** | Stable | +0 MB/min |
| **Load Time** | < 2s | < 5s |

---

**Dernière mise à jour :** 2026-01-15  
**Maintainer :** Projet OHARA  
**Version Three.js :** r182 (0.182.0)
