import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { toHexAddress } from '../scripts/tronAddress';
import { isTronNetwork, sendUpgradeViaTronWeb } from '../scripts/tronSendUpgrade';

/**
 * Upgrade ReputationRegistry proxy from MinimalUUPS to ReputationRegistryUpgradeable.
 * Must be run with MinimalUUPS owner private key (0x9450862986b23b7BF36998DFA9C5C7471fc87C44).
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const identityProxy = await get('IdentityRegistry');
  const proxy = await get('ReputationRegistry');
  const impl = await deploy('ReputationRegistryUpgradeable', {
    from: deployer,
    contract: 'ReputationRegistryUpgradeable',
    log: true,
  });

  const repFactory = await hre.ethers.getContractFactory('ReputationRegistryUpgradeable');
  const reinitData = repFactory.interface.encodeFunctionData('initialize', [
    toHexAddress(identityProxy.address),
  ]);

  if (isTronNetwork(hre)) {
    await sendUpgradeViaTronWeb(
      hre,
      proxy.address,
      'ReputationRegistryUpgradeable',
      toHexAddress(impl.address),
      reinitData,
    );
  } else {
    await execute(
      'ReputationRegistry',
      { from: deployer, contract: 'ReputationRegistryUpgradeable', log: true },
      'upgradeToAndCall',
      toHexAddress(impl.address),
      reinitData,
    );
  }

  console.log('ReputationRegistry upgraded to ReputationRegistryUpgradeable');
};
export default func;
func.tags = ['UpgradeReputationRegistry'];
func.dependencies = ['ReputationRegistry'];
