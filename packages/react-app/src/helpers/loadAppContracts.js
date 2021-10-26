//localhost
//const contractListPromise = import("../contracts/hardhat_contracts.json");
//rinkeby
//const contractListPromise = import("../contracts/hardhat_contracts_rinkeby.json");
//velas
const contractListPromise = import("../contracts/hardhat_contracts_velas.json");
// @ts-ignore
const externalContractsPromise = import("../contracts/external_contracts");

export const loadAppContracts = async () => {
  const config = {};
  config.deployedContracts = (await contractListPromise).default ?? {};
  config.externalContracts = (await externalContractsPromise).default ?? {};
  return config;
};
