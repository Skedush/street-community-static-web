import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, List, Tree } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import Img from '@/components/My/Img';
import classNames from 'classnames';
import store from 'store';

const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;

@connect(({ home: { communitys, villageTree, treeShow, keyType, parentKeys }, loading }) => ({
  communitys,
  villageTree,
  treeShow,
  keyType,
  parentKeys,
  loading: loading.effects['home/getCommunitys'],
}))
class DataOverview extends PureComponent {
  static propTypes = {
    onCommunityClick: PropTypes.func,
  };

  static defaultProps = {
    onCommunityClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isCollapseOpen: true,
      name: '',
      autoExpandParent: true,
      selectedKeys: [],
      treeCheck: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // eslint-disable-next-line max-lines-per-function
  renderCommunity() {
    let {
      communitys,
      communitys: { content },
    } = this.props;
    const pagination = {
      position: 'bottom',
      size: 'small',
      // simple: true,
      total: communitys ? communitys.totalElements : 0,
      showTotal: (total, range) => `共 ${total} 条`,
      pageSize: 10,
      defaultCurrent: 1,
      onChange: this.onChangePage,
      current: communitys ? communitys.number + 1 : 1,
    };
    return (
      <List
        itemLayout="vertical"
        size="large"
        className={styles.textbox}
        loading={this.props.loading}
        pagination={pagination}
        dataSource={content}
        renderItem={item => (
          <List.Item>
            <div
              className={styles.item}
              onClick={() => {
                this.onCommunityClick(item);
              }}
            >
              <div className={styles.villageImage}>
                <Img
                  image={item.image}
                  defaultImg={require('@/assets/images/noImage.png')}
                  type="imageStart"
                />
              </div>
              <div className={styles.villageName}>
                <div className={styles.textName}>
                  <span>{item.name}</span>
                </div>
                {item.subscribe ? (
                  <div className={styles.textImage}>
                    <img src={require('@/assets/images/dingyue.png')} alt="" />
                  </div>
                ) : null}
              </div>
              <div className={styles.iphone}>物业：{item.phone}</div>
              <div className={styles.police}>
                <div className={styles.policeName} title={item.policeOrgName}>
                  {' '}
                  <span>{item.policeOrgName}</span>
                </div>
                <div className={styles.policeAddress} title={item.policeJurName}>
                  {' '}
                  {item.policeJurName}
                </div>
              </div>
              <div className={styles.carType}>
                <div className={styles.carItem}>
                  <p>{item.householdCount}</p>
                  <p className={styles.pType}>人员</p>
                </div>
                <div className={styles.carItem}>
                  <p>{item.carCount}</p>
                  <p className={styles.pType}>车辆</p>
                </div>
                <div className={styles.carItem}>
                  <p>{item.houseCount}</p>
                  <p className={styles.pType}>房屋</p>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode selectable={true} title={item.title} key={item.key} dataRef={item} height={45}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode selectable={true} title={item.title} key={item.key} />;
    });

  renderTree() {
    const { keyType, parentKeys } = this.props;
    let keys = [];
    if (keyType) {
      keys = parentKeys;
    } else {
      try {
        keys = [this.props.villageTree[0].key];
      } catch (error) {
        keys = ['1_1'];
      }
    }
    return (
      <DirectoryTree
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys || keys}
        autoExpandParent={this.state.autoExpandParent}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
        blockNode
        defaultExpandAll={true}
        className="hide-file-icon"
        // showLine
        showIcon={false}
      >
        {this.renderTreeNodes(this.props.villageTree || [])}
      </DirectoryTree>
    );
  }

  render() {
    const { treeShow, collapsed } = this.props;
    return (
      <div
        className={
          // styles.containerStart
          collapsed
            ? classNames(styles.container, styles.containerStart)
            : classNames(styles.container, styles.containerCollepse)
        }
      >
        <div className={styles.title}>
          {/* <LdButton style={{ marginRight: 8 }} type="reset" onClick={this.switchRender}>
            切换
          </LdButton> */}
          {treeShow ? (
            ''
          ) : (
            // <Input.Search onSearch={this.onSearch} placeholder="小区名称" enterButton />
            <Input.Search onSearch={this.onSearch} placeholder="搜索小区" style={{ width: 240 }} />
          )}
        </div>
        {/* <LdButton style={{ marginRight: 8 }} type="reset" onClick={this.switchRender}>
          切换
        </LdButton> */}
        <div className={styles.button}>
          <div
            className={treeShow ? styles.treeButton : styles.buttonCheck}
            onClick={this.switchTxtRender}
          >
            图文
          </div>
          <div
            className={treeShow ? styles.buttonCheck : styles.treeButton}
            onClick={this.switchRender}
          >
            树形
          </div>
        </div>
        {/* <div className={styles.leftBottom}>{this.renderItem()}</div> */}
        {treeShow ? this.renderTree() : this.renderCommunity()}
      </div>
    );
  }

  onSearch = (value, event) => {
    this.getCommunitys(value);
  };

  onCommunityClick = (item, selectedKeys) => {
    if (!item) return;
    const { id, name } = item;
    const { dispatch } = this.props;
    dispatch({
      type: 'home/setTreeType',
      payload: { type: true, parentKeys: selectedKeys },
    });

    dispatch({
      type: 'workbench/setCurCommunityInfo',
      payload: { id, name },
    });
    dispatch({
      type: 'workbench/setMapCenter',
      payload: item,
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

  fetchData = () => {
    this.getCommunitys();
  };

  getCommunitys = name => {
    const { dispatch } = this.props;
    this.setState({
      name: name,
    });
    dispatch({
      type: 'home/getCommunitys',
      payload: { searchValue: name },
    });
  };

  onChangePage = page => {
    const { dispatch } = this.props;
    let searchInfo = this.state.name;
    dispatch({
      type: 'home/getCommunitys',
      payload: { page: page - 1, searchValue: searchInfo },
    });
  };

  // 切换成tree
  switchRender = () => {
    const { dispatch } = this.props;
    this.setState({
      treeCheck: true,
    });
    dispatch({
      type: 'home/setTreeShow',
      // payload: !treeShow,
      payload: true,
    });
  };

  // 切换成图文
  switchTxtRender = () => {
    const { dispatch } = this.props;
    const { cityId } = store.get('userData');
    this.setState({
      treeCheck: false,
    });
    dispatch({
      type: 'home/getVillageTree',
      payload: { id: cityId },
    });
    dispatch({
      type: 'home/setTreeShow',
      // payload: !treeShow,
      payload: false,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onSelect = (selectedKeys, info) => {
    let dataRef = info.node.props.dataRef;
    if (dataRef.children.length <= 0) {
      this.onCommunityClick(dataRef.villageListResp, selectedKeys);
    }
    this.setState({ selectedKeys });
  };
}

export default DataOverview;
