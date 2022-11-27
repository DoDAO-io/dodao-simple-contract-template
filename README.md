# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
# To compile
npx hardhat compile
# To test
npx hardhat test
# To run-node
npx hardhat node
# to deploy:
npx hardhat run scripts/deploy.ts --network localhost
# goerli:
npx hardhat run scripts/deploy.ts --network goerli
# scroll:
npx hardhat run scripts/deploy.ts --network scroll
# hardhat:
npx hardhat node
```

You just need to do the following to run the app
1) Copy .env.example to .env and Add the information in .env
2) Install all the dependencies in the main folder and the fontend folder. So run `npm install` or `yarn` in both these folders
3) Run compile
4) Run deploy
5) Go to frontend
6) Run frontend app - `npm run start` or `yarn start`
7) Add the hardhat as local network on meta mask
