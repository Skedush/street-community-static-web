import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Modal } from 'antd';
import Img from '@/components/My/Img';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import LdButton from '@/components/My/Button/LdButton';

@connect(({ commonModel: { eventDetail }, loading }) => ({
  eventDetail,
  loading,
}))
class EventDetailModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEqual(prevProps.taskId, this.props.taskId) ||
      (!isEqual(prevProps.visible, this.props.visible) && this.props.visible)
    ) {
      this.fetchData();
    }
  }
  // eslint-disable-next-line max-lines-per-function
  render() {
    const { visible, onCancel, eventDetail } = this.props;
    return (
      <Modal
        title="事件预警"
        centered
        visible={visible}
        onCancel={onCancel}
        width={400}
        footer={false}
        wrapClassName={styles.modal}
        destroyOnClose={true}
      >
        <div className={classNames('flexColStart')}>
          {eventDetail.childType === '0601' && (
            <Img
              image={eventDetail.eventImages}
              defaultImg={require('@/assets/images/noimg.png')}
              className={styles.image}
            />
          )}
          <div className={styles.content}>
            <p>所属小区：{eventDetail.villageName}</p>
            <p>来源设备：{eventDetail.deviceName}</p>
            <p>事件类型：{eventDetail.childTypeStr}</p>
            <p>事件时间：{eventDetail.publishTime}</p>
            <p>事件内容：{eventDetail.content}</p>
            {eventDetail.handlerName && <p>处理人：{eventDetail.handlerName}</p>}
            {eventDetail.handlerTime && <p>处理时间：{eventDetail.handlerTime}</p>}
          </div>
          <div className={classNames('flexEnd', styles.btnGrounp)}>
            <LdButton
              type="master"
              style={{ margin: '0' }}
              onClick={() => this.props.signFor(eventDetail.taskId)}
              disabled={eventDetail.handleStatus !== '2'}
            >
              签收
            </LdButton>
            <LdButton type="reset" style={{ marginLeft: '15px' }} onClick={this.props.onCancel}>
              取消
            </LdButton>
          </div>
        </div>
      </Modal>
    );
  }

  fetchData = () => {
    const { taskId } = this.props;
    // 智安任务的列表
    this.props.dispatch({
      type: 'commonModel/getEventDetail',
      payload: {
        id: taskId,
      },
    });
  };
}

export default EventDetailModal;
