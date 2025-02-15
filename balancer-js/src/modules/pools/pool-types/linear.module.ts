import { LinearPoolExit } from './concerns/linear/exit.concern';
import { LinearPoolJoin } from './concerns/linear/join.concern';
import { LinearPoolLiquidity } from './concerns/linear/liquidity.concern';
import { LinearPoolSpotPrice } from './concerns/linear/spotPrice.concern';
import { LinearPriceImpact } from './concerns/linear/priceImpact.concern';
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
export class Linear implements PoolType {
  constructor(
    public vault: string = balancerVault[Network.TELOS],
    public exit: ExitConcern = new LinearPoolExit(vault),
    public join: JoinConcern = new LinearPoolJoin(),
    public liquidity: LiquidityConcern = new LinearPoolLiquidity(),
    public spotPriceCalculator: SpotPriceConcern = new LinearPoolSpotPrice(),
    public priceImpactCalculator: PriceImpactConcern = new LinearPriceImpact()
  ) {}
}
