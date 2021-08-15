/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import { Select, List, message, Modal } from 'antd';
import styles from './index.less';
import { ZHIAN_TASK_TYPR_ARRAY } from '@/utils/constant';
import TimerMixin from 'react-timer-mixin';
import { decorate as mixin } from 'react-mixin';
import EventDetailModal from '@/components/CommonModule/EventDetailModal';
import EquipmentPortrait from '@/components/CommonModule/EquipmentPortrait';
const { Option } = Select;
const { confirm } = Modal;

@connect(
  ({ dataStatistics: { eventPage }, zhianModel: { taskCenterType }, loading: { effects } }) => ({
    eventPage,
    taskCenterType,
    getEventPageLoading: effects['dataStatistics/getEventPendingPage'],
  }),
)
@mixin(TimerMixin)
class BlockLineChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      equipmentPortraitVisible: false,
      equipmentNo: null,
      taskId: undefined,
      detailModalVisible: false,
      searchValue: {
        type: undefined,
      },
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'zhianModel/getTaskCenterType',
      payload: { parentType: ZHIAN_TASK_TYPR_ARRAY.EVENT },
    });
    this.getEventPendingData();
    this.setInterval(() => {
      this.getEventPendingData();
    }, 300000);
  }

  getEventPendingData = () => {
    const { dispatch } = this.props;
    const searchValue = { ...this.state.searchValue };
    dispatch({
      type: 'dataStatistics/getEventPendingPage',
      payload: searchValue,
    });
  };

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

  render() {
    const { className, title, eventPage, taskCenterType } = this.props;
    const { taskId, detailModalVisible } = this.state;
    return (
      <div className={classNames(className, 'flexColStart')}>
        <div className={classNames('flexBetween', styles.title)}>
          <div>{title}</div>
          <div className={styles.select}>
            <Select
              placeholder="任务类型"
              dropdownClassName={styles.selectDropDown}
              defaultActiveFirstOption={false}
              onChange={this.onSelectChange}
              size="small"
            >
              <Option value={'-1'} key={-1} className={styles.optionSelect}>
                全部小类
              </Option>
              {taskCenterType.length >= 0 &&
                taskCenterType.map(item => (
                  <Option value={item.value} key={item.key} className={styles.optionSelect}>
                    {item.label}
                  </Option>
                ))}
            </Select>
          </div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.listHeader)}>
          <div>序号</div>
          <div className={classNames('flexCenter', 'flexAuto')}>内容</div>
          <div className={styles.eventType}>事件类型</div>
        </div>
        <div className={styles.list}>
          <List
            dataSource={eventPage}
            renderItem={(item, index) => (
              <div
                className={classNames('flexBetween', 'itemCenter', styles.listItem)}
                onClick={() =>
                  item.deviceId ? this.equipmentPortrait(item) : this.onClickEvent(item.id)
                }
              >
                <div className={styles.index}>{index + 1}</div>
                <div className={classNames(styles.listContent)}>{item.content}</div>
                <div className={styles.type}>{item.childTypeStr}</div>
              </div>
            )}
          />
        </div>
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
    console.log('record: ', record);
    this.setState({
      equipmentNo: record.deviceId,
      equipmentPortraitVisible: true,
    });
  };

  // 关闭详情
  handleCancel = type => {
    this.setState({
      detailModalVisible: false,
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
          this.getEventPendingData();
          // this.fetchData(searchQueryData);
        } else {
          message.error(res.message);
        }
      });
  };

  onClickEvent = id => {
    this.setState({
      taskId: id,
      detailModalVisible: true,
    });
  };

  onSelectChange = async (value, option) => {
    this.setState(
      {
        searchValue: { type: value === '-1' ? undefined : value },
      },
      () => this.getEventPendingData(),
    );
  };
}

export default BlockLineChart;
