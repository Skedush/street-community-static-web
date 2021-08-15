import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './index.less';
import classNames from 'classnames';
import BlockLineChart from './components/BlockLineChart';
import DeviceOnline from './components/DeviceOnline';
import BasicData from './components/BasicData';
import { connect } from 'dva';
import LineChart from './components/LineChart';
import EventStatistics from './components/EventStatistics';
import PendingEvent from './components/PendingEvent';
import Head from './components/Head';
import Map from './components/Map';

@connect(({ loading, dataStatistics: { view } }) => ({ loading, view }))
class DataStatistics extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {}

  componentWillUnmount() {}

  renderLeft() {
    return (
      <div className={classNames(styles.left, 'flexColAround')}>
        <BlockLineChart title={'智能设备日采集'} className={styles.lineChart} />
        <DeviceOnline title={'设备在线'} className={styles.deviceOnline} />
        <BasicData title={'基础数据'} className={styles.basicData} />
      </div>
    );
  }

  renderRight() {
    return (
      <div className={classNames(styles.right, 'flexColAround')}>
        <LineChart title={'事件新增趋势'} className={styles.lineChart} />
        <EventStatistics title={'事件统计'} className={styles.eventStatistics} />
        <PendingEvent title={'待处理事件'} className={styles.pendingEvent} />
      </div>
    );
  }

  render() {
    const { view } = this.props;
    return (
      <div className={classNames(styles.frame, 'flexColStart')}>
        <Head />
        <Map />
        {view === 'community' && (
          <>
            {this.renderLeft()}
            {this.renderRight()}
          </>
        )}
      </div>
    );
  }
}
DataStatistics.propTypes = {
  dispatch: PropTypes.func,
};

export default DataStatistics;
