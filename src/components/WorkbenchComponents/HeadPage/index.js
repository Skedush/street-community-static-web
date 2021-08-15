import React, { PureComponent } from 'react';
import styles from './index.less';

class HeadPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { text } = this.props;
    let options = <div className={styles.head}>{text}</div>;
    if (text === '智安任务') {
      options = (
        <div className={styles.head}>
          <div>{text}</div>
          <div>
            {this.props.startTime
              ? this.props.startTime || null + '~' + this.props.endTime || null
              : ''}
          </div>
        </div>
      );
    }
    return options;
  }
}

export default HeadPage;
