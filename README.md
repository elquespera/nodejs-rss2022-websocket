# RSSchool Node.js websocket task

## Description

**Node.js websocket task** is an [assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/remote-control/assignment.md) for the fourth week of RS School [Node.js Development Course](https://github.com/AlreadyBored/nodejs-assignments). Its goal is to implement a [WebSocket connection](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) that allows to control mouse movements on the client's screen using [Node.js WebSocket library](https://www.npmjs.com/package//ws) and [Robotjs library](http://robotjs.io/).

## Technical specs

The task was performed in `Node.js v16.15.0` using some external libraries. 

The following external **dependencies** were used:

- `ws` for WebSocket connection
- `robotjs` mouse movement control;
- `jimp` converting screenshot bitmap to PNG buffer;

The following **developer dependencies** were utilized:

- `nodemon` for automatic executing files on change;
- `typescript`, `ts-node`, `ts-loader` for typescript transpiling;
- `@types/` for typescript type declarations.


## Installation

1. Clone [this repository](https://github.com/elquespera/nodejs-rss2022-websocket) and checkout to dev branch:

```shell
git clone https://github.com/elquespera/nodejs-rss2022-websocket.git
cd ./nodejs-rss2022-websocket
git checkout dev
```

2. Install dependencies:

```shell
npm install
```

You might need the following libraries for robotjs on **Ubuntu**:
```shell
sudo apt install libxtst-dev libpng++-dev
```

## Running

The following scripts are available for building and running  the applicaiton:

- `npm start` for watching ts files with on-the-fly transpiling;
- `npm run start:dev` the same as `npm start`;
- `npm run start:prod` for transpiling with `tsc` and running the app