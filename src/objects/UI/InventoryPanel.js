export default class InventoryPanel {
    constructor(scene) {
      this.scene = scene;
      this.panel = scene.add.image(700, 100, 'panel');  // UI panel for inventory
      this.items = [];  // Inventory items list
    }
  
    addItem(item) {
      this.items.push(item);
      this.display();
    }
  
    display() {
      this.items.forEach((item, index) => {
        this.scene.add.image(700, 150 + index * 50, item.sprite.texture.key);  // Display items in the panel
      });
    }
  }
  