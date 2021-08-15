import React, { PureComponent } from 'react';
import { Icon, Tooltip as ATooltip } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import Measure from 'react-measure';
import { Chart, Geom, Axis, Tooltip, Coord, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import { isEmpty } from 'lodash';
import { connect } from 'dva';
// import IconFont from 'components/CommonModule/IconFont';
import Img from '@/components/My/Img';
import { router } from '@/utils';

@connect(({ home: { communitySurvey }, workbench: { curCommunityInfo } }) => ({
  communitySurvey,
  curCommunityInfo,
}))
class CommunityOverview extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      image: [],
      openImage: false,
      closed: false,
      dimensions: {
        // width: -1,
        // height: -1,
        width: 1003,
        height: 1003,
      },
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  renderItem = () => {
    const {
      personCount,
      houseCount,
      carCount,
      companyCount,
      powerCount,
      // deviceCount,
    } = this.props.communitySurvey;
    const items = [
      {
        icon: 'icon-peoplenum',
        total: personCount.keyValue + '人',
        children: personCount.children,
      },
      {
        icon: 'icon-shop',
        total: companyCount.keyValue + '间',
        children: companyCount.children,
      },
      {
        icon: 'icon-house',
        total: houseCount.keyValue + '间',
        children: houseCount.children,
      },
      {
        icon: 'icon-power',
        total: powerCount.keyValue + '人',
        children: powerCount.children,
      },
      {
        icon: 'icon-car',
        total: carCount.keyValue + '辆',
        children: carCount.children,
      },
      // {
      //   icon: 'icon-monitor',
      //   total: deviceCount.keyValue,
      //   children: deviceCount.children,
      // },
      {
        icon: 'icon-monitor',
        total: this.props.communitySurvey.deviceTotalCount + '台',
        children: [
          { keyName: '道闸', keyValue: this.props.communitySurvey.deviceCarCount, children: null },
          { keyName: '门禁', keyValue: this.props.communitySurvey.deviceDoorCount, children: null },
        ],
      },
    ];

    const itemCpts = items.map((item, index) => {
      const { icon, total, children } = item;
      let cpts = null;
      if (children && Array.isArray(children)) {
        cpts = children.map((c, index) => {
          return <span key={'children ' + index}>{`${c.keyName} : ${c.keyValue}`}</span>;
        });
      }

      return (
        <div key={index} className={classNames(styles.itemr, 'borderBottom')}>
          <div className={styles.image}>
            <i className={classNames('iconfont', icon)} style={{ color: 'white' }} />
          </div>
          <div className={styles.content}>
            <span>{total}</span>
            <div className={styles.contentBottom}>{cpts}</div>
          </div>
        </div>
      );
    });

    return <div className={styles.infoRight}>{itemCpts}</div>;
  };

  renderInfo = () => {
    const { villageAddress, villageImage, policeName } = this.props.communitySurvey;

    return (
      <div className={classNames(styles.info, 'borderBottom')}>
        <div className={classNames(styles.infoLeft, 'flexColCenter')}>
          <Img
            image={villageImage}
            defaultImg={require('@/assets/images/noimg.png')}
            className={styles.image}
          />
          <ATooltip title={villageAddress} placement={'top'}>
            <div className={styles.item}>
              <div className={styles.icon}>
                <i
                  className={classNames('iconfont', 'icon-address')}
                  title="小区地址"
                  style={{ color: 'white' }}
                />
              </div>
              <div className={styles.title}>
                <span>{villageAddress}</span>
              </div>
            </div>
          </ATooltip>

          {/* <div className={styles.item}>
            <div className={styles.icon}>
              <i className={classNames('iconfont', 'icon-phone')} style={{ color: 'white' }} />
            </div>
            <div className={styles.title}>
              <span>{villagePhone}</span>
            </div>
          </div> */}
          <div className={styles.item}>
            <div className={styles.icon}>
              <i
                className={classNames('iconfont', 'icon-name')}
                style={{ color: 'white' }}
                title="民警姓名"
              />
            </div>
            <div className={styles.title}>
              <span>{policeName}</span>
            </div>
          </div>
        </div>
        {this.renderItem()}
      </div>
    );
  };

  renderChart = () => {
    return (
      <Measure
        bounds
        onResize={contentRect => {
          this.setState({ dimensions: contentRect.bounds });
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} className={styles.chart}>
            <div className={styles.chartItem} style={{ flex: 1 }}>
              {this.renderBar()}
            </div>
            <div className={styles.chartItem}>{this.renderPie2()}</div>
          </div>
        )}
      </Measure>
    );
  };

  renderBar = () => {
    const { personFbs } = this.props.communitySurvey;
    let data = personFbs || [];
    let sliceData = [];
    if (data.length > 0) {
      sliceData = data.slice(0, 10);
    }
    const cols = {
      counts: {
        tickCount: 5,
        // tickInterval: 100,
      },
    };

    const labelH = {
      offset: 20,
      // interval: 0,
      minInterval: 0,
      rotate: 10,
      textStyle: {
        textAlign: 'center', // 文本对齐方向，可取值为： start center end
        fill: 'white', // 文本的颜色
        fontSize: '12',
        textBaseline: 'bottom', // 文本基准线，可取 top middle bottom，默认为middle
      },
      autoRotate: true,
    };
    const labelS = {
      offset: 20,
      // interval: 0,
      minInterval: 0,
      rotate: 0,
      textStyle: {
        textAlign: 'start', // 文本对齐方向，可取值为： start center end
        fill: 'white', // 文本的颜色
        textBaseline: 'top', // 文本基准线，可取 top middle bottom，默认为middle
      },
      autoRotate: true,
    };

    const { width, height } = this.state.dimensions;
    // const w = width * 0.42;
    const w = width * 0.62;
    const h = height * 0.7;
    return (
      <Chart width={w} height={h} data={sliceData} scale={cols} padding={[10, 0, 30, 30]}>
        <span className="main-title" style={styles.mainTitle}>
          户籍地统计
        </span>
        <Axis name="name" label={labelH} />
        <Axis name="counts" label={labelS} />
        <Tooltip
          crosshairs={{
            type: 'y',
            style: {
              stroke: '#fff',
            },
          }}
          itemTpl={
            '<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>总人数: {value}人</li>'
          }
        />
        <Geom
          type="interval"
          position="name*counts"
          style={{
            width: 1,
          }}
        />
      </Chart>
    );
  };

  renderPie2 = () => {
    const { personAgeFbsFormat } = this.props.communitySurvey;
    const { DataView } = DataSet;
    const num = personAgeFbsFormat.total;
    const data = personAgeFbsFormat.lists || [];
    const dv = new DataView();
    dv.source(data).transform({
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
    const { width, height } = this.state.dimensions;
    const w = width * 0.26;
    const h = height * 0.7;
    return (
      <Chart
        style={{ marginLeft: 40 }}
        width={w}
        height={h}
        data={dv}
        scale={cols}
        padding={[10, 20, 10, -80]}
      >
        <span className="main-title" style={styles.mainTitle}>
          年龄占比分析
        </span>
        <Coord type="theta" radius={0.75} />
        <Axis name="percent" />
        <Legend position="right" offsetY={0} offsetX={-60} clickable={false} />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Geom
          type="intervalStack"
          position="percent"
          color="ageRange"
          tooltip={[
            'ageRange*percent',
            (item, percent) => {
              percent = parseInt(percent * num) + '人';
              return {
                name: item,
                value: percent,
              };
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        />
      </Chart>
    );
  };

  renderHeader = () => {
    const { curCommunityInfo } = this.props;

    return (
      <div className={classNames(styles.header, 'flexBetween', 'borderBottom')}>
        <span>{curCommunityInfo.name}</span>
        <div className={styles.close} onClick={this.onClose}>
          <Icon type={'close'} />
        </div>
      </div>
    );
  };

  render() {
    const closed = this.props.closed;
    if (closed) {
      return null;
    }

    const { communitySurvey } = this.props;
    if (isEmpty(communitySurvey)) {
      return null;
    }

    return (
      <div className={styles.container}>
        {this.renderHeader()}
        {this.renderInfo()}
        {this.renderChart()}
      </div>
    );
  }

  onClickImportPie = e => {
    const { curCommunityInfo } = this.props;
    router.push({
      pathname: '/dashboard/generalservice/importancePerson',
      query: { villageId: curCommunityInfo.id },
    });
  };

  fetchData = () => {
    const { dispatch, curCommunityInfo } = this.props;
    dispatch({
      type: 'home/getCommunitySurvey',
      payload: { villageId: curCommunityInfo.id },
    });
  };

  onClose = () => {
    this.props.send(true);
  };
}

export default CommunityOverview;
