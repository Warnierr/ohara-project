# 🎨 OHARA - Références Visuelles & Direction Artistique Moderne

## ⚠️ Constat : Le Style Low-Poly 2017 est Daté

**Problème actuel** : Géométrie low-poly brute sans éclairage avancé = aspect "démo technique 2017"

**Solution** : Stylized réaliste avec rendu premium (Ghibli/BOTW/Fortnite-like)

---

## 🎯 Direction Artistique Cible

### Styles Dominants 2024-2026

**1. Stylized Réaliste**
- Inspiration : Studio Ghibli, Zelda BOTW, Fortnite, Monument Valley
- Géométrie simple MAIS rendu riche
- Colors vibrantes mais harmonisées
- Lighting naturel et doux

**2. Minimal Ultra-Qualitatif**
- Moins d'objets, plus de matière
- PBR materials propres
- Post-processing subtil
- Caméras cinématiques

**3. Narrative & Immersion**
- Scène = interface, pas démo
- UI 2D intégrée dans la 3D
- Micro-interactions contextuelles
- Focus caméra sur événements

---

## 📊 Comparaison : Actuel vs Moderne

| Élément | ❌ Actuel (2017) | ✅ Moderne (2025) |
|---------|------------------|-------------------|
| **Géométrie** | Low-poly brut | Stylized / simple mais propre |
| **Lighting** | Basique (1-2 lights) | HDRI + shadows douces + rim |
| **Caméra** | Statique OrbitControls | Cinématique guidée + lerp |
| **Animation** | Rotation basique | Narrative + micro-mouvements |
| **Post-FX** | Aucun | Bloom + Vignette + ToneMapping |
| **UX** | Quasi absente | Centrale (tooltips, focus, feedback) |
| **Perception** | "Demo tech" | "Produit premium" |

---

## 🌈 Tendances Visuelles 2025

### Éclairage Premium

**Obligatoire**
- ✅ **HDRI Environment** (Poly Haven)
- ✅ **Soft Shadows** (AccumulativeShadows ou ContactShadows)
- ✅ **Three-point lighting** (Key + Fill + Rim)
- ✅ **Color temperature** naturelle (warm/cool balance)

**Interdictions**
- ❌ Scènes "flat" sans depth
- ❌ Ombres dures et noires
- ❌ Éclairage uniforme

### Post-Processing Moderne

**Stack minimale obligatoire**
```typescript
<EffectComposer>
  <Bloom intensity={1.2} threshold={0.9} />
  <Vignette darkness={0.5} />
  <ToneMapping mode={ACES_FILMIC} />
</EffectComposer>
```

**Effets avancés** (si budget perf)
- Depth of Field léger (focus cinématique)
- SSAO/N8AO (ambient occlusion)
- Color grading subtil

---

## 🎥 Caméras Cinématiques

### Animations Modernes

**Au lieu de** : OrbitControls libre  
**Utiliser** :
- Camera dolly animée (GSAP/Framer Motion)
- Parallax on scroll
- Focus automatique sur hover/click
- Transitions fluides entre vues

**Outils**
- **Theatre.js** : Timelines cinématiques
- **GSAP** : Tweens camera position/target
- **Framer Motion 3D** : Spring animations

### Exemple Pattern

```typescript
// ❌ ANCIEN - OrbitControls libre
<OrbitControls />

// ✅ MODERNE - CameraRig guidé
function CameraRig() {
  const { camera } = useThree()
  
  useFrame((state, delta) => {
    // Parallax on mouse
    const mouse = state.mouse
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.x * 2,
      delta * 2
    )
    
    // Auto-rotate lent
    camera.position.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * 0.05
    )
  })
}
```

---

## 🖼️ Références Visuelles (à Viser)

### 1. Stylized Nature (Inspiration Directe OHARA)

**Caractéristiques**
- Couleurs saturées mais harmonieuses
- Formes organiques simplifiées
- Éclairage doux et naturel
- Ombres douces et colorées

