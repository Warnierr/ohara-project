# 📋 OHARA - Changelog

Suivi des modifications et évolutions du projet.

---

## [2.1.0] - 2026-01-15 - Documentation Complète & Assets

### 📚 Documentation Ajoutée

#### Nouveaux Documents
- **LORE_OHARA.md** : Contexte complet de l'île d'Ohara (One Piece)
  - Description de l'Arbre de la Connaissance
  - Personnages clés (Robin, Clover, Saul, Olvia)
  - Structure de l'île et environnement
  - Spécifications techniques pour modélisation

- **ASSETS_A_TELECHARGER.md** : Checklist complète des assets manquants
  - NPCs prioritaires (Saul, Clover)
  - Packs nature recommandés (Quaternius, Kenney)
  - Organisation des fichiers
  - Sources de téléchargement

- **RESSOURCES_GHIBLI.md** : Guide ressources open source
  - Packs essentiels (Quaternius Stylized Nature MegaKit)
  - Textures watercolor terrain
  - Outils et tutoriels style Ghibli
  - Plan d'action immédiat

- **ANIMATIONS_ET_DECOR.md** : Spécifications animations et décor

### 🎨 Assets Intégrés

- ✅ **Modèles 3D** :
  - `professeur_clover.glb` - Modèle Professeur Clover
  - `saul.glb` - Modèle Jaguar D. Saul (géant)
  
- ✅ **Textures** :
  - Pack complet **VoxelCoreLab Watercolor Terrain Textures** (15 textures)
  - Textures herbe, terre, pierre, eau (style aquarelle Ghibli)
  - Format 1024x1024px, CC0 license

### 📝 Documentation Mise à Jour

- **README.md** :
  - Section documentation complète avec liens vers tous les guides
  - Structure du projet mise à jour
  - Références aux nouveaux documents

- **ROADMAP_GHIBLI.md** :
  - Progrès Semaine 1 marqués comme complétés
  - Assets disponibles documentés
  - Liens vers guides d'assets
  - Next steps mis à jour

### 🔗 Organisation

- Structure claire des fichiers de documentation
- Liens croisés entre documents
- Checklist d'assets facilement accessible

---

## [2.0.0] - 2026-01-15 - Migration Stack Moderne

### 🎯 Vision

Migration d'un prototype Vanilla Three.js vers une architecture production-ready moderne avec React Three Fiber, design premium et performance optimale.

### 📚 Documentation Créée

#### Nouveaux Fichiers SPEC
- **DESIGN_RULES.md** : Constitution complète pour agents IA (rules 0-10)
- **SCENE_SPEC.md** : Spécifications détaillées scène (DA, palette, lighting)
- **PERF_BUDGET.md** : Budgets performance stricts (FPS, draw calls, triangles)
- **VISUAL_REFERENCES.md** : Direction artistique moderne 2025 + inspirations
- **ASSET_PIPELINE.md** : Workflow assets (sources, tools, standards, QC)
- **implementation_plan.md** : Plan migration détaillé avec code complet
- **task.md** : Roadmap 9 phases avec checklists

#### Fichiers Mis à Jour
- **CONTEXTE.md** : Guidelines Three.js pour IA (déjà existant)
- **README.md** : Documentation projet OHARA (mis à jour thème)

### 🎨 Direction Artistique Définie

**Style Cible** : Low-poly premium (Zelda BOTW / Ghibli / Monument Valley)

