/**
 * 上传kpi
 * */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import {
  Table,
  Button,
  Select,
  DatePicker,
  Tooltip,
} from 'antd';
import styles from './upload.less';
import ModalPage from './upload';                        // 上传弹窗页面
import aoaoBossTools from './../../utils/util';
import { CoreSearch, CoreContent } from './../../components/core';
import { authorize } from '../../application';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [                                         // 列
        {
          title: '所属时间',
          dataIndex: 'date',
          render: (text, record) => {
            return (
              <div>{`${record.start_date} ~ ${record.end_date}`}</div>
            );
          },
        }, {
          title: '文件名称',
          dataIndex: 'filename',
          key: 'filename',
        }, {
          title: '所属类型',
          dataIndex: 'template_type',             // 所属类型
          key: 'template_type',                   // 所属类型
          render: (text, record) => {
            // template_type 所属类型 60070 运力计划 60071 kpi日报 60072kpi准确结果
            let name = 'kpi日报';
            // kpi日报
            if (text === 60071) {    // kpi日报
              name = 'kpi日报';
              // kpi准确结果
            } else if (text === 60072) {   // kpi准确结果
              name = 'kpi准确结果';
            } else {
              name = '运力计划';                  // 60070
            }
            return (
              <span>{name}</span>
            );
          },
        },
        {
          title: '上传时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (text) => {
            // 亚军的时间转换函数
            return (
              <span>{aoaoBossTools.prctoMinute(text, 3)}</span>
            );
          },
        }, {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          render: (text, record) => {
            return (
              <div>
                {this.translateState(record)}
              </div>
            );
          },
        }, {
          title: '操作',
          dataIndex: 'delivery_income',
          key: 'delivery_income',
          render: (text, record) => {
            return (
              <div>
                {record.state === 60061 ?              // 60061文件审核通过 是否成功，成功才可以下载
                  <div>
                    <a href={`${record.url}`} download>
                      <span className="systemTextColor">下载</span>
                    </a>
                  </div> : <div>
                    <span>{record.error_msg}</span>
                  </div>
                }
              </div>
            );
          },
        },
      ],
      dataSource: dot.get(props, 'operationManage.uploadRecord.data') || [],                // 文件列表
      visible: false,                                                     // 弹窗出现隐藏
      title: '添加文件',                                                   // 弹窗主题
      loading: false,
      total: dot.get(props, 'operationManage.uploadRecord._meta.result_count') || 0,       // 总数据数
      token: dot.get(props, 'operationManage.token'),                                 // 七牛token
      path: dot.get(props, 'operationManage.path'),                                   // 七牛key
      values: '',
      // 保存时间
      date: [
        { _d: '--' }, // 申请创建开始日期 ‘yyyy-mm-dd’
        { _d: '--' }, // 申请创建结束日期 'yyyy-mm-dd'
      ],
      file: {                                                             // 保存文件
        file: {
          name: '',
        },
      },
      fileDetail: dot.get(props, 'operationManage.fileDetail'),                      // 新功能需要，目前没什么用
      checkDetail: false,                                                // 读取excel窗口功能开关，这期不做

      form: undefined,                                                   // 搜索的form
      searchPreset: {                                                    // 搜索项里的级联选项
        platform: [{ value: 'elem', name: '饿了么' }, { value: 'meituan', name: '美团' }, { value: 'baidu', name: '百度' }],   // 平台
        type: [{ value: '60071', name: 'KPI日报' }, { value: '60072', name: 'KPI准确结果' }],                                  // 类型
      },
      search: {                                                          // 记录搜索
        platform: 'elem',                                                // 平台
        type: '60071',                                                   // 类型
      },
      apiLoadingMessage: '下载模版',                                      // api模版下载按钮提示文字
      getKpiUpload: dot.get(props, 'operationManage.getKpiUpload'),                  // 下载模版
      apiButton: false,                                                  // 控制下载api按钮是否隐藏
      platform_code: 'elem',                                             // 记录翻页时的商圈
      template_type: '60071',                                            // 记录翻页时的平台,  kpi日报
      task_id: dot.get(props, 'operationManage.task_id'),                // 记录task_id
      apiLoading: false,                                                 // 下载api模版等待时间
      downloadButton: '点击生成模版',                                      // 下载api模版按钮文字
    };
  }

  // 监控是否可以自动下载kpi模版
  componentDidUpdate = () => {
    // 如果文件审核通过就自动下载
    if (dot.get(this, 'state.getKpiUpload.state') === 60051) {   // 文件审核通过
      window.location = dot.get(this, 'state.getKpiUpload.url');
      this.props.dispatch({
        type: 'operationManage/closeUploadKpiR',
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'operationManage.uploadRecord.data') || [],
      token: dot.get(nextProps, 'operationManage.token'),
      path: dot.get(nextProps, 'operationManage.path'),
      fileDetail: dot.get(nextProps, 'operationManage.fileDetail'),
      total: dot.get(nextProps, 'operationManage.uploadRecord._meta.result_count') || 0,
      getKpiUpload: dot.get(nextProps, 'operationManage.getKpiUpload'),
      task_id: dot.get(nextProps, 'operationManage.task_id'),
    });
  }

