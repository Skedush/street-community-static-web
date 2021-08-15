/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import { Badge, Modal } from 'antd';
import TimerMixin from 'react-timer-mixin';
import { decorate as mixin } from 'react-mixin';
import styles from './index.less';
import { isEmpty } from 'lodash';
import DeviceList from '@/pages/Dashboard/Real/TheEquipmentOperational/DeviceList';
@connect(({ dataStatistics: { deviceStatusStatistic } }) => ({ deviceStatusStatistic }))
@mixin(TimerMixin)
class DeviceOnline extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      deviceType: undefined,
    };
  }

  componentDidMount() {
    this.getDeviceStatusStatistic();
    this.setInterval(() => {
      this.getDeviceStatusStatistic();
    }, 300000);
  }

  getDeviceStatusStatistic = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'dataStatistics/getScreenDeviceStatusStatistic' });
  };

  onDeviceClick = type => {
    this.setState({
      modalVisible: true,
      deviceType: type,
    });
  };

  renderDeviceListModal() {
    const { deviceType } = this.state;
    return (
      <Modal
        title="设备列表"
        visible={this.state.modalVisible}
        onCancel={this.handleCancel}
        footer={false}
        width={'80%'}
        wrapClassName={styles.modalPortrait}
        destroyOnClose={true}
      >
        <DeviceList initType={deviceType} />
      </Modal>
    );
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  // eslint-disable-next-line max-lines-per-function
  render() {
    const { className, title, deviceStatusStatistic } = this.props;
    if (isEmpty(deviceStatusStatistic)) return null;
    const {
      normalDevice,
      carDevice,
      nvrDevice,
      fireHydrantDevice,
      smokeDetectionDevice,
      combustibleGasDetectionDevice,
      smartWaterMeterDevice,
      smartElectricMeterDevice,
    } = deviceStatusStatistic;
    return (
      <div className={classNames(className, 'flexColStart')}>
        <div className={styles.title}>{title}</div>
        <div className={classNames('flexBetween', 'flexWrap', styles.content)}>
          <div
            className={classNames('flexBetween', 'itemCenter', styles.device)}
            onClick={() => this.onDeviceClick(normalDevice.deviceType)}
          >
            <div className={styles.name}>门禁设备</div>
            <div className={classNames('flexColAround', styles.status)}>
              <Badge color={'#27FFFC'} text={'正常 ' + normalDevice.onlineCount} />
              <Badge color={'#009FFF'} text={'异常 ' + normalDevice.offlineCount} />
            </div>
          </div>
          <div
            className={classNames('flexBetween', 'itemCenter', styles.device)}
            onClick={() => this.onDeviceClick(carDevice.deviceType)}
          >
            <div className={styles.name}>道闸设备</div>
            <div className={classNames('flexColAround', styles.status)}>
              <Badge color={'#27FFFC'} text={'正常 ' + carDevice.onlineCount} />
              <Badge color={'#009FFF'} text={'异常 ' + carDevice.offlineCount} />
            </div>
          </div>
          <div
            className={classNames('flexBetween', 'itemCenter', styles.device)}
            onClick={() => this.onDeviceClick(nvrDevice.deviceType)}
          >
            <div className={styles.name}>高空抛物</div>
            <div className={classNames('flexColAround', styles.status)}>
              <Badge color={'#27FFFC'} text={'正常 ' + nvrDevice.onlineCount} />
              <Badge color={'#009FFF'} text={'异常 ' + nvrDevice.offlineCount} />
            </div>
          </div>
          <div
            className={classNames('flexBetween', 'itemCenter', styles.device)}
            onClick={() => this.onDeviceClick(fireHydrantDevice.deviceType)}
          >
            <div className={styles.name}>智能消防栓</div>
            <div className={classNames('flexColAround', styles.status)}>
              <Badge color={'#27FFFC'} text={'正常 ' + fireHydrantDevice.onlineCount} />
              <Badge color={'#009FFF'} text={'异常 ' + fireHydrantDevice.offlineCount} />
            </div>
          </div>
          <div
            className={classNames('flexBetween', 'itemCenter', styles.device)}
            onClick={() => this.onDeviceClick(smokeDetectionDevice.deviceType)}
          >
            <div className={styles.name}>智慧烟感</div>
            <div className={classNames('flexColAround', styles.status)}>
              <Badge color={'#27FFFC'} text={'正常 ' + smokeDetectionDevice.onlineCount} />
              <Badge color={'#009FFF'} text={'异常 ' + smokeDetectionDevice.offlineCount} />
            </div>
          </div>
          <div
            className={classNames('flexBetween', 'itemCenter', styles.device)}
            onClick={() => this.onDeviceClick(combustibleGasDetectionDevice.deviceType)}
          >
            <div className={styles.name}>可燃气体探测</div>
            <div className={classNames('flexColAround', styles.status)}>
              <Badge color={'#27FFFC'} text={'正常 ' + combustibleGasDetectionDevice.onlineCount} />
              <Badge
                color={'#009FFF'}
                text={'异常 ' + combustibleGasDetectionDevice.offlineCount}
              />
            </div>
          </div>
          <div
            className={classNames('flexBetween', 'itemCenter', styles.device)}
            onClick={() => this.onDeviceClick(smartWaterMeterDevice.deviceType)}
          >
            <div className={styles.name}>智能水表</div>
            <div className={classNames('flexColAround', styles.status)}>
              <Badge color={'#27FFFC'} text={'正常 ' + smartWaterMeterDevice.onlineCount} />
              <Badge color={'#009FFF'} text={'异常 ' + smartWaterMeterDevice.offlineCount} />
            </div>
          </div>
          <div
            className={classNames('flexBetween', 'itemCenter', styles.device)}
            onClick={() => this.onDeviceClick(smartElectricMeterDevice.deviceType)}
          >
            <div className={styles.name}>智能电表</div>
            <div className={classNames('flexColAround', styles.status)}>
              <Badge color={'#27FFFC'} text={'正常 ' + smartElectricMeterDevice.onlineCount} />
              <Badge color={'#009FFF'} text={'异常 ' + smartElectricMeterDevice.offlineCount} />
            </div>
          </div>
        </div>
        {this.renderDeviceListModal()}
      </div>
    );
  }
}

export default DeviceOnline;
