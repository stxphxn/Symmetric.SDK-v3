import { PoolsSubgraphRepository } from '@/modules/data/pool/subgraph';

const pools = new PoolsSubgraphRepository({
  url: 'http://graph.meter.io:8000/subgraphs/name/symmetric-meter',
  chainId: 82,

  query: {
    args: {
      where: {
        id_in: {
          eq: [
            '0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee000000000000000000000002',
          ],
        },
      },
    },
    attrs: {
      id: true,
      address: true,
      tokensList: true,
      tokens: {
        id: true,
        address: true,
        balance: true,
        decimals: true,
        symbol: true,
        name: true,
        denormWeight: true,
      },
      totalWeight: true,
      swapFee: true,
      totalSwapVolume: true,
      totalSwapFee: true,
      totalLiquidity: true,
    },
  },
});

async function main() {
  const results = await pools.fetch();
  console.log('Filter pools by attributes', results);
}

main();

// yarn run examples:run ./examples/data/pool-subgraph.ts
