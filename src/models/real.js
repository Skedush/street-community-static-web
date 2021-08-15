import Api from 'services';
// import { isEqual } from 'lodash';
import { saveAs } from 'file-saver';
import { dateTime } from '@/utils';

let {
  getHouseholdList,
  getImportantPerson,
  getCompanyList,
  getCompanyPersonList,
  getHouseList,
  getImportantHouseList,
  getPersonListByHouse,
  getCarList,
  getPoliceList,
  getCompanyPowerDetailList,
  getCourierList,
  getHouseholdExport,
  // updatePersonRegister,
  getTake,

  getPersonTag,
  getVideoCircle,
  getHouseTag,
} = Api;
export default {
  namespace: 'realModel',
  state: {
    householdList: {},
    importantPersonList: {},
    companyList: {},
    companyPersonList: {},
    houseList: {},
    personList: {},
    importantHouseList: {},
    carList: {},
    policeList: {},
    communityLeaderList: {},
    propertyList: {},
    securityList: {},
    courierList: {},
    volunteerList: {},
    takeList: {},
    carListTrue: {},
    personTagData: [],
    videoCircle: [],
    childrenVideo: [],
    searchVideo: [],
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

    *getImportantPerson({ payload }, { call, put, select }) {
      const res = yield call(getImportantPerson, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setImportantPersonList',
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

    *getVehicleDistribution({ payload }, { call, put, select }) {
      const res = yield call(getCarList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setCarList',
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

    *getCompanyPowerDetailList({ payload }, { call, put, select }) {
      const res = yield call(getCompanyPowerDetailList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setPropertyList',
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

    *getTakeList({ payload }, { call, put }) {
      const res = yield call(getTake, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setTakeList',
          data,
        });
      }
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
    // 房屋标签多选
    *getHouseTag({ payload }, { call, put }) {
      const res = yield call(getHouseTag, payload);
      if (res.data) {
        yield put({
          type: 'setHouseTag',
          data: res.data,
        });
      }
    },

    // 搜索视频监控点
    *getSearchVideo({ payload }, { call, put }) {
      const res = yield call(getVideoCircle, payload);
      // const { data } = res;
      if (res.data) {
        yield put({
          type: 'setSearchVideo',
          data: res.data,
          payload: payload,
          // newData: data,
        });
        // if (data.length > 0) {
        return res;
        // }
      }
    },

    // 实有人口导出
    *getHouseholdExport({ payload }, { call, put }) {
      const res = yield call(getHouseholdExport, payload, { responseType: 'blob', timeout: 90000 });
      if (res.success && res.data.size > 100) {
        const date = dateTime(Date.parse(new Date()));
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        saveAs(blob, `实有人口-${date}.xls`);
      }
      return res;
    },
  },

  reducers: {
    setSearchVideo(state, { data, payload }) {
      if (payload.mpName === '' || !payload.mpName) {
        return { ...state, searchVideo: [] };
      } else {
        return { ...state, searchVideo: data };
      }
    },

    setPersonTag(state, { data }) {
      return { ...state, personTagData: data };
    },
    setHouseTag(state, { data }) {
      return { ...state, houseTagData: data };
    },
    setHouseholdList(state, { data }) {
      return { ...state, householdList: data };
    },

    setImportantPersonList(state, { data }) {
      return { ...state, importantPersonList: data };
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
    setCarList(state, { data }) {
      return { ...state, carList: data };
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
    setTakeList(state, { data }) {
      return { ...state, takeList: data };
    },

    setCarListTrue(state, { data }) {
      return { ...state, carListTrue: data };
    },
  },
};
