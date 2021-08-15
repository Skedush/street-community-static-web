import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Checkbox, Radio, message } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { connect } from 'dva';
import LdButton from '@/components/My/Button/LdButton';

// const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

@Form.create()
@connect()
class AddModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // checkValue: '否',
      value: 1, // 是否可人工标注
      editData: {},
      plainOptions: ['人员', '车辆', '房屋'],
      checkedList: [],
      CheckRadio: [
        { type: '是', id: '1' },
        { type: '否', id: '2' },
      ],
    };
  }

  // eslint-disable-next-line max-lines-per-function
  renderFormItem() {
    const {
      form: { getFieldDecorator },
      editData,
      // editData:
    } = this.props;
    const { plainOptions } = this.state;
    const { CheckRadio } = this.state;

    // let userType = new Array()
    let rang = editData.targetType;

    return (
      <div
        className={classNames(
          'paddingRightLg',
          'paddingLeftLg',
          'flexBetween',
          'flexWrap',
          'width100',
          styles.form,
        )}
      >
        <Form.Item label="标签名称" className={'width45'}>
          {getFieldDecorator('name', {
            initialValue: Object.keys(editData).length === 0 ? null : editData.name,
            rules: [
              {
                required: true,
                message: '标签名不能为空',
              },
            ],
          })(<Input className={classNames('noBorderRadius')} />)}
        </Form.Item>
        <Form.Item label="标注对象" className={'width45'}>
          {getFieldDecorator('userType', {
            initialValue:
              Object.keys(editData).length === 0
                ? this.state.checkedList
                : rang
                ? rang.split(',')
                : [],
            rules: [
              {
                required: true,
                message: '请选择标注对象',
              },
            ],
          })(
            <CheckboxGroup
              options={plainOptions}
              // value={this.state.checkedList}
              onChange={this.onCheckboxChange}
            />,
          )}
        </Form.Item>
        <Form.Item label="是否可人工标注" className={classNames('width48')}>
          {getFieldDecorator('artificial', {
            initialValue:
              Object.keys(editData).length === 0 ? '否' : editData.artificialAble ? '是' : '否',
            rules: [
              {
                required: true,
                message: '是否可人工标注',
              },
            ],
          })(
            <Radio.Group disabled={false} onChange={this.onChange} value={this.state.checkValue}>
              {CheckRadio.map(item => {
                return (
                  <Radio value={item.type} key={item.id}>
                    {item.type}
                  </Radio>
                );
              })}
            </Radio.Group>,
            // </div>,
          )}
        </Form.Item>
      </div>
    );
  }

  render() {
    const { updateVisible } = this.props;
    return (
      <Form
        className={classNames('height100', 'flexColBetween')}
        onSubmit={updateVisible ? this.tagEdit : this.tagAdd}
        layout="vertical"
      >
        <Row type="flex" className={classNames('height100')}>
          {this.renderFormItem()}
        </Row>
        <Row className={classNames(styles.bottomBtn)} type="flex" justify="center" align="middle">
          <Col>
            <LdButton icon={'edit'} htmlType="submit">
              {!updateVisible ? '添加' : '编辑'}
            </LdButton>
            <LdButton
              type="second"
              icon="close"
              onClick={this.handleCancel}
              globalclass={['marginLeftSm']}
            >
              取消
            </LdButton>
          </Col>
        </Row>
      </Form>
    );
  }

  onChange = e => {
    this.setState({ value: e.target.value });
  };
  onCheckboxChange = e => {};
  handleCancel = () => {
    this.props.handleCancel();
  };

  // 标签修改调用接口
  tagEdit = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form, editData } = this.props;
    form.validateFields((err, fieldsValue) => {
      const userType = fieldsValue.userType;
      // const artificial = fieldsValue.artificial;
      if (err) return;
      let artificialAble = true;
      if (fieldsValue.artificial === '否') {
        artificialAble = false;
      }
      let carAble = !!userType.find(item => item === '车辆');
      let houseAble = !!userType.find(item => item === '房屋');
      let personAble = !!userType.find(item => item === '人员');

      dispatch({
        type: 'tagManagementModel/getTagUpdate',
        payload: {
          artificialAble,
          carAble,
          houseAble,
          personAble,
          name: fieldsValue.name,
          id: editData.id,
        },
      }).then(res => {
        if (res.success) {
          message.success('修改成功');
          dispatch({
            type: 'tagManagementModel/getTagInfo',
            payload: this.props.searchQueryData,
          });
        } else {
          message.error(`修改失败,${res.message}`);
        }

        this.props.handleCancel();
      });
    });
  };

  // 标签添加调用接口
  tagAdd = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const userType = fieldsValue.userType;
      if (err) return;
      let artificialAble = true;
      // const artificial = fieldsValue.artificial;
      if (fieldsValue.artificial === '否') {
        artificialAble = false;
      }
      let carAble = !!userType.find(item => item === '车辆');
      let houseAble = !!userType.find(item => item === '房屋');
      let personAble = !!userType.find(item => item === '人员');

      dispatch({
        type: 'tagManagementModel/getTagAdd',
        payload: { artificialAble, carAble, houseAble, personAble, name: fieldsValue.name },
      }).then(res => {
        if (res.success) {
          message.success('添加成功');
          dispatch({
            type: 'tagManagementModel/getTagInfo',
          });
        } else {
          message.error(`添加失败,${res.message}`);
        }

        this.props.handleCancel();
      });
    });
  };
}

export default AddModal;
