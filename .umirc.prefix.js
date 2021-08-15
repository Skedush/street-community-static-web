// ref: https://umijs.org/config/

export default {
  base: 'zhxq',
  publicPath: 'zhxq',
  define: {
    API_PREFIX: '',
    MAP_IP: '41.188.33.236',
    MAP_DARK_TILE_HOST: '41.188.33.236:25333',

    // 标准版配置
    cityId: 120,
    cityName: '温州市',
    cityCode: '3303',
  },
  extraBabelPlugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]],
};