// 转换列表state字段为显示项，接口kpi/get_upload_record
  translateState = (record) => {
    // 成功  列表展示数据，上传成功是列表state状态，不是文件的上传进度，当心！
    if (record.state === 60061) {                     // 成功
      return (
        <span>上传成功</span>
      );
    // 审核中 列表展示数据，上传成功是列表state状态，不是文件的上传进度，当心！
    } else if (record.state === 60060) {             // 审核中
      return (
        <span>审核中</span>
      );
    // -60061 失败 列表展示数据，上传成功是列表state状态，不是文件的上传进度，当心！
    } else {
      return (
        <Tooltip placement="topLeft" title={record.error_msg}>
          <span>上传失败</span>
        </Tooltip>
      );
    }
  }

  // 下载模版
  getKpiUpload = () => {
    const that = this;
    setTimeout(() => {
      that.setState({
        apiLoading: true, // loading图标
        downloadButton: '模版正在生成中',
      });
    }, 0);

    // 生成模版
    this.props.dispatch({
      type: 'operationManage/createUploadKpiE',
      payload: {
        account_id: authorize.account.id,
      },
    });
    setTimeout(() => {
      // 3秒后获取模版
      that.props.dispatch({
        type: 'operationManage/getUploadKpiE',
        payload: {
          account_id: authorize.account.id,
          task_id: that.state.task_id,
        },
      });
      that.setState({
        apiLoading: false,
        downloadButton: '点击生成模版',
      });
    }, 3000);
  }

  // 弹窗显示
  showModal = () => {
    this.setState({ visible: true });
  };

  // 切换页面
  tableChange = (page, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationManage/getUploadRecordE',
      payload: {
        account_id: authorize.account.id,
        platform_code: this.state.platform_code,
        template_type: this.state.template_type,
        page,
        limit: 30,
      },
    });
  }

  // 弹窗确认上传事件
  handleOk = (values) => {
    values.account_id = authorize.account.id;    // 账户id
    values.ascription_date = `${aoaoBossTools.prctoMinuteDay(values.date[0]._d)}~${aoaoBossTools.prctoMinuteDay(values.date[1]._d)}`;   // 选择生效日期
    values.filename = values.file.file.name;    // 获得文件名
    // 运力计划 根据模版渲染不同的平台选择项
    if (values.template_type === '60070') {   // 运力计划
      this.setState({
        searchPreset: {
          platform: [{ value: 'elem', name: '饿了么' }, { value: 'meituan', name: '美团' }, { value: 'baidu', name: '百度' }],   // 平台
          type: [{ value: '60070', name: '运力计划' }],       // 类型
        },
        search: {
          platform: 'baidu',      // 平台
          type: '60070',          // 类型
        },
        apiButton: false,
      });
    // kpi日报 根据模版渲染不同的平台选择项
    } else if (values.template_type === '60071') {   // kpi日报
      this.setState({
        searchPreset: {
          platform: [{ value: 'elem', name: '饿了么' }, { value: 'meituan', name: '美团' }, { value: 'baidu', name: '百度' }],   // 平台
          type: [{ value: '60071', name: 'KPI日报' }, { value: '60072', name: 'KPI准确结果' }],       // 类型
        },
        search: {
          platform: 'elem',       // 平台
          type: '60071',          // 类型
        },
        apiButton: false,
      });
    } else {   // 60072 kpi准确结果
      this.setState({
        searchPreset: {
          platform: [{ value: 'elem', name: '饿了么' }, { value: 'meituan', name: '美团' }, { value: 'baidu', name: '百度' }],   // 平台
          type: [{ value: '60071', name: 'KPI日报' }, { value: '60072', name: 'KPI准确结果' }],       // 类型
        },
        search: {
          platform: 'elem',       // 平台
          type: '60072',          // 类型
        },
        apiButton: false,
      });
    }
    // 上传之后关闭弹窗
    this.setState({ values,
      loading: false,
      visible: false,
      date: values.date,
      file: values.file,
      platform_code: values.platform_code,
      template_type: values.template_type,  // kpi模版类型
      search: {
        platform: values.platform_code,
        type: values.template_type,         // 平台
      },
    });

    const { dispatch } = this.props;
    values.target_id = this.state.path;
    delete values.date;
    delete values.file;
    const search = {};
    search.platform_code = values.platform_code;
    search.template_type = parseInt(values.template_type);
    values.template_type = search.template_type;
    // 往后台上传文件
    dispatch({ type: 'operationManage/postCheckFileDetailE', payload: { payload: values, search } });
  };

  // 弹窗取消事件
  handleCancel = () => {
    this.setState({ visible: false });
  };

  // 获取七牛的token
  getQINIUToken = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'operationManage/getUploadTokenE', payload: params });   // path token
  };

  // 重置搜索表单
  onReset = (value) => {
    this.setState({
      searchPreset: {
        platform: [{ value: 'elem', name: '饿了么' }, { value: 'meituan', name: '美团' }, { value: 'baidu', name: '百度' }],   // 平台
        type: [{ value: '60071', name: 'KPI日报' }, { value: '60072', name: 'KPI准确结果' }],       // 类型
      },
      search: {
        platform: 'elem',       // 平台
        type: '60071',          // 类型 kpi日报
      },
    });
    this.state.form.resetFields();
  }

  // 点击搜索
  onSearch = () => {
    const result = this.state.form.getFieldsValue();
    const params = {};
    params.platform_code = result.platform_code;
    params.template_type = result.template_type;
    params.account_id = authorize.account.id;
    params.limit = 30;
    params.page = 1;
    const start_date = (result.date && aoaoBossTools.prctoMinuteDay(result.date[0]._d)) || '';
    const end_date = (result.date && aoaoBossTools.prctoMinuteDay(result.date[1]._d)) || '';
    if (result.date !== undefined) {
      params.date = `${start_date}~${end_date}`;
    }
    this.setState({
      platform_code: params.platform_code,
      template_type: params.template_type,
    });
    if (params.platform_code === 'meituan') {
      delete params.template_type;
    }
    this.props.dispatch({
      type: 'operationManage/getUploadRecordE',
      payload: params,
    });
  }

  // 搜索组件钩子，把form提出来
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 更改平台回调，不同平台对应的类型不一样
  onChangePlatform = (value) => {
    if (value === 'elem') {
      this.setState({
        searchPreset: {
          platform: [{ value: 'elem', name: '饿了么' }, { value: 'meituan', name: '美团' }, { value: 'baidu', name: '百度' }],   // 平台
          type: [{ value: '60071', name: 'KPI日报' }, { value: '60072', name: 'KPI准确结果' }],       // 类型
        },
        search: {
          platform: 'elem',       // 平台
          type: '60071',          // 类型 kpi 日报
        },
        apiButton: false,
      });
    } else if (value === 'meituan') {
      this.setState({
        searchPreset: {
          platform: [{ value: 'elem', name: '饿了么' }, { value: 'meituan', name: '美团' }, { value: 'baidu', name: '百度' }],   // 平台
          type: [{ value: 'none', name: '暂无' }],          // 类型
        },
        search: {
          platform: 'meituan',    // 平台
          type: 'none',           // 类型
        },
        apiButton: false,
      });
    } else if (value === 'baidu') {
      this.setState({
        searchPreset: {
          platform: [{ value: 'elem', name: '饿了么' }, { value: 'meituan', name: '美团' }, { value: 'baidu', name: '百度' }],   // 平台
          type: [{ value: '60070', name: '运力计划' }],       // 类型 运力计划
        },
        search: {
          platform: 'baidu',      // 平台
          type: '60070',          // 类型 运力计划
        },
        apiButton: true,
      });
    }
    this.state.form.resetFields();
  }

  render() {
    const { dispatch } = this.props;
    const props = {
      visible: this.state.visible,
      title: this.state.title,
      content: this.state.content,
      loading: this.state.loading,
      token: this.state.token,
      path: this.state.path,
      dispatch,
    };

    const { total } = this.state;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform_code', { initialValue: dot.get(this, 'state.search.platform') })(
          <Select placeholder="请选择平台" onChange={this.onChangePlatform} allowClear>
            {
              dot.get(this, 'state.searchPreset.platform', []).map((item) => {
                return (<Option value={item.value} key={item.value}>{item.name}</Option>);
              })
            }
          </Select>,
       )),
      },
      {
        label: '类型',
        form: form => (form.getFieldDecorator('template_type', { initialValue: dot.get(this, 'state.search.type') })(
          <Select placeholder="请选择类型" allowClear>
            {
              dot.get(this, 'state.searchPreset.type', []).map((item) => {
                return (<Option value={item.value} key={item.value}>{item.name}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '上传时间',
        form: form => (form.getFieldDecorator('date')(<RangePicker />)),
      },
    ];
    const searchProps = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };
    // 检测是否有百度权限
    const hasBaidu = authorize.hasPlatform('baidu');

    return (
      <div className={styles.upload}>
        <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
          <CoreSearch {...searchProps} />
        </CoreContent>
        <Button style={{ marginBottom: '10px', marginRight: '10px' }} type="primary" className="mgt8" onClick={this.showModal}>添加文件</Button>
        {
          // 检测是否有百度权限，只有百度权限才能下载模版
          (this.state.apiButton && hasBaidu) ? <Button type="primary" className="mgt8" onClick={this.getKpiUpload} disabled={this.state.apiLoading}>{this.state.downloadButton}</Button> : ''
        }
        <Table
          pagination={{
            defaultPageSize: 30,
            onChange: this.tableChange,
            total,
            showQuickJumper: true,
          }}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          rowKey={(record, index) => { return index; }}
          bordered
        />
        <div className="textCenter">
          <ModalPage {...props} handleCancel={this.handleCancel} handleOk={this.handleOk} getQINIUtoken={this.getQINIUToken} />
        </div>
      </div>
    );
  }
}
function mapStateToProps({ operationManage }) {
  return { operationManage };
}
export default connect(mapStateToProps)(Upload);
