import React from 'react';
import { Spin, Tooltip } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import moment from 'moment';

const defaultOptions = {
  delay: 0,
  size: 'default',
};

class CommonComponent {
  static renderLoading(options = defaultOptions) {
    return (
      <div className={classNames(styles.loading, { [styles.export]: options })}>
        <Spin {...defaultOptions} {...options} />
      </div>
    );
  }

  static renderTableCol(text, record) {
    return (
      <div
        className={styles.overFlow}
        title={text}
        style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
      >
        {text}
      </div>
    );
  }

  static renderTableLinkCol(text, record, onClick, disabled) {
    return (
      <a
        className={styles.link}
        title={text}
        disabled={disabled}
        style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
        onClick={onClick}
      >
        {text}
      </a>
    );
  }

  static renderTableTooltipCol(text, record) {
    return (
      <div
        className={styles.overFlow}
        title={text}
        style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
      >
        <Tooltip title={text}>{text}</Tooltip>
      </div>
    );
  }

  static renderTableTimeWrapCol(text, record) {
    const time = moment(text);
    const day = time.format('YYYY-MM-DD');
    const mtime = time.format('HH:mm:ss');
    return (
      <div
        className={styles.overFlow}
        title={text}
        style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
      >
        <div>{day}</div>
        <div>{mtime}</div>
      </div>
    );
  }
}

export default CommonComponent;
