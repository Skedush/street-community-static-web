/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { Select, Icon } from 'antd';
import { isEmpty } from 'lodash';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { cityId } from '@/utils/bzConfig';
import { connect } from 'dva';
import router from 'umi/router';

const { Option } = Select;

@connect(({ home: { jobEchartData, jobCompleteData }, commonModel: { constructionYear } }) => ({
  jobEchartData,
  constructionYear,
  jobCompleteData,
}))
class JobEchart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      year: '',
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  // eslint-disable-next-line max-lines-per-function
  render() {
    if (isEmpty(this.props.jobEchartData)) {
      return null;
    }
    const {
      className,
      constructionYear,
      jobEchartData: {
        organizationName,
        errCount,
        implementationCount,
        registerCount,
        useFullCount,
      },
    } = this.props;
    let [implementationCountSum, registerCountSum, useFullCountSum, errCountSum] = [0, 0, 0, 0];
    implementationCount.forEach(item => {
      implementationCountSum += item;
    });
    registerCount.forEach(item => {
      registerCountSum += item;
    });
    useFullCount.forEach(item => {
      useFullCountSum += item;
    });
    errCount.forEach(item => {
      errCountSum += item;
    });
    let defaultCount = '0000';

    let allSum = errCountSum + useFullCountSum + registerCountSum + implementationCountSum;
    allSum = defaultCount.substr(0, 4 - allSum.toString().length) + allSum;

    let onEvents = {
      click: this.onChartClick,
    };
    const option = {
      // backgroundColor: '#344b58',
      title: {
        text: `智安建设 统计日期${moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD')} （小区总数 {b|${allSum}}）`,
        x: '2%',
        top: '4%',
        textStyle: {
          color: '#fff',
          fontSize: '16',
          rich: {
            b: {
              color: '#22c2fe',
              fontSize: '16',
            },
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          textStyle: {
            color: '#fff',
          },
        },
      },
      grid: {
        left: '1%',
        right: '1%',
        top: '20%',
        bottom: '5%',
        containLabel: true,
      },

      legend: {
        x: '50%',
        top: '4%',
        itemWidth: 18,
        itemHeight: 18,
        icon: 'roundRect',
        textStyle: {
          rich: {
            a: {
              color: '#fff',
            },
            b: {
              color: '#22c2fe',
            },
          },
        },
        data: ['已实施', '已登记', '常态使用', '使用异常'],
        formatter: function(name) {
          let count;
          switch (name) {
            case '已实施':
              count = implementationCountSum;
              break;
            case '已登记':
              count = registerCountSum;
              break;
            case '常态使用':
              count = useFullCountSum;
              break;
            case '使用异常':
              count = errCountSum;
              break;
            default:
              break;
          }
          count = defaultCount.substr(0, 4 - count.toString().length) + count;
          return [`{a|${name}}`, `{b|${count}}`].join(' ');
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c',
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          axisLabel: {
            show: true,
            interval: '0',
            textStyle: {
              color: '#999',
              align: 'center',
              whiteSpace: 'wrap',
              lineHeight: 15,
              height: 50,
              fontSize: 10,
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
          data: organizationName,
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#90979c',
            },
          },
          axisLabel: {
            show: true,
            formatter: '{value}',
            textStyle: {
              color: '#999',
            },
          },
          axisTick: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#35424b',
            },
          },
        },
      ],
      series: [
        {
          name: '已实施',
          type: 'bar',
          stack: '总量',
          barWidth: 16,
          barCategoryGap: '2%',
          barGap: 0.4,
          itemStyle: {
            normal: {
              color: '#7688a7',
            },
          },
          data: implementationCount,
        },
        {
          name: '已登记',
          type: 'bar',
          stack: '总量',
          barWidth: 16,
          barCategoryGap: '2%',
          barGap: 0.4,
          itemStyle: {
            normal: {
              color: '#2a84ff',
            },
          },
          data: registerCount,
        },
        {
          name: '常态使用',
          type: 'bar',
          stack: '总量',
          barWidth: 16,
          barCategoryGap: '2%',
          barGap: 0.4,
          itemStyle: {
            normal: {
              color: '#4aa54f',
            },
          },
          data: useFullCount,
        },
        {
          name: '使用异常',
          type: 'bar',
          stack: '总量',
          barGap: 0.4,
          barCategoryGap: '2%',
          barWidth: 16,
          itemStyle: {
            normal: {
              color: '#ff5a5a',
              barBorderRadius: 0,
            },
          },
          data: errCount,
        },
      ],
    };
    return (
      <div className={classNames(className, styles.bigBox)}>
        <ReactEcharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          onEvents={onEvents}
          style={{ width: '100%', height: '100%', backgroundColor: 'none' }}
        />
        <Icon
          type="question-circle"
          className={styles.icon}
          theme="filled"
          title="已实施：指小区在管控平台登记有基本信息。&#10;已登记：指小区的楼栋，单元，房屋每项至少有一条登记记录。&#10;常态化使用：指小区昨天车辆道闸或门禁数据有任何一条记录。&#10;使用异常：指小区昨天车辆道闸和门禁数据均没有记录。"
        />
        <div className={styles.selectBox}>
          <Select
            defaultActiveFirstOption={false}
            placeholder="请选择建设年份"
            className={styles.selectWidth}
            dropdownClassName={classNames('selectDropdown', styles.select)}
            onChange={this.onChange}
          >
            <Option value="" key="" className={'optionSelect'}>
              全部
            </Option>
            {constructionYear.length &&
              constructionYear.map(item => (
                <Option value={item} key={item} className={'optionSelect'}>
                  {item}
                </Option>
              ))}
          </Select>
        </div>
      </div>
    );
  }

  onChange = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getJobEchart',
      payload: { constructionYear: val },
    });
    this.setState({
      year: val,
    });
  };

  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getJobEchart',
    });
    dispatch({
      type: 'commonModel/getVillageConstruction',
    });
  };

  onChartClick = e => {
    const { jobCompleteData } = this.props;
    const { year } = this.state;
    let id = null;
    let policeType = null;
    let payload = [jobCompleteData.organizationId.toString()];
    jobCompleteData.children.find(item => {
      if (item.organizationName && item.organizationName.search('派出所') !== -1) {
        const name = item.organizationName.replace('派出所', '');
        if (name === e.name) {
          id = item.organizationId;
          policeType = true;
        }
      } else {
        if (item.organizationName === e.name) {
          id = item.organizationId;
          policeType = false;
        }
      }
    });
    if (!id) {
      return;
    }
    if (jobCompleteData.organizationId === cityId || jobCompleteData.organizationId === 0) {
      payload = [id.toString()];
    } else {
      payload.push(id);
    }

    router.push({
      pathname: '/dashboard/real/communitymanagement',
      query: {
        organizationId: id,
        constructionYear: year,
        policeType,
        payload,
      },
    });
  };
}

export default JobEchart;
