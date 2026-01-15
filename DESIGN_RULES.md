# 🎨 OHARA - Design & Code Rules (AGENTS IA)

## ⚠️ CONSTITUTION DU PROJET - NON NÉGOCIABLE

Ce document définit les **règles absolues** pour le développement d'OHARA. Tous les agents IA doivent suivre ces guidelines sans exception.

---

## 0️⃣ Objectif Non Négociable

**Le rendu doit viser "premium web product"**
- Éclairage HDR naturel
- Ombres douces et propres
- Post-processing subtil (jamais cheap)
- Interactions fluides et cinématiques
- **Perception > Complexité** : 10 objets parfaits > 200 objets médiocres

---

## 1️⃣ Style Visuel : Low-Poly Premium

### Shading

✅ **OBLIGATOIRE** : Flat shading pour esthétique low-poly moderne
```javascript
material.flatShading = true
// OU
geometry.computeFlatVertexNormals()
```

### Palette Couleurs

**Règles strictes**
- Maximum **4-6 couleurs** par scène
- Saturation moyenne, contrastes doux
- Verts/ocres/terres pour végétation
- 1 accent color max (UI/props rares)

**Palette OHARA**
```javascript
const OHARA_PALETTE = {
  // Végétation (3 nuances)
  foliageDark: 0x2d5a2d,
  foliageMid: 0x3a6b3a,
  foliageLight: 0x478547,
  
  // Terre
  trunk: 0x4a2c1a,
  ground: 0x5cb85c,
  
  // Accent
  accent: 0x2d8659, // UI primary
  neon: 0x00fff5,   // Effects
}
```

### Lumière

**Budget lumière**
- Maximum **1-2 lights** actives
- HDRI environment obligatoire (drei `<Environment />`)
- Éviter ombres ultra-dures
- Lisibilité prime sur réalisme

**Setup obligatoire**
```typescript
<Environment preset="sunset" />
<directionalLight intensity={1.2} castShadow />
<ambientLight intensity={0.6} />
```

---

## 2️⃣ Architecture : Composants Réutilisables

### Structure Obligatoire

```
src/
├── 3d/
│   ├── canvas/           # Canvas wrapper, perf, DPR
│   ├── scenes/           # ForestScene, LandingScene
│   ├── objects/          # Trees, Ground, Props
│   ├── materials/        # PBR materials, matcaps
│   ├── lights/           # LightRig, Environment setup
│   ├── effects/          # PostFX, Fog, Particles
│   ├── controls/         # CameraRig, Input handlers
│   └── systems/          # AssetLoader, PerfBudget, LOD
├── ui/                   # HUD, tooltips, panels
├── state/                # Zustand stores
└── lib/                  # Utils, helpers
```

### Règles Composants

❌ **INTERDIT** : God components de +200 lignes  
✅ **OBLIGATOIRE** : Composants petits, réutilisables, single responsability

```typescript
// ❌ MAUVAIS
function Scene() {
  // 800 lignes avec tout dedans
}

// ✅ BON
function ForestScene() {
  return (
    <>
      <LightRig />
      <Environment />
      <Ground />
      <TreesInstanced />
      <Particles />
      <CameraRig />
    </>
  )
}
```

---

## 3️⃣ Design Budget (Qualité Visuelle)

### Checklist Obligatoire par Scène

Chaque scène **DOIT** avoir :

- ✅ **HDRI environment** (`<Environment preset="..." />`)
- ✅ **Shadow strategy** (ContactShadows ou AccumulativeShadows)
- ✅ **Color pipeline** cohérent (palette définie)
- ✅ **Fog** subtile pour profondeur
- ✅ **Post-processing** minimal (Bloom + Vignette + ToneMapping)
- ✅ **CameraRig** cinématique (lerp, parallax)
- ✅ **Animation** vivante (vent, micro-mouvements, particules)

### Interdictions Absolues

❌ Pas de scène sans HDRI  
❌ Pas de `MeshBasicMaterial` en rendu final  
❌ Pas d'ombres ultra-dures par défaut  
❌ Pas de `rotation += 0.01` comme seule animation  
❌ Pas de couleurs aléatoires "flashy"

---

## 4️⃣ Performance Budget (Non Négociable)

### Cibles FPS

| Device | Target FPS | Minimum Acceptable |
|--------|------------|-------------------|
| Desktop | 60 stable | 55 |
| Laptop moyen | 45-60 | 40 |
| Mobile | 30-45 | 25 |

### Règles Perf Absolues

**DPR (Device Pixel Ratio)**
```typescript
<Canvas dpr={[1, 1.5]} /> // Jamais 2 constant
```

**Instancing OBLIGATOIRE**
```typescript
// ❌ INTERDIT
{trees.map(t => <Tree position={t.pos} />)}

// ✅ OBLIGATOIRE
<Instances limit={100}>
  <TreeGeometry />
  <TreeMaterial />
  {trees.map((t, i) => <Instance key={i} position={t.pos} />)}
</Instances>
```

**Textures**
- Max **2K** desktop, **1K** mobile
- Compression KTX2/Basis si production
- Mipmaps obligatoires

**Polygon Budget**
- Rester bas, qualité via shading
- LOD obligatoire pour objets complexes

**Post-processing**
- Maximum **3 effets** simultanés
- Stack légère : Bloom + Vignette + ToneMapping

### Observabilité Obligatoire

Mode debug avec :
- FPS counter (r3f-perf)
- Draw calls
- Triangle count
- Toggle postFX
- Toggle shadows
- LOD visualization

---

## 5️⃣ Matériaux & Look Premium

### Standards

