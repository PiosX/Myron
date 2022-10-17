import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { setupModel } from './setupModel.js';

async function loadHero() {
  const loader = new GLTFLoader();

  const heroData = await loader.loadAsync('humanStatue.glb');

  const hero = setupModel(heroData);
  hero.position.set(0, 0, 0);
  hero.scale.multiplyScalar(0.002);

  return { hero };
}

export { loadHero };
