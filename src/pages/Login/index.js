import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Row, Form, Icon, Input } from 'antd';
import { getPlatform } from 'utils';
import { Base64 } from 'js-base64';
// import config from 'utils/config';
import classNames from 'classnames';
import Img from 'react-image';
import styles from './index.less';
const FormItem = Form.Item;

@connect(({ loading }) => ({ loading }))
@Form.create()
class Login extends PureComponent {
  componentDidMount() {}

  renderUsernameModule() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    const dev = process.env.NODE_ENV === 'development';
    return (
      <div className={styles.usernameform}>
        <form className={styles.inputbox}>
          <FormItem hasFeedback>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '用户名不能为空',
                },
              ],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(255,255,255,.6)' }} />}
                onPressEnter={this.handleOk}
                placeholder={'用户名'}
              />,
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('passWord', {
              rules: [
                {
                  required: true,
                  message: '密码不能为空',
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(255,255,255,.6)' }} />}
                type="password"
                onPressEnter={this.handleOk}
                placeholder={'密码'}
                autoComplete={'off'}
              />,
            )}
          </FormItem>
        </form>
        <Row className={styles.row}>
          <Button type="primary" onClick={this.handleOk} loading={loading.effects.login}>
            <span>登录</span>
          </Button>
          {dev && (
            <p>
              <span>
                <span>Username</span>
                ：guest
              </span>
              <span>
                <span>Password</span>
                ：guest
              </span>
            </p>
          )}
          <span style={{ color: '#fff', fontSize: '14px' }}>
            推荐浏览器:
            <a onClick={this.download}>点击下载</a>
          </span>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.loginBox}>
        <div className={styles.title}>
          <Img src={require('../../assets/images/logo1.png')} />
          <span>街道数字化平台</span>
        </div>
        <div className={classNames(styles.form)}>{this.renderUsernameModule()}</div>
      </div>
    );
  }

  handleOk = () => {
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      values.passWord = Base64.encode(values.passWord).toString();
      dispatch({ type: 'login/login', payload: values });
    });
  };

  download = () => {
    const { architecture } = getPlatform();
    const url = `http://41.212.1.154:8080/Chrome${architecture}_75.exe`;
    window.location.assign(url);
  };
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default Login;
