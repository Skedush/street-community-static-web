import React, { PureComponent } from 'react';
import HeadPage from '../HeadPage';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { judgeLevels } from '@/utils';

@connect(({ workbench: { bringRecord } }) => ({
  bringRecord,
}))
class CollectData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/getBringRecord',
    });
  }
  // eslint-disable-next-line max-lines-per-function
  render() {
    const { className, bringRecord, isAccordion = false } = this.props;
    let day = [];
    let carRecord = [];
    let clientRecord = [];
    let doorRecord = [];
    let sum = [];
    if (bringRecord && bringRecord.recordGetResp) {
      bringRecord.recordGetResp.forEach(item => {
        if (item.day && item.day !== '') {
          day.push(item.day);
          let sumItem = item.carRecord + item.clientRecord + item.doorRecord;
          sum.push(sumItem);
          carRecord.push(item.carRecord);
          clientRecord.push(item.clientRecord);
          doorRecord.push(item.doorRecord);
        }
      });
    }
    const option = {
      backgroundColor: '#313f4b',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线
        },
        formatter: function(params) {
          let result = judgeLevels(params[0].data + params[1].data + params[2].data) || 0;
          let params1 = judgeLevels(params[0].data) || 0;
          let params2 = judgeLevels(params[1].data) || 0;
          let params3 = judgeLevels(params[2].data) || 0;
          return (
            '<div style="padding:5px; borderWidth:3px;borderColor:rgba(137,220,255,.3);"><span style="color:rgba(255, 255, 255, 1);fontSize:14x">采集总数</span><span style="color:rgba(34, 194, 254, 1);margin-left:10px;">' +
            result +
            '</span></br><span style="color:rgba(153, 153, 153, 1);fontSize:14x">门禁记录</span><span style="margin-left:10px;">' +
            params1 +
            '</span></br><span style="color:rgba(153, 153, 153, 1);fontSize:14x">车辆记录</span><span style="margin-left:10px;">' +
            params2 +
            '</span></br><span style="color:rgba(153, 153, 153, 1);fontSize:14x">访客记录</span><span style="margin-left:10px;">' +
            params3 +
            '</span></br></div>'
          );
        },
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '1%',
        top: '20%',
        containLabel: true,
      },
      legend: {
        icon: 'circle',
        data: ['采集总数', '门禁记录', '车辆记录', '访客记录'],
        right: 30,
        top: 12,
        selectedMode: false,
        textStyle: {
          color: 'rgba(153, 153, 153, 1)',
          fontSize: 14,
        },
        itemGap: 30,
        orient: 'horizontal',

        itemHeight: 10,
      },
      xAxis: {
        type: 'category',
        data: day,
        axisLine: {
          lineStyle: {
            color: 'rgba(71, 94, 113, 1)',
          },
        },
        axisLabel: {
          interval: 0, // 代表显示所有x轴标签
          textStyle: {
            color: 'rgba(153, 153, 153, 1)', // 坐标的字体颜色
            fontFamily: 'Microsoft YaHei',
          },
        },
        axisTick: {
          // 坐标轴的刻度
          show: false, // 是否显示
        },
      },
      yAxis: {
        type: 'value',
        min: '0',
        minInterval: 1,
        // interval: 200, // 每次增加几个
        // max: '1000',
        axisTick: {
          // 坐标轴的刻度
          show: false, // 是否显示
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(71, 94, 113, 1)',
          },
        },
        axisLabel: {
          textStyle: {
            color: 'rgba(153, 153, 153, 1)', // 坐标的字体颜色
            fontFamily: 'Microsoft YaHei',
          },
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '门禁记录',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: 'rgba(34, 252, 241, 1)',
              barBorderRadius: [18, 18, 0, 0],
            },
          },
          data: doorRecord,
          barMinHeight: 3,
        },
        {
          name: '车辆记录',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: 'rgba(34, 194, 254, 1)',

              barBorderRadius: [18, 18, 0, 0],
            },
          },
          data: carRecord,
          barMinHeight: 3,
        },
        {
          name: '访客记录',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: 'rgba(101, 127, 255, 1)',

              barBorderRadius: [18, 18, 0, 0],
            },
          },
          data: clientRecord,
          barMinHeight: 3,
        },

        {
          name: '采集总数',
          type: 'line',

          symbolSize: 6,
          smooth: false, // 关键点，为true是不支持虚线，实线就用true

          lineStyle: {
            normal: {
              color: 'rgba(34, 194, 254, 1)', // 线条颜色
              type: 'dashed',
            },
          },
          label: {
            show: false,
            position: 'top',
            textStyle: {
              color: '#fff',
            },
          },
          itemStyle: {
            color: '#2A84FF',
            borderColor: 'rgba(34, 194, 254, 1)',
            borderWidth: 3,
          },
          tooltip: {
            show: false,
          },

          data: sum,
        },
      ],
    };
    return (
      <div className={className}>
        {isAccordion ? '' : <HeadPage text={'智安数据'} />}
        <ReactEcharts
          option={option}
          style={{ width: '100%', height: '100%', backgroundColor: 'none' }}
        />
      </div>
    );
  }
}

export default CollectData;
