import Api from 'services';
import moment from 'moment';
import { message } from 'antd';
import { saveAs } from 'file-saver';

let {
  exportVillageGateway,
  getVillageGatePage,
  getVillageGatewayDetail,
  getVillageGatewaySituationByDay,
} = Api;
export default {
  namespace: 'villageGateway',
  state: {
    villageGatewayData: {},
    villageGatewayDetail: undefined,
    villageGatewaySituation: undefined,
  },
  effects: {
    *getVillageGatePage({ payload }, { call, put }) {
      const res = yield call(getVillageGatePage, payload);
      if (res.data) {
        yield put({
          type: 'updateState',
          payload: { villageGatewayData: res.data },
        });
      }
      return res;
    },

    *getVillageGatewayDetail({ payload }, { call, put }) {
      const res = yield call(getVillageGatewayDetail, payload);
      if (res.data) {
        yield put({
          type: 'updateState',
          payload: { villageGatewayDetail: res.data },
        });
      }
      return res;
    },

    *getVillageGatewaySituationByDay({ payload }, { call, put }) {
      const res = yield call(getVillageGatewaySituationByDay, payload);
      if (res.data) {
        yield put({
          type: 'updateState',
          payload: { villageGatewaySituation: res.data },
        });
      }
      return res;
    },

    *exportVillageGateway({ payload }, { call }) {
      const res = yield call(exportVillageGateway, payload, { responseType: 'blob' });
      if (res.success) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        const date = moment().format('YYYYMMDDHHmm');
        message.success('导出成功');
        saveAs(blob, `小区网关-${date}.xlsx`);
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
  },
};
