# OHARA R3F - MVP Prototype

![Status](https://img.shields.io/badge/status-MVP%20Solo-green)
![Tech](https://img.shields.io/badge/tech-React%20Three%20Fiber-blue)
![Style](https://img.shields.io/badge/style-Ghibli%20Cel--Shading-orange)

## 🌳 Vision

Expérience narrative immersive où **Robin enfant** explore l'île d'Ohara paisible dans un style **Ghibli/One Piece**, construite avec **React Three Fiber**.

## ✨ MVP Features

✅ **Rendu Ghibli Premium**
- Cel-shading custom (4 bandes de couleur)
- Palette One Piece (bleu-violet arbre, verts végétation)
- Post-processing (Bloom, Vignette, ToneMapping)
- Sky procedural + soft shadows

✅ **Personnage Jouable**
- Robin enfant (modèle temporaire capsule)
- Contrôle third-person (ecctrl)
- Caméra fluide qui suit le personnage
- WASD + souris

✅ **Monde Explorable**
- Arbre de la Connaissance (LOD 3 niveaux)
- Pelouse circulaire (50m radius)
- 1 livre interactif (dialogue)

✅ **Performance**
- 60 FPS desktop
- LOD automatique
- Physics optimisé (Rapier)
- Bundle splitting

## 🚀 Quick Start

```bash
# Installation
npm install

# Dev server
npm run dev

# Build production
npm run build
```

Ouvrez **http://localhost:5173**

## 🎮 Contrôles

| Touche | Action |
|--------|--------|
| **W/Z** | Avancer |
| **S** | Reculer |
| **A/Q** | Gauche |
| **D** | Droite |
| **Espace** | Sauter |
| **Souris** | Regarder autour |
| **Clic** | Interagir avec objets |

## 📁 Structure

```
OHARA/
├── src/                    # Code source principal (React Three Fiber)
│   ├── components/
│   │   ├── Scene.jsx           # Canvas R3F + setup
│   │   ├── Robin.jsx           # Personnage joueur
│   │   ├── OharaTree.jsx       # Arbre avec LOD
│   │   ├── Ground.jsx          # Pelouse
│   │   ├── InteractiveBook.jsx # Livre cliquable
│   │   └── UI/
│   │       ├── LoadingScreen.jsx
│   │       ├── HUD.jsx
│   │       └── DialogBox.jsx
│   ├── shaders/
│   │   └── ghibliShader.js     # Cel-shading custom
│   ├── stores/
│   │   └── useGameStore.js     # State Zustand
│   ├── App.jsx                 # Root
│   └── main.jsx                # Entry point
│
├── ohara-modern/           # Version Next.js (en développement)
├── babylon-prototype/      # Prototype Babylon.js
├── archive-threejs-vanilla/ # Ancienne version Three.js vanilla
│
├── public/
│   └── assets/
│       └── models/         # Modèles 3D (.glb)
│           ├── robin.glb
│           ├── tree.glb
│           ├── professeur_clover.glb
│           └── saul.glb
│
└── docs/                   # Documentation (fichiers .md à la racine)
    ├── ROADMAP_GHIBLI.md
    ├── LORE_OHARA.md
    ├── ASSETS_A_TELECHARGER.md
    └── ...
```

## 🎨 Palette Ghibli

**Arbre** (bleu-violet One Piece)
```css
--arbre-shadow: #2d3d5a
--arbre-mid: #4a5a8a
--arbre-light: #6a7aaa
--arbre-highlight: #8a9aca
```

**Végétation**
```css
--grass-shadow: #2d4a2d
--grass-mid: #5cb85c
--grass-light: #7ec87e
--grass-highlight: #b8e8d4
```

**Robin**
```css
--robe-shadow: #7a3a6a (violet)
--skin-mid: #e8ba9a (peau)
```

## 🛠️ Stack

| Tech | Usage | Version |
|------|-------|---------|
| **React** | UI | 18.3.1 |
| **Vite** | Build | 6.0.3 |
| **Three.js** | 3D Engine | 0.170.0 |
| **R3F** | React renderer | 8.17.10 |
| **Drei** | Helpers | 9.120.0 |
| **Rapier** | Physics | 1.4.0 |
| **ecctrl** | Character control | 1.4.0 |
| **Zustand** | State | 5.0.1 |

## 📊 Performance Targets

- ✅ **Desktop**: 60 FPS constant
- ✅ **Draw Calls**: <30
- ✅ **Bundle**: <5MB (gzipped <1.5MB)
- ✅ **First Load**: <2 secondes

## 🔮 Prochaines Étapes (Roadmap)

> 📖 **Voir la roadmap complète** : [`ROADMAP_GHIBLI.md`](./ROADMAP_GHIBLI.md)

### Phase 2 : Assets 3D Finals (Semaines 5-6)
- [ ] Arbre Blender (tronc sculpté + racines)
- [ ] Intérieur bibliothèque cylindrique
- [ ] Robin enfant (Meshy AI → Blender)
- [ ] Environnement (tours, rochers)
- [ ] NPCs (Professeur Clover, Saul) - **Voir** [`ASSETS_A_TELECHARGER.md`](./ASSETS_A_TELECHARGER.md)

### Phase 3 : Gameplay (Semaines 7-8)
- [ ] 3 zones (extérieur, bibliothèque, village)
- [ ] NPCs avec dialogues
- [ ] Transitions caméra GSAP
- [ ] 15+ livres interactifs

### Phase 4 : Multijoueur (Semaines 9-10)
- [ ] Socket.io réintégré
- [ ] Sync positions joueurs
- [ ] Chat texte

### Phase 5 : Production (Semaines 11-12)
- [ ] Mobile responsive
- [ ] Compression assets
- [ ] Déploiement Vercel

## 🐛 Debug

**Performance Monitor** (dev mode)
- En haut à gauche : FPS, draw calls, triangles
- Console → `window.performance`

**Zustand DevTools**
```javascript
// Console
window.gameStore = useGameStore.getState()
console.log(window.gameStore)
```

## 📚 Documentation

### Documentation Principale
- **Roadmap complète** : [`ROADMAP_GHIBLI.md`](./ROADMAP_GHIBLI.md) - Plan 12 semaines détaillé
- **Lore & Contexte** : [`LORE_OHARA.md`](./LORE_OHARA.md) - Histoire de l'île d'Ohara (One Piece)
- **Références visuelles** : [`REFERENCES_VISUELLES_IMAGES.md`](./REFERENCES_VISUELLES_IMAGES.md) - Direction artistique
- **Changelog** : [`CHANGELOG.md`](./CHANGELOG.md) - Historique des versions

### Guides Techniques
- **Contexte IA** : [`CONTEXTE.md`](./CONTEXTE.md) - Guidelines Three.js pour développement assisté
- **Stack & Besoins** : [`STACK_ET_BESOINS.md`](./STACK_ET_BESOINS.md) - Stack technique et ressources
- **Spécifications scène** : [`SCENE_SPEC.md`](./SCENE_SPEC.md) - Spécifications détaillées de la scène
- **Budget performance** : [`PERF_BUDGET.md`](./PERF_BUDGET.md) - Cibles de performance
- **Règles de design** : [`DESIGN_RULES.md`](./DESIGN_RULES.md) - Règles de design pour agents IA

### Assets & Ressources
- **Assets à télécharger** : [`ASSETS_A_TELECHARGER.md`](./ASSETS_A_TELECHARGER.md) - Checklist des assets manquants
- **Ressources Ghibli** : [`RESSOURCES_GHIBLI.md`](./RESSOURCES_GHIBLI.md) - Ressources open source recommandées
- **Pipeline assets** : [`ASSET_PIPELINE.md`](./ASSET_PIPELINE.md) - Workflow de gestion des assets
- **Animations & Décor** : [`ANIMATIONS_ET_DECOR.md`](./ANIMATIONS_ET_DECOR.md) - Spécifications animations

## 🎭 Crédits

- **Inspiration** : One Piece (Eiichiro Oda)
- **Style** : Studio Ghibli
- **Assets** : Poly Haven (HDRI/Textures)
- **Code** : React Three Fiber community

## 📝 License

MIT - Projet éducatif

---

**Fait avec ❤️, React Three Fiber, et passion One Piece** 🌳✨
