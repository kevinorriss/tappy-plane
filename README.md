# Tappy Plane

Tappy plane is a clone of the popular Flappy Bird game, created in the Phaser HTML5 game framework.

A simple game created to experiment with Phaser games in [React](https://www.npmjs.com/package/react).

![Tappy Plane](https://github.com/kevinorriss/tappy-plane/blob/master/cover.png?raw=true)

## How to play
Simply click or tap anywhere on the game scene to make the plane ascend and try to fly safely between as many rocks as you can.

## Requirements
- [Phaser v3.55.x](https://www.npmjs.com/package/phaser/v/3.55.2)
- A resource server to host the game assets

## Usage
You can use this package directly with Phaser like so:
```js
import Phaser from 'phaser'
import TappyPlane from '@kevinorriss/tappy-plane'

const tappyPlane = new Phaser.Game({
    ...TappyPlane,
    scale: {
        ...TappyPlane.scale,
        parent: 'tappy-plane',
        fullscreenTarget: 'tappy-plane'
    },
    loader: { 
        ...TappyPlane.loader, 
        baseURL: 'http://localhost:4566/',
        path: 'images/tappy-plane'
    }
})
```

By overriding the scale object, you can specify the DOM element by ID where you want Phaser to place the HTML5 canvas. The same element can also be specified when in fullscreen mode otherwise the scaling and centering won't work.

The loader scene sets the baseURL and path values which are prepended to all load calls when loading the game assets.

## Game Assets

This game was created for a [React](https://www.npmjs.com/package/react) application so the assets do not get included in the package so that they can be lazy loaded.

You can download the assets for this game over on [GitHub](https://github.com/kevinorriss/tappy-plane/tree/master/src/assets).