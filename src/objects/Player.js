import GameConstants from '../config/gameConstants.js';

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.add.sprite(x, y, 'player');
    this.inventory = [];
  }

  addToInventory(item) {
    if (this.inventory.length < GameConstants.MAX_INVENTORY_ITEMS) {
      this.inventory.push(item);
    } else {
      console.log('Inventory full');
    }
  }

  interact(object) {
    // Handle interactions with objects (e.g., collecting evidence)
    object.collect();
  }
}
