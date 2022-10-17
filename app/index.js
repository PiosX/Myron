import World from './scene/World';
class App {
  constructor() {
    this.pScene = document.querySelector('.scene');
    this.mainScene();
  }

  async mainScene() {
    const world = new World(this.pScene);

    await world.init();

    world.start();
  }
}

// eslint-disable-next-line no-new
new App();
