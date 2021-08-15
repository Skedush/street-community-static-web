/* eslint-disable max-lines-per-function */
import React, { PureComponent, createRef } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Carousel, Icon, Form, Tooltip, Spin } from 'antd';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import LdTable from '@/components/My/Table/LdTable';
import Img from '@/components/My/Img';

// const { confirm } = Modal;

@connect(({ commonModel: { pictureData, personImageOther }, loading }) => ({
  pictureData,
  loading,
  personImageOther,
}))
@Form.create()
class VillagePortrait extends PureComponent {
  houseCarousel = createRef();
  carCarousel = createRef();
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.personId, this.props.personId)) {
      this.fetchData();
    }
  }

  renderPersonInfo() {
    const pictureData = this.props.pictureData;
    let registerTypeTitle = '';
    try {
      if (pictureData.registerTypeStr.length > 1) {
        registerTypeTitle = pictureData.registerTypeStr.map((el, index) => {
          return (
            <span key={index}>
              {el.villageName}:{el.value};
              <br />
            </span>
          );
        });
      }
    } catch (error) {
      registerTypeTitle = '';
    }
    return (
      <div className={classNames(styles.infoData, 'flexColStart')}>
        <div className={classNames('flexStart', 'itemCenter', styles.title)}>
          <Icon type="info-circle" theme="filled" className={styles.icon} />
          <div className={styles.text}>相关数据</div>
        </div>
        <div className={classNames('flexStart', 'flexWrap', styles.info)}>
          <div className={styles.item}>
            性 别：<span>{pictureData.gender || ''}</span>
          </div>
          <div className={styles.item}>
            年 龄：
            <span>{pictureData.age || ''}</span>
          </div>
          <div className={styles.item}>
            民 族：
            <span>{pictureData.nation || ''}</span>
          </div>
          <div className={styles.item}>
            国 籍：
            <span>{pictureData.nationality || ''}</span>
          </div>
          <div className={styles.item}>
            职 业：
            <span>{pictureData.occupationStr || ''}</span>
          </div>
          <div className={styles.item}>
            婚姻状态：
            <span>{pictureData.maritalStatus || ''}</span>
          </div>
          <div className={styles.item}>
            政治面貌：
            <span>{pictureData.politicalStatusStr || ''}</span>
          </div>
          <div className={styles.item}>
            登记方式：
            <span>
              {(pictureData.registerTypeStr &&
                pictureData.registerTypeStr.length &&
                pictureData.registerTypeStr[0].value) ||
                ''}
              {pictureData.registerTypeStr &&
              pictureData.registerTypeStr.length &&
              pictureData.registerTypeStr.length > 1 ? (
                <Tooltip
                  className={styles.hoverTitle}
                  title={<div>{registerTypeTitle}</div>}
                  placement={'top'}
                  overlayClassName={styles.toolTip}
                >
                  {pictureData.registerTypeStr.length}
                </Tooltip>
              ) : (
                ''
              )}
            </span>
          </div>
          <div className={styles.address}>
            户籍地址：
            <span>{pictureData.address || ''}</span>
          </div>
        </div>
      </div>
    );
  }

  renderHouseInfo() {
    if (!this.props.personImageOther) {
      return null;
    }
    const house = this.props.personImageOther.house;
    return (
      <div className={classNames(styles.houseData, 'flexColStart')}>
        <div className={classNames('flexStart', 'itemCenter', styles.title)}>
          <Icon type="home" theme="filled" className={styles.icon} />
          <div className={styles.text}>相关房屋{'(' + house.length + ')' || '0'}</div>
        </div>
        {house.length > 0 && (
          <div className={classNames(styles.carousel)}>
            <Icon type="left" className={styles.left} onClick={() => this.houseCarousel.prev()} />
            <Icon type="right" className={styles.right} onClick={() => this.houseCarousel.next()} />
            <Carousel
              dots={false}
              ref={div => {
                this.houseCarousel = div;
              }}
            >
              {house.map((item, index) => {
                return (
                  <div key={index}>
                    <div
                      className={classNames(styles.text, 'flexColCenter', 'itemCenter')}
                      onClick={() => this.onHouseClick(item.id)}
                    >
                      <div>{item.address}</div>
                      <div>{item.type}</div>
                      <div>入住时间：{item.time}</div>
                      <div>
                        <span style={{ marginRight: '15px' }}>户主：{item.houseOwnerName}</span>
                        <span>居住人数：{item.personCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </div>
        )}
      </div>
    );
  }

  renderCarInfo() {
    if (!this.props.personImageOther) {
      return null;
    }
    const car = this.props.personImageOther.car;
    return (
      <div className={classNames(styles.carData, 'flexColStart')}>
        <div className={classNames('flexStart', 'itemCenter', styles.title)}>
          <Icon type="car" theme="filled" className={styles.icon} />
          <div className={styles.text}>相关车辆{'(' + car.length + ')' || '0'}</div>
        </div>
        {car.length > 0 && (
          <div className={classNames(styles.carousel)}>
            <Icon type="left" className={styles.left} onClick={() => this.carCarousel.prev()} />
            <Icon type="right" className={styles.right} onClick={() => this.carCarousel.next()} />

            <Carousel
              dots={false}
              ref={div => {
                this.carCarousel = div;
              }}
            >
              {car.map((item, index) => {
                return (
                  <div key={index}>
                    <div
                      className={classNames(styles.text, 'flexColCenter', 'itemCenter')}
                      onClick={() => this.onCarClick(item.id)}
                    >
                      <div>
                        车牌号码：
                        {item.carCode}
                      </div>
                      <div>登记小区：{item.villageName}</div>
                      <div>品牌车型：{item.brand}</div>
                      <div>登记时间：{item.time}</div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </div>
        )}
      </div>
    );
  }

  renderLeft() {
    const pictureData = this.props.pictureData;

    if (!pictureData) {
      return null;
    }

    return (
      <div className={styles.porLeft}>
        <div className={classNames(styles.leftTop, 'flexColCenter', 'itemCenter')}>
          <Img
            image={require('@/assets/images/guanzhurenyuan.png')}
            defaultImg={require('@/assets/images/guanzhurenyuan.png')}
            className={styles.photo}
          />
          <div className={styles.name}>{pictureData.name || ''}</div>
        </div>
        {this.renderPersonInfo()}
        {this.renderHouseInfo()}
        {this.renderCarInfo()}
      </div>
    );
  }

  renderTable() {
    if (!this.props.personImageOther) {
      return null;
    }
    const tableTitle = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '20%',
        render: (item, record) => {
          return (
            <span
              onClick={() => this.refreshData(record.id)}
              style={{ cursor: 'pointer', color: '#22c2fe' }}
            >
              {item}
            </span>
          );
        },
      },
      {
        title: '登记小区',
        dataIndex: 'villageName',
        width: '40%',
        render: (item, record) => {
          return <span>{item}</span>;
        },
      },
    ];
    const tableData = this.props.personImageOther.person;
    return (
      <div className={styles.renderTable}>
        <h3>同住人员{'(' + tableData.length + ')' || '0'}</h3>
        <div className={styles.rightTable}>
          <LdTable
            rowKey={'id'}
            type="insideTable"
            columns={tableTitle}
            pagination={false}
            dataSource={tableData || null}
            rowClassName="table-row"
            scroll={{ y: '100%' }}
            widthTwo={true}
          />
        </div>
      </div>
    );
  }

  render() {
    const loading = this.props.loading.effects['commonModel/getPersonnelPortrait'];

    return (
      <div className={classNames(styles.container, 'flexColStart')}>
        <div className={classNames('flexBetween', 'itemCenter', styles.top)}>
          <div className={styles.title}>基本信息</div>
          <div className={styles.close} onClick={this.handleCancel}>
            <Icon type="close" />
          </div>
        </div>
        <Spin spinning={!!loading} size="large" wrapperClassName={styles.spinstyle}>
          <div className={classNames(styles.content, 'flexAuto')}>
            {this.renderLeft()}
            {this.renderTable()}
          </div>
        </Spin>
      </div>
    );
  }

  handleCancel = () => {
    const { onCloseModal } = this.props;
    onCloseModal();
  };

  onCarClick = id => {
    const { onHouseOrCarClick } = this.props;
    onHouseOrCarClick({ carId: id, detailShow: 'car' });
  };

  onHouseClick = id => {
    const { onHouseOrCarClick } = this.props;
    onHouseOrCarClick({ houseId: id, detailShow: 'house' });
  };

  personnelPortrait = id => {
    const { dispatch, personId } = this.props;
    dispatch({
      type: 'commonModel/getPersonnelPortrait',
      payload: {
        personId: id || personId,
      },
    });
  };

  refreshData = id => {
    this.fetchData(id, true);
  };

  fetchData(id) {
    this.personnelPortrait(id);
  }
}

export default VillagePortrait;
