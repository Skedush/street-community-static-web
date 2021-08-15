import Api from 'services';
// import router from 'umi/router';
let { getDicList, addDic, updateDic, deleteDic } = Api;
export default {
  namespace: 'dictionaryManagement',
  state: {
    dicList: {},
  },
  effects: {
    *getDicList({ payload }, { call, put, select }) {
      const res = yield call(getDicList, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'setDicList',
          data,
        });
      }
    },
    *addDic({ payload }, { call, put, select }) {
      const res = yield call(addDic, payload); // 请求后台，获取返回的数据
      return res;
    },
    *updateDic({ payload, queryData }, { call, put, select }) {
      const res = yield call(updateDic, payload); // 请求后台，获取返回的数据
      return res;
    },
    *deleteDic({ payload, queryData, reSetSelected }, { call, put, select }) {
      const res = yield call(deleteDic, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        reSetSelected();
        queryData.page = 0;
        yield put({
          type: 'getDicList',
          payload: queryData,
        });
      }
      return res;
    },
  },
  reducers: {
    setDicList(state, { data }) {
      return { ...state, dicList: data };
    },
  },
  subscriptions: {
    setupUserList({ dispatch, history, query, store }) {
      return history.listen(({ pathname, search }) => {});
    },
  },
};
