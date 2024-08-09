// /**
//  * This example shows how to use the SDK generalisedJoin method.
//  *
//  * It depends on a forked mainnet node running on localhost:8545
//  *
//  * Use the following command to start a forked mainnet node:
//  *   anvil --fork-url https://rpc.ankr.com/eth --fork-block-number 16411000 --fork-chain-id 1
//  *   or
//  *   npx hardhat node --fork https://rpc.ankr.com/eth --fork-block-number 16411000
//  *
//  * Generalised Joins are used to join a ComposableStable that has nested pools, e.g.:
//  *
//  *               CS0
//  *            /        \
//  *          CS1        CS2
//  *        /    \      /   \
//  *      DAI   USDC  USDT  FRAX
//  *
//  * The example joins the USD stable pool with DAI for decimals convinience.
//  * However the pool can be joined with any other token or composition of tokens.
//  *
//  * Expected frontend (FE) flow:
//  * 1. User selects tokens and amounts to join a pool
//  * 2. FE calls joinGeneralised with simulation type Tenderly or VaultModel
//  * 3. SDK calculates expectedAmountOut that is at least 99% accurate
//  * 4. User agrees expectedAmountOut and approves relayer
//  * 5. With approvals in place, FE calls joinGeneralised with simulation type Static
//  * 6. SDK calculates expectedAmountOut that is 100% accurate
//  * 7. SDK returns joinGeneralised transaction data with proper minAmountsOut limits in place
//  * 8. User is now able to submit a safe transaction to the blockchain
//  *
//  * Run with:
//  * yarn example ./examples/pools/join/join-composable-stable-with-underlying.ts
//  */
// import * as dotenv from 'dotenv';
// import { BalancerSDK, Relayer, SimulationType } from '@balancer-labs/sdk';
// import { Wallet } from '@ethersproject/wallet';
// import { Contract } from 'ethers';
// import { BigNumber } from '@ethersproject/bignumber';
// import { WeiPerEther as ONE } from '@ethersproject/constants';

// // import { parseEther } from '@ethersproject/units';
// // import {
// //   approveToken,
// //   printLogs,
// //   reset,
// //   setTokenBalance,
// // } from 'examples/helpers';

// dotenv.config();
// // Joining bbaUSD2 pool with DAI

// type ConversionParams = {
//   amount: BigNumber;
//   isWrap: boolean; // e.g. is stETH to wstETH
// };

// const yaUSDTokens = [
//   {
//     native: {
//       symbol: 'USDC',
//       address: '0x8d97cea50351fb4329d591682b148d43a0c3611b',
//       decimals: 6,
//       index: 1,
//     },
//     wrapper: {
//       symbol: 'woUSDC',
//       address: '0x953808ef6be397925f71ec0e8892e246882e4804',
//       decimals: 6,
//       index: 4,
//       rateProvider: '',
//     },
//   },
//   {
//     native: {
//       symbol: 'USDT',
//       address: '0x975ed13fa16857e83e7c493c7741d556eaad4a3f',
//       decimals: 6,
//       index: 5,
//     },
//     wrapper: {
//       symbol: 'woUSDT',
//       address: '0x181f14262e2efd4df781079437eba1aed3343898',
//       decimals: 6,
//       index: 0,
//       rateProvider: '',
//     },
//   },
//   {
//     native: {
//       symbol: 'USDM',
//       address: '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9',
//       decimals: 18,
//       index: 3,
//     },
//     wrapper: {
//       symbol: 'woUSDM',
//       address: '0x8edc3bdd08980d5f6672f243cebc58c6c117956a',
//       decimals: 18,
//       index: 2,
//       rateProvider: '',
//     },
//   },
// ];

// const poolId =
//   '0xf0333afa20b852776911edb986061cef1376b4fe00000000000000000000002a';