**Exemples**
- Zelda BOTW : Arbres stylisés + HDRI sky
- Genshin Impact : Color grading vibrant
- Sea of Thieves : Water shading + cartoon style

### 2. Minimal Premium

**Caractéristiques**
- Géométrie épurée
- Matériaux PBR réalistes
- Negative space intelligent
- Focus sur lighting quality

**Exemples**
- Apple product pages (3D viewer)
- Stripe illustrations 3D
- Linear.app landing

### 3. Interactive Storytelling

**Caractéristiques**
- Caméra narrative
- UI contextuelle 3D
- Micro-interactions riches
- Progression visuelle

**Exemples**
- The Boat (interactive story)
- Bruno Simon Portfolio
- Ouigo Let's Play

### 4. Low-Poly MAIS Premium

**Caractéristiques**
- Flat shading avec éclairage riche
- Post-processing soigné
- Animations fluides
- Color palette cohérente

**Exemples**
- Monument Valley (mobile)
- Alto's Adventure
- Firewatch (stylized realism)

---

## 🎨 Palette & Style OHARA Moderne

### Évolution Proposée

**Avant** (2017 style)
```javascript
// Couleurs basiques, plates
ground: 0x1a4d2e  // Vert très foncé
tree: 0x3d2817    // Marron basique
```

**Après** (2025 style)
```javascript
// Palette harmonisée, vibrant mais naturel
palette: {
  // Greens (Ghibli-inspired)
  grassLight: '#7ec87e',    // Herbe lumière
  grassBase: '#5cb85c',      // Herbe base
  grassDark: '#4a9d4a',      // Herbe ombre
  
  // Browns (warm)
  trunkLight: '#8b6f47',     // Écorce lumière
  trunkBase: '#6b4e2e',      // Écorce base
  trunkDark: '#4a2c1a',      // Écorce ombre
  
  // Accent (UI)
  accent: '#2d8659',         // Vert OHARA
  highlight: '#ffd700',      // Gold (rare, précieux)
  
  // Sky & Atmosphere
  skyTop: '#5fa8d3',         // Bleu ciel haut
  skyHorizon: '#b8d4e8',     // Bleu ciel horizon
  fog: '#c5e3f0'             // Brume distance
}
```

### Color Grading

**Temperature**
- Morning : Warm (orange tint)
- Noon : Neutral
- Evening : Cool (blue/purple tint)

**Saturation**
- Base : 1.2× (légèrement saturé)
- Highlights : 0.9× (désaturé en lumière)
- Shadows : 1.3× (saturé dans ombres)

---

## 🛠️ Stack Moderne Complète (2025)

### Core 3D

```json
{
  "three": "^0.170.0",
  "@react-three/fiber": "^8.17.0",
  "@react-three/drei": "^9.120.0",
  "@react-three/postprocessing": "^2.16.0"
}
```

### Animation & Interaction

```json
{
  "framer-motion-3d": "^11.11.0",
  "gsap": "^3.12.5",
  "@theatre/core": "^0.5.0",  // Optionnel (cinématiques)
  "@theatre/studio": "^0.5.0"
}
```

### Physics (Si Nécessaire)

```json
{
  "@react-three/rapier": "^1.4.0"  // Moderne, performant
}
```

### State & Utils

```json
{
  "zustand": "^5.0.1",
  "leva": "^0.9.35",           // Debug GUI
  "r3f-perf": "^7.2.1",        // Performance monitoring
  "maath": "^0.10.8"           // Math utilities
}
```

---

## 📦 Assets Sources (Open-Source Priority)

### Modèles 3D

