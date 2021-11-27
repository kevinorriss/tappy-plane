import Phaser from 'phaser'
import LoadScene from './scenes/LoadScene'
import GameScene from './scenes/GameScene'

const config = {
    type: Phaser.AUTO,
    loader: {
        path: "src/assets/"
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 480
    },
    scene: [LoadScene, GameScene],
    physics: {
        default: 'matter',
        matter: {
            debug: false
        }
    }
};

export default config