**Évolution**
- Avant : Low-poly basique 2017 (flat, pas d'éclairage avancé)
- Après : Stylized réaliste avec HDRI, shadows douces, post-processing

**Palette Harmonisée**
- 4-6 couleurs max par scène
- Greens naturels (3 nuances)
- Browns chauds (3 nuances)
- Accents : #2d8659 (OHARA green), #ffd700 (gold rare)

### ⚡ Performance Standards

**Targets FPS**
- Desktop : 60 stable
- Laptop : 45-60
- Mobile : 30-45

**Budgets**
- Draw Calls : <50 desktop, <30 mobile
- Triangles : <50k desktop, <30k mobile
- Textures : <100MB desktop, <50MB mobile

**Optimisations Obligatoires**
- Instancing pour tous objets répétés
- LOD automatique (3 niveaux)
- DPR capped [1, 1.5]
- Post-processing léger (3 effets max)

### 🛠️ Stack Technique Recommandée

**Frontend**
- Next.js 15 (App Router)
- React 18.3
- TypeScript (optionnel)

**3D Engine**
- Three.js 0.170+
- React Three Fiber 8.17+
- @react-three/drei 9.120+
- @react-three/postprocessing 2.16+

**State & Utils**
- Zustand (state management)
- Leva (debug GUI)
- r3f-perf (monitoring)

**Animation**
- Framer Motion 3D
- GSAP
- Theatre.js (optionnel, cinématiques)

### 📋 Process Spec-Driven

**Boucle Agent**
1. Lire ROADMAP.md + SCENE_SPEC.md
2. Choisir tâche atomique
3. Implémenter selon DESIGN_RULES
4. Vérifier (visuel + perf + build)
5. Cocher checklist ROADMAP
6. Update CHANGELOG
7. Next task

**Règle** : Agent ne demande jamais "quoi faire" si roadmap existe

### 🎯 Roadmap 9 Phases

1. **Phase 1** : Setup & Infrastructure (Next.js + R3F + WebGPU)
2. **Phase 2** : Migration Scène 3D (Tree, Environment, LOD)
3. **Phase 3** : Design Glassmorphism & UI moderne
4. **Phase 4** : Performance & Optimisations (instancing, <50 draw calls)
5. **Phase 5** : Multijoueur Moderne (Zustand + Socket.io hooks)
6. **Phase 6** : Interactivité Avancée (hover, click, camera focus)
7. **Phase 7** : Features Avancées (Chat, NPC IA, Quêtes)
8. **Phase 8** : Production & Déploiement (Vercel + Railway)
9. **Phase 9** : Polish & Extensions (A11y, Mobile, Future features)

### 🎨 Assets Sources Identifiées

**Modèles 3D (Free)**
- Poly Haven (CC0, film quality)
- Kenney.nl (40k+ assets CC0)
- Quaternius (stylized low-poly CC0)

**Textures PBR**
- Poly Haven (8K gratuit)
- AmbientCG (CC0 seamless)

**HDRI**
- Poly Haven 16K (forest_slope, rural_landscape)

### ✅ Décisions Techniques

**WebGPU**
- Priorité WebGPU avec fallback WebGL2
- Gain performance x150 sur particules
- TSL pour shaders cross-compatible

**Post-Processing Stack**
1. N8AO (Ambient Occlusion)
2. Bloom (intensity 1.2)
3. ToneMapping (ACES Filmic)
4. Vignette (optionnel)

**Camera Strategy**
- CameraRig guidé (pas OrbitControls libre)
- Lerp smooth transitions
- Focus automatique on click
- Intro cinématique (GSAP)

---

## [1.0.0] - 2026-01-15 - Transformation OHARA

### ✨ Ajouté

**Arbre du Savoir**
- Composant `OharaTree.js` avec LOD 3 niveaux
- Animation vent subtile
- 3 couches feuillage dégradées
- Racines apparentes (LOD élevé)

**Environnement Jour**
- Pelouse verte (#5cb85c)
- Fleurs instanciées (150 instances, 5 couleurs)
- Arbres environnants (13 instances)
- Ciel bleu (#87CEEB) + fog

**Éclairage Solaire**
- DirectionalLight (soleil) position [50, 100, 50]
- AmbientLight intensity 0.6
- HemisphereLight (ciel bleu / pelouse verte)
- Ombres PCF soft

**Branding**
- Nom projet : FOYER → OHARA
- Thème couleur : Orange (#ff6b35) → Vert (#2d8659)
- Textes UI : Feu de camp → Arbre du Savoir
- Emoji : 🏕️ → 🌳

### 🔄 Modifié

**Scene.js**
- Import `OharaTree` au lieu de `Campfire`
- Éclairage jour au lieu de nuit
- Background bleu ciel au lieu de dark
- Fog distance augmentée (40-120 vs 20-80)

**Environment.js**
- Sol vert pelouse au lieu de dark green
- Suppression étoiles (createStars)
- Ajout createFlowers avec instancing
- Arbres couleur #3a8a3a (jour) vs #1a4d2e (nuit)

**index.html**
- Palette UI complete Orange → Vert
- Titres et messages mis à jour
- Gradients background modernisés

**package.json**
- Name : "foyer" → "ohara"

**server/index.js**
- Log startup : "🔥 FOYER" → "🌳 OHARA"

### 📚 Documenté

**CONTEXTE.md**
- Guide complet Three.js pour IA
- Best practices (imports, renderer, loaders, dispose)
- Optimisations (LOD, instancing, pooling)
- Checklist performance
- Erreurs communes à éviter

**README.md**
- Thème One Piece / Ohara
- Features techniques (LOD, instancing, fleurs)
- Métriques performance (draw calls, FPS)
- Structure projet mise à jour

### 🚀 Déploiement

**Serveurs Actifs**
- Client Vite : http://localhost:5173
- Backend Socket.io : http://localhost:3000

**Tests Validés**
- Arbre du Savoir visible et animé ✅
- Environnement pelouse + fleurs ✅
- Multijoueur synchronisé ✅
- FPS stable 60 ✅
- Pas d'erreurs console critiques ✅

---

## [0.1.0] - 2026-01-14 - Prototype Initial FOYER

### ✨ Features Initiales

**Scène 3D**
- Feu de camp central avec particules
- 13 arbres procéduraux
- Ciel étoilé nocturne
- Sol forestier

**Multijoueur**
- Socket.io client/serveur
- Synchronisation positions 20 ticks/sec
- Avatars colorés uniques
- Interpolation fluide

**Contrôles**
- WASD/ZQSD/Arrows movement
- OrbitControls caméra
- Mouvement relatif caméra

**Stack**
- Vanilla Three.js 0.182
- Vite 7.2.4 → 5.4.11 (Node.js compat)
- Socket.io 4.8.3
- Express serveur

---

## 📝 Notes de Version

### Migration Strategy

**Option A** (Recommandée) : Progressive (2-3 semaines)
- Phase par phase
- Tests incrémentaux
- Moins risqué

**Option B** : Refonte totale (1-2 semaines)
- Nouveau repo OHARA-MODERN
- Migration complète
- Focus intense

### Prochains Milestones

**v2.1.0** : Migration Phase 1 (Setup Next.js + R3F)
**v2.2.0** : Migration Phase 2 (Scène R3F + LOD)
**v2.3.0** : Migration Phase 3 (UI Glassmorphism)
**v2.4.0** : Migration Phase 4 (Optimisations <50 draw calls)
**v3.0.0** : Production Release (Full stack déployé)

---

**Convention** : [Semantic Versioning](https://semver.org/)
- MAJOR : Breaking changes (migration stack)
- MINOR : New features (phases roadmap)
- PATCH : Bug fixes, optimizations
