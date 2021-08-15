// ref: https://umijs.org/config/

export default {
  define: {
    API_PREFIX: 'http://192.168.70.201:8099',
    MAP_IP: '192.168.70.10',
    MAP_DARK_TILE_OPENED: false,
    MAP_DARK_TILE_HOST: '',
    // FRAME_URL: 'http://172.16.0.107:7654',
    // FRAME_URL: 'http://192.168.50.115:8081',
    // STATIC_URL: 'http://192.168.50.114:8080',
    // 数据大屏
    STATIC_URL: 'http://192.168.70.46:8080',
    USERNAME_FRAME: 'cs-teh',
    PASSWORD_FRAME: '123456',

    // 标准版配置
    cityId: 120,
    cityName: '温州市',
    cityCode: '3303',
  },
  // extraBabelPlugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]],
};
