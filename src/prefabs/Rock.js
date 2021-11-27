import Phaser from "phaser"
import { SPEED, ROCK_GAP } from '../utils/Config'

/** 
 * A pair of rocks for the plane to pass through.
*/
class Rock extends Phaser.GameObjects.GameObject {

    /**
     * Creates a new Rock object
     * @param {Phaser.Scene} scene The scene this object is being added to
     * @param {Number} playerX The X coordinate position of the player
     * @param {Function} passCallback The callback to fire when the player passes the rock
     */
    constructor(scene, playerX, passCallback) {
        super(scene, 'rock')

        // load the shape data
        const topShape = scene.cache.json.get('shapes').rockTop
        const bottomShape = scene.cache.json.get('shapes').rockBottom

        // add the top and bottom rocks to the scene
        this.top = scene.matter.add.sprite(0, 0, 'rockTop', 0, { shape: topShape, isStatic: true })
        this.bottom = scene.matter.add.sprite(0, 0, 'rockBottom', 0, { shape: bottomShape, isStatic: true })

        // store the horizontal position of the plane, this is the trigger point for the plane passing the rock
        this.playerX = playerX

        // store the callback to be called when the plane passes the rock
        this.passCallback = passCallback
    }

    /**
     * Moves the rock from right to left.
     * 
     * When the rock moves past the player, the pass callback is fired. Once the rock is offscreen, it is deactivated ready to be reused.
     */
    preUpdate(time, delta) {
        // calculate the distance to move on this update
        const step = SPEED * (delta / 1000.0)

        // determine if the rock will pass the plane
        const passedPlayer = this.top.x > this.playerX && this.top.x - step <= this.playerX

        // move the rock
        this.top.x -= step
        this.bottom.x = this.top.x

        // call the pass callback if the player has passed
        if (passedPlayer) {
            this.passCallback()
        }

        // deactivate when off screen
        if (this.top.getRightCenter().x <= 0) {
            this.setActive(false)
        }
    }

    /** Moves both the top and bottom rock off-screen to the right. */
    moveOffScreen() {
        this.top.x = this.scene.cameras.main.width + (this.top.width * 0.5)
        this.bottom.x = this.scene.cameras.main.width + (this.bottom.width * 0.5)
    }

    /**
     * Sets the visible state of both top and bottom rocks.
     * @param {Boolean} visible 
     */
    setVisible(visible) {
        this.top.setVisible(visible)
        this.bottom.setVisible(visible)
    }

    /**
     * Moves the top and bottom rocks to their starting point off to the right side of the screen and activates.
     * 
     * Randomly positions the rocks on the Y axis within a set range.
    */
    spawn() {
        // calculate a random Y offset
        const yOffset = (Math.random() * ROCK_GAP) - (ROCK_GAP * 0.5)

        // calculate the new position of the top and bottom rock
        this.top.x = this.scene.cameras.main.width + (this.top.width * 0.5)
        this.top.y = (this.top.height * 0.5) - (ROCK_GAP * 0.5) + yOffset
        this.bottom.x = this.scene.cameras.main.width + (this.bottom.width * 0.5)
        this.bottom.y = this.scene.cameras.main.height - (this.bottom.height * 0.5) + (ROCK_GAP * 0.5) + yOffset

        // offset the position relative to the physics center of mass to align the bounding boxes
        this.top.x += this.top.width * (this.top.centerOfMass.x - 0.5)
        this.top.y += this.top.height * (this.top.centerOfMass.y - 0.5)
        this.bottom.x += this.bottom.width * (this.bottom.centerOfMass.x - 0.5)
        this.bottom.y += this.bottom.height * (this.bottom.centerOfMass.y - 0.5)

        // add the rocks to the update and render loops
        this.setActive(true)
        this.setVisible(true)
    }
}

export default Rock