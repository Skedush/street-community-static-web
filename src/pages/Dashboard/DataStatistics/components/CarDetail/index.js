import React, { PureComponent, createRef } from 'react';
import { List, Spin, Tooltip as AntTooltip, Select, Icon, Carousel } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import { isEqual, isEmpty } from 'lodash';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import Img from '@/components/My/Img';
import InfiniteScroll from 'react-infinite-scroller';

const { Option } = Select;

const noInformation = (
  <div className={styles.information}>
    <p>暂无信息...</p>
  </div>
);
@connect(({ commonModel: { carSummary, carRecord, carRecordSum, baseCarInfo }, loading }) => ({
  loading,
  carSummary,
  carRecord,
  carRecordSum,
  baseCarInfo,
}))
class CarPortrait extends PureComponent {
  personCarousel = createRef();
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {
        // 月出入次数统计图标的初始化值
        width: -1,
        height: -1,
      },
      histogramDimensions: {
        width: -1,
        height: -1,
      },
      personnelValue: false,
      portraitID: null,
      hasMore: true,
      loading: false,
      featchType: false,
      currentPage: 1,
    };
    this.doorPage = 0;
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.carId, this.props.carId)) {
      this.fetchData();
    }
  }

  renderRightFirst() {
    const { baseCarInfo } = this.props;
    const village = baseCarInfo.village || [];
    const defaultVillage = [];
    if (village.length <= 1) {
      return null;
    }
    if (village.length > 0) {
      village.map(item => {
        defaultVillage.push(item.id);
      });
    }

    return (
      <div className={classNames('width100', styles.rightFirst)}>
        <div className={classNames('flexEnd')}>
          <div>
            <h3>分析范围</h3>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择小区"
              maxTagCount={1}
              maxTagTextLength={5}
              defaultValue={defaultVillage}
              onChange={this.handleChange}
              optionLabelProp="label"
            >
              {village && village.length > 1
                ? village.map(item => {
                    return (
                      <Option value={item.id} label={item.name} key={item.id}>
                        {item.name}
                      </Option>
                    );
                  })
                : null}
            </Select>
          </div>
        </div>
      </div>
    );
  }

  renderOwnerList() {
    const { carSummary } = this.props;
    if (!carSummary) {
      return null;
    }
    return (
      <div className={styles.ownInfo}>
        <div className={classNames('flexStart', 'itemCenter', styles.title)}>
          <Icon type="info-circle" theme="filled" className={styles.icon} />
          <div className={styles.text}>
            车主信息{'(' + carSummary.ownerList.length + ')' || '（0）'}
          </div>
        </div>
        {carSummary && carSummary.ownerList.length > 0 && (
          <div className={classNames(styles.carousel)}>
            <Icon type="left" className={styles.left} onClick={() => this.personCarousel.prev()} />
            <Icon
              type="right"
              className={styles.right}
              onClick={() => this.personCarousel.next()}
            />

            <Carousel
              dots={false}
              ref={div => {
                this.personCarousel = div;
              }}
            >
              {carSummary.ownerList.map((item, index) => {
                return (
                  <div key={index}>
                    <div
                      className={classNames(styles.text, 'flexColCenter')}
                      onClick={() => this.onPersonClick(item.id)}
                    >
                      <div>车主姓名：{item.name}</div>
                      <div>小区地址：{item.address}</div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </div>
        )}
      </div>
    );
  }

  renderLeft() {
    const baseCarInfo = this.props.baseCarInfo;
    if (!baseCarInfo || !baseCarInfo.car) {
      return null;
    }
    let registerTypeTitle = '';
    try {
      if (baseCarInfo.car.registerTypeStr.length > 1) {
        registerTypeTitle = baseCarInfo.car.registerTypeStr.map((el, index) => {
          return (
            <span key={index}>
              {el.villageName}:{el.value};
              <br />
            </span>
          );
        });
      }
    } catch (error) {
      registerTypeTitle = '';
    }
    return (
      <div className={classNames('flexColStart', styles.porLeft)}>
        <div className={classNames('flexStart', styles.leftTop)}>
          <Img
            image={require('@/assets/images/carImg.png')}
            defaultImg={require('@/assets/images/carImg.png')}
            className={styles.photo}
          />
          <div className={classNames('flexColBetween')}>
            <div className={styles.licensePlate}>
              {baseCarInfo.car ? baseCarInfo.car.licensePlate || '' : ''}
            </div>
            <div className={styles.registerType}>
              <span>登记方式：</span>
              <span>
                {(baseCarInfo.car.registerTypeStr &&
                  baseCarInfo.car.registerTypeStr.length &&
                  baseCarInfo.car.registerTypeStr[0].value) ||
                  ''}
                {baseCarInfo.car.registerTypeStr &&
                baseCarInfo.car.registerTypeStr.length &&
                baseCarInfo.car.registerTypeStr.length > 1 ? (
                  <AntTooltip
                    className={styles.hoverTitle}
                    title={<div>{registerTypeTitle}</div>}
                    placement={'top'}
                    overlayClassName={styles.toolTip}
                  >
                    {baseCarInfo.car.registerTypeStr.length}
                  </AntTooltip>
                ) : (
                  ''
                )}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.carInfo}>
          <div className={classNames('flexStart', 'itemCenter', styles.title)}>
            <Icon type="car" theme="filled" className={styles.icon} />
            <div className={styles.text}>相关信息</div>
          </div>
          <div className={classNames('flexBetween', 'flexWrap')}>
            <div className={styles.item}>
              车牌颜色：
              {baseCarInfo.car ? baseCarInfo.car.licenseColorStr || '' : ''}
            </div>
            <div className={styles.item}>
              车辆品牌：
              {baseCarInfo.car ? baseCarInfo.car.brand || '' : ''}
            </div>
            <div className={styles.item}>
              车辆款型：
              {baseCarInfo.car ? baseCarInfo.car.spec || '' : ''}
            </div>
            <div className={styles.item}>
              车辆颜色：
              {baseCarInfo.car ? baseCarInfo.car.color || '' : ''}
            </div>
          </div>
        </div>
        {this.renderOwnerList()}
      </div>
    );
  }

  renderEntranceGuard() {
    const { carRecord, carRecordSum } = this.props;
    const loading = this.props.loading.effects['commonModel/getCarRecord'];

    return (
      <Spin tip="" spinning={loading} size="large" wrapperClassName={styles.spinstyle}>
        <div className={classNames('flexBetween', 'itemCenter', styles.rightTopTitle)}>
          <h3>道闸记录</h3>
          <h3>(道闸记录总条数:{carRecordSum}) </h3>
        </div>
        <div className={classNames('flexAuto', styles.rightTopTextBox)}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={1}
            loadMore={this.handleInfiniteOnLoad}
            // hasMore={!loading && this.state.hasMore}
            hasMore={true}
            useWindow={false}
          >
            {carRecord && carRecord.length > 0 ? (
              <List
                dataSource={carRecord}
                renderItem={(item, index) => (
                  <div className={styles.textDiv} key={index}>
                    <div className={styles.divIndex}>{index + 1}</div>
                    <div className={styles.divCon}>
                      <p>进出类型：{item.directionStr}</p>
                      <p>关卡：{item.deviceName}</p>
                      <p>地址：{item.villageName}</p>
                      <p>
                        {item.directionStr}时间：{item.recordTime}
                      </p>
                    </div>
                  </div>
                )}
              />
            ) : !loading ? (
              noInformation
            ) : (
              ''
            )}
          </InfiniteScroll>
        </div>
      </Spin>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderRightTop() {
    const { carSummary } = this.props;
    if (!carSummary || !carSummary.countByHoursChart) {
      return null;
    }
    let { countByHoursChart } = carSummary;
    const xData = countByHoursChart.fields;
    let inData = countByHoursChart.data.filter(item => item.name === '进入')[0];
    let outData = countByHoursChart.data.filter(item => item.name === '离开')[0];
    inData = Object.values(inData).filter(item => typeof item === 'number');
    outData = Object.values(outData).filter(item => typeof item === 'number');
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['进入', '离开'],
        show: true,
        right: '1%',
        y: '12px',
        itemHeight: 15,
        itemStyle: {
          color: 'rgba(11, 25, 52, 1)',
        },
        textStyle: {
          color: '#aaa',
        },
      },
      grid: {
        left: '3%',
        right: '12%',
        bottom: '5%',
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#aaa',
          },
          rotate: -25,
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        name: '单位：次',
        minInterval: 1,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#aaa',
          },
        },
        axisLabel: {
          textStyle: {
            color: '#aaa',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#aaa',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: '进入',
          type: 'line',
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

          data: inData,
        },
        {
          name: '离开',
          type: 'line',
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
          data: outData,
        },
      ],
    };
    return (
      <div className={classNames('flexColStart', 'flexAuto', 'width50')}>
        <h3>月出入时间段统计</h3>
        <div className={'flexAuto'}>
          <ReactEcharts
            option={option}
            lazyUpdate={true}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderLeftTop() {
    const { carSummary } = this.props;
    if (!carSummary || !carSummary.countByDaysChart) {
      return null;
    }
    const xData = carSummary.countByDaysChart.fields.map(item => item.replace(/号/, ''));
    let inData = carSummary.countByDaysChart.data.filter(item => item.name === '进入')[0];
    let outData = carSummary.countByDaysChart.data.filter(item => item.name === '离开')[0];
    inData = Object.values(inData).filter(item => typeof item === 'number');
    outData = Object.values(outData).filter(item => typeof item === 'number');
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['进入', '离开'],
        show: true,
        right: '6%',
        y: '12px',
        itemStyle: {
          color: 'rgba(11, 25, 52, 1)',
        },
        itemHeight: 15,
        textStyle: {
          color: '#aaa',
        },
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '8%',
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#aaa',
          },
          rotate: -25,
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        name: '单位：次',
        minInterval: 1,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#aaa',
          },
        },
        axisLabel: {
          textStyle: {
            color: '#aaa',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#aaa',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: '进入',
          type: 'line',
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

          data: inData,
        },
        {
          name: '离开',
          type: 'line',
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
          data: outData,
        },
      ],
    };

    return (
      <div className={classNames('flexColStart', 'flexAuto', 'width50')}>
        <h3>月出入次数统计</h3>

        <div className={'flexAuto'}>
          <ReactEcharts
            option={option}
            notMerge={true}
            lazyUpdate={true}
            // onEvents={onEvents}
            style={{ width: '100%', height: '100%', backgroundColor: 'none', margin: '0' }}
          />
        </div>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const loading = this.props.loading.effects['commonModel/getBaseCar'];

    return (
      <div className={classNames(styles.container, 'flexColStart')}>
        <div className={classNames('flexBetween', 'itemCenter', styles.top)}>
          <div className={styles.title}>车辆信息</div>
          <div className={styles.close} onClick={this.handleCancel}>
            <Icon type="close" />
          </div>
        </div>
        <Spin spinning={!!loading} size="large" wrapperClassName={styles.spinstyle}>
          <div className={classNames(styles.content, 'flexAuto', 'flexStart')}>
            {this.renderLeft()}
            <div className={classNames('flexColStart', styles.porRight)}>
              {this.renderRightFirst()}
              <div className={classNames(styles.rightChart, 'flexBetween')}>
                {this.renderLeftTop()}
                {this.renderRightTop()}
              </div>
              <div className={classNames('flexAuto', styles.rightBottom, 'flexColStart')}>
                {this.renderEntranceGuard()}
              </div>
            </div>
          </div>
        </Spin>
      </div>
    );
  }

  sendVisible = val => {
    this.props.sendVisible(val);
    this.setState({
      personnelValue: false,
      featchType: !this.state.featchType,
    });
  };

  // eslint-disable-next-line max-lines-per-function
  fetchData = () => {
    const { dispatch, carId } = this.props;
    this.setState({
      currentPage: 1,
    });

    // 车辆基础信息
    dispatch({
      type: 'commonModel/getBaseCar',
      payload: { id: carId },
    }).then(res => {
      if (res && res.data) {
        // 车辆其他信息
        const baseCarInfo = res.data;
        let villageIds = [];
        const village = baseCarInfo.village;
        if (village.length > 0) {
          village.map(item => {
            villageIds.push(item.id);
          });
        }
        this.setState({ villageIds: villageIds.toString(), currentPage: 1 });
        dispatch({
          type: 'commonModel/getCarSummary',
          payload: {
            id: carId,
            villageIds: villageIds.toString(),
          },
        });
        dispatch({
          type: 'commonModel/getCarRecord',
          payload: {
            carId: this.props.carId || null,
            villageIds: villageIds.toString(),
          },
        });
      }
    });

    dispatch({
      type: 'commonModel/getShowTag',
      payload: {
        targetId: carId,
        type: '2', // 车辆
      },
      setTag: 'setCarTag',
    });
  };

  handleChange = value => {
    // 车辆基础信息
    const { dispatch, carId } = this.props;
    this.setState({ villageIds: value.toString() });
    // 车辆其他信息
    dispatch({
      type: 'commonModel/getCarSummary',
      payload: {
        id: carId,
        villageIds: value.toString(),
      },
    });
    dispatch({
      type: 'commonModel/getCarRecord',
      payload: {
        carId: this.props.carId || null,
        villageIds: value.toString(),
      },
    });
  };

  onPersonClick = id => {
    const { onPersonClick } = this.props;
    onPersonClick({ personId: id, detailShow: 'person' });
  };

  handleCancel = () => {
    const { onCloseModal } = this.props;
    onCloseModal();
  };

  // 道闸记录的下拉
  handleInfiniteOnLoad = page => {
    const { loading } = this.state;

    if (loading) {
      return;
    }
    const { carId, dispatch, carJudgeType } = this.props;
    // this.setState({
    //   loading: true,
    // });
    if (carJudgeType) {
      // this.doorPage = 0;
      this.props.changeType();
    }
    if (page > 10) {
      return;
    }
    const newPage = page - 1;
    dispatch({
      type: 'commonModel/getCarRecord',
      payload: {
        carId: carId || null,
        page: newPage,
        villageIds: this.state.villageIds || '',
        size: 10,
      },
    })
      .then(res => {
        if (!isEmpty(res.content)) {
          // this.doorPage++;
          this.setState({
            loading: false,
          });
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };
}

export default CarPortrait;
