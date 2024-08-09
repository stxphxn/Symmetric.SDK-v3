import { Interface } from '@ethersproject/abi';
import { formatUnits } from '@ethersproject/units';
import { Multicall } from '@/contracts';
import { Network } from '@/types';

export const yieldTokens = {
  [Network.TELOS]: {
    woUSDC: '0x953808ef6be397925f71ec0e8892e246882e4804',
    woUSDT: '0x181f14262e2efd4df781079437eba1aed3343898',
    woUSDM: '0x8edc3bdd08980d5f6672f243cebc58c6c117956a',
  },
};

export const wrappedTokensMap = {
  [Network.TELOS]: {
    // USDC
    [yieldTokens[Network.TELOS].woUSDC]: {
      yToken: '0x953808ef6be397925f71ec0e8892e246882e4804',
      underlying: '0x8d97cea50351fb4329d591682b148d43a0c3611b',
      rateProvider: '0xff4cda0e94eb73a0c77eb490688db5ba792874ec',
    },
    // USDT
    [yieldTokens[Network.TELOS].woUSDT]: {
      yToken: '0x181f14262e2efd4df781079437eba1aed3343898',
      underlying: '0x975ed13fa16857e83e7c493c7741d556eaad4a3f',
      rateProvider: '0xea6ef7767f63648d5064ee8ddb2c30f79163c8e1',
    },
    // USDM
    [yieldTokens[Network.TELOS].woUSDM]: {
      yToken: '0x8edc3bdd08980d5f6672f243cebc58c6c117956a',
      underlying: '0x8f7D64ea96D729EF24a0F30b4526D47b80d877B9',
      rateProvider: '0x77b00f59b2c4eaec3339fbdf5e4b10b13f172c45',
    },
  },
};

const priceRateInterface = new Interface([
  'function getRate() external view returns (uint256)',
]);

export interface IAaveRates {
  getRate: (address: string) => Promise<number>;
}

export class AaveRates implements IAaveRates {
  rates?: Promise<{ [wrappedATokenAddress: string]: number }>;

  constructor(private multicall: Multicall, private network: Network) {}

  private async fetch(
    network: Network.TELOS
  ): Promise<{ [wrappedOTokenAddress: string]: number }> {
    console.time('Fetching meridian rates');
    const addresses = Object.values(yieldTokens[network]);
    const payload = addresses.map((wrappedOTokenAddress) => ({
      target: wrappedTokensMap[network][wrappedOTokenAddress].rateProvider,
      callData: priceRateInterface.encodeFunctionData('getRate', []),
    }));
    const [, res] = await this.multicall.callStatic.aggregate(payload);
    console.log('res', res);

    const rates = addresses.reduce((p: { [key: string]: number }, a, i) => {
      p[a] ||= res[i] == '0x' ? 0 : parseFloat(formatUnits(res[i], 18));
      return p;
    }, {});
    console.timeEnd('Fetching meridian rates');
    console.log('rates', rates);
    return rates;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getRate(wrappedOToken: string): Promise<number> {
    //To prevent bricked linear pools from effecting this call
    if (this.network != Network.TELOS) {
      return 1;
    }
    if (!Object.values(yieldTokens[this.network]).includes(wrappedOToken)) {
      return 1;
    }
    if (!this.rates) {
      this.rates = this.fetch(this.network);
    }

    return (await this.rates)[wrappedOToken];

    return 1;
  }
}
