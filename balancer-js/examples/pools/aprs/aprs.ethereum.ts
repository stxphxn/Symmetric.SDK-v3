/**
 * Display APRs for pool ids hardcoded under `const ids`
 * Run command: yarn example ./examples/pools/aprs/aprs.ethereum.ts
 */
import { BalancerSDK } from '@balancer-labs/sdk';

const sdk = new BalancerSDK({
  network: 167000,
  rpcUrl: 'https://rpc.mainnet.taiko.xyz',
  customSubgraphUrl:
    'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-taiko/1.0.0/gn',
});

const { pools } = sdk;

const main = async () => {
  const list = (await pools.all())
    .filter(
      (p) =>
        p.id ===
        '0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005'
    )
    .sort((a, b) => parseFloat(b.totalLiquidity) - parseFloat(a.totalLiquidity))
    .slice(0, 30);

  list.forEach(async (pool) => {
    try {
      const apr = await pools.apr(pool);
      console.log(pool.id, apr);
    } catch (e) {
      console.log(e);
    }
  });
};

main();
