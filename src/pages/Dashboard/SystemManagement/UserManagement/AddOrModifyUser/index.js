import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Base64 } from 'js-base64';
import {
  Icon,
  Form,
  Row,
  Col,
  PageHeader,
  Input,
  Select,
  Cascader,
  message,
  DatePicker,
} from 'antd';
import styles from './index.less';
import LdButton from '@/components/My/Button/LdButton';
import { isPhone, isPassword } from '@/utils/validator';
import { connect } from 'dva';
import router from 'umi/router';
const FormItem = Form.Item;
const Option = Select.Option;
@connect(state => {
  const {
    userManagement: { roleType, policeFirst },
    loading,
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    roleType,
    policeFirst,
    loading,
  };
})
@Form.create()
class AddOrModifyUser extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      initialValue: '',
      // required: true,
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
          backIcon={<Icon type="rollback" style={{ fontSize: '20px', color: '#efefef' }} />}
          onBack={this.goBack}
          title={modifyInfo ? '用户修改' : '用户新增'}
        />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  formRender() {
    const {
      form: { getFieldDecorator, getFieldValue },
      // policeData,
      // policeFirst,
      roleType,
    } = this.props;
    let { modifyInfo } = this.props.location.query;
    let username, password, name, enable, phone, roleId, disableTime, policeName;
    if (modifyInfo) {
      name = modifyInfo.name;
      roleId = modifyInfo.roleId;
      policeName = modifyInfo.policeName;
      phone = modifyInfo.phone;
      enable = modifyInfo.enable;
      username = modifyInfo.userName;
      password = modifyInfo.password;
      disableTime = modifyInfo.disableTime;
      policeName = modifyInfo.policeName;
    } else {
      enable = true;
    }

    return (
      <Fragment>
        <div className={'flexStart'}>
          <div className={styles.blueTip}>
            <pre className={styles.preCenter}>
              <span className={classNames('titleFontSm', 'marginLeftSm', 'titleColor')}>
                基本信息
              </span>
            </pre>
          </div>
        </div>
        <div
          className={classNames(
            'paddingRightLg',
            'paddingLeftLg',
            'flexBetween',
            'flexWrap',
            'width50',
            styles.form,
          )}
        >
          <FormItem label="登录名" className={'width40'}>
            {getFieldDecorator('user.username', {
              initialValue: username,
              rules: [
                {
                  required: true,
                  pattern: '^[0-9a-zA-Z]{4,20}$',
                  message: '请输入4-20个英文或数字',
                },
              ],
            })(<Input placeholder="" className={classNames('noBorderRadius')} />)}
          </FormItem>
          {modifyInfo ? null : (
            <FormItem label="密码" className={'width40'}>
              {getFieldDecorator('user.password', {
                initialValue: password,
                rules: [
                  { required: true, message: '密码不能为空' },
                  {
                    validator: (_, value, callback) => {
                      const username = getFieldValue('user.username');
                      if (username === value) {
                        callback(new Error('密码不能与登录名相同'));
                      }
                      isPassword(_, value, callback);
                    },
                  },
                ],
              })(
                <Input.Password
                  placeholder=""
                  autoComplete="new-password"
                  className={classNames('noBorderRadius')}
                />,
              )}
            </FormItem>
          )}

          <FormItem label="姓名" className={'width40'}>
            {getFieldDecorator('user.name', {
              initialValue: name,
              rules: [{ required: true, message: '姓名不能为空' }],
            })(<Input placeholder="" className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="联系电话" className={'width40'}>
            {getFieldDecorator('user.phone', {
              initialValue: phone,
              rules: [
                {
                  // required: true,
                  validator: isPhone,
                },
              ],
            })(<Input placeholder="" className={classNames('noBorderRadius')} />)}
          </FormItem>

          <FormItem label="所在单位" className={'width40'}>
            {' '}
            <div title={this.state.title || policeName || null}>
              {getFieldDecorator('policeId', {
                rules: [{ required: !modifyInfo, message: '请选择单位' }],
              })(
                <Cascader
                  fieldNames={{ label: 'simpleName', value: 'id', isLeaf: 'level' }}
                  options={this.props.policeFirst}
                  loadData={this.loadData}
                  changeOnSelect
                  placeholder={policeName || '请选择单位'}
                  onChange={this.onChange}
                  allowClear={!modifyInfo}
                  displayRender={this.displayRender}
                />,
              )}{' '}
            </div>
          </FormItem>
          <FormItem label="所属角色" className={'width40'}>
            {getFieldDecorator('user.roleId', {
              initialValue: roleId,
              rules: [{ required: true, message: '请选择角色' }],
            })(
              <Select placeholder="请选择角色权限" dropdownClassName={'selectDropdown'}>
                {/* <Option value={''} key={''}>
                  全部
                </Option> */}
                {roleType
                  ? roleType.length > 0
                    ? roleType.map((item, index) => (
                        <Option value={item.id} key={index} className={styles.optionSelect}>
                          {item.name}
                        </Option>
                      ))
                    : null
                  : null}
              </Select>,
            )}
          </FormItem>
          <FormItem label="使用状态" className={'width40'}>
            {getFieldDecorator('user.enable', {
              // initialValue: enable,
            })(
              <Select
                defaultActiveFirstOption={false}
                placeholder={enable ? '启用' : '停用'}
                dropdownClassName={'selectDropdown'}
              >
                <Option value={1} key={1} className={'optionSelect'}>
                  启用
                </Option>
                <Option value={2} key={2} className={'optionSelect'}>
                  停用
                </Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="自动停用日期" className={'width40'}>
            {getFieldDecorator('user.disableTime')(
              <DatePicker
                onChange={this.onSelectRangeTime}
                placeholder={disableTime || '请选择停用日期'}
              />,
            )}
          </FormItem>
        </div>
      </Fragment>
    );
  }

  render() {
    let { modifyInfo } = this.props.location.query;
    return (
      <div className={classNames('bgThemeColor', 'height100', 'paddingLg', 'flexColBetween')}>
        <div className={classNames('bgThemeHeightColor', 'height100', 'flexColBetween')}>
          <Row>
            <Col>{this.pageHeaderRender()}</Col>
          </Row>
          <Form
            className={classNames('height100', 'flexColBetween')}
            onSubmit={modifyInfo ? this.editUser : this.addUser}
            layout="vertical"
          >
            <Row type="flex" className={classNames('borderBottom', 'height100')}>
              <Col span={24} className={classNames('paddingTopSm', 'paddingBottomSm', 'height100')}>
                {this.formRender()}
              </Col>
            </Row>
            <Row
              className={classNames(styles.bottomBtn)}
              type="flex"
              justify="center"
              align="middle"
            >
              <Col>
                <LdButton
                  icon={modifyInfo ? 'edit' : 'plus'}
                  loading={
                    this.props.loading.effects[
                      ('userManagement/addUser', 'userManagement/updateUser')
                    ]
                  }
                  htmlType="submit"
                >
                  {modifyInfo ? '修改' : '添加'}
                </LdButton>
                <LdButton
                  type="second"
                  icon="undo"
                  onClick={this.handleFormReset}
                  globalclass={['marginLeftSm']}
                >
                  重置
                </LdButton>
                <LdButton
                  type="second"
                  icon="close"
                  onClick={this.goBack}
                  globalclass={['marginLeftSm']}
                >
                  取消
                </LdButton>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'userManagement/getRoleType' });

    dispatch({ type: 'userManagement/getCascade' });
  };

  editUser = e => {
    if (e) {
      e.preventDefault();
    }
    const {
      dispatch,
      form,
      location: {
        query: { modifyInfo },
      },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const policeId = fieldsValue.policeId;

      if (policeId) {
        fieldsValue.policeId = policeId[policeId.length - 1];
      } else {
        fieldsValue.policeId = modifyInfo.policeId;
      }
      if (fieldsValue.stopTime) {
        fieldsValue.stopTime = fieldsValue.stopTime.format('YYYY-MM-DD');
      }

      if (fieldsValue.user.enable === 1) {
        fieldsValue.user.enable = 'true';
      } else if (fieldsValue.user.enable === 2) {
        fieldsValue.user.enable = 'false';
      } else if (!fieldsValue.user.enable) {
        fieldsValue.user.enable = modifyInfo.enable;
      }

      if (fieldsValue.user.username === modifyInfo.userName) {
        fieldsValue.user.username = '';
      }

      fieldsValue.user.id = modifyInfo.userId;
      if (fieldsValue.parentId === '0') {
        delete fieldsValue.parentId;
      }
      dispatch({
        type: 'userManagement/updateUser',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) {
          message.success('修改成功');
        }
      });
    });
  };

  goBack = () => {
    router.goBack();
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  addUser = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.parentId === '0') {
        delete fieldsValue.parentId;
      }
      const policeId = fieldsValue.policeId;
      if (fieldsValue.user.enable === 1) {
        fieldsValue.user.enable = 'true';
      } else if (fieldsValue.user.enable === 2) {
        fieldsValue.user.enable = 'false';
      } else if (!fieldsValue.user.enable) {
        fieldsValue.user.enable = 'true';
      }
      if (policeId) {
        fieldsValue.policeId = policeId[policeId.length - 1];
      }
      if (fieldsValue.stopTime) {
        fieldsValue.createTime = fieldsValue.stopTime.format('YYYY-MM-DD HH:mm:ss');
      }
      fieldsValue.user.password = Base64.encode(fieldsValue.user.password).toString();
      dispatch({
        type: 'userManagement/addUser',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) {
          message.success('添加成功');
        }
      });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchData();
  };

  onChange = (value, selectedOptions) => {
    if (selectedOptions.length > 0) {
      this.setState({ title: selectedOptions[selectedOptions.length - 1].name });
    }
  };

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagement/getCascade',
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
        type: 'userManagement/getFirst',
        payload: { data: [...this.props.policeFirst] },
      });
      // targetOption.loading = false;
    });
  };

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      if (i === labels.length - 1) {
        return <span key={option.id}>{label}</span>;
      }
      return <span key={option.id}> </span>;
    });

  // filter = (inputValue, path) => {
  //   // return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  // };
}

export default AddOrModifyUser;
