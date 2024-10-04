/**
 * Display APRs for pool ids hardcoded under `const ids`
 * Run command: yarn example ./examples/data/token-prices.ts
 */
import { BalancerSDK } from '@/.';

const sdk = new BalancerSDK({
  network: 40,
  rpcUrl: 'https://mainnet15.telos.net/evm',
  customSubgraphUrl:
    'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos/prod/gn',
});
const { data } = sdk;
const wtlos = '0xd102ce6a4db07d247fcc28f366a623df0938ca9e';
const tsymm = '0xd5f2a24199C3DFc44C1Bf8B1C01aB147809434Ca';
// const weth = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
// const ohm = '0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5';
// const matic = '0x0000000000000000000000000000000000001010';
// const tetuBal = '0x7fc9e0aa043787bfad28e29632ada302c790ce33';

(async () => {
  // It will be just one request to coingecko
  const ps = [wtlos, tsymm].map((t) => data.tokenPrices.find(t));
  const price = await Promise.all(ps);

  console.log(price);
})();
