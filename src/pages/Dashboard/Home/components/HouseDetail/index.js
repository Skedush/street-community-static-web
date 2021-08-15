/* eslint-disable max-lines-per-function */
import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import { Modal } from 'antd';
import LdTable from '@/components/My/Table/LdTable';
import { Chart, Geom, Tooltip, Coord, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';
import { isEmpty, isEqual } from 'lodash';
import Measure from 'react-measure';
import LdButton from '@/components/My/Button/LdButton';
import VillagePortrait from '@/components/CommonModule/VillagePortrait';
import CommonComponent from '@/components/CommonComponent';

const { Html } = Guide;

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
          {this.renderPie(ages, '年龄占比')}
          {this.renderPie(tenantAndHouseholdCount, '租户占比')}
          {this.renderPie(address, '户籍地占比', 'click')}
        </div>
      </div>
    );
  }

  renderPie = (data, type, click) => {
    if (!data) {
      return;
    }
    if (isEmpty(data)) {
      data = [];
      let obj = { name: '浙江省', count: 0, percent: '无数据' };
      data.push(obj);
    }
    let maxItem = data[0];
    data.forEach(function(item) {
      maxItem = item.count > maxItem.count ? item : maxItem;
    });
    maxItem.percent = parseInt((maxItem.count * 100) / this.props.houseSummary.housePersonCount)
      ? parseInt((maxItem.count * 100) / this.props.houseSummary.housePersonCount) + '%'
      : '无数据';
    const { DataView } = DataSet;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'name',
      as: 'percent',
      id: 'id',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + '%';
          return val;
        },
      },
    };
    const { width, height } = this.state.dimensions;
    return (
      <Measure
        bounds
        onResize={contentRect => {
          if (contentRect.entry) {
            this.setState({ dimensions: contentRect.entry });
            return;
          }
          this.setState({ dimensions: contentRect.bounds });
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} style={{ width: '33%', height: '100%' }}>
            <Chart
              width={width}
              height={height}
              data={dv}
              scale={cols}
              padding={[0, 0, 0, -70]}
              onPlotClick={click ? ev => this.onPlotClick(ev) : false}
            >
              <Coord type={'theta'} radius={0.6} innerRadius={0.8} scale={[1.3, 1.3]} />
              <Tooltip
                showTitle={false}
                itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
              />
              <Guide>
                <Html
                  position={['50%', '50%']}
                  html={
                    '<div style="color:#fff;font-size:1.4rem;text-align: center;">' +
                    maxItem.percent +
                    '</div>'
                  }
                  alignX="middle"
                  alignY="middle"
                />
                <Html
                  position={['74%', '40%']}
                  html={
                    '<div style="color:#fff;font-size:.7rem;text-align: center;">' + type + '</div>'
                  }
                  alignX="left"
                  alignY="middle"
                />
                <Html
                  position={['74%', '60%']}
                  html={
                    '<div style="color:#fff;font-size:.7rem;text-align: center;">' +
                    maxItem.name +
                    '</div>'
                  }
                  alignX="left"
                  alignY="middle"
                />
              </Guide>
              <Geom
                type="intervalStack"
                position="percent"
                color="name"
                tooltip={[
                  'name*percent',
                  (name, percent) => {
                    percent = parseInt(percent * 100) + '%';
                    return {
                      name: name,
                      value: percent,
                    };
                  },
                ]}
                style={{ lineWidth: 1, stroke: '#fff' }}
              />
            </Chart>
          </div>
        )}
      </Measure>
    );
  };

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
      // {
      //   title: '户籍',
      //   dataIndex: 'address',
      //   // width: '12%',
      //   render: (text, record) => CommonComponent.renderTableCol(text, record),
      // },
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
        columns={columns}
        pagination={false}
        dataSource={tableData}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        bigWidth={true}
        // scroll={{ y: 400 }}
        rowKey={'floor'}
        className={styles.table}
      />
    );
  }

  renderPersonnelPortrait() {
    return (
      <Modal
        title="基本信息"
        visible={this.state.PersonnelValue}
        onCancel={this.handleCancel.bind(this)}
        footer={false}
        destroyOnClose={true}
        wrapClassName={styles.modalPortrait}
      >
        <VillagePortrait portraitID={this.state.portraitID} />
      </Modal>
    );
  }

  render() {
    let { houseSummary } = this.props;
    // const { tag } = houseSummary;
    if (isEmpty(houseSummary)) {
      return CommonComponent.renderLoading();
    }

    return (
      <div className={classNames(styles.container, 'flexBetween', 'colorWhite')}>
        <div className={classNames(styles.leftInfo, 'borderRight')}>
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
          <div className={classNames(styles.charts, 'paddingSm')}>{this.renderCharts()}</div>
          {this.renderTable()}
        </div>
        {this.renderPersonnelPortrait()}
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
    this.setState({
      portraitID: id,
      PersonnelValue: true,
    });
  };

  handleCancel() {
    this.setState({
      PersonnelValue: false,
    });
  }

  // 图表点击事件
  onPlotClick = ev => {
    if (!ev.data) {
      return;
    }
    const {
      data: { _origin },
    } = ev;
    const { onPlotClickNumber } = this.state;

    const { dispatch } = this.props;
    if (onPlotClickNumber === 1) {
      const { address } = this.props.houseSummary;
      dispatch({
        type: 'commonModel/setPersonAddress',
        data: address,
      });
      this.setState({
        onPlotClickNumber: 0,
      });
      return;
    }
    dispatch({
      type: 'commonModel/getPersonAddress',
      payload: { provinceId: _origin.id, houseId: this.props.houseId },
    });
    this.setState({
      onPlotClickNumber: 1,
    });
  };
}

export default HouseDetail;
