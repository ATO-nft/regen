# ReGen

Create your own generative art project.

This project is a fork of [scaffold-eth - Composable SVG NFT](https://github.com/scaffold-eth/scaffold-eth/tree/composable-svg-nft).

The project is built during the [Swiss Blockchain Hackathon 2021](https://devpost.com/software/regen-iqxj3t).

## Install

Install dependencies:
```
yarn install
```

## Run 

Start frontend
```
cd regen
yarn start
```

In a second terminal window, start a local blockchain
```
yarn chain
```

In a third terminal window, deploy contracts:
```
cd regen
yarn deploy
```