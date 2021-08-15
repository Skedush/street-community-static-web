import React, { PureComponent, Fragment } from 'react';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import { connect } from 'dva'; // connect用于组件连接models层数据
import { Modal } from 'antd';
import CommonComponent from '@/components/CommonComponent';
import router from 'umi/router';
import Message from '@/components/My/Message';

const { success } = Message;
const { confirm } = Modal;

class Table extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { pageSize, tableData } = this.props;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: '25%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '角色描述',
        dataIndex: 'description',
        key: 'description',
        align: 'center',
        width: '20%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '数据权限',
        dataIndex: 'typeStr',
        key: 'type',
        align: 'center',
        // width: 300,
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: '15%',
        render: (text, record) => {
          let disabled = false;
          const sty = { background: 'none', color: '#999' };
          if (
            record.name === '协辅警用户' ||
            record.name === '社区民警' ||
            record.name === '区县管理员' ||
            record.name === '市局管理员' ||
            record.name === '街道管理员' ||
            record.name === '系统管理员'
          ) {
            disabled = true;
          }
          return tableData.content.length >= 1 ? (
            <Fragment>
              <LdButton
                type="icon"
                size="small"
                onClick={() => this.modifyUser(record)}
                icon="edit"
                title="修改"
              />
              {/* {disabled ? ( */}
              <LdButton
                type="icon"
                size="small"
                onClick={() => this.deleteConfirm(record)}
                title="删除"
                icon="delete"
                disabled={disabled}
                style={disabled ? sty : null}
              />
              {/* ) : null} */}
            </Fragment>
          ) : null;
        },
      },
    ];
    const { selectedRowKeys } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.props.onSelectChange,
    };
    const pagination = {
      position: 'bottom',
      total: this.props.tableData.totalElements || 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      // pageSize: this.props.tableData.size || 10,
      pageSize: pageSize,
      defaultCurrent: 1,
      onChange: this.onPageChange,
      current: this.props.tableData ? this.props.tableData.number + 1 : 1,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };
    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        loading={this.props.loading.effects['roleManagement/getRolesInfo']}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.props.tableData.content}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  modifyUser = row => {
    router.push({
      pathname: '/dashboard/system/roles/addOrModifyRole',
      query: { roleInfo: JSON.stringify(row) },
    });
  };

  deleteConfirm = row => {
    confirm({
      title: `是否删除角色${row.name}?`,
      content: '点击确认删除。',
      onOk: () => this.deleteUser(row.id),
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  deleteUser = id => {
    this.props
      .dispatch({
        type: 'roleManagement/deleteRoles',
        payload: { ids: id },
        queryData: this.props.searchQueryData,
        reSetSelected: this.props.reSetSelected,
      })
      .then(res => {
        if (res.success) {
          success('删除成功');
        }
      });
  };

  onPageChange = page => {
    const { dispatch } = this.props;
    let searchInfo = this.props.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'roleManagement/getRolesInfo',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.props.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'roleManagement/getRolesInfo',
      payload: searchInfo,
    });
    this.props.handlePigeSize(pageSize);
  };
}

function mapStateToProps(state) {
  // es6语法解构赋值
  const {
    roleManagement: { tableData },
    loading,
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    tableData,
    loading,
  };
}
export default connect(mapStateToProps)(Table);
