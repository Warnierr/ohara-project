# 🌳 OHARA - Scene Specification

## Direction Artistique

**Style** : Low-poly premium avec flat shading  
**Mood** : Paisible, contemplatif, atmosphère One Piece (île Ohara)  
**Référence visuelle** : Zelda BOTW low-poly + Monument Valley

---

## Palette Couleurs

### Primaire (Végétation)

```javascript
{
  foliageDark: '#2d5a2d',   // Feuillage base
  foliageMid: '#3a6b3a',    // Feuillage milieu
  foliageLight: '#478547',  // Feuillage sommet
  trunk: '#4a2c1a',         // Écorce arbre
  ground: '#5cb85c',        // Pelouse principale
  groundLight: '#7ec87e',   // Zone centrale
}
```

### Secondaire (UI/Accents)

```javascript
{
  accent: '#2d8659',        // Boutons, accents UI
  neonCyan: '#00fff5',      // Particules, glow
  neonPink: '#ff006e',      // Rare, highlights
  sky: '#87CEEB',           // Ciel jour
}
```

---

## Éclairage

### Setup Principal

**HDRI Environment**
- Preset : `"sunset"` (drei)
- Intensity : `1.0`
- Background : `false` (utilise color sky)

**Directional Light (Soleil)**
- Position : `[50, 100, 50]`
- Intensity : `1.2`
- Color : `0xfff7e6` (légèrement chaud)
- Shadows : `true` (mapSize 2048)

**Ambient Light**
- Intensity : `0.6`
- Color : `0xffffff`

**Hemisphere Light**
- Sky : `0x87CEEB` (bleu ciel)
- Ground : `0x5cb85c` (vert pelouse)
- Intensity : `0.7`

### Shadows Strategy

**Type** : AccumulativeShadows (drei)
- Temporal : `true`
- Frames : `100`
- Color : `#2d8659`
- Opacity : `0.65` (subtil)
- AlphaTest : `0.7`

---

## Caméra

### Position Initiale

```javascript
{
  position: [0, 15, 25],  // Vue 3/4 isométrique
  fov: 60,
  near: 0.1,
  far: 1000
}
```

### CameraRig Behavior

**Cinématique d'entrée** (2 secondes)
1. Start : `[0, 30, 40]` (loin, haut)
2. End : `[0, 15, 25]` (position normale)
3. LookAt : `[0, 2, 0]` (centre arbre)

**Contrôles utilisateur**
- Orbit limité :
  - Min distance : `10`
  - Max distance : `50`
  - Max polar angle : `Math.PI / 2.2` (pas sous le sol)
- Damping : `true` (factor 0.05)
- Auto-rotate : `false`

**Focus interactif**
- Click objet → Camera lerp vers objet + zoom `distance * 0.7`
- Durée transition : `1s`

---

## Objets Principaux

### 1. Arbre du Savoir (Centre)

**Position** : `[0, 0, 0]`

**LOD (Level of Detail)**
| Distance | Segments Tronc | Segments Feuillage | Details |
|----------|----------------|-------------------|---------|
| 0-20m    | 8              | 24                | + Racines apparentes |
| 20-50m   | 6              | 16                | Standard |
| 50m+     | 4              | 8                 | Simplifié |

**Animation**
- Balancement vent : Amplitude `0.05`, fréquence `0.2 Hz`
- Rotation lente : `Math.sin(time * 0.3) * 0.02` sur Z

**Matériaux**
- Tronc : `MeshStandardMaterial` flat shading, roughness `0.9`
- Feuillage : 3 nuances vertes dégradées

---

### 2. Forêt Environnante

