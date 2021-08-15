/* eslint-disable max-lines-per-function */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Card, Form, Row, Col, Select, Modal, Input, Checkbox, Badge } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import EquipmentPortrait from '@/components/CommonModule/EquipmentPortrait';
import CommonComponent from '@/components/CommonComponent';
import { connect } from 'dva';
import styles from './index.less';
const { Option } = Select;

@connect(state => {
  const {
    loading,
    commonModel: { selectVillage, area, deviceType, deviceStatus },
    deviceModel: { deviceList },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
    deviceList,
    selectVillage,
    area,
    deviceType,
    deviceStatus,
  };
})
@Form.create()
class Device extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      searchQueryData: {
        status: [],
        type: this.props.initType,
      },
      placeholderFocus: false,
      equipmentNo: '',
      equipmentPortraitVisible: false,
      equipmentType: null,
      indeterminate: false,
      checkAll: true,
      checkedList: [],
    };
  }
  async componentDidMount() {
    const { dispatch, initType, form } = this.props;
    dispatch({ type: 'commonModel/getCommun' });
    dispatch({ type: 'commonModel/getSelectVillage' });
    dispatch({ type: 'commonModel/getArea' });
    if (initType) {
      form.setFieldsValue({
        type: initType,
      });
    }
    dispatch({ type: 'deviceModel/getDeviceList', payload: { page: 0, type: initType } });
    dispatch({ type: 'commonModel/getType', payload: { type: 1 }, putType: 'setDeviceType' });
    const data = await dispatch({
      type: 'commonModel/getType',
      payload: { type: 69 },
      putType: 'setDeviceStatus',
    });
    if (data && data.length > 0) {
      this.setState({
        checkedList: data.map(item => item.key),
      });
    }
  }

  renderActionBar() {
    const {
      form: { getFieldDecorator },
      selectVillage,
      deviceType,
    } = this.props;
    return (
      <div className={classNames(styles.actionBar)} style={{ marginBottom: '10px' }}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                {/* <Form.Item>
                  {getFieldDecorator('policeOrgId')(
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
                  {getFieldDecorator('villageId')(
                    <Select
                      showSearch
                      defaultActiveFirstOption={true}
                      placeholder={this.state.placeholderFocus ? '请输入小区关键词' : '请选择小区'}
                      optionFilterProp="children"
                      className={'actionBarSortComponent'}
                      dropdownClassName={styles.select}
                      allowClear={true}
                      onFocus={this.selectFocus}
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
                  {getFieldDecorator('type')(
                    <Select
                      showSearch
                      defaultActiveFirstOption={true}
                      placeholder={'请选择设备类型'}
                      optionFilterProp="children"
                      className={'actionBarSortComponent'}
                      dropdownClassName={styles.select}
                    >
                      {deviceType.length > 0 ? (
                        deviceType.map(type => (
                          <Option value={type.key} key={type.key} className={'optionSelect'}>
                            {type.value}
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
                  {getFieldDecorator('name')(
                    <Input
                      placeholder="设备名称"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('code')(
                    <Input
                      placeholder="设备编号"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  <LdButton
                    type="select"
                    // loading={this.props.loading.effects['deviceModel/getDeviceList']}
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
        title: '设备名称',
        align: 'center',
        dataIndex: 'name',
        width: '10%',
        render: (text, record) =>
          CommonComponent.renderTableLinkCol(text, record, () => this.equipmentPortrait(record)),
      },
      {
        title: '设备编号',
        align: 'center',
        dataIndex: 'code',
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
        title: '设备位置',
        align: 'center',
        dataIndex: 'address',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '设备状态',
        align: 'center',
        dataIndex: 'statusStr',
        width: '10%',
        render: (text, record) => {
          const { status } = record;
          let badge = 'success';

          if (status !== '1') {
            badge = 'error';
          }

          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
              <Badge status={badge} color={status === '2' ? '#ff5a5a' : ''} />
              {text}
            </div>
          );
        },
      },
      {
        title: '设备类型',
        align: 'center',
        dataIndex: 'typeStr',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '建设单位',
        align: 'center',
        dataIndex: 'buildUnit',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '建设单位电话',
        align: 'center',
        dataIndex: 'buildUnitPhone',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '最新登记时间',
        align: 'center',
        dataIndex: 'registerTime',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'id',
        width: '6%',
        render: (text, record) => (
          <LdButton type="link" onClick={() => this.equipmentPortrait(record)}>
            详情
          </LdButton>
        ),
      },
    ];
    let tableData = this.props.deviceList;
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
        loading={this.props.loading.effects['deviceModel/getDeviceList']}
        columns={columns}
        dataSource={tableData ? tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  renderEquipmentPortrait() {
    return (
      <Modal
        visible={this.state.equipmentPortraitVisible}
        // visible="true"
        onCancel={this.handleCarCancel}
        footer={false}
        wrapClassName={styles.equipmentModal}
        destroyOnClose={true}
        title={'设备详情'}
      >
        <EquipmentPortrait equipmentNo={this.state.equipmentNo} />
      </Modal>
    );
  }

  renderGroupButton() {
    const { deviceStatus } = this.props;
    return (
      <div className={classNames('flexBetween', styles.groupButton)}>
        <LdButton
          // type="reset"
          // icon="folder-add"
          type="reset"
          icon="upload"
          style={{ marginLeft: '16px', marginBottom: '10px' }}
          onClick={this.exportAll}
          loading={this.props.loading.effects['deviceModel/exportDeviceList']}
        >
          导出
        </LdButton>
        <div>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全部
          </Checkbox>
          <Checkbox.Group
            options={deviceStatus}
            value={this.state.checkedList}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        {this.renderActionBar()}
        {this.renderGroupButton()}

        {this.renderTable()}
        {this.renderEquipmentPortrait()}
      </div>
    );
  }

  exportAll = () => {
    const { dispatch } = this.props;
    const { searchQueryData } = this.state;
    dispatch({
      type: 'deviceModel/exportDeviceList',
      payload: { ...searchQueryData },
    });
  };

  onChange = async checkedList => {
    const { deviceStatus } = this.props;
    await this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < deviceStatus.length,
      checkAll: checkedList.length === deviceStatus.length,
    });
    this.onSearch();
  };

  onCheckAllChange = async e => {
    const { deviceStatus } = this.props;
    await this.setState({
      checkedList: e.target.checked ? deviceStatus.map(item => item.value) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
    this.onSearch();
  };

  handleCarCancel = e => {
    this.setState({
      equipmentPortraitVisible: false,
    });
    this.props.dispatch({
      type: 'commonModel/updateState',
      payload: { equipmentInfo: null, equipmentRecord: {} },
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
    const { pageSize, searchQueryData, checkedList } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
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
      if (checkedList.length === 0) {
        fieldsValue.status = 0;
      } else {
        fieldsValue.status = checkedList.toString();
      }
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      this.setSearchInfo({ ...searchQueryData, ...fieldsValue });
      dispatch({
        type: 'deviceModel/getDeviceList',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch, deviceStatus } = this.props;
    const { pageSize } = this.state;

    form.resetFields();
    this.setState({
      checkedList: deviceStatus.map(item => item.value),
      checkAll: true,
      indeterminate: false,
    });
    this.setSearchInfo({ searchValue: '', page: 0, size: pageSize });
    dispatch({
      type: 'deviceModel/getDeviceList',
      payload: { page: 0, size: pageSize },
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'deviceModel/getDeviceList',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'deviceModel/getDeviceList',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };

  equipmentPortrait = record => {
    this.setState({
      equipmentNo: record.id,
      equipmentPortraitVisible: true,
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

Device.propTypes = {};
export default Device;
