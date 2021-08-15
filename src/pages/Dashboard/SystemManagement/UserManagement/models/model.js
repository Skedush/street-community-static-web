import Api from 'services';
import router from 'umi/router';
import { isEmpty } from 'lodash';
// import { getCascade } from '../../../../../../mock/cascade';
// import { query, select2 } from '@/services/test';
let {
  getUserList,
  addUser,
  deleteUser,
  updateUser,
  updateUserPassWord,
  getCascade,
  getResetPassword,
  getRoleType,
} = Api;
export default {
  namespace: 'userManagement',
  state: {
    tableData: {
      totalElements: 0,
    },
    policeData: [],
    policeFirst: [],
    num: 1,
    policeTwo: [],
    diff: [],
    roleType: [],
  },

  effects: {
    *getUserList({ payload }, { call, put, select }) {
      const res = yield call(getUserList, payload); // 请求后台，获取返回的数据
      const { data } = res;
      const policeFirst = [];
      if (data) {
        yield put({
          type: 'setTableData',
          data,
        });
      }
      yield put({
        type: 'setPoliceFirst',
        policeFirst,
      });
    },

    *addUser({ payload }, { call, put, select }) {
      const res = yield call(addUser, payload); // 请求后台，获取返回的数据
      let { success } = res;
      if (success) {
        router.goBack();
      }
      return res;
    },

    *updateUserPassWord({ payload }, { call, put, select }) {
      const res = yield call(updateUserPassWord, payload); // 请求后台，获取返回的数据
      return res;
    },

    *updateUser({ payload, queryData }, { call, put, select }) {
      const res = yield call(updateUser, payload); // 请求后台，获取返回的数据
      let { success } = res;
      if (success) {
        router.goBack();
      }
      return res;
    },

    *deleteUser({ payload, queryData, reSetSelected }, { call, put, select }) {
      const resp = yield call(deleteUser, payload); // 请求后台，获取返回的数据
      let { data } = resp;
      if (data) {
        reSetSelected();
        queryData.page = 0;
        yield put({
          type: 'getUserList',
          payload: queryData,
        });
      }
      return resp;
    },

    *getFirst({ payload }, { call, put }) {
      const data = payload.data;
      yield put({
        type: ' setPoliceFirst',
        data,
      });
    },

    *getCascade({ payload }, { call, put, select }) {
      const resp = yield call(getCascade, payload); // 请求后台，获取返回的数据
      let data = resp.data;
      if (data) {
        data.map((item, index) => {
          if (item.level === 3) {
            item.isLeaf = true;
          }
          if (item.level === 2) {
            item.isLeaf = false;
          }
        });

        const policeFirst1 = yield select(state => state);
        const lengthFirst = policeFirst1.userManagement.policeFirst;
        if (isEmpty(lengthFirst)) {
          if (data) {
            yield put({
              type: 'setPoliceFirst',
              data,
            });
          }
        }
      }

      return data;
    },

    *getResetPassword({ payload }, { call, put }) {
      const resp = yield call(getResetPassword, payload); // 请求后台，获取返回的数据
      if (resp.data) {
        return resp;
      }
    },
    *getRoleType({ payload }, { call, put }) {
      const resp = yield call(getRoleType, payload); // 请求后台，获取返回的数据
      if (resp.data) {
        // return resp.data;
        yield put({
          type: 'setRoleType',
          data: resp.data,
        });
      }
    },
  },
  reducers: {
    setRoleType(state, { data }) {
      return { ...state, roleType: data };
    },
    setPolicesData(state, { data }) {
      return { ...state, policeData: data };
    },

    setTableData(state, { data }) {
      return { ...state, tableData: data };
    },

    setPoliceFirst(state, { data }) {
      return { ...state, policeFirst: data };
    },

    setPoliceTwo(state, { data }) {
      return { ...state, policeTwo: data };
    },
  },
  subscriptions: {
    setupUserList({ dispatch, history, query, store }) {
      return history.listen(({ pathname, search }) => {});
    },
  },
};
