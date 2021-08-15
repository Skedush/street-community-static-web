import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Modal, message, Input, Card, Form, Row, Col, Select, Spin } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
// import DistributionMap from '@/components/CommonModule/Map';
import VillagePortrait from '@/components/CommonModule/VillagePortrait';
import { connect } from 'dva';
import store from 'store';
import styles from './index.less';
import CommonComponent from '@/components/CommonComponent';
const { Option } = Select;
@connect(state => {
  const {
    loading,
    commonModel: { communityVaule, personType, selectVillage, area, pictureData, registerType },
    realModel: { householdList, importantPersonList, personTagData },
    // communityManagement: {},
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
    communityVaule,
    importantPersonList,
    personTagData,
    householdList,
    personType,
    selectVillage,
    registerType,
    pictureData,
    area,
  };
})
@Form.create()
class Population extends PureComponent {
  // eslint-disable-next-line max-lines-per-function
  constructor(props) {
    super(props);
    this.state = {
      placeholderFocus: false,
      searchQueryData: {},
      portraitID: null,
      PersonnelValue: false,
      modelShow: false,
      ageShow: false,
      pageSize: 10,
      payload: '',
      villageId: undefined,
      loading: false,
      featchType: false,
      personTagCode: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  renderActionBar() {
    return (
      <div className={classNames(styles.actionBar)} style={{ marginBottom: '10px' }}>
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
    let tableData;
    if (this.state.searchQueryData.important) {
      tableData = this.props.importantPersonList;
    } else {
      tableData = this.props.householdList;
    }
    const { pageSize } = this.state;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: '6%',
        render: (text, record) =>
          CommonComponent.renderTableLinkCol(text, record, () =>
            this.personnelPortrait(record.personId),
          ),
      },
      {
        title: '住址',
        dataIndex: 'addressDetail',
        align: 'center',
        width: '12%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '住户类型',
        dataIndex: 'typeStr',
        width: '10%',
        align: 'center',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '最新登记时间',
        align: 'center',
        dataIndex: 'registerTime',
        width: '12%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        width: '6%',
        dataIndex: 'personId',
        render: (text, record) => (
          <LdButton type="link" onClick={() => this.personnelPortrait(text)}>
            详情
          </LdButton>
        ),
      },
    ];
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
          this.props.loading.effects['realModel/getHouseholdList'] ||
          this.props.loading.effects['realModel/getImportantPerson']
        }
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

      selectVillage,
      // personTagData,
      personType,
      registerType,
    } = this.props;

