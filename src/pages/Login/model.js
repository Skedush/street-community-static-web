import { router } from 'utils';
import store from 'store';
import api from 'api';

const { loginUser, getButtonUse } = api;

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select, all }) {
      const res = yield call(loginUser, payload);

      if (res.data) {
        const resButton = yield call(getButtonUse);
        const { indexMenuResps } = res.data;
        const routeList = indexMenuResps || [];
        const { cityId, userName, id, role, policeType } = res.data;
        store.set('userData', { userName, cityId, id, role, policeType, routeList });
        const { data } = resButton;
        store.set('buttonData', { buttonUse: data });

        yield all([
          put({
            type: 'app/updateState',
            payload: { routeList, cityId, userName, id, role },
          }),
          put({
            type: 'app/getPatterns',
          }),
          put({
            type: 'app/getProjectSystemName',
          }),
          put({
            type: 'commonModel/getVersionHistory',
          }),
          put({
            type: 'app/setRouteListStore',
            payload: routeList,
          }),
          put({
            type: 'app/setButtonUse',
            data,
          }),
        ]);

        router.push(indexMenuResps[0].defaultRoute);
        // router.push('/default');
      } else {
        throw res;
      }
    },
  },
};
