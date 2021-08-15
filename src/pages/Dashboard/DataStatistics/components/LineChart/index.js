import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import TimerMixin from 'react-timer-mixin';
import { decorate as mixin } from 'react-mixin';
import classNames from 'classnames';
import styles from './index.less';

@connect(({ dataStatistics: { eventGrowing } }) => ({
  eventGrowing,
}))
@mixin(TimerMixin)
class LineChart extends Component {
  // eslint-disable-next-line max-lines-per-function
  constructor(props) {
    super(props);
    this.state = {};

    this.faultByHourIndex = 0;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataStatistics/getEventGrowingStatistics',
    });
    this.action();
  }
  // eslint-disable-next-line max-lines-per-function
  render() {
    const { eventGrowing, className, title } = this.props;
    this.option = {
      grid: {
        left: '9%',
        right: '1%',
        top: '15%',
        bottom: '20%',
      },
      tooltip: {
        trigger: 'axis',
        label: {
          show: true,
        },
      },
      xAxis: {
        boundaryGap: true,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
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
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        data: eventGrowing.monthList,
      },
      legend: {
        show: true,
        icon: 'roundRect',
        right: '1%',
        y: '12px',
        itemWidth: 15,
        itemHeight: 15,
        textStyle: {
          color: '#FFF',
        },
        data: ['当月新增', '当月完结'],
      },
      yAxis: {
        type: 'value',
        name: '单位：件/月',
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
      series: [
        {
          name: '当月新增',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            color: 'rgb(33,148,246)',
            shadowBlur: 12,
            shadowColor: 'rgb(33,148,246,0.9)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          itemStyle: {
            color: 'rgb(33,148,246)',
            borderWidth: 1,
            borderColor: '#FFF',
          },
          label: {
            show: false,
            distance: 1,
          },
          data: eventGrowing.growingCountList,
        },
        {
          name: '当月完结',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            color: '#27FFFC',
            shadowBlur: 12,
            shadowColor: 'rgb(39,255,252,0.9)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          itemStyle: {
            color: 'rgb(39,255,252)',
            borderWidth: 1,
            borderColor: '#FFF',
          },
          label: {
            show: false,
            distance: 1,
          },
          data: eventGrowing.receivedCountList,
        },
      ],
    };
    return (
      <div className={classNames(className)}>
        <div className={styles.title}>{title}</div>
        <ReactEcharts
          ref={e => {
            this.echarts_react = e;
          }}
          option={this.option}
          notMerge={true}
          lazyUpdate={true}
          // onEvents={onEvents}
          style={{ width: '100%', height: '100%', backgroundColor: 'none', margin: '0' }}
        />
      </div>
    );
  }

  action() {
    let echartsInstance = this.echarts_react.getEchartsInstance();
    this.setInterval(() => {
      // 使得tootip每隔三秒自动显示
      echartsInstance.dispatchAction({
        type: 'showTip', // 根据 tooltip 的配置项显示提示框。
        seriesIndex: 0,
        dataIndex: this.faultByHourIndex,
      });
      this.faultByHourIndex++;
      // faultRateOption.series[0].data.length 是已报名纵坐标数据的长度
      if (this.faultByHourIndex >= this.props.eventGrowing.monthList.length) {
        this.faultByHourIndex = 0;
      }
    }, 3000);
  }
}

export default LineChart;
