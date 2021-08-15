import React from 'react';
import { Icon, Radio, message, Modal, Select, Input, DatePicker } from 'antd';
import OkAndCancel from '../Button/OkAndCancel';
import danger from '@/assets/images/danger.png';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const confirm = Modal.confirm;
export default {
  success: content => {
    message.open({
      className: styles.confirmBox,
      content,
      icon: <Icon type="check-circle" theme="filled" style={{ color: '#52CD97' }} />,
    });
  },

  error(content) {
    message.open({
      className: styles.confirmBox,
      content,
      icon: <Icon type="exclamation-circle" theme="filled" style={{ color: '#F15362' }} />,
    });
  },

  info(content) {
    message.open({
      className: styles.confirmBox,
      content,
      icon: <Icon type="info-circle" theme="filled" style={{ color: '#22C2FE' }} />,
    });
  },

  warning(content) {
    message.open({
      className: styles.confirmBox,
      content,
      icon: <Icon type="question-circle" theme="filled" style={{ color: '#FFC96B' }} />,
    });
  },

  Ldconfirm(OkClick, title = '确认删除', message = '确认删除') {
    const modal = confirm({
      className: styles.confirmBox,
      content: (
        <div style={{ padding: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
              <img src={danger} alt="" style={{ width: '30px', marginRight: 10 }} />
              {title}
            </div>
            <div
              onClick={() => {
                modal.destroy();
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon type="close" />
            </div>
          </div>
          <div
            style={{
              textAlign: 'left',
              margin: '10px 0',
              fontSize: '14px',
              color: '#999',
              paddingLeft: '10px',
            }}
          >
            {message}
          </div>
          <OkAndCancel
            OkText="确定"
            CancelText="取消"
            OkClick={() => {
              OkClick();
              modal.destroy();
            }}
            CancelClick={() => {
              modal.destroy();
            }}
          />
        </div>
      ),
      icon: 'a',
    });
  },

  // 确认取消
  Ldcancel(OkClick, title = '确认取消', message = '确认取消') {
    const modal = confirm({
      className: styles.confirmBox,
      content: (
        <div style={{ padding: '5px 12px 12px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={danger} alt="" style={{ width: '30px', marginRight: 10 }} />
              {title}
            </div>
            <div
              onClick={() => {
                modal.destroy();
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon type="close" />
            </div>
          </div>
          <div style={{ textAlign: 'left', margin: '10px 0', fontSize: '14px', color: '#999' }}>
            {message}
          </div>
          <OkAndCancel
            OkText="确定"
            CancelText="取消"
            OkClick={() => {
              OkClick();
              modal.destroy();
            }}
            CancelClick={() => {
              modal.destroy();
            }}
          />
        </div>
      ),
      icon: 'a',
    });
  },

  /**
   * 驳回
   * @param OkClick
   * @param title
   * @constructor
   */

  Ldreject(OkClick, title = '确认驳回?') {
    const modal = confirm({
      className: styles.confirmBox,
      content: (
        <div style={{ padding: '5px 12px 12px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={danger} alt="" style={{ width: '30px', marginRight: 10 }} />
              {title}
            </div>
            <div
              onClick={() => {
                modal.destroy();
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon type="close" />
            </div>
          </div>
          <div style={{ textAlign: 'left', margin: '10px 0', fontSize: '14px', color: '#999' }}>
            <TextArea placeholder="请输入驳回理由..." id="text" />
          </div>
          <OkAndCancel
            OkText="确定"
            CancelText="取消"
            OkClick={() => {
              let text = document.getElementById('text').value;
              if (!text) {
                message.error('请输入驳回理由！');
              } else {
                OkClick(text);
                modal.destroy();
              }
            }}
            CancelClick={() => {
              modal.destroy();
            }}
          />
        </div>
      ),
      icon: 'a',
    });
  },
  /**
   * 忽略
   * @param OkClick
   * @param title
   * @constructor
   */

  Ldignore(OkClick, title = '确认忽略?') {
    const modal = confirm({
      className: styles.confirmBox,
      content: (
        <div style={{ padding: '5px 12px 12px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={danger} alt="" style={{ width: '30px', marginRight: 10 }} />
              {title}
            </div>
            <div
              onClick={() => {
                modal.destroy();
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon type="close" />
            </div>
          </div>
          <div style={{ textAlign: 'left', margin: '10px 0', fontSize: '14px', color: '#999' }}>
            <TextArea placeholder="请输入忽略理由..." id="text" />
          </div>
          <OkAndCancel
            OkText="确定"
            CancelText="取消"
            OkClick={() => {
              let text = document.getElementById('text').value;
              if (!text) {
                message.error('请输入忽略理由！');
              } else {
                OkClick(text);
                modal.destroy();
              }
            }}
            CancelClick={() => {
              modal.destroy();
            }}
          />
        </div>
      ),
      icon: 'a',
    });
  },
  /**
   * 备注
   * @param OkClick
   * @param title
   * @constructor
   */

  Ldnote(OkClick, title = '处理结果') {
    const modal = confirm({
      className: styles.confirmBox,
      content: (
        <div style={{ padding: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
              <img src={danger} alt="" style={{ width: '30px', marginRight: 10 }} />
              {title}
            </div>
            <div
              onClick={() => {
                modal.destroy();
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon type="close" />
            </div>
          </div>
          <div style={{ textAlign: 'left', margin: '10px 0', fontSize: '14px', color: '#999' }}>
            <TextArea placeholder="请输入备注..." id="text" />
          </div>
          <OkAndCancel
            OkText="确定"
            CancelText="取消"
            OkClick={() => {
              let text = document.getElementById('text').value;
              OkClick(text || null);
              modal.destroy();
            }}
            CancelClick={() => {
              modal.destroy();
            }}
          />
        </div>
      ),
      icon: 'a',
    });
  },

  // 配置
  // eslint-disable-next-line max-lines-per-function
  LdConfiguration(OkClick, title = '配置规则', communityVaule = [], communityTime, remark) {
    let selectValue = communityTime;

    const modal = confirm({
      className: styles.confirmBox,
      content: (
        <div style={{ padding: '5px 12px 20px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
              borderBottom: '1px solid #405465',
              paddingBottom: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
                paddingLeft: '10px',
              }}
            >
              {/* <img src={danger} alt="" style={{ width: '30px', marginRight: 10 }} /> */}
              {title}
            </div>
            <div
              onClick={() => {
                modal.destroy();
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon type="close" />
            </div>
          </div>
          <div className={styles.optionBox}>
            <div className={styles.optionText}>
              {/* <h3>预警时间设置</h3> */}
              <div className={styles.title}>
                <span>*</span>检测时长
              </div>
              <div className={styles.content}>
                <Radio.Group
                  onChange={e => {
                    selectValue = e.target.value;
                  }}
                  defaultValue={communityTime}
                >
                  <Radio value={0}>不检测</Radio>
                  {communityVaule
                    ? communityVaule.length > 0
                      ? communityVaule.map((item, index) => (
                          // <Option value={item.value} key={index} className={styles.optionSelect}>
                          //   {item.show}
                          // </Option>
                          <Radio value={item.value} key={index}>
                            {item.show}
                          </Radio>
                        ))
                      : null
                    : null}

                  {/* <Radio value={2}>没有同住人员</Radio> */}
                </Radio.Group>
              </div>
              {/* <Select
                defaultActiveFirstOption={false}
                placeholder={communityTime > 0 ? communityTime + '小时' : '请配置预警时间'}
                className={classNames(styles.selectDropdown)}
                dropdownClassName={'selectDropdown'}
                onChange={value => {
                  selectValue = value;
                }}
              >
                {communityVaule
                  ? communityVaule.length > 0
                    ? communityVaule.map((item, index) => (
                        <Option value={item.value} key={index} className={styles.optionSelect}>
                          {item.show}
                        </Option>
                      ))
                    : null
                  : null}
              </Select> */}
            </div>
            <div className={styles.optionText}>
              {/* <h3>备注</h3>
               */}
              <div className={styles.title}>
                <span style={{ visibility: 'hidden' }}>*</span>备注
              </div>
              <div className={styles.content}>
                <TextArea
                  placeholder={remark || '请输入备注'}
                  id="text"
                  className={styles.textAreaCss}
                />
              </div>
            </div>
          </div>
          <OkAndCancel
            OkText="确定"
            CancelText="取消"
            OkClick={() => {
              let text = document.getElementById('text').value;
              // let missDay = '';
              //
              // if (selectValue === 0) {
              //
              //   missDay = communityTime;
              //   message.error('请配置预警时间');
              //   return;
              // } else {
              //   missDay = selectValue;
              // }
              // if (!text && !remark) {
              //   message.error('请输入备注！');
              // } else {
              const data = {
                text: text || remark,
                selectValue,
              };

              OkClick(data);
              modal.destroy();
              // }
            }}
            CancelClick={() => {
              modal.destroy();
            }}
          />
        </div>
      ),
      icon: 'a',
    });
  },
  // 处理
  // eslint-disable-next-line max-lines-per-function
  LdDealWith(OkClick, title = '状态处理', communityVaule = [], communityTime = '请选择') {
    let selectValue = '';
    let time = [];
    const modal = confirm({
      className: styles.confirmBox,
      content: (
        <div style={{ padding: '5px 12px 12px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
              borderBottom: '1px solid #405465',
              paddingBottom: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
              }}
            >
              {title}
            </div>
            <div
              onClick={() => {
                modal.destroy();
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon type="close" />
            </div>
          </div>
          <div className={styles.optionBox}>
            <div className={styles.optionText}>
              <h3>处理类型</h3>
              <Select
                defaultActiveFirstOption={false}
                placeholder={communityTime}
                className={classNames(styles.selectDropdown)}
                dropdownClassName={'selectDropdown'}
                onChange={value => {
                  selectValue = value;
                }}
              >
                {communityVaule.length > 0
                  ? communityVaule.map((item, index) => (
                      <Option value={item.key} key={index} className={styles.optionSelect}>
                        {item.value}
                      </Option>
                    ))
                  : null}
              </Select>
            </div>
            <div className={styles.optionText}>
              <h3>暂住证编号</h3>
              <Input
                placeholder="请输入暂住证编号..."
                id="text"
                className={styles.inputText}
                style={{ background: '#2c3944', borderColor: '#344451' }}
              />
            </div>
            <div className={styles.optionText}>
              <h3>暂住证时效日期</h3>
              <RangePicker
                placeholder={['起始日期', '结束日期']}
                className={styles.inputText}
                format="YYYY-MM-DD"
                onChange={(value, dateString) => {
                  time = dateString;
                }}
              />
            </div>
          </div>
          <OkAndCancel
            OkText="确定"
            CancelText="取消"
            OkClick={() => {
              let text = document.getElementById('text').value;
              if (!selectValue) {
                message.error('请输入内容！');
              } else {
                const data = {
                  flowCardCode: text,
                  handlerStatus: selectValue,
                  startTime: time[0],
                  endTime: time[1],
                };
                OkClick(data);
                modal.destroy();
              }
            }}
            CancelClick={() => {
              modal.destroy();
            }}
          />
        </div>
      ),
      icon: 'a',
    });
  },
};
