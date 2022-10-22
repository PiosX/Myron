import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  DoubleSide,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector4,
  Clock,
} from 'three';
import fragment from 'fragment.glsl';
import vertex from 'vertex.glsl';
import { setupModel } from './setupModel.js';

async function loadHero() {
  const clock = new Clock();
  const elapsedTime = clock.getElapsedTime();
  const loader = new GLTFLoader();

  const heroData = await loader.loadAsync('humanStatue.glb');

  const hero = setupModel(heroData);
  hero.material = new ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable',
    },
    side: DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 },
      resolution: { type: 'v4', value: new Vector4() },
      matcap: {
        type: 't',
        value: new TextureLoader().load(
          'https://images.prismic.io/myron/5e3b9800-a136-4f45-92bb-777ae7dd7a33_chrome.png?auto=compress,format'
        ),
      },
      uvRate1: {
        value: new Vector2(1, 1),
      },
    },
    fragmentShader: fragment,
    vertexShader: vertex,
  });
  hero.material.uniforms.time.value = elapsedTime;
  hero.position.set(0, -10, -1);
  hero.scale.multiplyScalar(3);

  return { hero };
}

export { loadHero };
