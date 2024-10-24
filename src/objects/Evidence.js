export default class Evidence {
    constructor(scene, x, y, texture, name) {
      this.scene = scene;
      this.sprite = scene.add.sprite(x, y, texture);
      this.name = name;
      this.collected = false;
    }
  
    collect() {
      if (!this.collected) {
        this.collected = true;
        this.sprite.setVisible(false);  // Make the item disappear from the scene
        this.scene.sound.play('collect');  // Play sound effect
        this.scene.player.addToInventory(this);  // Add to player's inventory
      }
    }
  }
  