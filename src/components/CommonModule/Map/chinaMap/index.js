import React, { PureComponent } from 'react';
import _isData from './methods';
import Chart from '../core';
import { maxBy } from 'lodash';
import './china';
// 替换值
const replace = (rows, target) => {
  return rows.map((item, i) => {
    return {
      value: item[target] || 0,
      rank: i + 1,
      ...item,
    };
  });
};
// 倒序排序
const sort = (rows, target) =>
  rows.sort(function(a, b) {
    return b[target] - a[target];
  });
export default class extends PureComponent {
  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      data = {},
      height,
      loading,
      style,
      target,
      seriesName = '',
      tooltipFormatter,
      roam = false,
      unit,
    } = this.props;
    if (!_isData(data)) {
      return (
        <div
          style={{
            width: '100%',
            height,
            color: '#555',
            fontSize: 16,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...style,
          }}
        >
          <span>无数据</span>
        </div>
      );
    }
    const { rows } = data;
    const sortdata = sort(rows, target);
    const seriesdata = replace(sortdata, target);
    const barData = seriesdata.sort((a, b) => b.value - a.value);
    let yData = barData.map(item => item.name);
    yData = yData.slice(0, 10);
    const max = maxBy(seriesdata, o => o.value).value;
    const option = {
      tooltip: {
        trigger: 'item',
        formatter:
          tooltipFormatter ||
          function(params) {
            const { seriesName, name, value, marker } = params;
            return `<div>
                        ${seriesName} <br/>
                        ${marker}
                        ${name}:${(value || '未知') + '(' + unit + ')'}<br/>
                    </div>`;
          },
        backgroundColor: 'rgba(220,220,220,0.9)',
      },
      visualMap: {
        seriesIndex: [0],
        min: 0,
        max,
        left: '10',
        top: 'bottom',
        show: false, // 控制左边竖形条显示隐藏
        // text: ['高', '低'], // 文本，默认为数值文本
        // calculable: true,
        // color: ['#fff', '#fff'],
        inRange: {
          color: ['#4262bf', '#3c54a9', '#2d4795', '#44569b', '#2f3d72'],
        },
        // color: ['orangered', 'yellow', 'lightskyblue'],
      },
      grid: {
        right: '10%',
        top: '5%',
        bottom: '5%',
        width: '10%',
      },
      xAxis: {
        type: 'value',
        scale: true,
        position: 'top',
        splitNumber: 1,
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        // 数据统计刻度
        // axisLabel: {
        //   margin: 0,
        //   textStyle: {
        //     color: '#D9E5EF',
        //   },
        // },
      },
      yAxis: {
        type: 'category',
        nameGap: 16,
        inverse: true,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#ddd',
          },
        },
        axisTick: {
          show: false,
          lineStyle: {
            color: '#ddd',
          },
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: '#D9E5EF',
          },
        },
        data: yData,
      },
      // geo: {
      //     right:'300',
      //     layoutSize: '80%',
      // },
      series: [
        {
          name: seriesName,
          type: 'map',
          geoIndex: 0,
          // top: '3%',
          left: '14%',
          // right: '6%',
          // bottom: '20%',
          mapType: 'china',
          roam, // 鼠标放大缩小
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
              color: '#333',
            },
          },
          // 地图颜色
          itemStyle: {
            normal: {
              areaColor: '#7e9de2',
              borderColor: '#111',
            },
            emphasis: {
              areaColor: '#5e77ff',
            },
          },
          data: seriesdata,
        },
        {
          name: '数据统计',
          type: 'bar',
          roam: false,
          visualMap: false,
          zlevel: 2,
          barMaxWidth: 20,
          itemStyle: {
            normal: {
              color: '#566DE3',
            },
            emphasis: {
              color: '#566DE3',
            },
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              offset: [10, 0],
            },
            emphasis: {
              show: true,
              position: 'right',
              offset: [10, 0],
            },
          },
          data: barData,
        },
      ],
    };
    return <Chart option={option} style={style} showLoading={loading} />;
  }
}
