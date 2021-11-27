import Phaser from "phaser"
import State from '../utils/State'
import { ASCEND_SPEED, PUFF_FREQUENCY, PUFF_FREQUENCY_CRASHED } from '../utils/Config'

class Plane extends Phaser.Physics.Matter.Sprite {
    /** Loads the planes shape data, sets it's scale / position and stores the crash callback function. */
    constructor(world, x, y, crashCallback) {
        super(world, x, y, 'plane', 1, { shape: world.scene.cache.json.get('shapes').plane })
        this.setScale(0.5)
        this.crashCallback = crashCallback
        this.hoverPosition = { x, y }
    }

    /**
     * Callback fired when the plane is added to the scene
     */
    addedToScene() {
        // setup physics properties
        this.setBounce(0.25)
        this.setFrictionAir(0)

        // create animations
        this.anims.create({ key: "fly", frameRate: 20, frames: this.anims.generateFrameNumbers("plane", { start: 0, end: 2 }), repeat: -1 })

        // smoke particles
        this.particles = this.scene.add.particles('puff')
        this.emitter = this.particles.createEmitter({
            lifespan: 750,
            alpha: { start: 0.5, end: 0 },
            speed: { min: 40, max: 80 },
            angle: {min: 160, max: 200 },
            gravity: 0,
            scale: { start: 1, end: 2 },
            quantity: 1,
            blendMode: 'ADD'
        })

        // set a collide listener for each body part
        for (let part of this.body.parts) {
            part.onCollideCallback = this.handleCollide.bind(this)
        }
    }

    /** Fired when a body part touches another physics object. */
    handleCollide() {
        // only fire the crash callback if the plane is flying and hasn't already crashed.
        if (this.state === State.FLYING) {
            this.crashCallback()
        }
    }

    /** Sets the state of the plane, controlling it's animations and particle effects. */
    setState(value) {
        super.setState(value)
        switch(value) {
            case State.HOVERING:
            case State.FLYING:
                this.play('fly')
                    .setIgnoreGravity(value === State.HOVERING)
                    .setPosition(this.hoverPosition.x, this.hoverPosition.y)
                    .setAngularVelocity(0)
                    .setVelocity(0)
                    .setRotation(0)
                this.emitter.startFollow(this, -this.width * 0.42, 0)
                this.emitter.setAngle({ min: 140, max: 220 })
                this.emitter.setFrequency(PUFF_FREQUENCY)
                break
            case State.CRASHED:
                this.stop('fly')
                this.emitter.startFollow(this, 0, -this.height * 0.42)
                this.emitter.setAngle({ min: 250, max: 290 })
                this.emitter.setFrequency(PUFF_FREQUENCY_CRASHED)
                break
        }
    }

    /** Adds an upwards velocity to the plane. */
    ascend(delta) {
        this.setVelocityY(-ASCEND_SPEED * (delta / 1000.0))
    }
}

export default Plane