**Matériaux acceptés**
```typescript
// ✅ Production
MeshStandardMaterial // PBR
MeshPhysicalMaterial // Advanced PBR

// ✅ Stylized (si bien maîtrisé)
MeshToonMaterial + custom gradientMap

// ❌ Interdit en final
MeshBasicMaterial // Sauf cas très spécifique (UI 3D)
```

### Éclairage Three-Point

Même en stylized, respecter :
- **Key light** (principale, directionnelle)
- **Fill light** (douce, ambiante)
- **Rim light** (contour, séparation)

### Shadows

```typescript
// Shadows adoucies
<AccumulativeShadows
  temporal
  frames={100}
  alphaTest={0.7}
  color="#2d8659"
  colorBlend={1}
  opacity={0.8}
/>
```

---

## 6️⃣ Caméra & Interaction (Modernité)

### CameraRig Obligatoire

❌ **INTERDIT** : OrbitControls libre total (fait "démo amateur")  
✅ **OBLIGATOIRE** : CameraRig avec lerp + inertie

```typescript
function CameraRig() {
  const { camera } = useThree()
  
  useFrame((state, delta) => {
    // Lerp smooth vers target
    camera.position.lerp(targetPosition, delta * 2)
    camera.lookAt(targetLookAt)
  })
  
  return null
}
```

### Interactions Premium

**Hover effects**
```typescript
const [hovered, setHovered] = useState(false)

<mesh
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
>
  <meshStandardMaterial
    emissive={hovered ? 0x2d8659 : 0x000000}
    emissiveIntensity={hovered ? 0.5 : 0}
  />
</mesh>
```

---

## 7️⃣ Animation : Vie Subtile

### Checklist Animation

- ✅ **Wind** léger (vertex shader ou oscillation)
- ✅ **Particules** stylées (pollen, poussière, lucioles)
- ✅ **Variation aléatoire** contrôlée (seed stable)
- ✅ **Transitions** d'entrée (fade in + camera move)

### Règle d'Or

**Le mouvement doit être SUBTIL**  
Si ça se voit trop, c'est cheap.

```typescript
// ✅ BON - Subtil
rotation.y = Math.sin(time * 0.2) * 0.05

// ❌ MAUVAIS - Trop visible
rotation.y += 0.1
```

---

## 8️⃣ Gestion Assets (Pipeline Clean)

### Format Obligatoire

**Modèles** : glTF / GLB uniquement

**Pipeline assets**
1. Scale normalisée (1 unit = 1 meter)
2. Pivots corrects (origine au sol)
3. Naming propre (`tree_oak_01.glb`)
4. Compression si production

### Loader Central

```typescript
// ✅ Loader unique
function AssetLoader() {
  useGLTF.preload('/models/tree.glb')
  useTexture.preload('/textures/grass.jpg')
}

// ❌ Imports éparpillés dans 12 composants
```

---

## 9️⃣ Qualité Code (Standards)

### TypeScript Strict

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### Tests Minimum

- ✅ Build test (`npm run build`)
- ✅ Lint test (`npm run lint`)
- ✅ Scene mount sanity (Playwright)

### Git Workflow

**Commits**
- 1 changement = 1 commit
- Message clair : `feat: add HDRI environment`
- Pas de "TODO" sans issue GitHub

---

## 🔟 Process Spec-Driven (Agents)

### Boucle Obligatoire

1. **Lire** `ROADMAP.md` + `SCENE_SPEC.md`
2. **Choisir** 1 tâche atomique
3. **Implémenter** selon rules
4. **Vérifier** visuel + perf + build
5. **Cocher** checklist dans ROADMAP
6. **Mettre à jour** CHANGELOG.md
7. **Passer** à la suivante

### Règle Agent

L'agent **NE DOIT JAMAIS** demander "quoi faire ensuite" si roadmap existe.

---

## 📄 Fichiers SPEC Obligatoires

Ces fichiers doivent exister à la racine :

- ✅ `SCENE_SPEC.md` (DA, palette, mood, caméra, interactions)
- ✅ `PERF_BUDGET.md` (triangles, drawcalls, DPR, texture caps)
- ✅ `ASSET_PIPELINE.md` (sources, naming, compression)
- ✅ `QA_CHECKLIST.md` (rendu, FPS, responsive)
- ✅ `ROADMAP.md` (phases + checkboxes avec %)

---

## 🤖 Prompt Court pour Agents

**Lead 3D Web Context**

```
Tu es Lead 3D Web. Stack: Next.js + R3F + Drei + postprocessing.

Objectif: Scène low-poly PREMIUM (HDRI, shadows, postFX subtil, 
caméra cinématique, interactions fluides).

Contraintes:
- 60fps desktop stable
- Instancing pour répétitions
- Debug perf overlay
- Flat shading low-poly
- Palette harmonisée (4-6 couleurs max)

Process: spec-driven
- Tu mets à jour ROADMAP/CHANGELOG
- Tu coches chaque tâche
- Tu testes (build + lint + sanity)
- Tu ne demandes jamais "quoi faire" si roadmap existe

Output: architecture propre + scène premium + CameraRig + 
LightRig + PostFX subtil
```

---

## ✅ Validation Finale (Checklist Agent)

Avant de marquer une tâche "DONE" :

- [ ] Build réussit sans warnings
- [ ] Lint 100% clean
- [ ] FPS >= target (60 desktop / 30 mobile)
- [ ] Draw calls < budget (cf PERF_BUDGET.md)
- [ ] Visuel cohérent avec SCENE_SPEC.md
- [ ] ROADMAP.md mise à jour
- [ ] CHANGELOG.md mis à jour
- [ ] Code review auto (TypeScript, naming, structure)

---

**Version** : 2.0  
**Dernière mise à jour** : 2026-01-15  
**Statut** : ✅ Constitution Active
