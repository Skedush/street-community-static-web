import Api from 'services';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';

const {
  getOldHandler,
  getPersonHandler,
  getPersonFlowHandle,
  getEventWarningData,
  getHouseHoldHandler,
  getVillagePersonImageDoor,
  getVillagePersonImageVisit,
  getCommunitys,
  getDataStatistics,
  getType,
  getVillagePersonImageBase,
  getVillageList,
  getDoorList,
  getVillagePersonImageOther,
  getCarSummary,
  getCarRecord,
  getSelectVillage,
  getEquipmentInfo,
  getHouseSummary,
  getTxt,
  test,
  deleteTxt,
  downloadTxt,
  getFloatingExportList,
  getFloatDealing,
  getDontFloatDealing,
  getUserAddvillage,
  userAddVillage,
  getArea,
  getTagPerson,
  getShowTag,
  getShowAddTag,
  delShowTag,
  getPersonAddress,
  getCascadeAll,
  getVillageConstruction,
  getBaseCar,
  getCompanyBase,
  // getCompanyOtherInfo,
  getCompanyPersonList,
  getIndexCount,
  getVersionHistory,
  getRoleTypeCollection,
  getEventDetail,
  getWorkDeal,
  getVillageHouseList,
  bindDeviceHouse,
  unbindDeviceHouse,
  getMeterRecord,
  getDeviceAddress,
} = Api;

