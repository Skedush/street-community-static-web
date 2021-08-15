import React, { PureComponent } from 'react';
import { Icon, Tabs, Badge, Divider, Spin, Modal, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import classNames from 'classnames';
import LdTable from '@/components/My/Table/LdTable';
import { isEqual, isEmpty } from 'lodash';
import HouseDetail from '../HouseDetail';
// import IconFont from 'components/CommonModule/IconFont';
import Img from '@/components/My/Img';

const TabPane = Tabs.TabPane;

@connect(
  ({
    home: { unitHouseList, importantHouseCollection, villageBuildUnitInfo, unitSummary },
    loading,
  }) => ({
    unitHouseList,
    loading: {
      getImportantHouseCollection: loading.effects['home/getImportantHouseCollection'],
      getFloorHouseListByUnit: loading.effects['home/getFloorHouseListByUnit'],
      getUnitSummary: loading.effects['home/getUnitSummary'],
    },
    importantHouseCollection,
    villageBuildUnitInfo,
    unitSummary,
  }),
)
class CommunityUnitDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      close: true,
      visible: false,
      sort: 'DESC',
    };
  }
  componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.villageBuildUnitInfo, this.props.villageBuildUnitInfo)) {
      const { dispatch } = this.props;
      await dispatch({ type: 'home/updateImportantHouseCollection', payload: [] });
      await dispatch({ type: 'home/updateUnitSummary', payload: {} });
      await dispatch({ type: 'home/updateUnitHouseList', payload: [] });
      this.fetchData();
    }
  }

  renderItem = () => {
    const { statistic } = this.props.unitSummary;
    if (isEmpty(statistic)) {
      return;
    }
    const {
      emptyHouseCount,
      houseCount,
      houseOwnerCount,
      houseOwnerPersonCount,
      housePersonCount,
      houseRentCount,
      houseRentPersonCount,
      importantHouseCount,
      importantPersonCount,
      sevenHouse,
    } = statistic;
    const items = [
      {
        icon: 'icon-house',
        count: houseCount + '间',
        title: '单元房屋总数',
      },
      {
        icon: 'icon-peoplenum',
        count: housePersonCount + '人',
        title: '单元总人数',
      },
      {
        icon: 'icon-house',
        count: houseOwnerCount + '间',
        title: '业主自住总数',
      },
      {
        icon: 'icon-peoplenum',
        count: houseOwnerPersonCount + '人',
        title: '单元业主及家人人数',
      },
      {
        icon: 'icon-house',
        count: houseRentCount + '间',
        title: '出租房屋数量',
      },
      {
        icon: 'icon-peoplenum',
        count: houseRentPersonCount + '人',
        title: '租客总人数',
      },
      {
        icon: 'icon-house',
        count: importantHouseCount + '间',
        title: '重点关注房屋',
      },
      {
        icon: 'icon-peoplenum',
        count: importantPersonCount + '人',
        title: '重点关注人数',
      },
      {
        icon: 'icon-house',
        count: sevenHouse + '间',
        title: '7人以上房屋',
      },
      {
        icon: 'icon-house',
        count: emptyHouseCount + '间',
        title: '空置房屋数量',
      },
    ];

    const itemCpts = items.map((item, index) => {
      const { icon, count, title } = item;
      return (
        <div key={index} className={classNames(styles.itemr, 'borderBottom')}>
          <div className={styles.image}>
            <i className={classNames('iconfont', icon)} style={{ color: 'white' }} />
          </div>
          <div className={styles.content}>
            <span>{count}</span>
            <div className={styles.contentBottom}>
              <span>{title}</span>
            </div>
          </div>
        </div>
      );
    });
    return <div className={styles.infoRight}>{itemCpts}</div>;
  };
  renderProperty() {
    let { unitSummary } = this.props;
    let image = null;
    try {
      image = unitSummary.propertyCompanyPersons[0].image;
    } catch (error) {
      image = require('@/assets/images/guanzhurenyuan.png');
    }
    return (
      <div className={styles.leftBox}>
        <Img
          image={image}
          defaultImg={require('@/assets/images/guanzhurenyuan.png')}
          className={classNames(styles.photo, 'marginBottomLg')}
        />
        <div className={classNames(styles.item, 'marginTopSm')}>
          <div className={styles.icon}>
            <i className={classNames('iconfont', 'icon-address')} style={{ color: 'white' }} />
          </div>
          <div className={styles.title}>
            {unitSummary &&
            unitSummary.propertyCompanyPersons &&
            unitSummary.propertyCompanyPersons.length > 0 ? (
              <span title={unitSummary.propertyCompanyPersons[0].unitFullName}>
                {unitSummary.propertyCompanyPersons[0].unitFullName}
              </span>
            ) : (
              <span> 暂无信息</span>
            )}
          </div>
        </div>
        <div className={classNames(styles.item, 'marginTopSm')}>
          <div className={styles.icon}>
            <i className={classNames('iconfont', 'icon-name')} style={{ color: 'white' }} />
          </div>
          <div className={styles.title}>
            <span>
              物业负责人:
              {unitSummary.propertyCompanyPersons.length > 0
                ? unitSummary.propertyCompanyPersons[0].name
                : '暂无信息'}
            </span>
          </div>
        </div>
        <div className={classNames(styles.item, 'marginTopSm')}>
          <div className={styles.icon}>
            <i className={classNames('iconfont', 'icon-phone')} style={{ color: 'white' }} />
          </div>
          <div className={styles.title}>
            <span>
              {unitSummary.propertyCompanyPersons.length > 0
                ? unitSummary.propertyCompanyPersons[0].phone
                : '暂无信息'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  renderSummary() {
    let { unitSummary } = this.props;
    if (isEmpty(unitSummary)) {
      return <div style={{ height: '100%', width: '100%' }}></div>;
    }
    return (
      <div className={classNames('flexBetween', 'paddingSm', styles.centerBox)}>
        {this.renderProperty()}
        {this.renderItem()}
      </div>
    );
  }
  renderTableTitle(isImportant) {
    return (
      <div className={classNames('flexBetween', 'width100', 'paddingXs')}>
        {/* <div className={styles.width45} /> */}
        {/* <div className={styles.width10}>房屋信息</div> */}
        <div className={classNames('flexEnd', 'itemCenter', styles.width100)}>
          <Badge offset={[-30, 0]} color="#009DFF" text="业主自住" />
          <Badge offset={[-20, 0]} color="#15ABA2" text="出租房" />
          <Badge offset={[-10, 0]} color="#F2BA33" text="7人以上" />
          <Badge offset={[0, 0]} color="#EA5114" text="重点房屋" />
          {!isImportant && (
            <Button
              style={{ marginLeft: '20px' }}
              icon={this.state.sort === 'ASC' ? 'sort-ascending' : 'sort-descending'}
              ghost
              onClick={this.clickSort}
            >
              排序
            </Button>
          )}
        </div>
      </div>
    );
  }

  renderTableContent(item) {
    return (
      <div
        className={classNames('width25', styles.insideTd, 'paddingTopXs', 'borderBottomModal', {
          [styles.importantHouseBg]: item.importantPerson,
        })}
        key={item.houseId}
      >
        <div className={classNames('flexStart', 'itemCenter', 'marginBottomXs')}>
          <div
            className={classNames(
              {
                [styles.ownLiveBg]:
                  item.useType === '1' && item.householdCount <= 7 && !item.importantPerson,
              },
              {
                [styles.rentOutBg]:
                  item.useType === '2' && item.householdCount < 7 && !item.importantPerson,
              },
              {
                [styles.sevenPersonBg]: item.householdCount >= 7 && !item.importantPerson,
              },
              { [styles.importantHouseBg]: item.importantPerson },
              styles.circular,
              'marginLeftXs',
              'marginRightXs',
              'flexCenter',
              'itemCenter',
            )}
          >
            <i
              className={classNames('iconfont', 'icon-housetype')}
              style={{ color: 'white', fontSize: '14px', width: '14px', height: '14px' }}
            />
          </div>
          <div>
            {item.houseName}
            {item.houseName.indexOf('室') === -1 && '室'}
          </div>
        </div>
        <div className={classNames('flexCenter', 'itemCenter', 'paddingBottomXs')}>
          <div>
            <div>房屋类型</div>
            <div className={classNames(styles.font18, styles.fontWeight)}>{item.useTypeStr}</div>
          </div>
          <div className={'marginLeftSm'}>
            <div>居住人数</div>
            <div className={classNames(styles.font18, styles.fontWeight)}>
              {item.householdCount}
            </div>
          </div>
        </div>
        <div
          className={classNames('flexAround', 'itemCenter', styles.borderTop, styles.secendColor)}
        >
          <div className={classNames('paddingXs', styles.font12)}>户主：{item.name}</div>
          <Divider className={styles.dividerBgColor} type="vertical" />
          <div
            className={classNames('paddingXs', styles.font12, styles.houseDetail)}
            onClick={() => this.showHouseDetailModal(item.houseId)}
          >
            查看详情
          </div>
        </div>
      </div>
    );
  }

  renderImportantTableContent(item) {
    return (
      <div
        className={classNames('width25', styles.insideTd, 'paddingTopXs', 'borderBottomModal')}
        key={item.houseId}
      >
        <div className={classNames('flexStart', 'itemCenter', 'marginBottomXs')}>
          <div
            className={classNames(
              styles.importantHouseBg,
              styles.circular,
              'marginLeftXs',
              'marginRightXs',
            )}
          >
            <i
              className={classNames('iconfont', 'icon-housetype')}
              style={{ color: 'white', fontSize: '14px', width: '14px', height: '14px' }}
            />
          </div>
          <div>{item.houseName}房</div>
        </div>
        <div className={classNames('flexCenter', 'itemCenter', 'paddingBottomXs')}>
          <div>
            <div>房屋类型</div>
            <div className={classNames(styles.font18, styles.fontWeight)}>{item.useTypeStr}</div>
          </div>
          <div className={'marginLeftSm'}>
            <div>居住人数</div>
            <div className={classNames(styles.font18, styles.fontWeight)}>
              {item.householdCount}
            </div>
          </div>
        </div>
        <div
          className={classNames('flexAround', 'itemCenter', styles.borderTop, styles.secendColor)}
        >
          <div className={classNames('paddingXs')}>户主：{item.name}</div>
          <Divider className={styles.dividerBgColor} type="vertical" />
          <div
            className={classNames('paddingXs', styles.houseDetail)}
            onClick={() => this.showHouseDetailModal(item.houseId)}
          >
            查看详情
          </div>
        </div>
      </div>
    );
  }

  renderTable(isImportant) {
    let tableData;
    if (isImportant) {
      tableData = [{ houseList: this.props.importantHouseCollection }];
    } else {
      tableData = this.props.unitHouseList.itemList;
    }
    const normalColumns = [
      {
        title: '楼层',
        dataIndex: 'floor',
        width: 60,
        render: (text, record) => (
          <div>
            <span className={classNames(styles.font18, styles.fontWeight)}>{text}</span>楼
          </div>
        ),
      },
      {
        title: this.renderTableTitle(isImportant),
        dataIndex: 'houseList',
        render: record => {
          return (
            <div className={classNames('flexStart', 'flexWrap')}>
              {record.map(item => this.renderTableContent(item))}
            </div>
          );
        },
      },
    ];

    const importantColumns = [
      {
        title: this.renderTableTitle(isImportant),
        dataIndex: 'houseList',
        render: record => {
          return (
            <div className={classNames('flexStart', 'flexWrap')}>
              {record.map(item => this.renderImportantTableContent(item))}
            </div>
          );
        },
      },
    ];

    return (
      <LdTable
        type="modalTable"
        loading={
          isImportant
            ? this.props.loading.getImportantHouseCollection
            : this.props.loading.getFloorHouseListByUnit
        }
        columns={isImportant ? importantColumns : normalColumns}
        bordered
        indexDisabled={true}
        pagination={false}
        dataSource={tableData || null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'floor'}
      />
    );
  }
  render() {
    if (this.props.closed) {
      return null;
    }
    const operations = (
      <div
        className={classNames(styles.close, 'paddingLeftSm', 'paddingRightSm')}
        onClick={this.onClose}
      >
        <Icon type={'close'} />
      </div>
    );
    return (
      <div className={styles.container}>
        <Tabs tabBarExtraContent={operations} className={classNames('height100', 'flexColStart')}>
          <TabPane
            tab="单元概况"
            key="1"
            className={classNames('paddingLeftSm', 'paddingRightSm', 'height100', 'overFlowAuto')}
          >
            <Spin tip="Loading..." spinning={this.props.loading.getUnitSummary}>
              {this.renderSummary()}
            </Spin>
          </TabPane>
          <TabPane
            tab="房屋概况"
            key="2"
            className={classNames(
              'paddingLeftSm',
              'paddingRightSm',
              'overFlowAuto',
              'flexColStart',
            )}
          >
            {this.renderTable(false)}
          </TabPane>
          <TabPane
            tab="重点房屋"
            key="3"
            className={classNames('paddingLeftSm', 'paddingRightSm', 'height100', 'overFlowAuto')}
          >
            {this.renderTable(true)}
          </TabPane>
        </Tabs>
        <Modal
          title="房屋信息"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={false}
          wrapClassName={classNames(styles.modal, styles.houseModal)}
          centered
          style={{ top: '40px' }}
          destroyOnClose={true}
        >
          <HouseDetail houseId={this.state.houseId} />
        </Modal>
      </div>
    );
  }

  clickSort = () => {
    let { dispatch, villageBuildUnitInfo } = this.props;
    let villageInfo = { ...villageBuildUnitInfo };
    let sort = this.state.sort === 'ASC' ? 'DESC' : 'ASC';
    this.setState(
      {
        sort: sort,
      },
      () => {
        villageInfo.sort = sort;
        dispatch({
          type: 'home/getFloorHouseListByUnit',
          payload: villageInfo,
        });
      },
    );
  };

  showHouseDetailModal = id => {
    this.setState({
      visible: true,
      houseId: id,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  fetchData = () => {
    let { dispatch, villageBuildUnitInfo } = this.props;
    const { sort } = this.state;
    let villageInfo = { ...villageBuildUnitInfo };
    villageInfo.sort = sort;
    dispatch({
      type: 'home/getImportantHouseCollection',
      payload: villageInfo,
    });
    dispatch({
      type: 'home/getFloorHouseListByUnit',
      payload: villageInfo,
    });
    dispatch({
      type: 'home/getUnitSummary',
      payload: villageBuildUnitInfo,
    });
  };

  onClose = () => {
    this.props.send(true);
  };
}

export default CommunityUnitDetail;
