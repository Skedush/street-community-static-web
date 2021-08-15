import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import LdButton from '@/components/My/Button/LdButton';
import { isEqual } from 'lodash';
import { Badge, Modal, message } from 'antd';
import Img from '@/components/My/Img';
import FormSimple from '@/components/My/Form';
import LdTable from '@/components/My/Table/LdTable';
import CommonComponent from '@/components/CommonComponent';
import { renderTime } from '@/utils';
import HouseDetail from '@/pages/Dashboard/Home/components/HouseDetail';
import classNames from 'classnames';
// 速通门默认图片
import doorImg from '@/assets/images/stm.gif';
// 车辆道闸默认图片
import carImg from '@/assets/images/cldz.gif';
// 访客机默认图片
import visitImg from '@/assets/images/fkj.gif';
// 未知默认图片
import unknowImg from '@/assets/images/unknow.png';
const { confirm } = Modal;

@connect(
  ({ commonModel: { equipmentInfo, equipmentRecord, villageHouseList, deviceAddressId } }) => ({
    equipmentInfo,
    equipmentRecord,
    villageHouseList,
    deviceAddressId,
  }),
)
class EquipmentPortrait extends PureComponent {
  villageHouseForm;
  constructor(props) {
    super(props);
    this.state = {
      typeImg: null,
      image: [],
      openImage: false,
      addressModalVisible: false,
      houseModalVisible: false,
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.equipmentNo, this.props.equipmentNo)) {
      this.fetchData();
    }
  }

  renderTable() {
    const columns = [
      {
        title: '人员姓名/车辆牌照',
        align: 'center',
        dataIndex: 'name',
        width: '15%',
        render: (text, record) => (
          <div>
            {record.name ? record.name : '未知'}/
            {record.licensePlate ? record.licensePlate : '未知'}
          </div>
        ),
      },
      {
        title: '进出类型',
        dataIndex: 'directionStr',
        align: 'center',
        width: '10%',
        render: (text, record) => {
          let classType;
          switch (record.directionStr) {
            case '进入':
              classType = styles.enterType;
              break;
            case '未知':
              classType = styles.unknowType;
              break;
            case '离开':
              classType = styles.leaveType;
              break;
            default:
              break;
          }
          return <div className={classType}>{text}</div>;
        },
      },
      {
        title: '进出时间',
        align: 'center',
        dataIndex: 'recordTime',
        width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
    ];
    const meterColumns = [
      {
        title: '读数',
        align: 'center',
        dataIndex: 'meterValue',
        width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '记录时间',
        align: 'center',
        dataIndex: 'readTime',
        width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
    ];
    let tableData = this.props.equipmentRecord;
    const { equipmentInfo } = this.props;
    const pagination = {
      position: 'bottom',
      total: tableData ? tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      pageSize: tableData ? tableData.size : 10,
      defaultCurrent: 1,
      onChange: this.onChangePage,
      current: tableData ? tableData.number + 1 : 1,
      showSizeChanger: false,
    };

    return (
      <LdTable
        type="myTable"
        columns={
          equipmentInfo.type === '11' || equipmentInfo.type === '12' ? meterColumns : columns
        }
        dataSource={tableData ? tableData.content : []}
        scroll={{ y: '100%' }}
        pagination={pagination}
        rowClassName="table-row"
      />
    );
  }

  // 房屋画像
  renderHouseModal() {
    return (
      <Modal
        title="房屋信息"
        visible={this.state.houseModalVisible}
        onCancel={this.houseModalCancel}
        footer={false}
        wrapClassName={classNames(styles.houseModal)}
        centered
        style={{ top: '40px' }}
        destroyOnClose={true}
      >
        <HouseDetail houseId={this.props.deviceAddressId} />
      </Modal>
    );
  }

  houseModalCancel = () => {
    this.setState({
      houseModalVisible: false,
    });
  };

  openHouseDetail = () => {
    this.setState({
      houseModalVisible: true,
    });
  };

  getHouseId = (villageHouseList, deviceAddressId, initHouseId) => {
    for (let item of villageHouseList) {
      if (item.children && item.children.length > 0) {
        const res = this.getHouseId(item.children, deviceAddressId, initHouseId);
        if (res) {
          initHouseId.unshift(item.id);
          return item.id;
        }
      }
      if (item.id === deviceAddressId) {
        initHouseId.unshift(item.id);
        return item.id;
      }
    }
  };

  renderAddAddressModal() {
    const { villageHouseList, deviceAddressId } = this.props;
    const initHouseId = [];
    this.getHouseId(villageHouseList, deviceAddressId, initHouseId);
    const props = {
      items: [
        {
          type: 'cascader',
          field: 'houseId',
          popupClassName: styles.cascader,
          changeOnSelect: false,
          className: 'actionBarLongComponent',
          cascaderOption: villageHouseList,
          label: '选择房屋',
          initialValue: initHouseId,
          fieldNames: { label: 'name', value: 'id', children: 'children' },
          rules: [
            {
              required: true,
              message: '请选择房屋!',
            },
          ],
        },
      ],
      actions: [
        { type: 'reset', title: '取消', onClick: this.handleCancel },
        { type: 'reset', title: '解除绑定', onClick: this.unbindHouse, disabled: !deviceAddressId },
        {
          type: 'select',
          title: '绑定',
          htmlType: 'submit',
        },
      ],
      actionsTopBorder: true,
      onSubmit: this.onHouseBindSubmit,
      onGetFormRef: form => {
        this.villageHouseForm = form;
      },
    };
    return (
      <Modal
        title="绑定设备地址"
        visible={this.state.addressModalVisible}
        onCancel={this.handleCancel}
        footer={false}
        mask={true}
        wrapClassName={classNames(styles.modal)}
        centered
        destroyOnClose={true}
      >
        <FormSimple {...props} />
      </Modal>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    if (!this.props.equipmentInfo) {
      return CommonComponent.renderLoading();
    }
    const { equipmentInfo, deviceAddressId } = this.props;
    const chargeTime = renderTime(equipmentInfo.buildTime);
    const { status } = equipmentInfo;
    let badge = 'success';
    if (status !== '1') {
      badge = 'error';
    }
    return (
      <div style={{ height: '100%' }}>
        <div className={styles.porBox}>
          <div className={styles.porLeft}>
            <div className={styles.topImg}>
              <Img image={''} defaultImg={this.state.typeImg} />
              <div className={styles.divWord}>
                <p className={styles.equipmentType}>{equipmentInfo.name}</p>
                <p className={styles.equipmentCode}>{equipmentInfo.code}</p>
              </div>
            </div>
            <div className={styles.icon} />
            <div className={styles.divText}>
              <p>
                小区名称：<span>{equipmentInfo.villageName}</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center' }}>
                设备地址：
                <span
                  className={classNames({
                    [styles.hasAddress]:
                      (equipmentInfo.type === '11' || equipmentInfo.type === '12') &&
                      deviceAddressId !== null &&
                      !equipmentInfo.deleted,
                  })}
                  onClick={
                    !equipmentInfo.deleted &&
                    (equipmentInfo.type === '11' || equipmentInfo.type === '12') &&
                    deviceAddressId !== null
                      ? this.openHouseDetail
                      : () => {}
                  }
                >
                  {equipmentInfo.address}
                </span>
                {!equipmentInfo.deleted &&
                  (equipmentInfo.type === '11' || equipmentInfo.type === '12') && (
                    <LdButton
                      icon={'edit'}
                      globalclass={styles.editBtn}
                      type="icon"
                      onClick={this.openBindModal}
                    />
                  )}
              </p>
              <p>
                设备状态：
                <span>
                  <Badge status={badge} color={status === '2' ? '#ff5a5a' : ''} />
                  {equipmentInfo.statusStr}
                </span>
              </p>
              <p>
                设备类型：<span>{equipmentInfo.typeStr}</span>
              </p>
              <p>
                设备厂商：<span>{equipmentInfo.factory}</span>
              </p>
              <p>
                设备品牌：
                <span>{equipmentInfo.brand}</span>
              </p>
              <p>
                设备型号：
                <span>{equipmentInfo.spec}</span>
              </p>
            </div>
          </div>
          <div className={classNames(styles.porRight, 'flexColStart')}>
            <div className={styles.equipmentInfo}>
              <div className={styles.title}>建设信息</div>
              <div className={styles.content}>
                <div className={styles.warm}>建设单位/联系方式</div>
                <div className={styles.info}>
                  {equipmentInfo.buildUnit}/{equipmentInfo.buildUnitPhone}
                </div>
                <div className={styles.warm}>运营单位/联系方式</div>
                <div className={styles.info}>
                  {equipmentInfo.operate}/{equipmentInfo.operatePhone}
                </div>
                <div className={styles.warm}>设备管理/联系方式</div>
                <div className={styles.info}>
                  {equipmentInfo.chargeName}/{equipmentInfo.chargePhone}
                </div>
                <div className={styles.warm}>安装时间</div>
                <div className={styles.info}>{chargeTime}</div>
                <div className={styles.warm}>经度/纬度</div>
                <div className={styles.info}>
                  {equipmentInfo.longitude}/{equipmentInfo.latitude}
                </div>
                <div className={styles.warm}>方向</div>
                <div className={styles.info}>{equipmentInfo.direction}</div>
              </div>
            </div>
            <div className={classNames(styles.knowInfo, 'flexColStart', 'flexAuto')}>
              <div className={styles.title}>采集信息</div>
              <div className={classNames(styles.content, 'flexColStart', 'flexAuto')}>
                <div className={classNames(styles.rightTable, 'flexAuto')}>
                  {this.renderTable()}
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.renderHouseModal()}
        {this.renderAddAddressModal()}
      </div>
    );
  }

  getRecordPage = (page = 1, type) => {
    const { equipmentNo, dispatch } = this.props;
    switch (type) {
      case '1':
        this.setState({
          typeImg: unknowImg,
        });
        break;
      // 速通门类型
      case '2':
        dispatch({
          type: 'commonModel/getEquipmentDoor',
          payload: {
            page,
            deviceId: equipmentNo,
          },
        });
        // 设置默认图片
        this.setState({
          typeImg: doorImg,
        });
        break;
      // 道闸机类型
      case '3':
        dispatch({
          type: 'commonModel/getEquipmentCarRecord',
          payload: {
            page,
            deviceId: equipmentNo,
          },
        });
        // 设置默认图片
        this.setState({
          typeImg: carImg,
        });
        break;
      // 访客机类型
      case '4':
        dispatch({
          type: 'commonModel/getEquipmentVisiter',
          payload: {
            page,
            deviceId: equipmentNo,
          },
        });
        // 设置默认图片
        this.setState({
          typeImg: visitImg,
        });
        break;
      case '11':
        dispatch({
          type: 'commonModel/getMeterRecord',
          payload: {
            page,
            deviceId: equipmentNo,
          },
        });
        // 设置默认图片
        this.setState({
          typeImg: unknowImg,
        });
        break;
      case '12':
        dispatch({
          type: 'commonModel/getMeterRecord',
          payload: {
            page,
            deviceId: equipmentNo,
          },
        });
        // 设置默认图片
        this.setState({
          typeImg: unknowImg,
        });
        break;
      default:
        this.setState({
          typeImg: unknowImg,
        });
        break;
    }
  };

  onChangePage = page => {
    const { equipmentInfo } = this.props;
    this.getRecordPage(page - 1, equipmentInfo.type);
  };

  unbindHouse = () => {
    const { equipmentNo, dispatch } = this.props;
    confirm({
      title: '是否确认解绑?',
      content: '点击确认解绑。',
      className: styles.signFo,
      onOk: async () => {
        const res = await dispatch({
          type: 'commonModel/unbindDeviceHouse',
          payload: { deviceId: equipmentNo },
        });
        if (res && res.success) {
          dispatch({
            type: 'commonModel/getEquipmentInfo',
            payload: {
              deviceId: equipmentNo,
            },
          });
          dispatch({
            type: 'commonModel/getDeviceAddress',
            payload: {
              deviceId: equipmentNo,
            },
          });
          this.handleCancel();
        }
      },
      onCancel() {},
      cancelText: '取消',
      okText: '确认',
    });
  };

  onHouseBindSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    this.villageHouseForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      fieldsValue.houseId = fieldsValue.houseId[fieldsValue.houseId.length - 1];
      const { equipmentNo, dispatch } = this.props;
      fieldsValue.deviceId = equipmentNo;

      const res = await dispatch({
        type: 'commonModel/bindDeviceHouse',
        payload: fieldsValue,
      });
      if (res && res.success) {
        dispatch({
          type: 'commonModel/getEquipmentInfo',
          payload: {
            deviceId: equipmentNo,
          },
        });
        dispatch({
          type: 'commonModel/getDeviceAddress',
          payload: {
            deviceId: equipmentNo,
          },
        });
        this.handleCancel();
      } else {
        message.error(res.message);
      }
    });
  };

  handleCancel = () => {
    this.setState({
      addressModalVisible: false,
    });
  };

  openBindModal = async () => {
    this.setState({
      addressModalVisible: true,
    });
  };

  fetchData = async () => {
    const { dispatch, equipmentNo } = this.props;
    const data = await dispatch({
      type: 'commonModel/getEquipmentInfo',
      payload: {
        deviceId: equipmentNo,
      },
    });
    await dispatch({
      type: 'commonModel/getDeviceAddress',
      payload: {
        deviceId: equipmentNo,
      },
    });
    if (data) {
      dispatch({
        type: 'commonModel/getVillageHouseList',
        payload: {
          villageId: data.villageId,
        },
      });
      // 未知类型
      this.getRecordPage(0, data.type);
    }
  };

  sendImage = (image, e) => {
    e.stopPropagation();
    this.setState({
      image: [{ src: image }],
      openImage: true,
    });
  };
}

export default EquipmentPortrait;
