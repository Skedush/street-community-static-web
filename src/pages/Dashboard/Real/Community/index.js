import React, { PureComponent } from 'react';
import classNames from 'classnames';
import store from 'store';

import { Input, Card, Form, Row, Col, Select } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import { connect } from 'dva';
import CommonComponent from '@/components/CommonComponent';
import styles from './index.less';
import { router } from '@/utils';

const { Option } = Select;

@connect(state => {
  const {
    loading,
    communityManagement: { villageList, area, fields },
    app: { buttonUse },
    commonModel: { statisticsType, constructionYear, selectVillageOpen, communityType },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。

  return {
    loading,
    villageList,
    area,
    buttonUse,
    statisticsType,
    constructionYear,
    selectVillageOpen,
    fields,
    communityType,
  };
})
@Form.create()
class CommunityManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedValues: [],
      initialValue: null,
      constructionState: null,
      constructionYear: undefined,
      searchQueryData: {},
      loading: false,
      pageSize: 10,
      villageName: '',
      exportAllModalVisible: false,
      indeterminate: true,
      checkAll: false,
    };
  }

  componentDidMount() {
    this.featData();
  }

  // eslint-disable-next-line max-lines-per-function
  renderActionBar() {
    const {
      form: { getFieldDecorator },
      constructionYear,
      selectVillageOpen,
    } = this.props;

    return (
      <div className={styles.actionBar}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                {/* <Form.Item>
                  {getFieldDecorator('policeOrgId', {
                    initialValue: this.state.initialValue,
                  })(
                    <Cascader
                      placeholder="所属辖区"
                      options={this.props.area}
                      showSearch={{ filter: this.filter }}
                      className={'actionBarSortComponent'}
                      changeOnSelect
                      displayRender={this.displayRender}
                    />,
                  )}
                </Form.Item> */}
                <Form.Item>
                  {getFieldDecorator('villageId')(
                    <Select
                      showSearch
                      allowClear={true}
                      className={'actionBarSortComponent'}
                      defaultActiveFirstOption={true}
                      placeholder={this.state.placeholderFocus ? '请输入小区关键词' : '选择小区'}
                      optionFilterProp="children"
                    >
                      {selectVillageOpen && selectVillageOpen.length >= 0 ? (
                        selectVillageOpen.map(type => (
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
                  {getFieldDecorator('constructionYear', {
                    initialValue: this.state.constructionYear || undefined,
                  })(
                    <Select
                      defaultActiveFirstOption={false}
                      placeholder={'请选择建设年份'}
                      className={'actionBarSortComponent'}
                      // dropdownClassName={'selectDropdown'}
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
                  {getFieldDecorator('policeName')(
                    <Input
                      placeholder="民警姓名"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('policePhone')(
                    <Input
                      placeholder="民警电话"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>

                <Form.Item>
                  <LdButton
                    type="select"
                    // loading={this.props.loading.effects['communityManagement/getVillageList']}
                    htmlType="submit"
                  >
                    查找
                  </LdButton>
                  <LdButton style={{ marginLeft: 8 }} type="reset" onClick={this.handleFormReset}>
                    重置
                  </LdButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { pageSize } = this.state;
    // const { buttonUse } = this.props;
    const { buttonUse } = store.get('buttonData');
    let buttonShow = buttonUse;
    if (!buttonUse) {
      buttonShow = this.props.buttonUse;
    }
    const columns = [
      {
        title: '小区名称',
        dataIndex: 'name',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '行政区划',
        dataIndex: 'countyName',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      // {
      //   title: '所属派出所',
      //   align: 'center',
      //   dataIndex: 'policeOrganizationName',
      //   width: '8%',
      //   render: (text, record) => CommonComponent.renderTableCol(text, record),
      // },

      {
        title: '建设年份',
        align: 'center',
        dataIndex: 'constructionYear',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      // {
      //   title: '社区民警',
      //   dataIndex: 'policeName',
      //   align: 'center',
      //   width: '8%',
      //   render: (text, record) => CommonComponent.renderTableCol(text, record),
      // },
      // {
      //   title: '实施日期',
      //   dataIndex: 'implementationDay',
      //   align: 'center',
      //   width: '10%',
      //   render: (text, record) => CommonComponent.renderTableCol(text, record),
      // },
      {
        title: '使用日期',
        dataIndex: 'useDay',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '房屋数',
        dataIndex: 'houseCount',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '人员数',
        dataIndex: 'householdCount',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '车辆数',
        dataIndex: 'carCount',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        width: '10%',
        dataIndex: 'id',
        render: (text, record) => {
          return (
            <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
              <LdButton
                type="link"
                style={{ padding: '3px' }}
                onClick={() => this.addVillage(text)}
                disabled={
                  !(
                    buttonShow &&
                    buttonShow.filter(item => {
                      return item.name === '实有小区-详情';
                    })[0]
                  )
                }
              >
                详情
              </LdButton>
            </div>
          );
        },
      },
    ];
    if (buttonUse && buttonUse.length > 0) {
      let button = buttonUse.filter(item => {
        return item.name === '实有小区-详情';
      });
      if (button.length === 0) {
        columns.splice(columns.length - 1, 1);
      }
    }
    let tableData = this.props.villageList;
    const pagination = {
      position: 'bottom',
      total: tableData ? tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      pageSize: pageSize,
      defaultCurrent: 1,
      onChange: this.onChangePage,
      current: tableData ? tableData.number + 1 : 1,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };
    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        loading={this.props.loading.effects['communityManagement/getVillageList']}
        columns={columns}
        dataSource={tableData ? tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
        smWidth={true}
      />
    );
  }

  render() {
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        {this.renderActionBar()}

        {this.renderTable()}
      </div>
    );
  }

  featData = async () => {
    const { dispatch } = this.props;
    // showOpen:是否获取开放小区
    dispatch({ type: 'commonModel/getSelectVillage', payload: { showOpen: true } });
    dispatch({ type: 'communityManagement/getArea' });
    dispatch({
      type: 'commonModel/getType',
      payload: { type: 75 },
      putType: 'setCommunityType',
    });

    // 数据字典
    dispatch({ type: 'commonModel/getType', payload: { type: 43 }, putType: 'setStatisticsType' });
    // 建设年份
    dispatch({ type: 'commonModel/getVillageConstruction' });
    let payload = this.props.location.query.payload;
    let constructionState = this.props.location.query.constructionState;
    let constructionYear = this.props.location.query.constructionYear;
    let organizationId = this.props.location.query.organizationId;
    let policeType = this.props.location.query.policeType;
    dispatch({
      type: 'communityManagement/getVillageList',
      payload: {
        page: 0,
        countyId: payload ? payload[0] : !policeType ? organizationId : '',
        policeOrgId:
          payload && payload.length === 2
            ? payload[payload.length - 1]
            : policeType
            ? organizationId
            : '',
        constructionState: constructionState || '',
        constructionYear: constructionYear || '',
      },
    });
    this.setState({
      initialValue: payload || null,
      constructionState: constructionState || null,
      constructionYear: constructionYear || null,
      searchQueryData: {
        page: 0,
        countyId: payload ? payload[0] : '',
        constructionYear: constructionYear,
        constructionState: constructionState,
        policeOrgId: payload && payload.length === 2 ? payload[payload.length - 1] : '',
      },
    });
  };

  setSearchInfo = data => {
    this.setState({ searchQueryData: data });
  };

  onSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { pageSize } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
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
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      fieldsValue.page = 0;
      fieldsValue.size = pageSize;
      this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'communityManagement/getVillageList',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;
    form.resetFields();
    this.setState({
      searchQueryData: { size: pageSize, page: 0 },
      constructionYear: undefined,
      searchValue: '',
      page: 0,
      initialValue: null,
    });
    dispatch({
      type: 'communityManagement/getVillageList',
      payload: { page: 0, size: pageSize },
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'communityManagement/getVillageList',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'communityManagement/getVillageList',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };

  // 查看
  addVillage = id => {
    router.push({
      pathname: '/dashboard/real/addcommunity',
      query: { modifyInfo: id },
    });
  };

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      if (i === labels.length - 1) {
        return <span key={option.value}>{label}</span>;
      }
      return <span key={option.value}> </span>;
    });

  filter(inputValue, path) {
    return path.some(option => {
      if (option.code) {
        return (
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
          option.code.toString().indexOf(inputValue.toString()) > -1
        );
      }
    });
  }
}

CommunityManagement.propTypes = {};
export default CommunityManagement;
