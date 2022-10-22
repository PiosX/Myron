import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from 'fragment.glsl';
import vertex from 'vertex.glsl';
import fragment1 from 'fragment1.glsl';
import vertex1 from 'vertex1.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextureLoader } from 'three';
import { GUI } from 'dat.gui';

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.settings();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.counter = 0;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        sky: {
          type: 't',
          value: new TextureLoader().load(
            'https://images.prismic.io/myron/22114700-9690-42e1-9e8c-9ded292cc336_sky2.jpg?auto=compress,format'
          ),
        },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.discMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        sky: {
          type: 't',
          value: new TextureLoader().load(
            'https://images.prismic.io/myron/1c0c5e06-11be-4071-afce-c0dd608b883b_istockphoto-1125353509-170667a.jpg?auto=compress,format'
          ),
        },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex1,
      fragmentShader: fragment1,
    });
    this.camera.position.set(0, 0, 2);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.folder = this.gui.addFolder('Move');
    this.folder.add(this.camera.position, 'x', -1000, 1000, 1);
    this.folder.add(this.camera.position, 'y', -1000, 1000, 1);
    this.folder.add(this.camera.position, 'z', -1000, 1000, 1);
    this.folderR = this.gui.addFolder('Rotation');
    this.folderR.add(this.camera.rotation, 'x', -360, 360, 0.01);
    this.folderR.add(this.camera.rotation, 'y', -360, 360, 0.01);
    this.folderR.add(this.camera.rotation, 'z', -360, 360, 0.01);

    this.isPlaying = true;

    this.resize();
    this.render();
    this.setupResize();

    this.loader = new GLTFLoader();
    this.loader.load('humanStatue.glb', (gltf) => {
      this.model = gltf.scene.children[1];
      this.disc = gltf.scene.children[1].children[0];
      this.scene.add(this.model);

      this.model.scale.set(0.5, 0.5, 0.5);
      this.model.position.set(0, -600, -350);
      this.model.material = this.material;
      this.disc.material = this.discMaterial;
    });

    this.cameraPositions();
  }

  settings() {
    this.settings = {
      progress: 0,
    };
    this.gui = new GUI();
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.discMaterial.uniforms.time.value = this.time;
    // eslint-disable-next-line no-undef
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  cameraPositions() {
    if (this.counter === 0) {
      this.camera.position.set(-275, 179, -537);
      this.camera.rotation.set(0, -0.78, 0);
    }
  }
}

// eslint-disable-next-line no-new
new Sketch({
  dom: document.querySelector('.scene'),
});
