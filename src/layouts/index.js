import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import BaseLayout from './BaseLayout';

@withRouter
class Layout extends PureComponent {
  render() {
    const { children } = this.props;
    return <BaseLayout>{children}</BaseLayout>;
  }
}

export default Layout;
