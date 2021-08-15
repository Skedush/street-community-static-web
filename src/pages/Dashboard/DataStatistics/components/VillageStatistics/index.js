import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Statistic, Badge } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

@connect(({ dataStatistics: { villageStatistics }, home: { communitySurvey } }) => ({
  villageStatistics,
  communitySurvey,
}))
class VillageStatistics extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, villageStatistics } = this.props;
    dispatch({
      type: 'home/getCommunitySurvey',
      payload: { villageId: villageStatistics.villageId },
    });
  }

  renderBasicStatistics() {
    const { communitySurvey } = this.props;
    if (isEmpty(communitySurvey)) return null;
    const {
      personCount,
      houseCount,
      carCount,
      companyCount,
      powerCount,
      deviceCount,
    } = communitySurvey;
    personCount.icon = 'team';
    personCount.unit = '人';
    houseCount.icon = 'home';
    houseCount.unit = '间';
    carCount.icon = 'car';
    carCount.unit = '辆';
    companyCount.icon = 'shop';
    companyCount.unit = '间';
    powerCount.icon = 'insurance';
    powerCount.unit = '人';
    deviceCount.icon = 'dashboard';
    deviceCount.unit = '台';
    const data = [personCount, houseCount, carCount, companyCount, powerCount, deviceCount];
    const badgeColor = ['#0DB896', '#1AABFF', '#20DCF9', '#CF7B1D'];
    return (
      <div className={classNames('flexAround', 'flexWrap', styles.basic)}>
        {data.map((item, index) => (
          <div key={index} className={classNames('flexColStart', styles.basicItem)}>
            <div className={classNames('flexCenter', 'itemCenter')}>
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
    const { communitySurvey } = this.props;
    if (isEmpty(communitySurvey)) return null;
    const { personAgeFbs = [] } = communitySurvey;
    let dataName = [];
    let dataValue = [];
    if (personAgeFbs.length > 0) {
      personAgeFbs.map(item => {
        let dataObject = {};
        dataName.push(item.ageRange + '岁');
        dataObject.value = item.count;
        dataObject.name = item.ageRange + '岁';
        dataValue.push(dataObject);
      });
    }

    const option = {
      title: {
        show: true,
        text: '年龄占比',
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
        top: 'middle',
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
          name: '人口年龄段',
          type: 'pie',
          radius: [40, '55%'],
          color: ['#0DB896', '#20DCF9', '#1AABFF', '#1A89C6', '#19A9C5', '#406Cd4'],
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

  // eslint-disable-next-line max-lines-per-function
  renderBar() {
    const { communitySurvey } = this.props;
    if (isEmpty(communitySurvey)) return null;
    const { personFbs = [] } = communitySurvey;
    let dataName = [];
    let dataValue = [];
    if (personFbs.length > 0) {
      personFbs.map(item => {
        dataName.push(item.name);
        dataValue.push(item.counts);
      });
    }
    const option = {
      color: ['#566DE3'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '0%',
        top: '16%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c',
            },
          },
          axisLabel: {
            show: true,
            interval: '0',
            textStyle: {
              color: '#fff',
              align: 'center',
              whiteSpace: 'wrap',
            },
            rich: {
              active: {
                height: 18,
                width: 70,
                backgroundColor: '#f0f0f0',
              },
              normal: {
                height: 18,
              },
            },
            color: '#999',
          },
          data: dataName,
        },
      ],
      yAxis: [
        {
          name: '数量',
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            show: true,
            fontSize: 11,
            color: '#D9E5EF',
            margin: 10,
          },
          splitLine: {
            lineStyle: {
              color: '#555E6D',
              type: 'dashed',
            },
          },
        },
      ],
      series: [
        {
          name: '总人数',
          type: 'bar',
          data: dataValue,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#20DCF9' },
              { offset: 1, color: '#0C1833' },
            ]),
          },
        },
      ],
    };
    return (
      <div className={styles.native}>
        <ReactEcharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          className="echarts-for-react"
        />
      </div>
    );
  }

  render() {
    return (
      <div className={classNames(styles.container, 'flexColBetween')}>
        <div className={styles.title}>基础数据</div>
        {this.renderBasicStatistics()}
        <div className={styles.title}>年龄占比分析</div>
        {this.renderPieChart()}
        <div className={styles.title}>户籍地统计</div>
        {this.renderBar()}
      </div>
    );
  }
}

export default VillageStatistics;
