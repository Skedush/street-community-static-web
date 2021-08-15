import Api from '@/services';

const { getDistributionMap, getPopulation, getDeviceType, getMapDevice } = Api;
export default {
  namespace: 'mapData',

  state: {
    checkes: { counts: true },
    defaultKey: 'counts', // 数据字段
    columns: [
      {
        field: 'name',
        name: '省市',
        type: 'string',
      },
      {
        field: 'counts',
        name: '数量',
        type: 'string',
      },
    ],
    rows: [
      {
        name: '北京',
        counts: 9,
      },
      {
        name: '天津',
        counts: 93,
      },
      {
        name: '新疆维吾尔族自治区',
        counts: 90,
      },
      {
        name: '宁夏回族自治区',
        counts: 144,
      },
    ],
    deviceType: [],
    devceList: [],
  },
  effects: {
    *distributionMap({ payload }, { select, call, put }) {
      const res = yield call(getDistributionMap, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'save',
          data,
        });
      }
    },
    *populationData({ payload }, { call, put }) {
      const res = yield call(getPopulation, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'save',
          data,
        });
      }
    },
    // 首页下拉多选
    *getDeviceTypeList({ payload }, { call, put }) {
      const res = yield call(getDeviceType, payload);
      let { data } = res;
      if (res.data) {
        yield put({
          type: 'deviceList',
          data,
        });
      }
    },
    *getMapDeviceAll({ payload }, { call, put }) {
      const res = yield call(getMapDevice, payload);
      let { data } = res;
      if (res.data) {
        yield put({
          type: 'mapDevceList',
          data,
        });
      }
    },
  },
  reducers: {
    save(state, payload) {
      return { ...state, rows: payload.data };
    },
    deviceList(state, payload) {
      return { ...state, deviceType: payload.data };
    },
    mapDevceList(state, payload) {
      return { ...state, devceList: payload.data };
    },
  },
};
