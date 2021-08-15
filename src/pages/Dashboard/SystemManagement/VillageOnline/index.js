import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Input, Card, Form, Row, Col } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import { connect } from 'dva';
import CommonComponent from '@/components/CommonComponent';
import OnlineModal from './compontents/OnlineModal';
import styles from './index.less';

@connect(state => {
  const {
    loading,
    villageOnline: { villageOnlinePageData },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。

  return {
    loading,
    villageOnlinePageData,
  };
})
@Form.create()
class VillageOnline extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchQueryData: {
        page: 0,
        size: 10,
      },
      onlineModalVisible: false,
      villageId: null,
    };
  }

  componentDidMount() {
    this.featData();
  }

  // eslint-disable-next-line max-lines-per-function
  renderActionBar() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={styles.actionBar}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                <Form.Item>
                  {getFieldDecorator('code')(
                    <Input
                      placeholder="小区编号"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('name')(
                    <Input
                      placeholder="小区名称"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>

                <Form.Item>
                  <LdButton
                    type="select"
                    // loading={this.props.loading.effects['communityManagement/getVillageList']}
                    htmlType="submit"
                  >
                    查找
                  </LdButton>
                  <LdButton style={{ marginLeft: 8 }} type="reset" onClick={this.handleFormReset}>
                    重置
                  </LdButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { searchQueryData } = this.state;
    const { villageOnlinePageData } = this.props;
    const columns = [
      {
        title: '小区编号',
        dataIndex: 'code',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '小区名称',
        dataIndex: 'name',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '建设年份',
        align: 'center',
        dataIndex: 'constructionYear',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '房屋数',
        align: 'center',
        dataIndex: 'houseCount',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '人员数',
        align: 'center',
        dataIndex: 'personCount',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '车辆数',
        dataIndex: 'carCount',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '小区状态',
        dataIndex: 'state',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '操作',
        align: 'center',
        width: '10%',
        dataIndex: 'id',
        render: (text, record) => {
          return (
            <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
              <LdButton
                type="link"
                style={{ padding: '3px' }}
                onClick={() => this.onlineVillage(record.id)}
              >
                上线
              </LdButton>
            </div>
          );
        },
      },
    ];

    let tableData = villageOnlinePageData;
    const pagination = {
      position: 'bottom',
      total: tableData ? tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      pageSize: searchQueryData.size,
      defaultCurrent: 1,
      onChange: this.onChangePage,
      current: tableData ? tableData.number + 1 : 1,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };
    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        loading={this.props.loading.effects['villageOnline/getVillageOnlinePage']}
        columns={columns}
        dataSource={tableData ? tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
        smWidth={true}
      />
    );
  }

  render() {
    const { onlineModalVisible, villageId } = this.state;
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        {this.renderActionBar()}
        {this.renderTable()}
        {this.state.onlineModalVisible && (
          <OnlineModal
            modalVisible={onlineModalVisible}
            villageId={villageId}
            cancelModal={this.cancelModal}
            reGetList={this.reGetList}
          />
        )}
      </div>
    );
  }

  cancelModal = () => {
    this.setState({
      onlineModalVisible: false,
    });
  };

  onlineVillage = id => {
    this.setState({
      onlineModalVisible: true,
      villageId: id,
    });
  };

  featData = async () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'villageOnline/getVillageOnlinePage',
      payload: {
        page: 0,
      },
    });
  };

  onSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      fieldsValue.page = 0;
      fieldsValue.size = this.state.searchQueryData.size;
      this.setState({ searchQueryData: fieldsValue });
      dispatch({
        type: 'villageOnline/getVillageOnlinePage',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      searchQueryData: { size: 10, page: 0 },
    });
    dispatch({
      type: 'villageOnline/getVillageOnlinePage',
      payload: { page: 0, size: 10 },
    });
  };

  reGetList = () => {
    const { searchQueryData } = this.state;
    this.props.dispatch({
      type: 'villageOnline/getVillageOnlinePage',
      payload: searchQueryData,
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    this.setState({
      searchQueryData: searchInfo,
    });
    dispatch({
      type: 'villageOnline/getVillageOnlinePage',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchQueryData = this.state.searchQueryData;
    searchQueryData.page = 0;
    searchQueryData.size = pageSize;
    dispatch({
      type: 'villageOnline/getVillageOnlinePage',
      payload: searchQueryData,
    });
    this.setState({
      searchQueryData,
    });
  };

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      if (i === labels.length - 1) {
        return <span key={option.value}>{label}</span>;
      }
      return <span key={option.value}> </span>;
    });

  filter(inputValue, path) {
    return path.some(option => {
      if (option.code) {
        return (
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
          option.code.toString().indexOf(inputValue.toString()) > -1
        );
      }
    });
  }
}

VillageOnline.propTypes = {};
export default VillageOnline;
