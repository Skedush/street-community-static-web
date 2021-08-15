import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import {
  DatePicker,
  Button,
  Icon,
  Form,
  Row,
  Col,
  PageHeader,
  Input,
  Select,
  Upload,
  message,
  Modal,
} from 'antd';
import styles from './index.less';
import LdButton from '@/components/My/Button/LdButton';
import { connect } from 'dva';
import router from 'umi/router';
import AddMapUi from '../AddMap';
import Message from '@/components/My/Message';
import store from 'store';
import moment from 'moment';
import { cloneDeep, filter, isEmpty } from 'lodash';

const { confirm } = Modal;

const { success, error } = Message;

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@connect(state => {
  const {
    loading,
    communityManagement: {
      districtList,
      countyList,
      cityList,
      streetList,
      policeList,
      policePersonList,
      villageDetailedInfo,
    },
    app: { buttonUse },
    commonModel: { communityType },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
    districtList,
    buttonUse,
    countyList,
    cityList,
    streetList,
    policeList,
    policePersonList,
    villageDetailedInfo,
    communityType,
  };
})
@Form.create()
class AddCommunityManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.image = '';
    this.state = {
      loading: false,
      cityId: null,
      imageUrl: null,
      boundary: '',
      longitudeValue: null,
      latitudeValue: null,
      imageUrlTarget: false,
      countyList: null,
      districtList: null,
      cityList: null,
      streetList: null,
      editButton: false,
      deleteButton: false,
      addPage: true,
      isopen: false,
      time: null,
      mode: 'year',
      addressInfoList: [''],
      // fileList: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  pageHeaderRender() {
    let { modifyInfo } = this.props.location.query;
    return (
      <div className={styles.myPageHeader}>
        <PageHeader
          className={classNames(
            'bgThemeHeightColor',
            'borderBottom',
            styles.iconColor,
            styles.myPageHeader,
          )}
          backIcon={<Icon type="rollback" style={{ fontSize: '20px', color: '#fff' }} />}
          onBack={this.goBack}
          title={modifyInfo ? '小区信息' : '小区新增'}
          style={{ color: '#fff' }}
        />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const {
      form: { getFieldDecorator },
      districtList,
      countyList,
      cityList,
      policeList,
      villageDetailedInfo = {},
      communityType,
    } = this.props;
    const { modifyInfo } = this.props.location.query;
    const { imageUrlTarget } = this.state;
    let imageUrl = '';
    let dataValue = villageDetailedInfo;
    dataValue.countyId = dataValue.countyId + '';
    dataValue.provinceId = dataValue.provinceId + '';
    dataValue.cityId = dataValue.cityId + '';
    if (modifyInfo && villageDetailedInfo.image) {
      dataValue.image = villageDetailedInfo.image;
      if (!imageUrlTarget) {
        imageUrl = villageDetailedInfo.image;
      } else {
        imageUrl = this.state.imageUrl;
      }
    } else {
      imageUrl = this.state.imageUrl;
      dataValue.image = '';
    }
    if (!districtList.length) {
      return null;
    }
    if (!modifyInfo) {
      dataValue = null;
    }

    try {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} id={'form'}>
          <div className={'flexStart'}>
            <div className={styles.blueTip}>
              <div className={styles.preCenter}>
                <span
                  className={classNames(
                    'titleFontSm',
                    'marginLeftSm',
                    'titleColor',
                    styles.textType,
                  )}
                >
                  小区基本信息
                </span>
              </div>
            </div>
          </div>
          <div className={classNames(styles.formBox)}>
            <div
              className={classNames(
                'flexBetween',
                'flexWrap',
                'width50',
                'borderRightForm',
                styles.itemBox,
              )}
            >
              <div className={classNames('width100', styles.uploadBox)}>
                <h3>小区场景照:</h3>
                <Form.Item>
                  <div className="dropbox">
                    {getFieldDecorator('image', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                      initialValue: this.state.fileList,
                    })(
                      <Upload.Dragger
                        name="file"
                        beforeUpload={this.beforeUpload}
                        className={styles.imageBox}
                        accept=".jpg,.png,.vmp,.jpeg"
                      >
                        {imageUrl ? (
                          <img style={{ height: '100%', width: '100%' }} src={imageUrl} />
                        ) : (
                          // <img src={imageUrl} alt="avatar" className={styles.image} />
                          <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                          </p>
                        )}
                      </Upload.Dragger>,
                    )}
                  </div>
                </Form.Item>
              </div>
              <FormItem label="小区编号" className={'width45'}>
                {getFieldDecorator('code', {
                  initialValue: dataValue ? dataValue.code + '' : '',
                })(<Input placeholder="" className={classNames('noBorderRadius')} disabled />)}
              </FormItem>

              <FormItem label="小区类型" className={'width45'}>
                {getFieldDecorator('controlType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择小区类型',
                    },
                  ],
                  initialValue: dataValue ? dataValue.controlType + '' : '2',
                })(
                  <Select
                    defaultActiveFirstOption={false}
                    disabled
                    dropdownClassName={'selectDropdown'}
                  >
                    {communityType.length > 0
                      ? communityType.map((type, index) => (
                          <Option
                            value={type.key}
                            key={index}
                            className={classNames('optionSelect', styles.optionSelect)}
                          >
                            {type.value}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="小区名称" className={'width45'}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入小区名称',
                    },
                  ],
                  initialValue: dataValue ? dataValue.name : '',
                })(<Input className={classNames('noBorderRadius')} />)}
              </FormItem>
              <FormItem label="建设年份" className={'width45'}>
                {getFieldDecorator('year', {
                  initialValue: dataValue ? moment(dataValue.constructionYear, 'YYYY') : '',
                  rules: [
                    {
                      required: true,
                      message: '请选择年份',
                    },
                  ],
                })(
                  <DatePicker
                    mode="year"
                    disabled={dataValue && dataValue.controlType === '1'}
                    open={this.state.isopen}
                    format={`YYYY`}
                    getCalendarContainer={() => document.getElementById('form')}
                    onChange={this.clearValue}
                    onOpenChange={this.handleOpenChange}
                    onPanelChange={this.dateChange}
                    className={classNames('noBorderRadius', 'width100')}
                  />,
                )}
              </FormItem>
              <FormItem label="小区地址" className={'width100'}>
                <div className={styles.selectBox}>
                  {getFieldDecorator('provinceId', {
                    rules: [
                      {
                        required: true,
                        message: '请输入地址',
                      },
                    ],
                    initialValue: dataValue ? dataValue.provinceId : '',
                  })(
                    <Select
                      placeholder="请输入省份"
                      defaultActiveFirstOption={false}
                      dropdownClassName={'selectDropdown'}
                      onChange={this.onDistrictChange}
                      getPopupContainer={() => document.getElementById('form')}
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
                    initialValue: dataValue ? dataValue.cityId : '',
                  })(
                    <Select
                      placeholder="请输入城市"
                      defaultActiveFirstOption={false}
                      dropdownClassName={'selectDropdown'}
                      onChange={this.onCityChange}
                      getPopupContainer={() => document.getElementById('form')}
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
                    initialValue: dataValue ? dataValue.countyId : '',
                  })(
                    <Select
                      defaultActiveFirstOption={false}
                      placeholder="请选择区县"
                      onChange={this.onStreetChange}
                      getPopupContainer={() => document.getElementById('form')}
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

              {this.renderAddress()}

              <FormItem label="所属辖区" className={'width45'}>
                {getFieldDecorator('policeOrganizationId', {
                  rules: [
                    {
                      required: true,
                      message: '所属辖区不能为空',
                    },
                  ],
                  initialValue: dataValue ? dataValue.policeOrganizationId : '',
                })(
                  <Select
                    defaultActiveFirstOption={false}
                    dropdownClassName={'selectDropdown'}
                    getPopupContainer={() => document.getElementById('form')}
                    onChange={this.onPoliceChange}
                  >
                    {policeList.length > 0
                      ? policeList.map(type => (
                          <Option value={type.id} key={type.id} className={'optionSelect'}>
                            {type.name}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="vr地址" className={'width45'}>
                {getFieldDecorator('vrUrl', {
                  initialValue: dataValue ? dataValue.vrUrl + '' : '',
                })(<Input className={classNames('noBorderRadius')} />)}
              </FormItem>
              <FormItem label="社区民警" className={'width45'}>
                {getFieldDecorator('policeName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入社区民警',
                    },
                  ],
                  initialValue: dataValue ? dataValue.policeName : '',
                })(<Input className={classNames('noBorderRadius')} />)}
              </FormItem>
              <FormItem label="民警电话" className={'width45'}>
                {getFieldDecorator('policePhone', {
                  initialValue: dataValue ? dataValue.policePhone : '',
                })(<Input className={classNames('noBorderRadius')} />)}
              </FormItem>
            </div>
            <div className={classNames('width50', styles.itemBox)}>
              <div className={classNames('flexBetween', 'flexWrap')}>
                <div className={classNames('width100', styles.uploadBox)}>
                  <h3>小区边界:</h3>
                  <div className={styles.mapBox}>
                    {dataValue ? (
                      <AddMapUi
                        mapPaths={this.mapPaths}
                        longitude={this.state.longitudeValue || dataValue.longitude}
                        latitude={this.state.latitudeValue || dataValue.latitude}
                        boundaryFormat={dataValue.boundaryFormat}
                        type={1}
                      />
                    ) : (
                      <AddMapUi mapPaths={this.mapPaths} type={2} />
                    )}
                  </div>
                </div>
                <FormItem label="经度" className={'width45'}>
                  {getFieldDecorator('longitude', {
                    initialValue: dataValue ? dataValue.longitude : '',
                  })(<Input className={classNames('noBorderRadius')} disabled />)}
                </FormItem>
                <FormItem label="纬度" className={'width45'}>
                  {getFieldDecorator('latitude', {
                    initialValue: dataValue ? dataValue.latitude : '',
                  })(<Input className={classNames('noBorderRadius')} disabled />)}
                </FormItem>
                <FormItem label="简称" className={'width45'}>
                  {getFieldDecorator('simpleName', {
                    initialValue: dataValue ? dataValue.simpleName : '',
                  })(<Input className={classNames('noBorderRadius')} />)}
                </FormItem>
                <FormItem label="拼音简称首字母" className={'width45'}>
                  {getFieldDecorator('simpleNameLetter', {
                    initialValue: dataValue ? dataValue.simpleNameLetter : '',
                  })(<Input className={classNames('noBorderRadius')} />)}
                </FormItem>
                <FormItem label="物业公司" className={'width45'}>
                  {getFieldDecorator('propertyCompanyName', {
                    initialValue: dataValue ? dataValue.propertyCompanyName : '',
                  })(
                    <Input
                      disabled={dataValue && dataValue.controlType === '1'}
                      className={classNames('noBorderRadius')}
                    />,
                  )}
                </FormItem>
                <FormItem label="物业电话" className={'width45'}>
                  {getFieldDecorator('propertyCompanyPhone', {
                    initialValue: dataValue ? dataValue.propertyCompanyPhone : '',
                  })(
                    <Input
                      disabled={dataValue && dataValue.controlType === '1'}
                      className={classNames('noBorderRadius')}
                    />,
                  )}
                </FormItem>
                <FormItem label="承建商" className={classNames('width45')}>
                  {getFieldDecorator('construction', {
                    initialValue: dataValue ? dataValue.construction : '',
                    rules: [
                      {
                        required: dataValue && dataValue.controlType === '1',
                        message: '请输入承建商',
                      },
                    ],
                  })(<Input className={classNames('noBorderRadius', 'width100')} />)}
                </FormItem>
                <FormItem label="承建商电话" className={classNames('width45')}>
                  {getFieldDecorator('constructionPhone', {
                    initialValue: dataValue ? dataValue.constructionPhone : '',
                  })(<Input className={classNames('noBorderRadius', 'width100')} />)}
                </FormItem>
                <FormItem label="运营商" className={'width45'}>
                  {getFieldDecorator('operate', {
                    initialValue: dataValue ? dataValue.operate : '',
                    rules: [
                      {
                        required: dataValue && dataValue.controlType === '1',
                        message: '请输入运营商',
                      },
                    ],
                  })(<Input className={classNames('noBorderRadius')} />)}
                </FormItem>
                <FormItem label="运营商电话" className={classNames('width45')}>
                  {getFieldDecorator('operatePhone', {
                    initialValue: dataValue ? dataValue.operatePhone : '',
                  })(<Input className={classNames('noBorderRadius', 'width100')} />)}
                </FormItem>
                <FormItem label="居委会负责人" className={'width45'}>
                  {getFieldDecorator('committeeLiaisonName', {
                    initialValue: dataValue ? dataValue.committeeLiaisonName : '',
                  })(<Input className={classNames('noBorderRadius')} />)}
                </FormItem>
                <FormItem label="居委会负责人电话" className={'width45'}>
                  {getFieldDecorator('committeeLiaisonPhone', {
                    initialValue: dataValue ? dataValue.committeeLiaisonPhone : '',
                  })(<Input className={classNames('noBorderRadius')} />)}
                </FormItem>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('error: ', error);
      return null;
    }
  }

  renderBottomBtn() {
    let { modifyInfo } = this.props.location.query;
    const { addPage, editButton, deleteButton } = this.state;
    const { villageDetailedInfo } = this.props;

    return (
      <Fragment>
        {addPage || editButton ? (
          <LdButton
            icon={modifyInfo ? 'edit' : 'plus'}
            loading={
              this.props.loading.effects[
                ('communityManagement/getAddVillage', 'communityManagement/villageUpdate')
              ]
            }
            htmlType="submit"
          >
            {modifyInfo ? '修改' : '添加'}
          </LdButton>
        ) : null}
        {addPage || editButton ? (
          <LdButton
            type="second"
            icon="undo"
            onClick={this.handleFormReset}
            globalclass={['marginLeftSm']}
          >
            重置
          </LdButton>
        ) : null}
        {deleteButton && villageDetailedInfo && villageDetailedInfo.controlType === '2' ? (
          <LdButton
            type="second"
            icon="close"
            onClick={this.deleteVillage}
            globalclass={['marginLeftSm']}
          >
            删除
          </LdButton>
        ) : null}
      </Fragment>
    );
  }
  renderAddress() {
    let { addressInfoList } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={'width100'}>
        {addressInfoList.length > 0
          ? addressInfoList.map((item, index) => {
              return (
                <FormItem label={index === 0 ? '详细地址' : ''} className={'width100'} key={index}>
                  <div className={classNames('width100', styles.addressText)}>
                    {getFieldDecorator(`addressInfoList[${index}]`, {
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

                    {addressInfoList.length > 1 ? (
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
  }
  render() {
    let { modifyInfo } = this.props.location.query;
    return (
      <div
        className={classNames('bgThemeColor', 'height100', 'paddingLg', styles.bottomBox)}
        style={{ overflow: 'auto' }}
      >
        <div className={classNames('bgThemeHeightColor', 'height100', 'flexColBetween')}>
          <Row>
            <Col>{this.pageHeaderRender()}</Col>
          </Row>
          <Form
            className={classNames('height100', 'flexColBetween')}
            onSubmit={modifyInfo ? this.editCommunity : this.addCommunity}
            style={{ overflow: 'auto' }}
          >
            <Row
              type="flex"
              className={classNames('borderBottom', 'height100')}
              style={{ overflow: 'auto' }}
            >
              <Col
                span={24}
                className={classNames('paddingTopSm', 'paddingBottomSm', 'height100', styles.form)}
              >
                {this.renderForm()}
              </Col>
            </Row>
            <Row
              className={classNames(styles.bottomBtn)}
              type="flex"
              justify="center"
              align="middle"
            >
              <Col>{this.renderBottomBtn()}</Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  onchangeAddress = (e, index) => {
    // currentValue = value;
    let address = cloneDeep(this.state.addressInfoList);
    address[index] = e.target.value;
    this.setState({ addressInfoList: address });
  };

  fetchData = () => {
    const { dispatch } = this.props;
    const { modifyInfo } = this.props.location.query;
    dispatch({
      type: 'commonModel/getType',
      payload: { type: 75 },
      putType: 'setCommunityType',
    });
    dispatch({
      type: 'communityManagement/getDistrictList',
    });
    if (modifyInfo) {
      dispatch({
        type: 'communityManagement/getVillageDetailedInfo',
        payload: { id: modifyInfo },
      }).then(res => {
        if (res.addressInfoList) {
          let addressInfoList = res.addressInfoList;
          this.setState({
            addressInfoList:
              addressInfoList && addressInfoList.length > 0 && !isEmpty(addressInfoList[0])
                ? addressInfoList
                : [''],
          });
        }
      });
      this.setState({ addPage: false });
    } else {
      dispatch({
        type: 'communityManagement/setVillageDetailedInfo',
        payload: { data: {} },
      });
    }
    this.buttonUse();
  };

  // 修改
  editCommunity = e => {
    if (e) {
      e.preventDefault();
    }
    const {
      dispatch,
      form,
      location: {
        query: { modifyInfo },
      },
      villageDetailedInfo,
    } = this.props;
    const { boundary } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.image) {
        fieldsValue.image = villageDetailedInfo.image;
      } else {
        fieldsValue.image = this.image;
      }
      if (fieldsValue.parentId === '0') {
        delete fieldsValue.parentId;
      }
      if (boundary === '') {
        fieldsValue.boundary = villageDetailedInfo.boundary;
      } else {
        fieldsValue.boundary = boundary;
      }
      if (fieldsValue.year) {
        fieldsValue.constructionYear = fieldsValue.year.format('YYYY');
        delete fieldsValue.year;
      }
      fieldsValue.id = modifyInfo;
      fieldsValue.addressInfoList = filter(fieldsValue.addressInfoList, sub => {
        return sub.length;
      });
      // if (addressInfoList.length > 0 && !isEmpty(addressInfoList[0])) {
      //   fieldsValue.addressInfoList = addressInfoList;
      // } else {
      //   message.error('小区地址不能为空');
      //   return;
      // }

      dispatch({
        type: 'communityManagement/villageUpdate',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) {
          success('修改成功');
          router.push('/dashboard/real/communitymanagement');
        } else {
          router.push('/dashboard/real/communitymanagement');
        }
        dispatch({
          type: 'communityManagement/setRestVillageData',
        });
      });
    });
  };

  deleteVillage = () => {
    confirm({
      title: `是否删除该小区?`,
      content: '点击确认删除。',
      onOk: async () => {
        const { modifyInfo } = this.props.location.query;
        const { dispatch } = this.props;
        const res = await dispatch({
          type: 'communityManagement/deleteVillage',
          payload: { id: modifyInfo },
        });
        if (res && res.success) {
          message.success('删除成功');
          router.push('/dashboard/real/communitymanagement');
          dispatch({
            type: 'communityManagement/setRestVillageData',
          });
        } else {
          message.error(res.message);
        }
      },
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  goBack = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'communityManagement/setRestVillageData',
    });
    router.goBack();
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  addCommunity = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { boundary, latitudeValue, longitudeValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.parentId === '0') {
        delete fieldsValue.parentId;
      }
      if (fieldsValue.year) {
        fieldsValue.constructionYear = fieldsValue.year.format('YYYY');
        delete fieldsValue.year;
      }
      fieldsValue.image = this.image;
      fieldsValue.boundary = boundary;
      fieldsValue.latitude = latitudeValue;
      fieldsValue.longitude = longitudeValue;
      fieldsValue.addressInfoList = filter(fieldsValue.addressInfoList, sub => {
        return sub.length;
      });

      dispatch({
        type: 'communityManagement/getAddVillage',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) {
          success('新增成功');
          router.push('/dashboard/real/communitymanagement');
        } else {
          error('新增失败' + res.message);
        }
        dispatch({
          type: 'communityManagement/setRestVillageData',
        });
      });
    });
  };

  handleFormReset = () => {
    const { modifyInfo } = this.props.location.query;
    const { form, dispatch, villageDetailedInfo } = this.props;
    form.resetFields();
    if (villageDetailedInfo) {
      this.setState({
        addressInfoList: this.props.villageDetailedInfo.addressInfoList || [''],
      });
    }

    if (modifyInfo) {
      dispatch({
        type: 'communityManagement/getVillageDetailedInfo',
        payload: { id: modifyInfo },
      });
      this.setState({
        imageUrlTarget: false,
      });
    } else {
      this.setState({
        imageUrl: '',
      });
    }
  };

  // 市级接口
  onDistrictChange = value => {
    // const { dispatch } = this.props;
    const { dispatch, form } = this.props;
    // form.resetFields();
    form.setFieldsValue({
      cityId: '',
      countyId: '',
      // streetId: '',
      policeOrganizationId: '',
      policeId: '',
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

  // 区县接口
  onCityChange = value => {
    const { dispatch, form } = this.props;
    // form.resetFields();
    form.setFieldsValue({
      countyId: '',
      // streetId: '',
      policeOrganizationId: '',
      policeId: '',
    });

    dispatch({
      type: 'communityManagement/getCountyList',
      payload: { parentId: value },
    });

    // 清空所属辖区下拉框数据
    dispatch({
      type: 'communityManagement/RestPoliceList',
    });

    this.setState({
      cityId: value,
    });
  };

  // 街道接口
  onStreetChange = value => {
    const { dispatch, form } = this.props;
    form.setFieldsValue({
      countyId: '',
      // streetId: '',
      policeOrganizationId: '',
      policeId: '',
    });

    dispatch({
      type: 'communityManagement/getPoliceList',
      payload: { countyId: value },
    });
  };

  beforeUpload = file => {
    if (file.size > 104857600) {
      message.error('大小不能超过100M');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'IMAGE');
    this.setImageUrl(formData);
    return false;
  };

  // 上传图片
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    this.handleChange(e);
    let fileList = e.fileList;
    if (fileList.length === 2) {
      fileList = fileList.slice(1);
    }
    return e && [];
  };

  getBase64 = (img, callback) => {
    if (img.status === 'removed') {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      this.setState({
        imageUrl: null,
      });
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener('load', () => callback(reader.result));
  };

  handleChange = info => {
    this.getBase64(info.file, imageUrl => {
      this.setState({
        imageUrl,
        loading: false,
        imageUrlTarget: true,
      });
    });
  };

  setImageUrl = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'communityManagement/setImageUrL',
      payload: formData,
    }).then(res => {
      if (res.success) {
        this.image = res.data.url;
      } else {
        this.setState({
          fileList: [],
        });
        message.error(`上传失败${res.message}`);
      }
    });
  };

  // 小区边界
  mapPaths = val => {
    const { form } = this.props;
    form.setFieldsValue({
      longitude: val.center.longitude.toFixed(6),
      latitude: val.center.latitude.toFixed(6),
    });
    this.setState({
      boundary: val.boundary,
      longitudeValue: val.center.longitude.toFixed(6),
      latitudeValue: val.center.latitude.toFixed(6),
    });
  };

  buttonUse = () => {
    const { buttonUse } = store.get('buttonData');
    let buttonShow = buttonUse;
    if (!buttonUse) {
      buttonShow = this.props.buttonUse;
    }
    if (buttonShow && buttonShow.length > 0) {
      buttonUse.forEach((item, index) => {
        if (item.name === '实有小区-修改') {
          this.setState({ editButton: true, deleteButton: true });
        }
      });
    }
  };

  addAddress = () => {
    let addressInfoList = cloneDeep(this.state.addressInfoList);
    addressInfoList.push('');
    this.setState({ addressInfoList });
  };

  deleteAddress = index => {
    const {
      form: { setFieldsValue },
    } = this.props;
    let addressInfoList = cloneDeep(this.state.addressInfoList);
    addressInfoList.splice(index, 1);
    this.setState({ addressInfoList });
    setFieldsValue({ addressInfoList });
  };

  dateChange = e => {
    this.setState({ isopen: false });
    this.props.form.setFieldsValue({
      year: e,
    });
  };

  handleOpenChange = status => {
    this.setState({ isopen: status });
  };

  clearValue = value => {
    this.props.form.setFieldsValue({
      year: null,
    });
  };
}

export default AddCommunityManagement;
