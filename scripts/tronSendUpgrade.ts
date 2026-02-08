import { HardhatRuntimeEnvironment } from 'hardhat/types';

/**
 * Send upgradeToAndCall on TRON via TronWeb to avoid ethers eth_getTransactionCount.
 */
export async function sendUpgradeViaTronWeb(
  hre: HardhatRuntimeEnvironment,
  proxyAddress: string,
  contractName: string,
  implAddressHex: string,
  reinitData: string,
): Promise<void> {
  const TronWeb = require('tronweb');
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error('PRIVATE_KEY required for TRON upgrade');

  let fullHost = (hre.network.config as { url?: string }).url || 'https://api.trongrid.io/jsonrpc';
  if (fullHost.endsWith('/jsonrpc')) fullHost = fullHost.replace(/\/jsonrpc$/, '');

  const tronWeb = new TronWeb({ fullHost, privateKey });
  const artifact = await hre.deployments.getArtifact(contractName);
  const fullAbi = artifact.abi as Array<{ type?: string }>;
  const abi = fullAbi.filter((item) => item.type === 'function');

  const contract = await tronWeb.contract(abi, proxyAddress);
  await contract.upgradeToAndCall(implAddressHex, reinitData).send({
    feeLimit: 100_000_000,
    callValue: 0,
    shouldPollResponse: true,
  });
}

export function isTronNetwork(hre: HardhatRuntimeEnvironment): boolean {
  return !!(hre.network.config as { tron?: boolean }).tron;
}
