import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Form, Row, Col, PageHeader, Input } from 'antd';
import styles from './index.less';
import LdButton from '@/components/My/Button/LdButton';
import { connect } from 'dva';
import router from 'umi/router';
import Message from '@/components/My/Message';

const { success } = Message;

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class AddOrModifyDictionary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderPageHeader() {
    let { modifyInfo } = this.props.location.query;
    return (
      <div className={styles.myPageHeader}>
        <PageHeader
          className={classNames('borderBottom', styles.iconColor)}
          backIcon={
            <i
              className={classNames('iconfont', 'iconfanhui')}
              style={{ fontSize: '20px', color: '#efefef' }}
            />
          }
          onBack={this.goBack}
          title={modifyInfo ? '字典修改' : '字典新增'}
        />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    let { modifyInfo } = this.props.location.query;
    let key, remark, sort, type, value;
    if (modifyInfo) {
      key = modifyInfo.key;
      remark = modifyInfo.remark;
      sort = modifyInfo.sort;
      type = modifyInfo.type;
      value = modifyInfo.value;
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
          <FormItem label="类型" className={'width40'}>
            {getFieldDecorator('type', {
              initialValue: type,
              rules: [
                {
                  required: true,
                  message: '类型不能为空',
                },
                {
                  pattern: new RegExp('^[0-9]{1,3}$'),
                  message: '请输入1-3个数字',
                },
              ],
            })(<Input placeholder="" className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="字典code" className={'width40'}>
            {getFieldDecorator('key', {
              initialValue: key,
              rules: [
                {
                  required: true,
                  message: '字典code不能为空',
                },
                {
                  pattern: new RegExp('^[0-9]{1,3}$'),
                  message: '请输入1-3个数字',
                },
              ],
            })(<Input placeholder="" className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="显示值" className={'width40'}>
            {getFieldDecorator('value', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: '显示值不能为空!',
                },
              ],
            })(<Input placeholder="" className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="排序" className={'width40'}>
            {getFieldDecorator('sort', {
              initialValue: sort,
              rules: [
                {
                  required: true,
                  message: '排序不能为空',
                },
                {
                  pattern: new RegExp('^[0-9]{1,2}$'),
                  message: '请输入1-2个数字',
                },
              ],
            })(<Input placeholder="" className={classNames('noBorderRadius')} />)}
          </FormItem>
          <FormItem label="类型说明" className={'width100'}>
            {getFieldDecorator('remark', {
              initialValue: remark,
              rules: [
                {
                  required: true,
                  message: '类型说明不能为空!',
                },
              ],
            })(<TextArea rows={4} className={classNames(styles.textArea, 'noBorderRadius')} />)}
          </FormItem>
        </div>
      </Fragment>
    );
  }

  renderBottomBtn() {
    let { modifyInfo } = this.props.location.query;
    return (
      <Fragment>
        <LdButton
          icon={modifyInfo ? 'edit' : 'plus'}
          loading={
            this.props.loading.effects['dictionaryManagement/addDic'] ||
            this.props.loading.effects['dictionaryManagement/updateDic']
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
      <div className={classNames('bgThemeColor', 'height100', 'paddingLg', 'flexColBetween')}>
        <div className={classNames('bgThemeHeightColor', 'height100', 'flexColBetween')}>
          <Row>
            <Col>{this.renderPageHeader()}</Col>
          </Row>
          <Form
            className={classNames('height100', 'flexColBetween')}
            onSubmit={modifyInfo ? this.editDic : this.addDic}
            layout="vertical"
          >
            <Row type="flex" className={classNames('borderBottom', 'height100')}>
              <Col span={24} className={classNames('paddingTopSm', 'paddingBottomSm', 'height100')}>
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

  editDic = e => {
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
      dispatch({
        type: 'dictionaryManagement/updateDic',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) {
          success('修改成功');
          router.goBack();
        }
      });
    });
  };

  goBack = () => {
    router.goBack();
  };

  addDic = e => {
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
        type: 'dictionaryManagement/addDic',
        payload: fieldsValue,
      }).then(res => {
        if (res.success) {
          success('添加成功');
          router.goBack();
        }
      });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };
}

let mapStateToProps = function(state) {
  // es6语法解构赋值
  const { loading } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
  };
};
export default connect(mapStateToProps)(AddOrModifyDictionary);
