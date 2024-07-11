import { Interface } from '@ethersproject/abi';
import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { Multicall } from '@/contracts';

const gaugeControllerInterface = new Interface([
  'function gauge_relative_weight(address gauge, uint timestamp) view returns (uint)',
]);

const gaugeControllerCheckpointerInterface = new Interface([
  'function gauge_relative_weight(address gauge) view returns (uint)',
]);

export class GaugeControllerMulticallRepository {
  constructor(
    private multicall: Multicall,
    private gaugeControllerAddress: string,
    private gaugeControllerCheckpointerAddress?: string
  ) {}

  async getRelativeWeights(
    gaugeAddresses: string[],
    timestamp?: number
  ): Promise<{ [gaugeAddress: string]: number }> {
    const payload = gaugeAddresses.map((gaugeAddress) => {
      // The checkpointer only exists for mainnet, if the network is a testnet, it'll use the regular gauge controller
      if (this.gaugeControllerCheckpointerAddress && !timestamp) {
        return {
          target: this.gaugeControllerCheckpointerAddress,
          callData: gaugeControllerCheckpointerInterface.encodeFunctionData(
            'gauge_relative_weight',
            [getAddress(gaugeAddress)]
          ),
        };
      }
      return {
        target: this.gaugeControllerAddress,
        callData: gaugeControllerInterface.encodeFunctionData(
          'gauge_relative_weight',
          [getAddress(gaugeAddress), timestamp || Math.floor(Date.now() / 1000)]
        ),
      };
    });

    const batchSize = 5;
    const batches = [];
    let res: string[] = [];

    for (let i = 0; i < payload.length; i += batchSize) {
      batches.push(payload.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const [, batchResult] = await this.multicall.callStatic.aggregate(batch);
      res = [...res, ...batchResult];
    }

    const weights = gaugeAddresses.reduce(
      (p: { [key: string]: number }, a, i) => {
        p[a] ||= parseFloat(formatUnits(res[i], 18));
        return p;
      },
      {}
    );

    return weights;
  }
}
