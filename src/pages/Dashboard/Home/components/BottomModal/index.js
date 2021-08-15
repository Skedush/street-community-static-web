import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import Img from '@/components/My/Img';
import { Icon, Progress } from 'antd';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import { router } from '@/utils';

@connect(state => {
  const {
    home: { workbenchList },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    workbenchList,
  };
})
class BottomModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getWorkbench',
    });
  }

  // eslint-disable-next-line max-lines-per-function
  renderEcharts(color, title, val) {
    let value = val;
    if (!val) {
      value = 0;
    }
    let option = {
      backgroundColor: '#2C3944',
      series: [
        {
          name: '租户核验率',
          type: 'gauge',
          z: 3,
          min: 0,
          max: 60,
          radius: '150%',
          center: ['50%', '90%'],
          clockwise: true,
          splitNumber: 10, // 刻度数量
          startAngle: 180,
          endAngle: 0,
          axisLine: {
            show: true,
            lineStyle: {
              width: 10,
              color: [
                [
                  value,
                  new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: color,
                    },
                    {
                      offset: 1,
                      color: color,
                    },
                  ]),
                ],
                [1, '#586B7A'],
              ],
            },
          },
          // 分隔线样式。
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          pointer: {
            show: false,
          },
          title: {
            show: true,
            offsetCenter: [0, '-5%'], // x, y，单位px
            textStyle: {
              color: '#fff',
              fontSize: 12,
            },
          },
          // 仪表盘详情，用于显示数据。
          detail: {
            show: true,
            offsetCenter: [0, '-30%'],
            color: '#fff',
            formatter: function(params) {
              // try {
              //   return '60%';
              // } catch {
              //   return '0%';
              // }
              return `${parseInt(value * 100)}%`;
            },
            textStyle: {
              fontSize: 16,
              color: color,
            },
          },
          data: [
            {
              name: title,
              // value: 0.6,
            },
          ],
        },
      ],
    };
    return (
      <ReactEcharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        className="echarts-for-react "
      />
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { workbenchList } = this.props;
    try {
      return (
        <div className={styles.topBox}>
          <div className={classNames(styles.topContentDiv, styles.divPolice)}>
            <div className={styles.policeTop}>
              <div className={styles.portrait}>
                <Img
                  image={''}
                  defaultImg={require('@/assets/images/guanzhurenyuan.png')}
                  className={styles.portraitImage}
                />
              </div>
              <div className={styles.textBox}>
                <p className={styles.textTop}>
                  <span>{workbenchList.personName}</span>
                  <span>社区民警</span>
                </p>
                <p className={styles.textBottom}>{workbenchList.policeOrgName}</p>
              </div>
            </div>
            <div className={styles.policeBottom}>
              <Progress
                strokeColor={{
                  '0%': '#5069E4',
                  '100%': '#22FDF1',
                }}
                percent={parseInt((workbenchList.completeCount / workbenchList.totalCount) * 100)}
                format={percent => `${percent}%`}
              />
              <div className={styles.policeBottomText}>
                <h5>工作事项</h5>
                <div className={styles.policeBottomRight}>
                  <p>
                    <span />
                    <span>已完成</span>
                    <span> {workbenchList.completeCount}</span>
                  </p>
                  <p>
                    <span />
                    <span>总数</span>
                    <span> {workbenchList.totalCount}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames(styles.topContentDiv, styles.Check)}
            onClick={() => this.pushRouter('/dashboard/generalservice/differenthouseholds')}
          >
            <div className={styles.checkEchart}>
              {this.renderEcharts(
                '#22FEF1',
                '户籍人口分析',
                workbenchList.personRegisterOkCount / workbenchList.personRegisterCount,
              )}
            </div>
            <div className={styles.checkBottom}>
              <div>
                <p>总事项</p>
                <p>
                  <span>{workbenchList.personRegisterCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>待办事项</p>
                <p>
                  <span>{workbenchList.personRegisterWaitCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>新增人员</p>
                <p>
                  <span>{workbenchList.personRegisterAddCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>已办事项</p>
                <p>
                  <span>{workbenchList.personRegisterOkCount}</span>
                  <Icon type="right" />
                </p>
              </div>
            </div>
          </div>
          <div
            className={classNames(styles.topContentDiv, styles.Check)}
            onClick={() => this.pushRouter('/dashboard/generalservice/tenantRegistration')}
          >
            <div className={styles.checkEchart}>
              {this.renderEcharts(
                '#22C2FE',
                '流动人口分析',
                workbenchList.personFlowOkCount / workbenchList.personFlowCount,
              )}
            </div>
            <div className={styles.checkBottom}>
              <div>
                <p>总事项</p>
                <p>
                  <span>{workbenchList.personFlowCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>待办事项</p>
                <p>
                  <span>{workbenchList.personFlowWaitCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>新增人员</p>
                <p>
                  <span>{workbenchList.personFlowAddCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>已办事项</p>
                <p>
                  <span>{workbenchList.personFlowOkCount}</span>
                  <Icon type="right" />
                </p>
              </div>
            </div>
          </div>
          <div
            className={classNames(styles.topContentDiv, styles.Check)}
            onClick={() => this.pushRouter('/dashboard/generalservice/manwarning')}
          >
            <div className={styles.checkEchart}>
              {this.renderEcharts(
                '#657FFF',
                '异常预警',
                workbenchList.personOldOkCount / workbenchList.personOldCount,
              )}
            </div>
            <div className={styles.checkBottom}>
              <div>
                <p>总事项</p>
                <p>
                  <span>{workbenchList.personOldCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>待办事项</p>
                <p>
                  <span>{workbenchList.personOldWaitCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>新增人员</p>
                <p>
                  <span>{workbenchList.personOldAddCount}</span>
                  <Icon type="right" />
                </p>
              </div>
              <div>
                <p>已办事项</p>
                <p>
                  <span>{workbenchList.personOldOkCount}</span>
                  <Icon type="right" />
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return null;
    }
  }

  pushRouter = path => {
    router.push(path);
  };
}

export default BottomModal;
