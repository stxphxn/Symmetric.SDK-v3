import { Network } from './network';
import { BalancerNetworkConfig } from '@/types';
import addressesByNetwork from './addresses.json';

// Info fetched using npm package slot20
export const BPT_SLOT = 0;
export const BPT_DECIMALS = 18;

export const BALANCER_NETWORK_CONFIG: Record<Network, BalancerNetworkConfig> = {
  [Network.MAINNET]: {
    chainId: Network.MAINNET, //1
    addresses: {
      //Mainnet deployment addresses: https://docs.balancer.fi/reference/contracts/deployment-addresses/mainnet.html
      contracts: {
        multicall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
        poolDataQueries: '0xf5CDdF6feD9C589f1Be04899F48f9738531daD59',
        lidoRelayer: '0xdcdbf71A870cc60C6F9B621E28a7D3Ffd6Dd4965',
        veBal: '0xC128a9954e6c874eA3d62ce62B468bA073093F25',
        gaugeControllerCheckpointer:
          '0x8e5698dc4897dc12243c8642e77b4f21349db97c',
        veBalProxy: '0x6f5a2eE11E7a772AeB5114A20d0D7c0ff61EB8A0',
        gyroConfigProxy: '0xac89cc9d78bbad7eb3a02601b4d65daa1f908aa6',
        ...addressesByNetwork[Network.MAINNET].contracts,
      },
      tokens: {
        bal: addressesByNetwork[Network.MAINNET].contracts.bal,
        wrappedNativeAsset: addressesByNetwork[Network.MAINNET].contracts.weth,
        bbaUsd: addressesByNetwork[Network.MAINNET].tokens.bb_a_usd,
        lbpRaisingTokens: [
          '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
          '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
        ],
        stETH: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        wstETH: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
        veBal: '0xC128a9954e6c874eA3d62ce62B468bA073093F25',
        ...addressesByNetwork[Network.MAINNET].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'ethereum',
      },
    },
    pools: {
      wETHwstETH: {
        id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080',
        address: '0x32296969ef14eb0c6d29669c550d4a0449130230',
      },
    },
    poolsToIgnore: [
      '0xbd482ffb3e6e50dc1c437557c3bea2b68f3683ee', // a pool made by an external dev who was playing with a novel rate provider mechanism in production.
      '0x0afbd58beca09545e4fb67772faf3858e610bcd0',
      '0xf22ff21e17157340575158ad7394e068048dd98b',
      '0xf71d0774b214c4cf51e33eb3d30ef98132e4dbaa',
    ],
    sorConnectingTokens: [
      {
        symbol: 'wEth',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      },
      {
        symbol: 'wstEth',
        address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      },
      {
        symbol: 'DOLA',
        address: '0x865377367054516e17014CcdED1e7d814EDC9ce4',
      },
    ],
  },
  [Network.POLYGON]: {
    chainId: Network.POLYGON, //137
    addresses: {
      //Polygon deployment addresses: https://docs.balancer.fi/reference/contracts/deployment-addresses/polygon.html
      contracts: {
        multicall: '0xa1B2b503959aedD81512C37e9dce48164ec6a94d',
        poolDataQueries: '0x84813aA3e079A665C0B80F944427eE83cBA63617',
        gaugeClaimHelper: '0xaeb406b0e430bf5ea2dc0b9fe62e4e53f74b3a33',
        gyroConfigProxy: '0xfdc2e9e03f515804744a40d0f8d25c16e93fbe67',
        ...addressesByNetwork[Network.POLYGON].contracts,
      },
      tokens: {
        bal: addressesByNetwork[Network.POLYGON].contracts.bal,
        wrappedNativeAsset: addressesByNetwork[Network.POLYGON].contracts.weth,
        lbpRaisingTokens: [
          '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
          '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
          '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
        ],
        ...addressesByNetwork[Network.POLYGON].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-prune-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-polygon',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/ianlapham/polygon-blocks',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: '',
        platformId: 'polygon-pos',
      },
    },
    pools: {},
    poolsToIgnore: [
      '0x600bd01b6526611079e12e1ff93aba7a3e34226f', // This pool has rateProviders with incorrect scaling
      '0xc31a37105b94ab4efca1954a14f059af11fcd9bb', // Stable pool with Convergence issues
    ],
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      },
      {
        symbol: 'bbrz2',
        address: '0xe22483774bd8611be2ad2f4194078dac9159f4ba',
      }, // Joins Stables<>BRZ via https://app.balancer.fi/#/polygon/pool/0x4a0b73f0d13ff6d43e304a174697e3d5cfd310a400020000000000000000091c
    ],
  },
  [Network.ARBITRUM]: {
    chainId: Network.ARBITRUM, //42161
    //Arbitrum deployment addresses: https://docs.balancer.fi/reference/contracts/deployment-addresses/arbitrum.html
    addresses: {
      contracts: {
        multicall: '0x269ff446d9892c9e19082564df3f5e8741e190a1',
        poolDataQueries: '0x7Ba29fE8E83dd6097A7298075C4AFfdBda3121cC',
        gaugeClaimHelper: '0xa0dabebaad1b243bbb243f933013d560819eb66f',
        ...addressesByNetwork[Network.ARBITRUM].contracts,
      },
      tokens: {
        bal: addressesByNetwork[Network.ARBITRUM].contracts.bal,
        wrappedNativeAsset: addressesByNetwork[Network.ARBITRUM].contracts.weth,
        lbpRaisingTokens: [
          '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
          '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
          '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH
        ],
        ...addressesByNetwork[Network.ARBITRUM].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-arbitrum',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'arbitrum-one',
      },
    },
    pools: {},
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      },
    ],
    sorTriPathMidPoolIds: [
      '0x178e029173417b1f9c8bc16dcec6f697bc323746000200000000000000000158', // wstEth/USDC.e to open up auraBAL/USDC
      '0x0052688295413b32626d226a205b95cdb337de860002000000000000000003d1', // arb/USDC.e to open up aura/USDC
    ],
  },
  [Network.GOERLI]: {
    chainId: Network.GOERLI, //5
    //Goerli deployment addresses: https://docs.balancer.fi/reference/contracts/deployment-addresses/goerli.html
    addresses: {
      contracts: {
        multicall: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
        poolDataQueries: '0x6d3197d069F8F9f1Fe7e23665Bc64CB77ED8b089',
        veBal: '0x33A99Dcc4C85C014cf12626959111D5898bbCAbF',
        veBalProxy: '0xA1F107D1cD709514AE8A914eCB757E95f9cedB31',
        erc4626LinearPoolFactory: '0xba240c856498e2d7a70af4911aafae0d6b565a5b',
        aaveLinearPoolFactory: '0x76578ecf9a141296ec657847fb45b0585bcda3a6',
        ...addressesByNetwork[Network.GOERLI].contracts,
      },
      tokens: {
        bal: addressesByNetwork[Network.GOERLI].contracts.bal,
        wrappedNativeAsset: addressesByNetwork[Network.GOERLI].contracts.weth,
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-goerli-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-goerli',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/blocklytics/goerli-blocks',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'ethereum',
      },
    },
    pools: {},
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
      },
    ],
  },
  [Network.OPTIMISM]: {
    chainId: Network.OPTIMISM, //10
    // Optimism deployment addresses: https://docs.balancer.fi/reference/contracts/deployment-addresses/optimism.html
    addresses: {
      contracts: {
        multicall: '0x2dc0e2aa608532da689e89e237df582b783e552c',
        poolDataQueries: '0x6B5dA774890Db7B7b96C6f44e6a4b0F657399E2e',
        gyroConfigProxy: '0x32acb44fc929339b9f16f0449525cc590d2a23f3',
        ...addressesByNetwork[Network.OPTIMISM].contracts,
      },
      tokens: {
        bal: '0xfe8b128ba8c78aabc59d4c64cee7ff28e9379921',
        wrappedNativeAsset: addressesByNetwork[Network.OPTIMISM].contracts.weth,
        lbpRaisingTokens: [
          '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
          '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
          '0x4200000000000000000000000000000000000006', // WETH
        ],
        ...addressesByNetwork[Network.OPTIMISM].tokens,
      },
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'optimistic-ethereum',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx-optimism',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-optimism',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/lyra-finance/optimism-mainnet-blocks',
    },
    pools: {},
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0x4200000000000000000000000000000000000006',
      },
    ],
  },
  [Network.FANTOM]: {
    chainId: Network.FANTOM, //250
    //Fantom deployment addresses: https://docs.beets.fi/technicals/deployments
    addresses: {
      contracts: {
        vault: '0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce',
        multicall: '0x66335d7ad8011f6aa3f48aadcb523b62b38ed961',
        poolDataQueries: '0xb132F1E145DcC085980C531e2dA81f2b84efc14F',
        gaugeClaimHelper: '0x0000000000000000000000000000000000000000', // no guages on fantom
        balancerRelayer: '0x419f7925b8c9e409b6ee8792242556fa210a7a09',
        balancerHelpers: '0xfE18C7C70b0a2c6541bEde0367124278BC345Dc8',
        weightedPoolFactory: '0x60467cb225092cE0c989361934311175f437Cf53',
        composableStablePoolFactory:
          '0x44814E3A603bb7F1198617995c5696C232F6e8Ed',
        yearnLinearPoolFactory: '0x1f73ae6ed391a2b1e84ff988a1bb5394b78a4a71',
      },
      tokens: {
        bal: '0xF24Bcf4d1e507740041C9cFd2DddB29585aDCe1e', //beets
        wrappedNativeAsset: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
        lbpRaisingTokens: [
          '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
          '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
          '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        ],
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx-v2-fantom',
      gaugesSubgraph: '', // no guages on fantom
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/beethovenxfi/fantom-blocks',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'ftm',
        platformId: 'fantom',
      },
    },
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'wftm',
        address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
      },
    ],
  },
  [Network.SEPOLIA]: {
    chainId: Network.SEPOLIA, //11155111
    addresses: {
      contracts: {
        multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
        poolDataQueries: '0x9805dcfD25e6De36bad8fe9D3Fe2c9b44B764102',
        ...addressesByNetwork[Network.SEPOLIA].contracts,
      },
      tokens: {
        bal: addressesByNetwork[Network.SEPOLIA].contracts.bal,
        wrappedNativeAsset: addressesByNetwork[Network.SEPOLIA].contracts.weth,
        ...addressesByNetwork[Network.SEPOLIA].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.studio.thegraph.com/query/24660/balancer-sepolia-v2/version/latest',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'ethereum',
      },
    },
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [],
  },
  [Network.ZKEVM]: {
    chainId: Network.ZKEVM, //1101
    addresses: {
      contracts: {
        balancerMinter: '0x475D18169BE8a89357A9ee3Ab00ca386d20fA229',
        multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
        poolDataQueries: '0xF24917fB88261a37Cc57F686eBC831a5c0B9fD39',
        ...addressesByNetwork[Network.ZKEVM].contracts,
      },
      tokens: {
        bal: addressesByNetwork[Network.ZKEVM].contracts.bal,
        wrappedNativeAsset: addressesByNetwork[Network.ZKEVM].contracts.weth,
        ...addressesByNetwork[Network.ZKEVM].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest',
      gaugesSubgraph:
        'https://api.studio.thegraph.com/query/24660/balancer-gauges-polygon-zk/version/latest',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'polygon-zkevm',
      },
    },
    averageBlockTime: 4,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
      },
      {
        symbol: 'wsEth',
        address: '0x5D8cfF95D7A57c0BF50B30b43c7CC0D52825D4a9',
      },
    ],
  },
  [Network.AVALANCHE]: {
    chainId: Network.AVALANCHE, //43114
    addresses: {
      contracts: {
        balancerMinter: '0xEa924b45a3fcDAAdf4E5cFB1665823B8F8F2039B',
        multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
        poolDataQueries: '0x67af5D428d38C5176a286a2371Df691cDD914Fb8',
        ...addressesByNetwork[Network.AVALANCHE].contracts,
      },
      tokens: {
        bal: addressesByNetwork[Network.AVALANCHE].contracts.bal,
        wrappedNativeAsset:
          addressesByNetwork[Network.AVALANCHE].contracts.weth,
        ...addressesByNetwork[Network.AVALANCHE].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-avalanche-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-avalanche',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/iliaazhel/avalanche-blocks',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'avalanche-2',
        platformId: 'avalanche',
      },
    },
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'WAVAX',
        address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
      },
      {
        symbol: 'sAVAX',
        address: '0x2b2c81e08f1af8835a78bb2a90ae924ace0ea4be',
      },
    ],
  },
  [Network.BASE]: {
    chainId: Network.BASE, //8453
    addresses: {
      contracts: {
        balancerMinter: '0xc7E5ED1054A24Ef31D827E6F86caA58B3Bc168d7',
        multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
        poolDataQueries: '',
        ...addressesByNetwork[Network.BASE].contracts,
      },
      tokens: {
        bal: addressesByNetwork[Network.BASE].contracts.bal,
        wrappedNativeAsset: addressesByNetwork[Network.BASE].contracts.weth,
        ...addressesByNetwork[Network.BASE].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.studio.thegraph.com/query/24660/balancer-base-v2/version/latest',
      gaugesSubgraph:
        'https://api.studio.thegraph.com/query/24660/balancer-gauges-base/version/latest',
      blockNumberSubgraph:
        'https://api.studio.thegraph.com/query/48427/bleu-base-blocks/version/latest',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'base',
      },
    },
    averageBlockTime: 2,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0x4200000000000000000000000000000000000006',
      },
    ],
    sorTriPathMidPoolIds: [
      '0x2db50a0e0310723ef0c2a165cb9a9f80d772ba2f00020000000000000000000d', // weth/staBal
    ],
  },
  [Network.TELOS]: {
    chainId: Network.TELOS, //41
    addresses: {
      contracts: {
        multicall: '0xca11bde05977b3631167028862be2a173976ca11',
        gaugeControllerCheckpointer:
          '0xdba94eAFc9605a244EE10d68eB4A70177C30b9E0',
        poolDataQueries:
          addressesByNetwork[Network.TELOS].contracts.balancerQueries,
        ...addressesByNetwork[Network.TELOS].contracts,
      },
      tokens: {
        wrappedNativeAsset: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
        bal: '0xd5f2a24199C3DFc44C1Bf8B1C01aB147809434Ca',
        veBal: '0x0d0b7efc6e20b96841f37b28219a595a81c4615a',
        wstETH: '0xb4b01216a5bc8f1c8a33cd990a1239030e60c905',
        bbaUsd: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
        stableReward: '0x8f7D64ea96D729EF24a0F30b4526D47b80d877B9',
        ...addressesByNetwork[Network.TELOS].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos/prod/gn',
      gaugesSubgraph:
        'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos-gauges/prod/gn',
      blockNumberSubgraph: '',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'telos',
        platformId: 'telos',
      },
    },
    averageBlockTime: 0.5,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'WTLOS',
        address: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
      },
      {
        symbol: 'USDT',
        address: '0x975ed13fa16857e83e7c493c7741d556eaad4a3f',
      },
    ],
    sorTriPathMidPoolIds: [
      '0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59000200000000000000000006', // WTLOS/USDT
      '0x058d4893efa235d86cceed5a7eef0809b76c8c66000000000000000000000004', // USDT/USDC
      '0x9a77bd2edbbb68173275cda967b76e9213949ace000000000000000000000008', //STLOS/WTLOS
      '0x5e99843486cf052baf0925a0cdeb40920477295900000000000000000000000b', //USDM/USDC-USDT
    ],
  },
  [Network.TELOSTESTNET]: {
    chainId: Network.TELOSTESTNET, //41
    addresses: {
      contracts: {
        multicall: '0xb51E754479b47600D39f983E6f5b645607C04233',
        poolDataQueries:
          addressesByNetwork[Network.TELOSTESTNET].contracts.balancerQueries,
        ...addressesByNetwork[Network.TELOSTESTNET].contracts,
      },
      tokens: {
        wrappedNativeAsset: '0xF5Dd4A1fCE57D9aCd7a4fEF03709402014b56813',
        bal: '0x4446664638E7cF5222c58907248cA3D8EE40b405',
        wstETH: '0xa9991E4daA44922D00a78B6D986cDf628d46C4DD',
        ...addressesByNetwork[Network.TELOSTESTNET].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos-testnet/1.0.0/gn',
      gaugesSubgraph: '',
      blockNumberSubgraph: '',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'telos',
        platformId: 'telos',
      },
    },
    averageBlockTime: 2,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'WTLOS',
        address: '0xF5Dd4A1fCE57D9aCd7a4fEF03709402014b56813',
      },
    ],
    sorTriPathMidPoolIds: [],
  },
  [Network.CELO]: {
    chainId: Network.CELO,
    addresses: {
      contracts: {
        multicall: '0xca11bde05977b3631167028862be2a173976ca11',
        poolDataQueries:
          addressesByNetwork[Network.CELO].contracts.balancerQueries,
        ...addressesByNetwork[Network.CELO].contracts,
      },
      tokens: {
        wrappedNativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        bal: '0x8427bD503dd3169cCC9aFF7326c15258Bc305478',
        wstETH: '0xC668583dcbDc9ae6FA3CE46462758188adfdfC24',
        ...addressesByNetwork[Network.CELO].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/centfinance/symmetric-v2-celo',
      gaugesSubgraph: '',
      blockNumberSubgraph: '',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'celo',
        platformId: 'celo',
      },
    },
    averageBlockTime: 2,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'CELO',
        address: '0x471EcE3750Da237f93B8E339c536989b8978a438',
      },
    ],
    sorTriPathMidPoolIds: [],
  },
  [Network.GNOSIS]: {
    chainId: Network.GNOSIS, //100
    // Gnosis deployment addresses: https://docs.balancer.fi/reference/contracts/deployment-addresses/gnosis.html
    addresses: {
      contracts: {
        multicall: '0xca11bde05977b3631167028862be2a173976ca11',
        poolDataQueries: '0x3f170631ed9821Ca51A59D996aB095162438DC10',
        ...addressesByNetwork[Network.GNOSIS].contracts,
      },
      tokens: {
        wrappedNativeAsset: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
        bal: '0xc45b3c1c24d5f54e7a2cf288ac668c74dd507a84',
        ...addressesByNetwork[Network.GNOSIS].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/centfinance/symmetric-v2-gnosis',
      gaugesSubgraph: '',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'xdai',
        platformId: 'xdai',
      },
    },
    averageBlockTime: 5,
    pools: {},
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      },
      {
        symbol: 'wsEth',
        address: '0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6',
      },
    ],
    sorTriPathMidPoolIds: [
      '0xeb30c85cc528537f5350cf5684ce6a4538e13394000200000000000000000059', // 3POOL_BPT/wstETH
    ],
  },
  [Network.METER]: {
    chainId: Network.METER, //82
    addresses: {
      contracts: {
        multicall: '0xca11bde05977b3631167028862be2a173976ca11',
        poolDataQueries:
          addressesByNetwork[Network.METER].contracts.balancerQueries,
        ...addressesByNetwork[Network.METER].contracts,
      },
      tokens: {
        wrappedNativeAsset: '0x160361ce13ec33c993b5cca8f62b6864943eb083',
        bal: '0x663345e09F4F4437F3D5df39BA5c2B5690532206',
        wstETH: '',
        veBal: '0xdae34cfc2a0ef52ac8417eefc2a1c5ceac50bfe7',
        bbaUsd: '0x2077a828fd58025655335a8756dbcfeb7e5bec46',
        ...addressesByNetwork[Network.METER].tokens,
      },
    },
    urls: {
      subgraph:
        'https://graph-meter.voltswap.finance/subgraphs/name/symmetric-meter',
      gaugesSubgraph:
        'https://graph-meter.voltswap.finance/subgraphs/name/symmetric-meter-gauges',
      blockNumberSubgraph: '',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'meter-stable',
        platformId: 'meter',
      },
    },
    averageBlockTime: 2,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'WMTR',
        address: '0x160361ce13ec33c993b5cca8f62b6864943eb083',
      },
    ],
    sorTriPathMidPoolIds: [
      '0x79c308ceab33cfb8aa95f7ab795a0db3d282ee66000200000000000000000004',
      '0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee000000000000000000000002',
      '0xc4187382305ea2c953f0a164f02b4d27c9957db5000200000000000000000005',
      '0xd9fe77653c2b75cf3442c365a3f1f9c7ed1612c7000200000000000000000003',
    ],
  },
  [Network.ARTELABETANET]: {
    chainId: Network.ARTELABETANET, //11822
    addresses: {
      contracts: {
        multicall: '0xd07c8635f76e8745Ee7092fbb6e8fbc5FeF09DD7',
        poolDataQueries:
          addressesByNetwork[Network.ARTELABETANET].contracts.balancerQueries,
        ...addressesByNetwork[Network.ARTELABETANET].contracts,
      },
      tokens: {
        wrappedNativeAsset: '0xaDCd43c78A914c6B14171aB1380bCFcfa25cd3AD',
        bal: '0x4a869ed6b3f74dC41537EF27e8eB3A8676AE4614',
        wstETH: '',
        veBal: '',
        bbaUsd: '',
        ...addressesByNetwork[Network.ARTELABETANET].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-artela-testnet/prod/gn',
      gaugesSubgraph: '',
      blockNumberSubgraph: '',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'artela',
        platformId: 'artela',
      },
    },
    averageBlockTime: 2,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [
      {
        symbol: 'WART',
        address: '0xaDCd43c78A914c6B14171aB1380bCFcfa25cd3AD',
      },
    ],
    sorTriPathMidPoolIds: [],
  },
  [Network.TAIKO]: {
    chainId: Network.TAIKO,
    addresses: {
      contracts: {
        multicall: '0xca11bde05977b3631167028862be2a173976ca11',
        poolDataQueries:
          addressesByNetwork[Network.TAIKO].contracts.balancerQueries,
        ...addressesByNetwork[Network.TAIKO].contracts,
      },
      tokens: {
        wrappedNativeAsset: '0xa51894664a773981c6c112c43ce576f315d5b1b6',
        bal: '0x9c9d0025f27756217bdbb584cfb9dd4aa58b1fec',
        wstETH: '',
        veBal: '',
        bbaUsd: '',
        ...addressesByNetwork[Network.TAIKO].tokens,
      },
    },
    urls: {
      subgraph:
        'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-taiko/1.0.0/gn',
      gaugesSubgraph: '',
      blockNumberSubgraph: '',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'ethereum',
      },
    },
    averageBlockTime: 32,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [],
    sorTriPathMidPoolIds: [],
  },
  [Network.ETHERLINK]: {
    chainId: Network.ETHERLINK,
    addresses: {
      contracts: {
        multicall: '0xca11bde05977b3631167028862be2a173976ca11',
        poolDataQueries:
          addressesByNetwork[Network.ETHERLINK].contracts.balancerQueries,
        ...addressesByNetwork[Network.ETHERLINK].contracts,
      },
      tokens: {
        wrappedNativeAsset: '0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb',
        bal: '0x332e0bf729f06C9e08ffA42ABb1312Fcd16289e7',
        wstETH: '',
        veBal: '',
        bbaUsd: '',
        ...addressesByNetwork[Network.ETHERLINK].tokens,
      },
    },
    urls: {
      subgraph:
        'https://gateway.thegraph.com/api/0d9bf278d67d70c9368a5c70a486a744/subgraphs/id/4y4fC3k9DMrJ9XYY6Z1Qi8DXJkpRrQuQCjh7zBRhxjQr',
      gaugesSubgraph: '',
      blockNumberSubgraph: '',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'xtz',
        platformId: 'tezos',
      },
    },
    averageBlockTime: 2,
    pools: {},
    poolsToIgnore: [],
    sorConnectingTokens: [],
    sorTriPathMidPoolIds: [],
  },
};

