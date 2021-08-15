import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import ScrollBar from '../ScrollBar';
import SiderMenu from './SiderMenu';
import styles from './Sider.less';

class Sider extends PureComponent {
  render() {
    const { menus, parent, collapsed, onCollapseChange } = this.props;
    return (
      <Layout.Sider
        breakpoint="lg"
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={onCollapseChange}
      >
        <div className={styles.menuContainer}>
          <ScrollBar
            option={{
              suppressScrollX: true,
            }}
          >
            <SiderMenu
              menus={menus}
              parent={parent}
              collapsed={collapsed}
              onCollapseChange={onCollapseChange}
            />
          </ScrollBar>
        </div>
      </Layout.Sider>
    );
  }
}

Sider.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  collapsed: PropTypes.bool,
  onThemeChange: PropTypes.func,
  onCollapseChange: PropTypes.func,
};

export default Sider;
