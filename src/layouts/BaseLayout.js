import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import { Loader } from 'components';
import { queryLayout, router } from 'utils';
import NProgress from 'nprogress';
import config from 'utils/config';
import withRouter from 'umi/withRouter';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import PublicLayout from './PublicLayout';
import PrimaryLayout from './PrimaryLayout';
import './BaseLayout.less';
const LayoutMap = {
  primary: PrimaryLayout,
  public: PublicLayout,
};

@withRouter
@connect(({ loading }) => ({ loading }))
class BaseLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.previousPath = '';
  }

  // eslint-disable-next-line handle-callback-err
  componentDidCatch(error, errorInfo) {
    // 环境判断，如果在开发环境下（NODE_ENV为development）,不跳转到500页面
    if (process.env.NODE_ENV !== 'development') {
      // 跳转到500页面
      router.push('/exception/500');
      // 向服务器发送错误信息
      const { dispatch } = this.props;
      dispatch({
        type: 'app/setErrorLog',
        payload: { description: error.toString() },
      });
    }
  }

  render() {
    const { loading, children, location } = this.props;
    const Container = LayoutMap[queryLayout(config.layouts, location.pathname)];
    const currentPath = location.pathname + location.search;
    if (currentPath !== this.previousPath) {
      NProgress.start();
    }
    if (!loading.global) {
      NProgress.done();
      this.previousPath = currentPath;
    }

    return (
      <LocaleProvider locale={zhCN}>
        <Fragment>
          <Helmet>
            <title>{config.siteName}</title>
          </Helmet>
          <Loader fullScreen spinning={loading.effects['app/query']} />
          <Container>{children}</Container>
        </Fragment>
      </LocaleProvider>
    );
  }
}

BaseLayout.propTypes = {
  loading: PropTypes.object,
};

export default BaseLayout;
