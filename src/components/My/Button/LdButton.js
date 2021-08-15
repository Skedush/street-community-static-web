import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './LdButton.less';
import classNames from 'classnames';

class LdButton extends PureComponent {
  render() {
    const { type, globalclass } = this.props;
    let options = null;
    switch (type) {
      case 'second':
        options = (
          <Button {...this.props} className={classNames(styles.secondButton, globalclass)} />
        );
        break;
      case 'back':
        options = (
          <Button
            {...this.props}
            className={classNames(styles.secondButton, globalclass, 'backBtn')}
          />
        );
        break;
      case 'warning':
        options = (
          <Button {...this.props} className={classNames(styles.warningButton, globalclass)} />
        );
        break;
      case 'ghost':
        options = (
          <Button {...this.props} className={classNames(styles.ghostButton, globalclass)} />
        );
        break;
      case 'link':
        options = <Button {...this.props} className={classNames(styles.linkButton, globalclass)} />;
        break;
      case 'select':
        options = (
          <Button {...this.props} className={classNames(styles.selectButton, globalclass)} />
        );
        break;
      case 'reset':
        options = (
          <Button {...this.props} className={classNames(styles.resetButton, globalclass)} />
        );
        break;
      case 'selectAdd':
        options = (
          <Button {...this.props} className={classNames(styles.selectAddButton, globalclass)} />
        );
        break;
      case 'icon':
        options = <Button {...this.props} className={classNames(styles.iconButton, globalclass)} />;
        break;
      case 'centerIcon':
        options = (
          <Button {...this.props} className={classNames(styles.centerIconButton, globalclass)} />
        );
        break;
      case 'deleteIcon':
        options = (
          <Button {...this.props} className={classNames(styles.deleteIconButton, globalclass)} />
        );
        break;
      case 'firstPage':
        options = (
          <Button {...this.props} className={classNames(styles.firstPageButton, globalclass)} />
        );
        break;
      case 'alarm':
        options = (
          <Button {...this.props} className={classNames(styles.alarm, globalclass)} size="small" />
        );
        break;
      case 'floatOperate':
        options = (
          <Button
            {...this.props}
            className={classNames(styles.floatOperate, globalclass)}
            size="small"
          />
        );
        break;
      case 'floatDeal':
        options = (
          <Button
            {...this.props}
            className={classNames(styles.floatDeal, globalclass)}
            size="small"
          />
        );
        break;
      default:
        options = (
          <Button {...this.props} className={classNames(styles.masterButton, globalclass)} />
        );
        break;
    }
    return options;
  }
}

export default LdButton;
