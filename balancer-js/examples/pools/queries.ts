/**
 * Shows how to query balancer helper contracts for
 * expected amounts when providing or exiting liquidity from pools
 *
 * yarn example ./examples/pools/queries.ts
 */

import { BalancerSDK, PoolWithMethods, Pools } from '@balancer-labs/sdk';
import { parseEther, formatEther } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { getNetworkConfig } from '@/modules/sdk.helpers';

const sdk = new BalancerSDK({
  network: 82,
  customSubgraphUrl:
    'https://graph-meter.voltswap.finance/subgraphs/name/symmetric-meter',
  rpcUrl:
    'https://meter.blockpi.network/v1/rpc/216bb10a3653b0a8131afee4f6cf1982945022b4',
});

const {
  pools,
  balancerContracts: { contracts },
  data: { poolsOnChain },
} = sdk;
console.log(sdk);

// // Joining with a single token
// const queryJoin = async (pool: PoolWithMethods) => {
//   const token = pool.tokensList[0];
//   const maxAmountsInByToken = new Map<string, BigNumber>([
//     [token, parseEther('1')],
//   ]);
//   const joinExactInQuery = pool.buildQueryJoinExactIn({
//     maxAmountsInByToken,
//   });

//   const response = await contracts.balancerHelpers.callStatic.queryJoin(
//     ...joinExactInQuery
//   );

//   console.log(`Joining ${pool.poolType}`);
//   console.table({
//     tokens: pool.tokensList.map((t) => `${t.slice(0, 6)}...${t.slice(38, 42)}`),
//     amountsIn: response.amountsIn.map(formatEther),
//     bptOut: formatEther(response.bptOut),
//   });
// };

// Exiting to single token
const queryExit = async (pool: PoolWithMethods) => {
  console.log('pool', pool.totalShares);
  const exitProportionally = pool.buildQueryExitProportionally({
    bptIn: parseEther('1297.313028666084247501'),
  });
  console.log('pool2', pool.totalShares);
  const t = pool.buildExitExactBPTIn(
    '0xFb4D6288D1c51292dC9899f5F876A2Cf1f9fef43',
    parseEther('1297.313028666084247501').toString(),
    '50',
    false,
    undefined
  );
  console.log('pool3', pool.totalShares);
  console.table({
    minAmountsOut: t.minAmountsOut,
    expectedAmountsOut: t.expectedAmountsOut,
  });

  const response = await contracts.balancerHelpers.callStatic.queryExit(
    ...exitProportionally
  );

  console.log(`Exiting ${pool.poolType}`);
  console.table({
    tokens: pool.tokensList.map((t) => `${t.slice(0, 6)}...${t.slice(38, 42)}`),
    amountsOut: response.amountsOut.map(formatEther),
    bptIn: formatEther(response.bptIn),
  });
};

(async () => {
  const cs = await poolsOnChain.find(
    '0x2077a828fd58025655335a8756dbcfeb7e5bec46000000000000000000000008'
  );
  const composableStable = Pools.wrap(
    cs!,
    getNetworkConfig({
      network: 82,
      customSubgraphUrl:
        'https://graph-meter.voltswap.finance/subgraphs/name/symmetric-meter',
      rpcUrl:
        'https://meter.blockpi.network/v1/rpc/216bb10a3653b0a8131afee4f6cf1982945022b4',
    })
  );

  // const weighted = await pools.find(
  //   '0x25accb7943fd73dda5e23ba6329085a3c24bfb6a000200000000000000000387'
  // );
  // const metaStable = await pools.find(
  //   '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080'
  // );
  for (const pool of [composableStable]) {
    if (pool) {
      // await queryJoin(pool);
      await queryExit(pool);
    }
  }
})();
