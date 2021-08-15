import React, { PureComponent } from 'react';
import { Modal, Form, Select, Icon, Button, Input, message } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import FormSimple from '@/components/My/Form';
import styles from './index.less';
import PropTypes from 'prop-types';
import { cloneDeep, filter, isEmpty } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(state => {
  const {
    loading: { effects },
    villageOnline: { villageOnlineDetail },
    communityManagement: { districtList, countyList, cityList, policeList, policePersonList },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    updateVillageOnlineLoading: effects['villageOnline/updateVillageOnline'],
    villageOnlineDetail,
    districtList,
    countyList,
    cityList,
    policeList,
    policePersonList,
  };
})
class OnlineModal extends PureComponent {
  onlineForm;
  constructor(props) {
    super(props);
    this.state = {
      address: [''],
    };
  }

  componentDidMount() {
    this.featData();
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      updateVillageOnlineLoading,
      villageOnlineDetail,
      districtList,
      countyList,
      cityList,
      policeList,
    } = this.props;
    const policeListOptions = policeList.map(item => {
      return { key: item.id, value: item.name };
    });
    const items = [
      {
        type: 'input',
        field: 'code',
        span: 12,
        label: '小区编号',
        maxLength: 60,
        disabled: true,
        initialValue: villageOnlineDetail ? villageOnlineDetail.code : '',
      },
      {
        type: 'input',
        field: 'name',
        span: 12,
        label: '小区名称',
        maxLength: 60,
        rules: [{ required: true, message: '请输入小区名称！' }],
        initialValue: villageOnlineDetail ? villageOnlineDetail.name : '',
      },
      {
        type: 'custom',
        height: 'auto',
        span: 24,
        render: (getFieldDecorator, popupContainer) => {
          return (
            <FormItem label="小区地址" className={'width100'}>
              <div className={styles.selectBox}>
                {getFieldDecorator('provinceId', {
                  rules: [
                    {
                      required: true,
                      message: '请输入地址',
                    },
                  ],
                  initialValue: villageOnlineDetail ? villageOnlineDetail.provinceId + '' : '',
                })(
                  <Select
                    placeholder="请输入省份"
                    defaultActiveFirstOption={false}
                    dropdownClassName={'selectDropdown'}
                    onChange={this.onDistrictChange}
                    getPopupContainer={() => popupContainer}
                  >
                    {districtList !== null
                      ? districtList.map((type, index) => (
                          <Option
                            value={type.value}
                            key={index}
                            initialValue={{ key: districtList[0].label }}
                            className={classNames('optionSelect', styles.optionSelect)}
                          >
                            {type.label}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
                <Icon type="minus" />
                {getFieldDecorator('cityId', {
                  rules: [
                    {
                      // required: true,
                      // message: '请输入城市',
                    },
                  ],
                  initialValue: villageOnlineDetail ? villageOnlineDetail.cityId + '' : '',
                })(
                  <Select
                    placeholder="请输入城市"
                    defaultActiveFirstOption={false}
                    dropdownClassName={'selectDropdown'}
                    onChange={this.onCityChange}
                    getPopupContainer={() => popupContainer}
                  >
                    {cityList.length > 0
                      ? cityList.map((type, index) => (
                          <Option value={type.value} key={index} className={'optionSelect'}>
                            {type.label}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
                <Icon type="minus" />
                {getFieldDecorator('countyId', {
                  initialValue: villageOnlineDetail ? villageOnlineDetail.countyId + '' : '',
                })(
                  <Select
                    defaultActiveFirstOption={false}
                    placeholder="请选择区县"
                    onChange={this.onStreetChange}
                    getPopupContainer={() => popupContainer}
                  >
                    {countyList.length > 0
                      ? countyList.map((type, index) => (
                          <Option value={type.value} key={index} className={'optionSelect'}>
                            {type.label}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
              </div>
            </FormItem>
          );
        },
      },

      {
        placeholder: '小区地址',
        label: '小区地址',
        type: 'custom',
        height: 'auto',
        span: 24,
        render: getFieldDecorator => {
          let { address } = this.state;

          return (
            <div className={'width100'}>
              {address.length > 0
                ? address.map((item, index) => {
                    return (
                      <FormItem
                        label={index === 0 ? '详细地址' : ''}
                        className={'width100'}
                        key={index}
                      >
                        <div className={classNames('width100', styles.addressText)}>
                          {getFieldDecorator(`address[${index}]`, {
                            rules: [
                              {
                                required: true,
                                message: '请输入小区地址',
                              },
                            ],
                            initialValue: item,
                          })(
                            <TextArea
                              className={'width100'}
                              style={{ resize: 'none' }}
                              onChange={e => {
                                this.onchangeAddress(e, index);
                              }}
                              rows={2}
                              // autoSize={false}
                              placeholder="输入详细地址..."
                              // className={classNames('noBorderRadius')}
                            />,
                          )}

                          {address.length > 1 ? (
                            <Icon
                              style={{
                                position: 'absolute',
                                top: '50%',
                                marginTop: '-12px',
                                right: '15px',
                                color: '#fff',
                              }}
                              className="dynamic-delete-button"
                              type="minus-circle-o"
                              onClick={() => this.deleteAddress(index)}
                            />
                          ) : null}
                        </div>
                      </FormItem>
                    );
                  })
                : null}
              <div className={'width100'}>
                <Button
                  type="dashed"
                  ghost
                  icon="plus"
                  onClick={this.addAddress}
                  className={styles.addAddress}
                >
                  新增地址
                </Button>
              </div>
            </div>
          );
        },
      },
      {
        type: 'select',
        field: 'policeOrganizationId',
        span: 12,
        label: '所属辖区',
        rules: [
          {
            required: true,
            message: '所属辖区不能为空',
          },
        ],
        initialValue: villageOnlineDetail ? villageOnlineDetail.policeOrganizationId : '',
        children: policeListOptions,
      },
    ];

    const props = {
      items: items,
      actions: [
        { type: 'reset', title: '取消', onClick: this.cancelModal },
        {
          type: 'secondButton',
          title: '保存',
          loading: updateVillageOnlineLoading,
          htmlType: 'submit',
        },
      ],
      actionsTopBorder: true,
      onSubmit: this.onlineFormSubmit,
      formClass: styles.onlineForm,
      onGetFormRef: form => {
        this.onlineForm = form;
      },
    };
    return (
      <div className={styles.modal}>
        <Modal
          title="小区上线"
          visible={this.props.modalVisible}
          onCancel={this.cancelModal}
          footer={false}
          centered
          wrapClassName={classNames(styles.exportModal)}
          destroyOnClose={true}
          width={'40%'}
        >
          <FormSimple {...props} />
        </Modal>
      </div>
    );
  }

  addAddress = () => {
    let address = cloneDeep(this.state.address);
    address.push('');
    this.setState({ address });
  };

  deleteAddress = index => {
    const { setFieldsValue } = this.onlineForm;
    let address = cloneDeep(this.state.address);
    address.splice(index, 1);
    this.setState({ address });
    setFieldsValue({ address });
  };

  // 街道接口
  onStreetChange = value => {
    const { dispatch } = this.props;
    this.onlineForm.setFieldsValue({
      policeOrganizationId: '',
    });

    dispatch({
      type: 'communityManagement/getPoliceList',
      payload: { countyId: value },
    });
  };

  // 区县接口
  onCityChange = value => {
    const { dispatch } = this.props;
    // form.resetFields();
    this.onlineForm.setFieldsValue({
      countyId: '',
      policeOrganizationId: '',
    });

    dispatch({
      type: 'communityManagement/getCountyList',
      payload: { parentId: value },
    });

    // 清空所属辖区下拉框数据
    dispatch({
      type: 'communityManagement/RestPoliceList',
    });
  };

  // 市级接口
  onDistrictChange = value => {
    // const { dispatch } = this.props;
    const { dispatch } = this.props;
    // form.resetFields();
    this.onlineForm.setFieldsValue({
      cityId: '',
      countyId: '',
      policeOrganizationId: '',
    });

    dispatch({
      type: 'communityManagement/getCityList',
      payload: { parentId: value },
    });

    // 清空所属辖区下拉框数据
    dispatch({
      type: 'communityManagement/RestPoliceList',
    });
  };

  onchangeAddress = (e, index) => {
    // currentValue = value;
    let address = cloneDeep(this.state.address);
    address[index] = e.target.value;
    this.setState({ address });
  };

  featData = async () => {
    const { dispatch, villageId } = this.props;
    const { data } = await this.props.dispatch({
      type: 'villageOnline/getVillageOnlineDetail',
      payload: { id: villageId },
    });
    if (data.address) {
      let address = data.address;
      this.setState({
        address: address && address.length > 0 && !isEmpty(address[0]) ? address : [''],
      });
    }
    dispatch({
      type: 'communityManagement/getDistrictList',
    });
  };

  onlineFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    this.onlineForm.validateFields(async (err, fieldsValue) => {
      if (err) return;

      const { dispatch, villageId, reGetList } = this.props;
      fieldsValue.id = villageId;
      fieldsValue.address = filter(fieldsValue.address, sub => {
        return sub.length;
      });

      const res = await dispatch({
        type: 'villageOnline/updateVillageOnline',
        payload: fieldsValue,
      });
      if (res && res.success) {
        message.success('上线成功');
        reGetList();
        this.cancelModal();
      } else {
        message.error(res.message);
      }
    });
  };
  cancelModal = () => {
    this.props.cancelModal();
  };
}
OnlineModal.propTypes = {
  villageId: PropTypes.number,
  modalVisible: PropTypes.bool,
  cancelModal: PropTypes.func,
};

export default OnlineModal;
