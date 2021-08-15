import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import styles from './index.less';
import CommunityOverview from '../CommunityOverview';
import CommunityUnit from '../CommunityUnit';
import CommunityUnitDetail from '../CommunityUnitDetail';

// import classNames from 'classnames';

@connect(({ app: { modalStage } }) => ({
  modalStage,
}))
class Community extends PureComponent {
  static propTypes = {
    onBack: PropTypes.func,
  };

  static defaultProps = {
    onBack: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      closed: true,
    };
  }

  componentDidMount() {}

  render = () => {
    let content;
    if (this.props.modalStage === 'Community') {
      content = <CommunityOverview closed={this.state.closed} send={this.handleClosed} />;
    } else if (this.props.modalStage === 'CommunityUnitDetail') {
      content = <CommunityUnitDetail closed={this.state.closed} send={this.handleClosed} />;
    }
    return (
      <div className={styles.container}>
        <CommunityUnit onBack={this.onBack} send={this.handleModel} />
        {content}
      </div>
    );
  };

  onBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/setModalStage',
      payload: 'Overview',
    });
    dispatch({
      type: 'app/setHomeBackGround',
      payload: 'Map',
    });
  };

  handleClosed = val => {
    this.setState({
      closed: val,
    });
  };

  handleModel = val => {
    this.setState({
      closed: val,
    });
  };
}

export default Community;
