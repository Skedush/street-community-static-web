import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Input, Card, Form, Row, Col, DatePicker, Popover, Cascader, Spin } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import { connect } from 'dva';
import CommonComponent from '@/components/CommonComponent';
import styles from './index.less';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

// const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(state => {
  const {
    warningModileModel: { policeFirst },
    logManagement: { operateLog },
    commonModel: { loginType },
    loading,
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    policeFirst,
    loading,
    loginType,
    operateLog,
  };
})
@Form.create()
class OperateLogManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchQueryData: {
        name: '',
      },
      pageSize: 10,
      rangeTime: [
        moment()
          .add('days', -179)
          .startOf('day'),
        moment().endOf('day'),
      ],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'warningModileModel/getCascade' });
    dispatch({
      type: 'logManagement/getOperateLog',
      payload: {
        page: 0,
        optTimeStart: this.state.rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
        optTimeEnd: this.state.rangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    });
    this.setSearchInfo({
      optTimeStart: this.state.rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
      optTimeEnd: this.state.rangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
    });
    dispatch({ type: 'commonModel/getType', payload: { type: 26 }, putType: 'setLoginType' });
  }

  // eslint-disable-next-line max-lines-per-function
  actionBarRender() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={classNames(styles.actionBar)}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearchLog}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                <Form.Item>
                  {getFieldDecorator('policeOrganizationId')(
                    <Cascader
                      fieldNames={{ label: 'name', value: 'id', isLeaf: 'level' }}
                      options={this.props.policeFirst}
                      loadData={this.loadData}
                      // changeOnSelect
                      placeholder={'请选择所在单位'}
                      className={'actionBarSortComponent'}
                      allowClear={true}
                      displayRender={this.displayRender}
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {/* {getFieldDecorator('userName')(<Input placeholder="用户名" allowClear />)} */}
                  {getFieldDecorator('userName')(
                    <Input placeholder="账户" className={'actionBarSortComponent'} allowClear />,
                  )}
                </Form.Item>
                <Form.Item>
                  {/* {getFieldDecorator('ip')(<Input placeholder="登录ip" allowClear />)} */}
                  {getFieldDecorator('ip')(
                    <Input placeholder="ip" className={'actionBarSortComponent'} allowClear />,
                  )}
                </Form.Item>
                <Form.Item>
                  {/* {getFieldDecorator('ip')(<Input placeholder="登录ip" allowClear />)} */}
                  {getFieldDecorator('description')(
                    <Input
                      placeholder="操作内容关键字"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {/* {getFieldDecorator('ip')(<Input placeholder="登录ip" allowClear />)} */}
                  {getFieldDecorator('optContent')(
                    <Input
                      placeholder="操作对象关键字"
                      className={'actionBarSortComponent'}
                      allowClear
                    />,
                  )}
                </Form.Item>
                {/* <Form.Item>
                  {getFieldDecorator('rangeTime')(<RangePicker showTime locale={locale} />)}
                </Form.Item> */}
                <Form.Item>
                  {getFieldDecorator('rangeTime', {
                    initialValue: this.state.rangeTime,
                  })(
                    <RangePicker
                      allowClear={false}
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [
                          moment('00:00:00', 'HH:mm:ss'),
                          moment('23:59:59', 'HH:mm:ss'),
                        ],
                      }}
                      // showTime
                      className={'actionBarLongComponent'}
                      locale={locale}
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  <LdButton
                    type="select"
                    // loading={this.props.loading.effects['logManagement/getOperateLog']}
                    htmlType="submit"
                  >
                    查找
                  </LdButton>
                  <LdButton
                    style={{ marginLeft: 8 }}
                    // loading={this.props.loading.effects['logManagement/getOperateLog']}
                    type="reset"
                    onClick={this.handleFormReset}
                  >
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

  renderContent(text) {
    return (
      <div className={styles.info}>
        <span>{text}</span>
      </div>
    );
  }

  renderActionBtn() {
    return (
      <Card bordered={false}>
        <Row>
          <Col>
            <div className={classNames('flexStart')}>
              <LdButton
                // type="reset"
                icon="download"
                type="reset"
                style={{ margin: '0' }}
                onClick={this.exportAll}
              >
                导出
              </LdButton>
            </div>
          </Col>
        </Row>
      </Card>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  tableRender() {
    const { pageSize } = this.state;
    const columns = [
      {
        title: '操作账号',
        dataIndex: 'userName',
        align: 'center',
        width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '所在单位',
        dataIndex: 'policeOrgName',
        align: 'center',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '记录时间',
        dataIndex: 'optTime',
        align: 'center',
        width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作IP',
        dataIndex: 'ip',
        align: 'center',
        width: '18%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作内容',
        dataIndex: 'description',
        align: 'center',
        width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作对象',
        dataIndex: 'optContent',
        align: 'center',
        onCell: () => {
          return {
            style: {
              maxWidth: 50,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          };
        },
        render: (text, record) => (
          <Popover placement="bottomRight" content={this.renderContent(text)} trigger="hover">
            <span>{text}</span>
          </Popover>
        ),
      },
    ];

    const pagination = {
      position: 'bottom',
      total: this.props.operateLog ? this.props.operateLog.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      // pageSize: this.props.operateLog ? this.props.operateLog.size : 0,
      pageSize: pageSize,
      defaultCurrent: 1,
      onChange: this.onChangePage,
      current: this.props.operateLog ? this.props.operateLog.number + 1 : 1,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };

    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        loading={this.props.loading.effects['logManagement/getOperateLog']}
        columns={columns}
        dataSource={this.props.operateLog ? this.props.operateLog.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  render() {
    return (
      <Spin
        tip="正在进行导出..."
        spinning={!!this.props.loading.effects['logManagement/exportOperateLog']}
        size="large"
        wrapperClassName={styles.spinstyle}
      >
        <div
          className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
          style={{ overflow: 'auto' }}
        >
          {this.actionBarRender()}
          {this.renderActionBtn()}
          {this.tableRender()}
        </div>
      </Spin>
    );
  }

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const { dispatch } = this.props;
    dispatch({
      type: 'warningModileModel/getCascade',
      payload: {
        code: selectedOptions[selectedOptions.length - 1].code,
        level: selectedOptions[selectedOptions.length - 1].level,
      },
    }).then(res => {
      targetOption.loading = false;

      if (res && res.length > 0) {
        targetOption.children = res;
      }
      dispatch({
        type: 'warningModileModel/setPoliceFirst',
        data: [...this.props.policeFirst],
      });
    });
  };

  exportAll = () => {
    const { dispatch } = this.props;
    const { searchQueryData } = this.state;
    dispatch({
      type: 'logManagement/exportOperateLog',
      payload: { ...searchQueryData },
    });
  };

  setSearchInfo = data => {
    this.setState({ searchQueryData: data });
  };

  onSearchLog = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { pageSize } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.rangeTime) {
        if (fieldsValue.rangeTime[0] === undefined || fieldsValue.rangeTime[1] === undefined) {
          fieldsValue.optTimeStart = fieldsValue.rangeTime[0];
          fieldsValue.optTimeEnd = fieldsValue.rangeTime[1];
        } else {
          fieldsValue.optTimeStart = fieldsValue.rangeTime[0].format('YYYY-MM-DD HH:mm:ss');
          fieldsValue.optTimeEnd = fieldsValue.rangeTime[1].format('YYYY-MM-DD HH:mm:ss');
        }
        delete fieldsValue.rangeTime;
      }
      let id = fieldsValue.policeOrganizationId;

      if (id) {
        fieldsValue.policeOrganizationId = id[id.length - 1];
      }
      fieldsValue.page = 0;
      fieldsValue.size = pageSize;
      this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'logManagement/getOperateLog',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;

    form.resetFields();
    this.setSearchInfo({
      size: pageSize,
      page: 0,
      optTimeStart: this.state.rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
      optTimeEnd: this.state.rangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
    });
    dispatch({
      type: 'logManagement/getOperateLog',
      payload: {
        page: 0,
        size: pageSize,
        optTimeStart: this.state.rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
        optTimeEnd: this.state.rangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    dispatch({
      type: 'logManagement/getOperateLog',
      payload: searchInfo,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'logManagement/getOperateLog',
      payload: searchInfo,
    });
    this.setState({
      pageSize,
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
}

OperateLogManagement.propTypes = {};
export default OperateLogManagement;
