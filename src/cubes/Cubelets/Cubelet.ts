import * as THREE from 'three'

const colors = [
  new THREE.Color('red'),
  new THREE.Color('orange'),
  new THREE.Color('white'),
  new THREE.Color('yellow'),
  new THREE.Color('green'),
  new THREE.Color('skyblue'),
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
        // color: new THREE.Color(0x45f1f1)
      })
    })

    switch(i) {
      case 0:
        Cubelet.setColor(materials, 1, 1)
        break
      case layer - 1:
        Cubelet.setColor(materials, 0, 0)
        break
    }

    switch(j) {
      case 0:
        Cubelet.setColor(materials, 3, 3)
        break
      case layer - 1:
        Cubelet.setColor(materials, 2, 2)
        break
    }

    switch(k) {
      case 0:
        Cubelet.setColor(materials, 5, 5)
        break
      case layer - 1:
        Cubelet.setColor(materials, 4, 4)
        break
    }

    super(new THREE.BoxGeometry, materials)
    this.i = i
    this.j = j
    this.k = k
    this.center = Math.floor(layer / 2)                      // center position


    // setting properties
    // TODO better name?
    this.name = (i * layer * layer + j * layer + k).toString()
    this.setInitialPosition()
    // this.position.set(i - this.center, j - this.center, k - this.center)

  }

  public setSticker(sticker: number, face: number): void {
    // console.log(stickers[sticker])
    const setting = {
      transparent: false,
      color: colors[sticker]
      // map: new THREE.TextureLoader().load('./assets/cubes/blue.png')
    }
    this.material[face].setValues(setting)
  }

  public static setColor(materials: Array<THREE.Material>, color: number, face: number): void {
    const setting = {
      transparent: false,
      color: colors[color],
    }
    materials[face].setValues(setting)
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
