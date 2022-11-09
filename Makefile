compile:
	npx hardhat compile
test:
	npx hardhat test
run-node:
	npx hardhat node
deploy:
	npx hardhat run scripts/deploy.ts --network localhost
hardhat:
	npx hardhat node
