import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Form, Row, Col, PageHeader, message } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import FormSimple from '@/components/My/Form';
import { connect } from 'dva';
import styles from './index.less';

@connect(state => {
  const { loading } = state;
  // 这里return出去的数据，会变成此组件的props，在组件可以通过props.num取到。props变化了，会重新触发render方法，界面也就更新了。
  return {
    loading,
  };
})
class UpdateHistory extends PureComponent {
  historyForm;
  constructor(props) {
    super(props);
    this.state = {
      rich: '',
    };
  }

  componentDidMount() {}

  renderPageHeader() {
    return (
      <div className={styles.myPageHeader}>
        <PageHeader className={classNames('borderBottom')} title="历史版本" />
      </div>
    );
  }

  renderAddForm() {
    const extendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview,
      },
    ];
    const props = {
      items: [
        {
          field: 'version',
          type: 'input',
          placeholder: '版本号',
          span: 6,
          height: 'auto',
          rules: [{ required: true, message: '请输入版本号' }],
        },
        {
          placeholder: '公告内容',
          type: 'custom',
          height: 'auto',
          span: 24,
          render: getFieldDecorator => {
            return (
              <Form.Item>
                {getFieldDecorator('richContent', {
                  validateTrigger: 'onChange',
                  rules: [
                    {
                      required: true,
                      validator: (_, value, callback) => {
                        if (value.isEmpty()) {
                          callback(new Error('请输入版本更新内容'));
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <BraftEditor
                    className={styles.editor}
                    contentStyle={{
                      height: '700',
                      background: ' #394855',
                      flex: 'auto',
                      overflow: 'auto',
                      color: '#fff',
                    }}
                    excludeControls={['media', 'blockquote', 'code']}
                    extendControls={extendControls}
                    // controls={controls}
                    placeholder={'请输入版本更新内容'}
                  />,
                )}
              </Form.Item>
            );
          },
        },
      ],
      actions: [
        {
          type: 'secondButton',
          title: '保存',
          htmlType: 'submit',
        },
      ],
      onSubmit: this.submit,
      onGetFormRef: form => {
        this.historyForm = form;
      },
    };
    return <FormSimple {...props} />;
  }

  render() {
    return (
      <div
        className={classNames('paddingSm', 'bgThemeColor', 'flexColStart', 'height100')}
        style={{ overflow: 'auto' }}
      >
        <Row>
          <Col>{this.renderPageHeader()}</Col>
        </Row>
        <div
          className={classNames('bgThemeHeightColor', 'flexAuto', 'flexColBetween', styles.form)}
        >
          {this.renderAddForm()}
        </div>
      </div>
    );
  }

  preview = () => {
    if (this.previewWindow) {
      this.previewWindow.close();
    }

    this.previewWindow = window.open();
    this.previewWindow.document.write(this.buildPreviewHtml());
    this.previewWindow.document.close();
  };

  buildPreviewHtml = () => {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.historyForm.getFieldValue('richContent').toHTML()}</div>
        </body>
      </html>
    `;
  };

  submit = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch } = this.props;

    this.historyForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      fieldsValue.richContent = fieldsValue.richContent.toHTML();
      const res = await dispatch({
        type: 'updateHistoryModel/addVersionHistory',
        payload: fieldsValue,
      });
      if (res && res.success) {
        message.success('保存成功');
      } else {
        message.error(res.message);
      }
    });
  };
}

UpdateHistory.propTypes = {};
export default UpdateHistory;
