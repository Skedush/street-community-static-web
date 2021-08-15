import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Icon, Button } from 'antd';
import { Page } from 'components';
import styles from './index.less';

@connect(({ loading }) => ({ loading }))
class Dashboard extends PureComponent {
  render() {
    return (
      <Page inner>
        <div className={styles.error}>
          <Icon type="frown-o" />
          <h1>Dashboard页未实现</h1>
          <Button type="default" onClick={this.handleOk}>
            注销
          </Button>
        </div>
      </Page>
    );
  }

  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'app/signOut' });
  };
}

Dashboard.propTypes = {
  dispatch: PropTypes.func,
};

export default Dashboard;
