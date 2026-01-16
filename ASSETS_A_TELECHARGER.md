# 📦 ASSETS À TÉLÉCHARGER POUR OHARA

## ✅ Assets Déjà Intégrés
- `robin.glb` ✓
- `tree.glb` ✓  
- `grass.png` (texture) ✓

---

## 🎯 ASSETS MANQUANTS (À télécharger)

### 👥 **PERSONNAGES (NPCs)**
#### Saul & Professeur Clover
**⚠️ PRIORITÉ 1 - Non visibles actuellement**

**Options gratuites :**
1. **Sketchfab** (meilleure option)
   - Chercher "anime old man professor" ou "anime scholar"
   - Filtrer : GLB/GLTF, Downloadable, Free
   - Renommer en `saul.glb` et `clover.glb`
   - 🔗 https://sketchfab.com/search?features=downloadable&licenses=7c23a1ba438d4306920229c12afcb5f9&sort_by=-likeCount&type=models&q=anime+professor

2. **Meshy AI**
   - Générer via AI : "anime style old professor character low poly"
   - Export en GLB
   - 🔗 https://meshy.ai

3. **CGTrader** (filtrer Free)
   - 🔗 https://cgtrader.com/free-3d-models/character/anime

**💰 Option payante (recommandée) :**
- **Mixamo** (gratuit mais necessite compte Adobe)
- **TurboSquid** ($10-30 pour modèles rigged+animés)

---

### 🌳 **NATURE (Remplacer les cubes verts)**
#### Arbres, Rochers, Fleurs, Buissons

**📥 PACK GRATUIT RECOMMANDÉ :**

#### **Quaternius - Ultimate Nature Pack**
- ✅ **150+ modèles low-poly**
- ✅ **CC0 License (libre commercial)**
- ✅ **Formats : FBX, OBJ, Blend, GLB**
- 📦 **Contenu :**
  - Arbres (pins, sapins, feuillus, palmiers)
  - Rochers (petits, moyens, gros)
  - Fleurs & Buissons
  - Herbes & Plantes
  - Cactus & Assets désert/neige
  
🔗 **Téléchargement :** https://quaternius.itch.io/ultimate-nature
📁 **Prix :** GRATUIT (donation optionnelle)

**Alternative :**
- **Kenney Nature Kit** : https://kenney.nl/assets/nature-kit

---

### 🚣 **BATEAU**
#### Remplacer le cube marron

**📥 PACK RECOMMANDÉ :**

#### **Kenney Pirate Kit 2.0**
- ✅ **60+ objets pirates**
- ✅ **Bateaux low-poly**
- ✅ **CC0 License**
- ✅ **Formats : GLB, OBJ, FBX**
- 📦 **Contenu :**
  - Bateaux variés (sloop, galion)
  - Canons & Accessoires
  - Tonneaux & Coffres
  - Drapeaux pirates

🔗 **Téléchargement :** https://kenney.nl/assets/pirate-kit
📁 **Prix :** GRATUIT (donation optionnelle)
📅 **Version 2.0 sortie :** 25 décembre 2024

**Fichier à renommer :** Choisir un petit bateau → `boat.glb`

---

### 🏛️ **BÂTIMENTS (Lore Ohara)**
#### Maisons archéologues, Bibliothèque, Laboratoire

**Options :**

1. **Poly Pizza - Stylized Buildings**
   - 🔗 https://poly.pizza/m/buildings
   - Filtrer "stylized" ou "medieval"

2. **Sketchfab - Low Poly Buildings**
   - Chercher "low poly house library"
   - 🔗 https://sketchfab.com/search?features=downloadable&licenses=7c23a1ba438d4306920229c12afcb5f9&sort_by=-likeCount&type=models&q=low+poly+house

3. **Kenney Medieval Kit**
   - 🔗 https://kenney.nl/assets/medieval-kit

**💰 Alternative payante (recommandé pour Ghibli) :**
- **Synty Studios - PolygonTown Pack** ($10-20)
- Style parfait pour Ohara

---

### 🌿 **TERRAIN HEIGHTMAP CUSTOM**
#### Pour remplacer le terrain par défaut

**Créer une heightmap custom :**

1. **Option IA gratuite :**
   - Utiliser **Meshy AI** pour générer une heightmap
   - Prompt : "island heightmap terrain gentle hills"
   
