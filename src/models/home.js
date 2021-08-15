import Api from 'services';

const {
  getCommunitys,
  getStatistics,
  getStatistic,
  getCommunitySurvey,
  getUnitTreeByCommunity,
  getFloorHouseListByUnit,
  getImportantHouseCollection,
  getUnitSummary,
  getHouseSummary,
  getWorkbench,
  getVillageTree,
  getPersonListByHouse,
  getIndexCount,
  getIndexData,
  setRegisterHandle,
  getOldCount,
  userAddVillage,
  getUserAddvillage,
  getFlowWeek,
  getMenuTree,
  getWorkTypeCount,
  getPersonAddress,
} = Api;

export default {
  namespace: 'home',
  state: {
    communitys: [],
    personList: {},
    workbenchList: {},
    warningList: {},
    statistic: [],
    communitysPage: 0,
    communitySurvey: {},
    unitTree: [],
    unitHouseList: [],
    floorHouseList: [],
    importantHouseCollection: [],
    unitSummary: {},
    villageBuildUnitInfo: {},
    houseSummary: {},
    center: { latitude: 120.69928, longitude: 27.99358 },
    villageTree: [],
    treeShow: false,
    keyType: false,
    parentKeys: [],
    indexCount: {},
    indexData: {},
    oldCount: {},
    oldContent: {},
    flowWeek: {},
    selectVillage: null,
    getMenuTree: null,
    indexContent: {},
    page: 0,
    workTypeCount: {},
    historyTypeCount: {},
    address: [],
    controlDetail: {},
    jobEchartData: {},
    jobCompleteData: [],
  },
  effects: {
    // 社区查询接口
    *getCommunitys({ payload }, { call, put }) {
      const res = yield call(getCommunitys, payload);
      yield put({
        type: 'updateCommunitys',
        payload: res.data.list || [],
      });
      if (res.data) {
        yield put({
          type: 'setMapCenter',
          payload: res.data.list.content[0] || {},
        });
      }
    },

    // 首页数据统计接口
    *getStatistic({ payload }, { call, put }) {
      const res = yield call(getStatistic);
      yield put({
        type: 'updateStatistic',
        payload: res.data || {},
      });
    },

    // 首页数据统计接口
    *getCommunitySurvey({ payload }, { call, put }) {
      const res = yield call(getCommunitySurvey, payload);
      let newData = res.data;
      if (newData) {
        res.data.personAgeFbsFormat.lists.forEach(item => {
          if (item.ageRange === 'unknown') {
            item.ageRange = '未知';
          } else if (item.ageRange === '81-') {
            item.ageRange = '81岁以上';
          } else {
            item.ageRange = item.ageRange + '岁';
          }
          return item;
        });
      }
      yield put({
        type: 'updateCommunitySurvey',
        payload: res.data || {},
      });
    },

    // 单元树状图查询接口
    *getUnitTreeByCommunity({ payload }, { call, put }) {
      const res = yield call(getUnitTreeByCommunity, payload);
      yield put({
        type: 'updateUnitTree',
        payload: res.data || [],
      });
    },

    // 小区树状查询接口
    *getVillageTree({ payload }, { call, put }) {
      const res = yield call(getVillageTree, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setVillageTree',
          data: data || [],
        });
      }
    },

    // 按钮权限接口
    *getMenuTree({ _ }, { call, put, select }) {
      const res = yield call(getMenuTree);
      const { data } = res;
      if (data) {
        yield put({
          type: 'getMenuTree',
          data: data || [],
        });
      }
    },

    // 社区单元房屋概况查询接口
    *getFloorHouseListByUnit({ payload }, { call, put }) {
      const res = yield call(getFloorHouseListByUnit, payload);
      yield put({
        type: 'updateUnitHouseList',
        payload: res.data || [],
      });
    },

    // 社区单元楼层房屋概况查询接口
    *getFloorHouseListByFloor({ payload }, { call, put }) {
      const res = yield call(getFloorHouseListByUnit, payload);
      yield put({
        type: 'updateFloorHouseList',
        payload: res.data || [],
      });
    },

    // 社区单元重点房屋概况查询接口
    *getImportantHouseCollection({ payload }, { call, put }) {
      const res = yield call(getImportantHouseCollection, payload);
      yield put({
        type: 'updateImportantHouseCollection',
        payload: res.data || [],
      });
    },

    // 社区画像概况查询接口
    *getUnitSummary({ payload }, { call, put }) {
      const res = yield call(getUnitSummary, payload);
      yield put({
        type: 'updateUnitSummary',
        payload: res.data || [],
      });
    },

    *getHouseSummary({ payload }, { call, put }) {
      const res = yield call(getHouseSummary, payload);
      yield put({
        type: 'updateHouseSummary',
        payload: res.data || [],
      });
    },
    // 房屋信息标签修改
    *getHouseTag({ payload }, { put }) {
      yield put({
        type: 'setHouseTag',
        data: payload,
      });
    },
    *getWorkbench({ payload }, { call, put }) {
      const res = yield call(getWorkbench, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setWorkbenchList',
          data,
        });
      }
    },

    *getPersonListByHouse({ payload }, { call, put, select }) {
      const res = yield call(getPersonListByHouse, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setPersonList',
          data,
        });
      }
    },

    // 首页剩余工作统计
    *getIndexCount({ payload }, { call, put, select }) {
      const res = yield call(getIndexCount, payload);
      const { indexContent } = yield select(_ => _.home);
      let { data } = res;

      if (data) {
        let content = [];
        if (data.first) {
          content = data.content;
        } else {
          content = indexContent.concat(data.content);
        }
        let communitysPage;
        if (payload && payload.communitysPage === 1) {
          communitysPage = 1;
        } else {
          communitysPage = 0;
        }

        yield put({
          type: 'setIndexCount',
          data,
          content: content,
          communitysPage,
        });
      }
    },
    // 首页历史记录工作统计
    *getHistoryCount({ payload }, { call, put, select }) {
      const res = yield call(getOldCount, payload);
      const { oldContent } = yield select(_ => _.home);
      let { data } = res;
      if (data) {
        let content = [];
        if (data.first) {
          content = data.content;
        } else {
          content = oldContent.concat(data.content);
          // doorList = state.doorList.concat(data.content);
        }

        let communitysPage;
        if (payload && payload.communitysPage === 1) {
          communitysPage = 1;
        } else {
          communitysPage = 0;
        }
        yield put({
          type: 'setHistoryCount',
          data,
          content: content,
          communitysPage,
        });
      }
    },
    // //首页剩余工作类型数量
    *getWorkTypeCount({ payload }, { call, put }) {
      const res = yield call(getWorkTypeCount, payload);
      if (res.data) {
        yield put({
          type: 'setWorkTypeCount',
          data: res.data,
        });
      }
    },

    *getIndexData({ _ }, { call, put }) {
      const res = yield call(getIndexData);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setIndexData',
          data,
        });
      }
    },
    *getOldCount({ payload }, { call, put }) {
      const res = yield call(getOldCount, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setOldCount',
          data,
        });
      }
    },

    *getFlowWeek({ _ }, { call, put }) {
      const res = yield call(getFlowWeek);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setFlowWeek',
          data,
        });
      }
    },

    *getRegisterHandle({ payload }, { call, put, select }) {
      const res = yield call(setRegisterHandle, payload);
      return res;
    },

    *userAddVillage({ payload }, { call }) {
      const res = yield call(userAddVillage, payload);
      return res;
    },

    *getUserAddvillage({ payload }, { call, put }) {
      const res = yield call(getUserAddvillage, payload);
      return res;
    },

    *getPersonAddress({ payload }, { call, put }) {
      const res = yield call(getPersonAddress, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setPersonAddress',
          data,
        });
      }
    },
    // 工作台图表
    *getJobEchart({ payload }, { call, put }) {
      const { data } = yield call(getStatistics, payload);

      if (data) {
        // let children = [];
        let obj = {
          organizationName: [],
          implementationCount: [],
          registerCount: [],
          useFullCount: [],
          errCount: [],
        };
        if (data.children.length) {
          data.children.forEach(item => {
            let organizationName = item.organizationName;

            if (item.organizationName && item.organizationName.search('派出所') !== -1) {
              organizationName = item.organizationName.replace('派出所', '');
            }

            obj.organizationName.push(organizationName);
            obj.errCount.push(item.errCount);
            obj.implementationCount.push(item.implementationCount);
            obj.registerCount.push(item.registerCount);
            obj.useFullCount.push(item.useFullCount);
          });
        }
        yield put({
          type: 'setJobEchart',
          obj,
          data,
        });
      }
    },
  },
  reducers: {
    updateCommunitys(state, { payload }) {
      return { ...state, communitys: payload };
    },
    setControlDetail(state, { payload }) {
      return { ...state, controlDetail: payload };
    },
    // 设置页数存储
    setPage(state, { payload }) {
      return { ...state, page: payload.page, result: payload.result };
    },
    updateStatistic(state, { payload }) {
      return { ...state, statistic: payload };
    },

    updateCommunitySurvey(state, { payload }) {
      return { ...state, communitySurvey: payload };
    },

    setVillageBuildUnitInfo(state, { payload }) {
      return { ...state, villageBuildUnitInfo: payload };
    },

    setSelectVillage(state, { payload }) {
      return { ...state, selectVillage: payload || {} };
    },

    updateUnitTree(state, { payload }) {
      return { ...state, unitTree: payload };
    },

    updateUnitHouseList(state, { payload }) {
      return { ...state, unitHouseList: payload };
    },

    updateFloorHouseList(state, { payload }) {
      return { ...state, floorHouseList: payload };
    },

    updateImportantHouseCollection(state, { payload }) {
      return { ...state, importantHouseCollection: payload };
    },

    updateUnitSummary(state, { payload }) {
      return { ...state, unitSummary: payload };
    },

    updateHouseSummary(state, { payload }) {
      return { ...state, houseSummary: payload, address: payload.address };
    },
    setWorkbenchList(state, { data }) {
      return { ...state, workbenchList: data };
    },

    setMapCenter(state, { payload }) {
      return { ...state, center: { latitude: payload.latitude, longitude: payload.longitude } };
    },

    setVillageTree(state, { data }) {
      return { ...state, villageTree: data };
    },

    setTreeShow(state, { payload }) {
      return { ...state, treeShow: payload };
    },
    setTreeType(state, { payload }) {
      return { ...state, keyType: payload.type, parentKeys: payload.parentKeys };
    },

    setPersonList(state, { data }) {
      return { ...state, personList: data };
    },

    setIndexCount(state, { data, content, communitysPage }) {
      return { ...state, indexCount: data, indexContent: content, communitysPage };
    },
    cancelIndexCount(state, { _ }) {
      return {
        ...state,
        indexContent: [],
        oldContent: [],
        indexCount: { content: [], totalElements: 0 },
        oldCount: { content: [], totalElements: 0 },
      };
    },

    setIndexData(state, { data }) {
      return { ...state, indexData: data };
    },
    setOldCount(state, { data }) {
      return { ...state, oldCount: data };
    },
    setHistoryCount(state, { data, content, communitysPage }) {
      return { ...state, oldContent: content, oldCount: data, communitysPage };
    },
    setFlowWeek(state, { data }) {
      return { ...state, flowWeek: data };
    },
    setMenuTree(state, { data }) {
      return { ...state, getMenuTree: data };
    },

    setHistoryTypeCount(state, { data }) {
      return { ...state, historyTypeCount: data };
    },
    setWorkTypeCount(state, { data }) {
      return { ...state, workTypeCount: data };
    },

    setPersonAddress(state, { data }) {
      return { ...state, address: data };
    },
    setHouseTag(state, { data }) {
      return { ...state, houseSummary: data };
    },
    setJobEchart(state, { obj, data }) {
      return { ...state, jobEchartData: obj, jobCompleteData: data };
    },
  },
};
