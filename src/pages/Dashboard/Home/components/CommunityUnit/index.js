import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import classNames from 'classnames';
// import workbench from '../../../../../models/workbench';
// import IconFont from 'components/CommonModule/IconFont';
const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;

@connect(({ home: { unitTree }, workbench: { curCommunityInfo } }) => ({
  unitTree,
  curCommunityInfo,
}))
class CommunityUnit extends PureComponent {
  static propTypes = {
    onBack: PropTypes.func,
  };

  static defaultProps = {
    onBack: () => {},
  };

  constructor(props) {
    super(props);
    // let selectedKeys = [props.unitTree[0].key];
    this.state = {
      expandedKeys: null,
      autoExpandParent: true,
      selectedKeys: [],
    };
  }

  componentDidMount() {
    this.fetchData();
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
    let keys = [];
    try {
      keys = this.props.unitTree[0].key;
    } catch (error) {
      keys = '1_1';
    }
    return (
      <DirectoryTree
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys || [keys]}
        autoExpandParent={this.state.autoExpandParent}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
        blockNode
        showIcon={false}
        defaultExpandAll={true}
        className="hide-file-icon"
      >
        {this.renderTreeNodes(this.props.unitTree || [])}
      </DirectoryTree>
    );
  }

  renderHeader() {
    const { curCommunityInfo } = this.props;

    return (
      <div className={styles.header} onClick={this.onBack}>
        <span>{curCommunityInfo.name || ''}</span>
        <i
          className={classNames('iconfont', 'icon-fanhui')}
          style={{ fontSize: '13px', color: 'white', marginLeft: 8 }}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderHeader()}
        {this.renderTree()}
      </div>
    );
  }

  fetchData = () => {
    const { dispatch, curCommunityInfo } = this.props;
    dispatch({
      type: 'home/getUnitTreeByCommunity',
      payload: { villageId: curCommunityInfo.id },
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onSelect = (selectedKeys, info) => {
    let { dispatch } = this.props;
    let dataRef = info.node.props.dataRef;

    if (dataRef.level === 0) {
      dispatch({
        type: 'app/setModalStage',
        payload: 'Community',
      });
      this.props.send(false);
    } else if (dataRef.level === 2) {
      dispatch({
        type: 'home/setVillageBuildUnitInfo',
        payload: {
          unitId: dataRef.id,
          villageId: dataRef.villageId,
          buildingId: dataRef.buildingId,
        },
      });
      dispatch({
        type: 'app/setModalStage',
        payload: 'CommunityUnitDetail',
      });
      this.props.send(false);
    }
    this.setState({ selectedKeys });
  };

  onBack = () => {
    this.props.onBack && this.props.onBack();
  };
}

export default CommunityUnit;
