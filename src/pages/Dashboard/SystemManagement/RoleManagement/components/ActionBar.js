import React, { PureComponent } from 'react';
import { Input, Modal, Card, Form, Row, Col } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import classNames from 'classnames';
import { connect } from 'dva';
import styles from './ActionBar.less';
import router from 'umi/router';
import Message from '@/components/My/Message';

const { success } = Message;
const { confirm } = Modal;
@Form.create()
class ActionBar extends PureComponent {
  state = {
    searchQueryData: {
      name: '',
    },
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.actionBar}>
        <Card>
          <Form layout="inline" onSubmit={this.searchUser}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={4} sm={24}>
                <Form.Item>
                  {getFieldDecorator('name')(
                    <Input
                      // prefix={<Icon type="user" className={classNames('inputFontColor')} />}
                      className={'actionBarSortComponent'}
                      placeholder="角色名称"
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={8} sm={24}>
                <Form.Item>
                  <LdButton
                    type="select"
                    // loading={this.props.loading.effects['roleManagement/getRolesInfo']}
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
        <Card bordered={false}>
          <Row>
            <Col>
              <div className={classNames('flexStart')}>
                <LdButton icon="plus" onClick={this.addUser}>
                  添加
                </LdButton>
                <LdButton
                  type="warning"
                  icon="delete"
                  disabled={!this.props.selectedRowKeys.length > 0}
                  onClick={this.deleteConfirm}
                  globalclass={['marginLeftSm']}
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

  addUser = () => {
    router.push('/dashboard/system/roles/addOrModifyRole');
  };

  deleteConfirm = () => {
    confirm({
      title: '是否删除选中的条目?',
      content: '点击确认删除。',
      onOk: () => this.deleteUser(),
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  deleteUser = () => {
    this.props
      .dispatch({
        type: 'roleManagement/deleteRoles',
        payload: { ids: this.props.selectedRowKeys.toString() },
        queryData: this.state.searchQueryData,
        reSetSelected: this.props.reSetSelected,
      })
      .then(res => {
        if (res.success) {
          success('删除成功');
        }
      });
  };

  searchUser = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form, pageSize } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      fieldsValue.page = 0;
      fieldsValue.size = pageSize;
      this.props.setSearchInfo(fieldsValue);
      dispatch({
        type: 'roleManagement/getRolesInfo',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch, pageSize, resetSelectedRowKeys } = this.props;
    form.resetFields();
    this.setState({
      searchQueryData: { page: 0, size: pageSize },
    });
    resetSelectedRowKeys();
    this.props.setSearchInfo({ name: '', page: 0, size: pageSize });
    dispatch({
      type: 'roleManagement/getRolesInfo',
      payload: { page: 0, size: pageSize },
    });
  };
}
let mapStateToProps = function(state) {
  // es6语法解构赋值
  const { loading } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
  };
};
export default connect(mapStateToProps)(ActionBar);
