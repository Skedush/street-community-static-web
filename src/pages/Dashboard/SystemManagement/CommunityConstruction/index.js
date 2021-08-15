import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Form, Row, Col, PageHeader, Input } from 'antd';
import styles from './index.less';
import LdButton from '@/components/My/Button/LdButton';
import { connect } from 'dva';
import { omit } from 'lodash';
const FormItem = Form.Item;
@connect(state => {
  const {
    loading: { effects },
    communityConstruction: { villagePlan, deviceCountData },
  } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    villagePlan,
    deviceCountData,
    updateVillagePlanLoading: effects['communityConstruction/updateVillagePlan'],
    updateDeviceCountLoading: effects['communityConstruction/updateDeviceCount'],
  };
})
@Form.create()
class CommunityConstruction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  renderPageHeader() {
    return (
      <div className={styles.myPageHeader}>
        <PageHeader
          className={classNames('borderBottom', styles.iconColor)}
          backIcon={
            <i
              className={classNames('iconfont', 'iconfanhui')}
              style={{ fontSize: '20px', color: '#efefef' }}
            />
          }
          onBack={this.goBack}
          title="小区建设"
        />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      villagePlan,
      deviceCountData: { videoSurveillance, smartSnapshot },
    } = this.props;
    let villagePlanCount, villageOkCount, districtsBuildedCount;
    if (villagePlan) {
      villagePlanCount = villagePlan.villagePlanCount;
      villageOkCount = villagePlan.villageOkCount;
      districtsBuildedCount = villagePlan.districtsBuildedCount;
    }
    return (
      <Fragment>
        <div className={'flexStart'}>
          <div className={styles.blueTip}>
            <pre className={styles.preCenter}>
              <span className={classNames('titleFontSm', 'marginLeftSm', 'titleColor')}>
                基本信息
              </span>
            </pre>
          </div>
        </div>
        <div
          className={classNames(
            'paddingRightLg',
            'paddingLeftLg',
            'flexBetween',
            'flexWrap',
            'width50',
            styles.form,
          )}
        >
          <FormItem label="规划建设" className={'width40'}>
            {getFieldDecorator('villagePlanCount', { initialValue: villagePlanCount })(
              <Input placeholder="" className={classNames('noBorderRadius')} />,
            )}
          </FormItem>
          <FormItem label="已建设" className={'width40'}>
            {getFieldDecorator('villageOkCount', { initialValue: villageOkCount })(
              <Input placeholder="" className={classNames('noBorderRadius')} />,
            )}
          </FormItem>
        </div>
        <div className={'flexStart'}>
          <div className={styles.blueTip}>
            <pre className={styles.preCenter}>
              <span className={classNames('titleFontSm', 'marginLeftSm', 'titleColor')}>
                开放小区
              </span>
            </pre>
          </div>
        </div>
        <div
          className={classNames(
            'paddingRightLg',
            'paddingLeftLg',
            'flexStart',
            'flexWrap',
            styles.form,
          )}
        >
          {districtsBuildedCount
            ? districtsBuildedCount.map((item, index) => {
                return (
                  <FormItem
                    label={item.name}
                    className={'width30'}
                    style={{ marginRight: '3%' }}
                    key={index}
                  >
                    {getFieldDecorator(item.code, { initialValue: item.count })(
                      <Input placeholder="" className={classNames('noBorderRadius')} />,
                    )}
                  </FormItem>
                );
              })
            : ''}
        </div>
        <div className={'flexStart'}>
          <div className={styles.blueTip}>
            <pre className={styles.preCenter}>
              <span className={classNames('titleFontSm', 'marginLeftSm', 'titleColor')}>
                设备数量
              </span>
            </pre>
          </div>
        </div>
        <div
          className={classNames(
            'paddingRightLg',
            'paddingLeftLg',
            'flexBetween',
            'flexWrap',
            'width50',
            styles.form,
          )}
        >
          <FormItem label="视频监控" className={'width40'}>
            {getFieldDecorator('videoSurveillance', { initialValue: videoSurveillance })(
              <Input placeholder="" className={classNames('noBorderRadius')} />,
            )}
          </FormItem>
          <FormItem label="智能抓拍" className={'width40'}>
            {getFieldDecorator('smartSnapshot', { initialValue: smartSnapshot })(
              <Input placeholder="" className={classNames('noBorderRadius')} />,
            )}
          </FormItem>
        </div>
      </Fragment>
    );
  }

  renderBottomBtn() {
    const { updateVillagePlanLoading, updateDeviceCountLoading } = this.props;
    return (
      <Fragment>
        <LdButton
          icon="edit"
          loading={updateDeviceCountLoading || updateVillagePlanLoading}
          htmlType="submit"
        >
          保存
        </LdButton>
        <LdButton type="second" globalclass={['marginLeftSm']} onClick={this.handleFormReset}>
          重置
        </LdButton>
      </Fragment>
    );
  }

  render() {
    return (
      <div
        className={classNames(
          'bgThemeColor',
          'height100',
          'paddingLg',
          'flexColBetween',
          'flexAuto',
          'overFlowHidden',
        )}
      >
        <div
          className={classNames(
            'bgThemeHeightColor',
            'flexColBetween',
            'flexAuto',
            'overFlowHidden',
          )}
        >
          <Row>
            <Col>{this.renderPageHeader()}</Col>
          </Row>
          <Form
            className={classNames('flexColBetween', 'flexAuto', 'overFlowHidden')}
            onSubmit={this.updateVillagePlan}
            layout="vertical"
          >
            <Row
              type="flex"
              className={classNames('borderBottom', 'flexColStart', 'flexAuto', 'overFlowAuto')}
            >
              <Col span={24} className={classNames('paddingTopSm', 'paddingBottomSm')}>
                {this.renderForm()}
              </Col>
            </Row>
            <Row
              className={classNames(styles.bottomBtn)}
              type="flex"
              justify="center"
              align="middle"
            >
              <Col>{this.renderBottomBtn()}</Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  updateVillagePlan = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form, villagePlan } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const data = omit(fieldsValue, [
        'villagePlanCount',
        'villageOkCount',
        'villagePlanId',
        'settingId',
        'smartSnapshot',
        'videoSurveillance',
      ]);
      let newVillagePlanData = {};
      newVillagePlanData.villagePlanCount = fieldsValue.villagePlanCount;
      newVillagePlanData.villageOkCount = fieldsValue.villageOkCount;
      newVillagePlanData.settingId = villagePlan.settingId;

      if (data) {
        newVillagePlanData.villagePlanId = villagePlan.villagePlanId;
      }
      newVillagePlanData.districtsBuildedCount = data;
      dispatch({
        type: 'communityConstruction/updateVillagePlan',
        payload: newVillagePlanData,
      });

      const newDeviceCountData = {
        videoSurveillance: fieldsValue.videoSurveillance,
        smartSnapshot: fieldsValue.smartSnapshot,
      };
      dispatch({
        type: 'communityConstruction/updateDeviceCount',
        payload: newDeviceCountData,
      });
    });
  };

  fetchData = () => {
    let { dispatch } = this.props;
    dispatch({
      type: 'communityConstruction/getVillagePlan',
    });
    dispatch({
      type: 'communityConstruction/getDeviceCount',
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };
}

export default CommunityConstruction;
