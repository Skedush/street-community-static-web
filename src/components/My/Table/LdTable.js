import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './LdTable.less';

import classNames from 'classnames';

class LdTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onScrollEvent = this.onScrollEvent.bind(this);
    this.scrollRef = null;
  }
  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      type,
      columns,
      indexDisabled,
      bigWidth,
      widthTwo,
      smWidth,
      pagination,
      width,
      serialNumber,
      ...options
    } = this.props;
    let colWidth = '8%';
    let cpt = null;
    if (bigWidth) {
      colWidth = '12%';
    }
    if (widthTwo) {
      colWidth = '20%';
    }
    if (smWidth) {
      colWidth = '5%';
    }
    if (!indexDisabled && !serialNumber) {
      columns.unshift({
        title: '序号',
        dataIndex: '',
        align: 'center',
        width: colWidth,
        render(val, rowData, rowIndex) {
          return <span>{rowIndex + 1}</span>;
        },
      });
    }

    if (pagination && pagination.showSizeChanger) {
      pagination.pageSizeOptions = ['10', '20', '50', '100'];
    }

    switch (type) {
      case 'myTable':
        cpt = (
          <div className={classNames(styles.myTable, 'height100', { [styles.width]: width })}>
            <Table {...this.props} columns={columns} pagination={pagination} />
          </div>
        );
        break;
      case 'modalTable':
        cpt = (
          <div className={classNames(styles.modalTable, 'height100')}>
            <Table {...this.props} columns={columns} pagination={pagination} />
          </div>
        );
        break;
      case 'insideTable':
        cpt = (
          <div className={classNames(styles.insideTable, 'height100')}>
            <Table {...this.props} columns={columns} pagination={pagination} />
          </div>
        );
        break;
      case 'equipmentTable':
        cpt = (
          <div className={classNames(styles.equipmentTable, 'height100')}>
            <Table {...this.props} columns={columns} pagination={pagination} />
          </div>
        );
        break;
      case 'officeTable':
        cpt = (
          <div
            // style={{ height: '100%' }}
            onScrollCapture={() => this.onScrollEvent()}
            style={{ height: '100%', overflowY: 'scroll' }}
            ref={c => {
              this.scrollRef = c;
            }}
            className={classNames(styles.officeTable, 'height100')}
          >
            <Table {...this.props} columns={columns} pagination={pagination} />
          </div>
        );
        break;
      case 'helpTable':
        cpt = (
          <div className={classNames(styles.helpTable, 'height100')}>
            <Table {...this.props} columns={columns} pagination={pagination} />
          </div>
        );
        break;
      case 'Drag':
        cpt = (
          <div
            className={classNames(
              styles.myTable,
              'height100',
              { [styles.width]: width },
              styles.dragTable,
            )}
          >
            <Table {...options} columns={columns} pagination={pagination} />
          </div>
        );
        break;
      default:
        break;
    }
    return cpt;
  }
  onScrollEvent = () => {
    // if (this.scrollRef.scrollTop + this.scrollRef.clientHeight === this.scrollRef.scrollHeight) {
    //   //
    //   // 这里去做你的异步数据加载
    //   //
    // }
  };
}

export default LdTable;
