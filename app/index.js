import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from 'fragment.glsl';
import vertex from 'vertex.glsl';
import fragment1 from 'fragment1.glsl';
import vertex1 from 'vertex1.glsl';
import { TextureLoader } from 'three';
import { GUI } from 'dat.gui';
import GSAP from 'gsap';

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.counter = 0;
    this.wheelCounter = 0;

    this.reflex = document.querySelector('.reflex');
    this.reflexDesc = document.querySelector('.reflex--desc');
    this.harmony = document.querySelector('.harmony');
    this.harmonyDesc = document.querySelector('.harmony--desc');
    this.strength = document.querySelector('.strength');
    this.strengthDesc = document.querySelector('.strength--desc');
    this.condition = document.querySelector('.condition');
    this.conditionDesc = document.querySelector('.condition--desc');
    this.agility = document.querySelector('.agility');
    this.agilityDesc = document.querySelector('.agility--desc');
    this.intelligence = document.querySelector('.intelligence');
    this.intelligenceDesc = document.querySelector('.intelligence--desc');

    this.headerTitle = document.querySelector('.header__title');
    this.headerLine = document.querySelector('.header__line');
    this.headerSub = document.querySelector('.header__subtitle');

    this.reflexPointer = document.querySelector('.reflex--pointer');

    this.footer = document.querySelector('.footer');
    this.smile = document.querySelector('.footer__smile');
    this.sad = document.querySelector('.footer__sad');
    this.thx = document.querySelector('.footer__thx');
    this.mask = document.querySelector('.mask');

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
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

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
    this.footerEvents();
    // this.cameraMovement();
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
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.discMaterial.uniforms.time.value = this.time;
    // eslint-disable-next-line no-undef
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  cameraPositions() {
    GSAP.to(this.headerTitle, {
      transform: 'translateX(0)',
      duration: 1,
    });
    GSAP.to(this.headerLine, {
      transform: 'translateX(0)',
      duration: 1,
      delay: 0.1,
    });
    GSAP.to(this.headerSub, {
      transform: 'translateX(0)',
      duration: 1,
      delay: 0.3,
    });
    this.camera.position.set(-275, 179, -537);
    this.camera.rotation.set(0, -0.78, 0);
    this.mask.addEventListener('click', () => {
      if (this.counter === 0) {
        this.mask.style.display = 'none';
        setTimeout(() => {
          this.mask.style.display = 'block';
        }, 1500);
        GSAP.to(this.headerTitle, {
          transform: 'translateX(-200%)',
          duration: 1,
          delay: 0.2,
        });
        GSAP.to(this.headerLine, {
          transform: 'translateX(-200%)',
          duration: 1,
          delay: 0.1,
        });
        GSAP.to(this.headerSub, {
          transform: 'translateX(-200%)',
          duration: 1,
        });

        GSAP.to(this.camera.position, { x: -30, duration: 1.2 });
        GSAP.to(this.camera.position, { y: 167, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -227, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -0.73, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        GSAP.to(this.reflex, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.reflexDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });
        return [this.counter++, (this.wheelCounter = 1000)];
      }
      if (this.counter === 1) {
        this.mask.style.display = 'none';
        setTimeout(() => {
          this.mask.style.display = 'block';
        }, 1500);
        GSAP.to(this.camera.position, { x: -198, duration: 1.2 });
        GSAP.to(this.camera.position, { y: -68, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -336, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0.3, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -0.83, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.strength.style.transform = 'translate(-300%, -50%)';
        this.condition.style.transform = 'translate(-300%, -50%)';
        this.agility.style.transform = 'translate(-300%, -50%)';
        this.intelligence.style.transform = 'translate(300%, -50%)';

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.harmony, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.harmonyDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.reflex, {
          transform: 'translate(300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.reflexDesc, {
          opacity: 0,
          duration: 0.3,
        });
        return [this.counter++, (this.wheelCounter = 2000)];
      }
      if (this.counter === 2) {
        this.mask.style.display = 'none';
        setTimeout(() => {
          this.mask.style.display = 'block';
        }, 1500);
        GSAP.to(this.camera.position, { x: -185, duration: 1.2 });
        GSAP.to(this.camera.position, { y: -506, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -475, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -1, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.condition.style.transform = 'translate(-300%, -50%)';
        this.agility.style.transform = 'translate(-300%, -50%)';
        this.intelligence.style.transform = 'translate(300%, -50%)';

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.strength, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.strengthDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.harmony, {
          transform: 'translate(-300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.harmonyDesc, {
          opacity: 0,
          duration: 0.3,
        });
        return [this.counter++, (this.wheelCounter = 3000)];
      }
      if (this.counter === 3) {
        this.mask.style.display = 'none';
        setTimeout(() => {
          this.mask.style.display = 'block';
        }, 1500);
        GSAP.to(this.camera.position, { x: 230, duration: 1.2 });
        GSAP.to(this.camera.position, { y: 42, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -590, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -3.2, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.agility.style.transform = 'translate(-300%, -50%)';
        this.intelligence.style.transform = 'translate(300%, -50%)';

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.condition, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.conditionDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.strength, {
          transform: 'translate(-300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.strengthDesc, {
          opacity: 0,
          duration: 0.3,
        });

        return [this.counter++, (this.wheelCounter = 4000)];
      }
      if (this.counter === 4) {
        this.mask.style.display = 'none';
        setTimeout(() => {
          this.mask.style.display = 'block';
        }, 1500);
        GSAP.to(this.camera.position, { x: 443, duration: 1.2 });
        GSAP.to(this.camera.position, { y: -318, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -176, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -4.66, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.intelligence.style.transform = 'translate(300%, -50%)';

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.agility, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.agilityDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.condition, {
          transform: 'translate(-300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.conditionDesc, {
          opacity: 0,
          duration: 0.3,
        });

        return [this.counter++, (this.wheelCounter = 5000)];
      }
      if (this.counter === 5) {
        this.mask.style.display = 'none';
        setTimeout(() => {
          this.mask.style.display = 'block';
        }, 1500);
        GSAP.to(this.camera.position, { x: 43, duration: 1.2 });
        GSAP.to(this.camera.position, { y: -102, duration: 1.2 });
        GSAP.to(this.camera.position, { z: 19, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0.58, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -7.0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.intelligence, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.intelligenceDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.agility, {
          transform: 'translate(-300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.agilityDesc, {
          opacity: 0,
          duration: 0.3,
        });

        return [this.counter++, (this.wheelCounter = 6000)];
      }
      if (this.counter === 6) {
        this.mask.style.display = 'none';
        setTimeout(() => {
          this.mask.style.display = 'block';
        }, 1500);
        GSAP.to(this.footer, { transform: 'translateY(-50%)', duration: 1.2 });

        return [this.counter++, (this.wheelCounter = 7000)];
      }
      if (this.counter > 6) {
        this.mask.style.display = 'none';
        setTimeout(() => {
          this.mask.style.display = 'block';
        }, 1500);
        if (this.counter % 2 === 0) {
          GSAP.to(this.footer, {
            transform: 'translateY(-50%)',
            duration: 1.2,
          });
        } else {
          GSAP.to(this.footer, {
            transform: 'translateY(100%)',
            duration: 1.2,
          });
        }
        return this.counter++;
      }
    });
    window.addEventListener('wheel', (e) => {
      this.wheelCounter += e.deltaY;

      if (this.counter === 0 && this.wheelCounter >= 1000) {
        GSAP.to(this.headerTitle, {
          transform: 'translateX(-200%)',
          duration: 1,
          delay: 0.2,
        });
        GSAP.to(this.headerLine, {
          transform: 'translateX(-200%)',
          duration: 1,
          delay: 0.1,
        });
        GSAP.to(this.headerSub, {
          transform: 'translateX(-200%)',
          duration: 1,
        });

        GSAP.to(this.camera.position, { x: -30, duration: 1.2 });
        GSAP.to(this.camera.position, { y: 167, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -227, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -0.73, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        GSAP.to(this.reflex, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.reflexDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });
        return [this.counter++, (this.wheelCounter = 1000)];
      }
      if (this.counter === 1 && this.wheelCounter >= 2000) {
        GSAP.to(this.camera.position, { x: -198, duration: 1.2 });
        GSAP.to(this.camera.position, { y: -68, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -336, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0.3, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -0.83, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.strength.style.transform = 'translate(-300%, -50%)';
        this.condition.style.transform = 'translate(-300%, -50%)';
        this.agility.style.transform = 'translate(-300%, -50%)';
        this.intelligence.style.transform = 'translate(300%, -50%)';

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.harmony, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.harmonyDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.reflex, {
          transform: 'translate(300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.reflexDesc, {
          opacity: 0,
          duration: 0.3,
        });
        return [this.counter++, (this.wheelCounter = 2000)];
      }
      if (this.counter === 2 && this.wheelCounter >= 3000) {
        GSAP.to(this.camera.position, { x: -185, duration: 1.2 });
        GSAP.to(this.camera.position, { y: -506, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -475, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -1, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.condition.style.transform = 'translate(-300%, -50%)';
        this.agility.style.transform = 'translate(-300%, -50%)';
        this.intelligence.style.transform = 'translate(300%, -50%)';

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.strength, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.strengthDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.harmony, {
          transform: 'translate(-300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.harmonyDesc, {
          opacity: 0,
          duration: 0.3,
        });
        return [this.counter++, (this.wheelCounter = 3000)];
      }
      if (this.counter === 3 && this.wheelCounter >= 4000) {
        GSAP.to(this.camera.position, { x: 230, duration: 1.2 });
        GSAP.to(this.camera.position, { y: 42, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -590, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -3.2, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.agility.style.transform = 'translate(-300%, -50%)';
        this.intelligence.style.transform = 'translate(300%, -50%)';

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.condition, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.conditionDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.strength, {
          transform: 'translate(-300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.strengthDesc, {
          opacity: 0,
          duration: 0.3,
        });

        return [this.counter++, (this.wheelCounter = 4000)];
      }
      if (this.counter === 4 && this.wheelCounter >= 5000) {
        GSAP.to(this.camera.position, { x: 443, duration: 1.2 });
        GSAP.to(this.camera.position, { y: -318, duration: 1.2 });
        GSAP.to(this.camera.position, { z: -176, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -4.66, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.intelligence.style.transform = 'translate(300%, -50%)';

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.agility, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.agilityDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.condition, {
          transform: 'translate(-300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.conditionDesc, {
          opacity: 0,
          duration: 0.3,
        });

        return [this.counter++, (this.wheelCounter = 5000)];
      }
      if (this.counter === 5 && this.wheelCounter >= 6000) {
        GSAP.to(this.camera.position, { x: 43, duration: 1.2 });
        GSAP.to(this.camera.position, { y: -102, duration: 1.2 });
        GSAP.to(this.camera.position, { z: 19, duration: 1.2 });

        GSAP.to(this.camera.rotation, { x: 0.58, duration: 1.2 });
        GSAP.to(this.camera.rotation, { y: -7.0, duration: 1.2 });
        GSAP.to(this.camera.rotation, { z: 0, duration: 1.2 });

        this.reflexPointer.style.opacity = '0';

        GSAP.to(this.intelligence, {
          transform: 'translate(-50%,-50%)',
          duration: 1.2,
          delay: 0.5,
        });
        GSAP.to(this.intelligenceDesc, {
          opacity: 1,
          duration: 1.2,
          delay: 2,
        });

        GSAP.to(this.agility, {
          transform: 'translate(-300%,-50%)',
          duration: 0.7,
          delay: 0.3,
        });
        GSAP.to(this.agilityDesc, {
          opacity: 0,
          duration: 0.3,
        });

        return [this.counter++, (this.wheelCounter = 6000)];
      }
      if (this.counter === 6 && this.wheelCounter >= 7000) {
        GSAP.to(this.footer, { transform: 'translateY(-50%)', duration: 1.2 });

        return [this.counter++, (this.wheelCounter = 7000)];
      }
      return this.wheelCounter;
    });
  }

  footerEvents() {
    this.smile.addEventListener('click', () => {
      this.smile.style.fill = '#00d29c';
      this.sad.style.opacity = '0.5';
      this.sad.style.pointerEvents = 'none';
      GSAP.to(this.thx, { opacity: 1, duration: 1 });
    });
    this.sad.addEventListener('click', () => {
      this.sad.style.fill = '#ff0023';
      this.smile.style.opacity = '0.5';
      this.smile.style.pointerEvents = 'none';
    });
  }

  cameraMovement() {
    window.addEventListener('mousemove', (e) => {
      if (this.counter === 0) {
        this.camera.position.set(
          -275 + e.clientX / 500,
          179 + e.clientY / 500,
          -537
        );
      }
    });
  }
}

// eslint-disable-next-line no-new
new Sketch({
  dom: document.querySelector('.scene'),
});
