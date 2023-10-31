import { BalancerSDK } from '@/.';

async function main() {
  const sdk = new BalancerSDK({
    network: 41,
    rpcUrl: 'https://testnet15a.telos.net/evm',
    customSubgraphUrl:
      'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos-testnet/1.0.0/gn',
  });

  await sdk.swaps.fetchPools();
}

main();
