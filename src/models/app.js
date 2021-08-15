// import { stringify } from 'qs';
import store from 'store';
import { pathMatchRegexp, getPlatform, router } from 'utils';
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant';
// import Config from 'utils/config';
import api from 'api';
import config from 'config';
import { cloneDeep } from 'lodash';
// import { renderTree } from '@/utils';

const {
  getUserNames,
  logoutUser,
  loginOut,
  setErrorLog,
  updateUserPassWord,
  getUserDetail,
  updateUser,
  getButtonUse,
  getProjectSystemName,
  getPatterns,
} = api;

export default {
  namespace: 'app',
  state: {
    modalStage: 'Overview',
    user: {},
    userDetail: {},
    permissions: {
      visit: [],
    },
    cityId: 120,
    routeList: config.routeList,
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
    buttonUse: [],
    systemName: '',
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        });
      });
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window;
        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE);
            cancelRequest.delete(key);
          }
        });
      });
    },

    setup({ dispatch }) {
      dispatch({ type: 'query' });
    },
  },
  effects: {
    *query({ payload }, { call, put, select, all }) {
      const {
        brower: { name, version },
        architecture,
      } = getPlatform();
      if ((name === 'Chrome' && version < 50) || name !== 'Chrome') {
        const url = `http://41.212.1.154:8080/Chrome${architecture}_75.exe`;
        const msg = name !== 'Chrome' ? '非Chrome浏览器' : '浏览器或者版本过低';
        if (window.confirm(`${msg}，平台可能无法正常运行，请点击确定下载新版本浏览器`)) {
          window.location.assign(url);
        }

        return;
      }

      // 登录页不需要请求路由表
      if (pathMatchRegexp(['#/', '#/login', '#/static/login'], window.location.hash)) {
        return;
      }

      yield all([
        put({
          type: 'getProjectSystemName',
        }),
        put({ type: 'getPatterns' }),
      ]);

      const res = yield call(getUserNames);
      if (res.data) {
        const { indexMenuResps } = res.data;
        const routeList = indexMenuResps || [];
        const { cityId, userName, id, role, policeType } = res.data;
        yield all([
          put({
            type: 'updateState',
            payload: { routeList, cityId, userName, id, role, policeType },
          }),
          put({
            type: 'setRouteListStore',
            payload: routeList,
          }),
        ]);

        store.set('userData', { userName, cityId, id, role, routeList, policeType });
      } else {
        throw res;
      }
      const resButton = yield call(getButtonUse);

      if (resButton) {
        const { data } = resButton;
        store.set('buttonData', { buttonUse: data });
        yield put({
          type: 'setButtonUse',
          data,
        });
      }
      return res.data;
    },

    *getPatterns({ payload }, { call, put }) {
      const res = yield call(getPatterns, payload);
      if (res && res.data) {
        store.set('patterns', res.data);
      }
    },

    *signOut({ payload }, { call, put }) {
      const data = yield call(logoutUser);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            user: {},
            permissions: { visit: [] },
            menu: [
              {
                id: '1',
                icon: 'laptop',
                name: 'Dashboard',
                zhName: '仪表盘',
                router: '/dashboard',
              },
            ],
          },
        });
        yield put({ type: 'query' });
      } else {
        throw data;
      }
    },

    *setErrorLog({ payload }, { call }) {
      yield call(setErrorLog, payload);
    },

    *loginOut({ payload }, { call, put }) {
      const data = yield call(loginOut);
      yield put({
        type: 'warningModileModel/delCascade',
      });
      if (data.success) {
        if (payload && payload.type === 'static') {
          router.push('/static/login');
        } else {
          router.push('/login');
        }
        // const { hostname } = window.location;
        // const hpptsPort = Config.httpsPort;
        // window.location.replace(`http://${hostname}:${hpptsPort}`);
      } else {
        throw data;
      }
      return data;
    },

    *updateUserPassWord({ payload }, { call, put, select }) {
      const res = yield call(updateUserPassWord, payload); // 请求后台，获取返回的数据
      return res;
    },

    *updateUser({ payload, queryData }, { call, put, select }) {
      const res = yield call(updateUser, payload); // 请求后台，获取返回的数据
      return res;
    },

    *getProjectSystemName({ payload }, { call, put }) {
      const res = yield call(getProjectSystemName, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'updateState',
          payload: { systemName: data.headTile },
        });
      }
    },

    *getUserDetail({ payload }, { call, put }) {
      const res = yield call(getUserDetail, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setUserDetail',
          data,
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

    setRouteListStore(state, { payload }) {
      const menuData = cloneDeep(payload);
      const addRoute = routeList => {
        for (let i = 0; i < routeList.length; i++) {
          if (routeList[i].route === '/dashboard/real/communitymanagement') {
            menuData.push({ route: '/dashboard/real/addcommunity' });
          } else if (routeList[i].route === '/dashboard/system/dictionary') {
            menuData.push({ route: '/dashboard/system/dictionary/addOrModifyDictionary' });
          } else if (routeList[i].route === '/dashboard/system/menus') {
            menuData.push({ route: '/dashboard/system/menus/addOrModifyMenu' });
          } else if (routeList[i].route === '/dashboard/system/roles') {
            menuData.push({ route: '/dashboard/system/roles/addOrModifyRole' });
          } else if (routeList[i].route === '/dashboard/system/users') {
            menuData.push({ route: '/dashboard/system/users/addOrModifyUser' });
          } else if (routeList[i].route === '/dashboard/generalservice/listmanagement') {
            menuData.push({ route: '/dashboard/generalservice/listlibraryInfo' });
          } else if (routeList[i].children && routeList[i].children.length > 0) {
            addRoute(routeList[i].children);
          }
        }
      };
      menuData.push({ route: '/dashboard/data/statistics' });
      addRoute(payload);
      store.set('menuData', menuData);
      return { ...state };
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload);
      return { ...state, theme: payload };
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload);
      return { ...state, collapsed: payload };
    },

    allNotificationsRead(state) {
      return { ...state, notifications: [] };
    },

    setModalStage(state, { payload }) {
      return { ...state, modalStage: payload };
    },

    clearModel(state, { payload }) {
      return {
        ...state,
        modalStage: 'Overview',
      };
    },

    setUserDetail(state, { data }) {
      return { ...state, userDetail: data };
    },

    setButtonUse(state, { data }) {
      return { ...state, buttonUse: data };
    },
  },
};
