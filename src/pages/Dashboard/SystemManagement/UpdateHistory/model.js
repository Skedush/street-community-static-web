import Api from 'services';

const { addVersionHistory } = Api;

export default {
  namespace: 'updateHistoryModel',
  state: {},
  effects: {
    *addVersionHistory({ payload }, { call, put, select }) {
      const res = yield call(addVersionHistory, payload); // 请求后台，获取返回的数据
      return res;
    },
  },
  reducers: {},
};
