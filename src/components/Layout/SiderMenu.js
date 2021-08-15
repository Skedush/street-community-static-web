import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import Navlink from 'umi/navlink';
import withRouter from 'umi/withRouter';
import { queryAncestors } from 'utils';
import store from 'store';
import { connect } from 'dva';
import styles from './SiderMenu.less';
import classNames from 'classnames';

const { SubMenu } = Menu;

@withRouter
@connect(({ app }) => ({}))
class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openKeys: store.get('siderOpenKeys') || [],
    };
  }

  renderMenus = data => {
    if (!data) {
      return null;
    }
    return data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu
            key={item.id}
            title={
              <Fragment>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.name}</span>
              </Fragment>
            }
          >
            {this.renderMenus(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.id}>
          <Navlink to={item.route || '#'}>
            {item.icon && <Icon type={item.icon} />}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      );
    });
  };

  render() {
    const { menus, parent, location, collapsed, onCollapseChange } = this.props;
    const name = parent && parent.name;
    const selectedKeys = queryAncestors(menus, location.pathname).map(_ => _.id + '');
    const menuProps = collapsed
      ? {}
      : {
          openKeys: this.state.openKeys,
        };

    return (
      <Menu
        mode="inline"
        onOpenChange={this.onOpenChange}
        selectedKeys={selectedKeys}
        inlineCollapsed={collapsed}
        className={classNames('height100')}
        {...menuProps}
      >
        <div className={styles.menuTitle}>
          {!collapsed ? <div className={styles.titleSpan}>{name || ''}</div> : ''}

          <Icon
            className={classNames('trigger', styles.trigger, {
              [styles.icontarget]: collapsed,
            })}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={onCollapseChange.bind(this, !collapsed)}
          />
        </div>
        {this.renderMenus(menus)}
      </Menu>
    );
  }

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
    store.set('siderOpenKeys', newOpenKeys);
  };
}

SiderMenu.propTypes = {
  menus: PropTypes.array,
};

export default SiderMenu;
