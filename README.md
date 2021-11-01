# ReGen

## Motivation

A lot of artists want an easy way to create your own on-chain generative art project.

## What's Regen

ReGen allows you to create your own on-chain generative art project.

In the [live demo](https://pumped-dolls.surge.sh/), users select a few parameters (colors and speed in the example), and when they click on the `Mint` button they get a unique NFT (ERC-721).

In the example, there are 100,000,000,000 possible different combinations.

They can't be minted twice.

This project is a fork of [scaffold-eth - Composable SVG NFT](https://github.com/scaffold-eth/scaffold-eth/tree/composable-svg-nft) by [Austin Griffith](https://github.com/austintgriffith).

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

## Use the live demo

##### 1. Manually add Velas to your MetaMask

- Network name: **Velas Testnet**
- Chain ID: **111**
- New RPC URL: **https://evmexplorer.testnet.velas.com/rpc**
- Currency: **VLX**
- Explorer: **https://evmexplorer.testnet.velas.com/**

##### 2. Get yourself a handful of testnet VLX (you can ask us in [Discord](https://discord.com/invite/xw9dCeQ94Y))

##### 3. Go to [https://pumped-dolls.surge.sh/](https://pumped-dolls.surge.sh/)

## Resources

- Live app on Netlify: [https://regen-main.netlify.app/](https://regen-main.netlify.app/)
- Youtube demo: [https://youtu.be/Q9RWDoKfDHg](https://youtu.be/Q9RWDoKfDHg)
- Discord: [https://discord.com/invite/xw9dCeQ94Y](https://discord.com/invite/xw9dCeQ94Y)
