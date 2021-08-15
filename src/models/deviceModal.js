import Api from 'services';
import { saveAs } from 'file-saver';
import { message } from 'antd';
import moment from 'moment';
let {
  getDeviceList,
  // getDeviceCollection,
  getCarRecordListTrue,
  getVisitorRecordList,
  getAccessControlRecordListTrue,
  getArea,
  exportDeviceList,
} = Api;
export default {
  namespace: 'deviceModel',
  state: {
    deviceList: {},
    deviceCollection: {},
    carRecordList: {},
    accessControlRecordList: {},
    visitorRecordList: {},
    area: [],
  },
  effects: {
    *exportDeviceList({ payload }, { call, put, select }) {
      const res = yield call(exportDeviceList, payload, { responseType: 'blob', timeout: 80000 });
      if (res.success) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        const date = moment().format('YYYYMMDDHHmm');
        message.success('导出成功');
        saveAs(blob, `实有设备列表-${date}.xlsx`);
      }
    },
    *getDeviceList({ payload }, { call, put, select }) {
      const res = yield call(getDeviceList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setDeviceList',
          data,
        });
      }
    },

    *getCarRecordListTrue({ payload }, { call, put, select }) {
      const res = yield call(getCarRecordListTrue, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setCarRecordList',
          data,
        });
      }
    },

    *getAccessControlRecordListTrue({ payload }, { call, put, select }) {
      const res = yield call(getAccessControlRecordListTrue, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setAccessControlRecordList',
          data,
        });
      }
    },

    *getVisitorRecordList({ payload }, { call, put, select }) {
      const res = yield call(getVisitorRecordList, payload);
      let { data } = res;
      if (data) {
        yield put({
          type: 'setVisitorRecordList',
          data,
        });
      }
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
    setArea(state, { data }) {
      return { ...state, area: data };
    },
    setDeviceList(state, { data }) {
      return { ...state, deviceList: data };
    },
    setDeviceCollection(state, { data }) {
      return { ...state, deviceCollection: data };
    },
    setCarRecordList(state, { data }) {
      return { ...state, carRecordList: data };
    },

    setAccessControlRecordList(state, { data }) {
      return { ...state, accessControlRecordList: data };
    },
    setVisitorRecordList(state, { data }) {
      return { ...state, visitorRecordList: data };
    },
    setSelectVillage(state, { data }) {
      return { ...state, selectVillage: data };
    },
    setAccessControlRecordListTrue(state, { data }) {
      return { ...state, accessControlRecordListTrue: data };
    },
  },
};
