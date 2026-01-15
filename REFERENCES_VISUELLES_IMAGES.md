# 🎨 OHARA - Références Visuelles (Images One Piece)

Ce document compile les 3 images de référence pour le style visuel du projet OHARA.

---

## Image 1 : Robin Enfant

![Robin enfant](C:/Users/User/.gemini/antigravity/brain/4470bbed-434d-475c-ac94-8d8c4204ad7c/uploaded_image_0_1768440231094.png)

### Caractéristiques

- **Personnage** : Nico Robin, environ 8 ans
- **Tenue** : Robe simple violet/rose, sandales
- **Style** : Cel-shading One Piece typique
- **Pose** : Debout, livre dans les bras
- **Décor** : Végétation stylisée, caisses en bois

### Utilisation Projet

- **Modèle Robin** : Proportions enfant, palette couleurs robe
- **Cel-shading** : Contours noirs épais, aplats couleur
- **Props** : Livres, végétation basse

---

## Image 2 : Intérieur Bibliothèque

![Bibliothèque Ohara](C:/Users/User/.gemini/antigravity/brain/4470bbed-434d-475c-ac94-8d8c4204ad7c/uploaded_image_1_1768440231094.jpg)

### Caractéristiques

- **Architecture** : Bibliothèque cylindrique, étagères infinies
- **Couleurs** : Tons verts/bruns (bois), éclairage chaud
- **Élément central** : Énorme armillaire/astrolabe (planètes + armature métallique)
- **Échelle** : Massive, personnages minuscules en bas
- **Habitants** : Savants/archéologues, styles vestimentaires variés

### Utilisation Projet

- **Zone bibliothèque** : Geometry cylindrique, étagères circulaires montant en spirale
- **Astrolabe central** : Modèle 3D complexe (>20k polygones OK), animation rotation lente
- **Livres interactifs** : 15-20 livres cliquables sur étagères
- **NPCs** : Professeur Clover + 2-3 savants
- **Lighting** : Warm orange (torches virtuelles)

---

## Image 3 : Arbre Géant Extérieur

![Arbre de la Connaissance](C:/Users/User/.gemini/antigravity/brain/4470bbed-434d-475c-ac94-8d8c4204ad7c/uploaded_image_2_1768440231094.png)

### Caractéristiques

- **Arbre** : Tronc massif bleu-violet avec racines "tentaculaires" formant arches
- **Cime** : Plate et très large (feuillage dense)
- **Racines** : Énormes, créent passages/tunnels naturels
- **Environnement** : Pelouse verte, petites tours végétalisées, collines
- **Ciel** : Turquoise lumineux (journée ensoleillée)

### Utilisation Projet

- **Modèle arbre principal** : 
  - Tronc bleu-violet (palette `#4a5a8a` base)
  - Racines sculpturales (Blender sculpting)
  - Cime simplifiée (LOD system)
- **Zone extérieur** :
  - Pelouse CircleGeometry (50m radius)
  - Petites tours (5-6 CylinderGeometry avec végétation)
  - Chemins de terre entre racines
- **HDRI** : Poly Haven `kloppenheim_06` ou `rural_landscape` (ciel turquoise)
- **Shader Ghibli** : 
  - Arbre → 4 bandes (shadow `#2d3d5a`, mid `#4a5a8a`, light `#6a7aaa`, highlight `#8a9aca`)
  - Feuillage → Vert (shadow `#2d4a2d`, light `#7ec87e`)

---

## Palette Couleurs Extraite

### Tons Principaux (Arbre)

```css
--arbre-shadow: #2d3d5a;     /* Bleu-violet foncé */
--arbre-mid: #4a5a8a;         /* Bleu-violet moyen */
--arbre-light: #6a7aaa;       /* Bleu-violet clair */
--arbre-highlight: #8a9aca;   /* Bleu-violet très clair */
```

### Tons Secondaires (Végétation)

```css
--grass-shadow: #2d4a2d;      /* Vert foncé */
--grass-mid: #5cb85c;          /* Vert moyen */
--grass-light: #7ec87e;        /* Vert clair */
--grass-highlight: #b8e8d4;    /* Vert pastel */
```

### Tons UI (Bibliothèque)

```css
--wood-dark: #4a2c1a;          /* Marron foncé */
--wood-mid: #6b4e2e;           /* Marron moyen */
--wood-light: #8b6f47;         /* Marron clair */
--metal-astrolabe: #8a7a6a;    /* Métal vieilli */
```

### Tons Ciel/Ambiance

