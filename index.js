import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'

import {ColorPicker} from './colorPicker.js'
import {CameraController} from './cameraController.js'
import {SceneController} from './sceneController.js'

const threeViewport = document.querySelector('#threeViewport')
const resetButton = document.querySelector('#reset')
const buttons = {};
buttons.up = document.querySelector('#up');
buttons.down = document.querySelector('#down');
buttons.left = document.querySelector('#left');
buttons.right = document.querySelector('#right');

const bounds = 600
let scene, sceneController, renderer, camera, cameraController


const initializeScene = () => {
  const { Vector2 } = THREE;

  scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xeeeeee )

  renderer = new THREE.WebGLRenderer({ antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(threeViewport.clientWidth, threeViewport.clientHeight)
  threeViewport.appendChild(renderer.domElement)

  const cameraControllerGroup = new THREE.Group()
  cameraControllerGroup.position.set(0, 0, 0)
  scene.add(cameraControllerGroup)

  camera = new THREE.PerspectiveCamera( 30, threeViewport.clientWidth / threeViewport.clientHeight, 1, 10000 )
  camera.position.set(0, 1500, 0)
  camera.rotation.x = -Math.PI / 2
  cameraControllerGroup.add(camera)

  const gridHelper = new THREE.GridHelper( bounds * 2, 20 )
  scene.add( gridHelper )
  gridHelper.position.y = 0.1

  const planeGeo = new THREE.PlaneGeometry(bounds * 2, bounds * 2, 10)
  const planeMat = new THREE.MeshBasicMaterial({color: 0xcccccc})
  const planeMesh = new THREE.Mesh(planeGeo, planeMat)
  planeMesh.rotation.x = THREE.Math.degToRad(-90)
  scene.add(planeMesh)


  const colorPicker = new ColorPicker
  cameraController = new CameraController(camera, cameraControllerGroup, threeViewport, bounds)
  sceneController = new SceneController(scene, planeMesh, camera, cameraControllerGroup, threeViewport, colorPicker)

  colorPicker.createColorPalette()

  resetButton.onclick = () => {
    cameraController.reset()
    sceneController.reset()
  }

  const moveDistance = 30;
  buttons.left.onclick = () => sceneController.move(new Vector2(-moveDistance, 0));
  buttons.right.onclick = () => sceneController.move(new Vector2(moveDistance, 0));
  buttons.up.onclick = () => sceneController.move(new Vector2(0, moveDistance));
  buttons.down.onclick = () => sceneController.move(new Vector2(0, -moveDistance));
}

const render = () => renderer.render( scene, camera )

const update = () => {
  cameraController.rotateCamera()
}

const renderLoop = () => {
  update()
  render()
  requestAnimationFrame( renderLoop )
}

initializeScene()
renderLoop()
