import Api from 'services';

let {
  getHouseholdList,
  getCompanyList,
  getCompanyPersonList,
  getHouseList,
  getImportantHouseList,
  getPersonListByHouse,
  getPoliceList,
  getCourierList,
  getOldManList,
  getSetting,
  getRegisterList,
  setRegisterHandle,
  getPersonTag,
  getImportance,
} = Api;
export default {
  namespace: 'workModel',
  state: {
    householdList: {},
    oldManList: {},
    companyList: {},
    companyPersonList: {},
    houseList: {},
    personList: {},
    importantHouseList: {},
    policeList: {},
    communityLeaderList: {},
    propertyList: {},
    securityList: {},
    courierList: {},
    volunteerList: {},
    timeList: [],
    ruleList: {},
    registerPersonList: {},
    personTagData: [],
    importanceData: [],
  },
  effects: {
    *getHouseholdList({ payload }, { call, put, select }) {
      const res = yield call(getHouseholdList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setHouseholdList',
          data,
        });
      }
    },

    // 老人关怀
    *getOldManLists({ payload }, { call, put, select }) {
      const res = yield call(getOldManList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setOldManList',
          data,
        });
      }
    },

    *getTimeList({ payload }, { call, put, select }) {
      const res = yield call(getSetting, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setTimeList',
          data,
        });
      }
    },

    *getHouseList({ payload }, { call, put, select }) {
      const res = yield call(getHouseList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setHouseList',
          data,
        });
      }
    },

    *getImportantHouseList({ payload }, { call, put, select }) {
      const res = yield call(getImportantHouseList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setImportantHouseList',
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

    *getCompanyList({ payload }, { call, put, select }) {
      const res = yield call(getCompanyList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setCompanyList',
          data,
        });
      }
    },

    *getCompanyPersonList({ payload }, { call, put, select }) {
      const res = yield call(getCompanyPersonList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setCompanyPersonList',
          data,
        });
      }
    },

    *getPoliceList({ payload }, { call, put, select }) {
      const res = yield call(getPoliceList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setPoliceList',
          data,
        });
      }
    },

    *getCourierList({ payload }, { call, put, select }) {
      const res = yield call(getCourierList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setCourierList',
          data,
        });
      }
    },

    *getRegisterPersonList({ payload }, { call, put, select }) {
      const res = yield call(getRegisterList, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setRegisterPersonList',
          data,
        });
      }
    },

    *getRegisterHandle({ payload }, { call, put, select }) {
      const res = yield call(setRegisterHandle, payload);
      return res;
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

    // 重点人员列表
    *getImportance({ payload }, { call, put }) {
      const res = yield call(getImportance, payload);
      if (res.data) {
        yield put({
          type: 'setImportance',
          data: res.data,
        });
        return res.data;
      }
    },
  },

  reducers: {
    setPersonTag(state, { data }) {
      return { ...state, personTagData: data };
    },

    setImportance(state, { data }) {
      return { ...state, importanceData: data };
    },

    setHouseholdList(state, { data }) {
      return { ...state, householdList: data };
    },

    setPersonRegister(state, { data }) {
      return { ...state, personRegisterList: data };
    },

    setOldManList(state, { data }) {
      return { ...state, oldManList: data };
    },

    setHouseList(state, { data }) {
      return { ...state, houseList: data };
    },

    setImportantHouseList(state, { data }) {
      return { ...state, importantHouseList: data };
    },

    setPersonList(state, { data }) {
      return { ...state, personList: data };
    },

    setCompanyList(state, { data }) {
      return { ...state, companyList: data };
    },

    setCompanyPersonList(state, { data }) {
      return { ...state, companyPersonList: data };
    },

    setPoliceList(state, { data }) {
      return { ...state, policeList: data };
    },

    setCommunityLeaderList(state, { data }) {
      return { ...state, communityLeaderList: data };
    },

    setPropertyList(state, { data }) {
      return { ...state, propertyList: data };
    },

    setSecurityList(state, { data }) {
      return { ...state, securityList: data };
    },

    setCourierList(state, { data }) {
      return { ...state, courierList: data };
    },

    setVolunteerList(state, { data }) {
      return { ...state, volunteerList: data };
    },

    setTimeList(state, { data }) {
      return { ...state, timeList: data };
    },

    setRuleList(state, { data }) {
      return { ...state, ruleList: data };
    },

    setRegisterPersonList(state, { data }) {
      return { ...state, registerPersonList: data };
    },
  },
};
