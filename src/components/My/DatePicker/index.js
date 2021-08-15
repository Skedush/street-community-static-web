import React, { PureComponent } from 'react';
import { DatePicker as AntdDatePicker, Icon, Radio } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';

function getRadioValue(date) {
  if (!date) {
    return null;
  }
  const days = date.diff(moment(), 'days');
  const years = date.diff(moment(), 'years');

  if (years === 99) {
    return 0;
  } else {
    return days + 1;
  }
}

class DatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: getRadioValue(props.value),
    };
  }

  render() {
    const {
      dropdownClassName,
      className,
      placeholder,
      suffixIcon,
      showTime,
      value,
      disabled,
      onChange,
      ...option
    } = this.props;
    return (
      <div className={styles.datePicker}>
        <AntdDatePicker
          disabled={disabled}
          locale={locale}
          placeholder={placeholder}
          showTime={showTime || { defaultValue: moment('23:59:59', 'HH:mm:ss') }}
          getCalendarContainer={this.props.getCalendarContainer}
          className={classNames(className)}
          value={value}
          dropdownClassName={classNames(dropdownClassName)}
          suffixIcon={suffixIcon || <Icon type={'pm-calendar'} />}
          {...option}
          onChange={this.onDatePickerChange}
        />

        <div className={styles.timeSelect}>
          <Radio.Group
            value={this.state.radioValue}
            disabled={disabled}
            onChange={this.onRadioChange}
          >
            <Radio value={7}>7天</Radio>
            <Radio value={14}>14天</Radio>
            <Radio value={30}>30天</Radio>
            <Radio value={183}>半年</Radio>
            <Radio value={365}>一年</Radio>
            <Radio value={0}>永久</Radio>
          </Radio.Group>
        </div>
      </div>
    );
  }

  onDatePickerChange = (date, dateString) => {
    this.setState({
      radioValue: getRadioValue(date),
    });
    this.onChange(date, dateString);
  };

  onRadioChange = e => {
    const value = e.target.value;
    const now = moment();
    let date, dateString;
    this.setState({
      radioValue: value,
    });
    if (value === 0) {
      date = now.add(100, 'years');
      dateString = date.format('YYYY-MM-DD');
    } else {
      date = now.add(value, 'days');
      dateString = date.format('YYYY-MM-DD');
    }
    this.onChange(date, dateString);
  };

  onChange = (date, dateString) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(date, dateString);
    }
  };
}

export default DatePicker;
