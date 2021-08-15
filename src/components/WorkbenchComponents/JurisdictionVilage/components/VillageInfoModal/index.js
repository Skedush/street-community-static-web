import React, { Component } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { Badge, Icon, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { router, judgeLevels } from '@/utils';
import { isEmpty } from 'lodash';

const mapStateToProps = state => {
  return {
    loading: state.loading.effects['workbench/getVillageInfo'],
    state,
  };
};

@connect(mapStateToProps, {})
class VillageInfoModal extends Component {
  echartRef;

  highLight = 0;

  intervalTimer;
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      loading: false,
    };
  }

  componentDidMount() {
    // this.intervalTimer = setInterval(() => {
    //   if (this.echartRef) {
    //     this.echartRef.dispatchAction({
    //       type: 'downplay',
    //       seriesIndex: 0,
    //       dataIndex: this.highLight,
    //     });
    //     this.highLight = ++this.highLight % 4;
    //     this.echartRef.dispatchAction({
    //       type: 'highlight',
    //       seriesIndex: 0,
    //       dataIndex: this.highLight,
    //     });
    //   }
    // }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalTimer);
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { analyzeData, loading } = this.props;
    const personTagCodeMap = {
      户籍人口: '1304',
      流动人口: '1303',
      外籍人口: '1305',
      其他人口: '1301',
    };
    const navRouterMap = {
      布控预警: '/dashboard/generalservice/warning',
      流口管控: '/dashboard/generalservice/float/personnel',
      户籍管控: '/dashboard/generalservice/household/register',
      异常行为: '/dashboard/generalservice/abnormal/behavior',
    };
    if (loading) {
      return (
        <div className={classNames(styles.body)}>
          <div className={styles.loading}>
            <Spin indicator={<Icon type={'loading'} style={{ fontSize: 40 }} spin />} />
          </div>
        </div>
      );
    }

    if (isEmpty(analyzeData)) {
      return (
        <div className={classNames(styles.body)}>
          <div className={styles.loading}>开放式小区无数据!</div>
        </div>
      );
    }
    return (
      <div className={classNames(styles.body)}>
        {analyzeData.errorMessage && (
          <div className={styles.alarm}>
            <Icon type="clock-circle" theme="filled" color={'#fd595a'} />
            <label>{analyzeData.errorMessage}</label>
          </div>
        )}
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <ReactEcharts
              ref={instance => {
                if (instance) {
                  this.echartRef = instance.getEchartsInstance();
                }
              }}
              style={{ height: '100%', width: '100%' }}
              option={this.getOption()}
            />
          </div>
          <div className={styles.topRight}>
            住户分析
            <div
              className={styles.personCount}
              onClick={() => this.navPopulation(personTagCodeMap['户籍人口'])}
            >
              <Badge color={'#2a84ff'} text={'户籍人口'} />
              {(analyzeData.domicileCount * 100 || 0).toFixed(1)}%
            </div>
            <div
              className={styles.personCount}
              onClick={() => this.navPopulation(personTagCodeMap['流动人口'])}
            >
              <Badge color={'#ffc233'} text={'流动人口'} />
              {(analyzeData.rentCount * 100 || 0).toFixed(1)}%
            </div>
            <div
              className={styles.personCount}
              onClick={() => this.navPopulation(personTagCodeMap['外籍人口'])}
            >
              <Badge color={'#ff9333'} text={'外籍人口'} />
              {(analyzeData.foreignCount * 100 || 0).toFixed(1)}%
            </div>
            <div
              className={styles.personCount}
              onClick={() => this.navPopulation(personTagCodeMap['其他人口'])}
            >
              <Badge color={'#7688a7'} text={'其他人口'} />
              {(analyzeData.unregisterCount * 100 || 0).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className={styles.center}>智安任务（未处理）</div>
        <div className={styles.bottom}>
          <div
            className={styles.statusItem}
            onClick={() => this.navZhiAnTask(navRouterMap['布控预警'])}
          >
            <span className={styles.key}>布控预警</span>
            <span className={styles.value}>{judgeLevels(analyzeData.surveillance)}</span>
          </div>
          <div
            className={styles.statusItem}
            onClick={() => this.navZhiAnTask(navRouterMap['流口管控'])}
          >
            <span className={styles.key}>流口管控</span>
            <span className={styles.value}>{judgeLevels(analyzeData.personFlow)}</span>
          </div>
          <div
            className={styles.statusItem}
            onClick={() => this.navZhiAnTask(navRouterMap['户籍管控'])}
          >
            <span className={styles.key}>户籍管控</span>
            <span className={styles.value}>{judgeLevels(analyzeData.personRegister)}</span>
          </div>
          <div
            className={styles.statusItem}
            onClick={() => this.navZhiAnTask(navRouterMap['异常行为'])}
          >
            <span className={styles.key}>异常行为</span>
            <span className={styles.value}>{judgeLevels(analyzeData.abnormal)}</span>
          </div>
        </div>
      </div>
    );
  }

  getOption = () => {
    const { analyzeData } = this.props;
    return {
      tooltip: {
        show: true,
        axisPointer: {
          lineStyle: {
            color: '#999',
          },
        },
        formatter: function(params, ticket, callback) {
          const { name, value } = params;
          return name + (value * 100).toFixed(1) + '%';
        },
      },
      series: [
        {
          name: '住户分析',
          type: 'pie',
          // radius: ['65%', '90%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          hoverOffset: 5,
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: '15',
          //     fontWeight: 'bold',
          //     color: '#fff',
          //   },
          // },
          labelLine: {
            show: false,
          },

          color: ['#2a84ff', '#ffc233', '#ff9333', '#7688a7'],
          data: [
            {
              itemStyle: { color: '#2a84ff' },
              value: analyzeData.domicileCount,
              name: `户籍人口`,
            },
            {
              itemStyle: { color: '#ffc233' },
              value: analyzeData.rentCount,
              name: `流动人口`,
            },
            {
              itemStyle: { color: '#ff9333' },
              value: analyzeData.foreignCount,
              name: `外籍人口`,
            },
            {
              itemStyle: { color: '#7688a7' },
              value: analyzeData.unregisterCount,
              name: `其他人口`,
            },
          ],
        },
      ],
    };
  };

  navZhiAnTask = path => {
    const {
      analyzeData: { villageName },
    } = this.props;
    router.push({
      pathname: path,
      query: {
        villageName,
        handleStatus: '2',
      },
    });
  };

  navPopulation = tag => {
    const {
      analyzeData: { villageName },
    } = this.props;
    router.push({
      pathname: '/dashboard/real/population',
      query: {
        personTagCode: tag,
        villageName: villageName,
      },
    });
  };
}

export default VillageInfoModal;
