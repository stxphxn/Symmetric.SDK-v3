/**
 * Example showing how to find a swap for a pair and use queryBatchSwap to simulate result on the Vault.
 */
import { BalancerSDK } from '@balancer-labs/sdk';
import { parseFixed } from '@ethersproject/bignumber';

const balancer = new BalancerSDK({
  network: 40,
  rpcUrl: 'https://mainnet15a.telos.net/evm',
  customSubgraphUrl:
    'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos/prod/gn',
});

const { swaps } = balancer;

const tokenIn = '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9'; // USDM
const tokenOut = '0xd102ce6a4db07d247fcc28f366a623df0938ca9e'; // STLOS
const amount = parseFixed('1', 18);
const gasPrice = parseFixed('0', 18);

async function findSwapAndQueryTheVault() {
  // Fetch all pools for SOR to use
  await swaps.fetchPools();

  // Find a route for the swap
  const swapInfo = await swaps.findRouteGivenIn({
    tokenIn,
    tokenOut,
    amount,
    gasPrice,
    maxPools: 4,
  });

  if (swapInfo.returnAmount.isZero()) {
    console.log('No Swap');
    return;
  }

  // Simulates a call to `batchSwap`, returning an array of Vault asset deltas.
  const deltas = await swaps.queryExactIn(swapInfo);

  // Prints the asset deltas for the swap.
  // Positive values mean the user sending the asset to the vault, and negative is the amount received from the vault.
  // The asset deltas should be the same as the ones returned by `batchSwap`.
  console.log(deltas);
  console.log(swapInfo.returnAmount);
}

findSwapAndQueryTheVault();
