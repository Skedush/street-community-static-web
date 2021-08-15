import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Input, Menu, Modal, Card, Dropdown, Form, Row, Col, Select } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import { connect } from 'dva';
import { Base64 } from 'js-base64';
import CommonComponent from '@/components/CommonComponent';
import styles from './index.less';
import router from 'umi/router';
import store from 'store';
import Message from '@/components/My/Message';
import { isPassword } from '@/utils/validator';
const { Option } = Select;

const { success, error } = Message;
const { confirm } = Modal;

@connect(state => {
  const {
    userManagement: { tableData, roleType },
    loading,
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    tableData,
    loading,
    roleType,
  };
})
@Form.create()
class UserManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchQueryData: {},
      editPassword: false,
      editPwUserId: '',
      pageSize: 10,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'userManagement/getUserList', payload: { page: 0 } });
    dispatch({ type: 'userManagement/getType', payload: { type: 25 } });
    dispatch({ type: 'userManagement/getRoleType' });
  }
  // eslint-disable-next-line max-lines-per-function
  renderActionBar() {
    const {
      form: { getFieldDecorator },
      roleType,
    } = this.props;
    const { buttonUse } = store.get('buttonData');

    return (
      <div className={styles.actionBar}>
        <Card>
          <Form layout="inline" onSubmit={this.menuSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                <Form.Item>
                  {getFieldDecorator('userName')(
                    <Input placeholder="登录名" className={'actionBarSortComponent'} allowClear />,
                  )}
                </Form.Item>{' '}
                <Form.Item>
                  {getFieldDecorator('name')(
                    <Input placeholder="姓名" className={'actionBarSortComponent'} allowClear />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('policeName')(
                    <Input
                      placeholder="所属单位"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('roleId')(
                    <Select
                      placeholder="请选择所属角色"
                      className={'actionBarSortComponent'}
                      dropdownClassName={styles.selectDownTag}
                    >
                      <Option value={''} key={''}>
                        全部
                      </Option>
                      {roleType
                        ? roleType.length > 0
                          ? roleType.map((item, index) => (
                              <Option value={item.id} key={index} className={styles.optionSelect}>
                                {item.name}
                              </Option>
                            ))
                          : null
                        : null}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  <LdButton
                    type="select"
                    // loading={this.props.loading.effects['userManagement/getUserList']}
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
        <Card bordered={false} className={styles.card} style={{ padding: '12px 24px' }}>
          <Row>
            <Col>
              <div className={classNames('flexStart')}>
                {buttonUse && buttonUse.filter(item => item.name === '用户管理-新增')[0] ? (
                  <LdButton
                    icon="plus"
                    // {buttonShow && buttonShow.filter(item => item.name === '用户管理-新增')[0] ? (

                    onClick={this.menuAdd}
                    style={{
                      margin: '12px 0',
                      // padding: '12px 0',
                    }}
                  >
                    添加
                  </LdButton>
                ) : null}
                {buttonUse && buttonUse.filter(item => item.name === '用户管理-删除')[0] ? (
                  <LdButton
                    type="warning"
                    icon="delete"
                    disabled={!this.state.selectedRowKeys.length > 0}
                    onClick={this.deleteConfirm}
                    globalclass={['marginLeftSm']}
                    style={{
                      margin: '12px 16px',

                      // padding:''
                      // padding: '12px 0',
                    }}
                  >
                    删除
                  </LdButton>
                ) : null}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
  renderMenu(record) {
    const { buttonUse } = store.get('buttonData');

    return (
      <Menu
        style={{ maxWidth: '90px', right: '2px' }}
        onClick={e => {
          this.menuClick(e, record);
        }}
      >
        <Menu.Item
          key="1"
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            color: '#22c2fe',
          }}
          disabled={!(buttonUse && buttonUse.filter(item => item.name === '用户管理-编辑')[0])}
        >
          更改密码
        </Menu.Item>
        <Menu.Item
          key="2"
          style={{
            display: 'flex',
            justifyContent: 'center',
            color: '#22c2fe',

            width: '100%',
          }}
          disabled={!(buttonUse && buttonUse.filter(item => item.name === '用户管理-编辑')[0])}
        >
          重置密码
        </Menu.Item>
        <Menu.Item
          key="3"
          style={{
            display: 'flex',
            justifyContent: 'center',
            color: '#22c2fe',
            width: '100%',

            // onClick={this.deleteConfirm(record)}>
          }}
          disabled={!(buttonUse && buttonUse.filter(item => item.name === '用户管理-删除')[0])}
        >
          删除账号
        </Menu.Item>
      </Menu>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { pageSize } = this.state;
    const { buttonUse } = store.get('buttonData');

    const columns = [
      {
        title: '登录名',
        dataIndex: 'userName',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '所属单位',
        dataIndex: 'policeName',
        align: 'center',
        width: '20%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '所属角色',
        dataIndex: 'roleName',
        align: 'center',
        width: '10%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        align: 'center',
        width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '使用状态',
        dataIndex: 'enable',
        align: 'center',
        width: '8%',
        render: (text, record) => {
          return <span>{text ? '启用' : '停用'}</span>;
        },
      },
      {
        title: '最后登录时间',
        dataIndex: 'lastLoginTime',
        align: 'center',
        width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '操作',
        dataIndex: 'operation',
        width: '12%',
        render: (text, record) =>
          this.props.tableData.content.length >= 1 ? (
            <Fragment>
              {/* <LdButton
                type="icon"
                size="small"
                onClick={() => this.editPasswordConfirm(record)}
                title="修改密码"
                icon="key"
              />
              <LdButton
                type="icon"
                size="small"
                onClick={() => this.menuModify(record)}
                icon="edit"
                title="编辑"
              />
              <LdButton
                type="icon"
                size="small"
                onClick={() => this.deleteConfirm(record)}
                title="删除"
                icon="delete"
              /> */}
              <LdButton
                type="link"
                disabled={
                  !(buttonUse && buttonUse.filter(item => item.name === '用户管理-编辑')[0])
                }
                onClick={() => this.menuModify(record)}
              >
                编辑
              </LdButton>

              <Dropdown
                placement="bottomLeft"
                overlayClassName={styles.overlay}
                overlay={this.renderMenu(record)}
                trigger="click"
              >
                <LdButton type="link">更多</LdButton>
              </Dropdown>
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
      // pageSize: this.props.tableData ? this.props.tableData.size : 0,
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
        loading={this.props.loading.effects['userManagement/getUserList']}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.props.tableData ? this.props.tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'userId'}
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
        <Modal
          title="修改密码"
          visible={this.state.editPassword}
          onCancel={this.closePassword}
          confirmLoading={this.props.loading.effects['userManagement/updateUserPassWord']}
          width="400px"
          footer={null}
          destroyOnClose={true}
          wrapClassName={styles.modal}
        >
          <PasswordForm
            closePassword={this.closePassword}
            loading={this.props.loading}
            editPwUserId={this.state.editPwUserId}
            dispatch={this.props.dispatch}
          />
        </Modal>
      </div>
    );
  }

  menuClick = (e, record) => {
    const key = e.key;
    switch (key) {
      // 修改帐号
      case '1':
        this.editPasswordConfirm(record);
        break;
      // 重置帐号
      case '2':
        this.resetConfirm(record);
        break;
      // 删除帐号
      case '3':
        this.deleteConfirm(record);
        break;

      default:
        break;
    }
  };

  editPasswordConfirm = row => {
    this.setState({
      editPassword: true,
      editPwUserId: row.userId,
    });
  };

  closePassword = e => {
    this.setState({
      editPassword: false,
    });
  };

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
    router.push('/dashboard/system/users/addOrModifyUser');
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
      this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'userManagement/getUserList',
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
      type: 'userManagement/getUserList',
      payload: { page: 0, size: pageSize },
    });
  };

  menuModify = row => {
    router.push({
      pathname: '/dashboard/system/users/addOrModifyUser',
      query: { modifyInfo: row },
    });
  };

  deleteConfirm = row => {
    confirm({
      title: row.name ? `是否删除用户${row.name}?` : '是否删除选中的条目?',
      content: '点击确认删除。',
      onOk: () => (row ? this.deleteUser(row.userId) : this.deleteUser()),
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  resetConfirm = row => {
    confirm({
      title: `是否重置用户${row.name}`,
      content: '点击确认重置。',
      className: styles.confirtBox,
      onOk: () => this.resetUser(row.userId),
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  resetUser = id => {
    this.props
      .dispatch({
        type: 'userManagement/getResetPassword',
        payload: { id },
      })
      .then(res => {
        if (res.success) {
          confirm({
            title: '重置后的新密码',
            content: res.data.msg,
            okText: '确认',
            cancelText: '取消',
          });
        }
      });
  };

  deleteUser = id => {
    this.props
      .dispatch({
        type: 'userManagement/deleteUser',
        payload: id ? { ids: id } : { ids: this.state.selectedRowKeys.toString() },
        queryData: this.state.searchQueryData,
        reSetSelected: this.reSetSelected,
      })
      .then(res => {
        if (res.success) {
          success('删除成功');
        } else {
          error(`删除失败,${res.message}`);
        }
      });
  };

  onPageChange = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'userManagement/getUserList',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'userManagement/getUserList',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
    });
  };
}

@Form.create()
class PasswordForm extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    return (
      <Form onSubmit={this.setPassword}>
        <Form.Item>
          {getFieldDecorator('oldPwd', {
            rules: [
              {
                required: true,
                message: '请输入初始密码!',
              },
            ],
          })(
            <Input.Password
              className={classNames('noBorderRadius', 'marginBottomSm')}
              placeholder="初始密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('newPwd', {
            rules: [
              {
                required: true,
                message: '请输入新密码!',
              },
              {
                validator: (_, value, callback) => {
                  const username = getFieldValue('user.username');
                  if (username === value) {
                    callback(new Error('密码不能与登录名相同'));
                  }
                  isPassword(_, value, callback);
                },
              },
            ],
          })(
            <Input.Password
              className={classNames('noBorderRadius', 'marginBottomSm')}
              placeholder="新密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('reNewPwd', {
            rules: [
              {
                required: true,
                message: '请确认两次输入是否一致!',
              },
              {
                validator: this.handleConfirmPassword,
              },
            ],
          })(
            <Input.Password
              className={classNames('noBorderRadius', 'marginBottomSm')}
              placeholder="再次输入新密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <div className={classNames('flexEnd')}>
            <LdButton style={{ marginLeft: 8 }} type="reset" onClick={this.props.closePassword}>
              取消
            </LdButton>
            <LdButton
              type="secondButton"
              loading={this.props.loading.effects['userManagement/updateUserPassWord']}
              htmlType="submit"
            >
              确定
            </LdButton>
          </div>
        </Form.Item>
      </Form>
    );
  }

  setPassword = e => {
    if (e) {
      e.preventDefault();
    }
    const { validateFieldsAndScroll, validateFields, resetFields } = this.props.form;
    const { dispatch } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        validateFields((err, fieldsValue) => {
          if (err) return;
          fieldsValue.userId = this.props.editPwUserId;
          fieldsValue.oldPwd = Base64.encode(values.oldPwd).toString();
          fieldsValue.newPwd = Base64.encode(values.newPwd).toString();
          fieldsValue.reNewPwd = Base64.encode(values.reNewPwd).toString();
          dispatch({
            type: 'userManagement/updateUserPassWord',
            payload: fieldsValue,
          }).then(res => {
            if (res.success) {
              success('修改成功');
              resetFields();
              this.props.closePassword();
            }
          });
        });
      }
    });
  };

  handleConfirmPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('newPwd')) {
      // eslint-disable-next-line standard/no-callback-literal
      callback('两次输入不一致！');
    }
    // // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };
}

UserManagement.propTypes = {};
export default UserManagement;
