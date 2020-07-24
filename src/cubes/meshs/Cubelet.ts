import * as THREE from 'three'

import * as BLUE from './assets/cubes/blue.png'
import * as GREEN from './assets/cubes/green.png'
import * as ORANGE from './assets/cubes/orange.png'
import * as RED from './assets/cubes/red.png'
import * as WHITE from './assets/cubes/white.png'
import * as YELLOW from './assets/cubes/yellow.png'

const stickers = [
  BLUE,
  GREEN,
  ORANGE,
  RED,
  WHITE,
  YELLOW
]
/*
  A simple hexahedron cubelet.
  TODO prettier meshs
 */
export class Cubelet extends THREE.Mesh {
  // i, j, k and layer indicate coordinates
  i: number
  j: number
  k: number
  center: number

  constructor(i: number, j: number, k: number, layer: number) {
    // basic mesh construction
    const materials = [
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
      new THREE.MeshBasicMaterial(),
    ]
    materials.forEach((el) => {
      el.needsUpdate = true
      el.setValues({
        // no transparency at first, adjust later
        opacity: 0,
        transparent: false,
        side: THREE.DoubleSide,
      })
    })

    super(new THREE.BoxGeometry, materials)
    this.i = i
    this.j = j
    this.k = k
    this.center = Math.floor(layer / 2)                      // center position

    // setting stickers according to coordinate
    switch(i) {
      case 0:
        this.setSticker(0, 0)
        break
      case layer:
        this.setSticker(1, 1)
        break
    }

    switch(j) {
      case 0:
        this.setSticker(2, 2)
        break
      case layer:
        this.setSticker(3, 3)
        break
    }

    switch(k) {
      case 0:
        this.setSticker(4, 4)
        break
      case layer:
        this.setSticker(5, 5)
        break
    }


    // setting properties
    // TODO better name?
    this.name = (i * layer * layer + j * layer + k).toString()
    this.setInitialPosition()
    // this.position.set(i - this.center, j - this.center, k - this.center)

  }

  public setSticker(sticker: number, face: number): void {
    const setting = {
      transparent: false,
      map: new THREE.TextureLoader().load(stickers[sticker])
    }
    this.material[face].setValues(setting)
  }

  public setInitialPosition(): void {
    this.position.set(
      this.i - this.center,
      this.j - this.center,
      this.k - this.center
    )
    this.rotation.set(0, 0, 0)
  }

  public rotateOnCubeAxis(axis: THREE.Vector3, angle: number) {
    const pos = this.position.clone()
    pos.applyAxisAngle(axis, angle)
    this.rotateOnWorldAxis(axis, angle)
    this.position.copy(pos)
  }
}
