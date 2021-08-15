import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './index.less';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import moment from 'moment';
import TimerMixin from 'react-timer-mixin';
import { decorate as mixin } from 'react-mixin';
import store from 'store';
import { connect } from 'dva';

moment.locale('zh');
@connect(({ loading }) => ({ loading }))
@mixin(TimerMixin)
class Head extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      time: moment().format('YYYY-MM-DD HH:mm dddd'),
    };
  }

  async componentDidMount() {
    this.setInterval(() => {
      this.setState({
        time: moment().format('YYYY-MM-DD HH:mm dddd'),
      });
    }, 1000 * 60);
  }

  componentWillUnmount() {}

  render() {
    const { userName } = store.get('userData');
    const { time } = this.state;
    return (
      <div>
        <div className={classNames(styles.top)}></div>
        <div className={classNames(styles.topOperation, 'flexBetween')}>
          <div className={styles.headerInfo}>{time}</div>
          <div className={styles.header}>综合治理数字化一张图</div>
          <div className={styles.headerInfo}>
            <div className={classNames('flexEnd', 'itemCenter')}>
              <IconFont
                type="icon-person"
                style={{
                  fontSize: '24px',
                  color: '#ccc',
                }}
              />
              <div>{userName}</div>
              <div className={styles.logout} onClick={this.loginout}>
                退出
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  loginout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/loginOut',
      payload: { type: 'static' },
    }).then(res => {
      dispatch({
        type: 'app/clearModel',
      });
    });
  };
}
Head.propTypes = {
  dispatch: PropTypes.func,
};

export default Head;
