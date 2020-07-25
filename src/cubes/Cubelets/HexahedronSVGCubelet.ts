import * as THREE from 'three'
import { HexahedronBaseCubelet } from './HexahedronBaseCubelet'

import BLUE from './assets/cubes/blue.svg'
import GREEN from './assets/cubes/green.svg'
import RED from './assets/cubes/red.svg'
import ORANGE from './assets/cubes/orange.svg'
import WHITE from './assets/cubes/white.svg'
import YELLOW from './assets/cubes/yellow.svg'

const stickers = [
  RED,
  ORANGE,
  WHITE,
  YELLOW,
  GREEN,
  BLUE
]

const loader = new THREE.TextureLoader()

export class HexahedronSVGCubelet extends HexahedronBaseCubelet {

  constructor(coordinates: number[]) {
    
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
        opacity: 0,
        transparent: false,
        side: THREE.DoubleSide,
      })
    })
    super(new THREE.BoxGeometry(), materials, coordinates)

    switch(this.i) {
      case 0:
        this._setSticker(1, 1)
        break
      case this.layer - 1:
        this._setSticker(0, 0)
        break
    }
    switch(this.j) {
      case 0:
        this._setSticker(3, 3)
        break
      case this.layer - 1:
        this._setSticker(2, 2)
        break
    }
    switch(this.k) {
      case 0:
        this._setSticker(5, 5)
        break
      case this.layer - 1:
        this._setSticker(4, 4)
        break
    }
  }

  private _setSticker(sticker: number, face: number): void {
    const setting = {
      transparent: false,
      map: loader.load(stickers[sticker])
    }
    this.material[face].setValues(setting)
  }
}