2. **Option manuelle (Photoshop/GIMP) :**
   - Créer image 512x512 pixels
   - Niveaux de gris : noir = bas, blanc = haut
   - Ajouter bruit Perlin pour réalisme
   - Sauver `ohara_heightmap.png`

3. **Générateur en ligne :**
   - 🔗 https://cpetry.github.io/NormalMap-Online/
   - 🔗 http://terrain.party/ (vraies données satellitaires)

**Intégrer :**
```typescript
MeshBuilder.CreateGroundFromHeightMap("ground", 
    "/assets/textures/ohara_heightmap.png", // Votre fichier
    { width: 60, height: 60, subdivisions: 100, minHeight: 0, maxHeight: 5 }
);
```

---

### 🎨 **TEXTURES SUPPLÉMENTAIRES**

#### Herbe HD
- 🔗 https://polyhaven.com/textures (filtrer "grass")
- **Recommandé :** "Forest Ground" ou "Short Grass"

#### Dirt/Sand pour chemins
- 🔗 https://polyhaven.com/textures (filtrer "ground")

#### Water textures (améliorer l'océan)
- 🔗 https://playground.babylonjs.com/textures/waterbump.png (déjà utilisé)

---

## 📋 CHECKLIST TÉLÉCHARGEMENT

### Immédiat (NPCs invisibles)
- [ ] `saul.glb` (Sketchfab/Meshy)
- [ ] `clover.glb` (Sketchfab/Meshy)

### Haute priorité (Améliorer visuel)
- [ ] **Quaternius Nature Pack** → Extraire :
  - [ ] 3-5 arbres variés (renommer `tree_oak.glb`, `tree_pine.glb`...)
  - [ ] 5-10 rochers (renommer `rock_01.glb`, `rock_02.glb`...)
  - [ ] 3-5 buissons (renommer `bush_01.glb`...)
  - [ ] 3-5 fleurs (renommer `flower_red.glb`...)
  
- [ ] **Kenney Pirate Kit** → Extraire :
  - [ ] 1 petit bateau → renommer `boat.glb`

### Moyenne priorité (Relief terrain)
- [ ] Créer/télécharger `ohara_heightmap.png`
- [ ] Texture herbe HD (optionnel, améliorer `grass.png`)

### Basse priorité (Expansion future)
- [ ] Bâtiments (maisons, bibliothèque)
- [ ] Animaux additionnels (oiseaux réalistes)
- [ ] Props (bancs, lanternes, livres)

---

## 📂 ORGANISATION DES FICHIERS

```
babylon-prototype/
└── public/
    └── assets/
        ├── models/
        │   ├── robin.glb ✓
        │   ├── tree.glb ✓
        │   ├── saul.glb ⚠️
        │   ├── clover.glb ⚠️
        │   ├── boat.glb ⚠️
        │   ├── nature/
        │   │   ├── tree_oak.glb
        │   │   ├── tree_pine.glb
        │   │   ├── rock_01.glb
        │   │   ├── rock_02.glb
        │   │   ├── bush_01.glb
        │   │   └── flower_red.glb
        │   └── buildings/
        │       ├── house_01.glb
        │       └── library.glb
        └── textures/
            ├── grass.png ✓
            ├── ohara_heightmap.png ⚠️
            ├── dirt.png
            └── sand.png
```

---

## 🎯 PROCHAINES ÉTAPES

### Setup rapide (30 min) :
1. Télécharger **Quaternius Nature Pack**
2. Télécharger **Kenney Pirate Kit**  
3. Extraire/Convertir en GLB si besoin
4. Placer dans `public/assets/models/`
5. Trouver/Créer `saul.glb` et `clover.glb` sur Sketchfab

### Code à ajuster après :
Je mettrai à jour `scatterModernNature()` pour charger les vrais GLB au lieu des formes procédurales.

---

## 💡 TIPS

**Conversion FBX → GLB :**
Si les packs sont en FBX, utiliser :
- 🔗 https://www.gltf-viewer.com/ (en ligne)
- 🔗 Blender (gratuit) : Import FBX → Export GLB

**Test rapide :**
Placer `saul.glb` et `clover.glb` dans `/public/assets/models/` et rafraîchir.
Si ça ne charge pas, vérifier la console (F12).

---

**📞 Une fois téléchargés, dis-moi et je mettrai à jour le code !**
