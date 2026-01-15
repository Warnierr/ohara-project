# 🤖 Guide API & Workflow Meshy + Tripo3D

## 📥 1. Télécharger depuis Meshy (Manuel)

### Étapes
1. Sur la page Meshy de votre modèle
2. **Bouton "Download"** (icône téléchargement en haut à droite)
3. Choisir format : **GLB** (recommandé pour web)
4. Attendre téléchargement
5. Renommer : `robin-meshy.glb`

### Où placer
```
OHARA/
└── public/
    └── assets/
        └── models/
            └── robin-meshy.glb
```

## 🔌 2. APIs Disponibles (Automatisation)

### Meshy API

**Oui, Meshy a une API** ! 🎉

**Documentation** : https://docs.meshy.ai/api/introduction

**Endpoints clés** :
```javascript
// Text-to-3D
POST https://api.meshy.ai/v2/text-to-3d

// Image-to-3D
POST https://api.meshy.ai/v2/image-to-3d

// Get task result
GET https://api.meshy.ai/v2/text-to-3d/:id

// Download model
GET https://api.meshy.ai/v2/text-to-3d/:id/download
```

**API Key** : Gratuite dans le plan free (mêmes crédits)
- Dashboard → API Keys → Copier

**Exemple requête** :
```javascript
const response = await fetch('https://api.meshy.ai/v2/text-to-3d', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${MESHY_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mode: 'preview', // ou 'refine' pour haute qualité
    prompt: 'votre prompt',
    art_style: 'anime',
    negative_prompt: 'realistic, photorealistic'
  })
})

const { result } = await response.json()
// result contient task_id pour polling
```

---

### Tripo3D API

**Oui aussi !** 🚀

**Documentation** : https://platform.tripo3d.ai/docs/api

**Endpoints** :
```javascript
// Text-to-3D
POST https://api.tripo3d.ai/v2/openapi/task

// Get task
GET https://api.tripo3d.ai/v2/openapi/task/:task_id

// Download
// URL fournie dans la réponse task
```

**API Key** : Gratuite (mêmes crédits que web)
- Settings → API Keys → Generate

**Exemple** :
```javascript
const response = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TRIPO_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'text_to_model',
    prompt: 'votre prompt',
    model_version: 'v2.0-20240919'
  })
})

const { data } = await response.json()
// data.task_id pour polling
```

---

## 🔄 3. Workflow Comparaison Automatisé

### Script Node.js pour Tester les 2

Je peux créer un script qui :
1. Envoie même prompt aux 2 APIs
2. Attend génération (polling)
3. Télécharge les 2 GLB
4. Les place dans `/public/assets/models/`
5. Génère une page comparaison côte-à-côte

**Avantages** :
- ✅ Gagner du temps (pas besoin naviguer sur les 2 sites)
- ✅ Même prompt exact sur les 2 (cohérence)
- ✅ Automatisation download
- ✅ Logs des coûts crédits

**Dossier structure** :
```
OHARA/
├── scripts/
│   ├── generate-3d.js       # Script API calls
│   ├── compare-models.html  # Viewer comparaison
│   └── .env                 # API keys (gitignored)
└── public/
    └── assets/
        └── models/
            ├── robin-meshy.glb
            └── robin-tripo.glb
```

---

## 🎯 4. Mixer les 2 Résultats (Blender)

**Pourquoi mixer** :
- Meshy excelle : Textures anime, style cohérent
- Tripo excelle : Géométrie propre, topologie

**Workflow Blender** :
1. Import robin-meshy.glb
2. Import robin-tripo.glb
3. **Shrinkwrap modifier** : Projeter mesh Tripo sur forme Meshy
4. **Mix textures** : Utiliser vertex paint pour blend
5. **Export** : robin-final.glb

**Alternative simple** :
- Utiliser **géométrie Tripo** + **textures Meshy**
- Blender : UV Unwrap du Tripo → Apply texture map de Meshy

---

## 🧪 5. Comparaison dans OHARA

### Component React pour A/B Test

```jsx
// src/components/RobinComparison.jsx
import { useState } from 'react'
import { useGLTF } from '@react-three/drei'

export default function RobinComparison() {
  const [model, setModel] = useState('meshy') // ou 'tripo'
  
  const meshyModel = useGLTF('/assets/models/robin-meshy.glb')
  const tripoModel = useGLTF('/assets/models/robin-tripo.glb')
  
  const currentModel = model === 'meshy' ? meshyModel : tripoModel
  
  return (
    <>
      {/* Model */}
      <primitive object={currentModel.scene} scale={0.01} />
      
      {/* UI Switch */}
      <Html position={[0, 3, 0]}>
        <button onClick={() => setModel('meshy')}>Meshy</button>
        <button onClick={() => setModel('tripo')}>Tripo3D</button>
      </Html>
    </>
  )
}
```

---

## 📋 Prompt Optimisé pour les 2

**Votre prompt Meshy était** :
```
stylized anime child girl character, inspired by a young archaeologist,
short black hair with straight bangs, big expressive blue eyes,
slim child proportions, slightly oversized head,
simple sleeveless dress, holding a book close to her chest,
calm, intelligent and curious expression,
clean anime figurine style, smooth surfaces, soft shading,
not realistic, not photorealistic, high-quality 3D character,
young girl character, child anime style, inspired by Nico Robin from One Piece,
full body standing pose on the island of Ohara with big trees and ancient library ruins,
soft colors, detailed clothes, 3d gameready character, A-pose
```

**Version optimisée** (fonctionne sur les 2) :
```
8-year-old Nico Robin from One Piece, child archaeologist,
long black hair with straight bangs, blue eyes,
purple sleeveless dress, holding ancient book,
calm intelligent expression,
anime cel-shaded style, clean topology, T-pose,
full body character, game-ready low-poly,
Studio Ghibli inspired, soft colors,
NOT realistic, NOT photorealistic
```

**Différences** :
- ✅ Plus concis (mieux pour Tripo)
- ✅ "T-pose" au lieu de "A-pose" (meilleur pour rigging)
- ✅ "long hair" (plus fidèle à Robin)
- ✅ "purple dress" (couleur officielle One Piece)
- ✅ "Studio Ghibli inspired" (active le bon style)

**Negative Prompt** (ajouter sur les 2) :
```
realistic, photorealistic, hyperrealistic, adult, teenager,
low quality, deformed, blurry, mutations
```

---

## 🚀 Prochaines Étapes

### Option A : Manuel
1. Télécharger GLB depuis Meshy
2. Placer dans `/public/assets/models/robin.glb`
3. Je crée le component pour l'importer
4. Test dans la scène

### Option B : API (recommandé si tests multiples)
1. Je crée le script `scripts/generate-3d.js`
2. Vous ajoutez vos API keys dans `.env`
3. Lancer `node scripts/generate-3d.js --prompt "votre_prompt"`
4. Script download les 2 modèles automatiquement
5. Page comparaison générée

**Quelle option préférez-vous ?**

Si vous choisissez B, je code le script complet maintenant ! 🤖
