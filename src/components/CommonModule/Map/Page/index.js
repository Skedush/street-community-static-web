/**
 * @author M
 * @email mpw0311@163.com
 * @version  1.0.0
 * @description  页面wrapper组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Context from '../core/context';
import styles from './index.less';

export default class Page extends PureComponent {
  static defaultProps = {
    loading: false,
    showHeader: true,
    flex: false,
  };
  render() {
    const { children, flex } = this.props;
    const childStyle = flex === true ? { display: 'flex' } : {};
    return (
      <Context.Consumer>
        {() => (
          <div
            className={styles.children}
            style={{
              display: flex && 'flex',
              ...childStyle,
            }}
          >
            {children}
          </div>
        )}
      </Context.Consumer>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node,
  inner: PropTypes.bool,
};
