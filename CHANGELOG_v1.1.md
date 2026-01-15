# 🎮 OHARA - Améliorations Contrôles & Debug (v1.1)

## ✅ Corrections Appliquées

### 1. 🐛 Bug Physics Résolu

**Problème** : Personnage devient incontrôlable et part dans une direction
**Cause** : Accumulation de forces physiques sans damping
**Solutions implémentées** :

```javascript
// Robin.jsx - Ajouts anti-bug
linearDamping={0.5}        // Ralentit mouvement horizontal
angularDamping={1.0}       // Empêche rotation non désirée

// Détection overflow velocity
if (velMagnitude > 20) {
  logError('Velocity overflow detected')
  player.setLinvel({ x: 0, y: 0, z: 0 }, true)
}

// Détection chute à travers le monde
if (pos.y < -10) {
  logError('Player fell through world')
  player.setTranslation({ x: 0, y: 2, z: 10 }, true)
}
```

### 2. 🎥 Contrôle Caméra avec Souris

**Problème** : Caméra ne réagissait pas aux mouvements souris
**Solution** : Système orbital third-person

**Contrôles** :
- **Clic Droit + Drag** : Rotation caméra horizontale/verticale
- **Clamp vertical** : Limité entre 0.1 et 1.5 radians (empêche retournement)

```javascript
// Rotation horizontale : -180° à +180°
cameraRotation.current.horizontal -= movementX * 0.003

// Rotation verticale : clampée
cameraRotation.current.vertical = Math.max(0.1, Math.min(1.5, vertical))

// Position caméra
const camDistance = 8
const targetCamPos = new THREE.Vector3(
  pos.x - Math.sin(camAngle) * camDistance,
  pos.y + camHeight + vertical * 3,
  pos.z - Math.cos(camAngle) * camDistance
)
```

**Déplacement** : Maintenant relatif à la caméra (WASD bouge dans direction regardée)

### 3. 📊 Système de Logging

**Nouveau Component** : `ErrorLog.jsx`

**Fonctionnalités** :
- ✅ Bouton flottant en bas à droite
- ✅ Badge rouge si erreurs détectées (⚠️ + nombre)
- ✅ Panel déroulant avec logs horodatés
- ✅ JSON data capture pour debug
- ✅ Console.error automatique
- ✅ Limite 20 dernières erreurs

**Erreurs trackées** :
- Velocity overflow (> 20 m/s)
- Chute à travers le monde (y < -10)
- Frame loop errors (try/catch général)
- Reset failures

**Usage** :
```javascript
import { useGameStore } from './stores/useGameStore'

const logError = useGameStore((state) => state.logError)
logError('Message descriptif', { data: someData })
```

### 4. 🔄 Reset Position (Touche R)

**Problème** : Pas moyen de revenir au spawn si bloqué
**Solution** : Touche R pour reset complet

**Actions du reset** :
1. Téléportation au spawn (0, 2, 10)
2. Vitesse linéaire → 0
3. Vitesse angulaire → 0
4. Rotation caméra → défaut (0, 0.4)
5. Log confirmation "✅ Player reset to spawn position"

```javascript
// Appuyez sur R
player.setTranslation({ x: 0, y: 2, z: 10 }, true)
player.setLinvel({ x: 0, y: 0, z: 0 }, true)
player.setAngvel({ x: 0, y: 0, z: 0 }, true)
```

---

## 🎮 Contrôles Mis à Jour

| Action | Contrôle | Description |
|--------|----------|-------------|
| **Avancer** | W | Vers direction caméra |
| **Reculer** | S | Opposé direction caméra |
| **Gauche** | A | Strafe gauche |
| **Droite** | D | Strafe droite |
| **Sauter** | Espace | Jump (si au sol) |
| **Rotation Caméra** | Clic Droit + Drag | Orbital autour de Robin |
| **Reset** | R | Retour au spawn |
| **Interagir** | Clic Gauche | Objets cliquables (livres) |

---

## 🔍 Panel Debug (Dev Mode)

**Visible uniquement en développement** (`import.meta.env.DEV`)

### Interface

**Bouton flottant** (bas droite) :
- 📋 Vert = pas d'erreurs
- ⚠️ Rouge + nombre = erreurs actives

