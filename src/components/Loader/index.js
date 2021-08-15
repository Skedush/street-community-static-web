import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.less';
import { Spin } from 'antd';

const Loader = ({ spinning = true, fullScreen }) => {
  return (
    <div
      className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
    >
      <div className={styles.warpper}>
        <Spin size="large" />
      </div>
    </div>
  );
};

Loader.propTypes = {
  spinning: PropTypes.bool,
  fullScreen: PropTypes.bool,
};

export default Loader;
