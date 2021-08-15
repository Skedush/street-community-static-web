import React, { PureComponent } from 'react';
import { Modal, List, Spin, Tooltip as AntTooltip, Select } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import { isEqual, isEmpty } from 'lodash';
import DataSet from '@antv/data-set';
import Measure from 'react-measure';

import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import Loader from '@/components/CommonComponent';
import VillagePortrait from '../VillagePortrait';

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
    } else if (!isEqual(prevProps.featchType, this.props.featchType)) {
      this.fetchData();
      // this.setState({ loading: false });
    }
  }

  renderRightFirst() {
    const { baseCarInfo } = this.props;
    const village = baseCarInfo.village || [];
    const defaultVillage = [];
    if (village.length > 0) {
      village.map(item => {
        defaultVillage.push(item.id);
      });
    }
    return (
      <div className={styles.firstTitle}>
        <div
          className={styles.firstLeft}
          style={{ width: village && village.length === 1 ? '100%' : '70%' }}
        ></div>
        {village.length !== 1 ? (
          <div className={styles.firstRight}>
            <h3>分析范围</h3>
            <div>
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
        ) : null}
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderLeft() {
    const baseCarInfo = this.props.baseCarInfo;

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

    const options = baseCarInfo ? (
      <div className={styles.porLeft}>
        <div className={styles.leftTop}>
          <p className={styles.leftTopText}>
            <span className={styles.licensePlate}>
              {baseCarInfo.car ? baseCarInfo.car.licensePlate || '' : ''}
            </span>
          </p>
        </div>
        <div className={styles.leftBottom}>
          <p>
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
          </p>
          <p>
            <span>车牌颜色：</span>
            <span>{baseCarInfo.car ? baseCarInfo.car.licenseColorStr || '' : ''}</span>
          </p>
          <p>
            <span>车辆品牌：</span>
            <span>{baseCarInfo.car ? baseCarInfo.car.brand || '' : ''}</span>
          </p>
          <p>
            <span>车辆款型：</span>
            <span>{baseCarInfo.car ? baseCarInfo.car.spec || '' : ''}</span>
          </p>
          <p>
            <span>车辆颜色：</span>
            <span>{baseCarInfo.car ? baseCarInfo.car.color || '' : ''}</span>
          </p>
        </div>
      </div>
    ) : null;
    return options;
  }

  renderRightTopLeft() {
    const { carSummary } = this.props;
    const options = (
      <div className={styles.rightTopLeft}>
        <div className={styles.rightTopLeftTop}>
          <h3>车主信息</h3>
          <div className={styles.housBigBox}>
            <div className={styles.housBox}>
              {carSummary && carSummary.ownerList
                ? carSummary.ownerList.map((item, index) => (
                    <div key={index} className={styles.textBox}>
                      <div className={styles.carOwnerInfo}>
                        <p className={styles.carOwnerName}>
                          车主姓名：
                          <span
                            onClick={() => this.cillagePortrait(item)}
                            style={{ color: '#22c2fe' }}
                          >
                            {item.name}
                          </span>
                        </p>
                        <p title={item.address}>小区地址：{item.address}</p>
                      </div>
                    </div>
                  ))
                : noInformation}
            </div>
          </div>
        </div>
      </div>
    );
    return options;
  }

  renderEntranceGuard() {
    const { carRecord, carRecordSum } = this.props;
    const loading = this.props.loading.effects['commonModel/getCarRecord'];

    return (
      <div className={styles.rightTopRight}>
        <Spin tip="" spinning={loading} size="large" wrapperClassName={styles.spinstyle}>
          <div className={styles.rightTopTitle}>
            <h3>道闸记录</h3>
            <h3>(道闸记录总条数:{carRecordSum}) </h3>
          </div>
          <div className={styles.rightTopTextBox}>
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
      </div>
    );
  }

  renderHistogram() {
    const { carSummary } = this.props;
    if (!carSummary.countByHoursChart) {
      return null;
    }
    let data = carSummary.countByHoursChart;
    const ds = new DataSet();
    const dv = ds.createView().source(data.data);
    dv.transform({
      type: 'fold',
      fields: data.fields,
      // 展开字段集
      key: '时间段',
      // key字段
      value: '次数', // value字段
    });
    const scale = {
      时间段: {
        range: [0.05, 0.95],
      },
      count: {
        tickCount: 5,
      },
    };
    const { width, height } = this.state.histogramDimensions;
    return (
      <Chart height={height} width={width} scale={scale} data={dv} padding={[30, 35, 50, 35]}>
        <Axis
          name="时间段"
          label={{
            textStyle: {
              textAlign: 'center', // 文本对齐方向，可取值为： start center end
              fill: '#fff', // 文本的颜色
              fontSize: '12', // 文本大小
              textBaseline: 'middle',
            },
          }}
        />
        <Axis
          name="次数"
          label={{
            offset: 15,
            textStyle: {
              textAlign: 'center', // 文本对齐方向，可取值为： start center end
              fill: '#fff', // 文本的颜色
              fontSize: '12', // 文本大小
              textBaseline: 'middle',
            },
          }}
        />
        <Legend offsetY={-15} />
        <Tooltip
          crosshairs={{
            type: 'y',
            style: {
              stroke: '#fff',
            },
          }}
          itemTpl={
            '<li data-index={index}>' +
            '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
            '{name}: {value}次' +
            '</li>'
          }
        />
        <Geom
          type="interval"
          position="时间段*次数"
          color={'name'}
          adjust={[
            {
              type: 'dodge',
              marginRatio: 1 / 32,
            },
          ]}
        />
      </Chart>
    );
  }

  renderRightBottom() {
    return (
      <div className={styles.rightBottomRight}>
        <div className={styles.rightBottomTitle}>
          <h3>月出入时间段统计</h3>
        </div>
        <Measure
          bounds
          onResize={contentRect => {
            this.setState({ histogramDimensions: contentRect.bounds });
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef} className={styles.rightBottomTextBox}>
              <div>{this.renderHistogram()}</div>
            </div>
          )}
        </Measure>
      </div>
    );
  }

  renderLineDiagram() {
    const { carSummary } = this.props;
    if (!carSummary.countByDaysChart) {
      return null;
    }
    // 进行data数组对象的拼接，属性为  name：日期,进入：数量，离开：数量
    let data = carSummary.countByDaysChart.fields.map(function(field) {
      let fieldValue = { name: field.replace(/号/, '') };
      carSummary.countByDaysChart.data.forEach(function(item) {
        fieldValue[item.name] = item[field];
      });
      return fieldValue;
    });
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['进入', '离开'],
      // 展开字段集
      key: 'direction',
      // key字段
      value: 'count', // value字段
    });
    const scale = {
      name: {
        range: [0, 1],
      },
      count: {
        tickCount: 5,
      },
    };
    const { width, height } = this.state.dimensions;
    const options = (
      <Chart width={width} height={height} data={dv} scale={scale} padding={[30, 35, 50, 35]}>
        <Legend offsetY={-15} />
        <Axis
          name="name"
          label={{
            textStyle: {
              textAlign: 'center', // 文本对齐方向，可取值为： start center end
              fill: '#fff', // 文本的颜色
              fontSize: '12', // 文本大小
              textBaseline: 'top', // 文本基准线，可取 top middle bottom，默认为middle
            },
          }}
        />
        <Axis
          name="count"
          label={{
            offset: 15,
            formatter: val => `${val}`,
            textStyle: {
              textAlign: 'center', // 文本对齐方向，可取值为： start center end
              fill: '#fff', // 文本的颜色
              fontSize: '12', // 文本大小
              textBaseline: 'middle', // 文本基准线，可取 top middle bottom，默认为middle
            },
          }}
        />
        <Tooltip
          crosshairs={{
            type: 'y',
            style: {
              stroke: '#fff',
            },
          }}
          itemTpl={
            '<li data-index={index}>' +
            '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
            '{name}: {value}次' +
            '</li>'
          }
        />
        <Geom type="line" position="name*count" size={2} color={'direction'} />
        <Geom
          type="point"
          position="name*count"
          size={4}
          shape={'circle'}
          color={'direction'}
          style={{
            stroke: '#fff',
            lineWidth: 1,
          }}
        />
      </Chart>
    );

    return options;
  }

  renderLeftBottom() {
    return (
      <div className={styles.rightBottomLeft}>
        <h3>月出入次数统计</h3>
        <Measure
          bounds
          onResize={contentRect => {
            this.setState({ dimensions: contentRect.bounds });
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef} className={styles.rightTable}>
              <div>{this.renderLineDiagram()}</div>
            </div>
          )}
        </Measure>
      </div>
    );
  }

  renderVillageProtrait() {
    return (
      <Modal
        title="基本信息"
        visible={this.state.personnelValue}
        onCancel={this.handleCancel}
        footer={false}
        wrapClassName={styles.modalPortrait}
        // destroyOnClose={true}
      >
        <VillagePortrait
          portraitID={this.state.portraitID}
          carVisiblePortait={this.sendVisible}
          featchType={this.state.featchType}
        />
      </Modal>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const loading = this.props.loading.effects['commonModel/getBaseCar'];
    if (loading || !this.props.carSummary) {
      return Loader.renderLoading();
    }

    return (
      <div className={styles.porBox}>
        {this.renderLeft()}
        <div className={styles.porRight}>
          <div className={styles.rightFirst}>{this.renderRightFirst()}</div>{' '}
          <div className={styles.rightTop}>
            {this.renderRightTopLeft()}
            {this.renderEntranceGuard()}
          </div>
          <div className={styles.rightBottom}>
            {this.renderLeftBottom()}
            {this.renderRightBottom()}
          </div>
        </div>
        {this.renderVillageProtrait()}
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

  // 人员画像
  cillagePortrait = val => {
    if (this.props.sendPortaitVisible) {
      this.props.sendPortaitVisible(false);
    }
    this.setState({
      personnelValue: true,
      portraitID: val.id,
      featchType: !this.state.featchType,
    });
  };

  //
  handleCancel = () => {
    this.setState({
      personnelValue: false,
    });
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
