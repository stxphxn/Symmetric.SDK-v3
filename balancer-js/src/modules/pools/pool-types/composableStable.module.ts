import { StablePoolLiquidity } from './concerns/stable/liquidity.concern';
import { PhantomStablePoolSpotPrice } from './concerns/stablePhantom/spotPrice.concern';
import { StablePoolPriceImpact } from './concerns/stable/priceImpact.concern';
import { ComposableStablePoolJoin } from './concerns/composableStable/join.concern';
import { ComposableStablePoolExit } from './concerns/composableStable/exit.concern';
import { PoolType } from './pool-type.interface';
import {
  ExitConcern,
  JoinConcern,
  LiquidityConcern,
  PriceImpactConcern,
  SpotPriceConcern,
} from './concerns/types';
import { balancerVault } from '@/lib/constants/config';
import { Network } from '@/types';
export class ComposableStable implements PoolType {
  constructor(
    public vault: string = balancerVault[Network.TELOSTESTNET],
    public exit: ExitConcern = new ComposableStablePoolExit(vault),
    public liquidity: LiquidityConcern = new StablePoolLiquidity(),
    public spotPriceCalculator: SpotPriceConcern = new PhantomStablePoolSpotPrice(),
    public priceImpactCalculator: PriceImpactConcern = new StablePoolPriceImpact(),
    public join: JoinConcern = new ComposableStablePoolJoin(vault)
  ) {}
}
