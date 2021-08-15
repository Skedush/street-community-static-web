export const ROLE_TYPE = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
};

export const CANCEL_REQUEST_MESSAGE = 'cancle request';
export const ERROR_REQUEST_MESSAGE = 'Network Error';
// 用户角色权限类型
export const POLICE_TYPR_ARRAY = {
  NORMAL: '1',
  ORG: '2',
  DISTRICT: '3',
  SPEC: '4',
  CITY: '5',
};

export const ZHIAN_TASK_TYPE_HELP = {
  '0101': '指流动人口在社区民警的所有管辖小区中，一定时期内，门禁、访客、车辆均没有记录。',
  '0102': '指非本市身份证的小区住户在一标三实平台未查询到流动人口和户籍人口信息。',
  '0103': '指流动人口居住证已过有效期。',
  '0104': '指流动人口没有查询到居住证信息。',
  '0105': '指流动人口居住证地址与登记小区地址不一致。',
  '0201': '指户籍人口在全市范围，一定时期内，没有门禁、车辆、访客等活动记录的天数大于设置天数。',
  '0202': '指户籍人口的身份证地址与登记小区不符。',
  '0301': '指70岁以上老人超过设置时间在全市范围无门禁记录。',
  '0302': '指房屋的登记人数达到7人以上。',
  '0303': '指小区住户近7天，有5天以上仅在凌晨（3:00-6:00）有门禁记录。',
  '0501': '指定期检测发现在逃人员曾经在小区进行登记',
  '0502': '指在逃人员进出',
  '0503': '指在逃人员在小区进行登记',
  '0504': '指在逃人员关联车辆进出',
  '0601': '指在智安小区发生的高空抛物等智安事件预警',
  '0602': '指检测到智能设备电池低压',
  '0603': '指智能消防设备发出声光报警',
  '0604': '指燃气检测设备发出燃气泄漏报警',
  '0605': '指通过分析水电表读数发现房屋住户用水、用电量过少',
};

// 智安任务类型
export const ZHIAN_TASK_TYPR_ARRAY = {
  FLOW: '01', // 流口管控
  REGISTER: '02', // 户籍管理
  ABNORMAL: '03', // 异常行为
  SURVEILLANCE: '04', // 布控预警
  ESCAPEDCRIMINAL: '05', // 逃犯
  EVENT: '06', // 事件
};
// 全局提示最大数
export const MESSAGE_CONFIG_MAX_COUNT = 1;
// eslint-disable-next-line no-undef
export const MAP_HOST_PROXY = MAP_IP;

export let MAP_CONSTANTS = {
  TOP_CENTER: [0.5, 0],
  OVERLAY_INFOWINDOW_CUSTOM: 1,
};
export function SETTER_MAP_CONSTANTS(obj) {
  MAP_CONSTANTS = obj;
}

/* eslint-disable */
export const TILE_URL_CALLBACK =
  process.env.NODE_ENV !== 'development' && MAP_DARK_TILE_OPENED
    ? function(x, y, z) {
        return `http://${MAP_DARK_TILE_HOST}/v3/tile?lid=traffic&get=map&cache=off&x=${x}&y=${y}&z=${z}`;
      }
    : null;
/* eslint-enable */
