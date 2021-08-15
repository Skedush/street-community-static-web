import Api from 'services';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { message } from 'antd';
let { getLoginLog, getOperateLog, exportLoginLog, exportOperateLog } = Api;
export default {
  namespace: 'logManagement',
  state: {
    loginLog: {},
    operateLog: {},
  },
  effects: {
    *getLoginLog({ payload }, { call, put, select }) {
      const res = yield call(getLoginLog, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'setLoginLog',
          data,
        });
      }
    },

    *getOperateLog({ payload }, { call, put, select }) {
      const res = yield call(getOperateLog, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'setOperateLog',
          data,
        });
      }
    },

    *exportLoginLog({ payload }, { call, put, select }) {
      const res = yield call(exportLoginLog, payload, { responseType: 'blob', timeout: 80000 });
      if (res.success) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        const date = moment().format('YYYYMMDDHHmm');
        message.success('导出成功');
        saveAs(blob, `登录日志-${date}.xlsx`);
      }
    },

    *exportOperateLog({ payload }, { call, put, select }) {
      const res = yield call(exportOperateLog, payload, { responseType: 'blob', timeout: 80000 });
      if (res.success) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        const date = moment().format('YYYYMMDDHHmm');
        message.success('导出成功');
        saveAs(blob, `系统日志-${date}.xlsx`);
      }
    },
  },
  reducers: {
    setLoginLog(state, { data }) {
      return { ...state, loginLog: data };
    },

    setOperateLog(state, { data }) {
      return { ...state, operateLog: data };
    },
  },
};
