# ⚡ OHARA - Performance Budget

## Objectifs Non Négociables

| Device | Target FPS | Minimum Acceptable | Resolution |
|--------|------------|-------------------|------------|
| **Desktop** (GTX 1060+) | 60 stable | 55 | 1080p-1440p |
| **Laptop** (Integrated GPU) | 45-60 | 40 | 1080p |
| **Mobile** (Mid-range) | 30-45 | 25 | 720p-1080p |

---

## Budget Draw Calls

### Limites Strictes

| Category | Desktop | Mobile | Notes |
|----------|---------|--------|-------|
| **Total Draw Calls** | <50 | <30 | Hard limit |
| **Trees** | 1 | 1 | Instancing obligatoire |
| **Flowers** | 5 | 3 | 5 colors instanced |
| **Particules** | 1 | 1 | Points material |
| **Ground** | 2 | 2 | Main + center circle |
| **UI 3D** | <5 | <3 | Tooltips, labels |
| **Post-FX** | 3 | 2 | Bloom + AO + ToneMapping |

### Monitoring

```javascript
// Check dans console
renderer.info.render.calls  // Doit être <50 desktop, <30 mobile
```

---

## Budget Triangles

### Par Objet

| Object | LOD 0 (0-20m) | LOD 1 (20-50m) | LOD 2 (50m+) |
|--------|---------------|----------------|--------------|
| **Arbre du Savoir** | ~5000 | ~2000 | ~800 |
| **Tree (instance)** | ~600 | ~400 | ~200 |
| **Flower (instance)** | ~18 | ~12 | N/A |
| **Ground** | ~800 | ~800 | ~800 |

### Total Scene

| Device | Max Triangles | Current | Margin |
|--------|--------------|---------|--------|
| **Desktop** | 50,000 | ~30,000 | 40% |
| **Mobile** | 30,000 | ~20,000 | 33% |

---

## Budget Textures

### Résolutions Max

| Texture Type | Desktop | Mobile | Format |
|--------------|---------|--------|--------|
| **Environnement HDRI** | 1K | 512px | HDR |
| **Ground** | 2K | 1K | JPG/WebP |
| **Bark (if used)** | 1K | 512px | JPG |
| **Foliage** | N/A | N/A | Procedural color |
| **UI Assets** | 512px | 256px | PNG |

### Memory Target

| | Desktop | Mobile |
|---|---------|--------|
| **Total Texture Memory** | <100MB | <50MB |
| **Current Estimated** | ~20MB | ~10MB |

**Note** : Actuellement low-poly avec couleurs procédurales = très peu de textures

---

## Budget Shaders

### Material Usage

| Material Type | Count | Complexity | Notes |
|--------------|-------|------------|-------|
| **MeshStandardMaterial** | ~8 | Medium | PBR, flat shading |
| **PointsMaterial** | 1 | Low | Particules |
| **Custom Shaders** | 0 | N/A | Éviter si possible |

### Shader Complexity

- **Vertex Shaders** : Simple transforms uniquement
- **Fragment Shaders** : PBR standard, pas de raytrac

ing custom
- **Compute Shaders** : None (WebGPU futur si besoin)

---

## Budget DPR (Device Pixel Ratio)

### Configuration

```javascript
<Canvas dpr={[1, 1.5]} />
```

| Device | DPR Min | DPR Max | Notes |
|--------|---------|---------|-------|
| **Desktop** | 1 | 1.5 | Jamais 2 (trop lourd) |
| **Laptop** | 1 | 1.5 | |
| **Mobile** | 1 | 1.5 | iPhone Retina = 2 nativement, on cap à 1.5 |

**Adaptive DPR** : `<AdaptiveDpr pixelated />` (réduit si FPS < 50)

---

## Budget Post-Processing

### Stack Autorisée

