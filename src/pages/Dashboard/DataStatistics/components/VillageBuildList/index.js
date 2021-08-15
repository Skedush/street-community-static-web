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

@connect(({ home: { unitTree }, dataStatistics: { villageStatistics } }) => ({
  unitTree,
  villageStatistics,
}))
class VillageBuildList extends PureComponent {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.villageUnitTreeFlag !== this.props.villageUnitTreeFlag) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selectedKeys: [] });
    }
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
    const { villageStatistics } = this.props;
    return (
      <div className={styles.header} onClick={this.onBack}>
        <span>{villageStatistics.villageName || ''}</span>
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
    const { dispatch, villageStatistics } = this.props;
    dispatch({
      type: 'home/getUnitTreeByCommunity',
      payload: { villageId: villageStatistics.villageId },
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onSelect = async (selectedKeys, info) => {
    let { dispatch, setShow } = this.props;
    let dataRef = info.node.props.dataRef;

    if (dataRef.level === 0) {
      setShow({ infoShow: 'village', detailShow: null });
    } else if (dataRef.level === 2) {
      await dispatch({
        type: 'home/setVillageBuildUnitInfo',
        payload: {
          unitId: dataRef.id,
          villageId: dataRef.villageId,
          buildingId: dataRef.buildingId,
        },
      });
      setShow({ infoShow: 'unit', detailShow: null });
    }
    this.setState({ selectedKeys });
  };

  onBack = () => {
    const { dispatch, setShow } = this.props;
    dispatch({
      type: 'dataStatistics/updateState',
      payload: { view: 'community' },
    });
    setShow({ infoShow: 'village', detailShow: null, vrUrl: '' });
  };
}

export default VillageBuildList;
