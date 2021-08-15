import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import Navlink from 'umi/navlink';
import withRouter from 'umi/withRouter';
import { queryAncestors } from 'utils';
import store from 'store';
import { connect } from 'dva';

// const { SubMenu } = Menu;

@withRouter
@connect(({ app }) => ({}))
class HeaderMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openKeys: store.get('openKeys') || [],
    };
  }

  renderMenus = data => {
    if (!data) {
      return null;
    }
    return data.map(item => {
      return (
        <Menu.Item key={item.id}>
          <Navlink to={item.defaultRoute || '#'}>
            {/* <Navlink to={item.route || '#'}> */}
            {item.icon && <Icon type={item.icon} />}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      );
    });
  };

  render() {
    const { menus, location } = this.props;

    const selectedKeys = queryAncestors(menus, location.pathname).map(_ => _.id + '');
    const menuProps = {
      openKeys: this.state.openKeys,
    };

    return (
      <Menu
        mode="horizontal"
        onOpenChange={this.onOpenChange}
        selectedKeys={selectedKeys}
        onClick={this.handlerMenu}
        {...menuProps}
      >
        {this.renderMenus(menus)}
      </Menu>
    );
  }

  handlerMenu = ({ item, key, keyPath, domEvent }) => {
    const { dispatch } = this.props;
    // 返回首页
    if (this.props.menus[0].id.toString() === key) {
      dispatch({
        type: 'app/clearModel',
      });
    }
  };

  onOpenChange = openKeys => {
    const { menus } = this.props;

    const rootSubmenuKeys = menus.filter(_ => !_.menuParentId).map(_ => _.id);
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    let newOpenKeys = openKeys;
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : [];
    }

    this.setState({
      openKeys: newOpenKeys,
    });
    store.set('openKeys', newOpenKeys);
  };
}

HeaderMenu.propTypes = {
  menus: PropTypes.array,
};

export default HeaderMenu;
