# 🌳 OHARA - Roadmap Ghibli/One Piece (R3F)

**Vision** : Expérience narrative immersive où **Robin enfant** explore l'île d'Ohara paisible dans un style **Ghibli/cel-shading**, construite avec **React Three Fiber**.

---

## 🎯 Phase 1 : MVP Solo Ghibli (4 semaines)

**Objectif** : Prototype jouable avec Robin contrôlable, arbre géant, shader Ghibli, 1 interaction

### Semaine 1 : Setup & Foundation

- [x] Analyse projet actuel Three.js vanilla
- [x] Création plan d'implémentation
- [x] Archiver ancienne version dans `archive-threejs-vanilla/`
- [x] Créer nouveau projet React + Vite
- [x] Installer stack R3F complète :
  - [x] `@react-three/fiber` (8.17.10)
  - [x] `@react-three/drei` (9.120.0)
  - [x] `@react-three/postprocessing` (2.16.3)
  - [x] `@react-three/rapier` (1.4.0)
  - [x] `zustand` (5.0.1)
  - [x] `gsap` (3.12.5)
  - [x] `leva` (0.9.35)
  - [x] `r3f-perf` (7.2.3) - monitoring performance

### Semaine 2 : Scene Ghibli de Base

- [ ] Component `Scene.jsx` avec Canvas R3F
- [ ] HDRI environment (Poly Haven : `kloppenheim_06_2k.hdr`)
- [ ] Lighting setup (Directional + Ambient)
- [ ] AccumulativeShadows (ombres douces)
- [ ] Post-processing :
  - Bloom (intensity: 1.2, threshold: 0.9)
  - Vignette (darkness: 0.5)
  - ToneMapping (ACES Filmic)
- [ ] **Vérification** : Rendu visuel premium (pas flat)

### Semaine 3 : Shader Cel-Shading + Robin

- [ ] Créer `ghibliShader.js` (4 bandes : shadow, mid, light, highlight)
- [ ] Palette One Piece (verts Ohara + bleus ciel)
- [ ] Modèle Robin temporaire (cube/capsule stylisé)
- [ ] Intégrer `ecctrl` pour contrôle third-person
- [ ] **Vérification** : WASD fonctionne, caméra suit Robin

### Semaine 4 : Première Interaction + Perf

- [ ] Arbre géant simplifié (CylinderGeometry + shader Ghibli)
- [ ] 1 objet interactif (livre/rocher) :
  - Hover → glow émissif
  - Click → dialogue simple (HTML overlay)
- [ ] Performance optimization :
  - 60 FPS desktop
  - <30 draw calls
  - r3f-perf monitoring
- [ ] **Livrable** : Démo vidéo 30 secondes

---

## 🎨 Phase 2 : Assets 3D Finals (2 semaines)

**Objectif** : Remplacer prototypes par vrais modèles 3D Blender/Meshy AI

### Semaine 5 : Modélisation Blender

- [ ] **Arbre géant** (référence Image 2) :
  - Tronc bleu-violet massif (sculpting)
  - Racines formant arches
  - Cime plate et large
  - Fenêtres/ouvertures
  - Export GLB avec Draco compression
- [ ] **Intérieur bibliothèque** (référence Image 1) :
  - Structure cylindrique
  - Étagères circulaires en spirale
  - Astrolabe/armillaire central
  - Modèle low-poly (<50k polygones)

**📦 Ressources identifiées** : Voir [`ASSETS_A_TELECHARGER.md`](./ASSETS_A_TELECHARGER.md) et [`RESSOURCES_GHIBLI.md`](./RESSOURCES_GHIBLI.md)

### Semaine 6 : Robin + Environnement

- [x] **Robin enfant** (modèle temporaire capsule) - ✅ En place
- [ ] **Robin enfant final** (référence Image 3) :
  - Option 1 : Meshy AI (prompt One Piece style)
  - Option 2 : Sketchfab CC-BY + retopology
  - Option 3 : Commission artiste (budget 100-300€)
  - Rigging T-pose pour animations futures
- [x] **Environnement de base** :
  - [x] Pelouse verte (herbe stylisée) - ✅ Ground.jsx
  - [ ] Petites tours rondes (style Ohara)
  - [ ] Rochers (Poly Haven models ou Quaternius)
  - [ ] Chemins de terre
- [x] **Textures** :
  - [x] Textures watercolor terrain (VoxelCoreLab) - ✅ Téléchargées
  - [ ] `wood_fine_grain` (arbre)
  - [ ] `aerial_rocks` (rochers)
  - [x] `grass_field` (pelouse) - ✅ Disponible
- [ ] **Vérification** : Tous assets <5MB total, chargement <3 secondes

