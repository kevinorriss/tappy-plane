import Phaser from "phaser"
import { BACKGROUND_SPEED } from '../utils/Config'

/**
 * A scrolling tilesprite showing the background mountains and clouds.
 */
class Background extends Phaser.GameObjects.TileSprite {
    constructor(scene, x, y, width, height, textureKey) {
        super(scene, x, y, width, height, textureKey)
    }

    /** Scrolls the tile from right to left based on current game speed. */
    preUpdate(time, delta) {
        if (this.active) {
            this.tilePositionX += BACKGROUND_SPEED * (delta / 1000.0)
        }
    }
}

export default Background