// const amountsIn = [
//   {
//     address: '0x8d97cea50351fb4329d591682b148d43a0c3611b',
//     value: '1',
//   },
//   {
//     address: '0x975ed13fa16857e83e7c493c7741d556eaad4a3f',
//     value: '1',
//   },
//   {
//     address: '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9',
//     value: '1',
//   },
// ];
// // const amount = parseEther('1000').toString();

// const balancer = new BalancerSDK({
//   network: 40,
//   rpcUrl: 'https://mainnet15.telos.net/evm',
//   customSubgraphUrl:
//     'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos/prod/gn',
//   // subgraphQuery: {
//   //   args: {
//   //     where: {
//   //       address: {
//   //         in: [
//   //           '0xf0333afa20b852776911edb986061cef1376b4fe', // myaUSD
//   //           '0x542a31176829f9dda137942c7cabbb4533523ad3', // myaUSDM
//   //         ],
//   //       },
//   //     },
//   //   },
//   //   attrs: {},
//   // },
// });

// const { provider, contracts } = balancer;
// const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider);
// const signer = provider.getSigner(wallet.address);
// /**
//  * Get some DAI to the signer and approve the vault to move it on our behalf.
//  * This is only needed for the example to work, in a real world scenario the signer
//  * would already have DAI and the vault would already be approved.
//  */
// // async function setup(address: string) {
// //   await reset(provider, 17700000);
// //   await setTokenBalance(provider, address, dai, amount, 2);
// //   await approveToken(dai, contracts.vault.address, amount, signer);
// // }

// export async function convertERC4626Wrap(
//   rateProviderAddress: string,
//   { amount, isWrap }: ConversionParams
// ): Promise<BigNumber> {
//   try {
//     const rateProvider = new Contract(
//       rateProviderAddress,
//       ['function getRate() external view returns (uint256)'],
//       provider
//     );

//     const rate = await rateProvider.getRate();

//     return isWrap ? amount.mul(ONE).div(rate) : amount.mul(rate).div(ONE);
//   } catch (error) {
//     throw new Error('Failed to convert to ERC4626 wrapper');
//   }
// }

// async function join() {
//   const address = await wallet.getAddress();

//   // setup(address);
//   const tokensIn: string[] = new Array(6);

//   yaUSDTokens.forEach(async (token) => {
//     tokensIn[token.native.index] = token.native.address;
//     tokensIn[token.wrapper.index] = token.wrapper.address;
//     const wrapperAmount = await convertERC4626Wrap(token.wrapper.rateProvider, {
//       amount: BigNumber.from(0),
//       isWrap: true,
//     });
//   });

//   // Here we join with DAI, but we could join with any other token or combination of tokens

//   const slippage = '100'; // 100 bps = 1%

//   // Use SDK to create join using either Tenderly or VaultModel simulation
//   // Note that this does not require authorisation to be defined
//   const { rawCalls } = await balancer.pools.generalisedJoin(
//     poolId,
//     tokensIn,
//     amountsIn,
//     address,
//     slippage,
//     signer,
//     SimulationType.VaultModel
//   );

//   console.log('Calls: ', rawCalls);
//   // User reviews expectedAmountOut
//   // console.log('Expected BPT out - VaultModel: ', expectedOut);

//   // Need to sign the approval only once per relayer
//   // const relayerAuth = await Relayer.signRelayerApproval(
//   //   contracts.relayer.address,
//   //   address,
//   //   signer,
//   //   contracts.vault
//   // );

//   // // Use SDK to create join callData
//   // const query = await balancer.pools.generalisedJoin(
//   //   poolId,
//   //   tokensIn,
//   //   amountsIn,
//   //   address,
//   //   slippage,
//   //   signer,
//   //   SimulationType.VaultModel,
//   //   relayerAuth
//   // );

//   // // Join
//   // const joinReciept = await (
//   //   await signer.sendTransaction({
//   //     to: query.to,
//   //     data: query.encodedCall,
//   //     gasLimit: 8e6,
//   //   })
//   // ).wait();

//   // await printLogs(joinReciept.logs);
// }

// join();
