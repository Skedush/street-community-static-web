// ref: https://umijs.org/config/

export default {
  define: {
    API_PREFIX: '',
    MAP_IP: '41.188.33.236',
    MAP_DARK_TILE_OPENED: false,
    MAP_DARK_TILE_HOST: '41.188.33.236:25333',
    // FRAME_URL: 'http://41.212.1.155:8079',
    STATIC_URL: 'http://41.212.1.154:8080',
    // USERNAME_FRAME: 'dev-admin',
    // PASSWORD_FRAME: 'ldkj2018',

    // 标准版配置
    cityId: 120,
    cityName: '温州市',
    cityCode: '3303',
  },
  extraBabelPlugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]],
};
