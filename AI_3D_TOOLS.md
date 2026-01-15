# 🤖 Outils IA pour Création 3D (Alternatives à Meshy)

## Comparatif des Générateurs Text-to-3D (2026)

### 🏆 Meilleurs Gratuits

**1. Meshy AI** (votre choix actuel)
- Website: https://www.meshy.ai
- **Free tier**: 200 crédits/mois (≈20 modèles)
- **Qualité**: ⭐⭐⭐⭐ (excellente pour anime/stylisé)
- **Vitesse**: 2-5 minutes
- **Formats**: GLB, FBX, OBJ, USDZ
- **Avantages**: 
  - Très bon pour style anime/cartoon
  - AI Texturing excellent
  - Image-to-3D aussi disponible
- **Limites**: Modèles parfois low-poly

**2. Tripo3D**
- Website: https://www.tripo3d.ai
- **Free tier**: 100 crédits/mois
- **Qualité**: ⭐⭐⭐⭐⭐ (meilleur pour réalisme)
- **Vitesse**: 1-3 minutes (le plus rapide)
- **Formats**: GLB, FBX, OBJ
- **Avantages**:
  - Qualité topologie supérieure
  - IA rigging automatique
  - Retopology en 1 clic
- **Recommandé pour**: Robin (personnage réaliste)

**3. Luma AI Genie**
- Website: https://lumalabs.ai/genie
- **Free tier**: Illimité (mais qualité limitée)
- **Qualité**: ⭐⭐⭐ (bon pour prototypage)
- **Vitesse**: 30 secondes - 2 minutes
- **Formats**: GLB, USDZ
- **Avantages**:
  - Gratuit illimité
  - Très rapide
  - API disponible
- **Limites**: Moins de détails, parfois déformations

### 💎 Payants Premium (si budget)

**4. RODIN** (par Hyperhuman)
- Website: https://hyperhuman.deemos.com/rodin
- **Prix**: $19/mois (100 générations)
- **Qualité**: ⭐⭐⭐⭐⭐ (qualité professionnelle)
- **Avantages**:
  - Textures 4K PBR
  - Support multi-LOD automatique
  - Rigging + animations

**5. Kaedim3D**
- Website: https://www.kaedim3d.com
- **Prix**: $29/mois
- **Qualité**: ⭐⭐⭐⭐⭐ (avec artiste humain QA)
- **Avantages**:
  - Image → 3D avec vérification artiste
  - Garantie qualité production
  - Retakes illimités

### 🎨 Outils Spécialisés

**6. Sloyd** (pour assets environnement)
- Website: https://www.sloyd.ai
- **Free tier**: 10 exports/mois
- **Usage**: Génération d'objets 3D simples (rochers, arbres, props)
- **Avantages**:
  - Contrôle paramétrique (taille, forme)
  - Style cohérent
- **Recommandé pour**: Tours Ohara, rochers, végétation

**7. Polycam + AI** (photogrammétrie améliorée)
- Website: https://poly.cam
- **Free tier**: 3 scans/mois
- **Usage**: Scan objets réels → modèle 3D
- **Si vous avez**: Figurines One Piece → scannez-les !

### 🆓 Open Source

**8. Shap-E** (OpenAI)
- Repository: https://github.com/openai/shap-e
- **Gratuit**: Oui (self-hosted)
- **Qualité**: ⭐⭐⭐ (recherche, expérimental)
- **Setup**: Nécessite GPU (CUDA)
- **Avantages**: Totalement gratuit, modifiable

**9. DreamFusion + Stable Dreamfusion**
- **Gratuit**: Oui (Google Colab)
- **Qualité**: ⭐⭐⭐⭐ (bonne pour stylisé)
- **Temps**: 1-2 heures de génération
- **Avantages**: NeRF-based, très détaillé

---

## 🌳 Recommandation pour OHARA

### Pour Robin Enfant

**Plan A** (Gratuit) :
1. **Tripo3D** pour qualité supérieure :
   ```
   Prompt: "8-year-old girl, Nico Robin from One Piece, 
   purple dress, long black hair, standing T-pose, 
   anime style, cel-shaded, full body"
   ```
2. Si insatisfait → **Meshy AI** avec même prompt
3. Affiner dans Blender (retopology si besoin)

**Plan B** (DIY Blender) :
1. Base: MakeHuman (gratuit, preset enfant)
2. Import dans Blender
3. Sculpt details (cheveux, robe)
4. Rig avec Rigify
5. Textures manuelles

**Plan C** (Payant) :
- **RODIN** ($19) si besoin urgence qualité pro

### Pour Arbre de la Connaissance

**Meilleur workflow** :
1. **Sloyd.ai** pour générer base tronc stylisé
2. Import dans Blender
3. Sculpt racines avec Dyntopo
4. Appliquer shader Ghibli

Alternative :
- Meshy AI : "Giant ancient tree, blue-purple bark, massive twisted roots, wide flat canopy, One Piece Ohara style, low poly"

### Pour Bibliothèque & Props

**Sloyd** (objets simples) :
- Livres, étagères, lanternes, tables

**Meshy** (éléments complexes) :
- Astrolabe central
- Statues/décorations

---

## 📊 Tableau Comparatif Rapide

| Outil | Gratuit | Qualité | Vitesse | Anime Style | Usage Ohara |
|-------|---------|---------|---------|-------------|-------------|
| **Meshy** | ✅ 200/mois | ⭐⭐⭐⭐ | Moyenne | ✅ Excellent | ✅ Robin backup |
| **Tripo3D** | ✅ 100/mois | ⭐⭐⭐⭐⭐ | Rapide | ⚠️ Moyen | ✅ Robin principal |
| **Luma Genie** | ✅ Illimité | ⭐⭐⭐ | Très rapide | ⚠️ OK | ✅ Prototypage |
| **Sloyd** | ✅ 10/mois | ⭐⭐⭐⭐ | Instantané | ⚠️ N/A | ✅ Props |
| **RODIN** | ❌ $19/m | ⭐⭐⭐⭐⭐ | Rapide | ✅ Bon | ⚠️ Si budget |

---

## 🚀 Workflow Recommandé (Gratuit → DIY → Payant)

### Semaine 1 (Gratuit) :
1. **Robin** :
   - Générer avec Tripo3D (meilleure qualité)
   - Backup avec Meshy si insatisfait
   - Tester import dans Scene.jsx

2. **Arbre** :
   - Essayer Meshy AI (prompt arbre Ohara)
   - Sinon → Sloyd pour base

3. **Props** :
   - Luma Genie pour prototypage rapide
   - Livres, rochers basiques

### Semaine 2 (DIY si nécessaire) :
- Blender retopology sur assets Tripo/Meshy
- Sculpt détails manquants
- UV unwrap propre
- Textures Poly Haven

### Semaine 3 (Payant en dernier recours) :
- Si Robin toujours insatisfaisant → RODIN ($19)
- Ou commission Fiverr artiste 3D ($100-200)

---

## 🔗 Liens Directs

- **Tripo3D**: https://www.tripo3d.ai (S'inscrire)
- **Meshy**: https://www.meshy.ai (Votre choix actuel)
- **Luma Genie**: https://lumalabs.ai/genie (Gratuit illimité)
- **Sloyd**: https://www.sloyd.ai (Props/environnement)
- **Poly Haven**: https://polyhaven.com (Textures/HDRI gratuits)

**Prochaine étape** : Tester Tripo3D et Meshy en parallèle avec même prompt, comparer résultats ! 🎨
