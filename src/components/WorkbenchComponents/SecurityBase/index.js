import React, { PureComponent } from 'react';
import HeadPage from '../HeadPage';
import { connect } from 'dva';
import { message } from 'antd';
import styles from './index.less';
import PieChart from '../../../pages/Dashboard/Home/AverageUserPage/PieChart';
import { isEmpty } from 'lodash';
// 划分亿万
import { router, judgeLevels, routeTree } from '@/utils';
import IconFont from 'components/IconFont';
import classNames from 'classnames';
@connect(({ home: { statistic }, app: { routeList } }) => ({
  statistic,
  routeList,
}))
class SecurityBase extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { height: 50 };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getStatistic',
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { statistic, className, isAccordion = false } = this.props;
    if (isEmpty(statistic)) {
      return null;
    }
    const { height } = this.state;
    const { personCount, houseCount, carCount, deviceCount } = statistic;
    try {
      const items = [
        {
          total: personCount.keyValue,
          children: personCount.children,
          title: '实有人口',
          icon: 'icon-name',
          firstChildren: personCount.children[0].keyValue,
          firstChildrenName: personCount.children[0].keyName,
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

          title: '实有车辆',
          icon: 'icon-car',
          firstChildren: carCount.children[0].keyValue,
          firstChildrenName: carCount.children[0].keyName,
          router: '/dashboard/real/car',
        },
        {
          total: deviceCount.keyValue,
          children: deviceCount.children,
          icon: 'icon-shebei',
          title: '实有设备',
          firstChildren: deviceCount.children[0].keyValue,
          firstChildrenName: deviceCount.children[0].keyName,
          router: '/dashboard/real/equipment/deviceList',
        },
      ];
      return (
        <div className={classNames(styles.securityBottom, className)}>
          <div className={classNames(isAccordion ? 'flexEnd' : 'flexBetween', styles.header)}>
            {isAccordion ? '' : <HeadPage text={'智安要素'} />}
            <div className={classNames(styles.updateTime, 'flexEnd')}>
              更新时间：{statistic.updateTime}
            </div>
          </div>
          {items.map((item, index) => (
            <div key={index} className={styles.piebox}>
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
                <p onClick={() => this.pushRouter(item.router)}>
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
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  pushRouter = path => {
    const { routeList } = this.props;
    let pathResult = routeTree(routeList, []);
    const pathShow = pathResult.find(item => item.route === path);
    if (!pathShow) {
      message.error('用户无权限不能跳转页面');
      return;
    }
    router.push(path);
  };
}

export default SecurityBase;
