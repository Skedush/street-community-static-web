export default {
  logoutUser: '/user/logout',
  // 登出
  loginOut: '/admin/user/logout',
  loginUser: 'POST /admin/user/login',
  // 个人信息查询
  getUserDetail: 'GET /admin/user/detail',
  // 字典
  getType: 'GET /admin/dic/key_value',
  // 报错日志
  setErrorLog: 'POST /admin/log/operate/add',
  // pki登录之后获取用户信息
  getUserNames: 'GET /admin/user/login/info',

  // 首页
  // 查询管辖区域接口
  getCommunitys: 'GET /village/list',
  // 数据统计接口
  getStatistic: 'GET /statistic/index/data',
  // 采集记录接口
  getBringRecord: 'GET /record/list',
  // 首页剩余工作类型数量接口
  getWorkTypeCount: 'GET /index/todo/week/count',
  // 小区概况-统计面板
  getCommunitySurvey: 'GET /village/survey',
  // 楼幢单元树状信息
  getUnitTreeByCommunity: 'GET /vm/village/unit/tree',
  getVillageTree: 'GET /vm/village/police/tree',
  // 单元画像
  getUnitSummary: 'GET /vm/unit/summary',
  // 单元房屋楼层信息
  getFloorHouseListByUnit: 'GET /vm/village/floor/list',
  // 重点房屋集合查询
  getImportantHouseCollection: 'GET /vm/house/collection/hasImportPerson',
  // 房屋画像
  getHouseSummary: 'GET /vm/household/house/image',
  // 车辆画像
  getCarSummary: 'GET /vm/village/car/image/other',
  // 车辆画像的基础信息
  getBaseCar: 'GET /vm/village/car/image/base',
  // 获取道闸记录
  getCarRecord: 'GET /vm/car/record/list',
  // 单位画像基础信息
  getCompanyBase: 'GET /vm/company/image/base',
  // 单位画像其他信息
  // getCompanyOtherInfo: 'GET /vm/company/person/list',
  // 设备运维
  getDeviceList: 'GET /vm/device/list',

  exportDeviceList: 'GET /vm/device/export',
  // 车辆记录的接口
  getCarRecordListTrue: 'GET /vm/dev_record/car/list',
  // 门禁记录的接口
  getAccessControlRecordListTrue: 'GET /vm/dev_record/door/list',

  // 物业人员接口
  getCompanyPowerDetailList: 'GET /vm/company/power/detail/list',

  // 人物画像门禁记录接口
  getVillagePersonImageDoor: '/vm/village/person/image/door/record',
  // 人物画像访客记录接口
  getVillagePersonImageVisit: 'GET /vm/village/person/image/visit/record',

  getVisitorRecordList: 'GET /vm/dev_record/visit/list',
  getEquipmentInfo: 'GET /vm/device/detail',

  // 角色管理
  queryRolesInfo: 'GET /admin/role/list',
  deleteRoles: 'GET /admin/role/delete',
  updateRole: 'post /admin/role/update',
  addRole: 'POST /admin/role/add',
  getMenuTree: 'GET /admin/menu/tree',

  getRoleTypeCollection: 'GET /admin/role/type/collection',

  // 菜单管理
  menuQuery: 'GET /admin/menu/list',
  menuDelete: 'GET /admin/menu/delete',
  menuUpdate: 'post /admin/menu/update',
  menuAdd: 'POST /admin/menu/add',
  menuCollection: 'GET /admin/menu/collection',

  // 字典管理
  getDicList: 'GET /admin/dic/list',
  addDic: 'POST /admin/dic/add',
  updateDic: 'POST /admin/dic/update',
  deleteDic: 'GET /admin/dic/delete',

  // 日志中心
  getLoginLog: 'GET /admin/log/login/list',
  getOperateLog: 'GET /admin/log/operate/list',
  exportOperateLog: 'GET /vm/export/log/operate',
  exportLoginLog: 'GET /vm/export/log/login',

  // 用户管理
  getUserList: 'GET /admin/user/list',
  addUser: 'POST /admin/user/add',
  deleteUser: 'GET /admin/user/delete',
  updateUser: 'POST /admin/user/update',
  updateUserPassWord: 'GET /admin/user/password/update',

  // 一标六实
  getHouseholdList: 'GET /vm/household/list',
  getImportantPerson: 'GET /vm/household/important/person',
  getHouseList: 'GET /vm/house/list',
  getPersonListByHouse: '/vm/household/list/by/house',
  getCompanyList: 'GET /vm/company/list',
  getCompanyPersonList: 'GET /vm/company/person/list',
  getImportantHouseList: 'GET /vm/house/list/hasImportPerson',
  getCarList: 'GET /vm/car/list',
  // 车辆分布地图接口
  getDistributionMap: 'GET /statistic/province/car/data',
  // 人口分布
  getPopulation: 'GET /statistic/province/person/data',

  // 实有力量
  getPoliceList: 'GET /vm/village/police/list',

  getCourierList: 'GET /vm/village/courier/list',

  getTake: 'GET /vm/village/take/out/list',
  // 实有人口导出
  getHouseholdExport: 'GET /vm/export/household/list',
  // 用户权限
  setRoleMenu: 'GET /admin/role_menu/refresh',
  getRoleMenuById: 'GET /admin/role_menu/collection',
  // 人员画像
  // 人员画像基础信息
  getVillagePersonImageBase: 'GET /vm/village/person/image/base',
  // 人员画像其他信息
  getVillagePersonImageOther: 'GET /vm/village/person/image/other',
  getDoorList: 'GET /vm/door/record/list',
  getVillageList: 'GET /vm/village/visit/record/list',
  // 首页下拉多选
  getDeviceType: 'GET /vm/device/statisticByType',
  // 获取地图点位
  getMapDevice: 'GET /vm/device/collection',
  // 专题分析数据汇总
  getAggregation: 'GET /village/aggregation',
  // 小区建设
  getVillagePlan: 'GET /village/plan/find',
  updateVillagePlan: 'POST /village/plan/update',

  // 小区设备数量
  getDeviceCount: 'GET /vm/device/manual/count/get',
  updateDeviceCount: 'POST /vm/device/manual/count/update',
  // 老人关怀
  getOldManList: 'GET /vm/village/person/old/list',
  // 获取时间
  getSetting: 'GET /system/setting/get',
  // 人户不一致
  getRegisterList: 'GET /vm/person/register/list',
  // 人户不一致操作
  setRegisterHandle: 'POST /vm/person/register/handler',
  // 任务概览
  getWorkbench: 'GET /vm/workbench/survey',

  // 小区新增
  addVillage: 'POST /vm/village/add',
  // 小区管理
  getVillage: 'GET /vm/village/page',
  // 小区地址联动
  getDistrict: 'GET /base/district/get/by/parent',
  // 获取派出所
  getPolice: 'GET /vm/police/org/list',
  // 获取民警
  getPolicePersonlist: 'GET /system/police/person/list',
  // 获取小区详细信息
  getVillageDetailedInformation: 'GET /vm/village/get',
  // 小区修改
  getVillageUpdate: 'POST /vm/village/update',
  // 小区删除
  deleteVillage: 'POST /vm/village/delete',
  // 上传图片
  setImage: 'POST /file/upload',

  // 一标六实下拉框
  getSelectVillage: 'GET /vm/village/select/by/user/list',

  // 帮助手册文件列表
  getTxt: 'GET /file/help/page',
  // 上传文件
  uploadTxt: 'POST /file/help/upload ',
  test: 'POST /file/help/upload',
  // 删除文件
  // deleteTxt: 'GET /file/delete',
  deleteTxt: 'GET /file/help/delete',
  // 下载文件
  downloadTxt: 'GET /file/help/download',
  // 首页待办统计(本周)
  getIndexCount: 'GET /index/todo/week/list',
  getOldCount: 'GET /index/todo/history/list',
  getIndexData: 'GET /index/Data',
  // 小区订阅
  userAddVillage: 'POST /user/village/subscribe/add',
  // 已订阅小区
  getUserAddvillage: 'GET /user/village/subscribe/list',
  // 流口分析详情导出
  getFloatingExportList: 'GET /vm/export/person/flow/check/detail',
  // 流口详情处理按钮
  getFloatDealing: 'POST /vm/person/flow/handle/process',
  getDontFloatDealing: 'POST /vm/person/flow/handle/noprocess',
  // 组织结构级联查询
  getCascade: 'GET /vm/police/org/cascade/select',
  getCascadeAll: 'GET /vm/police/org/cascade/select/all',
  // 获取已关联的小区
  getRoleVillage: 'GET /admin/role/village/tree/list',
  // 获取某个角色关联的小区
  getRoleRelateVillage: 'GET /admin/role/relate/village/list',
  // 辖区搜索接口
  getArea: 'GET /vm/police/org/getDictrictAndPoliceByRoleType',
  // 一级区
  getAreaCity: 'GET /vm/police/org/getDictrictByRoleType',
  // 二级派出所
  getAreaPolice: '/vm/police/org/getDictAndPoliceByCountyId',
  // 工作台小区置顶
  getVillageTop: 'GET /vm/village/top',
  // 工作台辖区
  getPoliceOrgTree: 'GET /vm/police/org/tree',
  // 按钮权限
  getButtonUse: 'GET /admin/menu/button/list',
  // 房屋画像图表
  getPersonAddress: 'GET /vm/household/person/by/address/list',

  // 建设情况统计
  getStatistics: 'GET /construction/situation/list',

  // 关怀老人签收
  getOldHandler: 'GET /vm/village/person/old/handler',
  // 人口户籍签收
  getPersonHandler: 'GET /vm/person/register/check/handler',
  // 流动人口签收
  getPersonFlowHandle: 'GET /vm/person/flow/handle',
  // 事务规则配置：：“
  getRuleConfiguration: 'GET /system/setting/rule/get',
  // 事务规则配置更新
  saveRuleConfiguration: 'POST /system/setting/rule/set',
  // 房屋画像
  getHouseHoldHandler: 'GET /vm/household/house/handler',
  // 人员标签多选框
  getPersonTag: 'GET /vm/household/getPersonTag',
  // 人员标签多选框
  getHouseTag: 'GET /vm/house/getHouseTag',
  // 重点人口标签
  getImportance: 'GET /vm/village/person/important/list',

  // 标签管理
  // 标签展示
  getTagInfo: 'GET /vm/tag/list',
  // 标签新增
  getTagAdd: 'POST /vm/tag/add',
  // 标签修改
  getTagUpdate: 'POST /vm/tag/update',
  // 标签拷贝
  getTagCopy: 'POST /vm/tag/copy',
  // 标签清空:'',
  getTagClear: 'GET /vm/tag/clean',
  // 删除标签
  getDeletTag: 'GET /vm/tag/delete',
  // 画像的展示
  getShowTag: 'GET /vm/tag/element/ref/list',
  // 画像的标签添加
  getShowAddTag: 'POST /vm/tag/element/ref/add',
  // 画像的标签删除
  delShowTag: 'GET /vm/tag/element/ref/delete',
  // 人工标签选择下拉框
  getTagPerson: 'GET /vm/tag/select/list',

  // 建设年份
  getVillageConstruction: 'GET /vm/village/construction/select/list',
  // 重置密码
  getResetPassword: 'GET /admin/user/pass/reset',
  // 角色下拉框
  getRoleType: 'GET /admin/role/select/list',

  // 获得历史版本更新内容
  getVersionHistory: 'GET /vm/version/history/get',

  // 小区分析信息
  villageAnalyzeInfo: 'GET /village/:id/analyze',

  // 保存历史版本信息
  addVersionHistory: 'POST /vm/version/history/add',

  // 小区网关相关api
  exportVillageGateway: 'GET /vm/export/village/gateway',
  getVillageGatePage: 'GET /vm/village/gateway/page',
  getVillageGatewayDetail: 'GET /vm/village/gateway/:id/get',
  getVillageGatewaySituationByDay: 'GET /vm/village/gateway/day/:id/get',

  // 小区上线
  getVillageOnlineDetail: 'GET /vm/village/online/:id/detail',
  getVillageOnlinePage: 'GET /vm/village/online/page',
  updateVillageOnline: 'POST /vm/village/online/update',
  // 导航条标题
  getProjectSystemName: 'GET /system/setting/project/get',

  // 获取手机正则校验
  getPatterns: 'GET /system/file/config',

  // 获取事件预警列表
  getEventWarningData: 'GET /vm/eventwarning/page',
  // 获取事件详情
  getEventDetail: 'GET /vm/eventwarning/:id/detail',
  // 智安任务任务类型
  getTaskCenterType: 'GET /vm/task/center/type',
  // 智安任务签收
  getWorkDeal: 'GET /vm/task/center/check',

  // 一张图
  getScreenDeviceRecord: 'GET /street/big/screen/device/record',
  getScreenDeviceStatusStatistic: 'GET /street/big/screen/device/status/statistic',
  getScreenBasic: 'GET /street/big/screen/basic',
  getEventGrowingStatistics: 'GET /street/big/screen/event/growing/statistics',
  getScreenEventStatistics: 'GET /street/big/screen/event/statistics',
  getEventPendingPage: 'GET /street/big/screen/event/pending/page',
  getCommunityVillageList: 'GET /community/village/list',
  getVillageStatistics: 'GET /street/big/screen/map/village/statistics',
  getCommunityStatistics: 'GET /street/big/screen/map/community/statistics',

  getVillageHouseList: 'GET /vm/house/list/all',
  bindDeviceHouse: 'POST /vm/device/bind',
  unbindDeviceHouse: 'POST /vm/device/unbind',
  getMeterRecord: 'GET /vm/meter/record',
  getDeviceAddress: 'GET /vm/device/address',
};
