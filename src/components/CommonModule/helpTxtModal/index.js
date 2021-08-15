import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Upload, Icon, message } from 'antd';
import LdButton from '@/components/My/Button/LdButton';
import LdTable from '@/components/My/Table/LdTable';
import store from 'store';
import Message from '@/components/My/Message';
const { Ldconfirm } = Message;
@connect(({ commonModel: { txtList }, loading, app: { buttonUse } }) => ({
  txtList,
  loading,
  buttonUse,
}))
class helpTxtModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      disable: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  renderTable() {
    const { buttonUse } = store.get('buttonData');
    let buttonShow = buttonUse || this.props.buttonUse;

    const columns = [
      {
        title: '文件名称',
        dataIndex: 'name',
        align: 'center',
        width: '50%',
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        width: '50%',
        render: (text, record) => (
          <div>
            <LdButton
              type="centerIcon"
              onClick={this.downloadTxt.bind(this, record.id, record.name)}
              title="下载"
              icon="download"
            />
            {buttonShow && buttonShow.filter(item => item.name === '帮助中心-删除')[0] ? (
              <LdButton
                type="deleteIcon"
                title="删除"
                icon="delete"
                onClick={this.deleteTxt.bind(this, record.id)}
              />
            ) : null}
          </div>
        ),
      },
    ];
    let tableData = this.props.txtList;
    return (
      <LdTable
        type="helpTable"
        columns={columns}
        dataSource={tableData || null}
        scroll={{ y: '100%' }}
        pagination={false}
      />
    );
  }

  render() {
    const { buttonUse } = store.get('buttonData');
    let buttonShow = buttonUse || this.props.buttonUse;

    return (
      <div className={styles.Upload}>
        {buttonShow && buttonShow.filter(item => item.name === '帮助中心-上传')[0] ? (
          <div className={styles.Dragger}>
            <Upload.Dragger onChange={this.onChange} beforeUpload={this.beforeUpload} name="file">
              <p>文件大小不能超过100M（仅支持上传文档、表格、ppt、图片、视频文件）</p>
              <LdButton type="masterButton">
                <Icon type="upload" /> 上传手册
              </LdButton>
            </Upload.Dragger>
          </div>
        ) : null}
        {this.renderTable()}
      </div>
    );
  }

  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModel/getTxt',
    });
  };

  setFileUrl = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModel/uploadTxt',
      payload: formData,
    }).then(res => {
      if (res.success) {
        message.success(`文件上传成功`);
        dispatch({
          type: 'commonModel/getTxt',
        });
      }
    });
  };

  onChange = info => {
    if (info.file.status !== 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  beforeUpload = file => {
    if (file.size > 104857600) {
      message.error('文件大于100MB');
      return;
    }
    const repeatingFile = this.props.txtList.find(item => file.name === item.name);
    if (!repeatingFile) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'HELP');
      this.setFileUrl(formData);
    } else {
      Ldconfirm(
        data => {
          const formData = new FormData();
          formData.append('file', file);
          this.setFileUrl(formData);
        },
        '覆盖',
        '确认覆盖已存在文件？',
      );
    }

    return false;
  };

  deleteTxt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModel/deleteTxt',
      payload: { id },
    }).then(res => {
      if (res.success) {
        message.success('删除成功');
        dispatch({
          type: 'commonModel/getTxt',
        });
      }
    });
  };

  downloadTxt = (id, name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonModel/exportTxt',
      payload: { id },
      name,
    });
  };
}

export default helpTxtModal;
