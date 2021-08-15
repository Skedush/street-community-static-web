import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import { Modal, Spin, Descriptions, Badge } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const { Item } = Descriptions;
const dayStateColorMap = {
  1: '#4AA54F',
  2: '#FF6A6A',
  3: '#FF991B',
  4: '#CCCCCC',
};

@connect(state => {
  const {
    loading: { effects },
    villageGateway: { villageGatewayDetail, villageGatewaySituation },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    getVillageGatewayDetailLoading: effects['villageGateway/getVillageGatewayDetail'],
    getVillageGatewaySituationByDayLoading:
      effects['villageGateway/getVillageGatewaySituationByDay'],
    villageGatewayDetail,
    villageGatewaySituation,
  };
})
class GatewayDetailModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      colTableIndex: 6,
    };
  }

  renderContent() {
    const { villageGatewayDetail, villageGatewaySituation } = this.props;
    const { colTableIndex } = this.state;
    if (!villageGatewayDetail) {
      return null;
    }

    return (
      <div className={classNames('flexColStart', 'flexWrap', 'width100')}>
        <Descriptions title="网关信息" bordered size={'small'} column={2} className={styles.desc}>
          <Item label="网关名称">{villageGatewayDetail.gatewayName}</Item>
          <Item label="所属辖区">{villageGatewayDetail.policeOrganizationName}</Item>
          <Item label="所属小区">{villageGatewayDetail.villageName}</Item>
          <Item label="小区建设年份">{villageGatewayDetail.constructionYear}</Item>
          <Item label="当前状态">{villageGatewayDetail.stateStr}</Item>
          <Item label="最后在线时间">{villageGatewayDetail.onlineTime}</Item>
        </Descriptions>

        <div className={styles.tableTitle}>7日运行情况</div>
        <div className={classNames('flexStart', 'itemCenter', styles.colTable)}>
          {villageGatewayDetail &&
            villageGatewayDetail.gatewayDateStateList.map((item, index) => (
              <div
                key={item.detectDay}
                className={classNames(
                  'flexColStart',
                  'itemCenter',
                  index === colTableIndex ? styles.activeCol : '',
                  styles.col,
                )}
                onClick={() => this.onColClick(item.detectDay, index)}
              >
                <div className={styles.label}>{item.detectDay}</div>
                <div className={styles.content}>
                  <Badge color={dayStateColorMap[item.state]} text={item.stateStr} />
                </div>
              </div>
            ))}
        </div>

        {/* <Descriptions
          title="7日运行情况"
          bordered
          layout="vertical"
          size={'small'}
          column={7}
          className={styles.desc}
        >
          {villageGatewayDetail &&
            villageGatewayDetail.gatewayDateStateList.map(item => (
              <Item key={item.detectDay} label={item.detectDay}>
                <Badge color={dayStateColorMap[item.state]} text={item.stateStr} />
              </Item>
            ))}
        </Descriptions> */}

        {villageGatewaySituation && this.renderBarEcharts()}
      </div>
    );
  }

  renderBarEcharts() {
    const { villageGatewaySituation, getVillageGatewaySituationByDayLoading } = this.props;
    return (
      <Spin
        tip="加载中..."
        spinning={!!getVillageGatewaySituationByDayLoading}
        size="large"
        wrapperClassName={styles.spinstyle}
      >
        <div className={styles.echarts}>
          <div
            className={styles.title}
          >{`${villageGatewaySituation.dayTime}运行情况（当日离线时长：${villageGatewaySituation.offlineTime}）`}</div>
          <ReactEcharts
            option={this.getEchartOption()}
            notMerge={true}
            lazyUpdate={true}
            // onEvents={onEvents}
            style={{ width: '100%', height: '100%', backgroundColor: 'none' }}
          />
        </div>
      </Spin>
    );
  }

  render() {
    const { gatewayDetailModalVisible, getVillageGatewayDetailLoading, cancelModal } = this.props;
    return (
      <Modal
        title="网关详情"
        visible={gatewayDetailModalVisible}
        onCancel={() => {
          this.setState({
            colTableIndex: 6,
          });
          cancelModal();
        }}
        footer={false}
        wrapClassName={classNames(styles.modal)}
        width="60%"
        centered
        style={{ top: '40px' }}
        destroyOnClose={true}
        zIndex={9999}
      >
        <Spin
          tip="加载中..."
          spinning={!!getVillageGatewayDetailLoading}
          size="large"
          wrapperClassName={styles.spinstyle}
        >
          {this.renderContent()}
        </Spin>
      </Modal>
    );
  }

  onColClick = (date, index) => {
    const { villageGatewayDetail } = this.props;
    const dateTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
    this.props.dispatch({
      type: 'villageGateway/getVillageGatewaySituationByDay',
      payload: { id: villageGatewayDetail.id, date: dateTime },
    });
    this.setState({
      colTableIndex: index,
    });
  };

  // eslint-disable-next-line max-lines-per-function
  getEchartOption = () => {
    const { villageGatewaySituation } = this.props;
    const { gatewayDayStateList } = villageGatewaySituation;
    const series = gatewayDayStateList.map((item, index) => {
      return {
        type: 'bar',
        name: item.stateStr,
        stack: '1',
        barWidth: 25,
        data: item.data,
        itemStyle: {
          normal: {
            barBorderRadius: [
              index === 0 ? 5 : 0,
              index === gatewayDayStateList.length - 1 ? 5 : 0,
              index === gatewayDayStateList.length - 1 ? 5 : 0,
              index === 0 ? 5 : 0,
            ],
            color:
              item.stateStr === '在线'
                ? '#4AA54F'
                : item.stateStr === '离线'
                ? '#FF6A6A'
                : '#CCCCCC',
          },
        },
      };
    });

    const option = {
      grid: {
        left: '2%',
        right: '3%',
        top: 0,
        bottom: 0,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function(params, ticket, callback) {
          const showHtm =
            '<span style="height: 10px;width: 10px;margin-right:10px;display: inline-block;border-radius: 50%;background:' +
            params.color +
            '"></span>' +
            params.seriesName +
            '<br/>时间段:' +
            gatewayDayStateList[params.componentIndex].label;

          return showHtm;
        },
      },
      legend: {
        show: true,
        selectedMode: false,
        right: 0,
        icon: 'circle',
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: {
        type: 'value',
        offset: -30,
        interval: 120,
        axisLine: {
          lineStyle: {
            color: '#ffffff',
            fontSize: 20,
          },
          symbol: ['arrow', 'arrow'],
          symbolSize: [9, 10],
          symbolOffset: [-7, 8],
        },
        axisTick: {
          show: true,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: function(value, index) {
            const time = value / 60 < 10 ? '0' + value / 60 : value / 60;
            return time + ':00';
          },
        },
        max: 'dataMax',
      },
      yAxis: {
        data: ['时间'],
        show: false,
        axisLine: {
          show: false,
        },
      },
      series,
    };

    return option;
  };
}

export default GatewayDetailModal;
