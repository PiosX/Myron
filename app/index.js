import World from './scene/World';
class App {
  constructor() {
    this.scene = document.querySelector('.scene');
    this.mainScene();
  }

  mainScene() {
    this.world = new World(this.scene);

    this.world.render();
  }
}

// eslint-disable-next-line no-new
new App();
