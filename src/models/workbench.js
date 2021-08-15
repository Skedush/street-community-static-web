import Api from '@/services';
// import store from 'store';

const {
  getCommunitys,
  getVillageTop,
  getIndexData,
  getPoliceOrgTree,
  getBringRecord,
  villageAnalyzeInfo,
} = Api;

export default {
  namespace: 'workbench',

  state: {
    villageList: {},
    curCommunityInfo: { id: 0, name: '' },
    center: { latitude: null, longitude: null },
    policeOrgTree: [],
    count: '',
    communitysPage: 0,
    searchValue: '',
    policeId: '',
    communitysLevel: '',

    bringRecord: '',
  },
  effects: {
    // 小区
    *getCommunitys({ payload }, { call, put }) {
      const res = yield call(getCommunitys, payload);

      let communitysPage;
      if (payload.communitysPage === 1) {
        communitysPage = 1;
      } else {
        communitysPage = 0;
      }
      if (res && res.data) {
        const { data } = res;
        const { list } = data;
        yield put({
          type: 'setCommunitys',
          list,
          data,
          communitysPage: communitysPage,
        });
        return list;
      }

      // 地图点位
      // if (data) {
      //   yield put({
      //     type: 'setMapCenter',
      //     payload: data.list.content[0] || {},
      //   });
      // }
    },

    // 小区置顶
    *getVillageTop({ payload }, { call, put }) {
      const res = yield call(getVillageTop, payload);
      return res;
    },

    // 小区统计
    *getIndexData({ payload }, { call, put }) {
      const res = yield call(getIndexData, payload);
      return res;
    },

    // 小区辖区
    *getPoliceOrgTree({ _ }, { call, put }) {
      const res = yield call(getPoliceOrgTree);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setPoliceOrgTree',
          data,
        });
      }
    },

    // *getButtonUse({ _ }, { call, put }) {
    //   const res = yield call(getButtonUse);
    //   const { data } = res;
    //   if (data) {
    //     yield put({
    //       type: 'setButtonUse',
    //       data,
    //     });
    //   }
    // },
    // 首页采集记录接口
    *getBringRecord({ payload }, { call, put }) {
      const res = yield call(getBringRecord, payload);
      if (res.data) {
        yield put({
          type: 'setBringRecord',
          data: res.data,
        });
      }
    },
    *getVillageInfo({ payload }, { call, put }) {
      const { data } = yield call(villageAnalyzeInfo, payload);
      return data;
    },
  },
  reducers: {
    // setButtonUse(state, { data }) {
    //   return { ...state, buttonUse: data };
    // },
    setCommunitysData(state, { payload }) {
      return {
        ...state,
        searchValue: payload.searchValue || null,
        policeId: payload.policeId || null,
        communitysLevel: payload.communitysLevel || null,
      };
    },
    setCommunitys(state, { list, data, communitysPage }) {
      let villageList = JSON.parse(JSON.stringify(list));
      if (list.first) {
        villageList.content = list.content;
      } else {
        villageList.content = state.villageList.content.concat(list.content);
      }
      return {
        ...state,
        villageList: villageList,
        count: data.count,
        communitysPage: communitysPage,
        // visitorTotalPages: data.totalPages,
        // vistorListSum: data.totalElements,
      };
    },

    setCurCommunityInfo(state, { payload }) {
      return { ...state, curCommunityInfo: payload || {} };
    },

    setMapCenter(state, { payload }) {
      return { ...state, center: { latitude: payload.latitude, longitude: payload.longitude } };
    },

    setPoliceOrgTree(state, { data }) {
      return { ...state, policeOrgTree: data };
    },
    setBringRecord(state, { data }) {
      return { ...state, bringRecord: data };
    },
  },
};