**Instancing**
- Geometry partagée : `CylinderGeometry(0.3, 0.4, 4, 6)`
- Material partagé : `MeshStandardMaterial` (#3d2817, flat)
- Count : `13 instances`

**Positions** (pré-définies)
```javascript
[
  [-12, 0, 8], [12, 0, 10], [-15, 0, -5], [-18, 0, 5],
  [15, 0, -8], [20, 0, 2], [-10, 0, -15], [-5, 0, -18],
  [0, 0, -20], [5, 0, -18], [10, 0, -15], [-15, 0, -12],
  [15, 0, -12]
]
```

**Variations**
- Rotation Y aléatoire (seed stable)
- Scale : `0.8 - 1.4` (seed stable)

---

### 3. Sol & Pelouse

**Géométrie**
- Type : `CircleGeometry(50, 64)` (smooth)
- Rotation : `-Math.PI / 2` (horizontal)
- Receive shadows : `true`

**Matériau**
- Couleur principale : `#5cb85c`
- Zone centrale (rayon 8m) : `#7ec87e` (plus clair)
- Flat shading : `false` (smooth pour contraste avec arbres)
- Roughness : `0.85`

---

### 4. Fleurs (Instancing)

**5 couleurs × 30 instances = 150 fleurs**

| Couleur | Hex | Usage |
|---------|-----|-------|
| Rose | `#ff69b4` | Accent |
| Jaune doré | `#ffd700` | Lumineux |
| Rouge-orange | `#ff6347` | Chaud |
| Orchidée | `#da70d6` | Rare |
| Blanc | `#ffffff` | Pur |

**Distribution**
- Rayon : `5-20m` du centre (aléatoire seed)
- Height : `0.18` (au-dessus sol)
- Geometry : `ConeGeometry(0.12, 0.35, 6)` flat shading
- Tiges : `CylinderGeometry(0.02, 0.3, 4)` vert foncé

---

### 5. Particules Atmosphériques

**Count** : `5000`

**Caractéristiques**
- Size : `0.05`
- Color : `#4facfe` (cyan doux)
- Opacity : `0.6`
- Blending : `THREE.AdditiveBlending`

**Mouvement**
- Vitesse Y : `0.05` (montée lente)
- Vitesse XZ : `0.1` (dérive)
- Wrap : Reset Y à 0 quand > 30

**Rendu**
- Points material avec sizeAttenuation
- Transparent

---

## Post-Processing

### Stack (Ordre Important)

1. **N8AO** (Ambient Occlusion)
   - aoRadius : `1.5`
   - intensity : `1.5`

2. **Bloom**
   - intensity : `1.2`
   - luminanceThreshold : `0.9`
   - luminanceSmoothing : `0.9`
   - radius : `0.4`

3. **ToneMapping**
   - mode : `ACES_FILMIC`

4. **Vignette** (optionnel)
   - darkness : `0.5`
   - offset : `0.3`

**Config Renderer**
```javascript
antialias: false  // PostFX gère
stencil: false
alpha: false
powerPreference: 'high-performance'
```

---

## Interactions

### Arbre du Savoir

**Hover**
- Emissive : `#2d8659` intensity `0.3`
- Scale : `1.05` (léger)
- Cursor : `pointer`

**Click**
- Camera focus : Lerp vers `[0, 8, 12]`
- Tooltip 3D : "Arbre du Savoir" (Html drei)
- Particules burst : +200 particules temporaires

### Fleurs

**Hover**
- Scale : `1.2`
- Glow subtil (emissive)

**Click**
- Spawn particule pollen (seed couleur fleur)
- Son : `ding.mp3` (optionnel)

---

## Fog & Atmosphère

**Fog**
- Type : `THREE.Fog`
- Color : `#87CEEB` (match sky)
- Near : `40`
- Far : `120`

**Sky**
- Background color : `#87CEEB`
- Pas de skybox (solid color suffit pour low-poly)

---

## Audio (Futur)

**Ambiance**
- Oiseaux lointains (loop)
- Vent léger (layer subtil)
- Bruissement feuilles au hover arbre

**Interactions**
- Click : Son doux (crystal)
- Pas joueur : Herbe

---

## Performance Targets

| Métrique | Desktop | Mobile |
|----------|---------|--------|
| **FPS** | 60 | 30-45 |
| **Draw Calls** | <30 | <20 |
| **Triangles** | <50k | <30k |
| **Texture Memory** | <100MB | <50MB |

---

**Version** : 1.0  
**Status** : ✅ Approved  
**Dernière mise à jour** : 2026-01-15
