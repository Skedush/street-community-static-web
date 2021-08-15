import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Icon, Form, Row, Col, PageHeader, Input, Select } from 'antd';
import styles from './index.less';
import LdButton from '@/components/My/Button/LdButton';
import { connect } from 'dva';
import router from 'umi/router';
import Message from '@/components/My/Message';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const { success, error } = Message;

@Form.create()
class AddOrModifyMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'menuManagement/menuAllGet' });
    dispatch({ type: 'commonModel/getType', payload: { type: 25 }, putType: 'setMenuType' });
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
          title={modifyInfo ? '菜单修改' : '菜单新增'}
        />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  formRender() {
    const {
      form: { getFieldDecorator },
      menuType,
      menuData,
    } = this.props;
    let { modifyInfo } = this.props.location.query;
    let name, description, type, parentId, url, sort, icon;
    if (modifyInfo) {
      icon = modifyInfo.icon;
      sort = modifyInfo.sort;
      name = modifyInfo.name;
      description = modifyInfo.description;
      type = modifyInfo.type;
      parentId = modifyInfo.parentId;
      url = modifyInfo.url;
    }
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
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
          <FormItem label="菜单名称" className={'width40'}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '菜单名称不能为空',
                },
              ],
              initialValue: name,
            })(<Input placeholder="" className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="功能类型" className={'width40'}>
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: '请选择功能类型',
                },
              ],
              initialValue: type,
            })(
              <Select
                defaultActiveFirstOption={false}
                dropdownClassName={'selectDropdown'}
                placeholder="请选择功能类型"
              >
                {menuType.length > 0
                  ? menuType.map(type => (
                      <Option value={type.key} key={type.key} className={'optionSelect'}>
                        {type.value}
                      </Option>
                    ))
                  : null}
              </Select>,
            )}
          </FormItem>
          <FormItem label="功能Url" className={'width40'}>
            {getFieldDecorator('url', {
              initialValue: url,
            })(<Input className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="菜单排序" className={'width40'}>
            {getFieldDecorator('sort', {
              rules: [
                {
                  required: true,
                  message: '菜单排序不能为空',
                },
                {
                  pattern: new RegExp('^[0-9]*$'),
                  message: '菜单排序必须必须为数字',
                },
              ],
              initialValue: sort,
            })(<Input className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="图标" className={'width40'}>
            {getFieldDecorator('icon', {
              // rules: [
              //   {
              //     required: true,
              //     message: '图标不能为空',
              //   },
              // ],
              initialValue: icon,
            })(<Input className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="父级功能" className={'width40'}>
            {getFieldDecorator('parentId', {
              // rules: [
              //   {
              //     required: true,
              //     message: '父级功能不能为空',
              //   },
              // ],
              initialValue: parentId,
            })(
              <Select
                defaultActiveFirstOption={false}
                dropdownClassName={'selectDropdown'}
                placeholder="父级功能"
              >
                {menuData && menuData.length > 0
                  ? menuData.map(menu => (
                      <Option value={menu.id} key={menu.id} className={'optionSelect'}>
                        {menu.name}
                      </Option>
                    ))
                  : null}
              </Select>,
            )}
          </FormItem>
          <FormItem label="功能描述" className={'width100'}>
            {getFieldDecorator('description', { initialValue: description })(
              <TextArea rows={4} className={classNames(styles.textArea, 'noBorderRadius')} />,
            )}
          </FormItem>
        </div>
      </Fragment>
    );
  }

  bottomBtnRender() {
    let { modifyInfo } = this.props.location.query;
    return (
      <Fragment>
        <LdButton
          icon={modifyInfo ? 'edit' : 'plus'}
          loading={
            this.props.loading.effects[('menuManagement/menuAdd', 'menuManagement/menuUpdate')]
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
        <LdButton type="second" icon="close" onClick={this.goBack} globalclass={['marginLeftSm']}>
          取消
        </LdButton>
      </Fragment>
    );
  }

  render() {
    let { modifyInfo } = this.props.location.query;
    return (
      <div className={classNames('bgThemeColor', 'height100', 'paddingLg')}>
        <div className={classNames('bgThemeHeightColor', 'height100', 'flexColBetween')}>
          <Row>
            <Col>{this.pageHeaderRender()}</Col>
          </Row>
          <Form
            className={classNames('height100', 'flexColBetween')}
            onSubmit={modifyInfo ? this.menuEdit : this.menuAdd}
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
              <Col>{this.bottomBtnRender()}</Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  menuEdit = e => {
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
      fieldsValue.id = modifyInfo.id;
      if (fieldsValue.parentId === '0') {
        delete fieldsValue.parentId;
      }
      dispatch({
        type: 'menuManagement/menuUpdate',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) success('修改成功');
        else error('修改失败');
        this.goBack();
      });
    });
  };

  goBack = () => {
    router.goBack();
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  menuAdd = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.parentId === '0') {
        delete fieldsValue.parentId;
      }
      dispatch({
        type: 'menuManagement/menuAdd',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) success('添加成功');
        else error('添加失败');
        this.goBack();
      });
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };
}

let mapStateToProps = function(state) {
  // es6语法解构赋值
  const {
    menuManagement: { menuData },
    commonModel: { menuType },
    loading,
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    menuData,
    menuType,
    loading,
  };
};
export default connect(mapStateToProps)(AddOrModifyMenu);
