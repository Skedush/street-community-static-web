import React, { PureComponent } from 'react';
import { InputNumber } from '..';
import styles from './index.less';
import classNames from 'classnames';

class NumberRangeInput extends PureComponent {
  render() {
    const { className, value, min, max, parser, precision } = this.props;
    return (
      <div className={classNames(styles.sliderInput, className, 'flexAround', 'itemCenter')}>
        <InputNumber
          min={min}
          max={max}
          parser={parser}
          precision={precision}
          className={styles.inputNumber}
          value={value}
          onChange={this.onInputNumberChange}
        />
        -
        <InputNumber
          min={min}
          max={max}
          parser={parser}
          precision={precision}
          className={styles.inputNumber}
          value={value}
          onChange={this.onInputNumberChange}
        />
      </div>
    );
  }

  onInputNumberChange = value => {
    if (value === null || value === '') {
      value = 0;
    } else if (typeof value === 'string') {
      try {
        value = value.split('.')[0];
        value = parseInt(value);
        if (isNaN(value)) {
          value = this.props.value;
        }
      } catch (error) {
        console.error('error: ', error);
        value = 0;
      }
    }
    if (this.props.isInt) {
      value = Math.round(value);
    }
    this.onChange(value);
  };

  onChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };
}
export default NumberRangeInput;
