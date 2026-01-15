import * as THREE from 'three';

/**
 * OharaTree - Arbre du Savoir central
 * 
 * Implémente un arbre stylisé avec 3 niveaux LOD pour optimisation :
 * - LOD 0 (0-20m)   : Haute définition (8 segments tronc, 24 feuillage)
 * - LOD 1 (20-50m)  : Moyenne définition (6 segments, 16 feuillage)
 * - LOD 2 (50m+)    : Basse définition (4 segments, 8 feuillage)
 * 
 * Référence One Piece - L'Arbre de la Connaissance d'Ohara
 */
export class OharaTree {
  constructor(scene) {
    this.scene = scene;
    this.lod = new THREE.LOD();
    
    // Groupe principal pour animations futures
    this.group = new THREE.Group();
    
    this.createTree();
    this.group.add(this.lod);
  }

  createTree() {
    // LOD Level 0 - Proche (haute définition)
    const highDetail = this.createTreeMesh(8, 24, true);
    
    // LOD Level 1 - Moyen (définition normale)
    const mediumDetail = this.createTreeMesh(6, 16, false);
    
    // LOD Level 2 - Loin (basse définition)
    const lowDetail = this.createTreeMesh(4, 8, false);
    
    // Ajouter les niveaux LOD
    this.lod.addLevel(highDetail, 0);
    this.lod.addLevel(mediumDetail, 20);
    this.lod.addLevel(lowDetail, 50);
  }

  /**
   * Crée un mesh d'arbre avec niveau de détail spécifique
   * @param {number} trunkSegments - Segments du tronc
   * @param {number} foliageSegments - Segments du feuillage
   * @param {boolean} includeRoots - Inclure racines apparentes (LOD élevé)
   */
  createTreeMesh(trunkSegments, foliageSegments, includeRoots = false) {
    const tree = new THREE.Group();
    
    // === TRONC ===
    const trunkGeometry = new THREE.CylinderGeometry(
      0.4,    // radius top
      0.6,    // radius bottom (évasé)
      4,      // height
      trunkSegments,
      1,      // height segments
      false   // open ended
    );
    
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2c1a, // Marron écorce
      roughness: 0.9,
      metalness: 0.1,
      flatShading: foliageSegments <= 8 // Low poly style si LOD bas
    });
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2; // Élever le tronc
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);
    
    // === FEUILLAGE (3 couches empilées) ===
    const foliageColors = [
      0x2d5a2d, // Vert foncé (base)
      0x3a6b3a, // Vert moyen
      0x478547  // Vert clair (sommet)
    ];
    
    const foliageScales = [1.8, 1.5, 1.2]; // Tailles décroissantes
    const foliageHeights = [4, 5.5, 7];   // Heights progressives
    
    foliageScales.forEach((scale, i) => {
      const foliageGeometry = new THREE.SphereGeometry(
        scale,
        foliageSegments,
        Math.max(foliageSegments / 2, 4) // Moins de segments verticaux
      );
      
      const foliageMaterial = new THREE.MeshStandardMaterial({
        color: foliageColors[i],
        roughness: 0.8,
        metalness: 0.0,
        flatShading: foliageSegments <= 8
      });
      
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = foliageHeights[i];
      foliage.castShadow = true;
      
      tree.add(foliage);
    });
    
    // === RACINES (seulement LOD élevé) ===
    if (includeRoots) {
      // Racines principales (4 branches)
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        
        const rootGeometry = new THREE.CapsuleGeometry(
          0.15,  // radius
          1.5,   // length
          4,     // cap segments
          8      // radial segments
        );
        
        const root = new THREE.Mesh(rootGeometry, trunkMaterial);
        
        // Position et rotation
        root.position.set(
          Math.cos(angle) * 0.8,
          0.2,
          Math.sin(angle) * 0.8
        );
        
        root.rotation.z = Math.PI / 4; // Incliner
        root.rotation.y = angle;
        
        root.castShadow = true;
        tree.add(root);
      }
      
      // Cercle de racines au sol
      const rootsRingGeometry = new THREE.TorusGeometry(
        1.2,  // radius
        0.12, // tube
        8,    // tubular segments
        16    // radial segments
      );
      
      const rootsRing = new THREE.Mesh(rootsRingGeometry, trunkMaterial);
      rootsRing.rotation.x = Math.PI / 2;
      rootsRing.position.y = 0.05;
      tree.add(rootsRing);
    }
    
    return tree;
  }

  /**
   * Retourne l'objet 3D principal à ajouter à la scène
   */
  getObject() {
    return this.group;
  }

  /**
   * Animation douce du feuillage (vent)
   * @param {number} time - Temps écoulé
   */
  animate(time) {
    // Légère oscillation du feuillage (vent)
    this.lod.rotation.y = Math.sin(time * 0.2) * 0.05;
    
    // Balancement subtil
    this.group.rotation.z = Math.sin(time * 0.3) * 0.02;
  }

  /**
   * Cleanup - Libère les ressources
   */
  dispose() {
    this.lod.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    
    // Retirer de la scène
    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
  }
}
