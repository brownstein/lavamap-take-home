import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'

class SceneController {
  constructor(scene, groundPlane, camera, controller, threeViewport, colorPickerRef) {
    this.scene = scene
    this.sceneObjects = []
    this.groundPlane = groundPlane
    this.camera = camera
    this.controller = controller
    this.viewport = threeViewport

    this.colorPickerRef = colorPickerRef

    this.mousePosition = new THREE.Vector2()

    this.target = null;

    this.viewport.addEventListener('mousedown', this.mouseCapture)
    this.viewport.addEventListener('mousemove', this.setMousePosition)
  }

  setMousePosition = (event) => {
    const bounds = this.viewport.getBoundingClientRect()
    const positionX = (event.clientX - bounds.left) * this.viewport.clientWidth  / bounds.width
    const positionY = (event.clientY - bounds.top ) * this.viewport.clientHeight / bounds.height

    this.mousePosition.x = (positionX / this.viewport.clientWidth) *  2 - 1
    this.mousePosition.y = (positionY / this.viewport.clientHeight) * -2 + 1
  }

  createObject(color, positionX, positionZ) {
    const hex = `0x${color}`
    const box = new THREE.BoxGeometry( 25, 25, 25 )
    const material = new THREE.MeshBasicMaterial( { color: parseInt(hex, 16)} )
    const mesh = new THREE.Mesh( box, material )
    mesh.position.set(positionX, 10, positionZ)
    this.scene.add(mesh)
    this.sceneObjects.push({box, material, mesh})
    this.target = mesh;
  }

  mouseCapture = (event) => {
    if (event.button === 0) {
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera( this.mousePosition, this.camera )
      const intersect = raycaster.intersectObject( this.groundPlane )
      if (intersect.length) {
        this.createObject(this.colorPickerRef.selectedColor, intersect[0].point.x, intersect[0].point.z)
      }
    }
  }

  move(viewportDelta) {
    const { Vector3 } = THREE;
    // this isn't ideal, but using a delta works!
    const p1 = new Vector3(0, 0, 0);
    const p2 = new Vector3(viewportDelta.x, viewportDelta.y, 0);
    p1.unproject(this.camera);
    p2.unproject(this.camera);
    const delta3 = p2.clone().sub(p1);
    if (!this.target) {
      return;
    }
    this.target.position.add(delta3);
  }

  reset() {
    this.sceneObjects.forEach(({box, material, mesh}) => {
      this.scene.remove(mesh)
      box.dispose()
      material.dispose()
    })
    this.sceneObjects = []
    this.target = null;
  }

}

export {SceneController}
