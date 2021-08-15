import React, { PureComponent } from 'react';
import { Popover as AntdPopover } from 'antd';

class TableRow extends PureComponent {
  render() {
    return (
      <AntdPopover {...this.props}>
        <tr>{this.props.children}</tr>
      </AntdPopover>
    );
  }
}
export default TableRow;
