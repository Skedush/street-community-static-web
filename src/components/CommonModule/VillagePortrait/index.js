/* eslint-disable max-lines-per-function */
import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { List, Modal, Carousel, Icon, Form, Tooltip } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { isEqual, chunk } from 'lodash';
import CarPortrait from '@/components/CommonModule/CarPortrait';
import classNames from 'classnames';
import CommonComponent from '@/components/CommonComponent';
// import Taskbar from '@/components/CommonModule/Taskbar';
import LdTable from '@/components/My/Table/LdTable';

// const { confirm } = Modal;

const noInformation = (
  <div className={styles.information}>
    <p>暂无信息...</p>
  </div>
);

@connect(
  ({
    commonModel: {
      personTag,
      pictureData,
      doorList,
      visitorList,
      doorListSum,
      vistorListSum,
      handId,
      tagPerson,
      perTags,
      typeObject,
      personImageOther,
      defaultVillageIds,
    },
    app: { routeList },
    loading,
  }) => ({
    personTag,
    pictureData,
    doorList,
    loading,
    visitorList,
    doorListSum,
    vistorListSum,
    handId,
    tagPerson,
    perTags,
    typeObject,
    personImageOther,
    defaultVillageIds,
    routeList,
  }),
)
@Form.create()
class VillagePortrait extends PureComponent {
  constructor(props) {
    super(props);
    this.doorPage = 0;
    this.visitorPage = 0;
    this.visitorEnd = null;
    this.doorEnd = null;
    this.state = {
      carPortraitVisible: false,
      carId: null,
      visitorData: [],
      doorData: [],
      loading: false,
      hasMore: true,
      targetId: '',
      refreshId: null,
      carVillageId: null,
      selectType: false,
      selectIds: [],
      currentPage: 1,
      housePage: 1,
      controlData: null,
      carPage: 1,
      zIndex: 9999,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.portraitID, this.props.portraitID)) {
      this.fetchData();
    } else if (!isEqual(prevProps.featchType, this.props.featchType)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        refreshId: null,
      });
      this.fetchData();
    }
  }

  renderCarPortrait() {
    return (
      <Modal
        title="车辆画像"
        visible={this.state.carPortraitVisible}
        onCancel={this.handleCarCancel}
        footer={false}
        wrapClassName={styles.carModal}
        // destroyOnClose={true}
        zIndex={this.state.zIndex}
      >
        <CarPortrait
          carNewId={this.state.carVillageId}
          carId={this.state.carId}
          portraitzIndex={this.portraitzIndex}
          sendPortaitVisible={this.sendPortaitVisible}
        />
      </Modal>
    );
  }

  beforeChange = (from, to) => {
    this.setState({ currentPage: to + 1 });
  };

  renderLeft() {
    const pictureData = this.props.pictureData;

    if (!pictureData) {
      return null;
    }

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
      <div className={styles.porLeft}>
        <div className={styles.leftTop}>
          <div className={styles.leftTopText}>
            <span className={styles.name}>{pictureData.name || ''}</span>
            {/* <span>{pictureData.important ? '（重点人员）' : ''}</span> */}
          </div>
        </div>
        <div className={styles.leftBottom}>
          <p>
            <span>登记方式：</span>
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
          </p>

          <p className={styles.p1}>
            <span>
              <span>性</span>
              <span>别</span>：
            </span>
            <span>{pictureData.gender || ''}</span>
          </p>
          <p className={styles.p1}>
            <span>
              <span>年</span>
              <span>龄</span>：
            </span>
            <span>{pictureData.age || ''}</span>
          </p>
          <p className={styles.p1}>
            <span>
              <span>民</span>
              <span>族</span>：
            </span>
            <span>{pictureData.nation || ''}</span>
          </p>
          <p className={styles.p1}>
            <span>
              <span>国</span>
              <span>籍</span>：
            </span>
            <span>{pictureData.nationality || ''}</span>
          </p>
          <p className={styles.p1}>
            <span>
              <span>职</span>
              <span>业</span>：
            </span>
            <span>{pictureData.occupationStr || ''}</span>
          </p>
          <p>
            <span>婚姻状态：</span>
            <span>{pictureData.maritalStatus || ''}</span>
          </p>
          <p>
            <span>政治面貌：</span>
            <span>{pictureData.politicalStatusStr || ''}</span>
          </p>
          <p>
            <span>户籍地址：</span>
            <span>{pictureData.address || ''}</span>
          </p>
        </div>
      </div>
    );
  }

  // 相关房屋
  renderRelatedHome() {
    if (!this.props.personImageOther) {
      return null;
    }
    const house = this.props.personImageOther.house;
    const data = chunk(house, 2);
    let cpts = noInformation;
    if (house.length > 0) {
      return (
        <div className={styles.relatedHome}>
          <h3>
            <span>相关房屋{'(' + house.length + ')' || '0'}</span>
            <span>{`${this.state.housePage}/${data.length}`}</span>
          </h3>
          <div className={styles.rightTopLeftTop}>
            <div className={styles.housBigBox}>
              <Carousel
                dots={false}
                ref={div => {
                  this.chartBox1 = div;
                }}
              >
                {data.length
                  ? data.map((text, index) => {
                      return (
                        <div className={styles.carouselBox} key={index}>
                          {text.map((item, index) => {
                            return (
                              <div className={styles.housDiv} key={index}>
                                <div className={styles.housLeft}>
                                  <p
                                    className={classNames(
                                      {
                                        [styles.ownLiveBg]:
                                          item.typeKey === '1' &&
                                          item.personCount <= 7 &&
                                          !item.importantPerson,
                                      },
                                      {
                                        [styles.rentOutBg]:
                                          item.typeKey === '2' &&
                                          item.personCount < 7 &&
                                          !item.importantPerson,
                                      },
                                      {
                                        [styles.shopBg]:
                                          item.typeKey === '3' &&
                                          item.personCount < 7 &&
                                          !item.importantPerson,
                                      },
                                      {
                                        [styles.sevenPersonBg]:
                                          item.personCount >= 7 && !item.importantPerson,
                                      },
                                      { [styles.importantHouseBg]: item.importantPerson },
                                    )}
                                  >
                                    <i
                                      style={{
                                        color: 'white',
                                        fontSize: '14px',
                                        width: '14px',
                                        height: '14px',
                                      }}
                                      className={classNames('iconfont', 'icon-housetype')}
                                    ></i>
                                  </p>
                                </div>
                                <div className={styles.housText}>
                                  <p>{item.address}</p>
                                  <p>{item.type}</p>
                                  <p>入住时间：{item.time}</p>
                                  <p>
                                    <span style={{ marginRight: '8px' }}>
                                      户主：{item.houseOwnerName}
                                    </span>
                                    <span>居住人数：{item.personCount}</span>
                                  </p>
                                </div>
                                {index > 0 ? <div className={styles.houseRight} /> : <div />}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })
                  : '暂无数据'}
              </Carousel>
              <a
                className={styles.next1}
                onClick={() => {
                  // eslint-disable-next-line react/no-string-refs
                  let { housePage } = this.state;
                  // eslint-disable-next-line react/no-string-refs
                  if (housePage === data.length) {
                    // this.setState({ currentPage: 1 });
                    return;
                  }
                  if (housePage < data.length) {
                    this.setState({ housePage: housePage + 1 });
                  }

                  this.chartBox1.next();
                }}
              >
                <Icon type="right" />
              </a>
              <a
                className={styles.previous1}
                onClick={() => {
                  // eslint-disable-next-line react/no-string-refs
                  let { housePage } = this.state;
                  if (housePage === 1) {
                    // this.setState({ currentPage: car.carImageUrls.length });
                    return;
                  }

                  this.setState({ housePage: housePage - 1 });
                  this.chartBox1.prev();
                }}
              >
                <Icon type="left" />
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.relatedHome}>
          <h3>相关房屋{'(' + house.length + ')' || '0'}</h3>
          <div className={styles.rightTopLeftTop}>
            <div className={styles.carBox}>{cpts}</div>
          </div>
        </div>
      );
    }
  }

  // 相关车辆
  renderRelatedCar() {
    if (!this.props.personImageOther) {
      return null;
    }
    const car = this.props.personImageOther.car;
    const data = chunk(car, 3);
    let cpts = noInformation;
    if (car.length > 0) {
      return (
        <div className={styles.relatedCar}>
          <h3>
            <span>相关车辆{'(' + car.length + ')' || '0'}</span>
            <span>{`${this.state.carPage}/${data.length}`}</span>
          </h3>
          <div className={styles.carBigBox}>
            <Carousel
              dots={false}
              ref={div => {
                this.chartBox = div;
              }}
            >
              {data.map((item, index) => {
                return (
                  <div className={styles.carouselBox} key={index}>
                    {item.map((text, index) => (
                      <div className={styles.carDiv} key={index}>
                        <div className={styles.carLeftBox}>
                          <div className={styles.carText}>
                            <p>
                              车牌号码：
                              <span
                                onClick={() => this.showCarPortrait(text.carVillageId, text.id)}
                                style={{ color: '#22c2fe' }}
                              >
                                {text.carCode}
                              </span>
                            </p>
                            <p>登记小区：{text.villageName}</p>
                            <p>品牌车型：{text.brand}</p>
                            <p>登记时间：{text.time}</p>
                          </div>
                        </div>
                        <div className={styles.carRight} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </Carousel>
            <a
              className={styles.next}
              onClick={() => {
                // eslint-disable-next-line react/no-string-refs
                let { carPage } = this.state;
                // eslint-disable-next-line react/no-string-refs
                if (carPage === data.length) {
                  // this.setState({ currentPage: 1 });
                  return;
                }
                if (carPage < data.length) {
                  this.setState({ carPage: carPage + 1 });
                }
                this.chartBox.next();
              }}
            >
              <Icon type="right" />
            </a>
            <a
              className={styles.previous}
              onClick={() => {
                // eslint-disable-next-line react/no-string-refs
                let { carPage } = this.state;
                if (carPage === 1) {
                  // this.setState({ currentPage: car.carImageUrls.length });
                  return;
                }

                this.setState({ carPage: carPage - 1 });
                this.chartBox.prev();
              }}
            >
              <Icon type="left" />
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.relatedCar}>
        <h3>相关车辆{'(' + car.length + ')' || '0'}</h3>
        <div className={styles.carBigBox}>
          <div className={styles.carBox}>{cpts}</div>
        </div>
      </div>
    );
  }

  renderEntranceGuard() {
    const data = this.props.doorList;
    const doorListSum = this.props.doorListSum;
    const loading = this.props.loading.effects['commonModel/getDoor'];
    const { hasMore } = this.state;

    if (!data) {
      return null;
    }
    return (
      <div className={styles.rightTopRight}>
        <div className={styles.rightTopTitle}>
          <h3>门禁记录</h3>
          <h3>(门禁记录总条数:{doorListSum}) </h3>
        </div>
        <div
          className={styles.rightTopTextBox}
          ref={el => {
            this.doorEnd = el;
          }}
        >
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad.bind(this, 1)}
            hasMore={!loading && hasMore}
            useWindow={false}
            style={{ height: '100%' }}
          >
            {data.length > 0 ? (
              <List
                dataSource={data}
                renderItem={(item, index) => (
                  <div className={styles.textDiv} key={index}>
                    {/* <div className={styles.divCon}></div> */}
                    <div className={styles.divIndex}>{index + 1}</div>

                    <div className={styles.divCon}>
                      {' '}
                      <p>进出类型：{item.directionStr}</p>
                      <p>关卡：{item.deviceName}</p>
                      <p>地址：{item.villageName}</p>
                      <p>进入时间：{item.recordTime}</p>
                    </div>
                  </div>
                )}
              />
            ) : (
              noInformation
            )}
          </InfiniteScroll>
        </div>
      </div>
    );
  }

  renderVisitor() {
    const data = this.props.visitorList;
    const vistorListSum = this.props.vistorListSum;
    const loading = this.props.loading.effects['commonModel/getVisitor'];
    if (!data) {
      return null;
    }
    return (
      <div className={styles.rightBottomRight}>
        <div className={styles.rightBottomTitle}>
          <h3>访客记录</h3>
          <h3>(访客记录总条数:{vistorListSum}) </h3>

          {/* <u>更多</u> */}
        </div>
        <div
          className={styles.rightBottomTextBox}
          ref={el => {
            this.visitorEnd = el;
          }}
        >
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad.bind(this, 2)}
            hasMore={!loading && this.state.hasMore}
            useWindow={false}
            style={{ height: '100%' }}
          >
            {data.length > 0 ? (
              <List
                dataSource={data}
                renderItem={(item, index) => (
                  <div className={styles.textDiv} key={index}>
                    <div className={styles.divIndex}>{index + 1}</div>
                    <div className={styles.divCon}>
                      <p>访客姓名：{item.name}</p>
                      <p>访客手机：{item.phone}</p>
                      <p>关卡：{item.addressDoor}</p>
                      {/* <p>进入时间：{item.time}</p> */}
                      <p>进入时间：{item.recordTime}</p>
                    </div>
                  </div>
                )}
              />
            ) : (
              noInformation
            )}
          </InfiniteScroll>
        </div>
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
            type="insideTable"
            columns={tableTitle}
            bordered
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
    if (loading || !this.props.personImageOther || !this.props.pictureData) {
      return CommonComponent.renderLoading();
    }

    return (
      <div className={styles.Box}>
        <div className={styles.villageBox}>
          {this.renderLeft()}
          <div className={styles.porRight}>
            <div className={styles.proTextBox}>
              <div className={styles.proTextLeft}>
                {this.renderTable()}
                {this.renderRelatedHome()}
                {this.renderRelatedCar()}
              </div>
              <div className={styles.proTextRight}>
                {this.renderEntranceGuard()}
                {this.renderVisitor()}
              </div>
            </div>
          </div>
        </div>
        {this.renderCarPortrait()}
        {/* <Taskbar /> */}
      </div>
    );
  }

  handleCarCancel = e => {
    this.setState({
      carPortraitVisible: false,
    });
  };

  personnelPortrait = id => {
    const { dispatch, portraitID } = this.props;
    const { refreshId } = this.props;
    dispatch({
      type: 'commonModel/getPersonnelPortrait',
      payload: {
        personId: id || refreshId || portraitID,
      },
    });
  };

  villageVisitor(id, test, villages = []) {
    const { dispatch, portraitID } = this.props;
    if (test) {
      this.visitorPage = 0;
    }
    dispatch({
      type: 'commonModel/getVisitor',
      payload: {
        personId: id || portraitID,
        page: this.visitorPage,
        villageIds: villages,
        size: 10,
      },
    });
  }

  doorList(id, test, villages = []) {
    const { dispatch, portraitID } = this.props;
    if (test) {
      this.doorPage = 0;
    }
    dispatch({
      type: 'commonModel/getDoor',
      payload: {
        personId: id || portraitID,
        page: this.doorPage,
        villageIds: villages,
        size: 10,
      },
    });
  }

  sendPortaitVisible = val => {
    this.setState({
      carPortraitVisible: val,
    });
  };

  showCarPortrait = (carVillageId, carId) => {
    // beform update
    this.setState({
      carId: carId,
      carVillageId: carVillageId,
      carPortraitVisible: true,
    });
    if (this.props.carVisiblePortait) {
      this.props.carVisiblePortait(true);
    }
  };

  handleInfiniteOnLoad = type => {
    let data = this.state.doorData;
    const { defaultVillageIds } = this.props;
    if (type === 1) {
      if (this.doorPage >= 9) {
        return;
      }
      this.doorPage++;
      this.doorList(
        this.props.handId,
        false,
        this.state.selectType ? this.state.selectIds.toString() : defaultVillageIds.toString(),
      );
    } else {
      if (this.visitorPage >= 9) {
        return;
      }
      this.visitorPage++;
      this.villageVisitor(
        this.props.handId,
        false,
        this.state.selectType ? this.state.selectIds.toString() : defaultVillageIds.toString(),
      );
    }
    if (data.length > 30) {
      this.setState({
        hasMore: false,
      });
    }
  };

  refreshData = id => {
    this.setState({ refreshId: id });
    this.fetchData(id, true);
    this.setState({
      selectType: false,
    });
    this.visitorPage = 0;
    this.doorPage = 0;
  };

  fetchData(id, test) {
    const { portraitID } = this.props;
    this.doorPage = 0;
    this.visitorPage = 0;
    this.setState({
      targetId: portraitID,
      currentPage: 1,
      housePage: 1,
      carPage: 1,
    });

    this.personnelPortrait(id);
  }
}

export default VillagePortrait;
