import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
// import { router } from '@/utils';

class PieChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    let data = [];
    this.props.data.children.forEach(item => {
      let obj = {};
      obj.name = item.keyName;
      obj.value = item.keyValue;
      data.push(obj);
    });
    this.option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '{b} : {d}% <br/> {c}',
      },
      title: {
        x: 'center',
        y: '38%',
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#22FCF1',
        },
      },
      emphasis: {},
      legend: {
        show: false,
        width: '70%',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
        icon: 'circle',
        right: '0',
        orient: 'vertical',
        bottom: '0',
        padding: [30, 60],
        itemGap: 40,
        // data: ['测量工', '养护工'],
      },
      series: [
        {
          type: 'pie',
          radius: [parseInt(this.props.height * 0.75), this.props.height],
          center: ['50%', '50%'],
          color: ['#22FCF1', '#22C2FE', '#7688a7'],
          itemStyle: {
            normal: {
              // show: false,
              borderWidth: 5,
              borderColor: '#2C3944',
            },
          },
          hoverAnimation: false,
          data: data,

          labelLine: {
            normal: {
              show: false,
              length: 50,
              length2: 50,
            },
          },
          label: {
            normal: {
              show: false,
            },
          },
        },
      ],
    };
    return (
      <ReactEcharts
        option={this.option}
        notMerge={true}
        lazyUpdate={true}
        // onEvents={onEvents}
        style={{ width: '100%', height: '100%', backgroundColor: 'none' }}
      />
    );
  }
}

export default PieChart;
