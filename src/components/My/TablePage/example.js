import React, { PureComponent } from 'react';
import LdTablePage from '@/components/My/TablePage';
import Img from '@/components/My/Img';

class Attempt extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.tableFrom = null;
  }
  // eslint-disable-next-line max-lines-per-function
  render() {
    const options = {
      items: [
        {
          type: 'input',
          placeholder: '请输入内容',
          rules: [{ required: true, message: '请输入内容！' }],
          field: 'value',
        },
        {
          type: 'select',
          defaultActiveFirstOption: true,
          placeholder: '请选择',
          optionFilterProp: 'children',
          children: [],
          field: 'sss',
          showSearch: false,
        },
        {
          type: 'cascader',
          placeholder: '请选择',
          showSearch: { filter: this.filter },
          displayRender: this.displayRender,
          field: '333',
          changeOnSelect: true,
        },
        {
          type: 'datePicker',
          placeholder: '请选择',
          disabledDate: () => this.onClick(),
          field: '4444',
          format: 'YYYY/MM/DD',
        },
        {
          type: 'rangePicker',
          // placeholder: '请选择',
          onChange: () => this.onClick(),
          field: 'time',
          showTime: false,
        },
      ],
      actions: [
        {
          type: 'export',
          onClick: () => this.onClick(),
          title: '导出',
          style: { marginLeft: '0', marginRight: '14px' },
        },
        {
          type: 'delete',
          onClick: () => this.onClick(),
          title: '删除',
          disabled: true,
          style: { marginLeft: '0', marginRight: '14px' },
        },
        {
          type: 'plus',
          onClick: () => this.onClick(),
          title: '新增',
          style: { marginLeft: '0' },
        },
      ],
      columns: [
        {
          title: '车牌号',
          dataIndex: 'carNo',
          width: '10%',
        },
        {
          title: '登记照',
          dataIndex: 'image',
          width: '10%',
          render: (text, record) => (
            <Img
              image={text}
              defaultImg={require('@/assets/images/guanzhucheliang.png')}
              className={'tableImg'}
            />
          ),
        },
        {
          title: '所属小区',
          dataIndex: 'villageName',
          width: '12%',
        },
        {
          title: '车主姓名',
          dataIndex: 'name',
          width: '10%',
        },

        {
          title: '车主电话',
          dataIndex: 'phone',
          width: '12%',
        },
        {
          title: '登记时间',
          dataIndex: 'createTime',
        },
      ],
      searchType: 'select', // 默认蓝色确定
      searchTitle: '查找', // 默认确定
      onSubmit: this.onSubmit,
      resetClick: () => this.onClick(),
      type: 'myTable',
      dataSource: [
        {
          brand: '宝马',
          carId: 1845,
          carNo: '浙C20650',
          color: '白色',
          createTime: '2020-04-14',
          id: 1858,
          idCard: '445300196402275155',
          image: '/image-service/carInfo/20200414/382.jpg',
          name: '东省云',
          phone: '15252525252',
          spec: 'X1',
          type: '99',
          typeStr: '',
          villageId: 3,
          villageName: '上垟嘉园',
        },
      ],
      loading: false,
      pagination: {
        position: 'bottom',
        total: 0,
        // showTotal: (total, range) => `${range[1] - range[0] + 1}条/页， 共 ${total} 条`,
        // pageSize: tableData ? tableData.size : 0,
        pageSize: 10,
        defaultCurrent: 1,
        // onChange: this.onChangePage,
        current: 1,
        // onShowSizeChange: this.onShowSizeChange,
        showSizeChanger: true,
      },
      onGetFormRef: form => {
        this.tableFrom = form;
      },
    };
    return <LdTablePage {...options} />;
  }

  onSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    this.tableFrom.validateFields(async (err, fieldsValue) => {
      console.log('err, fieldsValue: ', err, fieldsValue);
    });
  };

  onClick = () => {};

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      if (i === labels.length - 1) {
        return <span key={option.value}>{label}</span>;
      }
      return <span key={option.value}> </span>;
    });
}

export default Attempt;
