export default [
  {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/login',
    component: '../layouts',
    routes: [{ path: '/login', component: './Login' }],
  },

  {
    path: '/static/login',
    component: '../layouts',
    routes: [{ path: '/static/login', component: './StaticLogin' }],
  },

  { path: '/default', component: './DefaultIndex' },
  {
    path: '/404',
    redirect: '/exception/404',
  },
  {
    path: '/404',
    redirect: '/exception/404',
  },
  {
    path: '/exception',
    routes: [
      { path: '/exception', redirect: '/exception/404' },
      { path: '/exception/:code', component: './Exception' },
    ],
  },
  {
    path: '/dashboard',
    component: '../layouts',
    routes: [
      { path: '/dashboard', redirect: '/dashboard/home' },
      // 首页
      { path: '/dashboard/home', component: './Dashboard/Home' },
      // 一张图
      { path: '/dashboard/data/statistics', component: './Dashboard/DataStatistics' },
      // 专题分析
      {
        path: '/dashboard/thematicAnalysis',
        component: '../layouts/InsideLayout',
        routes: [
          // 社区关怀
          {
            path: '/dashboard/thematicAnalysis/oldman',
            component: './Dashboard/ThematicAnalysis/OldMan',
          },
          // 默认专题分析
          {
            path: '/dashboard/thematicAnalysis',
            redirect: '/dashboard/thematicAnalysis/oldman',
          },
          // 事件预警
          {
            path: '/dashboard/thematicAnalysis/event/warning',
            component: './Dashboard/ThematicAnalysis/EventWarning',
          },
          // 小区网关
          {
            path: '/dashboard/thematicAnalysis/village/gateway',
            component: './Dashboard/ThematicAnalysis/VillageGateway',
          },
        ],
      },

      // 一标六实
      {
        path: '/dashboard/real',
        component: '../layouts/InsideLayout',
        routes: [
          // 实有小区`
          {
            path: '/dashboard/real/communitymanagement',
            component: './Dashboard/Real/Community',
          },
          // 实有小区`
          {
            path: '/dashboard/real/addcommunity',
            component: './Dashboard/Real/Community/AddCommunityManagement',
          },

          // 默认实有人口-一人一档
          {
            path: '/dashboard/real',
            redirect: '/dashboard/real/population',
          },

          // 实有人口
          {
            path: '/dashboard/real/population',
            component: './Dashboard/Real/Population',
          },
          // 实有房屋
          {
            path: '/dashboard/real/house',
            component: './Dashboard/Real/House',
          },

          // 实有车辆
          {
            path: '/dashboard/real/car',
            component: './Dashboard/Real/Car',
          },

          // 设备列表
          {
            path: '/dashboard/real/equipment/deviceList',
            component: './Dashboard/Real/TheEquipmentOperational/DeviceList',
          },

          // 企业商会
          {
            path: '/dashboard/real/business',
            component: './Building',
          },
          // 文化礼堂
          {
            path: '/dashboard/real/cultural',
            component: './Building',
          },
          // 城市书房
          {
            path: '/dashboard/real/library',
            component: './Building',
          },
          // 社区学校
          {
            path: '/dashboard/real/school',
            component: './Building',
          },
          // 民宗场所
          {
            path: '/dashboard/real/religion',
            component: './Building',
          },
          // 固定资产
          {
            path: '/dashboard/real/fixed/assets',
            component: './Building',
          },
        ],
      },
      // 系统管理
      {
        path: '/dashboard/system',
        component: '../layouts/InsideLayout',
        routes: [
          // 默认用户管理
          {
            path: '/dashboard/system',
            redirect: '/dashboard/system/users',
          },

          // 标签管理
          {
            path: '/dashboard/system/tagManagement',
            component: './Dashboard/SystemManagement/TagManagement',
          },
          // 历史版本
          {
            path: '/dashboard/system/update/history',
            component: './Dashboard/SystemManagement/UpdateHistory',
          },
          // 小区建设
          {
            path: '/dashboard/system/communityConstruction',
            component: './Dashboard/SystemManagement/CommunityConstruction',
          },
          // 用户管理
          {
            path: '/dashboard/system/users',
            component: './Dashboard/SystemManagement/UserManagement',
          },
          {
            path: '/dashboard/system/users/addOrModifyUser',
            component: './Dashboard/SystemManagement/UserManagement/AddOrModifyUser',
          },
          // 角色管理
          {
            path: '/dashboard/system/roles',
            component: './Dashboard/SystemManagement/RoleManagement',
          },
          {
            path: '/dashboard/system/roles/addOrModifyRole',
            component: './Dashboard/SystemManagement/RoleManagement/AddOrModifyRole',
          },
          // 菜单管理
          {
            path: '/dashboard/system/menus',
            component: './Dashboard/SystemManagement/MenuManagement',
          },
          {
            path: '/dashboard/system/menus/addOrModifyMenu',
            component: './Dashboard/SystemManagement/MenuManagement/AddOrModifyMenu',
          },
          // 数据字典管理
          {
            path: '/dashboard/system/dictionary',
            component: './Dashboard/SystemManagement/DictionaryManagement',
          },
          {
            path: '/dashboard/system/dictionary/addOrModifyDictionary',
            component: './Dashboard/SystemManagement/DictionaryManagement/AddOrModifyDictionary',
          },

          // 日志中心
          {
            path: '/dashboard/system/loginLog',
            component: './Dashboard/SystemManagement/LogManagement/LoginLog',
          },
          {
            path: '/dashboard/system/operateLog',
            component: './Dashboard/SystemManagement/LogManagement/OperateLog',
          },

          // 小区上线
          {
            path: '/dashboard/system/village/online',
            component: './Dashboard/SystemManagement/VillageOnline',
          },
        ],
      },
    ],
  },
];
