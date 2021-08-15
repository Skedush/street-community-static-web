/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

class BrokenCountyChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // eslint-disable-next-line max-lines-per-function
  render() {
    const { xAxis, series, className, title, legend, yAxisName, grid, color } = this.props;
    const option = {
      title: {
        show: true,
        text: title || [],
        textStyle: {
          color: color || '#fff',
        },
      },
      grid: grid,
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
        data: legend,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: '#999',
          interval: '0',
          textStyle: {
            color: '#999',
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
            color: '#35424b',
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
        data: xAxis || [],
      },

      yAxis: {
        type: 'value',
        name: yAxisName,
        min: 0,
        // max: 1000,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#999',
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
            color: '#35424b',
          },
        },
      },

      series: series,
    };
    return (
      <div className={classNames(className)} style={{ height: '100%' }}>
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

export default BrokenCountyChart;
