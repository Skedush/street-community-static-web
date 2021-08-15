import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Modal, Input, Spin, Select, Card, Form, Row, Col } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import VillagePortrait from '@/components/CommonModule/VillagePortrait';
import { connect } from 'dva';
import styles from './index.less';
import CommonComponent from '@/components/CommonComponent';

const { Option } = Select;

@connect(state => {
  const {
    loading,
    commonModel: { selectVillage, area },
    workModel: { oldManList },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
    selectVillage,
    area,
    oldManList,
  };
})
@Form.create()
class OldMan extends PureComponent {
  // eslint-disable-next-line max-lines-per-function
  constructor(props) {
    super(props);
    this.state = {
      searchQueryData: {},
      portraitID: '',
      PersonnelValue: false,
      pageSize: 10,
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  renderActionBar() {
    return (
      <div className={classNames(styles.actionBar)}>
        <Card>
          <Form layout="inline" onSubmit={this.onSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>{this.renderForm()}</Row>
          </Form>
        </Card>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { pageSize } = this.state;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: '5%',
        render: (text, record) =>
          CommonComponent.renderTableLinkCol(text, record, () =>
            this.personnelPortrait(record.personId),
          ),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        align: 'center',
        width: '5%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '住址',
        dataIndex: 'addressDetail',
        align: 'center',
        width: '8%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '同住人数',
        dataIndex: 'holdCount',
        width: '7%',
        align: 'center',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '操作',
        align: 'center',
        width: '8%',
        dataIndex: 'personId',
        render: (text, record) => {
          return (
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <LdButton
                type="link"
                onClick={() => this.personnelPortrait(text)}
                style={{ padding: '0 5px' }}
              >
                详情
              </LdButton>
            </div>
          );
        },
      },
    ];
    let tableData;
    try {
      tableData = this.props.oldManList;
    } catch (error) {
      tableData = '';
    }
    const pagination = {
      position: 'bottom',
      total: tableData ? tableData.totalElements : 0,
      showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
      // pageSize: tableData ? tableData.size : 0,
      pageSize: pageSize,
      defaultCurrent: 1,
      current: tableData ? tableData.number + 1 : 1,
      onChange: this.onChangePage,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };
    return (
      <LdTable
        type="myTable"
        pagination={pagination}
        loading={
          this.props.loading.effects['workModel/getOldManLists'] ||
          this.props.loading.effects['workModel/getOldManLists']
        }
        columns={columns}
        dataSource={tableData ? tableData.content : null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  renderForm() {
    const {
      selectVillage,

      form: { getFieldDecorator },
    } = this.props;
    return (
      <Col md={20} sm={24} className={styles.actionBar}>
        {/* <Form.Item>
          {getFieldDecorator(
            'policeOrgId',
            {},
          )(
            <Cascader
              placeholder="所属辖区"
              options={this.props.area}
              showSearch={{ filter: this.filter }}
              className={'actionBarSortComponent'}
              changeOnSelect
              displayRender={this.displayRender}
            />,
          )}
        </Form.Item> */}
        <Form.Item>
          {getFieldDecorator(
            'villageId',
            this.state.villageId
              ? {
                  initialValue: this.state.villageId,
                }
              : {},
          )(
            <Select
              showSearch
              placeholder={this.state.placeholderFocus ? '请输入小区关键词' : '请选择小区'}
              optionFilterProp="children"
              dropdownClassName={styles.select}
              className={'actionBarSortComponent'}
              allowClear={true}
            >
              <Option value={''} key={'-1'} className={'optionSelect'}>
                全部
              </Option>
              {selectVillage.length > 0
                ? selectVillage.map(type => (
                    <Option value={type.id} key={type.id} className={'optionSelect'}>
                      {type.name}
                    </Option>
                  ))
                : null}
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('name')(
            <Input placeholder="姓名" className={'actionBarSortComponent'} allowClear />,
          )}
        </Form.Item>

        <Form.Item>
          <LdButton
            type="select"
            // loading={this.props.loading.effects['workModel/getOldManLists']}
            htmlType="submit"
          >
            查找
          </LdButton>
          <LdButton style={{ marginLeft: 8 }} type="reset" onClick={this.handleFormReset}>
            重置
          </LdButton>
        </Form.Item>
      </Col>
    );
  }
  renderPersonnelPortrait() {
    return (
      <Modal
        title="基本信息"
        visible={this.state.PersonnelValue}
        onCancel={this.handleCancel.bind(this, 3)}
        footer={false}
        wrapClassName={styles.modalPortrait}
        destroyOnClose={true}
      >
        <VillagePortrait portraitID={this.state.portraitID} />
      </Modal>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        <Spin
          tip="正在进行导出..."
          spinning={loading}
          size="large"
          wrapperClassName={styles.spinstyle}
        >
          {this.renderActionBar()}
          {this.renderTable()}
        </Spin>
        {this.renderPersonnelPortrait()}
      </div>
    );
  }

  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonModel/getCommun' });
    dispatch({ type: 'commonModel/getType', payload: { type: 10 }, putType: 'setPersonType' });
    dispatch({ type: 'workModel/getOldManLists', payload: { page: 0 } });
    dispatch({ type: 'commonModel/getArea' });
    dispatch({ type: 'commonModel/getSelectVillage' });
    dispatch({
      type: 'workModel/getTimeList',
      payload: { key: 'old_person_age' },
    });
  };

  setSearchInfo = data => {
    this.setState({ searchQueryData: data });
  };

  onSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { pageSize } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.page = 0;
      fieldsValue.size = pageSize;
      if (fieldsValue.policeOrgId) {
        let newPoliceOrgId = fieldsValue.policeOrgId;
        if (fieldsValue.policeOrgId.length === 2) {
          fieldsValue.policeOrgId = newPoliceOrgId[1];
          fieldsValue.countyId = newPoliceOrgId[0];
        } else {
          fieldsValue.countyId = newPoliceOrgId[0];
          fieldsValue.policeOrgId = '';
        }
      }
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'workModel/getOldManLists',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;
    form.resetFields();
    this.setSearchInfo({ page: 0, size: pageSize });

    dispatch({
      type: 'workModel/getOldManLists',
      payload: { page: 0, size: pageSize },
    });
  };

  handleCancel(val) {
    this.setState({ PersonnelValue: false });
  }

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = page - 1;
    if (this.state.searchQueryData.important) {
      dispatch({
        type: 'workModel/getOldManLists',
        payload: searchInfo,
      });
    } else {
      dispatch({
        type: 'workModel/getOldManLists',
        payload: searchInfo,
      });
    }
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    let searchInfo = this.state.searchQueryData;
    searchInfo.page = 0;
    searchInfo.size = pageSize;
    dispatch({
      type: 'workModel/getOldManLists',
      payload: searchInfo,
    });

    this.setState({
      pageSize,
    });
  };

  personnelPortrait = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModel/getOldHandler',
      payload: { personId: id },
    });
    this.setState({
      portraitID: id,
      PersonnelValue: true,
    });
  };

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      this.setState({ searchLocal: selectedOptions[0].label });
      if (labels.length && i === labels.length - 1) {
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

OldMan.propTypes = {};
export default OldMan;
