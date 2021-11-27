import Phaser from "phaser"
import State from '../utils/State'
import Rock from './Rock'
import { SPEED, ROCK_DISTANCE } from '../utils/Config'

/**
 * A pool of Rock objects where rocks are reused instead of destroying / initiating new rocks.
 */
class Rocks extends Phaser.GameObjects.GameObject {

    /**
     * Creates the Rocks game object and the pool of Rock objects, adding each to the scene.
     * 
     * @param {Phaser.Scene} scene The scene that the game object is being added to
     * @param {Number} playerX The X position of the player
     * @param {Function} passCallback The callback function to call when the player passes a rock
     */
    constructor(scene, playerX, passCallback) {
        super(scene, 'rocks')

        // setup class variables
        this.rocks = []
        this.distanceToSpawn = ROCK_DISTANCE
        this.state = State.HOVERING

        // create the rocks
        const rockPoolSize = Math.ceil(scene.cameras.main.width / ROCK_DISTANCE) + 2
        for (var i = 0; i < rockPoolSize; i++) {
            const rock = this.scene.add.existing(new Rock(this.scene, playerX, passCallback))
            this.rocks.push(rock)
        }

        // default to the hovering state
        this.setState(State.HOVERING)
    }

    /**
     * Updates the state of the Rocks within the collection
     * 
     * @param {State} value The new state value
     */
    setState(value) {
        super.setState(value)

        // handle own state
        switch (value) {
            // remove this game object and its containing rocks from the update and render loops
            case State.HOVERING:
                this.setActive(false)
                this.rocks.forEach((rock) => {
                    rock.setActive(false)
                    rock.setVisible(false)
                    rock.moveOffScreen()
                })
                break;
            // Add this game object to the update loop
            case State.FLYING:
                this.setActive(true)
                this.distanceToSpawn = ROCK_DISTANCE
                break;
            // Stop the rocks from moving
            case State.CRASHED:
                this.setActive(false)
                this.rocks.forEach((rock) => {
                    rock.setActive(false)
                })
                break;
        }
    }

    /**
     * Spawns a rock at the specified distances apart
     */
    preUpdate(time, delta) {
        // decrement the distance until new rock should spawn
        this.distanceToSpawn -= SPEED * (delta / 1000.0)

        // spawn a new rock if needed
        if (this.distanceToSpawn <= 0) {
            this.spawnRock()
        }
    }

    /**
     * Finds a disabled rock and spawns it.
     */
    spawnRock() {

        // find an inactive rock and spawn it
        let rock = this.rocks.find(r => !r.active)
        if (rock) rock.spawn()

        // reset the spawn distance
        this.distanceToSpawn = ROCK_DISTANCE
    }
}

export default Rocks