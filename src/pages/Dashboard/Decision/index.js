import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { staticUel } from '@/utils/config';

class DecisionSupport extends PureComponent {
  render() {
    return (
      <div
        // style={{ width: '100%', height: '100%' }}
        className={classNames('bgThemeColor', 'flexColStart', 'height100')}
      >
        <iframe
          id="inlineFrameExample"
          title="Inline Frame Example"
          width="100%"
          height="100%"
          src={staticUel}
          style={{ border: 'none' }}
        />
      </div>
    );
  }
}

export default DecisionSupport;
