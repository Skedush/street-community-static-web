import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Badge } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import { isEmpty, isEqual } from 'lodash';

@connect(({ home: { floorHouseList }, loading: { effects } }) => ({
  floorHouseList,
  getFloorHouseListByFloor: effects['home/getFloorHouseListByFloor'],
}))
class FloorStatistics extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  fetch = () => {
    const { dispatch, villageBulidFloor } = this.props;
    let { villageId, buildId, floor } = villageBulidFloor;
    dispatch({
      type: 'home/getFloorHouseListByFloor',
      payload: { villageId, buildId, floor, sort: 'DESC' },
    });
  };

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.villageBulidFloor, this.props.villageBulidFloor)) {
      this.fetch();
    }
  }

  renderUnitList() {
    const { floorHouseList, onHouseClick } = this.props;
    const badgeColor = {
      '1': '#0DB896',
      '2': '#1AABFF',
      '3': '#FF6600',
      '99': '#CCCCCC',
    };
    if (isEmpty(floorHouseList)) return null;
    const { itemList } = floorHouseList;
    if (isEmpty(itemList)) return null;
    return (
      <div className={classNames('flexColStart', styles.unitInfo)}>
        {itemList.map((item, index) => (
          <div key={index} className={classNames('flexBetween')}>
            <div className={classNames(styles.floor, 'flexColCenter', 'itemCenter')}>
              {item.floor}F
            </div>
            <div className={classNames('flexBetween', 'flexWrap', styles.houses)}>
              {item.houseList.map((house, index) => (
                <div
                  className={classNames('flexAround', 'itemCenter', styles.house)}
                  key={index}
                  onClick={() => onHouseClick({ houseId: house.houseId, detailShow: 'house' })}
                >
                  <div>{house.houseName}</div>
                  <Badge color={badgeColor[house.useType]} text={house.useTypeStr} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className={classNames(styles.container, 'flexColStart')}>
        <div className={styles.title}>房屋概况</div>
        {this.renderUnitList()}
      </div>
    );
  }
}

export default FloorStatistics;
