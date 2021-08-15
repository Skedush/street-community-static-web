import React, { PureComponent } from 'react';
import styles from './index.less';
import { Menu, Radio, Dropdown, Button, Icon } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';

const RadioGroup = Radio.Group;
@connect(({ mapData: { deviceType } }) => ({
  deviceType,
}))
class DropDownList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      equipmentName: '全部',
      siteName: '全部',
      facilityName: '全部',
      value: 1,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { positionDtata, deviceType } = this.props;
    let data = null;
    try {
      data = deviceType.map((item, index) => {
        return (
          <Radio value={item.type} typeStr={item.typeStr} key={index}>
            {item.typeStr}
          </Radio>
        );
      });
    } catch (error) {
      data = '';
    }
    const menu = (
      <Menu className={styles.checkBox}>
        <RadioGroup onChange={this.onChange} value={this.state.value}>
          {data}
        </RadioGroup>
      </Menu>
    );
    return (
      <div className={classNames(styles.buttonBox, { [styles.propsClass]: positionDtata })}>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          onVisibleChange={this.handleVisibleChange.bind(this, 1)}
          visible={this.state.visible1}
          overlayClassName={styles.overlayMenu}
        >
          <Button>
            设备：{this.state.equipmentName}
            <Icon type="caret-down" />
          </Button>
        </Dropdown>
      </div>
    );
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
      equipmentName: e.target.typeStr,
      siteName: e.target.typeStr,
    });
    this.getMapDeviceAll(e.target.value);
  };

  handleVisibleChange(val) {
    if (val === 1) {
      this.setState({
        visible1: !this.state.visible1,
      });
    } else {
      this.setState({
        visible2: !this.state.visible2,
      });
    }
  }

  getDeviceTypeList(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapData/getDeviceTypeList',
      payload,
    });
  }

  getMapDeviceAll(payload) {
    const { dispatch } = this.props;
    if (payload === 'all') {
      dispatch({
        type: 'mapData/getMapDeviceAll',
      });
    } else {
      dispatch({
        type: 'mapData/getMapDeviceAll',
        payload: {
          type: payload,
        },
      });
    }
  }

  fetchData() {
    this.getDeviceTypeList();
  }
}
export default DropDownList;
