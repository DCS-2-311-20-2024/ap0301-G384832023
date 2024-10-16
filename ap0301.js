//
// 応用プログラミング 第3回 課題1 (ap0301)
// G384832023 古川心
//
"use strict"; // 厳格モード

import * as THREE from 'three';
import GUI from 'ili-gui';
import { makeMetalRobot, makeCBRobot } from './robot.js'

// ３Ｄページ作成関数の定義
function init() {
  const param = { // カメラの設定値
    fov: 60, // 視野角
    x: 30,
    y: 20,
    z: 40,
  };

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // ロボットの作成
  //const robot = makeMetalRobot();
  const robots = new THREE.Group;
  for(let x = -4;x<5;x++){
    for(let z = -4;z<5;z++){
      let robot;
      if((Math.random()*100) <= 25){
        robot = makeCBRobot();
      }else{
        robot = makeMetalRobot();
      }
      robot.position.x = x * 6;
      robot.position.z = z * 6;
      robot.rotation.y = Math.atan2(x, z);
      robots.add(robot);
    }
  }
  scene.add(robots);

  // 光源の設定
  const light = new THREE.SpotLight(0xffffff, 1800);
  light.position.set(0, 30, 30);
  scene.add(light);
  
  // カメラの設定
  const camera = new THREE.PerspectiveCamera(
    param.fov, window.innerWidth/window.innerHeight, 0.1, 1000);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x104040 );
  document.getElementById("WebGL-output")
    .appendChild(renderer.domElement);

  // 描画関数の定義
  function render() {
    camera.fov = param.fov;
    camera.position.x = param.x;
    camera.position.y = param.y;
    camera.position.z = param.z;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    //ロボットの動き
    /*全体の回転　robots.rotation.y
      = (robots.rotation.y + 0.01) % (2 * Math.PI);*/
    //個々の回転
    robots.children.forEach((robot) => {
      robot.rotation.y
        = (robot.rotation.y + 0.01) % (2 * Math.PI);
      robot.position.y = Math.sin(robot.rotation.y);
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // カメラのコントローラ
  const gui = new GUI();
  gui.add(param, "fov", 10, 100);
  gui.add(param, "x", -50, 50);
  gui.add(param, "y", -50, 50);
  gui.add(param, "z", -50, 50);

  render();

}

// 3Dページ作成関数の呼び出し
init();
