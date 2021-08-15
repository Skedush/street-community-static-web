import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Input, Card, Form, Row, Col, Modal, message } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import styles from './index.less';
import CommonComponent from '@/components/CommonComponent';
import router from 'umi/router';
import { connect } from 'dva';
const { confirm } = Modal;

@connect(state => {
  const {
    dictionaryManagement: { dicList },
    loading,
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    dicList,
    loading,
  };
})
@Form.create()
class DictionaryManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      pageSize: 10,
      searchQueryData: {},
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'dictionaryManagement/getDicList', payload: { page: 0 } });
  }

  renderActionBar() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.actionBar}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                <Form.Item>
                  {getFieldDecorator('typeName')(
                    <Input
                      placeholder="类型描述关键字"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('key')(
                    <Input
                      placeholder="键关键字"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('value')(
                    <Input
                      placeholder="值关键字"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  <LdButton
                    type="select"
                    htmlType="submit"
                    loading={this.props.loading.effects['dictionaryManagement/getDicList']}
                  >
                    查询
                  </LdButton>
                  <LdButton style={{ marginLeft: 8 }} type="reset" onClick={this.handleFormReset}>
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
                <LdButton icon="plus" onClick={this.addDictionary}>
                  新增类型
                </LdButton>
                <LdButton
                  type="warning"
                  icon="delete"
                  disabled={!this.state.selectedRowKeys.length > 0}
                  globalclass={['marginLeftSm']}
                  onClick={this.deleteConfirm}
                >
                  删除类型
                </LdButton>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  renderTable() {
    const { pageSize } = this.state;

    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '键',
        dataIndex: 'key',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '值',
        dataIndex: 'value',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '类型描述',
        dataIndex: 'remark',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '16%',
        render: (text, record) => (
          <Fragment>
            <LdButton
              type="icon"
              size="small"
              icon="edit"
              title="修改"
              onClick={() => this.modifyDictionary(record)}
            />
            <LdButton
              type="icon"
              size="small"
              icon="delete"
              title="删除"
              onClick={() => this.deleteConfirm(record)}
            />
          </Fragment>
        ),
      },
    ];

    let tableData = this.props.dicList;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
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
        loading={this.props.loading.effects['dictionaryManagement/getDicList']}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData ? tableData.content : null}
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
        {this.renderActionBar()}
        {this.renderTable()}
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

  addDictionary = () => {
    router.push('/dashboard/system/dictionary/addOrModifyDictionary');
  };

  onSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { pageSize } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      fieldsValue.page = 0;
      fieldsValue.size = pageSize;

      this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'dictionaryManagement/getDicList',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;

    form.resetFields();
    this.setState({
      // searchQueryData: {},
      selectedRowKeys: [],
    });
    this.setSearchInfo({ name: '', page: 0, size: pageSize });
    dispatch({
      type: 'dictionaryManagement/getDicList',
      payload: { page: 0, size: pageSize },
    });
  };

  modifyDictionary = row => {
    router.push({
      pathname: '/dashboard/system/dictionary/addOrModifyDictionary',
      query: { modifyInfo: row },
    });
  };

  deleteConfirm = row => {
    confirm({
      title: row.value ? `是否删除字典${row.value}?` : '是否删除选中的条目?',
      content: '点击确认删除。',
      onOk: () => (row ? this.deleteDictionary(row.id) : this.deleteDictionary()),
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  deleteDictionary = id => {
    this.props
      .dispatch({
        type: 'dictionaryManagement/deleteDic',
        payload: id ? { ids: id } : { ids: this.state.selectedRowKeys.toString() },
        queryData: this.state.searchQueryData,
        reSetSelected: this.reSetSelected,
      })
      .then(res => {
        if (res.success) {
          message.success('删除成功');
        } else {
          message.error(`删除失败，${res.message}`);
        }
      });
  };

  onChangePage = page => {
    // this.setState({
    //   current: page,
    // });
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'dictionaryManagement/getDicList',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'dictionaryManagement/getDicList',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };
}

DictionaryManagement.propTypes = {};
export default DictionaryManagement;
