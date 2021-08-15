import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import PieChart from '@/pages/Dashboard/Home/AverageUserPage/PieChart';
import { isEmpty } from 'lodash';
// 划分亿万
import { judgeLevels } from '@/utils';
import { Modal } from 'antd';
import IconFont from 'components/IconFont';
import classNames from 'classnames';
import DeviceList from '@/pages/Dashboard/Real/TheEquipmentOperational/DeviceList';
import Population from '@/pages/Dashboard/Real/Population';
import Car from '@/pages/Dashboard/Real/Car';
import House from '@/pages/Dashboard/Real/House';
import TimerMixin from 'react-timer-mixin';
import { decorate as mixin } from 'react-mixin';

@connect(({ dataStatistics: { screenBasic }, app: { routeList } }) => ({
  screenBasic,
  routeList,
}))
@mixin(TimerMixin)
class BasicData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { height: 42, modalVisible: undefined };
  }

  componentDidMount() {
    this.getBaseData();
    this.setInterval(() => {
      this.getBaseData();
    }, 300000);
  }

  getBaseData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataStatistics/getScreenBasic',
    });
  };
  renderDeviceListModal() {
    return (
      <Modal
        title="设备列表"
        visible={this.state.modalVisible === 'device'}
        onCancel={this.handleCancel}
        footer={false}
        width={'80%'}
        wrapClassName={styles.modalPortrait}
        destroyOnClose={true}
      >
        <DeviceList />
      </Modal>
    );
  }

  renderPopularionModal() {
    return (
      <Modal
        title="实有人口"
        visible={this.state.modalVisible === 'person'}
        onCancel={this.handleCancel}
        footer={false}
        width={'80%'}
        wrapClassName={styles.modalPortrait}
        destroyOnClose={true}
      >
        <Population />
      </Modal>
    );
  }

  renderCarModal() {
    return (
      <Modal
        title="实有车辆"
        visible={this.state.modalVisible === 'car'}
        onCancel={this.handleCancel}
        footer={false}
        width={'80%'}
        wrapClassName={styles.modalPortrait}
        destroyOnClose={true}
      >
        <Car />
      </Modal>
    );
  }

  renderHouseModal() {
    return (
      <Modal
        title="实有房屋"
        visible={this.state.modalVisible === 'house'}
        onCancel={this.handleCancel}
        footer={false}
        width={'80%'}
        wrapClassName={styles.modalPortrait}
        destroyOnClose={true}
      >
        <House />
      </Modal>
    );
  }

  handleCancel = () => {
    this.setState({
      modalVisible: undefined,
    });
  };

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { screenBasic, className, title } = this.props;
    if (isEmpty(screenBasic)) {
      return null;
    }
    const { height } = this.state;
    const { personCount, houseCount, carCount, deviceCount } = screenBasic;
    try {
      const items = [
        {
          total: personCount.keyValue,
          children: personCount.children,
          title: '实有人口',
          icon: 'icon-name',
          firstChildren: personCount.children[0].keyValue,
          firstChildrenName: personCount.children[0].keyName,
          modal: 'person',
        },
        {
          total: houseCount.keyValue,
          children: houseCount.children,
          icon: 'icon-house',

          title: '实有房屋',
          firstChildren: houseCount.children[0].keyValue,
          firstChildrenName: houseCount.children[0].keyName,
          modal: 'house',
        },
        {
          total: carCount.keyValue,
          children: carCount.children,

          title: '实有车辆',
          icon: 'icon-car',
          firstChildren: carCount.children[0].keyValue,
          firstChildrenName: carCount.children[0].keyName,
          modal: 'car',
        },
        {
          total: deviceCount.keyValue,
          children: deviceCount.children,
          icon: 'icon-shebei',
          title: '实有设备',
          firstChildren: deviceCount.children[0].keyValue,
          firstChildrenName: deviceCount.children[0].keyName,
          modal: 'device',
        },
      ];
      return (
        <>
          <div className={styles.title}>{title}</div>

          <div className={classNames(styles.securityBottom, className)}>
            {items.map((item, index) => (
              <div key={index} className={styles.piebox} onClick={() => this.openModal(item.modal)}>
                <div
                  className={styles.chartBox}
                  ref={div => {
                    this.chartBox = div;
                  }}
                >
                  <div className={styles.icon}>
                    <IconFont
                      type={item.icon}
                      className={styles.test}
                      style={{
                        color: 'transparents',
                      }}
                    />
                  </div>
                  <PieChart
                    total={parseInt((item.firstChildren / item.total) * 100)}
                    data={item}
                    height={height}
                  />
                </div>
                <div className={styles.text}>
                  <p>
                    <span>{item.title || ''}</span>
                    <span>{judgeLevels(item.total) || 0}</span>
                  </p>
                  {item.children.map((type, index) => (
                    <p key={index} className={styles.textBox}>
                      <span className={styles.zuhu}>
                        <i />
                        {type.keyName || ''}
                      </span>
                      <span>{judgeLevels(type.keyValue) || 0}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {this.renderDeviceListModal()}
          {this.renderPopularionModal()}
          {this.renderCarModal()}
          {this.renderHouseModal()}
        </>
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  openModal = modal => {
    this.setState({
      modalVisible: modal,
    });
  };
}

export default BasicData;
