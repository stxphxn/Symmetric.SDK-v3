import { LinearPool } from '@balancer-labs/sor';
import { parseFixed } from '@ethersproject/bignumber';

import { EncodeWrapErc4626Input } from '@/modules/relayer/types';

import { PoolDictionary } from '../poolSource';
import { RelayerModel } from '../relayer';
import { ActionType } from '../vaultModel.module';
import { WeiPerEther, Zero } from '@ethersproject/constants';
import { SolidityMaths } from '@/lib/utils/solidityMaths';

export interface YaWrapRequest
  extends Pick<EncodeWrapErc4626Input, 'amount' | 'outputReference'> {
  poolId: string;
  actionType: ActionType.yaWrap;
}

export class YaWrapModel {
  constructor(private relayerModel: RelayerModel) {}

  /**
   * Perform the specified unwrap type.
   * @param unwrapRequest
   * @param pools
   * @returns tokens out and their respective deltas
   */
  async doYaWrap(
    yaWrapRequest: YaWrapRequest,
    pools: PoolDictionary
  ): Promise<[string[], string[]]> {
    const pool = pools[yaWrapRequest.poolId];
    const wrappedToken = pool.tokens[pool.wrappedIndex];
    const underlyingToken = pool.tokens[pool.mainIndex];

    const amountIn = this.relayerModel.doChainedRefReplacement(
      yaWrapRequest.amount.toString()
    );

    // must be negative because is leaving the vault
    const amountOut = SolidityMaths.divDownFixed(
      SolidityMaths.mulDownFixed(
        BigInt(amountIn),
        parseFixed(wrappedToken.priceRate, 18).toBigInt()
      ),
      WeiPerEther.toBigInt()
    ).toString();

    // Save chained references
    this.relayerModel.setChainedReferenceValue(
      yaWrapRequest.outputReference.toString(),
      amountOut
    );

    const tokens = [wrappedToken.address, underlyingToken.address];
    const deltas = [amountIn, Zero.sub(amountOut).toString()];
    return [tokens, deltas];
  }
}
