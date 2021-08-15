import React, { PureComponent, Fragment } from 'react';
import {
  Input,
  Switch,
  DatePicker,
  Form,
  Select,
  Col,
  Row,
  InputNumber,
  Cascader,
  Icon,
  Radio,
  TreeSelect,
  Upload,
  Checkbox,
} from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import classNames from 'classnames';
import styles from './index.less';
import moment from 'moment';
import { isEmpty } from 'lodash';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;

@Form.create()
class FormSimple extends PureComponent {
  containerRef;

  autoHeightList = ['img', 'upload', 'textArea', 'treeSelect', 'uploadImageButton'];

  constructor(props) {
    super(props);
    this.state = {};
    if (props) {
      const { onGetFormRef, form } = props;
      if (onGetFormRef) {
        onGetFormRef(form);
      }
    }
  }
  render() {
    const {
      onSubmit,
      items,
      actions,
      formItemLayout = {},
      layout = 'horizontal',
      className,
    } = this.props;
    const cols = this.getCol(items, actions);
    return (
      <Form
        className={classNames(className)}
        labelAlign={'right'}
        onSubmit={onSubmit}
        {...formItemLayout}
        autoComplete={'off'}
        layout={layout}
      >
        <Row gutter={16} justify={'center'} style={{ marginLeft: '0', marginRight: '0' }}>
          {cols}
        </Row>
      </Form>
    );
  }

  getAction = actions => {
    if (!Array.isArray(actions)) {
      console.error('data of from action is not array');
      return null;
    }
    const actionsElements = actions.map((item, index) => {
      const { title } = item;
      return (
        <LdButton key={`actionBtn${index}`} style={{ marginLeft: 10 }} {...item}>
          {title}
        </LdButton>
      );
    });
    return (
      <Col span={24} className={styles.buttonCol}>
        {actionsElements}
      </Col>
    );
  };

  getCol = (items, actions) => {
    if (!Array.isArray(items)) {
      console.error('this data of page header is not array');
      return null;
    }

    const cpts = items.map((item, index) => {
      return this.getFormElement(item, index);
    });

    const actionsCol = this.getAction(actions);
    const { actionsTopBorder, formClass } = this.props;
    return (
      <Fragment>
        <Row style={{ padding: '12px' }} className={formClass} id={'myform'}>
          {cpts}
        </Row>
        <Row style={{ padding: '10px 12px' }} className={actionsTopBorder ? 'borderTop' : ''}>
          {actionsCol}
        </Row>
      </Fragment>
    );
  };

  // eslint-disable-next-line max-lines-per-function
  getFormElement = (element, index) => {
    if (!element) {
      return null;
    }

    let cpt = null;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      type,
      field,
      initialValue,
      validateTrigger,
      getValueFromEvent,
      trigger,
      placeholder,
      children = [],
      rules,
      hidden,
      fill,
      span = 12,
      formItemLayout,
      onChange,
      valuePropName,
      loadData,
      monthsRange,
      showTime,
      cascaderOption,
      render,
      title,
      accept,
      beforeUpload,
      timeBegin,
      height,
      label,
      tips,
      ...option
    } = element;

