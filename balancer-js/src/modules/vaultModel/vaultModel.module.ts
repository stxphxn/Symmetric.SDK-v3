import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { PoolDataService } from '@balancer-labs/sor';

import { PoolModel } from './poolModel/poolModel';
import { JoinPoolRequest } from './poolModel/join';
import { ExitPoolRequest } from './poolModel/exit';
import { BatchSwapRequest, SwapRequest } from './poolModel/swap';
import { UnwrapRequest } from './poolModel/unwrap';
import { YaWrapRequest } from './poolModel/yaWrap';
import { RelayerModel } from './relayer';
import { PoolsSource } from './poolSource';
import {
  EncodeBatchSwapInput,
  EncodeJoinPoolInput,
  EncodeExitPoolInput,
} from '../relayer/types';
import { Swap } from '../swaps/types';

export enum ActionType {
  BatchSwap,
  Join,
  Exit,
  Swap,
  Unwrap,
  yaWrap,
  yaUnwrap,
}

export type Requests =
  | YaWrapRequest
  | BatchSwapRequest
  | JoinPoolRequest
  | ExitPoolRequest
  | SwapRequest
  | UnwrapRequest;

/**
 * Controller / use-case layer for interacting with pools data.
 */
export class VaultModel {
  poolsSource: PoolsSource;

  constructor(poolDataService: PoolDataService, wrappedNativeAsset: string) {
    this.poolsSource = new PoolsSource(poolDataService, wrappedNativeAsset);
  }

  updateDeltas(
    deltas: Record<string, BigNumber>,
    assets: string[],
    amounts: string[]
  ): Record<string, BigNumber> {
    assets.forEach((t, i) => {
      if (!deltas[t]) deltas[t] = Zero;
      deltas[t] = deltas[t].add(amounts[i]);
    });
    return deltas;
  }

  async multicall(
    rawCalls: Requests[],
    refresh = false
  ): Promise<Record<string, BigNumber>> {
    const relayerModel = new RelayerModel();
    const poolModel = new PoolModel(relayerModel);
    const pools = await this.poolsSource.poolsDictionary(refresh);
    const deltas: Record<string, BigNumber> = {};
    for (const call of rawCalls) {
      let tokens: string[] = [];
      let amounts: string[] = [];
      switch (call.actionType) {
        case ActionType.Join: {
          const typedCall = call as JoinPoolRequest;
          [tokens, amounts] = await poolModel.doJoin(typedCall, pools);
          break;
        }
        case ActionType.Exit: {
          const typedCall = call as ExitPoolRequest;
          [tokens, amounts] = await poolModel.doExit(typedCall, pools);
          break;
        }
        case ActionType.BatchSwap: {
          const typedCall = call as BatchSwapRequest;
          tokens = typedCall.assets;
          amounts = await poolModel.doBatchSwap(typedCall, pools);
          break;
        }
        case ActionType.Swap: {
          const typedCall = call as SwapRequest;
          tokens = [typedCall.request.assetOut, typedCall.request.assetIn];
          amounts = await poolModel.doSingleSwap(typedCall, pools);
          break;
        }
        case ActionType.Unwrap: {
          const typedCall = call as UnwrapRequest;
          [tokens, amounts] = await poolModel.doUnwrap(typedCall, pools);
          break;
        }
        case ActionType.yaWrap: {
          const typedCall = call as YaWrapRequest;
          [tokens, amounts] = await poolModel.doYaWrap(typedCall, pools);
          break;
        }
        default:
          break;
      }
      this.updateDeltas(deltas, tokens, amounts);
    }
    return deltas;
  }

  static mapSwapRequest(call: Swap): SwapRequest {
    const swapRequest: SwapRequest = {
      actionType: ActionType.Swap,
      request: call.request,
      funds: call.funds,
      outputReference: call.outputReference,
    };
    return swapRequest;
  }

  static mapBatchSwapRequest(call: EncodeBatchSwapInput): BatchSwapRequest {
    const batchSwapRequest: BatchSwapRequest = {
      actionType: ActionType.BatchSwap,
      swaps: call.swaps,
      assets: call.assets,
      funds: call.funds,
      swapType: call.swapType,
      outputReferences: call.outputReferences,
    };
    return batchSwapRequest;
  }

  static mapJoinPoolRequest(call: EncodeJoinPoolInput): JoinPoolRequest {
    const joinPoolRequest: JoinPoolRequest = {
      actionType: ActionType.Join,
      poolId: call.poolId,
      encodedUserData: call.joinPoolRequest.userData,
      outputReference: call.outputReference,
    };
    return joinPoolRequest;
  }

  static mapExitPoolRequest(call: EncodeExitPoolInput): ExitPoolRequest {
    const exitPoolRequest: ExitPoolRequest = {
      actionType: ActionType.Exit,
      poolId: call.poolId,
      encodedUserData: call.exitPoolRequest.userData,
      outputReferences: call.outputReferences,
    };
    return exitPoolRequest;
  }

  static mapUnwrapRequest(
    amount: BigNumberish,
    outputReference: BigNumberish,
    poolId: string
  ): UnwrapRequest {
    const unwrapRequest: UnwrapRequest = {
      actionType: ActionType.Unwrap,
      poolId,
      amount,
      outputReference,
    };
    return unwrapRequest;
  }

  static mapYaWrapRequest(
    amount: BigNumberish,
    outputReference: BigNumberish,
    poolId: string
  ): YaWrapRequest {
    const yaWrapRequest: YaWrapRequest = {
      actionType: ActionType.yaWrap,
      poolId,
      amount,
      outputReference,
    };
    return yaWrapRequest;
  }
}
