import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Statistic, Badge } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import ReactEcharts from 'echarts-for-react';

@connect(({ home: { unitSummary, villageBuildUnitInfo, unitHouseList } }) => ({
  unitSummary,
  villageBuildUnitInfo,
  unitHouseList,
}))
class UnitStatistics extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  fetch = () => {
    const { dispatch, villageBuildUnitInfo } = this.props;
    dispatch({
      type: 'home/getUnitSummary',
      payload: villageBuildUnitInfo,
    });
    dispatch({
      type: 'home/getFloorHouseListByUnit',
      payload: { ...villageBuildUnitInfo, sort: 'DESC' },
    });
  };

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.villageBuildUnitInfo !== this.props.villageBuildUnitInfo) {
      this.fetch();
    }
  }

  renderBasicStatistics() {
    const { unitSummary } = this.props;
    if (isEmpty(unitSummary)) return null;
    const { statistic } = unitSummary;
    const data = [
      {
        keyName: '单元房屋统计',
        unit: '间',
        keyValue: statistic.houseCount,
        icon: 'home',
        children: [
          { keyName: '业主自住数量', keyValue: statistic.houseOwnerCount },
          { keyName: '出租房屋数量', keyValue: statistic.houseRentCount },
          { keyName: '空置房屋数量', keyValue: statistic.emptyHouseCount },
          { keyName: '7人以上房屋', keyValue: statistic.sevenHouse },
        ],
      },
      {
        keyName: '住房人数统计',
        unit: '人',
        keyValue: statistic.housePersonCount,
        icon: 'team',
        children: [
          { keyName: '单元业主及家人', keyValue: statistic.houseOwnerPersonCount },
          { keyName: '租客总人数', keyValue: statistic.houseRentCount },
        ],
      },
    ];
    const badgeColor = ['#0DB896', '#1AABFF', '#20DCF9', '#CF7B1D'];
    return (
      <div className={classNames('flexAround', 'flexWrap', styles.basic)}>
        {data.map((item, index) => (
          <div key={index} className={classNames('flexColStart', styles.basicItem)}>
            <div className={classNames('flexStart', 'itemCenter')}>
              <Icon type={item.icon} className={styles.icon} />
              <div>{item.keyName}</div>
            </div>
            <div className={classNames('flexColStart', styles.content)}>
              <div className={classNames('flexStart', 'itemBaseline')}>
                <Statistic
                  value={item.keyValue}
                  valueStyle={{ color: '#20DCF9', marginRight: '5px' }}
                />
                <span>{item.unit}</span>
              </div>
              {item.children.map((cItem, index) => (
                <div key={index} className={styles.childrenItem}>
                  <Badge color={badgeColor[index]} text={`${cItem.keyName}:${cItem.keyValue}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderPieChart() {
    const { unitSummary } = this.props;
    if (isEmpty(unitSummary)) return null;
    const { statistic } = unitSummary;
    const dataName = ['自住', '出租', '空置', '7人以上房屋'];

    const dataValue = [
      { name: '自住', value: statistic.houseOwnerCount },
      { name: '出租', value: statistic.houseRentCount },
      { name: '空置', value: statistic.emptyHouseCount },
      { name: '7人以上房屋', value: statistic.sevenHouse },
    ];

    const option = {
      title: {
        show: true,
        text: statistic.houseCount,
        textStyle: {
          color: '#FFAA46',
          fontSize: 24,
        },
        subtext: '房屋总数',
        subtextStyle: {
          color: '#fff',
          fontSize: 14,
        },
        top: '35%',
        left: '41%',
        textAlign: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        top: 50,
        icon: 'circle',
        itemHeight: 10,
        itemWidth: 10,
        textStyle: {
          color: '#fff',
        },
        data: dataName,
      },
      series: [
        {
          name: '房屋概况',
          type: 'pie',
          radius: [40, '55%'],
          color: ['#0DB896', '#20DCF9', '#1AABFF', '#FFFF33'],
          center: ['42%', '50%'],
          label: {
            formatter: '{d|{d}%}\n{b|{b}}',
            rich: {
              b: {
                color: '#fff',
                fontSize: 14,
              },
              d: {
                fontSize: 16,
              },
            },
          },
          data: dataValue,

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    return (
      <div className={classNames(styles.ages)}>
        <ReactEcharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          className="echarts-for-react "
        />
      </div>
    );
  }
  renderUnitList() {
    const { unitHouseList, onHouseClick } = this.props;
    const badgeColor = {
      '1': '#0DB896',
      '2': '#1AABFF',
      '3': '#FF6600',
      '99': '#CCCCCC',
    };
    if (isEmpty(unitHouseList)) return null;
    const { itemList } = unitHouseList;
    if (isEmpty(itemList)) return null;
    return (
      <div className={classNames('flexColStart', styles.unitInfo)}>
        {itemList.map((item, index) => (
          <div key={index} className={classNames('flexBetween')}>
            <div className={classNames(styles.floor, 'flexColCenter', 'itemCenter')}>
              {item.floor}F
            </div>
            <div className={classNames('flexBetween', 'flexWrap', styles.houses)}>
              {item.houseList.map((house, index) => (
                <div
                  className={classNames('flexAround', 'itemCenter', styles.house)}
                  key={index}
                  onClick={() => onHouseClick({ houseId: house.houseId, detailShow: 'house' })}
                >
                  <div>{house.houseName}</div>
                  <Badge color={badgeColor[house.useType]} text={house.useTypeStr} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className={classNames(styles.container, 'flexColStart')}>
        <div className={styles.title}>单元概况</div>
        {this.renderBasicStatistics()}
        <div className={styles.title}>房屋概况</div>
        {this.renderPieChart()}
        {this.renderUnitList()}
      </div>
    );
  }
}

export default UnitStatistics;
