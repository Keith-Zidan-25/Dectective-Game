import BootScene from '../scenes/Boot.js';
import PreloaderScene from '../scenes/Preloader.js';
import MainMenuScene from '../scenes/MainMenu.js';
import CrimeScene from '../scenes/CrimeScene.js';
import InventoryScene from '../scenes/Inventory.js';
import GameOverScene from '../scenes/GameOver.js';
import MuseumScene from '../scenes/MuseumDirector.js';
import MuseumTheft from '../scenes/MuseumTheft.js';
import HarappaStart from '../scenes/Harappastart.js';
import MarketplaceScene from '../scenes/MarketplaceScene.js';
import MerchantScene from '../scenes/MerchantScene.js';
import Harappa2 from '../scenes/Harappa2.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    height: 700,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,         // These should match your scene imports
        PreloaderScene,
        MainMenuScene,
        CrimeScene,
        InventoryScene,
        GameOverScene,
        MuseumScene,
        MuseumTheft,
        HarappaStart,
        MarketplaceScene,
        MerchantScene,
        Harappa2,
    ]
};

export default config;
