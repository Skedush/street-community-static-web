import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Card, Form, Select, Row, Col, Checkbox, Spin, Tooltip, Icon, InputNumber } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
// import DistributionMap from '@/components/CommonModule/Map';
import { connect } from 'dva';
import styles from './index.less';
import CommonComponent from '@/components/CommonComponent';
import GatewayDetailModal from './components/GatewayDetailModal';
import moment from 'moment';

const { Option } = Select;

@connect(state => {
  const {
    loading,
    commonModel: { constructionYear, selectVillage, area, gateWayDayType, gateWayType },
    villageGateway: { villageGatewayData },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    area,
    loading,
    constructionYear,
    selectVillage,
    villageGatewayData,
    gateWayDayType,
    gateWayType: gateWayType.filter(item => item.value !== '3'),
  };
})
@Form.create()
class VillageGateway extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchQueryData: {
        page: 0,
      },
      villageId: null,
      pageSize: 10,
      indeterminate: false,
      checkAll: true,
      checkedList: ['1', '2'],
      gatewayDetailModalVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'commonModel/getVillageConstruction' });
    dispatch({ type: 'commonModel/getSelectVillage' });
    dispatch({ type: 'commonModel/getArea' });
    dispatch({
      type: 'commonModel/getType',
      payload: { type: 76 },
      putType: 'setGateWayType',
    });
    dispatch({
      type: 'commonModel/getType',
      payload: { type: 77 },
      putType: 'setGateWayDayType',
    });

    this.onSearch();
  }

  renderActionBar() {
    return (
      <div className={classNames(styles.actionBar, 'marginBottomXs')}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>{this.renderForm()}</Row>
          </Form>
        </Card>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { pageSize } = this.state;
    const columns = [
      {
        title: '网关名称',
        dataIndex: 'gatewayName',
        align: 'center',
        width: '10%',
        render: (text, record) =>
          CommonComponent.renderTableLinkCol(text, record, () => this.showDetail(record.id)),
      },
      {
        title: '行政区划',
        dataIndex: 'area',
        align: 'center',
        width: '12%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '所属小区',
        dataIndex: 'villageName',
        align: 'center',
        width: '12%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '建设年份',
        align: 'center',
        dataIndex: 'constructionYear',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '当前状态',
        align: 'center',
        dataIndex: 'stateStr',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '昨日运行情况',
        align: 'center',
        dataIndex: 'dayStateStr',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: () => (
          <Tooltip
            title={
              <div>
                根据网关昨日运行情况，统计昨日离线时长或累计离线天数。
                <br />
                全天离线的网关，统计截止昨日已连续全天离线的累计天数。
                <br />
                状态波动的网关，统计昨日网关离线的时长。
              </div>
            }
            placement={'top'}
            overlayStyle={{ zIndex: '99999999' }}
          >
            离线时长{' '}
            <Icon
              type="question-circle"
              theme="filled"
              style={{ fontSize: '14px', color: '#AAB5CC' }}
            />
          </Tooltip>
        ),
        align: 'center',
        dataIndex: 'offlineDurationStr',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '最后在线时间',
        align: 'center',
        dataIndex: 'onlineTime',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
    ];
    let tableData;
    try {
      tableData = this.props.villageGatewayData;
    } catch (error) {
      tableData = '';
    }
    const pagination = {
      position: 'bottom',
      total: tableData ? tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      // pageSize: tableData ? tableData.size : 0,
      pageSize: pageSize,
      defaultCurrent: 1,
      current: tableData ? tableData.number + 1 : 1,
      onChange: this.onChangePage,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };
    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        loading={this.props.loading.effects['villageGateway/getVillageGatePage']}
        columns={columns}
        dataSource={tableData ? tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const {
      form: { getFieldDecorator },
      constructionYear,
      selectVillage,
      gateWayDayType,
    } = this.props;
    return (
      <Col md={20} sm={24} className={classNames(styles.col)}>
        {/* <Form.Item>
          {getFieldDecorator('policeOrgId')(
            <Cascader
              placeholder="所属辖区"
              options={this.props.area}
              className={'actionBarSortComponent'}
              changeOnSelect
              showSearch={{ filter: this.filter, limit: 9999 }}
              displayRender={this.displayRender}
            />,
          )}
        </Form.Item> */}
        <Form.Item>
          {getFieldDecorator(
            'villageId',
            this.state.villageId
              ? {
                  initialValue: this.state.villageId,
                }
              : {},
          )(
            <Select
              showSearch
              placeholder={this.state.placeholderFocus ? '请输入小区关键词' : '所属小区'}
              optionFilterProp="children"
              className={'actionBarSortComponent'}
              allowClear={true}
              onFocus={this.selectFocus}
              onBlur={this.selectBlur}
              dropdownClassName={styles.select}
            >
              {selectVillage.length > 0 ? (
                selectVillage.map(type => (
                  <Option value={type.id} key={type.id} className={'optionSelect'}>
                    {type.name}
                  </Option>
                ))
              ) : (
                <Option value={-1} key={-1} className={'optionSelect'}>
                  全部
                </Option>
              )}
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('constructionYear')(
            <Select
              defaultActiveFirstOption={false}
              placeholder="请选择建设年份"
              className={'actionBarSortComponent'}
              dropdownClassName={'selectDropdown'}
            >
              <Option value={-1} key={-1} className={'optionSelect'}>
                全部
              </Option>
              {constructionYear.length &&
                constructionYear.map(item => (
                  <Option value={item} key={item} className={'optionSelect'}>
                    {item}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('dayType')(
            <Select
              defaultActiveFirstOption={false}
              placeholder="昨日运行情况"
              className={'actionBarSortComponent'}
              dropdownClassName={'selectDropdown'}
            >
              <Option value={-1} key={-1} className={'optionSelect'}>
                全部
              </Option>
              {gateWayDayType.length &&
                gateWayDayType.map(item => (
                  <Option value={item.key} key={item.key} className={'optionSelect'}>
                    {item.value}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item style={{ marginRight: '4px' }}>
          {getFieldDecorator('offlineDurationStart')(
            <InputNumber
              min={0}
              placeholder="离线时长上限(小时)"
              step={1}
              className={styles.inputNumber}
            />,
          )}
        </Form.Item>
        ~
        <Form.Item style={{ marginLeft: '4px' }}>
          {getFieldDecorator('offlineDurationEnd')(
            <InputNumber
              min={0}
              placeholder="离线时长下限(小时)"
              step={1}
              className={styles.inputNumber}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <LdButton
            type="select"
            // loading={this.props.loading.effects['workModel/getImportance']}
            htmlType="submit"
          >
            查找
          </LdButton>
          <LdButton style={{ marginLeft: 8 }} type="reset" onClick={this.handleFormReset}>
            重置
          </LdButton>
        </Form.Item>
      </Col>
    );
  }

  renderGroupButton() {
    const { gateWayType } = this.props;
    return (
      <div className={classNames('flexEnd', styles.groupButton)}>
        <div>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全部
          </Checkbox>
          <Checkbox.Group
            options={gateWayType}
            value={this.state.checkedList}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }

  render() {
    const { gatewayDetailModalVisible } = this.state;
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        {this.renderActionBar()}
        {this.renderGroupButton()}
        <Spin
          tip="正在进行导出..."
          spinning={!!this.props.loading.effects['villageGateway/exportVillageGateway']}
          size="large"
          wrapperClassName={styles.spinstyle}
        >
          {this.renderTable()}
        </Spin>
        <GatewayDetailModal
          gatewayDetailModalVisible={gatewayDetailModalVisible}
          cancelModal={this.cancelModal}
        />
      </div>
    );
  }

  showDetail = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'villageGateway/getVillageGatewayDetail', payload: { id } });
    const yestoday = moment().subtract(1, 'days');
    dispatch({
      type: 'villageGateway/getVillageGatewaySituationByDay',
      payload: { id, date: yestoday.format('YYYY-MM-DD HH:mm:ss') },
    });
    this.setState({
      gatewayDetailModalVisible: true,
    });
  };

  cancelModal = () => {
    this.setState({
      gatewayDetailModalVisible: false,
    });
  };

  onChange = async checkedList => {
    const { gateWayType } = this.props;
    await this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < gateWayType.length,
      checkAll: checkedList.length === gateWayType.length,
    });
    this.onSearch();
  };

  onCheckAllChange = async e => {
    const { gateWayType } = this.props;
    await this.setState({
      checkedList: e.target.checked ? gateWayType.map(item => item.value) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
    this.onSearch();
  };

  setSearchInfo = data => {
    this.setState({ searchQueryData: data });
  };

  onSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { pageSize, checkedList } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.personTagType && fieldsValue.personTagType.length > 0) {
        let personTagType = fieldsValue.personTagType;
        fieldsValue.personTagType = personTagType.join(',');
      }
      if (fieldsValue.policeOrgId) {
        let newPoliceOrgId = fieldsValue.policeOrgId;
        if (fieldsValue.policeOrgId.length === 2) {
          fieldsValue.policeOrgId = newPoliceOrgId[1];
          fieldsValue.countyId = newPoliceOrgId[0];
        } else {
          fieldsValue.countyId = newPoliceOrgId[0];
          fieldsValue.policeOrgId = '';
        }
      }
      fieldsValue.page = 0;
      fieldsValue.size = pageSize;
      if (checkedList.length === 0) {
        fieldsValue.state = 0;
      } else {
        fieldsValue.state = checkedList.toString();
      }
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      this.setSearchInfo(fieldsValue);
      dispatch({ type: 'villageGateway/getVillageGatePage', payload: fieldsValue });
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({ type: 'villageGateway/getVillageGatePage', payload: searchInfo });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({ type: 'villageGateway/getVillageGatePage', payload: searchInfo });
    this.setState({
      pageSize,
    });
  };

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      this.setState({ searchLocal: label });
      if (i === labels.length - 1) {
        return <span key={option.value}>{label}</span>;
      }
      return <span key={option.value}> </span>;
    });

  filter(inputValue, path) {
    // return path.some(
    //   option =>
    //     option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
    //     option.code.toString().indexOf(inputValue.toString()) > -1,
    // );
    return path.some(option => {
      if (option.code) {
        return (
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
          option.code.toString().indexOf(inputValue.toString()) > -1
        );
      }
    });
  }

  handleFormReset = () => {
    const { form, gateWayType } = this.props;
    const { pageSize } = this.state;
    if (gateWayType && gateWayType.length > 0) {
      this.setState({
        indeterminate: false,
        checkAll: true,
        checkedList: gateWayType.map(item => item.value),
      });
    }
    form.resetFields();
    this.setSearchInfo({ page: 0, pageSize });
    this.onSearch();
  };
}

VillageGateway.propTypes = {};
export default VillageGateway;
