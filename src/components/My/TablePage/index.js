import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Input, Card, Form, Row, Col, Cascader, Icon, DatePicker, Select } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import styles from './index.less';
import CommonComponent from '@/components/CommonComponent';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const { Option } = Select;
const { RangePicker } = DatePicker;
@Form.create()
class TablePage extends PureComponent {
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

  tableRender() {
    const {
      columns,
      pagination = false,
      loading = false,
      dataSource = [],
      type = 'myTable',
    } = this.props;
    const col = this.trimColumns(columns);
    return (
      <LdTable
        type={type}
        pagination={pagination}
        loading={loading}
        columns={col}
        dataSource={dataSource}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
      />
    );
  }

  render() {
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        {this.actionBarRender()}
        {this.tableRender()}
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderFormItem = (el, index) => {
    if (!el) {
      return null;
    }
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      type,
      placeholder,
      children = [],
      options,
      showSearch,
      displayRender,
      disabledDate,
      format,
      allowClear = true,
      style,
      defaultActiveFirstOption = true,
      optionFilterProp,
      dropdownClassName,
      className,
      onFocus,
      onBlur,
      onChange,
      initialValue,
      validateTrigger,
      trigger,
      formItemLayout,
      getValueFromEvent,
      valuePropName,
      rules,
      label,
      field,
      showTime,
      ...option
    } = el;
    let item = null;

    switch (type) {
      case 'cascader':
        item = (
          <Cascader
            placeholder={placeholder}
            options={options}
            // onChange={this.onChange}
            showSearch={showSearch}
            displayRender={displayRender}
            {...option}
          />
        );
        break;
      case 'datePicker':
        item = (
          <DatePicker
            placeholder={placeholder}
            disabledDate={disabledDate}
            format={format}
            {...option}
          />
        );
        break;
      case 'input':
        item = <Input placeholder={placeholder} {...option} allowClear={allowClear} />;
        break;
      case 'select':
        item = (
          <Select
            {...option}
            style={style}
            defaultActiveFirstOption={defaultActiveFirstOption}
            placeholder={placeholder}
            optionFilterProp={optionFilterProp}
            dropdownClassName={dropdownClassName}
            className={styles.selectWidth}
            // onFocus={onFocus}
            // onBlur={onBlur}
          >
            {children.length > 0 ? (
              children.map(type => (
                <Option value={type.id} key={type.id} className={'optionSelect'}>
                  {type.name}
                </Option>
              ))
            ) : (
              <Option value={-1} key={-1} className={'optionSelect'}>
                全部
              </Option>
            )}
          </Select>
        );
        break;
      case 'rangePicker':
        item = (
          <RangePicker onChange={onChange} showTime={showTime} locale={locale} style={style} />
        );
        break;
    }
    const obj = {
      initialValue,
      validateTrigger: validateTrigger || 'onChange',
      trigger: trigger || 'onChange',
      getValueFromEvent,
      rules,
    };

    return (
      <Form.Item label={label} key={index}>
        {getFieldDecorator(field, obj)(item)}
      </Form.Item>
    );
  };
  actionBarRender() {
    const { items, onSubmit, resetClick, actions, searchTitle, searchType } = this.props;
    return (
      <div className={styles.actionBar}>
        <Card>
          <Form layout="inline" onSubmit={onSubmit}>
            <Row gutter={{ md: 8, lg: 24, xl: 0 }}>
              <Col md={24} sm={24}>
                {items && items.length && items.map((el, index) => this.renderFormItem(el, index))}
                <Form.Item>
                  <LdButton type={searchType} htmlType="submit">
                    {searchTitle || '确定'}
                  </LdButton>
                  <LdButton style={{ marginLeft: 8 }} type="reset" onClick={resetClick}>
                    重置
                  </LdButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false}>
          <div className={classNames('flexStart')}>
            {actions &&
              actions.length &&
              actions.map((el, index) => this.renderCardTiem(el, index))}
          </div>
        </Card>
      </div>
    );
  }

  renderCardTiem = (el, index) => {
    const { type, style, onClick, disabled, title } = el;
    let btn;
    switch (type) {
      case 'export':
        btn = (
          <LdButton style={style} onClick={onClick} key={index}>
            <Icon type="folder-add" theme="filled" />
            {title || '导出'}
          </LdButton>
        );
        break;
      case 'delete':
        btn = (
          <LdButton
            type="warning"
            icon="delete"
            disabled={disabled}
            style={style}
            globalclass={['marginLeftSm']}
            onClick={onClick}
            key={index}
          >
            {title || '删除'}
          </LdButton>
        );
        break;
      case 'plus':
        btn = (
          <LdButton icon="plus" onClick={onClick} style={style} key={index}>
            {title || '新增'}
          </LdButton>
        );
    }
    return btn;
  };

  trimColumns = columns => {
    if (columns && !columns.length) {
      return null;
    }
    let arr = [];
    columns.map(item => {
      item.align = item.align || 'center';
      item.render = item.render
        ? item.render
        : (text, record) => CommonComponent.renderTableCol(text, record);
      arr.push(item);
    });
    return arr;
  };
}

TablePage.propTypes = {};
export default TablePage;