| Effect | Desktop | Mobile | Cost | Priority |
|--------|---------|--------|------|----------|
| **Bloom** | ✅ | ✅ | Medium | High |
| **N8AO** | ✅ | ⚠️ | High | Medium |
| **ToneMapping** | ✅ | ✅ | Low | High |
| **Vignette** | ✅ | ✅ | Low | Low |
| **FXAA** | ✅ | ✅ | Low | Medium |
| **DOF** | ❌ | ❌ | Very High | Nice-to-have |
| **SSR** | ❌ | ❌ | Very High | Not needed |

### Mobile Strategy

Si FPS < 30 sur mobile :
1. Désactiver N8AO
2. Réduire Bloom iterations
3. Fallback FXAA → antialias natif

---

## Budget Instance

### Instancing Targets

| Object | Instances | Draw Calls | Économie |
|--------|-----------|------------|----------|
| **Trees** | 13 | 1 | 92% saved |
| **Flowers** | 150 (5×30) | 5 | 96% saved |
| **Rocks** (futur) | 50 | 1 | 98% saved |

**Total** : ~213 objets en **7 draw calls** au lieu de 213

---

## Budget Animation

### Performance Impact

| Animation | Update Frequency | Cost | Notes |
|-----------|-----------------|------|-------|
| **Wind (arbre)** | Every frame | Low | Simple sin/cos |
| **Particules** | Every frame | Medium | Buffer update |
| **Camera lerp** | Every frame | Low | Vector3 lerp |
| **Hover effects** | On event | Low | setState + spring |

---

## Budget Network (Multijoueur)

### Bande Passante

| Data | Send Rate | Size | Total |
|------|-----------|------|-------|
| **Position** | 20/sec | ~12 bytes | ~240 B/s |
| **Rotation** | 10/sec | ~4 bytes | ~40 B/s |
| **Actions** | On event | ~50 bytes | Variable |

**Target** : <500 bytes/sec par joueur

### Server Load

| Players | Messages/sec | CPU Target | RAM Target |
|---------|--------------|-----------|-----------|
| 10 | 200 | <10% | <50MB |
| 50 | 1000 | <30% | <200MB |
| 100 | 2000 | <50% | <400MB |

---

## Monitoring Tools

### En Développement

```typescript
import { Perf } from 'r3f-perf'

<Canvas>
  {process.env.NODE_ENV === 'development' && (
    <Perf position="top-left" />
  )}
</Canvas>
```

**Métriques affichées**
- FPS
- Draw calls
- Triangles
- Memory
- GPU time

### Production

```typescript
import { PerformanceMonitor } from '@react-three/drei'

<PerformanceMonitor
  onDecline={(fps) => {
    // Si FPS < 30, réduire qualité
    if (fps < 30) {
      setQuality('low')
    }
  }}
>
  {children}
</PerformanceMonitor>
```

---

## Alertes Budget Dépassé

### Thresholds

| Métrique | Warning | Critical | Action |
|----------|---------|----------|--------|
| **FPS** | <50 | <30 | Réduire qualité |
| **Draw Calls** | >40 | >60 | Optimiser instancing |
| **Memory** | >80MB | >150MB | Compresser assets |
| **Load Time** | >3s | >5s | Code splitting |

---

## Optimisations Futures

### Si Budget Dépassé

**Priority Order**
1. Instancing (plus d'objets)
2. LOD (réduire détails loin)
3. Texture compression (KTX2)
4. Occlusion culling (si grosse scène)
5. Code splitting (lazy load zones)

**Last Resort**
- Réduire nombre particules
- Désactiver certains post-FX
- Baisser résolution renderer

---

## Validation

### Checklist Avant Merge

- [ ] FPS >= target sur test devices
- [ ] Draw calls < limit
- [ ] Triangles < budget
- [ ] Memory stable (pas de leak)
- [ ] Load time < 3s
- [ ] r3f-perf green
- [ ] Lighthouse Performance > 90

---

**Version** : 1.0  
**Dernière mise à jour** : 2026-01-15  
**Status** : ✅ Enforced
