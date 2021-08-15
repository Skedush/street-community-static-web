import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { Layout } from 'antd';
// import { GlobalFooter } from 'ant-design-pro';
// import { config } from 'utils';
import styles from './InsideLayout.less';
import classNames from 'classnames';
import { Redirect } from 'umi';
import Error from '@/pages/Exception';
import Authorized from '@/components/Authorized/Authorized';
import { setAuthority } from '@/utils/authority';
import store from 'store';
import { MyLayout } from 'components';
// import { queryAncestors } from 'utils';

const { Content } = Layout;
const { Bread, Sider } = MyLayout;
setAuthority('admin');

@withRouter
@connect(({ app }) => ({
  app,
}))
class InsideLayout extends PureComponent {
  render() {
    const { app, location, children } = this.props;
    const { routeList, collapsed } = app;
    const { onCollapseChange } = this;
    // 追溯到父节点
    // const selectedKeys = queryAncestors(routeList, location.pathname);
    let currentRoute = routeList.find(_ => _.route && location.pathname.startsWith(_.route));

    // if (selectedKeys.length > 1) {
    //   currentRoute = selectedKeys[0];
    // }
    // const currentRoute = routeList.find(_ => _.route && location.pathname.startsWith(_.route));
    const hasPermission = true;
    const menus = currentRoute && currentRoute.children;
    const siderProps = {
      menus,
      parent: currentRoute,
      collapsed,
      onCollapseChange,
    };
    // const { routeList, location } = this.props;
    return (
      <Fragment>
        <Layout className={classNames('height100', styles.menuName)}>
          <Sider {...siderProps} />
          <Authorized
            authority={this.getRouteAuthority(location.pathname) || ''}
            noMatch={<Redirect to={'/exception/403'} />}
          >
            <Content className={styles.content}>
              <div className={classNames('height100', 'flexColStart')}>
                {location.pathname === '/dashboard/real/addcommunitymanagement' ? null : (
                  <Bread routeList={routeList} />
                )}
                {hasPermission ? children : <Error />}
              </div>
            </Content>
          </Authorized>
        </Layout>
      </Fragment>
    );
  }

  getRouteAuthority = pathname => {
    if (pathname === '/dashboard' || pathname === '/login') return 'admin';
    const routeList = store.get('menuData');
    // return 'admin';

    const getPermission = (pathname, menuData) => {
      let havePermission = false;
      for (let i = 0; i < menuData.length; i++) {
        if (menuData[i].route === pathname) {
          havePermission = true;
          break;
        } else if (menuData[i].children && menuData[i].children.length > 0) {
          havePermission = getPermission(pathname, menuData[i].children);
          if (havePermission) break;
        }
      }
      return havePermission;
    };
    const havePermission = getPermission(pathname, routeList);
    if (havePermission) return 'admin';
    return 'none';
  };

  onCollapseChange = collapsed => {
    this.props.dispatch({
      type: 'app/handleCollapseChange',
      payload: collapsed,
    });
  };
}

InsideLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
export default InsideLayout;
