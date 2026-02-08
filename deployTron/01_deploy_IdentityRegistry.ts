import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { toHexAddress } from '../scripts/tronAddress';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // 1. Bootstrap: MinimalUUPS as placeholder impl (owner is fixed in contract; run upgrade with that key)
  const bootstrap = await deploy('MinimalUUPS', {
    from: deployer,
    contract: 'MinimalUUPS',
    log: true,
  });
  const bootstrapFactory = await hre.ethers.getContractFactory('MinimalUUPS');
  const bootstrapInitData = bootstrapFactory.interface.encodeFunctionData('initialize', [
    '0x0000000000000000000000000000000000000000',
  ]);

  // 2. Deploy proxy (currently points to MinimalUUPS)
  const proxy = await deploy('IdentityRegistry', {
    from: deployer,
    contract: 'contracts/ERC1967Proxy.sol:ERC1967Proxy',
    args: [toHexAddress(bootstrap.address), bootstrapInitData],
    log: true,
  });

  console.log('IdentityRegistry (proxy, currently MinimalUUPS):', proxy.address);
  console.log('Run 04_upgrade_IdentityRegistry to upgrade (use MinimalUUPS owner private key)');
};
export default func;
func.tags = ['IdentityRegistry'];
