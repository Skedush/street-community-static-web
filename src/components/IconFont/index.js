import React, { Component } from 'react';
import classNames from 'classnames';

export default class IconFont extends Component {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      color: 'white',
    };
  }

  render() {
    const { type, style } = this.props;

    return (
      <i className={classNames('iconfont', type)} style={{ ...this.defaultStyle, ...style }} />
    );
  }
}