**📦 Assets disponibles** :
- ✅ `robin.glb`, `tree.glb` (modèles de base)
- ✅ `professeur_clover.glb`, `saul.glb` (à intégrer)
- ✅ Textures watercolor terrain (15 textures)
- ⚠️ Voir [`ASSETS_A_TELECHARGER.md`](./ASSETS_A_TELECHARGER.md) pour checklist complète

---

## 🎮 Phase 3 : Gameplay Narratif (2 semaines)

**Objectif** : 3 zones explorables + NPCs + dialogues riches

### Semaine 7 : Zones & Transitions

- [ ] **Zone 1 - Extérieur** :
  - Clairière avec arbre central
  - 5-6 POI (maisons, rochers, plage)
  - Ciel turquoise + nuages
- [ ] **Zone 2 - Bibliothèque** :
  - Intérieur cylindrique
  - 10-15 livres interactifs
  - Astrolabe central animé (rotation)
  - Switch caméra → first-person
- [ ] **Zone 3 - Village** :
  - 3-4 petites maisons visitables
  - Dialogues avec habitants
- [ ] **Transitions GSAP** :
  - Hook `useZoneTransition`
  - Lerp caméra (2 sec, ease power2.inOut)
  - Téléportation déclenchée par trigger zones

### Semaine 8 : NPCs & Dialogues

- [ ] **NPCs statiques** (MVP, pas de navigation) :
  - Professeur Clover (bibliothèque)
  - 2-3 archéologues (extérieur/maisons)
  - 1-2 enfants (plage)
  - Modèles temporaires (capsules colorées)
- [ ] **Système dialogue** :
  - Zustand store pour state dialogues
  - UI overlay avec Framer Motion
  - 10+ dialogues uniques (lore Ohara)
- [ ] **Easter eggs One Piece** :
  - 3-5 références cachées (Ponéglyphes, symboles)
  - Livres spéciaux (histoire vraie)
- [ ] **Vérification** : Flow gameplay complet (arrivée → exploration → dialogues → transitions)

---

## 🌐 Phase 4 : Multijoueur Socket.io (2 semaines)

**Objectif** : Réintégrer multijoueur temps réel avec nouveau système R3F

### Semaine 9 : Serveur Adapté

- [ ] Réutiliser serveur Socket.io existant (`server/index.js`)
- [ ] Adapter events pour R3F :
  - `player:move` → sync positions (Zustand)
  - `player:interact` → dialogues/objets partagés
  - `zone:change` → sync zones actives
- [ ] Authentication basique (pseudo → UUID)
- [ ] Rooms par zone (max 20 joueurs/zone)

### Semaine 10 : Avatars Multijoueur

- [ ] Component `OtherPlayer.jsx` :
  - Modèle Robin simplifié (instancing)
  - Pseudo affiché (Html overlay)
  - Interpolation positions (lerp)
- [ ] **Chat texte** :
  - UI overlay (bottom-left)
  - Messages locaux (zone uniquement)
  - Historique 50 derniers messages
- [ ] **Vérification** : 10 joueurs simultanés, 60 FPS maintenu

---

## 🌟 Phase 5 : Polish & Production (2 semaines)

**Objectif** : Déploiement public + optimisations finales

### Semaine 11 : UX/UI Finale

- [ ] **Loading screen** :
  - Progression assets (0-100%)
  - Animation Ohara logo
  - Tips/lore pendant chargement
- [ ] **Mobile responsive** :
  - Touch controls (joystick virtuel)
  - UI adaptée (boutons plus gros)
  - Performance 30 FPS mobile (test iPhone/Android)
- [ ] **Compression assets** :
  - Draco compression GLB
  - KTX2/Basis textures
  - HDRI downscale → 2K mobile
- [ ] **Micro-animations** :
  - Vent subtil (feuillage arbre)
  - Particules lumière (bibliothèque)
  - Vagues océan (background)

### Semaine 12 : Déploiement

- [ ] **Build production** :
  - `npm run build`
  - Bundle size <10MB (target <5MB)
  - Code splitting par zone
- [ ] **Vercel deployment** :
  - Domaine custom (ohara.kenshu.dev)
  - Variables d'environnement (Socket.io URL)
  - Preview deploys par branche
- [ ] **Analytics** :
  - Plausible ou Umami (privacy-friendly)
  - Events : zones visitées, NPCs parlés, temps session
- [ ] **SEO** :
  - Meta tags One Piece
  - OG images (screenshots)
  - Sitemap
- [ ] **Documentation publique** :
  - README.md mis à jour
  - Démo vidéo YouTube (2-3 minutes)
  - Post DevTo/Reddit (show HN?)

---

## 🎨 Stack Technique Finale

### Core

| Technologie | Usage | Version |
|-------------|-------|---------|
| **React** | UI framework | 18.3.0 |
| **Vite** | Build tool | 6.0.0 |
| **Three.js** | 3D engine | 0.170.0 |
| **R3F** | React renderer | 8.17.0 |

