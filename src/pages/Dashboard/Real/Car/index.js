import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Input, Card, Form, Row, Col, Select, Modal } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import CarPortrait from '@/components/CommonModule/CarPortrait';
import { connect } from 'dva';
import CommonComponent from '@/components/CommonComponent';
import styles from './index.less';
const { Option } = Select;

@connect(state => {
  const {
    loading,
    commonModel: { selectVillage, area, registerType },
    realModel: { carList },
    // communityManagement: {  },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
    carList,
    registerType,
    selectVillage,
    area,
  };
})
@Form.create()
class UserManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      placeholderFocus: false,
      searchQueryData: {},
      payload: '',
      villageId: '',
      pageSize: 10,
      carNo: '',
      carPortraitVisible: false,
      zIndex: 3000,
      carJudgeType: false,
      featchType: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // eslint-disable-next-line max-lines-per-function
  renderActionBar() {
    const {
      form: { getFieldDecorator },
      selectVillage,
      registerType,
    } = this.props;
    return (
      <div className={classNames(styles.actionBar, 'marginBottomSm')}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                {/* <Form.Item>
                  {getFieldDecorator('policeOrgId', {
                    initialValue: this.state.payload,
                  })(
                    <Cascader
                      placeholder="所属辖区"
                      options={this.props.area}
                      // onChange={this.onChange}
                      showSearch={{ filter: this.filter }}
                      className={'actionBarSortComponent'}
                      changeOnSelect
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
                      defaultActiveFirstOption={true}
                      placeholder={this.state.placeholderFocus ? '请输入小区关键词' : '请选择小区'}
                      optionFilterProp="children"
                      dropdownClassName={styles.select}
                      className={'actionBarSortComponent'}
                      // dropdownClassName={'selectDropdown'}
                      onFocus={this.selectFocus}
                      allowClear={true}
                      onBlur={this.selectBlur}
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
                  {getFieldDecorator('licensePlate')(
                    <Input placeholder="车牌号" className={'actionBarSortComponent'} allowClear />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('name')(
                    <Input
                      placeholder="车主姓名"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}{' '}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator('registerType')(
                    <Select
                      defaultActiveFirstOption={false}
                      placeholder="请选择登记方式"
                      dropdownClassName={'selectDropdown'}
                      className={'actionBarSortComponent'}
                    >
                      <Option value="" key="" className={'optionSelect'}>
                        全部
                      </Option>
                      {registerType.length &&
                        registerType.map(item => (
                          <Option value={item.key} key={item.key} className={'optionSelect'}>
                            {item.value}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>

                <Form.Item className={styles.flexbtn}>
                  <div>
                    <LdButton
                      type="select"
                      // loading={this.props.loading.effects['realModel/getVehicleDistribution']}
                      htmlType="submit"
                    >
                      查找
                    </LdButton>
                    <LdButton
                      style={{ marginLeft: 8 }}
                      // loading={this.props.loading.effects['realModel/getVehicleDistribution']}
                      type="reset"
                      onClick={this.handleFormReset}
                    >
                      重置
                    </LdButton>
                  </div>
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
    const columns = [
      {
        title: '车牌号',
        dataIndex: 'carNo',
        align: 'center',
        width: '10%',
        render: (text, record) =>
          CommonComponent.renderTableLinkCol(text, record, () =>
            this.showCarPortrait(record.carNo, record.id, record.carId, record.licenseColor),
          ),
      },
      {
        title: '车牌颜色',
        dataIndex: 'licenseColorStr',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '所属小区',
        dataIndex: 'villageName',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '车主姓名',
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '登记时间',
        align: 'center',
        dataIndex: 'registerTime',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        width: '10%',
        render: (text, record) => (
          <LdButton
            type="link"
            onClick={() =>
              this.showCarPortrait(record.carNo, record.id, record.carId, record.licenseColor)
            }
          >
            查看
          </LdButton>
        ),
      },
    ];
    let tableData = this.props.carList;
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
        loading={this.props.loading.effects['realModel/getVehicleDistribution']}
        columns={columns}
        dataSource={tableData ? tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  renderCarPortrait() {
    return (
      <Modal
        title="车辆画像"
        visible={this.state.carPortraitVisible}
        onCancel={this.handleCarCancel}
        footer={false}
        wrapClassName={styles.carModal}
        // destroyOnClose={true}
      >
        <CarPortrait
          carJudgeType={this.state.carJudgeType}
          carId={this.state.carId}
          featchType={this.state.featchType}
          sendVisible={this.sendVisible}
          changeType={this.changeType}
        />
      </Modal>
    );
  }

  render() {
    return (
      <div
        className={classNames(
          'paddingSm',
          'bgThemeColor',
          'flexColStart',
          'height100',
          styles.renderBox,
        )}
        style={{ overflow: 'auto' }}
      >
        {this.renderActionBar()}
        {this.renderTable()}
        {this.renderCarPortrait()}
      </div>
    );
  }

  fetchData = () => {
    let { dispatch, selectVillage } = this.props;
    let { payload, villageName } = this.props.location ? this.props.location.query : {};
    let villageId = null;
    let villageObj = null;
    let newData = {};
    newData.page = 0;
    if (payload) {
      if (payload.length === 2) {
        newData.policeOrgId = payload[1];
        newData.countyId = payload[0];
      } else {
        newData.countyId = payload[0];
        newData.policeOrgId = '';
      }
      this.setState({ payload });
    }

    dispatch({ type: 'commonModel/getSelectVillage' }).then(() => {
      villageObj = selectVillage.find(_item => _item.name === villageName);
      if (villageObj) {
        villageId = villageObj.id;
        newData.villageId = villageId;
        this.setState({
          villageId,
        });
      }
      dispatch({ type: 'realModel/getVehicleDistribution', payload: newData });
      this.setState({
        searchQueryData: newData,
      });
    });
    dispatch({
      type: 'commonModel/getType',
      payload: { type: 79 },
      putType: 'setRegisterType',
    });

    dispatch({ type: 'commonModel/getCommun' });
    dispatch({ type: 'commonModel/getArea' });
  };

  handleCarCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModel/updataCarRecord',
      data: {
        first: true,
        content: [],
      },
    });
    this.setState({
      carPortraitVisible: false,
      // carJudgeType: !this.state.carJudgeType,
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
      this.setState({
        searchQueryData: fieldsValue,
      });
      fieldsValue.page = 0;
      fieldsValue.size = pageSize;
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
      this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'realModel/getVehicleDistribution',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;
    form.resetFields();
    this.setState({
      payload: null,
      villageId: null,
    });
    this.setSearchInfo({ size: pageSize, page: 0, payload: '', village: '' });
    dispatch({
      type: 'realModel/getVehicleDistribution',
      payload: { page: 0, size: pageSize },
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'realModel/getVehicleDistribution',
      payload: searchInfo,
    });
  };

  handleMap() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapData/distributionMap',
    });
  }

  showCarPortrait = (carNo, id, carId, licenseColor) => {
    this.setState({
      carNo: carNo,
      carNewId: id,
      carPortraitVisible: true,
      carId: carId,
      licenseColor,
      featchType: !this.state.featchType,
    });
  };

  changeType = () => {
    this.setState({ carJudgeType: false });
  };

  sendVisible = val => {
    this.setState({
      carPortraitVisible: val,
    });
  };

  selectFocus = () => {
    this.setState({
      placeholderFocus: true,
    });
  };

  selectBlur = () => {
    this.setState({
      placeholderFocus: false,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'realModel/getVehicleDistribution',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      if (i === labels.length - 1) {
        return <span key={option.value}>{label}</span>;
      }
      return <span key={option.value}> </span>;
    });
}

UserManagement.propTypes = {};
export default UserManagement;
