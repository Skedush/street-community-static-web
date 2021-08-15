import Api from 'services';

let { getPersonTag, getCascade } = Api;
export default {
  namespace: 'warningModileModel',
  state: {
    controlList: {},
    personTagData: [],
    libraryConnect: null,
    newConnect: [],
    policeFirst: [],
  },
  effects: {
    *getNewConnect({ payload }, { call, put }) {
      if (payload) {
        yield put({
          type: 'setNewConnect',
          data: payload,
        });
      }
    },
    // 清空机构缓存
    *delCascade({ payload }, { call, put }) {
      yield put({
        type: 'setPoliceFirst',
        data: [],
      });
    },
    // 组织机构查询
    *getCascade({ payload }, { call, put, select }) {
      const resp = yield call(getCascade, payload); // 请求后台，获取返回的数据
      const data = resp.data;
      let isRoot = true;
      data.map((item, index) => {
        if (item.level === 3) {
          item.isLeaf = true;
          isRoot = false;
        }
        if (item.level === 2) {
          item.isLeaf = false;
        }
      });

      const policeFirst1 = yield select(state => state);
      const lengthFirst = policeFirst1.warningModileModel.policeFirst;
      if (lengthFirst.length !== data.length && isRoot) {
        if (data) {
          yield put({
            type: 'setPoliceFirst',
            data,
          });
        }
      }
      return data;
    },

    // 人员标签多选
    *getPersonTag({ payload }, { call, put }) {
      const res = yield call(getPersonTag, payload);
      if (res.data) {
        yield put({
          type: 'setPersonTag',
          data: res.data,
        });
      }
    },

    // 清空关联信息
    *resetLibarayConnect({ payload }, { put }) {
      yield put({
        type: 'delLibarayConnect',
      });
    },
  },

  reducers: {
    setNewConnect(state, { data }) {
      return { ...state, newConnect: data };
    },
    // 组织机构查询
    setPoliceFirst(state, { data }) {
      return { ...state, policeFirst: data };
    },
    // 清空关联信息
    delLibarayConnect(state) {
      return { ...state, libraryConnect: [], newConnect: [] };
    },
    setPersonTag(state, { data }) {
      return { ...state, personTagData: data };
    },

    setLibraryConnect(state, { data }) {
      return { ...state, libraryConnect: data };
    },
  },
};
