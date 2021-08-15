import api from 'api';

const { getTaskCenterType } = api;

export default {
  namespace: 'zhianModel',
  state: {
    taskCenterType: [],
  },

  effects: {
    *getTaskCenterType({ payload }, { call, put }) {
      const res = yield call(getTaskCenterType, payload);
      if (res.data) {
        yield put({
          type: 'setTaskCenterType',
          data: res.data,
        });
      }
    },
  },
  reducers: {
    setTaskCenterType(state, { data }) {
      return { ...state, taskCenterType: data };
    },
  },
};
