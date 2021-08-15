import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { MyLayout } from 'components';
import { Layout } from 'antd';
// import { GlobalFooter } from 'ant-design-pro';
// import { config } from 'utils';
import styles from './PrimaryLayout.less';

const { Content } = Layout;
const { Header } = MyLayout;

@withRouter
@connect(({ app }) => ({
  app,
}))
class PrimaryLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
    };
  }

  render() {
    const { app, children } = this.props;
    const { routeList } = app;
    // MenuParentId is equal to -1 is not a available menu.
    const menus = routeList.filter(_ => _.menuParentId !== '-1');
    const headerProps = {
      menus,
      id: this.state.id,
    };
    return (
      <Fragment>
        <Layout className={styles.container}>
          <Header {...headerProps} />
          <Content className={styles.content}>{children}</Content>
          {/* <GlobalFooter className={styles.footer} copyright={config.copyright} /> */}
        </Layout>
      </Fragment>
    );
  }
  // warningSend = id => {
  //   this.setState({
  //     id,
  //   });
  // };
}

PrimaryLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PrimaryLayout;
