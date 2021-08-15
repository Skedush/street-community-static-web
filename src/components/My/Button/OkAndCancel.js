import React, { PureComponent } from 'react';
import LdButton from './LdButton';

class OkAndCancel extends PureComponent {
  render() {
    const { OkText, OkClick, CancelText, CancelClick } = this.props;
    return (
      <div style={{ textAlign: 'right' }}>
        <LdButton htmlType="submit" type="select" onClick={OkClick} style={{ marginLeft: 8 }}>
          {OkText}
        </LdButton>
        <LdButton onClick={CancelClick} style={{ marginLeft: 8 }} type="reset">
          {CancelText}
        </LdButton>
      </div>
    );
  }
}

export default OkAndCancel;
