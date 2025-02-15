import { Network, type Findable, type Price } from '@/types';
import { IAaveRates, wrappedTokensMap } from './aave-rates';
import { Logger } from '@/lib/utils/logger';

export class TokenPriceProvider implements Findable<Price> {
  constructor(
    private coingeckoRepository: Findable<Price>,
    private geckoTerminalRepository: Findable<string>,
    private subgraphRepository: Findable<Price>,
    private aaveRates: IAaveRates
  ) {}

  async find(address: string): Promise<Price | undefined> {
    let price;
    let newAddress = address;
    if (
      wrappedTokensMap[Network.TELOS] &&
      wrappedTokensMap[Network.TELOS][address]
    ) {
      newAddress = wrappedTokensMap[Network.TELOS][address].underlying;
    }
    try {
      const result = await this.geckoTerminalRepository.find(newAddress);
      if (!result) {
        throw new Error('Price not found');
      }
      price = {
        usd: result,
      };
    } catch (err) {
      const logger = Logger.getInstance();
      logger.warn(err as string);
      price = await this.subgraphRepository.find(newAddress);
    }
    const rate = (await this.aaveRates.getRate(address)) || 1;
    if (price && price.usd) {
      return {
        ...price,
        usd: (parseFloat(price.usd) * rate).toString(),
      };
    } else {
      return price;
    }
  }

  async findBy(attribute: string, value: string): Promise<Price | undefined> {
    if (attribute === 'address') {
      return this.find(value);
    }
    throw `Token price search by ${attribute} not implemented`;
  }
}
