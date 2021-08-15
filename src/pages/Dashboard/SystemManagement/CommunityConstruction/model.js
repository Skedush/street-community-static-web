import { message } from 'antd';
import Api from 'services';
let { getVillagePlan, updateVillagePlan, getDeviceCount, updateDeviceCount } = Api;
export default {
  namespace: 'communityConstruction',
  state: {
    villagePlan: {},
    deviceCountData: { videoSurveillance: 0, smartSnapshot: 0 },
  },
  effects: {
    *getVillagePlan({ payload }, { call, put, select }) {
      const res = yield call(getVillagePlan, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'updateState',
          payload: { villagePlan: data },
        });
      }
    },
    *updateVillagePlan({ payload, queryData }, { call, put, select }) {
      const res = yield call(updateVillagePlan, payload); // 请求后台，获取返回的数据
      let { success } = res;
      if (success) {
        message.success('保存成功');
        yield put({
          type: 'getVillagePlan',
        });
      } else {
        message.error(res.message);
      }
    },
    *getDeviceCount({ payload }, { call, put, select }) {
      const res = yield call(getDeviceCount, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'updateState',
          payload: { deviceCountData: data },
        });
      }
    },
    *updateDeviceCount({ payload, queryData }, { call, put, select }) {
      const res = yield call(updateDeviceCount, payload); // 请求后台，获取返回的数据
      let { success } = res;
      if (success) {
        message.success('保存成功');
        yield put({
          type: 'getDeviceCount',
        });
      } else {
        message.error(res.message);
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
  subscriptions: {
    setupUserList({ dispatch, history, query, store }) {
      return history.listen(({ pathname, search }) => {});
    },
  },
};