### 3D Ecosystem

| Bibliothèque | Usage |
|--------------|-------|
| `@react-three/drei` | Helpers (Environment, Html, etc.) |
| `@react-three/postprocessing` | Effects (Bloom, Vignette) |
| `@react-three/rapier` | Physics (collisions) |
| `ecctrl` | Character controller |

### State & Animation

| Bibliothèque | Usage |
|--------------|-------|
| `zustand` | State global (UI, dialogues) |
| `gsap` | Camera transitions |
| `framer-motion` | UI animations |

### Multijoueur

| Technologie | Usage |
|-------------|-------|
| `socket.io-client` | Client temps réel |
| Node.js + Express | Serveur backend |
| `socket.io` | Serveur WebSocket |

---

## 📊 Métriques de Succès

### Performance

- ✅ **Desktop** : 60 FPS constant
- ✅ **Mobile** : 30+ FPS (iPhone 12, Galaxy S21)
- ✅ **Bundle** : <10MB (gzipped <3MB)
- ✅ **First Load** : <3 secondes (connexion 4G)

### Qualité Visuelle

- ✅ **Style Ghibli** : Cel-shading avec 4 bandes de couleur
- ✅ **Lighting** : HDRI + ombres douces (pas de noir dur)
- ✅ **Post-FX** : Bloom + Vignette actifs
- ✅ **Animations** : 60 FPS, pas de stuttering

### Gameplay

- ✅ **Zones** : 3 zones complètement explorables
- ✅ **NPCs** : 5+ personnages avec dialogues uniques
- ✅ **Interactions** : 15+ objets interactifs
- ✅ **Easter eggs** : 5+ références One Piece

### Multijoueur

- ✅ **Joueurs simultanés** : 20/zone sans lag
- ✅ **Latence** : <100ms (sync positions)
- ✅ **Chat** : Messages instantanés

---

## 🎁 Features Bonus (Post-Launch)

### Phase 6+ (si temps/budget)

- [ ] **Animations Robin** :
  - Idle, walk, run, jump
  - Mixamo ou custom rigging
- [ ] **NPCs avec IA** :
  - ChatGPT/Claude dialogues dynamiques
  - Mémoire contextuelle (RAG)
- [ ] **Quêtes narratives** :
  - 3-5 quêtes courtes (chercher livres, parler à NPCs)
  - Système progression (Zustand)
- [ ] **Audio** :
  - Musique Ohara (lofi/piano)
  - Ambiance (vent, oiseaux, pages)
  - Voix NPCs (TTS ou samples)
- [ ] **Journal de bord** :
  - UI livre (3D object)
  - Notes sur personnages rencontrés
  - Carte des zones
- [ ] **Day/Night cycle** :
  - HDRI switch (jour/coucher de soleil/nuit)
  - Lighting adaptatif

---

## 📚 Ressources Clés

### Assets 3D

- **Poly Haven** : HDRI, textures PBR, modèles nature (gratuit, CC0)
- **Kenney.nl** : Assets low-poly stylisés (CC0)
- **Sketchfab** : Modèles One Piece (filtrer CC-BY)
- **Meshy AI** : Génération IA pour prototypage rapide

### Apprentissage

- **Three.js Journey** : Cours premium ($95, meilleur investissement)
- **R3F Discord (Poimandres)** : Communauté active
- **GitHub Ghibli Shader** : craftzdog/ghibli-style-shader (base)

### Inspiration Visuelle

- **Zelda BOTW** : Cel-shading + HDRI naturel
- **Genshin Impact** : Palette saturée + lighting premium
- **Monument Valley** : Low-poly + design cohérent

---

## 🚀 Next Steps Immédiats

1. ✅ **Setup MVP R3F** : Code de base en place (Scene, Robin, Shader)
2. ✅ **Documentation complète** : Tous les guides créés
3. ✅ **Assets identifiés** : Ressources Ghibli documentées
4. **Phase 1 Semaine 2-3** : Finaliser shader Ghibli + contrôles
5. **Phase 1 Semaine 4** : Première interaction + optimisation perf
6. **Phase 2** : Télécharger et intégrer assets 3D finals (Quaternius, Kenney)

**📚 Documentation à consulter** :
- [`ASSETS_A_TELECHARGER.md`](./ASSETS_A_TELECHARGER.md) - Checklist assets
- [`RESSOURCES_GHIBLI.md`](./RESSOURCES_GHIBLI.md) - Sources open source
- [`LORE_OHARA.md`](./LORE_OHARA.md) - Contexte narratif

---

**Timeline Total** : 12 semaines (3 mois)  
**Effort** : 15-20h/semaine (temps partiel)  
**Budget** : 0-300€ (assets optionnels)  
**Résultat** : Expérience 3D web premium style Ghibli, déployée publiquement

**Prêt à pivoter vers l'avenir ? 🌳✨**
