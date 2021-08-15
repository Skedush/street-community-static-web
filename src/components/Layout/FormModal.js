import React, { PureComponent } from 'react';
import { Form, Input, Row, Col } from 'antd';
import classNames from 'classnames';
import styles from './Header.less';
import { connect } from 'dva';
import LdButton from '@/components/My/Button/LdButton';
import Message from '@/components/My/Message';

const { success } = Message;

@Form.create()
@connect(({ app: { userDetail } }) => ({
  userDetail,
}))
class FormModal extends PureComponent {
  // eslint-disable-next-line max-lines-per-function
  renderFormItem() {
    const {
      userDetail,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div
        className={classNames(
          'paddingRightLg',
          'paddingLeftLg',
          'flexBetween',
          'flexWrap',
          'width100',
          styles.form,
        )}
      >
        <Form.Item label="登录名" className={'width45'}>
          {getFieldDecorator('username', {
            initialValue: userDetail.username,
          })(<Input className={classNames('noBorderRadius')} disabled />)}
        </Form.Item>

        <Form.Item label="姓名" className={'width45'}>
          {getFieldDecorator('name', {
            initialValue: userDetail.name,
            rules: [{ required: true, message: '请输入姓名！' }],
          })(<Input className={classNames('noBorderRadius')} />)}
        </Form.Item>

        <Form.Item label="电话" className={'width45'}>
          {getFieldDecorator('phone', {
            initialValue: userDetail.phone,
          })(<Input className={classNames('noBorderRadius')} />)}
        </Form.Item>
        <Form.Item label="角色" className={'width45'}>
          {getFieldDecorator('role', {
            initialValue: userDetail.role,
          })(<Input className={classNames('noBorderRadius')} disabled />)}
        </Form.Item>
        <Form.Item label="单位" className={'width45'}>
          <Input
            placeholder={userDetail.policeOrgName}
            className={classNames('noBorderRadius')}
            disabled
          />
        </Form.Item>
        <Form.Item label="自动停用日期" className={'width45'}>
          <Input
            placeholder={userDetail.disableTime}
            className={classNames('noBorderRadius')}
            disabled
          />
        </Form.Item>
      </div>
    );
  }

  render() {
    const { userDetail } = this.props;
    if (!userDetail.password) {
      return null;
    }
    return (
      <Form
        className={classNames('height100', 'flexColBetween')}
        onSubmit={this.editUser}
        layout="vertical"
      >
        <Row type="flex" className={classNames('height100')}>
          <Col span={24} className={classNames('paddingTopSm', 'paddingBottomSm', 'height100')}>
            {this.renderFormItem()}
          </Col>
        </Row>
        <Row className={classNames(styles.bottomBtn)} type="flex" justify="center" align="middle">
          <Col>
            <LdButton icon={'edit'} htmlType="submit">
              修改
            </LdButton>
            <LdButton
              type="second"
              icon="close"
              onClick={this.handleCancel}
              globalclass={['marginLeftSm']}
            >
              取消
            </LdButton>
          </Col>
        </Row>
      </Form>
    );
  }

  handleCancel = () => {
    this.props.handleCancel();
  };

  editUser = e => {
    if (e) {
      e.preventDefault();
    }
    const {
      dispatch,
      form,
      userId,
      userDetail: { roleId },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const data = {};
      data.user = {};
      data.user.id = userId;
      data.user.roleId = roleId;
      data.user.phone = fieldsValue.phone;
      data.user.name = fieldsValue.name;
      data.policeCode = fieldsValue.policeCode;
      if (fieldsValue.parentId === '0') {
        delete fieldsValue.parentId;
      }
      dispatch({
        type: 'app/updateUser',
        payload: data,
      }).then(res => {
        if (res.success) {
          success('修改成功');
          dispatch({ type: 'app/query' });
          this.props.handleCancel();
        }
      });
    });
  };
}

export default FormModal;