**Free & High Quality**
1. **Poly Haven** (https://polyhaven.com)
   - HDRI environments (gratuit)
   - Textures PBR 8K
   - Modèles nature

2. **Kenney.nl** (https://kenney.nl)
   - Style low-poly moderne
   - CC0 (domaine public)
   - 40,000+ assets

3. **Quaternius** (https://quaternius.com)
   - Stylized characters & props
   - CC0
   - Parfait pour OHARA style

4. **Sketchfab** (https://sketchfab.com)
   - Filtering : "Downloadable + Free"
   - Qualité variable mais énorme choix

### Textures PBR

1. **Poly Haven** (meilleur gratuit)
2. **AmbientCG** (CC0 textures)
3. **3D Textures** (3dtextures.me)

### HDRI Environments

1. **Poly Haven** (16K gratuit)
2. **HDRI Haven** (même source)

**Recommandé OHARA**
- `forest_slope_2k.hdr`
- `small_hangar_01_2k.hdr`
- `rural_landscape_2k.hdr`

---

## 🎬 Animations & Micro-Interactions

### Entrée de Scène (Première Visite)

```typescript
// Cinématique d'introduction
function IntroSequence() {
  const { camera } = useThree()
  
  useEffect(() => {
    gsap.timeline()
      .from(camera.position, {
        y: 50,
        z: 50,
        duration: 2,
        ease: 'power2.out'
      })
      .to(camera, {
        fov: 60,
        duration: 1,
        onUpdate: () => camera.updateProjectionMatrix()
      }, '<')
  }, [])
}
```

### Hover Interactions

```typescript
// Glow subtil sur hover
const [hovered, setHovered] = useState(false)

<mesh
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
>
  <meshStandardMaterial
    emissive="#2d8659"
    emissiveIntensity={hovered ? 0.5 : 0}
  />
</mesh>
```

### Click Focus

```typescript
// Focus caméra sur objet cliqué
function focusOnObject(position) {
  gsap.to(camera.position, {
    x: position.x + 5,
    y: position.y + 3,
    z: position.z + 5,
    duration: 1.5,
    ease: 'power2.inOut'
  })
}
```

---

## 🏆 Objectif Final : "Premium Web Product"

### Checklist Qualité Visuelle

- [ ] HDRI environment active
- [ ] 3-point lighting setup
- [ ] Soft shadows (pas de noir dur)
- [ ] Post-processing (Bloom + Vignette + ToneMapping)
- [ ] Camera cinématique (pas OrbitControls libre)
- [ ] Color palette harmonisée (4-6 couleurs max)
- [ ] Animations subtiles (vent, particules, micro-mouvements)
- [ ] UI/UX intégrée (tooltips, focus, feedback)
- [ ] Transitions fluides (entrée, hover, click)
- [ ] Performance 60 FPS desktop

### Perception Cible

**Avant** : "C'est une démo Three.js"  
**Après** : "C'est un produit premium, immersif, professionnel"

---

## 📚 Ressources d'Apprentissage

### Tutoriels Modernes

1. **Three.js Journey** (https://threejs-journey.com)
   - Bruno Simon (meilleur cours)
   - Style moderne, animations, shaders
   - $95 lifetime (vaut chaque centime)

2. **Awwwards.com** (section 3D)
   - Références visuelles ultra-premium
   - Analyse de sites primés

3. **Codrops** (https://tympanus.net/codrops)
   - Tutorials gratuits
   - Effets modernes

### Communautés

- **r/threejs** (Reddit)
- **Poimandres Discord** (R3F officiel)
- **Three.js Discourse** (forum officiel)

---

## 🎯 Prochaines Étapes (Agents)

### Phase 1 : Foundation Visuelle
1. Intégrer HDRI environment (Poly Haven)
2. Setup 3-point lighting (Key + Fill + Rim)
3. Ajouter AccumulativeShadows
4. Implémenter post-processing stack

### Phase 2 : Animation & Caméra
5. Créer CameraRig cinématique
6. Ajouter intro sequence (GSAP)
7. Implémenter hover effects
8. Focus camera on click

### Phase 3 : Polish & UX
9. Color grading (palette harmonisée)
10. Micro-animations (vent, particules)
11. UI tooltips 3D
12. Performance optimization

---

**Version** : 1.0  
**Dernière mise à jour** : 2026-01-15  
**Status** : ✅ Direction Approuvée  
**Référence** : Zelda BOTW + Ghibli + Monument Valley