```css
--sky-top: #5fa8d3;            /* Bleu ciel haut */
--sky-horizon: #b8d4e8;        /* Bleu ciel horizon */
--fog: #c5e3f0;                /* Brume distance */
```

---

## Guidelines Modélisation

### Arbre Géant (Image 3)

**Blender workflow** :
1. Base : CylinderGeometry (8 segments, height 30m)
2. Sculpting : Racines organiques avec Dyntopo
3. UV Unwrap : Smart UV Project
4. Textures : Wood PBR (Poly Haven `wood_fine_grain`)
5. Vertex colors : Gradient bleu-violet (base → cime)
6. Export : GLB avec Draco compression

**Target** :
- LOD0 (proche) : 30-50k polygones
- LOD1 (moyen) : 15k polygones
- LOD2 (loin) : 5k polygones

### Bibliothèque (Image 2)

**Blender workflow** :
1. Base : CylinderGeometry (32 segments, height 50m, no caps)
2. Étagères : Array modifier (50 instances verticales)
3. Astrolabe : Separate object (rigging pour rotation)
4. Livres : Instances ColorAttribute (5 couleurs)
5. Export : Separate GLB (library-shell.glb + astrolabe.glb + books.glb)

**Target** :
- Shell : 10k polygones
- Astrolabe : 20k polygones (complexité OK, 1 seul)
- Livres : 150 instances × 100 polygones = 15k total

### Robin Enfant (Image 1)

**Options** :
1. **Meshy AI** : Prompt "Nico Robin child, 8 years old, purple dress, long black hair, One Piece anime style, cel-shaded, T-pose for rigging"
2. **Sketchfab** : Recherche "Robin One Piece child" + filtre CC-BY + retopology si besoin
3. **Commission** : Artiste Fiverr/Upwork (budget 100-300€, délai 1-2 semaines)

**Target** :
- 10-15k polygones (personnage principal)
- Rigging Mixamo compatible
- Textures 1024×1024 (diffuse + normal map)

---

## Shader Ghibli Configuration

Basé sur les 3 images, voici les paramètres shader par matériau :

### Arbre (Image 3)

```javascript
<ghibliMaterial
  uColorShadow={new THREE.Color('#2d3d5a')}
  uColorMid={new THREE.Color('#4a5a8a')}
  uColorLight={new THREE.Color('#6a7aaa')}
  uColorHighlight={new THREE.Color('#8a9aca')}
  uLightPosition={new THREE.Vector3(10, 10, 5)}
/>
```

### Feuillage

```javascript
<ghibliMaterial
  uColorShadow={new THREE.Color('#2d4a2d')}
  uColorMid={new THREE.Color('#5cb85c')}
  uColorLight={new THREE.Color('#7ec87e')}
  uColorHighlight={new THREE.Color('#b8e8d4')}
/>
```

### Bois Bibliothèque (Image 2)

```javascript
<ghibliMaterial
  uColorShadow={new THREE.Color('#4a2c1a')}
  uColorMid={new THREE.Color('#6b4e2e')}
  uColorLight={new THREE.Color('#8b6f47')}
  uColorHighlight={new THREE.Color('#a58f67')}
/>
```

### Robin (Image 1)

**Robe** :
```javascript
<ghibliMaterial
  uColorShadow={new THREE.Color('#7a3a6a')}   // Violet foncé
  uColorMid={new THREE.Color('#9a5a8a')}      // Violet moyen
  uColorLight={new THREE.Color('#ba7aaa')}    // Violet clair
  uColorHighlight={new THREE.Color('#da9aca')} // Rose clair
/>
```

**Peau** :
```javascript
<ghibliMaterial
  uColorShadow={new THREE.Color('#c89a7a')}   // Peau ombre
  uColorMid={new THREE.Color('#e8ba9a')}      // Peau base
  uColorLight={new THREE.Color('#f8daaa')}    // Peau lumière
  uColorHighlight={new THREE.Color('#ffffff')} // Highlight blanc
/>
```

---

## Checklist Cohérence Visuelle

Utiliser ces images comme référence absolue pour :

- [ ] Proportions personnages (Robin = 1.2m height)
- [ ] Échelle arbre (tronc = 5m diameter, height 30m)
- [ ] Palette couleurs (bleu-violet arbre, verts végétation)
- [ ] Style cel-shading (4 bandes minimum)
- [ ] Contours noirs (outline shader ou post-processing)
- [ ] Lighting ambiance (warm bibliothèque, naturel extérieur)
- [ ] Architecture bibliothèque (cylindre, étagères circulaires)

---

**Utilisation** : Consulter ce document lors de la modélisation 3D (Phase 2) et configuration shaders (Phase 1 Semaine 3).
