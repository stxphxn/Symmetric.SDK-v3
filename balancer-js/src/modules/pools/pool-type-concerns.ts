import { BalancerSdkConfig, Network, PoolType } from '@/types';
import { Stable } from './pool-types/stable.module';
import { ComposableStable } from './pool-types/composableStable.module';
import { Weighted } from './pool-types/weighted.module';
import { MetaStable } from './pool-types/metaStable.module';
import { StablePhantom } from './pool-types/stablePhantom.module';
import { Linear } from './pool-types/linear.module';
import { BalancerError, BalancerErrorCode } from '@/balancerErrors';
import { isLinearish } from '@/lib/utils';
import { FX } from '@/modules/pools/pool-types/fx.module';
import { Gyro } from '@/modules/pools/pool-types/gyro.module';
import { balEmissions } from '../data';
import { balancerVault } from '@/lib/constants/config';

/**
 * Wrapper around pool type specific methods.
 *
 * Returns a class instance of a type specific method handlers.
 */
export class PoolTypeConcerns {
  constructor(
    config: BalancerSdkConfig,
    public weighted = new Weighted(balancerVault[Network.TELOSTESTNET]),
    public stable = new Stable(balancerVault[Network.TELOSTESTNET]),
    public composableStable = new ComposableStable(
      balancerVault[Network.TELOSTESTNET]
    ),
    public metaStable = new MetaStable(),
    public stablePhantom = new StablePhantom(),
    public linear = new Linear(balancerVault[Network.TELOSTESTNET])
  ) {}

  static from(
    poolType: PoolType,
    vault: string = balancerVault[Network.TELOSTESTNET]
  ):
    | Weighted
    | Stable
    | ComposableStable
    | MetaStable
    | StablePhantom
    | Linear {
    // Calculate spot price using pool type
    switch (poolType) {
      case 'ComposableStable': {
        return new ComposableStable(vault);
      }
      case 'FX': {
        return new FX();
      }
      case 'GyroE':
      case 'Gyro2':
      case 'Gyro3': {
        return new Gyro();
      }
      case 'MetaStable': {
        return new MetaStable();
      }
      case 'Stable': {
        return new Stable(vault);
      }
      case 'StablePhantom': {
        return new StablePhantom();
      }
      case 'Investment':
      case 'LiquidityBootstrapping':
      case 'Weighted': {
        return new Weighted(vault);
      }
      default: {
        // Handles all Linear pool types
        if (isLinearish(poolType)) return new Linear(vault);
        throw new BalancerError(BalancerErrorCode.UNSUPPORTED_POOL_TYPE);
      }
    }
  }
}
