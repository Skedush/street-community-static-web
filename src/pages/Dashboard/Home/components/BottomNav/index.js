import React, { PureComponent } from 'react';
import styles from './index.less';
import { Icon } from 'antd';
import classNames from 'classnames';

class BottomNav extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      iconType: false,
    };
  }

  render() {
    const { iconType } = this.state;
    const { leftBackground, rightBackground } = this.props;
    return (
      <div className={styles.navBox}>
        <div className={styles.nav}>
          <p
            className={styles.communityBtn}
            onClick={this.sendShowModal}
            style={{ background: leftBackground ? '#22C2FE' : '#2270FE' }}
          >
            <i className={classNames('iconfont', 'iconxiaoqu')} style={{ color: 'white' }} />
          </p>
          <div className={styles.workBtn} onClick={this.sendCenterModal}>
            {/* <img src={require('../../../../../assets/images/work.png')} alt="" /> */}
            <i className={classNames('iconfont', 'icondiannao')} style={{ color: 'white' }} />
            <span>工作台</span>
          </div>
          <p
            className={styles.communityBtn}
            onClick={this.sendRightModal}
            style={{ background: rightBackground ? '#22C2FE' : '#2270FE' }}
          >
            <i className={classNames('iconfont', 'icontongji')} style={{ color: 'white' }} />
          </p>
        </div>
        <Icon type={iconType ? 'caret-down' : 'caret-up'} className={styles.navIconfont} />
      </div>
    );
  }

  sendShowModal = () => {
    this.props.showModal(true);
    this.props.onCollapseChange();
  };

  sendRightModal = () => {
    this.props.showRigModal(true);
  };

  sendCenterModal = () => {
    this.props.showCenterModal(true);
    this.setState({
      iconType: !this.state.iconType,
    });
  };
}

export default BottomNav;
