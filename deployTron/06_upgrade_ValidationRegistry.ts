import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { toHexAddress } from '../scripts/tronAddress';
import { isTronNetwork, sendUpgradeViaTronWeb } from '../scripts/tronSendUpgrade';

/**
 * Upgrade ValidationRegistry proxy from MinimalUUPS to ValidationRegistryUpgradeable.
 * Must be run with MinimalUUPS owner private key (0x9450862986b23b7BF36998DFA9C5C7471fc87C44).
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const identityProxy = await get('IdentityRegistry');
  const proxy = await get('ValidationRegistry');
  const impl = await deploy('ValidationRegistryUpgradeable', {
    from: deployer,
    contract: 'ValidationRegistryUpgradeable',
    log: true,
  });

  const valFactory = await hre.ethers.getContractFactory('ValidationRegistryUpgradeable');
  const reinitData = valFactory.interface.encodeFunctionData('initialize', [
    toHexAddress(identityProxy.address),
  ]);

  if (isTronNetwork(hre)) {
    await sendUpgradeViaTronWeb(
      hre,
      proxy.address,
      'ValidationRegistryUpgradeable',
      toHexAddress(impl.address),
      reinitData,
    );
  } else {
    await execute(
      'ValidationRegistry',
      { from: deployer, contract: 'ValidationRegistryUpgradeable', log: true },
      'upgradeToAndCall',
      toHexAddress(impl.address),
      reinitData,
    );
  }

  console.log('ValidationRegistry upgraded to ValidationRegistryUpgradeable');
};
export default func;
func.tags = ['UpgradeValidationRegistry'];
func.dependencies = ['ValidationRegistry'];
