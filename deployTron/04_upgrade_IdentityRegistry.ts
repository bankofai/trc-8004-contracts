import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { toHexAddress } from '../scripts/tronAddress';
import { isTronNetwork, sendUpgradeViaTronWeb } from '../scripts/tronSendUpgrade';

/**
 * Upgrade IdentityRegistry proxy from MinimalUUPS to IdentityRegistryUpgradeable.
 * Must be run with MinimalUUPS owner private key (0x9450862986b23b7BF36998DFA9C5C7471fc87C44).
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const proxy = await get('IdentityRegistry');
  const impl = await deploy('IdentityRegistryUpgradeable', {
    from: deployer,
    contract: 'IdentityRegistryUpgradeable',
    log: true,
  });

  const identityFactory = await hre.ethers.getContractFactory('IdentityRegistryUpgradeable');
  const reinitData = identityFactory.interface.encodeFunctionData('initialize', []);

  if (isTronNetwork(hre)) {
    await sendUpgradeViaTronWeb(
      hre,
      proxy.address,
      'IdentityRegistryUpgradeable',
      toHexAddress(impl.address),
      reinitData,
    );
  } else {
    await execute(
      'IdentityRegistry',
      { from: deployer, contract: 'IdentityRegistryUpgradeable', log: true },
      'upgradeToAndCall',
      toHexAddress(impl.address),
      reinitData,
    );
  }

  console.log('IdentityRegistry upgraded to IdentityRegistryUpgradeable');
};
export default func;
func.tags = ['UpgradeIdentityRegistry'];
func.dependencies = ['IdentityRegistry'];
