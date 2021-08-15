import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Icon, Form, Row, Col, PageHeader, Input, Tree, Select } from 'antd';
import styles from './AddOrModifyRole.less';
import LdButton from '@/components/My/Button/LdButton';
import { connect } from 'dva';
import router from 'umi/router';
import Message from '@/components/My/Message';
import { POLICE_TYPR_ARRAY } from '@/utils/constant';

const { success } = Message;

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = Tree;
const { Option } = Select;
@connect(
  ({
    commonModel: { roleTypeCollection },
    roleManagement: { menuTree, roleMenus, roleVillageTree, roleRelateVillage },
    loading,
  }) => ({
    roleTypeCollection,
    loading,
    menuTree,
    roleMenus,
    roleVillageTree,
    roleRelateVillage,
  }),
)
@Form.create()
class AddOrModifyRole extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      isChecked: false,
      upcheckedKeys: [],
      showRender: false,
      centerExpandedKeys: [],
      centerAutoExpandParent: true,
      centerCheckedKeys: [],
      isCenterChecked: false,
      upCenterCheckedKeys: [],
      villageIds: [],
    };
  }
  componentDidMount() {
    this.featchData();
  }

  static getDerivedStateFromProps({ roleMenus, location: { query }, roleRelateVillage }, state) {
    let roleInfo = query.roleInfo;
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo);
    }

    if (roleInfo && roleMenus !== state.checkedKeys && !state.isChecked) {
      return {
        checkedKeys: roleMenus,
      };
    }
    if (
      roleInfo &&
      roleInfo.type === POLICE_TYPR_ARRAY.SPEC &&
      roleRelateVillage !== state.centerCheckedKeys &&
      !state.isCenterChecked
    ) {
      return { centerCheckedKeys: roleRelateVillage };
    }
    return null;
  }

  pageHeaderRender() {
    // let { roleInfo } = this.props.location.query;
    let roleInfo = this.props.location.query.roleInfo;

    // roleInfo = JSON.parse(roleInfo);
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo);
    }

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
          title={roleInfo ? '角色修改' : '角色新增'}
        />
      </div>
    );
  }

  leftColRender() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    // let { roleInfo } = this.props.location.query;
    let roleInfo = this.props.location.query.roleInfo;
    // roleInfo = JSON.parse(roleInfo);
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo);
    }

    let name, description;
    let disabled = false;
    if (roleInfo) {
      name = roleInfo.name;
      description = roleInfo.description;
      if (
        roleInfo.name === '协辅警用户' ||
        roleInfo.name === '社区民警' ||
        roleInfo.name === '区县管理员' ||
        roleInfo.name === '市局管理员' ||
        roleInfo.name === '系统管理员'
      ) {
        disabled = true;
      }
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
        <div className={classNames('paddingRightLg', 'paddingLeftLg', styles.form)}>
          <FormItem label="角色名称">
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入角色名称' }],
            })(
              <Input placeholder="" className={classNames('noBorderRadius')} disabled={disabled} />,
            )}
          </FormItem>
          <FormItem label="角色描述">
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [{ required: true, message: '请输入角色描述' }],
            })(<TextArea rows={4} className={classNames(styles.textArea, 'noBorderRadius')} />)}
          </FormItem>
        </div>
      </Fragment>
    );
  }

  rightTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode selectable={false} title={item.name} key={item.id} dataRef={item}>
            {this.rightTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode selectable={false} title={item.name} key={item.id} />;
    });

  centerTreeNodes = data =>
    data.map(item => {
      if (item.children && item.children.length !== 0) {
        return (
          <TreeNode
            selectable={false}
            title={item.title}
            key={item.key}
            dataRef={item}
            village={item.village}
            villageId={item.id}
          >
            {this.centerTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          selectable={false}
          title={item.title}
          key={item.key}
          village={item.village}
          villageId={item.id}
        />
      );
    });

  centerColRender() {
    const {
      form: { getFieldDecorator },
      roleTypeCollection,
    } = this.props;
    // let { roleInfo } = this.props.location.query;
    let roleInfo = this.props.location.query.roleInfo;
    // roleInfo = JSON.parse(roleInfo);
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo);
    }

    const { showRender } = this.state;
    let disabled = false;
    if (roleInfo) {
      if (
        roleInfo.name === '协辅警用户' ||
        roleInfo.name === '社区民警' ||
        roleInfo.name === '区县管理员' ||
        roleInfo.name === '市局管理员' ||
        roleInfo.name === '系统管理员'
      ) {
        disabled = true;
      }
    }
    return (
      <div style={{ overflow: 'auto', flex: 'auto' }}>
        <FormItem label="数据权限">
          {getFieldDecorator('type', {
            initialValue: roleInfo ? roleInfo.type : '',
            rules: [{ required: true, message: '请选择角色权限' }],
          })(
            <Select
              defaultActiveFirstOption={false}
              placeholder="请选择角色权限"
              dropdownClassName={'selectDropdown'}
              onChange={this.changeSelect}
              // open={true}
              disabled={disabled}
            >
              {roleTypeCollection.length
                ? roleTypeCollection.map(item => {
                    return (
                      <Option value={item.key} key={item.key} className={'optionSelect'}>
                        {item.value}
                      </Option>
                    );
                  })
                : null}
            </Select>,
          )}
        </FormItem>

        {showRender ? (
          <div className={styles.menuTree}>
            <Tree
              checkable
              onExpand={this.onCenterExpand}
              expandedKeys={this.state.centerExpandedKeys}
              autoExpandParent={this.state.centerAutoExpandParent}
              onCheck={this.onCenterCheck}
              checkedKeys={this.state.centerCheckedKeys}
              disabled={disabled}
              // checkStrictly={true}
            >
              {this.centerTreeNodes(this.props.roleVillageTree || [])}
            </Tree>
          </div>
        ) : null}
      </div>
    );
  }

  rightColRender() {
    return (
      <div style={{ overflow: 'auto', flex: 'auto' }}>
        <div className={styles.menuTree}>
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}

            // checkStrictly={true}
          >
            {this.rightTreeNodes(this.props.menuTree || [])}
          </Tree>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    let roleInfo = this.props.location.query.roleInfo;

    // roleInfo = JSON.parse(roleInfo);
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo);
    }

    return (
      <div className={classNames('bgThemeColor', 'height100', 'paddingLg')}>
        <div className={classNames('bgThemeHeightColor', 'height100', 'flexColBetween')}>
          <Row className={styles.row}>
            <Col>{this.pageHeaderRender()}</Col>
          </Row>
          <Form
            className={classNames('height100', 'flexColBetween', styles.form)}
            onSubmit={roleInfo ? this.editRole : this.addRole}
          >
            <Row style={{ height: '90%' }} type="flex" className={classNames('borderBottom')}>
              <Col
                span={8}
                className={classNames(
                  'borderRight',
                  'paddingTopSm',
                  'paddingBottomSm',
                  'paddingRightLg',
                  'height100',
                )}
              >
                {this.leftColRender()}
              </Col>
              <Col
                className={classNames(
                  'paddingTopSm',
                  'paddingBottomSm',
                  'height100',
                  styles.colRender,
                )}
                span={4}
              >
                <div className={'flexStart'}>
                  <div className={styles.blueTip}>
                    <pre className={styles.preCenter}>
                      <span className={classNames('titleFontSm', 'marginLeftSm', 'titleColor')}>
                        数据权限
                      </span>
                    </pre>
                  </div>
                </div>
                {this.centerColRender()}
              </Col>

              <Col
                className={classNames(
                  'paddingTopSm',
                  'paddingBottomSm',
                  'height100',
                  styles.colRender,
                )}
                span={12}
                style={{ overflow: 'auto' }}
              >
                <div className={'flexStart'}>
                  <div className={styles.blueTip}>
                    <pre className={styles.preCenter}>
                      <span className={classNames('titleFontSm', 'marginLeftSm', 'titleColor')}>
                        功能权限
                      </span>
                    </pre>
                  </div>
                </div>
                {this.rightColRender()}
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
                  icon={roleInfo ? 'edit' : 'plus'}
                  loading={this.props.loading.effects['roleManagement/addRole']}
                  htmlType="submit"
                >
                  {roleInfo ? '修改' : '添加'}
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

  editRole = e => {
    if (e) {
      e.preventDefault();
    }
    const {
      dispatch,
      form,
      // location: {
      //   query: { roleInfo },
      // },
    } = this.props;
    let roleInfo = this.props.location.query.roleInfo;
    // roleInfo = JSON.parse(roleInfo);
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo);
    }

    const { villageIds } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.id = roleInfo.id;
      if (villageIds.length) {
        fieldsValue.villageIds = villageIds;
      }
      if (fieldsValue.name === roleInfo.name) {
        fieldsValue.name = '';
      }
      dispatch({
        type: 'roleManagement/updateRole',
        payload: fieldsValue,
        treeCheckList: this.state.upcheckedKeys.toString(),
      }).then(res => {
        if (res.success) {
          success('修改成功');
          router.push('/dashboard/system/roles');
        }
      });
      let roleMenus = {
        roleId: roleInfo.id,
        menuIds: this.state.upcheckedKeys.length ? this.state.upcheckedKeys.toString() : [],
      };

      dispatch({
        type: 'roleManagement/setRoleMenu',
        payload: roleMenus,
        path: '/dashboard/system/roles',
      });
    });
  };

  goBack = () => {
    router.goBack();
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCenterExpand = centerExpandedKeys => {
    this.setState({
      centerExpandedKeys,
      centerAutoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, e) => {
    const newcheckedkeys = checkedKeys.concat(e.halfCheckedKeys);
    this.setState({ checkedKeys, isChecked: true, upcheckedKeys: newcheckedkeys });
  };

  onCenterCheck = (checkedKeys, e) => {
    let villageIds = [];
    if (e.checkedNodes && e.checkedNodes.length > 0) {
      e.checkedNodes.forEach(item => {
        if (item.props.village) {
          villageIds.push(item.props.villageId.toString());
        }
      });
    }
    this.setState({
      centerCheckedKeys: checkedKeys,
      isCenterChecked: true,
      villageIds,
    });
  };

  addRole = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { villageIds } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (villageIds.length) {
        fieldsValue.villageIds = villageIds;
      }
      dispatch({
        type: 'roleManagement/addRole',
        payload: fieldsValue,
        treeCheckList:
          this.state.upcheckedKeys.length > 0 ? this.state.upcheckedKeys.toString() : [],
      }).then(res => {
        if (res.success) {
          success('添加成功');
          router.push('/dashboard/system/roles');
        }
      });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    // this.featchData();
    this.setState({ checkedKeys: [], isChecked: false });
  };

  featchData = () => {
    const { dispatch } = this.props;
    let roleInfo = this.props.location.query.roleInfo;

    // roleInfo = JSON.parse(roleInfo);
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo);
    }
    // dispatch({ type: 'commonModel/getType', payload: { type: 40 }, putType: 'setRoleType' });
    dispatch({ type: 'commonModel/getRoleTypeCollection' });

    dispatch({ type: 'roleManagement/getMenuTree' }).then(() => {
      if (roleInfo) {
        dispatch({ type: 'roleManagement/getRoleMenuById', payload: { roleId: roleInfo.id } }).then(
          res => {
            let upcheckedKeys = [];
            res.map(item => {
              upcheckedKeys.push(item.menuId);
            });
            this.setState({ upcheckedKeys });
          },
        );
      }
    });
    if (roleInfo && roleInfo.type === POLICE_TYPR_ARRAY.SPEC) {
      dispatch({ type: 'roleManagement/getRoleVillage' }).then(res => {
        if (res.success) {
          dispatch({
            type: 'roleManagement/getRoleRelateVillage',
            payload: { roleId: roleInfo.id },
          });
          this.setState({
            showRender: true,
          });
        }
      });
    }
  };

  changeSelect = (e, option) => {
    let typeName;
    const { roleTypeCollection } = this.props;

    if (roleTypeCollection.length > 0 && option) {
      typeName = roleTypeCollection.filter(item => {
        return item.key === option.key;
      });
    }
    if (typeName && typeName[0].value === '自定义用户') {
      const { dispatch } = this.props;
      dispatch({ type: 'roleManagement/getRoleVillage' });
      this.setState({
        showRender: true,
      });
    } else {
      this.setState({
        showRender: false,
      });
    }
  };
}

export default AddOrModifyRole;
