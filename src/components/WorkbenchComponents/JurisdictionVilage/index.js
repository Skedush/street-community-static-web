import React, { PureComponent } from 'react';
import styles from './index.less';
import { Input, Icon, Cascader, Empty, Spin } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import CommonComponent from '@/components/CommonComponent';
import InfiniteScroll from 'react-infinite-scroller';
import IconFont from 'components/IconFont';
import Img from '@/components/My/Img';
import classNames from 'classnames';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
@connect(
  ({ workbench: { villageList, policeOrgTree, count, communitysPage }, loading: { effects } }) => ({
    villageList,
    policeOrgTree,
    count,
    communitysPage,
    getCommunityLoading: effects['workbench/getCommunitys'],
  }),
)
class JurisdictionVilage extends PureComponent {
  sortEnum = ['1 ASC', '1 DESC', '2 ASC', '2 DESC', '3 ASC', '3 DESC'];
  constructor(props) {
    super(props);
    this.state = {
      modalShow: true,
      listShow: false,
      loading: false,
      hasMore: true,
      detailVisible: false,
      data: [],
      name: '',
      policeId: '',
      level: '',
      searchValue: '',
      analyzeData: {},
      analyzePosition: { x: 0, y: 0 },
      sortIndex: null,
    };
    this.villagePage = 0;
    this.messagesEnd = null;
  }

  componentDidMount() {
    this.fetchData();
  }

