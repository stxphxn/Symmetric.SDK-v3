/* eslint-disable @typescript-eslint/no-empty-function */
import { Findable, Network, GeckoterminalPrices } from '@/types';
import axios from 'axios';
import { TOKENS } from '@/lib/constants/tokens';
import { Debouncer, tokenAddressForPricing } from '@/lib/utils';

type TokenPricesResponse = {
  data: {
    id: string;
    type: string;
    attributes: {
      token_prices: GeckoterminalPrices;
    };
  };
};
/**
 * Simple coingecko price source implementation. Configurable by network and token addresses.
 */
export class GeckoterminalPriceRepository implements Findable<string> {
  prices: { [key: string]: Promise<string> } = {};
  nativePrice?: Promise<string>;
  urlBase: string;
  baseTokenAddresses: string[];
  debouncer: Debouncer<GeckoterminalPrices, string>;

  constructor(tokenAddresses: string[], public chainId: Network = 1) {
    this.baseTokenAddresses = tokenAddresses.map(tokenAddressForPricing);
    this.urlBase = `https://api.geckoterminal.com/api/v2/simple/networks/${this.platform(
      chainId
    )}/token_price/`;
    this.debouncer = new Debouncer<GeckoterminalPrices, string>(
      this.fetch.bind(this),
      200
    );
  }

  private fetch(
    addresses: string[],
    { signal }: { signal?: AbortSignal } = {}
  ): Promise<GeckoterminalPrices> {
    console.time(`fetching geckoterminal for ${addresses.length} tokens`);
    return axios
      .get<TokenPricesResponse>(this.url(addresses), { signal })
      .then(({ data }) => {
        return data.data.attributes.token_prices;
      })
      .catch((error) => {
        const message = ['Error fetching token prices from coingecko'];
        if (error.isAxiosError) {
          if (error.response?.status) {
            message.push(`with status ${error.response.status}`);
          }
        } else {
          message.push(error);
        }
        return Promise.reject(message.join(' '));
      })
      .finally(() => {
        console.timeEnd(
          `fetching geckoterminal for ${addresses.length} tokens`
        );
      });
  }

  // private fetchNative({
  //   signal,
  // }: { signal?: AbortSignal } = {}): Promise<Price> {
  //   console.time(`fetching coingecko for native token`);
  //   enum Assets {
  //     ETH = 'ethereum',
  //     MATIC = 'matic-network',
  //     XDAI = 'xdai',
  //     TLOS = 'tlos',
  //     MTR = 'meter-stable',
  //     CELO = 'celo',
  //     TAIKO = 'taiko',
  //   }
  //   let assetId: Assets = Assets.ETH;
  //   if (this.chainId === 137) assetId = Assets.MATIC;
  //   if (this.chainId === 100) assetId = Assets.XDAI;
  //   if (this.chainId === 41) assetId = Assets.TLOS;
  //   if (this.chainId === 82) assetId = Assets.MTR;
  //   if (this.chainId === 42220) assetId = Assets.CELO;
  //   if (this.chainId === 167000) assetId = Assets.TAIKO;
  //   return axios
  //     .get<{ [key in Assets]: Price }>(
  //       `https://api.coingecko.com/api/v3/simple/price/?vs_currencies=eth,usd&ids=${assetId}`,
  //       { signal }
  //     )
  //     .then(({ data }) => {
  //       return data[assetId];
  //     })
  //     .catch((error) => {
  //       const message = ['Error fetching native token from coingecko'];
  //       if (error.isAxiosError) {
  //         if (error.response?.status) {
  //           message.push(`with status ${error.response.status}`);
  //         }
  //       } else {
  //         message.push(error);
  //       }
  //       return Promise.reject(message.join(' '));
  //     })
  //     .finally(() => {
  //       console.timeEnd(`fetching coingecko for native token`);
  //     });
  // }

  find(inputAddress: string): Promise<string | undefined> {
    const address = tokenAddressForPricing(inputAddress, this.chainId);
    if (!this.prices[address]) {
      // Make initial call with all the tokens we want to preload
      if (Object.keys(this.prices).length === 0) {
        for (const baseAddress of this.baseTokenAddresses) {
          this.prices[baseAddress] = this.debouncer
            .fetch(baseAddress)
            .then((prices) => prices[baseAddress]);
        }
      }

      // Handle native asset special case
      if (
        address === TOKENS(this.chainId).Addresses.nativeAsset.toLowerCase()
      ) {
        if (!this.nativePrice) {
          const prices = this.fetch([
            TOKENS(this.chainId).Addresses.wNativeAsset,
          ]);
          this.prices[address] = prices.then((prices) => prices[address]);
        }

        return this.prices[address];
      }

      this.prices[address] = this.debouncer
        .fetch(address)
        .then((prices) => prices[address]);
    }

    return this.prices[address];
  }

  async findBy(attribute: string, value: string): Promise<string | undefined> {
    if (attribute != 'address') {
      return undefined;
    }

    return this.find(value);
  }

  private platform(chainId: number): string {
    switch (chainId) {
      case 1:
      case 5:
      case 42:
      case 31337:
        return 'eth';
      case 100:
        return 'xdai';
      case 137:
        return 'polygon-pos';
      case 250:
        return 'fantom';
      case 1101:
        return 'polygon-zkevm';
      case 8453:
        return 'base';
      case 42161:
        return 'arbitrum-one';
      case 43114:
        return 'avalanche';
      case 41:
        return 'tlos';
      case 40:
        return 'tlos';
      case 82:
        return 'mtr';
      case 42220:
        return 'celo';
      case 167000:
        return 'taiko';
    }

    return '2';
  }

  private url(addresses: string[]): string {
    return `${this.urlBase}${addresses.join(',')}`;
  }
}
