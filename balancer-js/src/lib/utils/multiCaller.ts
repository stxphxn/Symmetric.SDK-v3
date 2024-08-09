import { set } from 'lodash';
import { Fragment, JsonFragment, Interface, Result } from '@ethersproject/abi';
import { CallOverrides } from '@ethersproject/contracts';
import { BytesLike } from '@ethersproject/bytes';
import { Multicall } from '@/contracts';

export class Multicaller {
  private interface: Interface;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private calls: [string, string, any][] = [];
  private paths: string[] = [];

  constructor(
    private multicall: Multicall,
    abi: string | Array<Fragment | JsonFragment | string>,
    private options: CallOverrides = {}
  ) {
    this.interface = new Interface(abi);
  }

  call(
    path: string,
    address: string,
    functionName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any[]
  ): Multicaller {
    this.calls.push([address, functionName, params]);
    this.paths.push(path);
    return this;
  }

  async execute(
    from: Record<string, unknown> = {},
    batchSize?: number
  ): Promise<Record<string, unknown>> {
    const obj = from;
    const results = await this.executeMulticall(batchSize);
    results.forEach((result, i) =>
      set(obj, this.paths[i], result.length > 1 ? result : result[0])
    );
    this.calls = [];
    this.paths = [];
    return obj;
  }

  private async executeMulticall(batchSize?: number): Promise<Result[]> {
    const batches = [];

    // Determine the batch size, default to the length of calls if not provided
    const effectiveBatchSize = batchSize ?? this.calls.length;

    // Split calls into batches based on the effective batch size
    for (let i = 0; i < this.calls.length; i += effectiveBatchSize) {
      batches.push(this.calls.slice(i, i + effectiveBatchSize));
    }

    const results: Result[] = [];

    // Process each batch
    for (const batch of batches) {
      const [, res] = await this.multicall.callStatic.aggregate(
        batch.map(([address, functionName, params]) => ({
          target: address,
          callData: this.interface.encodeFunctionData(functionName, params),
        })),
        this.options
      );

      // Decode and merge results
      res.forEach((result: BytesLike, i: number) => {
        results.push(this.interface.decodeFunctionResult(batch[i][1], result));
      });
    }

    return results;
  }
}
