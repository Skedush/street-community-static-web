import Api from '@/services';

const {
  getVillage,
  addVillage,
  getDistrict,
  setImage,
  getPolice,
  getPolicePersonlist,
  getVillageDetailedInformation,
  getVillageUpdate,
  deleteVillage,
  getArea,
} = Api;

export default {
  namespace: 'communityManagement',
  state: {
    villageList: {},
    districtList: [],
    cityList: [],
    countyList: [],
    streetList: [],
    policeList: [],
    policePersonList: [],
    villageDetailedInfo: {},
    area: [],
    fields: [],
  },
  effects: {
    // 上传图片
    *setImageUrL({ payload }, { call, put }) {
      const res = yield call(setImage, payload);
      return res;
    },
    *getVillageList({ payload }, { call, put }) {
      const res = yield call(getVillage, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setVillageList',
          data,
        });
      }
    },
    *getAddVillage({ payload }, { call, put }) {
      const res = yield call(addVillage, payload);
      return res;
    },
    // 省
    *getDistrictList({ _ }, { call, put }) {
      const res = yield call(getDistrict);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setDistrictList',
          data,
        });
      }
    },
    // 市
    *getCityList({ payload }, { call, put }) {
      const res = yield call(getDistrict, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setCityList',
          data,
        });
      }
    },
    // 区县
    *getCountyList({ payload }, { call, put }) {
      const res = yield call(getDistrict, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setCountyList',
          data,
        });
      }
    },
    // 街道
    *getStreetList({ payload }, { call, put }) {
      const res = yield call(getDistrict, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setStreetList',
          data,
        });
      }
    },
    // 所属辖区
    *getPoliceList({ payload }, { call, put }) {
      const res = yield call(getPolice, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setPoliceList',
          data,
        });
      }
    },
    // 所属民警
    *getPolicePerson({ payload }, { call, put }) {
      const res = yield call(getPolicePersonlist, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setPolicePerson',
          data,
        });
      }
    },

    // 获取小区详细信息
    *getVillageDetailedInfo({ payload }, { call, put }) {
      const res = yield call(getVillageDetailedInformation, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setVillageDetailedInfo',
          data,
        });
        yield put({
          type: 'getCityList',
          payload: { parentId: data.provinceId },
        });
        yield put({
          type: 'getCountyList',
          payload: { parentId: data.cityId },
        });
        yield put({
          type: 'getStreetList',
          payload: { parentId: data.countyId, level: 4 },
        });
        yield put({
          type: 'getPoliceList',
          payload: { countyId: data.countyId },
        });
        yield put({
          type: 'getPolicePerson',
          payload: { policeOrgId: data.policeOrganizationId },
        });
        return data;
      }
    },
    // 小区更新
    *villageUpdate({ payload }, { call, put }) {
      const res = yield call(getVillageUpdate, payload);
      return res;
    },
    // 删除小区
    *deleteVillage({ payload }, { call, put }) {
      const res = yield call(deleteVillage, payload);
      return res;
    },

    *getArea({ payload }, { call, put }) {
      const res = yield call(getArea, payload);
      if (res.data) {
        yield put({
          type: 'setArea',
          data: res.data,
        });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setArea(state, { data }) {
      return { ...state, area: data };
    },

    setVillageList(state, { data }) {
      return { ...state, villageList: data };
    },
    setDistrictList(state, { data }) {
      return { ...state, districtList: data };
    },
    setCityList(state, { data }) {
      return { ...state, cityList: data };
    },
    setCountyList(state, { data }) {
      return { ...state, countyList: data };
    },
    setStreetList(state, { data }) {
      return { ...state, streetList: data };
    },
    setPoliceList(state, { data }) {
      return { ...state, policeList: data };
    },
    setPolicePerson(state, { data }) {
      return { ...state, policePersonList: data };
    },
    setVillageDetailedInfo(state, { data }) {
      return { ...state, villageDetailedInfo: data };
    },
    setRestVillageData(state, { data }) {
      return {
        ...state,
        countyList: [],
        streetList: [],
        policeList: [],
        policePersonList: [],
        cityList: [],
      };
    },
    // 清空辖区和辖区警察下拉框数据
    RestPoliceList(state, { data }) {
      return {
        ...state,
        policeList: [],
        policePersonList: [],
      };
    },
    // 清空辖区警察下拉框数据
    RestPolicePersonList(state, { data }) {
      return {
        ...state,
        policePersonList: [],
      };
    },
  },
};
