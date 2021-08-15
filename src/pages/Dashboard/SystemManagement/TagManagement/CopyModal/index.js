import React, { PureComponent } from 'react';
import { Form, Row, Col, Select, Radio, message } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { connect } from 'dva';
import LdButton from '@/components/My/Button/LdButton';

const Option = Select.Option;

@Form.create()
@connect(state => {
  const {
    commonModel: { selectTag },
    loading,
  } = state;
  return {
    selectTag,
    loading,
  };
})
class CopyModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkValue: '否',
      checkObject: [
        {
          type: '标签a',
          id: 12,
        },
        {
          type: '标签b',
          id: 14,
        },
        {
          type: '标签v',
          id: 13,
        },
      ],
      CheckRadio: [
        { type: '是', id: '1' },
        { type: '否', id: '2' },
      ],
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModel/getTagPerson',
      payload: { id: this.props.sourceId },
    });
  }
  // eslint-disable-next-line max-lines-per-function
  renderFormItem() {
    const {
      form: { getFieldDecorator },
      selectTag,
    } = this.props;
    const { CheckRadio } = this.state;
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
        <Form.Item label="目标标签" className={'width45'} title="">
          <span
            style={{
              color: 'red',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            （将当前标签下属的人员、房屋、车辆，复制到目标标签中。请选择目标标签。）
          </span>
          {getFieldDecorator('targetId', {
            // initialValue: 1,
          })(
            <Select placeholder="请选择目标标签">
              {selectTag ? (
                selectTag.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })
              ) : (
                <Option value={-1} key={-1} className={'optionSelect'}>
                  全部
                </Option>
              )}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="拷贝完后，清空当前标签" className={'width45'}>
          {getFieldDecorator('clean', {
            initialValue: '否',
          })(
            <Radio.Group
              disabled={this.props.copyType === '系统标签'}
              onChange={this.onChange}
              value={this.state.checkValue}
            >
              {CheckRadio.map(item => {
                return (
                  <Radio value={item.type} key={item.id}>
                    {item.type}
                  </Radio>
                );
              })}
            </Radio.Group>,
          )}
        </Form.Item>
      </div>
    );
  }

  render() {
    return (
      <Form
        className={classNames('height100', 'flexColBetween')}
        layout="inline"
        onSubmit={this.copyEdit}
      >
        <Row type="flex" className={classNames('height100')}>
          {this.renderFormItem()}
        </Row>
        <Row className={classNames(styles.bottomBtn)} type="flex" justify="center" align="middle">
          <Col>
            <LdButton icon={'copy'} htmlType="submit">
              确定拷贝
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

  checkChange = e => {
    this.setState({
      checkValue: e.target.value,
    });
  };

  handleCancel = () => {
    this.props.handleCancel();
  };

  copyEdit = e => {
    const { dispatch, sourceId, form } = this.props;
    if (e) {
      e.preventDefault();
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for (let item in fieldsValue) {
        fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      }
      let clean = true;
      if (fieldsValue.clean === '否') {
        clean = false;
      }
      // this.setSearchInfo(fieldsValue);
      dispatch({
        type: 'tagManagementModel/getTagCopy',
        payload: { sourceId, clean, targetId: fieldsValue.targetId },
      }).then(res => {
        if (res.success) {
          message.success('拷贝成功');
          this.props.handleCancel();
          dispatch({
            type: 'tagManagementModel/getTagInfo',
            payload: this.props.searchQueryData,
          });
        }
      });
    });
  };
}

export default CopyModal;