    if (hidden) {
      return null;
    }
    const colHeight = height || (this.autoHeightList.indexOf(type) > -1 ? 'auto' : '83px');
    switch (type) {
      case 'input':
        cpt = <Input placeholder={placeholder} onChange={onChange} {...option} />;
        break;
      case 'password':
        cpt = <Input placeholder={placeholder} type={'password'} {...option} />;
        break;
      case 'number':
        cpt = <InputNumber placeholder={placeholder} {...option} />;
        break;
      case 'label':
        return (
          <Col
            key={`element${index}`}
            span={fill ? 24 : span}
            style={{
              height: colHeight,
              padding: '0 8px',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {label || placeholder}：{option.value}
          </Col>
        );
      case 'button':
        return (
          <Col
            key={`element${index}`}
            span={fill ? 24 : span}
            style={{
              height: colHeight,
              padding: '28px 8px 0 8px',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <LdButton {...option}>{title}</LdButton>
          </Col>
        );
      case 'textArea':
        cpt = <TextArea placeholder={placeholder} {...option} />;
        break;
      case 'datePicker':
        cpt = (
          <DatePicker
            placeholder={placeholder}
            // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            // getCalendarContainer={this.getContainer}
            showTime={
              typeof showTime === 'boolean'
                ? showTime
                : { defaultValue: moment('00:00:00', 'HH:mm:ss') }
            }
            onChange={onChange}
            {...option}
          />
        );
        break;
      case 'rangePicker':
        cpt = (
          <DatePicker.RangePicker
            timeBegin={timeBegin}
            monthsRange={monthsRange}
            dropdownClassName={styles.rangePicker}
            placeholder={placeholder}
            showTime={showTime}
            onChange={onChange}
            {...option}
            // getCalendarContainer={this.getContainer}
          />
        );
        break;
      case 'upload':
        cpt = (
          <Upload
            className={styles.upload}
            accept={accept}
            beforeUpload={beforeUpload || this.beforeUpload}
            onChange={onChange}
            {...option}
          >
            <LdButton type={'select'}>
              <Icon type="upload" /> {title}
            </LdButton>
          </Upload>
        );
        break;
      case 'select':
        const arr = children || [];
        const options = arr.map((item, index) => {
          const { key, value } = item;
          return (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          );
        });
        cpt = (
          <Select
            placeholder={placeholder}
            onChange={onChange}
            getPopupContainer={() => document.getElementById(`myform`)}
            {...option}
          >
            {options}
          </Select>
        );
        break;
      case 'radio':
        const ary = children || [];
        const radios = ary.map((item, index) => {
          const { key, value } = item;
          return (
            <Radio key={key} value={key}>
              {value}
            </Radio>
          );
        });
        cpt = (
          <RadioGroup onChange={onChange} className={styles.radio} {...option}>
            {radios}
          </RadioGroup>
        );
        break;
      case 'cascader':
        cpt = (
          <Cascader
            options={cascaderOption}
            placeholder={placeholder}
            loadData={loadData}
            onChange={onChange}
            changeOnSelect
            {...option}
          />
        );
        break;
      case 'checkBoxGroup':
        const checkOptions = children.map(item => ({ value: item.key, label: item.value }));
        cpt = (
          <Checkbox.Group options={checkOptions} className={styles.checkBoxGroup} {...option} />
        );
        break;
      case 'checkBox':
        cpt = (
          <Checkbox defaultChecked={initialValue} onChange={onChange} {...option}>
            {label}
          </Checkbox>
        );
        break;
      case 'switch':
        cpt = <Switch onChange={onChange} {...option} />;
        break;
      case 'treeSelect':
        cpt = this.getTreeSelect(element);
        break;
      case 'custom':
        return (
          <Col
            key={`element${index}`}
            span={fill ? 24 : span}
            style={{ height: colHeight, padding: '0 8px' }}
          >
            {render ? render(getFieldDecorator, document.getElementById('myform')) : ''}
          </Col>
        );
      default:
        break;
    }
    const obj = {
      initialValue,
      validateTrigger: validateTrigger || 'onChange',
      trigger: trigger || 'onChange',
      getValueFromEvent,
      rules,
    };
    if (valuePropName) {
      obj.valuePropName = valuePropName;
    }
    return (
      <Col
        key={`element${index}`}
        span={fill ? 24 : span}
        style={{
          height: colHeight,
          padding: '0 8px',
        }}
      >
        <FormItem label={label || placeholder} {...formItemLayout}>
          {getFieldDecorator(field, obj)(cpt)}
          {tips && <div className={styles.remake}>{tips}</div>}
        </FormItem>
      </Col>
    );
  };

  getTreeSelect = element => {
    const {
      treeDefaultExpandAll,
      allowClear,
      placeholder,
      showSearch,
      onChange,
      treeData,
      searchPlaceholder,
      dropdownClassName,
      style,
      treeCheckable,
      dropdownStyle,
      ...options
    } = element;
    return (
      <TreeSelect
        className={styles.treeSelect}
        showSearch={showSearch}
        style={style}
        searchPlaceholder={searchPlaceholder}
        dropdownStyle={dropdownStyle}
        dropdownClassName={classNames(dropdownClassName, styles.treeSelectDropDown)}
        placeholder={placeholder}
        allowClear={allowClear}
        treeCheckable={treeCheckable}
        treeDefaultExpandAll={treeDefaultExpandAll}
        onChange={onChange}
        treeNodeFilterProp={'title'}
        {...options}
      >
        {this.getTreeNode(treeData)}
      </TreeSelect>
    );
  };

  getTreeNode = treeData => {
    return (treeData || []).map(item => (
      <TreeNode
        value={item.id}
        title={item.name}
        key={item.id}
        {...item}
        disabled={item.disable || item.disabled}
      >
        {!isEmpty(item.children) && this.getTreeNode(item.children)}
      </TreeNode>
    ));
  };

  getContainer = () => {
    return this.containerRef.current;
  };

  beforeUpload = file => {
    return false;
  };
}

export default FormSimple;
