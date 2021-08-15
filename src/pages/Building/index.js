/* eslint-disable max-lines-per-function */
import React, { PureComponent } from 'react';
import classNames from 'classnames';

class Device extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}

  render() {
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexCenter', 'height100', 'itemCenter')}
        style={{ fontSize: '30px', color: '#fff' }}
      >
        系统建设中...
      </div>
    );
  }
}

Device.propTypes = {};
export default Device;