  // eslint-disable-next-line max-lines-per-function
  renderVillageList() {
    const columns = [
      {
        title: '小区名称',
        dataIndex: 'name',
        align: 'left',
        width: '24%',
        onCell: () => {
          return {
            style: {
              maxWidth: 50,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          };
        },
        render: (text, record) => {
          return (
            <div title={text} className={styles.nameBox} onClick={() => this.villageClick(record)}>
              <span className={styles.vname} title={text}>
                {text}
              </span>
            </div>
          );
        },
      },
      {
        title: '派出所',
        dataIndex: 'policeOrgName',
        align: 'left',
        // width: '15%',
        render: (text, record) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '人员',
        align: 'left',
        dataIndex: 'householdCount',
        width: '12%',
        render: (text, record) => <span className={styles.tableColor}>{text}</span>,
      },
      {
        title: '车辆',
        align: 'left',
        dataIndex: 'carCount',
        width: '12%',
        render: (text, record) => <span className={styles.tableColor}>{text}</span>,
      },
      {
        title: '房屋',
        align: 'left',
        dataIndex: 'houseCount',
        width: '12%',
        render: (text, record) => <span className={styles.tableColor}>{text}</span>,
      },
      {
        title: '操作',
        align: 'left',
        width: '10%',
        dataIndex: 'id',
        render: (text, record) => {
          return (
            <a
              className={classNames(styles.tableBtn, { [styles.yellow]: record.placedTop > 0 })}
              onClick={e => this.onPlacedTop(e, record)}
            >
              置顶
            </a>
          );
        },
      },
    ];
    const {
      villageList: { content },
    } = this.props;
    return (
      <LdTable
        id={'villageList'}
        type={'myTable'}
        pagination={false}
        // loading={this.props.loading.effects['realModel/getCompanyPersonList']}
        columns={columns}
        dataSource={content || null}
        rowClassName="table-row"
        scroll={{ y: '100%' }}
        rowKey={'id'}
        width={'100%'}
      />
    );
  }

  renderVillageModal() {
    const {
      villageList: { content, totalElements },
    } = this.props;
    if (!content) {
      return <div />;
    }
    if (totalElements && totalElements !== 0) {
      return content.length && content.length > 0 ? (
        content.map((item, index) => (
          <div className={styles.villageCard} key={index} onClick={() => this.villageClick(item)}>
            <div className={styles.img}>
              <Img
                boxClassName={styles.imageBox}
                image={item.image}
                defaultImg={require('@/assets/ditu.png')}
                type="imageStart"
              />
              {item.image ? '' : <div className={styles.mark}>{item.name}</div>}
            </div>
            <div className={styles.bottomBox}>
              <p>
                <label className={styles.vname} title={item.name}>
                  {item.name}
                </label>
              </p>
              <span className={styles.policeOrgName} title={item.policeOrgName}>
                {item.policeOrgName}
              </span>
              <div className={styles.text}>
                <div>
                  <span>{item.householdCount}</span>
                  <span>人员</span>
                </div>
                <div>
                  <span>{item.carCount}</span>
                  <span>车辆</span>
                </div>
                <div>
                  <span>{item.houseCount}</span>
                  <span>房屋</span>
                </div>
              </div>
            </div>
            <a
              className={classNames({ [styles.yellow]: item.placedTop > 1 })}
              onClick={e => this.onPlacedTop(e, item)}
            >
              置顶
            </a>
          </div>
        ))
      ) : (
        <div className={styles.empty}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    } else {
      return (
        <div className={styles.empty}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    }
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      className,
      villageList,
      policeOrgTree,
      villageList: { content },
    } = this.props;
    const { modalShow, listShow, hasMore, loading } = this.state;

    if (!policeOrgTree && !content) {
      return null;
    }

    // const { userName, role, id } = store.get('userData');

    const villageMeans = (
      <div>
        <p>
          <span style={{ fontSize: '14px' }}>智安小区</span>
          <span style={{ fontSize: '18px' }}>{villageList.totalElements}</span>
        </p>
      </div>
    );
    return (
      <div className={classNames(className, styles.listBody)}>
        <div className={styles.head}>
          <Cascader
            options={policeOrgTree}
            onChange={this.onChangeCascader}
            changeOnSelect
            popupClassName={styles.headCascader}
            // matchInputWidth={true}
            placeholder="辖区"
            showSearch={(inputValue, path) => {
              return path.some(
                option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
              );
            }}
            // onPopupVisibleChange={this.onPopupVisibleChange}
          />
          <div className={styles.headRight}>
            <Input
              placeholder="搜索小区关键字"
              addonAfter={villageMeans}
              onChange={this.searchValue}
              onPressEnter={this.onSearch}
            />
            <LdButton
              icon="search"
              style={{ marginLeft: '0', height: '100%' }}
              onClick={this.onSearch}
            >
              搜索
            </LdButton>
          </div>
        </div>
        <div className={styles.listHead}>
          {this.renderSort()}

          <div className={styles.showType}>
            <p
              onClick={() => this.onTabChange(1)}
              className={classNames({ [styles.pcolor]: modalShow })}
            >
              <span>
                <Icon type="appstore" theme="filled" />
              </span>
              <span>模块展示</span>
            </p>
            <p
              onClick={() => this.onTabChange(2)}
              className={classNames({ [styles.pcolor]: listShow })}
            >
              <span>
                <Icon type="unordered-list" />
              </span>
              <span>列表展示</span>
            </p>
          </div>
        </div>
        <Spin
          spinning={!!this.props.getCommunityLoading}
          size="large"
          wrapperClassName={styles.spinstyle}
        >
          <div
            className={styles.villageList}
            ref={el => {
              this.messagesEnd = el;
            }}
          >
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!loading && hasMore}
              useWindow={false}
              className={styles.scroll}
              id={'listscroll'}
            >
              {modalShow ? this.renderVillageModal() : this.renderVillageList()}
            </InfiniteScroll>
          </div>
        </Spin>
      </div>
    );
  }

  renderSort = () => {
    const { sortIndex } = this.state;
    return (
      <div className={styles.sort}>
        <div
          className={classNames('flexStart', 'itemCenter', styles.item)}
          onClick={() => this.onSort('person')}
        >
          <IconFont
            type="icon-roles"
            style={{
              fontSize: '24px',
              color: sortIndex === 0 || sortIndex === 1 ? '#22C2FE' : '#fff',
              height: '30px',
            }}
          />
          <div className={classNames('flexColCenter', 'itemCenter')}>
            <IconFont
              type="icon-zhankai"
              style={{
                height: '10px',
                fontSize: '14px',
                color: sortIndex === 0 ? '#22C2FE' : '#FFF',
              }}
            />
            <IconFont
              type="icon-shuoqi"
              style={{
                fontSize: '14px',
                height: '10px',
                color: sortIndex === 1 ? '#22C2FE' : '#FFF',
              }}
            />
          </div>
        </div>
        <div
          className={classNames('flexStart', 'itemCenter', styles.item)}
          onClick={() => this.onSort('car')}
        >
          <IconFont
            type="icon-car"
            style={{
              fontSize: '24px',
              color: sortIndex === 2 || sortIndex === 3 ? '#22C2FE' : '#fff',
              height: '30px',
            }}
          />
          <div className={classNames('flexColCenter', 'itemCenter')}>
            <IconFont
              type="icon-zhankai"
              style={{
                height: '10px',
                fontSize: '14px',
                color: sortIndex === 2 ? '#22C2FE' : '#FFF',
              }}
            />
            <IconFont
              type="icon-shuoqi"
              style={{
                fontSize: '14px',
                height: '10px',
                color: sortIndex === 3 ? '#22C2FE' : '#FFF',
              }}
            />
          </div>
        </div>
        <div
          className={classNames('flexStart', 'itemCenter', styles.item)}
          onClick={() => this.onSort('house')}
        >
          <IconFont
            type="icon-house"
            style={{
              fontSize: '24px',
              color: sortIndex === 4 || sortIndex === 5 ? '#22C2FE' : '#fff',
              height: '30px',
            }}
          />
          <div className={classNames('flexColCenter', 'itemCenter')}>
            <IconFont
              type="icon-zhankai"
              style={{
                height: '10px',
                fontSize: '14px',
                color: sortIndex === 4 ? '#22C2FE' : '#FFF',
              }}
            />
            <IconFont
              type="icon-shuoqi"
              style={{
                fontSize: '14px',
                height: '10px',
                color: sortIndex === 5 ? '#22C2FE' : '#FFF',
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  onSort = type => {
    let { sortIndex } = this.state;
    switch (type) {
      case 'person':
        if (sortIndex !== 0 && sortIndex !== 1) {
          sortIndex = 0;
        } else if (sortIndex === 0) {
          sortIndex = 1;
        } else if (sortIndex === 1) {
          sortIndex = null;
        }
        break;
      case 'car':
        if (sortIndex !== 2 && sortIndex !== 3) {
          sortIndex = 2;
        } else if (sortIndex === 2) {
          sortIndex = 3;
        } else if (sortIndex === 3) {
          sortIndex = null;
        }
        break;
      case 'house':
        if (sortIndex !== 4 && sortIndex !== 5) {
          sortIndex = 4;
        } else if (sortIndex === 4) {
          sortIndex = 5;
        } else if (sortIndex === 5) {
          sortIndex = null;
        }
        break;

      default:
        break;
    }
    this.setState({ sortIndex }, () => {
      this.fetchData();
    });
  };

  fetchData = type => {
    const { dispatch } = this.props;
    const { name, policeId, level, sortIndex } = this.state;

    dispatch({
      type: 'workbench/setCommunitysData',
      payload: {
        searchValue: name,
        communitysLevel: level,
        policeId,
      },
    });
    dispatch({
      type: 'workbench/getCommunitys',
      payload: {
        searchValue: name,
        size: 30,
        page: 0,
        level: level,
        policeId: policeId,
        sortCondition: this.sortEnum[sortIndex],
      },
    }).then(list => {
      this.judgeHasMore(list);
      if (list) {
        dispatch({
          type: 'home/setMapCenter',
          payload: list.content[0] || {},
        });
        dispatch({
          type: 'home/updateCommunitys',
          payload: list,
        });
      }
    });

    this.villagePage = 0;

    dispatch({
      type: 'workbench/getIndexData',
    });
    dispatch({
      type: 'workbench/getPoliceOrgTree',
    });
  };

  onChangeCascader = value => {
    const { dispatch } = this.props;
    const { name, sortIndex } = this.state;
    if (value.length > 0) {
      dispatch({
        type: 'workbench/getCommunitys',
        payload: {
          searchValue: name,
          size: 30,
          page: 0,
          policeId: value[value.length - 1],
          level: value.length,
          sortCondition: this.sortEnum[sortIndex],
        },
      }).then(list => {
        this.judgeHasMore(list);
        if (list) {
          dispatch({
            type: 'home/setMapCenter',
            payload: list.content[0] || {},
          });
          dispatch({
            type: 'home/updateCommunitys',
            payload: list,
          });
        }
      });

      dispatch({
        type: 'workbench/setCommunitysData',
        payload: {
          searchValue: this.state.name,
          communitysLevel: value.length,
          policeId: value[value.length - 1],
        },
      });
      this.villagePage = 0;
      this.setState({
        policeId: value[value.length - 1],
        level: value.length,
      });
    } else {
      dispatch({
        type: 'workbench/getCommunitys',
        payload: { size: 30, page: 0, sortCondition: this.sortEnum[sortIndex] },
      }).then(list => {
        if (list) {
          this.judgeHasMore(list);
          dispatch({
            type: 'home/setMapCenter',
            payload: list.content[0] || {},
          });
          dispatch({
            type: 'home/updateCommunitys',
            payload: list,
          });
        }
      });
      this.setState({
        policeId: '',
        level: '',
      });
      this.villagePage = 0;
    }
  };

  onItemMousemove = (event, item) => {
    this.showVillageInfo(item);
  };

  onPlacedTop = (e, item) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/getVillageTop',
      payload: { villageId: item.id },
    }).then(res => {
      if (res.success) {
        this.fetchData(2);
        this.villagePage = 0;
        this.setState({
          loading: false,
        });
      }
    });
  };

  showVillageInfo = async item => {
    this.setState({ analyzeData: {} });
    if (item.controlType === '2') {
      return;
    }
    const data = await this.props.dispatch({
      type: 'workbench/getVillageInfo',
      payload: { id: item.id },
    });
    this.setState({
      analyzeData: data || {},
    });
  };
  searchValue = ({ target: { value } }) => {
    this.setState({
      name: value,
    });
    const { dispatch } = this.props;

    dispatch({
      type: 'workbench/setCommunitysData',
      payload: {
        searchValue: value,
      },
    });
  };

  // 小区搜索
  onSearch = () => {
    this.fetchData();
  };

  // 点击小区跳转
  villageClick = item => {
    if (!item) return;
    const { id, name } = item;
    const { dispatch } = this.props;

    dispatch({
      type: 'workbench/setCurCommunityInfo',
      payload: { id, name },
    });
    dispatch({
      type: 'home/setMapCenter',
      payload: item,
    });
    dispatch({
      type: 'app/setModalStage',
      payload: 'Community',
    });
  };

  // 小区列表切换
  onTabChange = type => {
    this.setState({
      loading: false,
    });
    if (type === 1) {
      this.setState({
        modalShow: true,
        listShow: false,
      });
    } else {
      this.setState({
        modalShow: false,
        listShow: true,
      });
    }
    this.fetchData();
    this.messagesEnd.scrollTop = 0;
  };

  judgeHasMore = res => {
    if (!isEmpty(res) && !isEmpty(res.content) && (res.number + 1) * res.size < res.totalElements) {
      this.setState({
        hasMore: true,
      });
    } else {
      this.setState({
        hasMore: false,
      });
    }
  };

  // 滚动加载
  handleInfiniteOnLoad = async page => {
    const { dispatch, communitysPage } = this.props;
    const { sortIndex } = this.state;

    if (communitysPage === 1) {
      this.villagePage = 0;
    }
    if (this.state.loading) {
      return;
    }
    let { policeId, name } = this.state;

    this.setState({
      loading: true,
    });

    const res = await dispatch({
      type: 'workbench/getCommunitys',
      payload: {
        searchValue: name,
        size: 30,
        page: ++this.villagePage,
        policeId,
        level: this.state.level,
        sortCondition: this.sortEnum[sortIndex],
      },
    });
    this.judgeHasMore(res);
    this.setState({
      loading: false,
    });
    if (!isEmpty(res) && !isEmpty(res.content)) {
      dispatch({
        type: 'home/setMapCenter',
        payload: res.content[0] || {},
      });
      dispatch({
        type: 'home/updateCommunitys',
        payload: res,
      });
    }
  };
}

export default JurisdictionVilage;
