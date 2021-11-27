
import Phaser from "phaser"

/** 
 * The number of MS between each update of the three dot animation.
 * @constant
 * @type {Number}
 */
const DOT_DELAY = 200

/**
 * The number of dots in the animation.
 * @constant
 * @type {Number}
 */
const MAX_DOTS = 3

/**
 * The loading text to display.
 * @constant
 * @type {String}
 */
const LOADING_TEXT = 'Loading'

/**
 * Displays a "loading" message whilst loading the game assets, once completed it starts {@link GameScene}
 * @extends Phaser.Scene
 */
class LoadScene extends Phaser.Scene {

    /** Initialises the dot variables */
    constructor() {
        super('BootScene')

        this.dotTime = 0
        this.dotCount = 0
    }

    /** Sets a black background. */
    preload() {
        this.cameras.main.setBackgroundColor('#000')
    }

    /** Displays "Loading..." text and starts an asyncronous load of the games assets. */
    create() {
        // add the loading text and center in the camera
        this.text = this.add.text(0, 0, LOADING_TEXT, { font: '16px Courier', fill: '#FFF' })
        this.text.setPosition(this.cameras.main.centerX - (this.text.width * 0.5), this.cameras.main.centerY - (this.text.height * 0.5))

        // create an async load, providing the function to call when completed
        this.load.once('complete', this.loadComplete, this)

        // background
        this.load.image('background', 'background.png')

        // ground
        this.load.image('ground', 'ground.png')

        // plane
        this.load.spritesheet('plane', 'plane.png', { frameWidth: 88, frameHeight: 73, spacing: 2 })

        // puff
        this.load.image('puff', 'puff.png')

        // rock
        this.load.image('rockBottom', 'rockBottom.png')
        this.load.image('rockTop', 'rockTop.png')

        // text
        this.load.image('gameOver', 'gameOver.png')
        this.load.image('start', 'start.png')

        // button
        this.load.image('fullscreen', 'fullscreen.png')

        // physics
        this.load.json('shapes', 'shapes.json')

        // start loading the assets
        this.load.start()
    }

    /** Animates the the dots proceeding the "loading" text. */
    update(time, delta) {
        // track the time passed and wait until the delay is reached
        this.dotTime += delta
        if (this.dotTime >= DOT_DELAY) {

            // set the delay back
            this.dotTime -= DOT_DELAY

            // increment the number of dots, or reset to no dots if already at max
            if (this.dotCount + 1 <= MAX_DOTS) {
                this.dotCount += 1
            } else {
                this.dotCount = 0
            }

            // create the new loading text and set
            let newText = LOADING_TEXT
            for (var i = 0; i < this.dotCount; i++) {
                newText += '.'
            }
            this.text.setText(newText)
        }
    }

    /** Callback function for the loading of assets completes, starts the {@link GameScene}. */
    loadComplete() {
        this.scene.start('GameScene')
    }
}

export default LoadScene