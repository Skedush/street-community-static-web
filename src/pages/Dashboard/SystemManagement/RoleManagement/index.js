import React, { PureComponent } from 'react';
import Table from './components/Table';
import ActionBar from './components/ActionBar';
import classNames from 'classnames';
import { connect } from 'dva';
@connect(state => {
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {};
})
class RoleManagement extends PureComponent {
  state = {
    selectedRowKeys: [],
    searchQueryData: {},
    pageSize: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'roleManagement/getRolesInfo', payload: { page: 0 } });
  }

  render() {
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        <ActionBar
          {...this.state}
          selectedRowKeys={this.state.selectedRowKeys}
          reSetSelected={this.reSetSelected}
          pageSize={this.state.pageSize}
          setSearchInfo={this.setSearchInfo}
          resetSelectedRowKeys={this.resetSelectedRowKeys}
        />
        <Table
          {...this.state}
          onSelectChange={this.onSelectChange}
          reSetSelected={this.reSetSelected}
          handlePigeSize={this.handlePigeSize}
        />
      </div>
    );
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  reSetSelected = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  setSearchInfo = data => {
    this.setState({ searchQueryData: data });
  };

  resetSelectedRowKeys = () => {
    this.setState({ selectedRowKeys: [] });
  };

  handlePigeSize = val => {
    this.setState({
      pageSize: val,
    });
  };
}

RoleManagement.propTypes = {};

export default RoleManagement;
