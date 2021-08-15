/* eslint-disable max-lines-per-function */
import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import { Icon, Spin } from 'antd';
import LdTable from '@/components/My/Table/LdTable';
import { isEmpty, isEqual } from 'lodash';
import LdButton from '@/components/My/Button/LdButton';
import CommonComponent from '@/components/CommonComponent';
import ReactEcharts from 'echarts-for-react';
import Img from '@/components/My/Img';
import echarts from 'echarts';

@connect(({ loading, commonModel: { address, houseSummary } }) => ({
  houseSummary,
  loading: { getHouseSummary: loading.effects['commonModel/getHouseSummary'] },
  address,
}))
class HouseDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: [],
      openImage: false,
      PersonnelValue: false,
      portraitID: null,
      onPlotClickNumber: 0,
      dimensions: {
        width: -1,
        height: -1,
      },
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.houseId, this.props.houseId)) {
      this.fetchData();
    }
  }

  renderCharts() {
    let { ages, tenantAndHouseholdCount } = this.props.houseSummary;
    const { address } = this.props;
    return (
      <div className={classNames(styles.charts)}>
        <span className={classNames('main-title', styles.mainTitle)}>住户分析</span>
        <div className={classNames(styles.chartItem, 'flexAround')}>
          {this.renderPieChart(ages, '年龄占比', '#20DCF9', '#18F4BD')}
          {this.renderPieChart(tenantAndHouseholdCount, '租户占比', '#1A89C6', '#4EB5FF')}
          {this.renderPieChart(address, '户籍地占比', '#004CFF', '#2FA4FA')}
        </div>
      </div>
    );
  }
  renderPieChart(data, title, color1, color2) {
    if (!data) {
      return;
    }
    if (isEmpty(data)) {
      data = [];
      let obj = { name: '浙江省', count: 0, percent: '无数据' };
      data.push(obj);
    }
    const { houseSummary } = this.props;
    let maxItem = data[0];
    let sum = 0;
    data.forEach(function(item) {
      maxItem = item.count > maxItem.count ? item : maxItem;
      sum += item.count;
    });
    maxItem.percent = parseInt((maxItem.count * 100) / houseSummary.housePersonCount)
      ? parseInt((maxItem.count * 100) / houseSummary.housePersonCount) + '%'
      : '无数据';

    const option = {
      title: [
        {
          text: `${title}\n${maxItem.name}`,
          x: 'center',
          bottom: 20,
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '200',
          },
        },
        {
          text: maxItem.percent,
          x: 'center',
          top: '32%',
          textStyle: {
            fontSize: 24,
            color: color2,
            fontFamily: 'Lato',
            foontWeight: '400',
          },
        },
      ],
      polar: {
        radius: ['44%', '50%'],
        center: ['50%', '40%'],
      },
      angleAxis: {
        max: sum,
        show: false,
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: '',
          type: 'bar',
          roundCap: true,
          barWidth: 60,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(66, 66, 66, .3)',
          },
          data: [maxItem.count],
          coordinateSystem: 'polar',

          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: color1 || '#fdf914',
                },
                {
                  offset: 1,
                  color: color2 || '#38a700',
                },
              ]),
            },
          },
        },

        {
          name: '',
          type: 'pie',
          startAngle: 90,
          radius: ['60%', '62%'],
          hoverAnimation: false,
          center: ['50%', '40%'],
          itemStyle: {
            normal: {
              labelLine: {
                show: false,
              },
              color: 'rgba(66, 66, 66, .4)',
              shadowBlur: 10,
              shadowColor: 'rgba(0,76,255, .3)',
            },
          },
          data: [
            {
              value: 120,
            },
          ],
        },
        {
          name: '',
          type: 'pie',
          startAngle: 90,
          radius: ['62.5%', '64%'],
          hoverAnimation: false,
          center: ['50%', '40%'],
          itemStyle: {
            normal: {
              labelLine: {
                show: false,
              },
              color: 'rgba(66, 66, 66, .3)',
              shadowBlur: 10,
              shadowColor: 'rgba(0,76,255, .3)',
            },
          },
          data: [
            {
              value: 100,
            },
          ],
        },
        {
          name: '',
          type: 'pie',
          startAngle: 90,
          radius: ['64.5%', '65.8%'],
          hoverAnimation: false,
          center: ['50%', '40%'],
          itemStyle: {
            normal: {
              labelLine: {
                show: false,
              },
              color: 'rgba(66, 66, 66, .2)',
              shadowBlur: 10,
              shadowColor: 'rgba(0,76,255, .3)',
            },
          },
          data: [
            {
              value: 100,
            },
          ],
        },
        {
          name: '',
          type: 'pie',
          startAngle: 90,
          radius: ['66.5%', '67.5%'],
          hoverAnimation: false,
          center: ['50%', '40%'],
          itemStyle: {
            normal: {
              labelLine: {
                show: false,
              },
              color: 'rgba(66, 66, 66, .1)',
              shadowBlur: 10,
              shadowColor: 'rgba(0,76,255, .3)',
            },
          },
          data: [
            {
              value: 100,
            },
          ],
        },
      ],
    };

    return (
      <div className={classNames(styles.echart)}>
        <ReactEcharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          className="echarts-for-react "
        />
      </div>
    );
  }

  renderTable() {
    let tableData = this.props.houseSummary.houseHolder;
    const columns = [
      {
        title: '住户姓名',
        dataIndex: 'name',
        width: '12%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '住户类型',
        width: '20%',
        dataIndex: 'type',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '入住时间',
        width: '25%',
        dataIndex: 'createTime',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '基本信息',
        width: '12%',
        dataIndex: 'id',
        render: (text, record) => (
          <LdButton type="link" onClick={() => this.personnelPortrait(text)}>
            查看
          </LdButton>
        ),
      },
    ];
    return (
      <LdTable
        type="insideTable"
        loading={this.props.loading.getHouseSummary}
        rowKey={'id'}
        columns={columns}
        pagination={false}
        dataSource={tableData}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        bigWidth={true}
        // scroll={{ y: 400 }}
        className={styles.table}
      />
    );
  }

  render() {
    let {
      houseSummary,
      loading: { getHouseSummary },
    } = this.props;

    return (
      <div className={classNames(styles.container, 'flexColStart', 'colorWhite')}>
        <div className={classNames('flexBetween', 'itemCenter', styles.top)}>
          <div className={styles.title}>房屋信息</div>
          <div className={styles.close} onClick={this.handleCancel}>
            <Icon type="close" />
          </div>
        </div>
        <Spin spinning={!!getHouseSummary} size="large" wrapperClassName={styles.spinstyle}>
          <div className={classNames('flexBetween', 'flexAuto', styles.content)}>
            <div className={classNames(styles.leftInfo)}>
              <Img
                image={require('@/assets/images/guanzhurenyuan.png')}
                defaultImg={require('@/assets/images/guanzhurenyuan.png')}
                className={styles.photo}
              />
              <div className={styles.ownName}>户主：{houseSummary.houseOwnerName}</div>
              <div className={classNames(styles.leftDetail)}>
                <div className={classNames(styles.DetailLeft)}>
                  <p>所属小区：</p>
                  <p>楼宇门牌：</p>
                  <p>房屋类型：</p>
                  <p>居住人数：</p>
                  <p>婚姻状态：</p>
                  <p>民族&#12288;&#12288;：</p>
                  <p>户籍地址：</p>
                </div>
                <div className={classNames(styles.DetailRight)}>
                  <p title={houseSummary.villageName}>{houseSummary.villageName}</p>
                  <p title={houseSummary.houseCode}>{houseSummary.houseCode}</p>
                  <p title={houseSummary.houseType}>{houseSummary.houseType}</p>
                  <p title={houseSummary.housePersonCount}>{houseSummary.housePersonCount}</p>
                  <p title={houseSummary.houseOwnerMaritalStatus}>
                    {houseSummary.houseOwnerMaritalStatus}
                  </p>
                  <p title={houseSummary.houseOwnerNation}>{houseSummary.houseOwnerNation}</p>
                  <p title={houseSummary.houseOwnerAddress}>{houseSummary.houseOwnerAddress}</p>
                </div>
              </div>
            </div>
            <div className={classNames(styles.rightInfo, 'flexColBetween')}>
              {this.renderCharts()}
              {this.renderTable()}
            </div>
          </div>
        </Spin>
      </div>
    );
  }

  fetchData = () => {
    let { dispatch } = this.props;

    dispatch({
      type: 'commonModel/getHouseSummary',
      payload: { houseId: this.props.houseId },
    });
  };

  personnelPortrait = id => {
    const { onPersonClick } = this.props;
    onPersonClick({
      personId: id,
      detailShow: 'person',
    });
  };

  handleCancel = () => {
    const { onCloseModal } = this.props;
    onCloseModal();
  };
}

export default HouseDetail;
