import Api from 'services';
import router from 'umi/router';
import { renderTree } from '@/utils';
let {
  queryRolesInfo,
  deleteRoles,
  updateRole,
  addRole,
  getMenuTree,
  setRoleMenu,
  getRoleVillage,
  getRoleMenuById,
  getRoleRelateVillage,
} = Api;
export default {
  namespace: 'roleManagement',
  state: {
    tableData: {
      totalElements: 0,
    },
    menuTree: [],
    roleMenus: [],
    newTree: [],
    roleVillageTree: [],
    dataMenus: [],
    roleRelateVillage: [],
  },
  effects: {
    *getRolesInfo({ payload }, { call, put, select }) {
      //   const num = yield select((state) => state.testPage.num) //取命名空间为testPage的model的state里的num
      const res = yield call(queryRolesInfo, payload); // 请求后台，获取返回的数据
      let { data } = res;
      if (data) {
        yield put({
          type: 'setTableData',
          data,
        });
      }
    },

    *addRole({ payload, treeCheckList, treeUpdateList }, { call, put, select }) {
      let res = yield call(addRole, payload); // 请求后台，获取返回的数据
      let { success, data } = res;

      if (success) {
        let roleMenus = {
          roleId: data,
          menuIds: treeCheckList,
        };
        if (!treeCheckList) {
          return res;
        }
        yield put({
          type: 'setRoleMenu',
          payload: roleMenus,
          path: '/dashboard/system/roles',
        });
      }
      return res;
    },

    *setRoleMenu({ payload, path }, { call, put, select }) {
      const res = yield call(setRoleMenu, payload); // 请求后台，获取返回的数据
      let { success } = res;
      if (success) {
        if (!path) {
          router.goBack();
        } else {
          router.push(path);
        }
      }
    },

    *getRoleMenuById({ payload }, { call, put, select }) {
      const res = yield call(getRoleMenuById, payload); // 请求后台，获取返回的数据
      let { success, data } = res;
      // const newTree = yield select(state => state.newTree);
      const { newTree } = yield select(_ => _.roleManagement);
      let newArr = [];

      data.forEach(item => {
        newTree.forEach(item2 => {
          if (item.menuId === item2) {
            newArr.push(item);
          }
        });
      });

      if (success) {
        yield put({
          type: 'setRoleMenus',
          data,
          newArr,
        });
        return data;
      }
    },

    *updateRole({ payload }, { call, put, select }) {
      const res = yield call(updateRole, payload); // 请求后台，获取返回的数据
      return res;
    },

    *deleteRoles({ payload, queryData, reSetSelected }, { call, put, select }) {
      const res = yield call(deleteRoles, payload); // 请求后台，获取返回的数据
      let { success } = res;
      if (success) {
        reSetSelected();
        queryData.page = 0;
        yield put({
          type: 'getRolesInfo',
          payload: queryData,
        });
      }
      return res;
    },

    *getMenuTree({ _ }, { call, put, select }) {
      const res = yield call(getMenuTree); // 请求后台，获取返回的数据
      let { data } = res;

      if (data) {
        const newTree = renderTree(data, []);
        yield put({
          type: 'setMenuTree',
          data,
          newTree,
        });
      }
    },

    *getRoleVillage({ _ }, { call, put }) {
      const res = yield call(getRoleVillage);
      const { data } = res;

      if (data) {
        yield put({
          type: 'setRoleVillage',
          data,
        });
      }
      return res;
    },

    *getRoleRelateVillage({ payload }, { call, put }) {
      const res = yield call(getRoleRelateVillage, payload);

      const { data } = res;
      if (data) {
        yield put({
          type: 'setRoleRelateVillage',
          data,
        });
      }
    },
  },
  reducers: {
    setRoleMenus(state, { data, newArr }) {
      // 接收action,并解构出来
      let roleMenus = [];

      // data.forEach(function(item, index) {
      //   roleMenus.push(item.menuId);
      // });
      newArr.forEach(function(item, index) {
        roleMenus.push(item.menuId);
      });
      return { ...state, roleMenus };
    },

    setMenuTree(state, { data, newTree }) {
      // 接收action,并解构出来
      return { ...state, menuTree: data, newTree: newTree };
    },

    setTableData(state, { data }) {
      // 接收action,并解构出来
      return { ...state, tableData: data };
    },

    setRoleVillage(state, { data }) {
      return { ...state, roleVillageTree: data };
    },

    setRoleRelateVillage(state, { data }) {
      return { ...state, roleRelateVillage: data };
    },
  },
  subscriptions: {
    setupUserList({ dispatch, history, query, store }) {
      return history.listen(({ pathname, search }) => {});
    },
  },
};
