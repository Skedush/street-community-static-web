import Api from 'services';
let { menuQuery, menuDelete, menuUpdate, menuAdd, menuCollection } = Api;

export default {
  namespace: 'menuManagement',
  state: {
    tableData: {
      totalElements: 0,
    },
    menuData: [],
  },
  effects: {
    *menuGet({ payload }, { call, put, select }) {
      const res = yield call(menuQuery, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'setTableData',
          data,
        });
      }
    },

    *menuAdd({ payload }, { call, put, select }) {
      const res = yield call(menuAdd, payload); // 请求后台，获取返回的数据
      return res;
    },

    *menuUpdate({ payload, queryData }, { call, put, select }) {
      const res = yield call(menuUpdate, payload); // 请求后台，获取返回的数据
      return res;
    },

    *menuDelete({ payload, queryData, reSetSelected }, { call, put, select }) {
      const res = yield call(menuDelete, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        reSetSelected();
        queryData.page = 0;
        yield put({
          type: 'menuGet',
          payload: queryData,
        });
      }
      return res;
    },

    *menuAllGet({ _ }, { call, put, select }) {
      //   const num = yield select((state) => state.testPage.num) //取命名空间为testPage的model的state里的num
      const res = yield call(menuCollection); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'setMenuData',
          data,
        });
      }
    },
  },
  reducers: {
    setTableData(state, { data }) {
      return { ...state, tableData: data };
    },

    setMenuData(state, { data }) {
      return { ...state, menuData: data };
    },
  },
  subscriptions: {
    setupUserList({ dispatch, history, query, store }) {
      return history.listen(({ pathname, search }) => {});
    },
  },
};
