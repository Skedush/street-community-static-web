import Api from '@/services';

const { getVillageOnlineDetail, getVillageOnlinePage, updateVillageOnline } = Api;

export default {
  namespace: 'villageOnline',
  state: {
    villageOnlineDetail: {
      id: 0,
      code: 'string',
      name: 'string',
      provinceId: 0,
      cityId: 0,
      countyId: 0,
      address: ['string'],
      policeOrganizationId: 0,
    },
    villageOnlinePageData: {
      content: [],
    },
  },
  effects: {
    *getVillageOnlineDetail({ payload }, { call, put }) {
      const res = yield call(getVillageOnlineDetail, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'updateState',
          payload: { villageOnlineDetail: data },
        });
        yield put({
          type: 'communityManagement/getCityList',
          payload: { parentId: data.provinceId },
        });
        yield put({
          type: 'communityManagement/getCountyList',
          payload: { parentId: data.cityId },
        });

        yield put({
          type: 'communityManagement/getPoliceList',
          payload: { countyId: data.countyId },
        });
      }
      return res;
    },
    *getVillageOnlinePage({ payload }, { call, put }) {
      const res = yield call(getVillageOnlinePage, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'updateState',
          payload: { villageOnlinePageData: data },
        });
      }
      return res;
    },
    *updateVillageOnline({ payload }, { call, put }) {
      const res = yield call(updateVillageOnline, payload);
      return res;
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
