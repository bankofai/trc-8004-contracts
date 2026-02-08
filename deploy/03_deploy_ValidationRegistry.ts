import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { toHexAddress } from '../scripts/tronAddress';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const identityProxy = await get('IdentityRegistry');
  const identityRegistryAddress = identityProxy.address;

  const bootstrap = await deploy('MinimalUUPS', {
    from: deployer,
    contract: 'MinimalUUPS',
    log: true,
  });
  const bootstrapFactory = await hre.ethers.getContractFactory('MinimalUUPS');
  const bootstrapInitData = bootstrapFactory.interface.encodeFunctionData('initialize', [
    toHexAddress(identityRegistryAddress),
  ]);

  const proxy = await deploy('ValidationRegistry', {
    from: deployer,
    contract: 'contracts/ERC1967Proxy.sol:ERC1967Proxy',
    args: [toHexAddress(bootstrap.address), bootstrapInitData],
    log: true,
  });

  console.log('ValidationRegistry (proxy, currently MinimalUUPS):', proxy.address);
  console.log('Run 06_upgrade_ValidationRegistry to upgrade (use MinimalUUPS owner private key)');
};
export default func;
func.tags = ['ValidationRegistry'];
func.dependencies = ['IdentityRegistry'];
