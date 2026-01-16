# 🎬 OBJETS ANIMÉS & DÉCORATIFS GLB - MONDE GHIBLI

## 🎯 VUE D'ENSEMBLE

Ce guide liste toutes les ressources pour ajouter de la **vie** et du **détail** au monde OHARA : personnages animés, objets interactifs, props décoratifs, animaux, et plus !

---

## 👤 PERSONNAGES ANIMÉS (Rigged & Animated)

### ⭐ #1 - Quaternius Universal Characters + Animations (GRATUIT CC0)

**🔗 Personnages** : https://quaternius.itch.io/universal-base-characters  
**🔗 Animations** : https://quaternius.itch.io/universal-animation-library

**Pourquoi c'est parfait :**
- ✅ **Personnages riggés** compatibles avec les animations
- ✅ **120+ animations** : marche, course, combat, nage, assis, mort, emotes...
- ✅ **Format GLB** inclus (direct Babylon.js)
- ✅ **CC0** (gratuit, usage commercial)
- ✅ **Compatible Mixamo** (tu peux ajouter encore plus d'animations)

**📦 Versions** :
- **Standard (GRATUIT)** : 45 animations + personnages de base
- **Pro ($9.99)** : Les 120 animations + plus de personnages

**🎬 Animations disponibles** :
- **Locomotion** : Marche, course, sprint, ramper, nager
- **Combat** : Attaque épée, tir, parade
- **Emotes** : Saluer, danser, pleurer
- **Actions** : S'asseoir, sauter, ouvrir porte

---

### 🎨 #2 - Mixamo (Adobe - GRATUIT)

**🔗 Lien** : https://www.mixamo.com/

**Le service d'animation le plus populaire !**
- ✅ **2000+ animations** gratuites
- ✅ **Auto-rigging** : Upload ton perso, il le rigge automatiquement
- ✅ **Export FBX** → convertir en GLB

**Convertir FBX → GLB** :
- Windows : 3D Viewer (File > Save As > GLB)
- Cross-platform : Blender (Import FBX > Export glTF)
- En ligne : https://products.aspose.app/3d/conversion/fbx-to-glb

---

### 🎭 #3 - Poly Pizza Characters (GRATUIT)

**🔗 Lien** : https://poly.pizza/explore/People-and-Characters
- ✅ **10,500+ modèles 3D** gratuits
- ✅ Personnages **riggés + animés**
- ✅ Format **GLB/FBX**

---

## 🐾 ANIMAUX ANIMÉS

- **Quaternius Animal Packs** : https://quaternius.com/
- Oiseaux (vol, marche), Poissons (nage), Animaux terrestres

---

## 🏠 OBJETS DÉCORATIFS

### Kenney Furniture Pack
- https://kenney.nl/assets/furniture-kit
- Tables, chaises, lits, armoires (CC0)

### Quaternius Medieval Pack
- https://quaternius.itch.io/medieval-interiors
- Meubles, tonneaux, caisses (CC0, GLB)

### Poly Pizza Props
- https://poly.pizza/explore
- Recherche : "furniture", "props", "decoration"

---

## 🌸 ÉLÉMENTS DE VIE

### Papillons/Oiseaux Animés
- Sketchfab : "animated butterfly low poly"
- Quaternius Ultimate Animals Pack

### Poissons
- Poly Pizza : "animated fish low poly"

---

## 🚣 BATEAUX & VÉHICULES

### Kenney Pirate Kit
- https://kenney.nl/assets/pirate-kit
- **Barques en bois**, voiliers, canots (CC0)

---

## 🎨 OBJETS SPÉCIAUX GHIBLI

### Props Japonais
Recherches Sketchfab :
- "torii gate", "japanese lantern", "shrine", "bamboo"

---

## 📦 TOP 5 PACKS ESSENTIELS

1. **Quaternius Stylized Nature MegaKit** ($0) - Déjà téléchargé ✅
2. **Quaternius Characters + Animations** ($0)
3. **Kenney Nature Kit** ($0)
4. **Kenney Furniture Kit** ($0)
5. **Kenney Pirate Kit** ($0)

**Total : 1000+ assets, 0€, CC0 !**

---

## 🛠️ CODE BABYLON.JS

### Charger Personnage avec Animations
```typescript
SceneLoader.ImportMeshAsync("", "assets/", "character.glb", scene).then((result) => {
  console.log("Animations:", result.animationGroups.map(a => a.name));
  
  // Joue animation
  const walkAnim = result.animationGroups.find(a => a.name === "Walk");
  if (walkAnim) walkAnim.play(true); // true = loop
});
```

### Wind Shader pour Herbe
```typescript
// Anime herbe avec le vent
scene.registerBeforeRender(() => {
  grass.forEach(blade => {
    blade.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
  });
});
```

### Particle System Feu
```typescript
const fireSystem = new ParticleSystem("fire", 2000, scene);
fireSystem.particleTexture = new Texture("textures/flare.png");
fireSystem.color1 = new Color4(1, 0.5, 0, 1);
fireSystem.color2 = new Color4(1, 0, 0, 1);
fireSystem.start();
```

---

## 🎯 PLAN D'ACTION OHARA

### ✅ Déjà fait :
- Nature MegaKit téléchargé
- Textures herbe intégrées
- Système d'animation Robin (prêt pour plus d'animations)

### 📋 Prochaines étapes :

**Aujourd'hui :**
1. Télécharger Quaternius Characters + Animations Standard
2. Télécharger Kenney Pirate Kit (barque)

**Cette semaine :**
3. Ajouter oiseaux/poissons animés
4. Intégrer meubles/props décoratifs
5. Créer particle systems (feu, lumière)

**Semaine prochaine :**
6. Wind shader pour végétation
7. Toon shader style Ghibli
8. Optimisation performances

---

## 🔗 LIENS RAPIDES

- 🌲 Nature : https://quaternius.itch.io/stylized-nature-megakit [TÉLÉCHARGÉ]
- 👤 Persos : https://quaternius.itch.io/universal-base-characters
- 🎬 Anims : https://quaternius.itch.io/universal-animation-library
- 🎨 Mixamo : https://www.mixamo.com/
- 🍕 Poly Pizza : https://poly.pizza/
- 🎪 Kenney : https://kenney.nl/assets
- 🚣 Pirate Kit : https://kenney.nl/assets/pirate-kit

---

**Ce guide = Roadmap complète pour monde Ghibli vivant ! 🌸✨**
