import React, { PureComponent } from 'react';
import { Exception } from 'ant-design-pro';
import { Button } from 'antd';
import styles from './index.less';
import { router } from 'utils';

class MyException extends PureComponent {
  renderAction = () => {
    return (
      <div>
        <Button type="primary" onClick={this.onBack}>
          返回首页
        </Button>
      </div>
    );
  };

  render() {
    const {
      match: { params },
    } = this.props;

    return (
      <Exception
        className={styles.body}
        type={params.code || '404'}
        actions={this.renderAction()}
      />
    );
  }

  onBack = () => {
    router.push('/dashboard');
  };
}

export default MyException;
