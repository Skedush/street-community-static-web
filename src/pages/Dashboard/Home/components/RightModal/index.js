import React, { PureComponent } from 'react';
// import { Progress } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import PieChart from '@/pages/Dashboard/Home/AverageUserPage/PieChart';
import IconFont from 'components/IconFont';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { router, judgeLevels } from '@/utils';
// import IconFont from 'components/CommonModule/IconFont';
// import { } from '@/utils';

@connect(({ home: { statistic } }) => ({ statistic }))
class RightModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: 50,
    };
    // this.resizeHeight = this.resizeHeight.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getStatistic',
    });
    // this.resizeHeight();
    // window.addEventListener('resize', this.resizeHeight);
  }

  // eslint-disable-next-line max-lines-per-function
  renderList() {
    const { statistic } = this.props;
    if (isEmpty(statistic)) {
      return null;
    }
    // const { height } = this.state;
    const { householdCount, houseCount, carCount, companyCount, powerCount } = statistic;
    const items = [
      {
        total: householdCount.keyValue,
        children: householdCount.children,
        icon: 'icon-name',
        title: '实有人口',
        firstChildren: householdCount.children[0].keyValue,
        firstChildrenName: householdCount.children[0].keyName,
        router: '/dashboard/real/population',
      },
      {
        total: houseCount.keyValue,
        children: houseCount.children,
        icon: 'icon-house',
        title: '实有房屋',
        firstChildren: houseCount.children[0].keyValue,
        firstChildrenName: houseCount.children[0].keyName,
        router: '/dashboard/real/house',
      },
      {
        total: carCount.keyValue,
        children: carCount.children,
        icon: 'icon-car',
        title: '实有车辆',
        firstChildren: carCount.children[0].keyValue,
        firstChildrenName: carCount.children[0].keyName,
        router: '/dashboard/real/car',
      },
      {
        total: companyCount.keyValue,
        children: companyCount.children,
        icon: 'icon-shop',
        title: '实有单位',
        firstChildren: companyCount.children[0].keyValue,
        firstChildrenName: companyCount.children[0].keyName,
        router: '/dashboard/real/company',
      },
      {
        total: powerCount.keyValue,
        children: powerCount.children,
        icon: 'icon-power',
        title: '实有力量',
        firstChildren: powerCount.children[0].keyValue,
        firstChildrenName: powerCount.children[0].keyName,
        // router: '/dashboard/real/security',
        router: '/dashboard/real/property',
      },
    ];

    return (
      <div className={classNames('flexColBetween', styles.markSix)}>
        {items.map((item, index) => (
          <div className={classNames('flexBetween', styles.sixText)} key={index}>
            <div
              className={styles.progressBox}
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
                height={45}
              />
              {/* <Progress
                type="circle"
                percent={parseInt((item.firstChildren / item.total) * 100)}
                // percent={100}
                width={height}
                strokeColor="#22FCF1"
                strokeWidth={8}
                strokeLinecap="square"
                format={percent => `${percent}%`}
              /> */}
            </div>
            <div className={styles.text}>
              <p onClick={() => this.pushRouter(item.router)}>
                <span>{item.title}</span>
                <span>{item.total ? judgeLevels(item.total) : 0}</span>
              </p>
              {item.children.map((type, index) => (
                <p key={index} className={styles.textBox}>
                  <span className={styles.zuhu}>
                    <i />
                    {type.keyName}
                  </span>
                  <span>{type.keyValue ? judgeLevels(type.keyValue) : 0}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderBottom() {
    const { statistic } = this.props;
    if (isEmpty(statistic)) {
      return null;
    }
    const {
      deviceOtherCount,
      deviceClientCount,
      deviceDoorCount,
      deviceCarCount,
      deviceTotalCount,
    } = statistic;
    return (
      <div className={styles.bottomBox}>
        <div className={styles.title}>
          <i className={classNames('iconfont', 'iconshebei')} style={{ color: 'white' }} />
          <h3>实有设备（{deviceTotalCount}）</h3>
        </div>
        <div className={styles.bottomTextBox}>
          <div className={styles.equipment}>
            <img src={require('../../../../../assets/images/stm.png')} alt="" />
            <p>
              <span>人脸门禁</span>
              <span>{deviceDoorCount}</span>
            </p>
          </div>
          <div className={styles.equipment}>
            <img src={require('@/assets/images/car.png')} alt="" />
            <p>
              <span>车辆道闸</span>
              <span>{deviceCarCount}</span>
            </p>
          </div>
          <div className={styles.equipment}>
            <img src={require('../../../../../assets/images/fkj.png')} alt="" />
            <p>
              <span>访客机</span>
              <span>{deviceClientCount}</span>
            </p>
          </div>
          <div className={styles.equipment}>
            <img src={require('../../../../../assets/images/ptmj.png')} alt="" />
            <p>
              <span>其他</span>
              <span>{deviceOtherCount}</span>
            </p>
          </div>
          {/* <div className={styles.equipment}>
            <img src={require('../../../../../assets/images/car.png')} alt="" />
            <p>
              <span>车辆道闸</span>
              <span>{deviceCarCount}</span>
            </p>
          </div> */}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    return (
      <div className={styles.rightModalBox}>
        <div className={styles.title}>
          <i className={classNames('iconfont', 'icontongji')} style={{ color: 'white' }} />
          <h3>智安要素</h3>
        </div>
        {this.renderList()}
        {this.renderBottom()}
      </div>
    );
  }

  // 计算高度
  // resizeHeight() {
  //   if (this.chartBox && this.chartBox.offsetHeight) {
  //     this.setState({
  //       height: parseInt(this.chartBox.offsetHeight * 0.75),
  //     });
  //   }
  // }

  pushRouter = path => {
    router.push(path);
  };
}

export default RightModal;
