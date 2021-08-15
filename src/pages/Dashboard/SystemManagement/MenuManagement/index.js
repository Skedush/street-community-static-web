import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Input, Modal, Card, Form, Row, Col, Select, message } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import { connect } from 'dva';
import CommonComponent from '@/components/CommonComponent';
import styles from './index.less';
import router from 'umi/router';
const Option = Select.Option;
const { confirm } = Modal;

@connect(state => {
  const {
    menuManagement: { tableData },
    commonModel: { menuType },
    loading,
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    tableData,
    loading,
    menuType,
  };
})
@Form.create()
class MenuManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchQueryData: {},
      pageSize: 10,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'menuManagement/menuGet', payload: { page: 0 } });
    dispatch({ type: 'commonModel/getType', payload: { type: 25 }, putType: 'setMenuType' });
  }

  actionBarRender() {
    const {
      form: { getFieldDecorator },
      menuType,
    } = this.props;
    return (
      <div className={styles.actionBar}>
        <Card>
          <Form layout="inline" onSubmit={this.menuSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                <Form.Item>
                  {getFieldDecorator('name')(
                    <Input
                      placeholder="菜单名称"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('type')(
                    <Select
                      defaultActiveFirstOption={false}
                      placeholder="请选择菜单类型"
                      className={'actionBarSortComponent'}
                      dropdownClassName={'selectDropdown'}
                    >
                      <Option value={-1} key={-1} className={'optionSelect'}>
                        全部
                      </Option>
                      {menuType.length > 0
                        ? menuType.map(type => (
                            <Option value={type.key} key={type.key} className={'optionSelect'}>
                              {type.value}
                            </Option>
                          ))
                        : null}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  <LdButton
                    type="select"
                    // loading={this.props.loading.effects['menuManagement/menuGet']}
                    htmlType="submit"
                  >
                    查找
                  </LdButton>
                  <LdButton
                    style={{ marginLeft: 8 }}
                    // loading={this.props.loading.effects['menuManagement/menuGet']}
                    type="reset"
                    onClick={this.handleFormReset}
                  >
                    重置
                  </LdButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false}>
          <Row>
            <Col>
              <div className={classNames('flexStart')}>
                {/* <LdButton icon="plus" onClick={this.menuAdd}>
                  添加
                </LdButton> */}
                <LdButton
                  type="warning"
                  icon="delete"
                  disabled={!this.state.selectedRowKeys.length > 0}
                  onClick={this.deleteConfirm}
                  // globalclass={['marginLeftSm']}
                >
                  删除
                </LdButton>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  tableRender() {
    const { pageSize } = this.state;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '功能类型',
        dataIndex: 'typeStr',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '功能URL',
        dataIndex: 'url',
        align: 'center',
        width: '20%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '菜单等级',
        dataIndex: 'level',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '功能描述',
        dataIndex: 'description',
        align: 'center',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '父级功能',
        dataIndex: 'parentName',
        align: 'center',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: '10%',
        render: (text, record) =>
          this.props.tableData.content.length >= 1 ? (
            <Fragment>
              <LdButton
                type="icon"
                size="small"
                onClick={() => this.menuModify(record)}
                icon="edit"
                title="修改"
              />
              <LdButton
                type="icon"
                size="small"
                onClick={() => this.deleteConfirm(record)}
                title="删除"
                icon="delete"
              />
            </Fragment>
          ) : null,
      },
    ];
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const pagination = {
      position: 'bottom',
      total: this.props.tableData ? this.props.tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      pageSize: pageSize,
      defaultCurrent: 1,
      onChange: this.onPageChange,
      current: this.props.tableData ? this.props.tableData.number + 1 : 1,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };
    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        loading={this.props.loading.effects['menuManagement/menuGet']}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.props.tableData ? this.props.tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  render() {
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        {this.actionBarRender()}
        {this.tableRender()}
      </div>
    );
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  reSetSelected = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  setSearchInfo = data => {
    this.setState({ searchQueryData: data });
  };

  menuAdd = () => {
    router.push('/dashboard/system/menus/addOrModifyMenu');
  };

  menuSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { pageSize } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.page = 0;
      fieldsValue.size = pageSize;
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'menuManagement/menuGet',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;

    form.resetFields();
    this.setState({
      selectedRowKeys: [],
    });
    this.setSearchInfo({ page: 0, size: pageSize });
    dispatch({
      type: 'menuManagement/menuGet',
      payload: { page: 0, size: pageSize },
    });
  };

  menuModify = row => {
    router.push({
      pathname: '/dashboard/system/menus/addOrModifyMenu',
      query: { modifyInfo: row },
    });
  };

  deleteConfirm = row => {
    confirm({
      title: row.name ? `是否删除菜单名为${row.name}?` : '是否删除选中的条目?',
      content: '点击确认删除。',
      onOk: () => (row ? this.deleteUser(row.id) : this.deleteUser()),
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  deleteUser = id => {
    this.props
      .dispatch({
        type: 'menuManagement/menuDelete',
        payload: id ? { ids: id } : { ids: this.state.selectedRowKeys.toString() },
        queryData: this.state.searchQueryData,
        reSetSelected: this.reSetSelected,
      })
      .then(res => {
        if (res && res.success) {
          message.success('删除成功');
        }
      });
  };

  onPageChange = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'menuManagement/menuGet',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'menuManagement/menuGet',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };
}

MenuManagement.propTypes = {};
export default MenuManagement;
