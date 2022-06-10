import { BigNumber, parseFixed, formatFixed } from '@ethersproject/bignumber';
import { Pool, PoolToken } from '@/types';
import { Pools } from '@/modules/pools/pools.module';
import { PoolProvider } from '../data-providers/pool/provider.interface';
import { TokenPriceProvider } from '../data-providers/token-price/provider.interface';
import { Zero } from '@ethersproject/constants';

const SCALING_FACTOR = 36;

export interface PoolLiquidity {
  address: string;
  liquidity: string;
}

export class Liquidity {
  constructor(
    private pools: PoolProvider,
    private tokenPrices: TokenPriceProvider
  ) {}

  async getLiquidity(pool: Pool): Promise<string> {
    // Remove any tokens with same address as pool as they are pre-printed BPT
    const parsedTokens = pool.tokens.filter((token) => {
      return token.address !== pool.address;
    });

    // For all tokens that are pools, recurse into them and fetch their liquidity
    const subPoolLiquidity: (PoolLiquidity | undefined)[] = await Promise.all(
      parsedTokens.map(async (token) => {
        const pool = await this.pools.findBy('address', token.address);
        if (!pool) return;

        const liquidity = await this.getLiquidity(pool);
        const tokenBalance = parseFixed(token.balance, SCALING_FACTOR);
        const totalShares = parseFixed(pool.totalShares, SCALING_FACTOR);
        const shareOfLiquidityScaled = parseFixed(
          tokenBalance.toString(),
          SCALING_FACTOR
        ).div(totalShares);
        const scaledLiquidity = parseFixed(liquidity, SCALING_FACTOR);
        const phantomPoolLiquidity = formatFixed(
          scaledLiquidity.mul(shareOfLiquidityScaled),
          SCALING_FACTOR
        ).replace(/\.[0-9]+/, ''); // strip trailing decimals, we don't need them as we're already scaled up by 1e36

        return {
          address: pool.address,
          liquidity: phantomPoolLiquidity,
        };
      })
    );

    const totalSubPoolLiquidity = subPoolLiquidity.reduce(
      (totalLiquidity, subPool) => {
        if (!subPool) return Zero;
        return totalLiquidity.add(subPool.liquidity);
      },
      Zero
    );

    const nonPoolTokens = parsedTokens.filter((token) => {
      return !subPoolLiquidity.find((pool) => pool?.address === token.address);
    });

    const tokenBalances: PoolToken[] = await Promise.all(
      nonPoolTokens.map(async (token) => {
        const tokenPrice = await this.tokenPrices.find(token.address);
        const poolToken: PoolToken = {
          address: token.address,
          decimals: token.decimals,
          priceRate: token.priceRate,
          price: tokenPrice,
          balance: token.balance,
          weight: token.weight ? parseFixed(token.weight, 2).toString() : '0',
        };
        return poolToken;
      })
    );

    const tokenLiquidity = Pools.from(pool.poolType).liquidity.calcTotal(
      tokenBalances
    );

    const totalLiquidity = formatFixed(
      BigNumber.from(totalSubPoolLiquidity).add(
        parseFixed(tokenLiquidity, SCALING_FACTOR)
      ),
      SCALING_FACTOR
    );

    return totalLiquidity;
  }
}
