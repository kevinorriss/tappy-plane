import Phaser from "phaser"
import { SPEED } from '../utils/Config'

/**
 * A scrolling tilesprite showing the rocky foreground.
 * 
 * This class couldn't be a TileSprite as it needs to be a physics object.
 */
class Ground extends Phaser.GameObjects.GameObject {

    /**
     * Creates the two ground sprites and adds them to the physics engine.
     * @param {*} scene The game scene this object has been added to.
     * @param {*} x The X coordinate of the center of the object
     * @param {*} y The Y coordinate of the center of the object
     */
    constructor(scene, x, y) {
        super(scene, 'ground')

        const shape = scene.cache.json.get('shapes').ground

        this.leftSprite = scene.matter.add.sprite(x, y, 'ground', null, { shape, isStatic: true })
        this.leftSprite.x += this.leftSprite.width * (this.leftSprite.centerOfMass.x - 0.5)
        this.leftSprite.y += this.leftSprite.height * (this.leftSprite.centerOfMass.y - 0.5)

        this.rightSprite = scene.matter.add.sprite(this.leftSprite.x + this.leftSprite.width, this.leftSprite.y, 'ground', 0, { shape, isStatic: true })
    }

    /**
     * Scrolls the ground like a tile sprite.
     * 
     * Uses two separate sprites and when a sprite goes off the left side of the screen, moves it off screen to the right.
    */
    preUpdate(time, delta) {
        if (this.active) {
            // move the ground sprites from right to left
            this.leftSprite.x -= SPEED * (delta / 1000.0)
            this.rightSprite.x = this.leftSprite.x + this.leftSprite.width

            // if the left sprite is off screen, move it to the right and flip the references
            if (this.leftSprite.getRightCenter().x <= 0) {
                const tempSprite = this.leftSprite
                this.leftSprite = this.rightSprite
                this.rightSprite = tempSprite
                this.rightSprite.x = this.leftSprite.x + this.leftSprite.width
            }
        }
    }
}

export default Ground