export const balancerVault = {
  [Network.MAINNET]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.GOERLI]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.OPTIMISM]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.GNOSIS]:
    BALANCER_NETWORK_CONFIG[Network.GNOSIS].addresses.contracts.vault,
  [Network.POLYGON]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.FANTOM]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.BASE]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.ZKEVM]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.ARBITRUM]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.AVALANCHE]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.SEPOLIA]: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  [Network.TELOSTESTNET]:
    BALANCER_NETWORK_CONFIG[Network.TELOSTESTNET].addresses.contracts.vault,
  [Network.TELOS]:
    BALANCER_NETWORK_CONFIG[Network.TELOS].addresses.contracts.vault,
  [Network.CELO]:
    BALANCER_NETWORK_CONFIG[Network.CELO].addresses.contracts.vault,
  [Network.METER]:
    BALANCER_NETWORK_CONFIG[Network.METER].addresses.contracts.vault,
  [Network.ARTELABETANET]:
    BALANCER_NETWORK_CONFIG[Network.ARTELABETANET].addresses.contracts.vault,
  [Network.TAIKO]:
    BALANCER_NETWORK_CONFIG[Network.TAIKO].addresses.contracts.vault,
  [Network.ETHERLINK]:
    BALANCER_NETWORK_CONFIG[Network.ETHERLINK].addresses.contracts.vault,
};

export const networkAddresses = (
  chainId: number
): BalancerNetworkConfig['addresses'] =>
  BALANCER_NETWORK_CONFIG[chainId as Network].addresses;
