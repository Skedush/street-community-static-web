import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, Modal, Form, Input } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import HelpDetails from '../CommonModule/helpTxtModal';
import HeaderMenu from './HeaderMenu';
import styles from './Header.less';
import { connect } from 'dva';
import classNames from 'classnames';
import Img from 'react-image';
import store from 'store';
import FormModal from './FormModal';
import Message from '@/components/My/Message';
import Administrator from '@/components/CommonModule/Administrator';
import { Base64 } from 'js-base64';

const { success } = Message;
// const TabPane = Tabs.TabPane;

@Form.create()
@connect(({ commonModel: { txtList, versionHistory }, app: { userDetail, systemName } }) => ({
  txtList,
  userDetail,
  versionHistory,
  systemName,
}))
class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showWarning: false,
      markShow: false,
      visible: false,
      id: null,
      showUser: false,
      informationShow: false,
      showModalType: null,
      changePassword: false,
      editPassword: false,
      userId: null,
      helpCenterModal: false,
      administratorShow: false,
      versionHistoryShow: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.versionHistory.popup && this.props.versionHistory.popup) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        versionHistoryShow: true,
      });
      this.props.versionHistory.popup = false;
    }
  }

  componentDidMount() {
    if (this.props.versionHistory.popup) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        versionHistoryShow: true,
      });
      this.props.versionHistory.popup = false;
    }
    this.fetchData();
  }

  renderpassword() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        title="修改密码"
        visible={this.state.editPassword}
        onCancel={this.handleCancel}
        width="400px"
        footer={null}
        destroyOnClose={true}
        wrapClassName={classNames(styles.modal, styles.modalPassword)}
        zIndex={9998}
      >
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
              <LdButton style={{ marginLeft: 8 }} type="reset" onClick={this.handleCancel}>
                取消
              </LdButton>
              <LdButton type="secondButton" htmlType="submit">
                确定
              </LdButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  renderUser() {
    return (
      <div className={styles.userModule}>
        <h5>个人档案</h5>
        <p onClick={this.modalShow.bind(this, 1)}>
          <Icon type="edit" style={{ color: '#AAB5CC' }} theme="filled" />
          <span>个人信息</span>
        </p>
        {/* <p onClick={this.modalShow.bind(this, 2)}>
          <Icon type="lock" style={{ color: '#AAB5CC' }} theme="filled" />
          <span>修改密码</span>
        </p> */}
        {/* <p onClick={this.modalShow.bind(this, 5)}>
          <Icon type="setting" style={{ color: '#AAB5CC' }} theme="filled" />
          <span>设置辖区</span>
        </p> */}
        <p onClick={this.loginout}>
          <Icon type="poweroff" style={{ color: '#AAB5CC' }} />
          <span>退出登录</span>
        </p>
        <h5>其他</h5>
        {/* <p onClick={this.modalShow.bind(this, 3)}>
          <Icon type="bell" style={{ color: '#AAB5CC' }} theme="filled" />
          <span>消息提醒</span>
        </p> */}
        <p onClick={() => this.modalShow(6)}>
          <Icon type="info-circle" style={{ color: '#AAB5CC' }} theme="filled" />
          <span>版本历史</span>
        </p>
        <p onClick={this.modalShow.bind(this, 4)}>
          <Icon type="question-circle" style={{ color: '#AAB5CC' }} theme="filled" />
          <span>帮助中心</span>
        </p>
      </div>
    );
  }

  renderHelpModal() {
    return (
      <Modal
        title="帮助手册下载"
        visible={this.state.helpCenterModal}
        onCancel={this.handleCancel}
        footer={false}
        wrapClassName={styles.modal}
        width="50%"
        destroyOnClose={true}
        zIndex={9998}
      >
        <HelpDetails />
      </Modal>
    );
  }
  // eslint-disable-next-line max-lines-per-function
  renderInformationModal() {
    const { showModalType, informationShow, userId, administratorShow } = this.state;

    if (showModalType === 1) {
      return (
        <Modal
          title="个人信息"
          visible={informationShow}
          onCancel={this.handleCancel}
          footer={false}
          wrapClassName={styles.modal}
          width="40%"
          destroyOnClose={true}
          zIndex={9998}
        >
          <FormModal userId={userId} handleCancel={this.handleCancel} />
        </Modal>
      );
    } else if (showModalType === 2) {
      return this.renderpassword();
    } else if (showModalType === 4) {
      return this.renderHelpModal();
    } else if (showModalType === 5) {
      return (
        <Administrator visible={administratorShow} showAdministrator={this.closeAdministrator} />
      );
    }
  }

  renderVersionHistoryModal() {
    const { versionHistoryShow } = this.state;
    const { versionHistory } = this.props;
    return (
      <Modal
        title="版本历史"
        visible={versionHistoryShow}
        onCancel={this.handleCancel}
        footer={false}
        wrapClassName={styles.modal}
        width="40%"
        height="60%"
        destroyOnClose={true}
        zIndex={9998}
      >
        <div className={styles.richText}>
          <div
            dangerouslySetInnerHTML={{
              __html: versionHistory.richContent,
            }}
          />
        </div>
      </Modal>
    );
  }

  render() {
    const { menus, systemName } = this.props;
    const { userName, role, id } = store.get('userData');
    try {
      return (
        <Layout.Header className={styles.header}>
          <div className={styles.logo}>
            <Img src={require('../../assets/images/logoImg.png')} />
            <p>{systemName}</p>
          </div>
          <div className={styles.center}>
            <HeaderMenu menus={menus} />
            {this.state.markShow ? <div className={styles.mark} onClick={this.closeMark} /> : ''}
          </div>
          <div className={styles.rightIcon}>
            <div className={styles.user}>
              <img src={require('@/assets/images/touxiang.png')} />
              <div className={styles.userName} onClick={() => this.handleUser(id)}>
                <p>{userName || ''}</p>
                <p>{role || ''}</p>
              </div>
              <Icon
                type="caret-down"
                theme="filled"
                style={{ color: '#FFFFFF' }}
                onClick={() => this.handleUser(id || '')}
              />
            </div>
          </div>
          {this.state.showUser ? this.renderUser() : ''}
          {this.state.showUser ? <div className={styles.mark2} onClick={this.closeModal} /> : ''}
          {this.state.showWarning ? (
            <div className={styles.mark1} onClick={this.closeWarning} />
          ) : (
            ''
          )}
          {this.renderInformationModal()}
          {this.renderVersionHistoryModal()}
        </Layout.Header>
      );
    } catch (error) {
      return null;
    }
  }

  handleUser = id => {
    this.setState({
      showUser: true,
      userId: id,
    });
  };

  loginout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/loginOut',
      payload: { type: 'app' },
    }).then(res => {
      dispatch({
        type: 'app/clearModel',
      });
    });
  };

  closeModal = () => {
    this.setState({
      showUser: false,
    });
  };

  closeMark = () => {
    this.setState({
      markShow: false,
    });
  };

  handleSend = val => {
    if (val) {
      this.setState({
        visible: true,
        id: val,
      });
    }
  };

  closeAdministrator = val => {
    this.setState({
      administratorShow: false,
    });
  };

  warningModelShow = val => {
    this.setState({
      visible: val,
    });
  };

  fetchData = async () => {};

  closeWarning = () => {
    this.setState({
      showWarning: false,
    });
  };
  // 个人信息与修改密码的弹窗
  modalShow = type => {
    const { userId } = this.state;
    const { dispatch } = this.props;
    switch (type) {
      case 1:
        this.setState({
          showModalType: type,
          informationShow: true,
        });
        dispatch({
          type: 'app/getUserDetail',
          payload: { userId: userId },
        });
        break;
      case 2:
        this.setState({
          showModalType: type,
          editPassword: true,
        });
        break;
      // case 3:
      //   this.setState({
      //     showModalType: type,
      //     showWarning: true,
      //   });
      //   break;
      case 4:
        this.setState({
          showModalType: type,
          helpCenterModal: true,
        });
        break;
      case 5:
        this.setState({
          showModalType: type,
          administratorShow: true,
        });
        break;
      case 6:
        dispatch({
          type: 'commonModel/getVersionHistory',
          payload: { userId: userId },
        });
        this.setState({
          versionHistoryShow: true,
        });
        break;
    }
    // this.closeModal();
  };

  handleCancel = () => {
    this.setState({
      showModalType: null,
      informationShow: false,
      helpCenterModal: false,
      versionHistoryShow: false,
      editPassword: false,
    });
    // this.closeModal();
  };

  setPassword = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.userId = this.state.userId;
      fieldsValue.oldPwd = Base64.encode(fieldsValue.oldPwd).toString();
      fieldsValue.newPwd = Base64.encode(fieldsValue.newPwd).toString();
      fieldsValue.reNewPwd = Base64.encode(fieldsValue.reNewPwd).toString();
      dispatch({
        type: 'app/updateUserPassWord',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) {
          form.resetFields();
          this.handleCancel();
          success('修改成功');
        }
      });
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

Header.propTypes = {
  menus: PropTypes.array,
};

export default Header;
