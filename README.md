# SnakeSilk Engine
[![Build Status](https://travis-ci.org/snakesilk/snakesilk-engine.svg?branch=master)][1]
[![codecov.io](https://codecov.io/github/snakesilk/snakesilk-engine/coverage.svg?branch=master)](https://codecov.io/github/pomle/megamanjs?branch=master)

Game Engine build from my Megaman 2 remake in JavaScript that uses WebGL as renderer and runs in 3D space using [THREE.js](https://github.com/mrdoob/three.js/) as 3D lib.

Follow the project blog at https://medium.com/recreating-megaman-2-using-js-webgl


## Developing

* Clone repo.

        git clone https://github.com/snakesilk/snakesilk-engine.git


### Prerequisites

* Make sure you are running Node.js `>= 6`. Installation instructions for your platform can be found at https://nodejs.org/en/download/package-manager/.

        node --version

* Install dev dependencies.

        cd snakesilk-engine
        npm install

* Run test suite.

        npm test

* When adding scripts to project, add them to [`script-manifest.json`](https://github.com/snakesilk/snakesilk-engine/blob/master/script-manifest.json).


## Contributing

Contributions are welcome.

[1]: https://travis-ci.org/snakesilk/snakesilk-engine
