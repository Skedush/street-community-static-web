import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Input, Modal, Card, Form, Row, Col, Select, message } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import { connect } from 'dva';
import CommonComponent from '@/components/CommonComponent';
import CopyModal from './CopyModal';
import styles from './index.less';
import AddModal from './AddModal';
const Option = Select.Option;

const { confirm } = Modal;

@connect(state => {
  const {
    tagManagementModel: { tabManagementInfo, typeObject, typeOrgin },
    loading,
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
    tabManagementInfo,
    typeObject,
    typeOrgin,
  };
})
@Form.create()
class TagManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchQueryData: {},
      pageSize: 10,
      copyVisible: false,
      editVisible: false,
      updateVisible: false,
      editData: {},
      copyId: '',
    };
  }

  componentDidMount() {
    this.fetch();
  }
  // eslint-disable-next-line max-lines-per-function
  actionBarRender() {
    const {
      form: { getFieldDecorator },
      typeObject,
      typeOrgin,
    } = this.props;

    return (
      <div className={styles.actionBar}>
        <Card>
          <Form layout="inline" onSubmit={this.tagSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                <Form.Item>
                  {getFieldDecorator('name')(
                    <Input
                      placeholder="标签名称"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('targetType')(
                    <Select
                      showSearch
                      defaultActiveFirstOption={true}
                      className={'actionBarSortComponent'}
                      placeholder="请选择标注对象"
                      optionFilterProp="children"
                    >
                      <Option value={-1} key={-1} className={'optionSelect'}>
                        全部
                      </Option>
                      {typeObject.map(item => {
                        return (
                          <Option value={item.key} key={item.key} className={'optionSelect'}>
                            {item.value}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('sourceType')(
                    <Select
                      showSearch
                      defaultActiveFirstOption={true}
                      className={'actionBarSortComponent'}
                      placeholder="请选择标签来源"
                      optionFilterProp="children"
                    >
                      <Option value={-1} key={-1} className={'optionSelect'}>
                        全部
                      </Option>
                      {typeOrgin
                        ? typeOrgin.map(item => (
                            <Option value={item.key} key={item.key} className={'optionSelect'}>
                              {item.value}
                            </Option>
                          ))
                        : null}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('artificialAble')(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      defaultActiveFirstOption={true}
                      placeholder="选择是否可人工标注"
                      className={'actionBarSortComponent'}
                      optionFilterProp="children"
                    >
                      <Option value={true} key={2} className={'optionSelect'}>
                        是
                      </Option>
                      <Option value={false} key={1} className={'optionSelect'}>
                        否
                      </Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('creator')(
                    <Input placeholder="创建人" className={'actionBarSortComponent'} allowClear />,
                  )}
                </Form.Item>
                <Form.Item>
                  <LdButton
                    type="select"
                    htmlType="submit"
                    // loading={this.props.loading.effects['tagManagementModel/getTagInfo']}
                  >
                    查找
                  </LdButton>
                  <LdButton
                    style={{ marginLeft: 8 }}
                    // loading={this.props.loading.effects['tagManagementModel/getTagInfo']}
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
                <LdButton
                  icon="plus"
                  onClick={() => {
                    this.tagModal('add');
                  }}
                >
                  添加
                </LdButton>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  renderAddModal() {
    const { editData, updateVisible } = this.state;
    return (
      <Modal
        title={Object.keys(editData).length === 0 ? '新增标签' : '编辑标签'}
        visible={this.state.editVisible}
        onCancel={this.handleCancel}
        footer={false}
        wrapClassName={styles.modal}
        width="40%"
        destroyOnClose={true}
      >
        <AddModal
          editData={editData}
          updateVisible={updateVisible}
          handleCancel={this.handleCancel}
          searchQueryData={this.state.searchQueryData}
        />
      </Modal>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  tableRender() {
    const { pageSize } = this.state;

    const columns = [
      {
        title: '标签名称',
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        onCell: () => {
          return {
            style: {
              maxWidth: 50,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          };
        },
        render: (text, record) => (
          <a
            style={{ cursor: 'pointer', color: '#22c2fe' }}
            type="link"
            onClick={() => {
              this.tagModal('update', record);
            }}
            title={text}
          >
            {text}
          </a>
        ),
      },
      {
        title: '标签来源',
        dataIndex: 'source',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '标注对象',
        dataIndex: 'targetType',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '是否可人工标注',
        dataIndex: 'artificialAble',
        align: 'center',
        width: '10%',

        render: (text, record) => <span>{text ? '是' : '否'}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        align: 'center',
        width: '10%',

        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        width: '15%',

        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        // width: '10%',
        width: '15%',

        render: (text, record) => (
          <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
            <LdButton
              type="link"
              style={{ padding: '3px' }}
              onClick={() => {
                this.tagModal('copy', record);
              }}
            >
              拷贝
            </LdButton>
            <LdButton
              type="link"
              style={{ padding: '3px' }}
              onClick={() => {
                this.clearConfirm(record);
              }}
            >
              清空
            </LdButton>
            <LdButton
              type="link"
              style={{ padding: '3px' }}
              onClick={() => {
                this.deleteConfirm(record);
              }}
            >
              删除
            </LdButton>
          </div>
        ),
      },
    ];

    const pagination = {
      position: 'bottom',
      total: this.props.tabManagementInfo ? this.props.tabManagementInfo.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      pageSize: pageSize,
      defaultCurrent: 1,
      onChange: this.onPageChange,
      current: this.props.tabManagementInfo ? this.props.tabManagementInfo.number + 1 : 1,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };
    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        columns={columns}
        loading={this.props.loading.effects['tagManagementModel/getTagInfo']}
        dataSource={this.props.tabManagementInfo ? this.props.tabManagementInfo.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  renderCopyModal() {
    return (
      <Modal
        title="拷贝标签元素"
        // visible={informationShow}
        visible={this.state.copyVisible}
        onCancel={this.handleCancel}
        footer={false}
        wrapClassName={styles.modal}
        width="40%"
        destroyOnClose={true}
        // zIndex={9998}
      >
        <CopyModal
          copyType={this.state.copyType}
          handleCancel={this.handleCancel}
          sourceId={this.state.copyId}
          searchQueryData={this.state.searchQueryData}
        />
      </Modal>
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
        {this.renderCopyModal()}
        {this.renderAddModal()}
      </div>
    );
  }

  fetch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tagManagementModel/getType',
      payload: { type: 50 },
      putType: 'setObject',
    });
    dispatch({
      type: 'tagManagementModel/getType',
      payload: { type: 49 },
      putType: 'setOrigin',
    });
    dispatch({
      type: 'tagManagementModel/getTagInfo',
    });
  };

  setSearchInfo = data => {
    this.setState({ searchQueryData: data });
  };

  // 拷贝标签弹窗
  tagModal = (type, data) => {
    if (type === 'copy') {
      this.setState({
        copyVisible: true,
        copyId: data.id,
        copyType: data.source,
      });
    }
    if (type === 'add' || type === 'update') {
      this.setState({
        editVisible: true,
      });
      if (type === 'update') {
        this.setState({
          // editData: { name: 123, userType: ['车辆'] },
          editData: data,
          updateVisible: true,
        });
      }
    }
  };

  // 调用拷贝接口
  copyOk = () => {
    this.setState({
      copyVisible: false,
    });
  };

  clearConfirm = record => {
    confirm({
      title: `是否清空标签名为${record.name}?`,
      content: '点击确认清空。',
      onOk: () => this.clearTagunit(record),
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  // 清空调用接口
  clearTagunit = record => {
    const { dispatch } = this.props;

    if (record.source === '系统标签') {
      message.error('系统标签不能进行操作');
      return;
    }
    dispatch({
      type: 'tagManagementModel/getTagClear',
      payload: { id: record.id },
    }).then(res => {
      if (res.success) {
        message.success('清空成功');
        dispatch({
          type: 'tagManagementModel/getTagInfo',
          payload: this.state.searchQueryData,
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      copyVisible: false,
      editVisible: false,
      updateVisible: false,
      editData: {},
    });
  };

  tagSearch = e => {
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
        type: 'tagManagementModel/getTagInfo',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;
    form.resetFields();
    this.setSearchInfo({ page: 0, size: pageSize });
    dispatch({
      type: 'tagManagementModel/getTagInfo',
      payload: { page: 0, size: pageSize },
    });
  };

  deleteConfirm = record => {
    confirm({
      title: `是否删除标签名为${record.name}?`,
      content: '点击确认删除。',
      onOk: () => this.deleteTag(record.id),
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  deleteTag = id => {
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    const { dispatch } = this.props;
    dispatch({
      type: 'tagManagementModel/delTag',
      payload: { id: id },
    }).then(res => {
      if (res.success) {
        message.success('删除成功');
        dispatch({
          type: 'tagManagementModel/getTagInfo',
          payload: searchInfo,
        });
      }
    });
  };

  onPageChange = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'tagManagementModel/getTagInfo',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'tagManagementModel/getTagInfo',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };
}

TagManagement.propTypes = {};
export default TagManagement;