export default {
  namespace: 'commonModel',
  state: {
    deviceType: [],
    address: [],
    getList: [],
    chartVal: [],
    chartNum: null,
    carDtata: [],
    communityVaule: [],
    menuType: [],
    loginType: [],
    companyType: [],
    houseUseType: [],
    maskFlagType: [],
    temperatureValueFlagType: [],
    propertyType: [],
    processingStatus: [],
    houseSummary: {},
    handleStatus: [],
    personType: [],
    doorList: [],
    doorListSum: 0,
    carRecordSum: 0,
    visitorList: [],
    zhiAnType: [],
    eventWarningData: {},
    vistorListSum: 0,
    doorTotalPages: null,
    carRecordTotalPages: null,
    visitorTotalPages: null,
    pictureData: null,
    personImageBase: null,
    personImageOther: null,
    surveillanceDrtail: [],
    carSummary: null,
    carRecord: null,
    tenantRegistrationType: {},
    defaultVillageIds: [],
    // 辖区选择之内的封闭式小区
    selectVillage: [],
    // 数据权限中的所有小区
    selectVillageAllIncludeOpen: [],
    // 数据权限中的封闭式小区
    selectVillageAll: [],
    // 数据权限中的所有小区
    selectVillageOpen: [],
    userType: [],
    directionType: [],
    handId: null,
    equipmentInfo: null,
    equipmentRecord: null,
    role: '',
    id: '',
    userName: '',
    txtList: [],
    roleType: [],
    info: null,
    area: [],
    checkStatus: [],
    statisticsType: [],
    // tagPerson: [],
    selectTag: [],
    homeTags: [],
    perTags: [],
    carTags: [],
    carTag: [],
    houseTag: [],
    personTag: [],
    tagPerson: [],
    controlState: [],
    carColor: [],
    alarmType: [],
    typeObject: [],
    alarmWay: [],
    orgListAll: [],
    caseInfoIsReadType: [],
    caseInfoComeFromType: [],
    constructionYear: [],
    baseCarInfo: {},
    companyOtherInfo: {},
    companyContent: [],
    companyBase: {},
    warningStatus: [],
    warningType: [],
    modalTask: [],
    handlerStatus: [],
    homeType: [],
    indexCount: {},
    indexContent: {},
    versionHistory: {},
    deviceStatus: [],
    escapedCriminalWarningType: [],
    communityType: [],
    gateWayDayType: [],
    gateWayType: [],
    roleTypeCollection: [],
    registerType: [],
    eventDetail: {},
    villageHouseList: [
      {
        name: '1栋',
        id: 1,
        children: [{ name: '1单元', id: 2, children: [{ name: '101室', id: 11 }] }],
      },
    ],
    deviceAddressId: null,
  },
  effects: {
    // 字典
    *getType({ payload, putType }, { call, put, select }) {
      const res = yield call(getType, payload); // 请求后台，获取返回的数据
      let { data } = res;

      if (data) {
        yield put({
          type: putType,
          data,
        });
        return data;
      }
    },
    // 首页剩余工作统计
    *getIndexCount({ payload }, { call, put, select }) {
      const res = yield call(getIndexCount, payload);
      // const { indexContent } = yield select(_ => _.home);
      let { data } = res;

      if (data) {
        let communitysPage;
        if (payload && payload.communitysPage === 1) {
          communitysPage = 1;
        } else {
          communitysPage = 0;
        }

        yield put({
          type: 'setIndexCount',
          data,
          // content: content,
          communitysPage,
        });

        return data;
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
    *getHouseSummary({ payload }, { call, put }) {
      const res = yield call(getHouseSummary, payload);
      yield put({
        type: 'updateHouseSummary',
        payload: res.data || [],
      });
    },

    *getVillageHouseList({ payload }, { call, put }) {
      const res = yield call(getVillageHouseList, payload);
      if (res && res.success) {
        yield put({
          type: 'updateState',
          payload: { villageHouseList: res.data || [] },
        });
      }
    },

    // showAll是否获取设置辖区之外的小区
    *getSelectVillage({ payload }, { call, put }) {
      const res = yield call(getSelectVillage, payload);
      const { data } = res;
      if (data) {
        if (payload && payload.showAll) {
          if (payload.showOpen) {
            yield put({
              type: 'setSelectVillageAllIncludeOpen',
              data,
            });
          } else {
            yield put({
              type: 'setSelectVillageAll',
              data,
            });
          }
        } else if (payload && payload.showOpen) {
          yield put({
            type: 'setSelectVillageIncludeOpen',
            data,
          });
        } else {
          yield put({
            type: 'setSelectVillage',
            data,
          });
        }
      }
    },

    *getHouseHoldHandler({ payload }, { call, put }) {
      const res = yield call(getHouseHoldHandler, payload);

      return res;
    },
    // 社区查询接口
    *getCommun({ payload }, { call, put }) {
      const res = yield call(getCommunitys, payload);
      yield put({
        type: 'getCommunityVaule',
        community: res.data.list,
      });
    },
    // 首页数据统计接口
    *getData({ _ }, { call, put }) {
      const data = yield call(getDataStatistics);
      const dataList = data.data;
      if (data) {
        yield put({
          type: 'carDtata',
          dataList,
        });
      }
    },
    // 人员画像基础信息
    *getPersonnelPortrait({ payload }, { call, put }) {
      const { data } = yield call(getVillagePersonImageBase, payload);
      if (data) {
        const ids = [];
        if (data.village.length) {
          data.village.forEach(el => {
            ids.push(el.id);
          });
          data.image.unshift({ villageName: '身份证照片', value: data.idCardImage });
          yield put({
            type: 'defaultVillageIds',
            data: ids,
          });
        }
        yield put({
          type: 'picture',
          data: data || {},
        });
        yield put({
          type: 'getVillagePersonImageOther',
          payload: { personId: data.personId, villageIds: ids.toString() },
        });
        if (!payload.isStatistics) {
          yield put({
            type: 'getVisitor',
            payload: { personId: data.personId, villageIds: ids.toString() },
          });
          yield put({
            type: 'getDoor',
            payload: {
              personId: data.personId,
              villageIds: ids.toString(),
              origin: payload.origin,
            },
          });
        }
      }
    },

    *getVillagePersonImageOther({ payload }, { call, put }) {
      const reqs = yield call(getVillagePersonImageOther, payload);
      if (reqs.data) {
        yield put({
          type: 'setPersonImageOther',
          data: reqs.data || {},
        });
      }
    },
    // 修改人员画像里的标签
    *getNewTabs({ payload }, { put }) {
      yield put({
        type: 'setNewTabs',
        data: payload,
      });
    },
    // 修改车辆画像里的标签
    *getCarNewTag({ payload }, { put }) {
      yield put({
        type: 'setCarNewTag',
        data: payload,
      });
    },

    *getPictureNull({ payload }, { call, put }) {
      yield put({
        type: 'picture',
        data: payload,
      });
    },
    // 车辆画像
    *getCarSummary({ payload }, { call, put }) {
      const reqs = yield call(getCarSummary, payload);

      if (reqs.data) {
        yield put({
          type: 'updataCarSummary',
          data: reqs.data,
        });
      }
    },
    // 车辆画像基础信息
    *getBaseCar({ payload }, { call, put }) {
      const reqs = yield call(getBaseCar, payload);
      if (reqs.data) {
        yield put({
          type: 'setBaseCar',
          data: reqs.data,
        });
        return reqs;
      }
    },
    // 道闸记录
    *getCarRecord({ payload }, { call, put }) {
      const reqs = yield call(getCarRecord, payload);

      if (reqs.data) {
        yield put({
          type: 'updataCarRecord',
          data: reqs.data,
        });
      }
      return reqs.data;
    },
    // 车辆道闸记录采集
    *getEquipmentCarRecord({ payload }, { call, put }) {
      const reqs = yield call(getCarRecord, payload);
      if (reqs.data) {
        yield put({
          type: 'setEquipmentRecord',
          data: reqs.data,
        });
      }
    },

    // 访问机采集记录
    *getEquipmentVisiter({ payload }, { call, put }) {
      const reqs = yield call(getVillageList, payload);
      if (reqs.data) {
        yield put({
          type: 'setEquipmentRecord',
          data: reqs.data,
        });
      }
    },

    // 访客记录
    *getVisitor({ payload }, { call, put }) {
      const reqs = yield call(getVillagePersonImageVisit, payload);
      if (reqs.data) {
        yield put({
          type: 'VisitorList',
          data: reqs.data,
        });
      }
    },

    // 门禁记录
    *getDoor({ payload }, { call, put }) {
      const reqs = yield call(getVillagePersonImageDoor, payload);
      const id = payload.personId;
      if (reqs.data) {
        yield put({
          type: 'doorList',
          data: reqs.data,
          id: id,
        });
      }
    },
    // 速通门采集记录
    *getEquipmentDoor({ payload }, { call, put }) {
      const reqs = yield call(getDoorList, payload);
      if (reqs.data) {
        yield put({
          type: 'setEquipmentRecord',
          data: reqs.data,
        });
      }
    },
    *getEquipmentInfo({ payload }, { call, put }) {
      const reqs = yield call(getEquipmentInfo, payload);
      if (reqs.data) {
        yield put({
          type: 'setEquipmentInfo',
          data: reqs.data,
        });
        return reqs.data;
      }
    },

    *getTxt({ payload }, { call, put }) {
      const res = yield call(getTxt, payload);
      if (res.data) {
        yield put({
          type: 'setTxt',
          data: res.data,
        });
      }
    },
    *uploadTxt({ payload }, { call, put }) {
      const res = yield call(test, payload);

      return res;
    },
    *deleteTxt({ payload }, { call, put }) {
      const res = yield call(deleteTxt, payload);
      return res;
    },
    // 文件导出
    *exportTxt({ payload, name }, { call, put }) {
      const res = yield call(downloadTxt, payload, { responseType: 'blob' });
      if (res.success) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        saveAs(blob, `${name}`);
      }
    },
    // 流口分析详情导出
    *getFloatingExportList({ payload }, { call, put }) {
      const res = yield call(getFloatingExportList, payload, { responseType: 'blob' });
      if (res.success) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        saveAs(blob, `流口分析详请.xls`);
      }
    },

    *getFloatDealing({ payload }, { call, put }) {
      const res = yield call(getFloatDealing, payload);
      return res;
    },

    *getDontFloatDealing({ payload }, { call, put }) {
      const res = yield call(getDontFloatDealing, payload);
      return res;
    },

    *getUserAddvillage({ payload }, { call, put }) {
      const res = yield call(getUserAddvillage, payload);
      return res;
    },

    *userAddVillage({ payload }, { call }) {
      const res = yield call(userAddVillage, payload);
      return res;
    },

    // 老人关怀签收
    *getOldHandler({ payload }, { call, put }) {
      const res = yield call(getOldHandler, payload);
      return res;
    },
    // 人口户籍签收
    *getPersonHandler({ payload }, { call, put }) {
      const res = yield call(getPersonHandler, payload);
      return res;
    },
    // 流动人口签收
    *getPersonFlowHandle({ payload }, { call, put }) {
      const res = yield call(getPersonFlowHandle, payload);
      return res;
    },
    // 人工创建标签的下拉框
    *getTagPerson({ payload, tagType }, { call, put }) {
      const res = yield call(getTagPerson, payload);
      if (res.data) {
        yield put({
          type: tagType || 'setTagPerson',
          data: res.data,
        });
        return res;
      }
    },
    // 画像显示的标签
    *getShowTag({ payload, setTag }, { call, put }) {
      const res = yield call(getShowTag, payload);
      if (res.data) {
        yield put({
          type: setTag,
          data: res.data,
        });
      }
    },
    // 画像的标签添加
    *getShowAddTag({ payload }, { call }) {
      const res = yield call(getShowAddTag, payload);
      return res;
    },
    // 画像的标签删除
    *delShowTag({ payload }, { call }) {
      const res = yield call(delShowTag, payload);
      return res;
    },

    *getPersonAddress({ payload }, { call, put }) {
      const res = yield call(getPersonAddress, payload);
      const { data } = res;
      if (data) {
        yield put({
          type: 'setPersonAddress',
          data,
        });
      }
    },
    // 房屋信息标签修改
    *getHouseTag({ payload }, { put }) {
      yield put({
        type: 'setHouseTag',
        data: payload,
      });
    },

    *getCascadeAll({ payload }, { call, put, select }) {
      const resp = yield call(getCascadeAll, payload); // 请求后台，获取返回的数据
      let data = resp.data;
      if (data) {
        data.map((item, index) => {
          if (item.level === 3) {
            item.isLeaf = true;
          }
          if (item.level === 2) {
            item.isLeaf = false;
          }
        });
        const org = yield select(state => state.commonModel.orgListAll);
        if (isEmpty(org)) {
          if (data) {
            yield put({
              type: 'updateState',
              payload: { orgListAll: data },
            });
          }
        }
      }
      return data;
    },
    // 态势分析

    // 建设年份
    *getVillageConstruction({ _ }, { call, put }) {
      const { data } = yield call(getVillageConstruction);
      if (data) {
        yield put({
          type: 'setConstructionYear',
          data,
        });
        return data;
      }
    },
    // 单位画像基础信息
    *getCompanyBase({ payload }, { call, put }) {
      const { data } = yield call(getCompanyBase, payload);
      if (data) {
        yield put({
          type: 'setCompanyBase',
          data,
        });
        return data;
      }
    },
    // 单位画像其他信息
    *getCompanyPersonList({ payload, judgetype }, { call, put }) {
      const { data } = yield call(getCompanyPersonList, payload);
      if (data) {
        yield put({
          type: 'setCompanyPersonList',
          data,
          judgetype: judgetype,
        });
        return data;
      }
    },

    // 智安列表
    *getEventWarningData({ payload }, { call, put }) {
      const res = yield call(getEventWarningData, payload);
      if (res.data) {
        yield put({
          type: 'setEventWarningData',
          data: res.data,
        });
      }
    },

    //

    // 版本历史
    *getVersionHistory({ payload }, { call, put }) {
      const res = yield call(getVersionHistory, payload);
      if (res.data) {
        yield put({
          type: 'updateState',
          payload: { versionHistory: res.data },
        });
      }
      return res;
    },

    *getRoleTypeCollection({ payload }, { call, put }) {
      const res = yield call(getRoleTypeCollection, payload);
      if (res.data) {
        yield put({
          type: 'updateState',
          payload: { roleTypeCollection: res.data },
        });
      }
      return res;
    },

    *getEventDetail({ payload }, { call, put }) {
      const res = yield call(getEventDetail, payload);
      if (res.data) {
        yield put({
          type: 'updateState',
          payload: { eventDetail: res.data },
        });
      }
      return res;
    },
    *getWorkDeal({ payload }, { call, put }) {
      const res = yield call(getWorkDeal, payload);
      return res;
    },

    *bindDeviceHouse({ payload }, { call, put }) {
      const res = yield call(bindDeviceHouse, payload);
      return res;
    },

    *unbindDeviceHouse({ payload }, { call, put }) {
      const res = yield call(unbindDeviceHouse, payload);
      return res;
    },

    *getMeterRecord({ payload }, { call, put }) {
      const res = yield call(getMeterRecord, payload);
      if (res && res.success) {
        yield put({
          type: 'setEquipmentRecord',
          data: res.data,
        });
      }
      return res;
    },

    *getDeviceAddress({ payload }, { call, put }) {
      const res = yield call(getDeviceAddress, payload);
      if (res && res.success) {
        yield put({
          type: 'updateState',
          payload: { deviceAddressId: res.data.houseId },
        });
      }
      return res;
    },
  },
  reducers: {
    setEventWarningData(state, { data }) {
      return { ...state, eventWarningData: data };
    },
    setCommunityType(state, { data }) {
      return { ...state, communityType: data };
    },
    setGateWayType(state, { data }) {
      const gateWayType = data.map(item => ({
        label: item.value,
        value: item.key,
      }));
      return { ...state, gateWayType };
    },
    setGateWayDayType(state, { data }) {
      return { ...state, gateWayDayType: data };
    },

    setHomeType(state, { data }) {
      // return
      return { ...state, homeType: data };
    },
    setHandlerStatus(state, { data }) {
      const all = { key: '', value: '全部' };
      data.unshift(all);
      return { ...state, handlerStatus: data };
    },

    setWarningStatus(state, { data }) {
      return { ...state, warningStatus: data };
    },
    setWaringType(state, { data }) {
      return { ...state, warningType: data };
    },
    setCompanyPersonList(state, { data, judgetype }) {
      let companyContent;
      if (judgetype) {
        companyContent = state.companyContent.concat(data.content);
      } else {
        companyContent = data.content;
      }

      return { ...state, companyOtherInfo: data, companyContent: companyContent };
    },
    setCompanyBase(state, { data }) {
      return { ...state, companyBase: data };
    },
    setHomeTags(state, { data }) {
      return { ...state, homeTags: data };
    },
    setPerTags(state, { data }) {
      return { ...state, perTags: data };
    },
    setCarTags(state, { data }) {
      return { ...state, carTags: data };
    },
    setObject(state, { data }) {
      return { ...state, typeObject: data };
    },

    setCarTag(state, { data }) {
      return { ...state, carTag: data };
    },
    setPersonTag(state, { data }) {
      return { ...state, personTag: data };
    },
    setHouseTag(state, { data }) {
      return { ...state, houseTag: data };
    },

    setInfo(state, { data }) {
      return { ...state, info: data };
    },

    chartVal(state, { chart }) {
      return { ...state, chartVal: chart.data.lists, chartNum: chart.data.total, chartType: 1 };
    },

    pieChart(state, { chart }) {
      return { ...state, chartVal: chart.obj, chartNum: chart.resp.data.total, chartType: 2 };
    },

    carDtata(state, { dataList }) {
      return { ...state, carDtata: dataList };
    },

    getCommunityVaule(state, { community }) {
      return { ...state, communityVaule: community };
    },

    setRoleType(state, { data }) {
      return { ...state, roleType: data };
    },

    setCheckStatus(state, { data }) {
      return { ...state, checkStatus: data };
    },

    setDefauleImageValue(state) {
      return { ...state, pictureData: null, personImageBase: null, personImageOther: null };
    },

    setPersonImageOther(state, { data }) {
      return { ...state, personImageOther: data };
    },

    setMenuType(state, { data }) {
      return { ...state, menuType: data };
    },

    setLoginType(state, { data }) {
      return { ...state, loginType: data };
    },

    setCompanyType(state, { data }) {
      return { ...state, companyType: data };
    },

    setHouseUseType(state, { data }) {
      return { ...state, houseUseType: data };
    },
    setArea(state, { data }) {
      return { ...state, area: data };
    },

    setPersonType(state, { data }) {
      return { ...state, personType: data };
    },

    setStatisticsType(state, { data }) {
      return { ...state, statisticsType: data };
    },

    setTenantRegistration(state, { data }) {
      return { ...state, tenantRegistrationType: data };
    },

    setProcessingStatus(state, { data }) {
      return { ...state, processingStatus: data };
    },
    sethandleStatus(state, { data }) {
      return {
        ...state,
        handleStatus: data,
      };
    },
    picture(state, { data }) {
      return { ...state, pictureData: data };
    },

    personImageBase(state, { data }) {
      return { ...state, personImageBase: data };
    },

    VisitorList(state, { data, id }) {
      let visitorList;
      if (data.first) {
        visitorList = data.content;
      } else {
        visitorList = state.visitorList.concat(data.content);
      }
      return {
        ...state,
        visitorList: visitorList,
        visitorTotalPages: data.totalPages,
        vistorListSum: data.totalElements,
      };
    },

    doorList(state, { data, id }) {
      let doorList;
      if (data.first) {
        doorList = data.content;
      } else {
        doorList = state.doorList.concat(data.content);
      }
      return {
        ...state,
        doorList: doorList,
        doorTotalPages: data.totalPages,
        doorListSum: data.totalElements,
        handId: id,
      };
    },

    setEquipmentInfo(state, { data }) {
      return {
        ...state,
        equipmentInfo: data,
      };
    },

    setEquipmentRecord(state, { data }) {
      // let recordList;
      // if (data.first) {
      //   recordList = data.content;
      // } else {
      //   recordList = state.recordList.concat(data.content);
      // }
      return {
        ...state,
        equipmentRecord: data,
      };
    },

    warningDetail(state, { data }) {
      return { ...state, surveillanceDrtail: data };
    },

    updataCarSummary(state, { data }) {
      return { ...state, carSummary: data };
    },

    updataCarRecord(state, { data }) {
      let carRecord;
      if (data.first) {
        carRecord = data.content;
      } else {
        carRecord = state.carRecord.concat(data.content);
      }
      return {
        ...state,
        carRecord: carRecord,
        carRecordTotalPages: data.totalPages,
        carRecordSum: data.totalElements,
      };
    },

    setSelectVillage(state, { data }) {
      return { ...state, selectVillage: data };
    },
    setSelectVillageAll(state, { data }) {
      return { ...state, selectVillageAll: data };
    },
    setSelectVillageAllIncludeOpen(state, { data }) {
      return { ...state, selectVillageAllIncludeOpen: data };
    },
    setSelectVillageIncludeOpen(state, { data }) {
      return { ...state, selectVillageOpen: data };
    },
    setModifyUser(state, { data }) {
      return { ...state, userType: data };
    },
    setDirection(state, { data }) {
      const all = { key: '', value: '全部' };
      data.unshift(all);
      return { ...state, directionType: data };
    },
    setAlarmType(state, { data }) {
      const all = { key: '', value: '全部' };
      data.unshift(all);
      return { ...state, alarmType: data };
    },
    setControlState(state, { data }) {
      // const all = { key: '', value: '全部' };
      // data.unshift(all);
      return { ...state, controlState: data };
    },
    setCarColor(state, { data }) {
      return { ...state, carColor: data };
    },
    setRegisterType(state, { data }) {
      return { ...state, registerType: data };
    },

    userData(state, { payload }) {
      return { ...state, ...payload };
    },
    setTxt(state, { data }) {
      return { ...state, txtList: data };
    },
    setNewTabs(state, { data }) {
      return { ...state, pictureData: data };
    },
    setAlarmWay(state, { data }) {
      const all = { key: '', value: '全部' };
      data.unshift(all);
      return { ...state, alarmWay: data };
    },
    setCarNewTag(state, { data }) {
      return { ...state, carSummary: data };
    },
    setTagPerson(state, { data }) {
      return { ...state, selectTag: data };
    },
    updateHouseSummary(state, { payload }) {
      return { ...state, houseSummary: payload, address: payload.address };
    },
    // setHouseTag(state, { data }) {
    //   return { ...state, houseSummary: data };
    // },
    setPersonAddress(state, { data }) {
      return { ...state, address: data };
    },
    setCaseInfoComeFrom(state, { data }) {
      return { ...state, caseInfoComeFromType: data };
    },

    setCaseInfoIsRead(state, { data }) {
      return { ...state, caseInfoIsReadType: data };
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setMaskFlagType(state, { data }) {
      const all = { key: '', value: '全部' };
      data.unshift(all);
      return { ...state, maskFlagType: data };
    },

    setPropertyType(state, { data }) {
      return { ...state, propertyType: data };
    },

    setDeviceType(state, { data }) {
      const all = { key: '', value: '全部' };
      data.unshift(all);
      return { ...state, deviceType: data };
    },

    setTemperatureValueFlagType(state, { data }) {
      const all = { key: '', value: '全部' };
      data.unshift(all);
      return { ...state, temperatureValueFlagType: data };
    },

    setConstructionYear(state, { data }) {
      return { ...state, constructionYear: data };
    },
    defaultVillageIds(state, { data }) {
      return { ...state, defaultVillageIds: data };
    },
    setBaseCar(state, { data }) {
      return { ...state, baseCarInfo: data };
    },
    setZhiAnType(state, { data }) {
      const all = { key: '', value: '全部状态' };
      data.unshift(all);
      return { ...state, zhiAnType: data };
    },
    setIndexCount(state, { data, communitysPage }) {
      return { ...state, indexCount: data, communitysPage };
    },

    setDeviceStatus(state, { data }) {
      const deviceStatus = data.map(item => ({
        label: item.value,
        value: item.key,
      }));

      return { ...state, deviceStatus };
    },
  },
};
