import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Input, Card, Form, Row, Col, Select, Modal } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import { connect } from 'dva';
import styles from './index.less';
import CommonComponent from '@/components/CommonComponent';
import VillagePortrait from '@/components/CommonModule/VillagePortrait';
import HouseDetail from '@/pages/Dashboard/Home/components/HouseDetail';

const { Option } = Select;
@connect(state => {
  const {
    loading,
    commonModel: { communityVaule, houseUseType, selectVillage, area },
    realModel: { houseList, importantHouseList, personList, houseTagData },
    // communityManagement: { },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
    communityVaule,
    importantHouseList,
    houseList,
    houseUseType,
    personList,
    selectVillage,
    area,
    houseTagData,
  };
})
@Form.create()
class House extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalTable: '',
      placeholderFocus: false,
      searchQueryData: {
        searchValue: '',
        villageId: '',
        important: 0,
      },
      villageId: '',
      villageModuleShow: false,
      villageModuleId: '',
      pageSize: 10,
      payload: '',
      houseVisible: false,
      houseId: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // 房屋画像
  renderHouseModal() {
    return (
      <Modal
        title="房屋信息"
        visible={this.state.houseVisible}
        onCancel={this.handleCancel.bind(this, 3)}
        footer={false}
        wrapClassName={classNames(styles.houseModal)}
        centered
        style={{ top: '40px' }}
        destroyOnClose={true}
      >
        <HouseDetail houseId={this.state.houseId} />
      </Modal>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderActionBar() {
    const {
      form: { getFieldDecorator },

      selectVillage,
      // houseTagData = [{ code: 1, name: '群租房' }],
      houseUseType,
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
                {/* <Form.Item>
                  {getFieldDecorator('idCard')(<Input placeholder="户主身份证号码" allowClear />)}
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
                      allowClear={true}
                      defaultActiveFirstOption={true}
                      placeholder={this.state.placeholderFocus ? '请输入小区关键词' : '所属小区'}
                      optionFilterProp="children"
                      // notFoundContent="无数据"
                      className={'actionBarSortComponent'}
                      // dropdownClassName={'selectDropdown'}
                      dropdownClassName={styles.select}
                      onFocus={this.selectFocus}
                      onBlur={this.selectBlur}
                    >
                      {selectVillage.length >= 0 ? (
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
                  {getFieldDecorator('useType')(
                    <Select
                      defaultActiveFirstOption={false}
                      className={'actionBarSortComponent'}
                      dropdownClassName={'selectDropdown'}
                      placeholder="请选择房屋类型"
                    >
                      <Option value={-1} key={-1} className={'optionSelect'}>
                        全部
                      </Option>
                      {houseUseType.length > 0
                        ? houseUseType.map(item => (
                            <Option value={item.key} key={item.key} className={'optionSelect'}>
                              {item.value}
                            </Option>
                          ))
                        : null}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('houseName')(
                    <Input placeholder="房屋号" className={'actionBarSortComponent'} allowClear />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('ownerSearchValue')(
                    <Input placeholder="户主" className={'actionBarSortComponent'} allowClear />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('emptyStatus')(
                    <Select
                      defaultActiveFirstOption={false}
                      placeholder="居住情况"
                      className={'actionBarSortComponent'}
                      dropdownClassName={'selectDropdown'}
                    >
                      <Option value="" key="1" className={'optionSelect'}>
                        全部
                      </Option>
                      <Option value="true" key="1" className={'optionSelect'}>
                        空置
                      </Option>
                      <Option value="false" key="2" className={'optionSelect'}>
                        居住
                      </Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('importantPerson')(
                    <Select
                      defaultActiveFirstOption={false}
                      className={'actionBarSortComponent'}
                      dropdownClassName={'selectDropdown'}
                      placeholder="重点房屋"
                    >
                      <Option value={0} key={0} className={'optionSelect'}>
                        全部
                      </Option>
                      <Option value={1} key={1} className={'optionSelect'}>
                        重点房屋
                      </Option>
                    </Select>,
                  )}
                </Form.Item>

                {/* <Form.Item>
                  {getFieldDecorator('houseTagCode')(
                    <Select
                      mode="multiple"
                      placeholder="房屋标签"
                      className={classNames(styles.selectTag)}
                      // className={'actionBarSortComponent'}
                      // dropdownClassName={'selectDropdown'}
                      optionFilterProp={'children'}
                      dropdownClassName={styles.selectDownTag}
                      maxTagCount={3}
                      showArrow
                    >
                      {houseTagData && houseTagData.length > 0
                        ? houseTagData.map(item => (
                            <Option value={item.code} key={item.code} label={item.code}>
                              {item.name}
                            </Option>
                          ))
                        : null}
                    </Select>,
                  )}
                </Form.Item> */}

                <Form.Item>
                  <LdButton
                    type="select"
                    // loading={this.props.loading.effects['realModel/getHouseList']}
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

    const columns = [
      {
        title: '小区名称',
        align: 'center',
        dataIndex: 'villageName',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '楼宇',
        dataIndex: 'buildingName',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '单元',
        dataIndex: 'unitName',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '房屋',
        dataIndex: 'houseName',
        align: 'center',
        render: (text, record) => (
          <LdButton
            type="link"
            onClick={() => this.showHouseModal(record.houseId)}
            style={{ padding: '0' }}
          >
            {text}
          </LdButton>
        ),
      },

      {
        title: '类型',
        align: 'center',
        dataIndex: 'useTypeStr',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '入住人数',
        dataIndex: 'householdCount',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '户主',
        align: 'center',
        dataIndex: 'name',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '最新登记时间',
        align: 'center',
        dataIndex: 'registerTime',
        width: '11%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'houseId',
        width: '8%',
        render: (text, record) => (
          <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'space-between' }}>
            <LdButton
              type="link"
              onClick={() => this.showHouseModal(text)}
              style={{ padding: '0' }}
            >
              详情
            </LdButton>
            <LdButton
              type="link"
              onClick={() => this.showModal(record)}
              style={{ padding: '0', maringLeft: '10px' }}
            >
              住户列表
            </LdButton>
          </div>
        ),
      },
    ];
    let tableData;
    if (this.state.searchQueryData.important) {
      tableData = this.props.importantHouseList;
    } else {
      tableData = this.props.houseList;
    }
    const pagination = {
      position: 'bottom',
      total: tableData ? tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      // pageSize: tableData ? tableData.size : 0,
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
        loading={
          this.props.loading.effects['realModel/getHouseList']
          // || this.props.loading.effects['realModel/getImportantHouseList']
        }
        columns={columns}
        dataSource={tableData ? tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'houseId'}
      />
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderModalTable() {
    const modalColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        render: (item, record) => {
          return (
            <span
              onClick={() => this.villagePortraitShow(record.personId)}
              style={{ cursor: 'pointer', color: '#22c2fe' }}
            >
              {item}
            </span>
          );
        },
      },

      {
        title: '民族',
        dataIndex: 'nation',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '人员类型',
        dataIndex: 'typeStr',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '户口关系',
        align: 'center',
        dataIndex: 'relation',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '登记时间',
        align: 'center',
        dataIndex: 'registerTime',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
    ];
    let tableData = this.props.personList;
    const pagination = {
      position: 'bottom',
      total: tableData ? tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      pageSize: tableData ? tableData.size : 0,
      defaultCurrent: 1,
      onChange: this.onChangeModalPage,
      current: tableData ? tableData.number + 1 : 1,
    };
    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        loading={this.props.loading.effects['realModel/getCompanyPersonList']}
        columns={modalColumns}
        dataSource={tableData ? tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  renderModal() {
    return (
      <Modal
        title="人员详情"
        visible={this.state.visible}
        onCancel={this.handleCancel.bind(this, 1)}
        footer={false}
        wrapClassName={styles.modal}
        width="70%"
        destroyOnClose={true}
      >
        {this.renderModalTable()}
      </Modal>
    );
  }

  renderPersonnelPortrait() {
    return (
      <Modal
        title="基本信息"
        visible={this.state.villageModuleShow}
        onCancel={this.handleCancel.bind(this, 2)}
        footer={false}
        wrapClassName={styles.modalPortrait}
        destroyOnClose={true}
      >
        <VillagePortrait portraitID={this.state.villagePortraitId} />
      </Modal>
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
        {this.renderModal()}
        {this.renderPersonnelPortrait()}
        {this.renderHouseModal()}
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
      dispatch({ type: 'realModel/getHouseList', payload: newData });
      this.setState({
        searchQueryData: newData,
      });
    });
    dispatch({ type: 'realModel/getHouseTag' });
    dispatch({ type: 'commonModel/getCommun' });
    dispatch({ type: 'commonModel/getArea' });
    dispatch({ type: 'commonModel/getType', payload: { type: 12 }, putType: 'setHouseUseType' });
  };

  showModal(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'realModel/getPersonListByHouse',
      payload: { page: 0, id: record.houseId },
    });
    this.setState({
      visible: true,
      modalTable: record.houseId,
    });
  }

  handleCancel = type => {
    switch (type) {
      case 1:
        this.setState({
          visible: false,
        });
        break;
      case 2:
        this.setState({
          villageModuleShow: false,
        });
        break;
      case 3:
        this.setState({
          houseVisible: false,
        });
        break;
    }
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
      if (fieldsValue.houseTagCode) {
        fieldsValue.houseTagCode = fieldsValue.houseTagCode.toString();
      }
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      this.setSearchInfo(fieldsValue);

      dispatch({
        type: 'realModel/getHouseList',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;
    form.resetFields();
    this.setState({
      payload: '',
      villageId: '',
    });
    this.setSearchInfo({ page: 0, size: pageSize });
    dispatch({
      type: 'realModel/getHouseList',
      payload: { page: 0, size: pageSize },
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;

    dispatch({
      type: 'realModel/getHouseList',
      payload: searchInfo,
    });
  };

  showHouseModal = houseId => {
    this.setState({
      houseId,
      houseVisible: true,
    });
  };

  onChangeModalPage = page => {
    const { dispatch } = this.props;
    const { modalTable } = this.state;
    dispatch({
      type: 'realModel/getPersonListByHouse',
      payload: { page: page - 1, id: modalTable },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'realModel/getHouseList',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };

  villagePortraitShow = id => {
    this.setState({
      villagePortraitId: id,
      villageModuleShow: true,
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

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
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
}

House.propTypes = {};
export default House;
