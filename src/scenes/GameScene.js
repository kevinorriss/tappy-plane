import Phaser from 'phaser'
import Background from '../prefabs/Background'
import Ground from '../prefabs/Ground'
import Plane from '../prefabs/Plane'
import Rocks from '../prefabs/Rocks'
import State from '../utils/State'

/**
 * The main scene that is started once the assets are loaded by {@link LoadScene}.
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    /**
     * Initialises the game scene variables.
     */
    init() {

        /**
         * The score of the current flight.
         */
        this.score = 0

        /**
         * The highest score achieved.
         */
        this.highScore = 0
        this.gameOverWait = false
    }

    /**
     * Adds the game objects to the scene, sets up input listeners and initial game state
     */
    create() {
        // constrain the world to the camera view
        this.matter.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height)

        // turn off MatterJS' timing, it doesn't play nice with high refresh monitors
        this.matter.world.autoUpdate = false

        // background
        this.background = this.add.existing(new Background(this, this.cameras.main.centerX, this.cameras.main.centerY, 0, 0, 'background'))

        // rocks
        this.rocks =  this.sys.updateList.add(new Rocks(this, this.cameras.main.centerX, this.incrementScore.bind(this)))

        // ground
        const groundImage = this.textures.get('ground').getSourceImage()
        this.ground = this.sys.updateList.add(new Ground(this, this.cameras.main.centerX, this.cameras.main.height - (groundImage.height * 0.5)))

        // "tap to start" sprite
        this.textStart = this.add.sprite(this.cameras.main.centerX, this.cameras.main.height * 0.6, 'start')
        this.textStart.setScale(0.5)

        // "game over" sprite
        this.textGameOver = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'gameOver')

        // plane
        this.plane =  this.add.existing(new Plane(this.matter.world, this.cameras.main.centerX, this.cameras.main.height * 0.4, () => { this.setState(State.CRASHED) }))

        // buttons
        this.buttonLarge = this.add.sprite(this.cameras.main.width - 10, 10, 'fullscreen')
            .setOrigin(1, 0)
            .setScale(0.5)
            .setInteractive()
            .on('pointerup', this.toggleFullscreen, this)
        
        // input events
        this.input.on('pointerdown', (pointer, gameObjects) => {
            if (!gameObjects.includes(this.buttonLarge)) this.ascendPressed()
        })
        this.input.keyboard.on('keyup-SPACE', this.ascendPressed, this)

        // score
        var style = { font: '20px Arial', fill: '#186782' };
        this.add.text(20, 20, 'Score:', style);
        this.scoreText = this.add.text(85, 20, '', style);
        this.scoreText.font = 'Arial Black';
        this.add.text(20, this.cameras.main.height - 40, 'High Score:', style);
        this.highScoreText = this.add.text(130, this.cameras.main.height - 40, '', style);
        this.highScoreText.font = 'Arial Black';

        // set the hovering state
        this.setState(State.HOVERING)
    }

    /**
     * Listener function for when the game screen is clicked / pressed.
     * 
     * Depending on the state of the scene, this will either ascend the plane or progress past the start / game over states.
     */
    ascendPressed() {
        switch (this.state) {
            // when hovering, ascend the plane and start the flight
            case State.HOVERING:
                this.setState(State.FLYING)
                this.plane.ascend(this.game.loop.delta)
                break
            // already flying so just ascend the plane
            case State.FLYING:
                this.plane.ascend(this.game.loop.delta)
                break
            // priogress to the hovering "ready" state, providing the delay time has passed
            case State.CRASHED:
                if (!this.gameOverWait) {
                    this.setState(State.HOVERING)
                }
                break
        }
    }

    /**
     * 
     * @param {State} value One of the enum states the plane can be in
     */
    setState(value) {

        // store the new state value and pass down to other game objects
        this.state = value
        this.plane.setState(value)
        this.rocks.setState(value)

        switch (value) {
            // reset the score and show "ready" in a stable flight
            case State.HOVERING:
                this.textStart.visible = true
                this.textGameOver.visible = false
                this.background.setActive(true)
                this.ground.setActive(true)
                this.setScore(0)
                break
            // remove any UI messages and start the flight
            case State.FLYING:
                this.textStart.visible = false
                this.textGameOver.visible = false
                this.background.setActive(true)
                this.ground.setActive(true)
                break
            // stop the ground / background movement, display "game over" and start a delay timer to give player a chance to stop clicking
            case State.CRASHED:
                this.textStart.visible = false
                this.textGameOver.visible = true
                this.background.setActive(false)
                this.ground.setActive(false)
                this.gameOverWait = true
                setTimeout(() => { this.gameOverWait = false }, 1000)
                break
        }
    }

    /**
     * Updates the score and also increases the highscore if it has been beaten.
     * @param {Number} score The score achieved during the current flight.
     */
    setScore(score) {
        this.score = score
        if (this.score > this.highScore) {
            this.highScore = this.score
        }

        this.scoreText.text = Math.floor(this.score)
        this.highScoreText.text = Math.floor(this.highScore)
    }

    /** Callback function when the plane passes a rock, simply increments the current score by 1. */
    incrementScore() {
        this.setScore(this.score + 1)
    }

    /**
     * Starts or stops the fullscreen mode depending on the current state.
     */
     toggleFullscreen() {
        this.scale.isFullscreen ? this.scale.stopFullscreen() : this.scale.startFullscreen()
    }

    /** Passes the games delta time onto the physics engine. */
    update(time, delta) {
        // step the physics timing with the update loop
        this.matter.world.step(delta)
    }
}

export default GameScene