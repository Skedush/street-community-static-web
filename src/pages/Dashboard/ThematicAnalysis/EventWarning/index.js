import React, { PureComponent } from 'react';
import classNames from 'classnames';
import {
  Modal,
  Input,
  Card,
  Form,
  Row,
  Col,
  Select,
  message,
  Tooltip,
  Icon,
  DatePicker,
} from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
// import DistributionMap from '@/components/CommonModule/Map';
import EventDetailModal from '@/components/CommonModule/EventDetailModal';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import EquipmentPortrait from '@/components/CommonModule/EquipmentPortrait';
import styles from './index.less';
import { connect } from 'dva';
import CommonComponent from '@/components/CommonComponent';
import { ZHIAN_TASK_TYPR_ARRAY, ZHIAN_TASK_TYPE_HELP } from '@/utils/constant';

const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

@Form.create()
@connect(state => {
  const {
    zhianModel: { taskCenterType },
    commonModel: { area, eventWarningData, zhiAnType, selectVillage },
    loading,
  } = state;
  return {
    eventWarningData,
    zhiAnType,
    taskCenterType,
    getZhiAnListLoading: loading.effects['commonModel/getEventWarningData'],
    selectVillage,
    area,
    loading: loading.effects['commonModel/getEventWarningData'],
  };
})
class EventWarning extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      equipmentPortraitVisible: false,
      searchQueryData: {
        page: 0,
        size: 10,
      },
      handleStatus: '',
      rangeTime: [undefined, undefined],
      villageId: undefined,
      detailModalVisible: false,
      taskId: null,
    };
  }

  async componentDidMount() {
    const { dispatch, selectVillage, status, startDateTime, endDateTime } = this.props;
    let { handleStatus, villageName } = this.props.location ? this.props.location.query : {};

    const searchQueryData = { ...this.state.searchQueryData };
    if (handleStatus || status) {
      searchQueryData.handleStatus = handleStatus || status;
      this.setState({
        handleStatus: handleStatus || status,
      });
    }
    if (startDateTime && endDateTime) {
      searchQueryData.publishTimeStart = startDateTime.format('YYYY-MM-DD HH:mm:ss');
      searchQueryData.publishTimeEnd = endDateTime.format('YYYY-MM-DD HH:mm:ss');
      this.setState({
        rangeTime: [startDateTime, endDateTime],
      });
    }
    await dispatch({ type: 'commonModel/getSelectVillage' });
    if (villageName) {
      const villageObj = selectVillage.find(_item => _item.name === villageName);
      if (villageObj) {
        const villageId = villageObj.id;
        searchQueryData.villageId = villageId;
        this.setState({
          villageId,
        });
      }
    }
    this.setSearchInfo(searchQueryData);
    this.fetchData(searchQueryData);
  }

  renderActionBar() {
    return (
      <div className={classNames(styles.actionBar)}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearch}>
            {this.renderForm()}
          </Form>
        </Card>
      </div>
    );
  }

  renderEquipmentPortrait() {
    return (
      <Modal
        visible={this.state.equipmentPortraitVisible}
        // visible="true"
        onCancel={this.handleDeviceCancel}
        footer={false}
        wrapClassName={styles.equipmentModal}
        destroyOnClose={true}
        title={'设备详情'}
      >
        <EquipmentPortrait equipmentNo={this.state.equipmentNo} />
      </Modal>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { pageSize } = this.state;
    //
    const columns = [
      {
        title: '事件内容',
        align: 'center',
        dataIndex: 'content',
        render: (text, record) =>
          CommonComponent.renderTableLinkCol(
            text,
            record,
            record.deviceId ? () => this.equipmentPortrait(record) : () => this.particulars(record),
          ),
      },
      {
        title: '小区名称',
        align: 'center',
        dataIndex: 'villageName',
        width: '11%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '事件时间',
        dataIndex: 'publishTime',
        width: '11%',
        align: 'center',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '事件类型',
        dataIndex: 'childTypeStr',
        align: 'center',
        width: '12%',
        render: (text, record) => (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            <Tooltip title={ZHIAN_TASK_TYPE_HELP[record.childType]} placement={'top'}>
              {text}{' '}
              <Icon
                type="question-circle"
                theme="filled"
                style={{ fontSize: '14px', color: '#AAB5CC' }}
              />
            </Tooltip>
          </div>
        ),
      },

      {
        title: '任务状态',
        align: 'center',
        dataIndex: 'handleStatusStr',
        width: '11%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        width: '5%',
        dataIndex: 'personId',
        render: (text, record) => (
          <div className={styles.tableButton}>
            <LdButton
              type="link"
              style={{ padding: '0', marginRight: '10px' }}
              onClick={
                record.deviceId
                  ? () => this.equipmentPortrait(record)
                  : () => this.particulars(record)
              }
            >
              详情
            </LdButton>
            <LdButton
              type="link"
              style={{ padding: '0' }}
              onClick={() => this.signFo(record.id)}
              disabled={record.handleStatus !== '2'}
            >
              签收
            </LdButton>
          </div>
        ),
      },
    ];
    const tableData = this.props.eventWarningData;
    const pagination = {
      position: 'bottom',
      total: tableData ? tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      // pageSize: tableData ? tableData.size : 0,
      pageSize: pageSize,
      defaultCurrent: 1,
      onChange: this.onChangePage,
      current: tableData ? tableData.number + 1 : 1,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };

    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        columns={columns}
        loading={this.props.getZhiAnListLoading}
        dataSource={tableData.content}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const {
      form: { getFieldDecorator },
      zhiAnType,
      taskCenterType,
      selectVillage,
    } = this.props;
    const zhiAnState = zhiAnType.filter(item => item.key !== '6');

    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
          <Col md={24} sm={24}>
            {/* <Form.Item>
              {getFieldDecorator('policeOrgId')(
                <Cascader
                  placeholder="所属辖区"
                  options={this.props.area}
                  showSearch={{ filter: this.filter }}
                  className={'actionBarSortComponent'}
                  changeOnSelect
                  displayRender={this.displayRender}
                />,
              )}
            </Form.Item> */}
            <Form.Item>
              {getFieldDecorator('villageId', { initialValue: this.state.villageId })(
                <Select
                  showSearch
                  defaultActiveFirstOption={true}
                  placeholder={this.state.placeholderFocus ? '请输入小区关键词' : '请选择小区'}
                  optionFilterProp="children"
                  className={'actionBarSortComponent'}
                  dropdownClassName={styles.select}
                  allowClear={true}
                  onFocus={this.selectFocus}
                  onBlur={this.selectBlur}
                >
                  {selectVillage.length >= 0 ? (
                    selectVillage.map(type => (
                      <Option value={type.id} key={type.id} className={'optionSelect'}>
                        {type.name}
                      </Option>
                    ))
                  ) : (
                    <Option value={-1} key={-1} className={'optionSelect'}>
                      全部
                    </Option>
                  )}
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('content')(
                <Input placeholder="事件内容" className={'actionBarSortComponent'} allowClear />,
              )}
            </Form.Item>
            <Form.Item>
              {/* {getFieldDecorator('policeOrgName')(<Input placeholder="所属辖区" allowClear />)} */}
              {getFieldDecorator('childType')(
                <Select
                  placeholder="任务类型"
                  dropdownClassName={styles.select}
                  defaultActiveFirstOption={true}
                  className={'actionBarSortComponent'}
                >
                  <Option value={''} key={-1} className={'optionSelect'}>
                    全部小类
                  </Option>
                  {taskCenterType.length >= 0 &&
                    taskCenterType.map(item => (
                      <Option value={item.value} key={item.key} className={'optionSelect'}>
                        {item.label}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('handleStatus', {
                initialValue: this.state.handleStatus,
              })(
                <Select
                  // showSearch

                  placeholder="任务状态"
                  optionFilterProp="children"
                  className={'actionBarSortComponent'}
                  dropdownClassName={styles.select}
                >
                  {zhiAnState.length > 0 &&
                    zhiAnState.map(type => {
                      if (type.key === '7') {
                        return;
                      }
                      return (
                        <Option value={type.key} key={type.key} className={'optionSelect'}>
                          {type.value}
                        </Option>
                      );
                    })}
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('rangeTime', {
                initialValue: this.state.rangeTime,
              })(
                <RangePicker
                  locale={locale}
                  allowClear={false}
                  className={'actionBarLongComponent'}
                  format="YYYY-MM-DD"
                />,
              )}
            </Form.Item>

            <Form.Item>
              <LdButton
                type="select"
                htmlType="submit"
                // loading={this.props.getZhiAnListLoading}
                onClick={this.onSearch}
              >
                查找
              </LdButton>
              <LdButton
                style={{ marginLeft: 8 }}
                // loading={this.props.getZhiAnListLoading}
                type="reset"
                onClick={this.handleFormReset}
              >
                重置
              </LdButton>
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { taskId, detailModalVisible } = this.state;
    return (
      <div
        className={classNames(
          'paddingSm',
          'bgThemeColor',
          'flexColStart',
          'height100',
          styles.renderBox,
        )}
        style={{ overflow: 'auto' }}
      >
        {this.renderActionBar()}
        {this.renderTable()}
        <EventDetailModal
          taskId={taskId}
          visible={detailModalVisible}
          onCancel={this.handleCancel}
          signFor={this.signFo}
        />
        {this.renderEquipmentPortrait()}
      </div>
    );
  }

  handleDeviceCancel = e => {
    const { dispatch } = this.props;
    this.setState({
      equipmentPortraitVisible: false,
    });
    dispatch({
      type: 'commonModel/updateState',
      payload: { equipmentInfo: null, equipmentRecord: {} },
    });
  };

  equipmentPortrait = record => {
    this.setState({
      equipmentNo: record.deviceId,
      equipmentPortraitVisible: true,
    });
  };

  fetchData = (searchQueryData = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModel/getEventWarningData',
      payload: searchQueryData,
    });
    dispatch({ type: 'commonModel/getType', payload: { type: 63 }, putType: 'setZhiAnType' });
    dispatch({
      type: 'zhianModel/getTaskCenterType',
      payload: { parentType: ZHIAN_TASK_TYPR_ARRAY.EVENT },
    });
    // dispatch({ type: 'commonModel/getSelectVillage' });
    dispatch({ type: 'commonModel/getArea' });

    dispatch({ type: 'commonModel/getSelectVillage' });
  };

  setSearchInfo = data => {
    this.setState({ searchQueryData: data });
  };

  // 查找
  onSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { dispatch } = this.props;
      const { pageSize } = this.state;
      fieldsValue.page = 0;
      fieldsValue.size = pageSize;
      if (fieldsValue.policeOrgId) {
        let newPoliceOrgId = fieldsValue.policeOrgId;
        if (fieldsValue.policeOrgId.length === 2) {
          fieldsValue.policeOrgId = newPoliceOrgId[1];
          fieldsValue.countyId = newPoliceOrgId[0];
        } else {
          fieldsValue.countyId = newPoliceOrgId[0];
          fieldsValue.policeOrgId = '';
        }
      }
      if (fieldsValue.rangeTime) {
        if (fieldsValue.rangeTime[0] === undefined || fieldsValue.rangeTime[1] === undefined) {
          fieldsValue.publishTimeStart = fieldsValue.rangeTime[0];
          fieldsValue.publishTimeEnd = fieldsValue.rangeTime[1];
        } else {
          fieldsValue.publishTimeStart = fieldsValue.rangeTime[0].format('YYYY-MM-DD 00:00:00');
          fieldsValue.publishTimeEnd = fieldsValue.rangeTime[1].format('YYYY-MM-DD 23:59:59');
        }
        delete fieldsValue.rangeTime;
      }

      fieldsValue.type = ZHIAN_TASK_TYPR_ARRAY.EVENT;
      this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'commonModel/getEventWarningData',
        payload: fieldsValue,
      });
    });
  };

  // 签收对话框
  signFo = id => {
    confirm({
      title: '是否确认签收?',
      content: '点击确认签收。',
      className: styles.signFo,
      onOk: () => this.signFoTask(id),
      onCancel() {},
      cancelText: '取消',
      okText: '确认',
    });
  };

  reGetList = () => {
    const { searchQueryData } = this.state;
    this.props.dispatch({
      type: 'commonModel/getEventWarningData',
      payload: searchQueryData,
    });
  };

  signFoTask = id => {
    this.props
      .dispatch({
        type: 'commonModel/getWorkDeal',
        payload: { id: id },
      })
      .then(res => {
        if (res.success) {
          message.success('签收成功');
          this.setState({
            detailModalVisible: false,
          });
          this.reGetList();
          // this.fetchData(searchQueryData);
        } else {
          message.error(res.message);
        }
      });
  };

  // 详情
  particulars = record => {
    this.setState({
      detailModalVisible: true,
      taskId: record.id,
    });
  };

  // 关闭详情
  handleCancel = type => {
    this.setState({
      detailModalVisible: false,
    });
  };

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;
    this.setState({
      handleStatus: '',
      rangeTime: [undefined, undefined],
      villageId: undefined,
    });
    form.resetFields();
    this.setSearchInfo({
      size: pageSize,
      page: 0,
      type: ZHIAN_TASK_TYPR_ARRAY.EVENT,
    });
    dispatch({
      type: 'commonModel/getEventWarningData',
      payload: {
        size: pageSize,
        page: 0,
      },
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;

    dispatch({
      type: 'commonModel/getEventWarningData',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;

    searchInfo.page = 0;
    searchInfo.size = pageSize;

    dispatch({
      type: 'commonModel/getEventWarningData',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      if (i === labels.length - 1) {
        return <span key={option.value}>{label}</span>;
      }
      return <span key={option.value}> </span>;
    });

  filter(inputValue, path) {
    return path.some(option => {
      if (option.code) {
        return (
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
          option.code.toString().indexOf(inputValue.toString()) > -1
        );
      }
    });
  }
}

EventWarning.propTypes = {};
export default EventWarning;
