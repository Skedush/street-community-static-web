import Api from 'services';

const { getCommunitys } = Api;

export default {
  namespace: 'mapUi',
  state: {
    communitys: [],
  },
  effects: {
    // 社区查询接口
    *getCommunitys({ payload }, { call, put }) {
      const res = yield call(getCommunitys, payload);
      yield put({
        type: 'updateCommunitys',
        payload: res.data.list || [],
      });
    },
  },
  reducers: {
    updateCommunitys(state, { payload }) {
      return { ...state, communitys: payload };
    },
  },
};
