import Api from 'services';

const { getType, getTagUpdate, getTagAdd, getDeletTag, getTagInfo, getTagCopy, getTagClear } = Api;

export default {
  namespace: 'tagManagementModel',
  state: {
    tabManagementInfo: {},
    typeObject: [],
    typeOrgin: [],
  },
  effects: {
    *delTag({ payload }, { call, put, select }) {
      const res = yield call(getDeletTag, payload); // 请求后台，获取返回的数据
      return res;
    },

    *getTagInfo({ payload }, { call, put }) {
      const res = yield call(getTagInfo, payload);

      if (res.data) {
        yield put({
          type: 'setSearchTag',
          payload: res.data || [],
        });
      }
    },

    *getTagCopy({ payload }, { call, put }) {
      const res = yield call(getTagCopy, payload);
      return res;
    },

    *getTagClear({ payload }, { call, put }) {
      const res = yield call(getTagClear, payload);
      return res;
    },

    *getTagAdd({ payload }, { call, put }) {
      const res = yield call(getTagAdd, payload);
      return res;
    },

    *getTagUpdate({ payload }, { call, put }) {
      const res = yield call(getTagUpdate, payload);
      return res;
    },
    *getType({ payload, putType }, { call, put, select }) {
      const res = yield call(getType, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: putType,
          data,
        });
      }
    },
  },
  reducers: {
    setSearchTag(state, { payload }) {
      return { ...state, tabManagementInfo: payload };
    },
    setObject(state, { data }) {
      return { ...state, typeObject: data };
    },
    setOrigin(state, { data }) {
      return { ...state, typeOrgin: data };
    },
  },
};
