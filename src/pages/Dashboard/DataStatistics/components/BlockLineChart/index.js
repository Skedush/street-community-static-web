/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import ReactEcharts from 'echarts-for-react';
import styles from './index.less';
import echarts from 'echarts';
import { connect } from 'dva';
import { isEmpty } from 'lodash-es';

@connect(({ dataStatistics: { deviceRecord } }) => ({
  deviceRecord,
}))
class BlockLineChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataStatistics/getScreenDeviceRecord',
    });
  }
  // eslint-disable-next-line max-lines-per-function
  render() {
    const { className, title, deviceRecord } = this.props;
    if (isEmpty(deviceRecord)) return null;
    const option = {
      title: {
        show: true,
        textStyle: {
          color: '#fff',
        },
      },
      grid: {
        left: '15%',
        right: '4%',
        top: '15%',
        bottom: '15%',
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            color: '#999',
          },
        },
      },
      legend: {
        show: true,
        right: '5%',
        y: '15',
        icon: 'roundRect',
        itemWidth: 15,
        itemHeight: 15,
        textStyle: {
          color: '#FFF',
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: '#999',
          interval: '0',
          textStyle: {
            color: '#aaa',
            align: 'center',
            whiteSpace: 'wrap',
            lineHeight: 15,
            height: 50,
            fontSize: 12,
          },
          formatter: function(params, index) {
            var newParamsName = '';
            var paramsNameNumber = params && params.length;

            var provideNumber = 6; // 一行显示几个字
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber) || 0;
            if (paramsNameNumber > provideNumber) {
              for (var p = 0; p < rowNumber; p++) {
                var tempStr = '';
                var start = p * provideNumber;
                var end = start + provideNumber;
                if (p === rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + '\n';
                }
                newParamsName += tempStr;
              }
            } else {
              newParamsName = params;
            }

            return newParamsName;
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#aaa',
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#fff',
          },
        },
        data: deviceRecord.days,
      },

      yAxis: {
        type: 'value',
        name: '单位：名称',
        min: 0,
        // max: 1000,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#aaa',
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#fff',
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#666',
            type: 'dashed',
          },
        },
      },

      series: {
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: {
          normal: {
            color: '#27CAFF',
            lineStyle: {
              color: '#27CAFF',
              width: 1,
            },
            areaStyle: {
              // color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(7,44,90,0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(0,146,246,0.9)',
                },
              ]),
            },
          },
        },
        data: deviceRecord.counts,
      },
    };
    return (
      <div className={classNames(className, 'flexColStart')}>
        <div className={styles.title}>{title}</div>
        <ReactEcharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          // onEvents={onEvents}
          style={{ width: '100%', height: '100%', backgroundColor: 'none' }}
        />
      </div>
    );
  }
}

export default BlockLineChart;
