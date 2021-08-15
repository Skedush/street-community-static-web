/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import { Radio, Modal } from 'antd';
import styles from './index.less';
import { isEmpty } from 'lodash';
import moment from 'moment';
import TimerMixin from 'react-timer-mixin';
import { decorate as mixin } from 'react-mixin';
import EventWarning from '@/pages/Dashboard/ThematicAnalysis/EventWarning';

@connect(({ dataStatistics: { eventStatistics } }) => ({ eventStatistics }))
@mixin(TimerMixin)
class EventStatistics extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      type: undefined,
      startDateTime: moment()
        .subtract('days', 1)
        .startOf('day'),
      endDateTime: moment()
        .subtract('days', 1)
        .endOf('day'),
    };
  }

  componentDidMount() {
    this.getEventStatisticsData();
    this.setInterval(() => {
      this.getEventStatisticsData();
    }, 300000);
  }

  getEventStatisticsData = () => {
    const { dispatch } = this.props;
    const { startDateTime, endDateTime } = this.state;
    const statisticStartDateTime = startDateTime.format('YYYY-MM-DD HH:mm:ss');
    const statisticEndDateTime = endDateTime.format('YYYY-MM-DD HH:mm:ss');

    dispatch({
      type: 'dataStatistics/getScreenEventStatistics',
      payload: { statisticStartDateTime, statisticEndDateTime },
    });
  };

  onRadioChange = e => {
    const startDateTime = moment()
      .subtract('days', parseInt(e.target.value))
      .startOf('day');
    let endDateTime = moment();
    if (e.target.value === '1') {
      endDateTime = moment()
        .subtract('days', parseInt(e.target.value))
        .endOf('day');
    }
    this.setState(
      {
        startDateTime,
        endDateTime,
      },
      () => {
        this.getEventStatisticsData();
      },
    );
  };

  onEventClick = type => {
    this.setState({
      modalVisible: true,
      type,
    });
  };
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  renderEventModal() {
    const { type, startDateTime, endDateTime } = this.state;
    return (
      <Modal
        title="事件预警"
        visible={this.state.modalVisible}
        onCancel={this.handleCancel}
        footer={false}
        width={'80%'}
        wrapClassName={styles.modal}
        destroyOnClose={true}
      >
        <EventWarning status={type} startDateTime={startDateTime} endDateTime={endDateTime} />
      </Modal>
    );
  }

  render() {
    const { className, title, eventStatistics } = this.props;
    if (isEmpty(eventStatistics)) return null;
    const { allCount, receivedResp, pendingResp, overdueResp } = eventStatistics;
    return (
      <div className={classNames(className, 'flexColStart')}>
        <div className={classNames('flexBetween', styles.title)}>
          <div>{title}</div>
          <div className={styles.radioGroup}>
            <Radio.Group defaultValue="1" size="small" onChange={this.onRadioChange}>
              <Radio.Button value={'1'}>昨日</Radio.Button>
              <Radio.Button value={'0'}>今日</Radio.Button>
              <Radio.Button value={'6'}>七天</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={classNames('flexBetween', 'flexWrap', styles.content)}>
          <div
            className={classNames('flexColAround', styles.event)}
            onClick={() => this.onEventClick()}
          >
            <div className={styles.tag}>事件总数</div>
            <div className={styles.count}>{allCount}</div>
          </div>
          <div
            className={classNames('flexColAround', styles.event)}
            onClick={() => this.onEventClick(receivedResp.type)}
          >
            <div className={styles.tag}>已完成</div>
            <div className={styles.count}>{receivedResp.count}</div>
          </div>
          <div
            className={classNames('flexColAround', styles.event)}
            onClick={() => this.onEventClick(pendingResp.type)}
          >
            <div className={styles.tag}>待处理</div>
            <div className={styles.count}>{pendingResp.count}</div>
          </div>
          <div
            className={classNames('flexColAround', styles.event)}
            onClick={() => this.onEventClick(overdueResp.type)}
          >
            <div className={styles.tag}>已逾期</div>
            <div className={styles.count}>{overdueResp.count}</div>
          </div>
        </div>
        {this.renderEventModal()}
      </div>
    );
  }
}

export default EventStatistics;