**Panel ouvert** :
- Header : Nombre d'erreurs + bouton "Clear"
- Liste erreurs (plus récentes en haut) :
  - Message erreur (rouge)
  - Timestamp (gris)
  - Data JSON (noir, scrollable)

**Exemple d'erreur loggée** :
```json
{
  "timestamp": "2026-01-15T01:55:28.123Z",
  "message": "Velocity overflow detected",
  "data": {
    "vel": { "x": 25.3, "y": 0, "z": -18.7 },
    "pos": { "x": 10.2, "y": 1.5, "z": 5.8 }
  },
  "id": 1736907328123
}
```

---

## 🚀 Prochaines Améliorations Possibles

### Performance
- [ ] **FPS Monitor** : Afficher FPS en temps réel (HUD)
- [ ] **Draw Calls** : Afficher nombre draw calls (debug)
- [ ] **Auto-Quality** : Baisser qualité si FPS < 30

### Gameplay
- [ ] **Sprint** : Shift pour courir (vitesse × 1.5)
- [ ] **Crouch** : Ctrl pour s'accroupir
- [ ] **Inventory** : Touche I pour inventaire (Phase 3)

### Camera
- [ ] **Zoom** : Molette souris pour ajuster distance caméra
- [ ] **Camera Modes** : F pour switch 1st/3rd person
- [ ] **Free Look** : Maintenir Alt pour regarder sans bouger perso

### Sauvegarde
- [ ] **Auto-Save** : LocalStorage toutes les 30 secondes
- [ ] **Save Slots** : 3 emplacements de sauvegarde
- [ ] **Data sauvegardée** :
  - Position player
  - Zone actuelle
  - Dialogues vus
  - Objets interactés
  - Easter eggs trouvés

### UI/UX
- [ ] **Settings Menu** : Esc pour ouvrir
  - Volume musique/SFX
  - Sensibilité souris
  - Qualité graphique
  - Inverser Y axis
- [ ] **Minimap** : Coin haut-droit (2D overview)
- [ ] **Quest Log** : Suivi objectifs (Phase 3)

---

## 📝 Notes Techniques

### Damping Physics

**Linear Damping (0.5)** :
- Réduit vitesse horizontale progressivement
- Empêche sliding infini après arrêt input
- 0 = glisse infini, 1 = stop immédiat

**Angular Damping (1.0)** :
- Lock rotation complète
- Combiné avec `enabledRotations={[false, false, false]}`
- Empêche personnage de basculer

### Camera Lerp

**Delta × 5** = suivit rapide mais smooth
- Delta × 2 = plus lent, plus cinématique
- Delta × 10 = quasi instantané (peut donner mal de tête)

```javascript
camera.position.lerp(targetCamPos, delta * 5)
```

**Formule** : `newPos = currentPos + (target - currentPos) * factor`

### Zustand Error Store

**Slice dernières 20 erreurs** :
```javascript
errors: [...state.errors.slice(-19), error]
```
- Évite memory leak si énormément d'erreurs
- Garde historique récent suffisant

---

## 🧪 Tests à Faire

### Vérifier Corrections

1. **Velocity Bug** :
   - Sauter contre un mur pendant 10 secondes
   - Vérifier si reset automatique se déclenche
   - Check log d'erreur

2. **Caméra** :
   - Clic droit + drag horizontalement
   - Rotation 360° doit fonctionner
   - WASD bouge dans direction caméra

3. **Reset** :
   - Marcher loin du spawn
   - Appuyer R
   - Vérifier téléportation instantanée

4. **Error Log** :
   - Forcer bug (sauter très haut, tomber hors map)
   - Vérifier panel affiche erreur
   - Clear errors fonctionne

---

## 🎨 Prochaine Étape : Assets 3D

**Robin avec IA** (gratuit d'abord) :
1. Tester **Tripo3D** : https://www.tripo3d.ai
2. Backup **Meshy** : https://www.meshy.ai
3. Comparer qualité

**Consulter** : `AI_3D_TOOLS.md` pour comparatif complet

---

**Version** : 1.1  
**Date** : 2026-01-15  
**Changelog** : Camera controls, physics damping, error logging, reset button
