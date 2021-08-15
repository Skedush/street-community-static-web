import React, { PureComponent } from 'react';
import styles from './index.less';
import { Chart, Geom, Axis, Coord, Label, Legend, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import { connect } from 'dva';

const namespace = 'commonModel';

const mapStateToProps = state => {
  let data = state[namespace].chartVal;
  let chartType = state[namespace].chartType;
  if (chartType === 1) {
    data.forEach(item => {
      if (item.ageRange === 'unknown') {
        item.ageRange = '未知';
      } else if (item.ageRange === '81-') {
        item.ageRange = '81岁以上';
      } else {
        item.ageRange = item.ageRange + '岁';
      }
      return item;
    });
  }

  let num = state[namespace].chartNum;
  return { data, num };
};

const { DataView } = DataSet;
const dv = new DataView();
class DoughnutChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: 260,
    };
    this.resizeHeight = this.resizeHeight.bind(this);
  }

  componentDidMount() {
    this.resizeHeight();
    window.addEventListener('resize', this.resizeHeight);
  }

  render() {
    dv.source(this.props.data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'ageRange',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = parseInt(val * 100) + '%';
          return val;
        },
      },
    };
    return (
      <div className={styles.bigbox}>
        <div
          className={styles.box}
          ref={div => {
            this.chartBox = div;
          }}
        >
          <Chart
            data={dv}
            scale={cols}
            padding={['20', 'auto', 'auto']}
            forceFit
            height={this.state.height}
          >
            <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
            <Tooltip showTitle={false} />
            <Axis name="percent" />
            <Legend
              position="bottom"
              textStyle={{
                fill: '#fff',
              }}
            />
            <Geom
              type="intervalStack"
              position="percent"
              color="ageRange"
              tooltip={[
                'ageRange*percent',
                (item, percent) => {
                  percent = parseInt(percent * this.props.num);
                  return {
                    name: item,
                    value: percent + '人',
                  };
                },
              ]}
            >
              <Label
                content="percent"
                formatter={(val, item) => {
                  return item.point.ageRange + '：' + val;
                }}
                textStyle={{
                  fill: '#fff',
                }}
              />
            </Geom>
          </Chart>
        </div>
      </div>
    );
  }

  resizeHeight() {
    if (this.chartBox && this.chartBox.offsetHeight) {
      this.setState({
        height: parseInt(this.chartBox.offsetHeight * 0.85),
      });
    }
  }
}

export default connect(mapStateToProps)(DoughnutChart);
