import React, { PureComponent } from 'react';
import { Tree, Modal } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import LdButton from '@/components/My/Button/LdButton';
import store from 'store';
import Message from '@/components/My/Message';
import { isEmpty } from 'lodash';

const { success } = Message;
const { TreeNode } = Tree;

@connect(
  ({
    commonModel: { communitys, selectVillageAllIncludeOpen },
    workbench: { communitysLevel, policeId, searchValue },
  }) => ({
    communitys,
    selectVillageAllIncludeOpen,
    communitysLevel,
    policeId,
    searchValue,
  }),
)
class Administrator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
      selectedKeys: [],
      isChecked: false,
      visible: false,
    };
  }

  componentDidMount() {
    this.setting();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible !== prevState.visible) {
      return {
        visible: nextProps.visible,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.state.visible && prevProps.visible) {
      this.setting();
    }
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode selectable={false} title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode selectable={false} title={item.name} key={item.id} />;
    });

  renderTree(content) {
    if (!content) {
      return null;
    }
    return (
      <div className={styles.settingTree}>
        <Tree
          checkable
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          defaultExpandAll={true}
        >
          {this.renderTreeNodes(content)}
        </Tree>
      </div>
    );
  }

  render() {
    const { selectVillageAllIncludeOpen } = this.props;
    const open = [];
    const close = [];
    selectVillageAllIncludeOpen.forEach(item => {
      if (item.controlType === '2') {
        open.push(item);
      } else {
        close.push(item);
      }
    });
    const treeData = [
      {
        name: '全部小区',
        id: 0,
        children: [
          { name: '封闭式小区', id: -1, children: close },
          { name: '开发式小区', id: -2, children: open },
        ],
      },
    ];
    return (
      <Modal
        title="设置管辖"
        visible={this.state.visible}
        onCancel={this.handleCancel}
        footer={false}
        wrapClassName={styles.modal}
        destroyOnClose={true}
        zIndex={9998}
      >
        {isEmpty(selectVillageAllIncludeOpen) ? (
          <div className={styles.modifyBox}>暂无数据</div>
        ) : (
          this.renderTree(treeData)
        )}
        <div className={styles.btnBox}>
          <LdButton type="reset" onClick={this.handleCancel}>
            取消
          </LdButton>
          <LdButton onClick={this.onSetting}>保存</LdButton>
        </div>
      </Modal>
    );
  }

  // 设置管辖
  setting = () => {
    const { dispatch } = this.props;
    const { id } = store.get('userData');
    dispatch({ type: 'commonModel/getSelectVillage', payload: { showAll: true, showOpen: true } });
    dispatch({
      type: 'commonModel/getUserAddvillage',
      payload: { userId: id },
    }).then(res => {
      if (res.success) {
        this.setState({
          checkedKeys: res.data.ids,
        });
      } else {
        this.setState({
          checkedKeys: [],
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      checkedKeys: [],
    });
    this.props.showAdministrator(false);
    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/getCommunitys',
      payload: {
        communitysPage: 1,
        searchValue: this.props.searchValue,
        level: this.props.communitysLevel,
        policeId: this.props.policeId,
        size: 20,
        page: 0,
      },
    });
    // 智安底数的联动刷新
    dispatch({
      type: 'home/getStatistic',
    });
    // 采集数据的刷新
    dispatch({
      type: 'workbench/getBringRecord',
    });

    let type = ['01', '02', '03', '04'];
    dispatch({
      type: 'home/getWorkTypeCount',
    });
    dispatch({
      type: 'home/getIndexCount',
      payload: { communitysPage: 1, type: type.toString() },
    });

    dispatch({
      type: 'home/getWorkbench',
    });
    dispatch({
      type: 'home/getIndexData',
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys, isChecked: true });
  };

  onSetting = () => {
    const { checkedKeys } = this.state;
    const mgmtVilageList = checkedKeys.filter(item => {
      const flag = item === '0' || item === '-1' || item === '-2';
      return !flag;
    });
    const { dispatch } = this.props;
    const { id } = store.get('userData');
    dispatch({
      type: 'commonModel/userAddVillage',
      payload: { userId: id, villageId: mgmtVilageList },
    }).then(res => {
      if (res.success) {
        success('已保存');
        this.handleCancel();
        this.upData();
      }
    });
  };

  upData = () => {
    // const { dispatch } = this.props;
    // dispatch({ type: 'commonModel/getOldCount', payload: { page: 0 } });
    window.location.reload();
  };
}

export default Administrator;
