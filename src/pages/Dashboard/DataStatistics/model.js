import Api from 'services';

const {
  getScreenDeviceStatusStatistic,
  getScreenDeviceRecord,
  getScreenBasic,
  getEventGrowingStatistics,
  getScreenEventStatistics,
  getEventPendingPage,
  getCommunityVillageList,
  getVillageStatistics,
  getCommunityStatistics,
} = Api;

export default {
  namespace: 'dataStatistics',
  state: {
    deviceRecord: {},
    deviceStatusStatistic: {},
    screenBasic: {},
    eventGrowing: {},
    eventStatistics: {},
    eventPage: [],
    villageList: [],
    villageStatistics: {},
    communityStatistics: {},
    view: 'community',
  },
  effects: {
    *getScreenDeviceRecord({ payload }, { call, put }) {
      const res = yield call(getScreenDeviceRecord);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { deviceRecord: res.data },
        });
      }
    },
    *getScreenDeviceStatusStatistic({ payload }, { call, put }) {
      const res = yield call(getScreenDeviceStatusStatistic);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { deviceStatusStatistic: res.data },
        });
      }
    },
    *getScreenBasic({ payload }, { call, put }) {
      const res = yield call(getScreenBasic);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { screenBasic: res.data },
        });
      }
    },
    *getEventGrowingStatistics({ payload }, { call, put }) {
      const res = yield call(getEventGrowingStatistics);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { eventGrowing: res.data },
        });
      }
    },
    *getScreenEventStatistics({ payload }, { call, put }) {
      const res = yield call(getScreenEventStatistics, payload);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { eventStatistics: res.data },
        });
      }
    },
    *getEventPendingPage({ payload }, { call, put }) {
      const res = yield call(getEventPendingPage, payload);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { eventPage: res.data },
        });
      }
      return res;
    },
    *getCommunityVillageList({ payload }, { call, put }) {
      const res = yield call(getCommunityVillageList, payload);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { villageList: res.data },
        });
      }
    },

    *getVillageStatistics({ payload }, { call, put }) {
      const res = yield call(getVillageStatistics, payload);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { villageStatistics: res.data },
        });
      }
    },

    *getCommunityStatistics({ payload }, { call, put }) {
      const res = yield call(getCommunityStatistics, payload);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: { communityStatistics: res.data },
        });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
