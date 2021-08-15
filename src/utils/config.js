module.exports = {
  siteName: '街道数字化平台',
  copyright: 'LD Umi  © 2019',
  logoPath: '/logo.svg',
  // eslint-disable-next-line no-undef
  apiPrefix: API_PREFIX,
  // eslint-disable-next-line no-undef
  httpPort: HTTP_PORT,
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line no-undef
  fixedHeader: true, // sticky primary layout header
  // eslint-disable-next-line no-undef
  // iframeUrl: `${FRAME_URL}/login?temp=1&username=${USERNAME_FRAME}&password=${PASSWORD_FRAME}`,
  // eslint-disable-next-line no-undef
  staticUel: STATIC_URL,
  /* Layout configuration, specify which layout to use for route. */
  // login页不使用primary的layout
  layouts: [
    // { name: 'Inside', include: [/Inside/] },
    {
      name: 'primary',
      include: [/.*/],
      exlude: [/^.*[/]login$|\/dashboard\/data\/statistics[/]?$/],
    },
  ],

  routeList: [
    // {
    //   id: '1',
    //   name: '首页',
    //   route: '/dashboard/home',
    // },
    // {
    //   id: '2',
    //   name: '一标六实',
    //   route: '/dashboard/real',
    // },
    // // {
    // //   id: '3',
    // //   name: '智能设备',
    // //   route: '/dashboard/equipment',
    // // },
    // {
    //   id: '4',
    //   name: '布控预警',
    //   route: '/dashboard/warning',
    // },
    // {
    //   id: '5',
    //   name: '专题分析',
    //   route: '/dashboard/thematicAnalysis',
    // },
  ],
};