    return (
      <Col md={24} sm={24}>
        {/* <Form.Item>
          {getFieldDecorator('policeOrgId', {
            initialValue: this.state.payload,
          })(
            <Cascader
              placeholder="所属辖区"
              options={this.props.area}
              onChange={this.onChange}
              showSearch={{ filter: this.filter }}
              className={'actionBarSortComponent'}
              changeOnSelect
              displayRender={this.displayRender}
            />,
          )}
        </Form.Item> */}
        <Form.Item>
          {getFieldDecorator('villageId', {
            initialValue: this.state.villageId,
          })(
            <Select
              showSearch
              placeholder={this.state.placeholderFocus ? '请输入小区关键词' : '所属小区'}
              optionFilterProp="children"
              className={'actionBarSortComponent'}
              onFocus={this.selectFocus}
              allowClear={true}
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
          {getFieldDecorator('type')(
            <Select
              defaultActiveFirstOption={false}
              placeholder="住户类型"
              className={'actionBarSortComponent'}
              dropdownClassName={'selectDropdown'}
            >
              <Option value={-1} key={-1} className={'optionSelect'}>
                全部
              </Option>
              {personType.length > 0
                ? personType.map((type, index) => (
                    <Option value={type.key} key={index} className={'optionSelect'}>
                      {type.value}
                    </Option>
                  ))
                : null}
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('name')(
            <Input placeholder="姓名" className={'actionBarSortComponent'} allowClear />,
          )}
        </Form.Item>
        {/* <Form.Item>
          {getFieldDecorator(
            'personTagCode',
            this.state.personTagCode
              ? {
                  initialValue: this.state.personTagCode,
                }
              : {},
          )(
            <Select
              mode="multiple"
              placeholder="人员标签"
              className={classNames(styles.selectTag)}
              optionFilterProp={'children'}
              dropdownClassName={styles.selectDownTag}
              maxTagCount={3}
              showArrow
            >
              {personTagData && personTagData.length > 0
                ? personTagData.map(item => (
                    <Option value={item.code} key={item.code} label={item.code}>
                      {item.name}
                    </Option>
                  ))
                : null}
            </Select>,
          )}
        </Form.Item> */}
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
        <Form.Item>
          <LdButton
            type="select"
            // loading={
            //   this.props.loading.effects['realModel/getHouseholdList'] ||
            //   this.props.loading.effects['realModel/getImportantPerson']
            // }
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

  renderPersonnelPortrait() {
    return (
      <Modal
        title="基本信息"
        visible={this.state.PersonnelValue}
        onCancel={this.handleCancel}
        footer={false}
        wrapClassName={styles.modalPortrait}
        // destroyOnClose={true}
      >
        <VillagePortrait portraitID={this.state.portraitID} featchType={this.state.featchType} />
      </Modal>
    );
  }

  render() {
    const { buttonUse } = store.get('buttonData');

    return (
      <Spin
        tip="正在进行导出..."
        spinning={this.state.loading}
        size="large"
        wrapperClassName={styles.spinstyle}
      >
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
          {buttonUse && buttonUse.filter(item => item.name === '实有人口-导出')[0] ? (
            <div className={classNames('flexStart')}>
              <LdButton
                // type="reset"
                // icon="folder-add"
                type="reset"
                icon="upload"
                style={{ marginLeft: '16px', marginBottom: '10px' }}
                onClick={this.exportAll}
              >
                {/* <Icon type="folder-add" theme="filled" /> */}
                导出
              </LdButton>
            </div>
          ) : null}
          {this.renderTable()}
          {this.renderPersonnelPortrait()}
        </div>
      </Spin>
    );
  }

  fetchData = () => {
    let { dispatch, selectVillage } = this.props;
    let { payload, villageName, personTagCode } = this.props.location
      ? this.props.location.query
      : {};
    let villageId = null;
    let villageObj = null;
    let newData = { personTagCode };
    this.setState({
      personTagCode: personTagCode ? personTagCode.split(',') : [],
    });
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
      dispatch({ type: 'realModel/getHouseholdList', payload: newData });
      this.setSearchInfo(newData);
    });

    dispatch({ type: 'commonModel/getCommun' });
    dispatch({
      type: 'commonModel/getType',
      payload: { type: 79 },
      putType: 'setRegisterType',
    });
    dispatch({ type: 'commonModel/getType', payload: { type: 10 }, putType: 'setPersonType' });
    dispatch({ type: 'realModel/getPersonTag' });
    // dispatch({ type: 'realModel/getHouseholdList', payload: newData });
    dispatch({ type: 'commonModel/getSelectVillage' });

    dispatch({ type: 'commonModel/getArea' });
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
      if (fieldsValue.personTagCode && fieldsValue.personTagCode.length > 0) {
        let personTagCode = fieldsValue.personTagCode;
        fieldsValue.personTagCode = personTagCode.join(',');
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
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      this.setSearchInfo(fieldsValue);
      if (fieldsValue.important) {
        dispatch({
          type: 'realModel/getImportantPerson',
          payload: fieldsValue,
        });
      } else {
        dispatch({
          type: 'realModel/getHouseholdList',
          payload: fieldsValue,
        });
      }
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;

    form.resetFields();
    this.setState({
      payload: '',
      villageId: undefined,
      personTagCode: [],
    });
    this.setSearchInfo({ page: 0, size: pageSize });

    dispatch({
      type: 'realModel/getHouseholdList',
      payload: { page: 0, size: pageSize },
    });
  };

  handleCancel = val => {
    this.setState({ PersonnelValue: false, featchType: !this.state.featchType });
    // this.props.dispatch({
    //   type: 'commonModel/setDefauleImageValue',
    // });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    if (this.state.searchQueryData.important) {
      dispatch({
        type: 'realModel/getImportantPerson',
        payload: searchInfo,
      });
    } else {
      dispatch({
        type: 'realModel/getHouseholdList',
        payload: searchInfo,
      });
    }
  };

  personnelPortrait = id => {
    this.setState({
      portraitID: id,
      PersonnelValue: true,
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
    if (this.state.searchQueryData.important) {
      dispatch({
        type: 'realModel/getImportantPerson',
        payload: searchInfo,
      });
    } else {
      dispatch({
        type: 'realModel/getHouseholdList',
        payload: searchInfo,
      });
    }
    this.setState({
      pageSize,
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
  // 导出
  exportAll = () => {
    this.setState({ loading: true });
    const { searchQueryData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'realModel/getHouseholdExport',
      payload: searchQueryData,
    }).then(res => {
      if (res.success) {
        if (res.data.size > 100) {
          message.success('导出成功');
        } else {
          message.error('仅支持最大5万数据导出');
        }
      }
      this.setState({ loading: false });
    });
  };
}

Population.propTypes = {};
export default Population;
