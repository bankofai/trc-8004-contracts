import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('ValidationRegistry', {
    from: deployer,
    args: ['0xDE94085699A500B696530DBD6AF1EDDD6EDD41E4'],
    log: true,
  });
};
export default func;
func.tags = ['ValidationRegistry'];
