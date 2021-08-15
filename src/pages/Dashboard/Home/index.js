import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import 'ant-design-pro/dist/ant-design-pro.css';
import { Page } from 'components';
import styles from './index.less';
import DataOverview from './components/DataOverview';
import Community from './components/Community';
import MapComponents from './components/MapComponent';
import Worbench from './Workbench';
import store from 'store';
// import classNames from 'classnames';
// import { Collapse } from 'react-collapse';

@connect(({ home: { communitys, center }, app: { modalStage }, commonModel: { info } }) => ({
  center,
  modalStage,
  communitys,
  info,
}))
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      villageBulidFloor: {},
      isCollapseOpen: false,
      zIndex: false,
      renderModalShow: true,
      rightModal: false,
      leftBackground: false,
      rightBackground: true,
      collapsed: true,
      // buttonShow: true,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;

    // 监听message事件
    dispatch({ type: 'commonModel/getSelectVillage' });
    const { cityId } = store.get('userData');
    dispatch({
      type: 'home/getVillageTree',
      payload: { id: cityId },
    });

    dispatch({
      type: 'commonModel/getType',
      payload: { type: 40 },
      putType: 'setInfo',
    });
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.dragged(false);
    }
  }

  renderModal = collapsed => {
    const { modalStage } = this.props;

    if (modalStage === 'Overview') {
      return <DataOverview collapsed={collapsed} />;
    } else if (modalStage === 'Community' || modalStage === 'CommunityUnitDetail') {
      return <Community villageBulidFloor={this.state.villageBulidFloor} />;
    }
  };

  renderHomeBackGround() {
    const {
      center,
      communitys: { content },
    } = this.props;
    return <MapComponents center={center} content={content} />;
  }

  render() {
    const { modalStage, info } = this.props;
    const { policeType } = store.get('userData');

    let typeName;
    if (info) {
      typeName = info.filter(item => {
        return item.key === policeType;
      });
    }
    if (!typeName) {
      return null;
    }
    return (
      <Page className={styles.bigbox}>
        {modalStage === 'Overview' ? '' : this.renderHomeBackGround()}
        {modalStage === 'Overview' ? <Worbench /> : this.renderModal()}
      </Page>
    );
  }

  onCollapseChange = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onMeasure = (height, width) => {
    this.setState({ zIndex: height !== 0 });
  };
}
Dashboard.propTypes = {
  dispatch: PropTypes.func,
};

export default Dashboard;
