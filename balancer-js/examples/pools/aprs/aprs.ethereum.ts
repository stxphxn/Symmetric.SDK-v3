/**
 * Display APRs for pool ids hardcoded under `const ids`
 * Run command: yarn example ./examples/pools/aprs/aprs.ethereum.ts
 */
import { BalancerSDK } from '@balancer-labs/sdk';

const sdk = new BalancerSDK({
  network: 40,
  rpcUrl: 'https://mainnet-eu.telos.net/evm',
  customSubgraphUrl:
    'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos/prod/gn',
});

const { pools } = sdk;

const main = async () => {
  const list = (await pools.all())
    .filter(
      (p) =>
        p.id ===
        '0xf0333afa20b852776911edb986061cef1376b4fe00000000000000000000002a'
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
