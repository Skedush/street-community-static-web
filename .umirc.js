// ref: https://umijs.org/config/

import { resolve } from 'path';
import pageRoutes from './config/router.config';
import pxToViewPort from 'postcss-px-to-viewport';
import slash from 'slash2';
export default {
  treeShaking: true,
  history: 'hash',
  // 禁用 redirect 上提
  disableRedirectHoist: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loader',
        },
        title: 'smart-community-static-web',
        dll: false,

        routes: {
          exclude: [
            /public\//,
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  // 开启hash文件后缀
  hash: true,
  targets: {
    chrome: 30,
  },
  // 静态化
  // exportStatic: {},
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme
  theme: './config/theme.config.js',
  define: {
    // API_PREFIX: '',
    // API_PREFIX: 'http://127.0.0.1:8099',
    // API_PREFIX: 'http://192.168.70.201:8099',
    // API_PREFIX: 'http://172.16.0.111:8099',
    API_PREFIX: 'http://192.168.70.155:9999',
    // API_PREFIX:'http://172.16.0.193:8099',//海
    // API_PREFIX: 'http://172.16.0.71:8099', //可可
    // API_PREFIX: 'http://172.16.1.187:8099', //谢添
    // API_PREFIX: 'http://172.16.0.113:8080', // 波
    // API_PREFIX: 'http://172.16.0.128:8099', // 大鑫
    HTTP_PORT: '9001',
    MAP_IP: '192.168.70.10',
    MAP_DARK_TILE_OPENED: false,
    MAP_DARK_TILE_HOST: '25003',
    // FRAME_URL: 'http://localhost:8097',
    // STATIC_URL:＇http://192.168.70.46:8080',
    STATIC_URL: 'http://192.168.70.46:8080',
    // 标准版配置
    cityId: 120,
    cityName: '温州市',
    cityCode: '3303',

    // USERNAME_FRAME: 'cs-teh',
    // PASSWORD_FRAME: '123456',
  },
  alias: {
    '@': resolve(__dirname, './src/'),
    api: resolve(__dirname, './src/services/'),
    components: resolve(__dirname, './src/components'),
    config: resolve(__dirname, './src/utils/config'),
    models: resolve(__dirname, './src/models'),
    services: resolve(__dirname, './src/services'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
    assets: resolve(__dirname, './src/assets'),
  },

  lessLoaderOptions: {
    javascriptEnabled: true,
  },

  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      if (localName.match(/^icon[f-]/)) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },

  extraPostCSSPlugins: [
    pxToViewPort({
      unitToConvert: 'px',
      viewportWidth: 1920,
      unitPrecision: 5,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: [/node_modules/],
      landscape: false,
      landscapeUnit: 'vw',
      landscapeWidth: 568,
    }),
  ],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
};
