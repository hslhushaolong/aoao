/**
 * kpi模版设置列表
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select, DatePicker, Button, Table } from 'antd';

import { authorize } from '../../../application';
import { CoreSearch, CoreContent } from '../../../components/core';
import transInt from './transInt';
import aoaoBossTools from './../../../utils/util';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,                   // 搜索的form
      districtLevelList: dot.get(props, 'operationManage.templateInfo.biz_district_level') || [], // 商圈等级
      // -----------------------------表单的值--------------------------------------
      citySpelling: [],                  // 城市
      kpiType: [],                       // kpi类型
      orderType: '',                     // 订单类型
      knightType: '',                    // 骑士类型
      baiduBizDistrictType: '60031',     // 商圈类型
      bizDistrictLevel: '',              // 商圈等级
      date: '',                          // 时间段
      // ------------------------------表单的值-------------------------------------
      dataSource: dot.get(props, 'operationManage.kpiRecord.data') || [],   // 表格数据
      isDisabled: false,                                        // 控制切换订单类型时，骑士类型是否可选
      placeholder: '请选择骑士类型',                              // select框的placeholder
      total: dot.get(props, 'operationManage.kpiRecord._meta.result_count') || 0,         // 表格数据总条数
    };
  }

  // 收到参数前生命周期
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'operationManage.kpiRecord.data') || [],
      total: dot.get(nextProps, 'operationManage.kpiRecord._meta.result_count') || 0,
      districtLevelList: dot.get(nextProps, 'operationManage.templateInfo.biz_district_level') || [], // 商圈等级
    });
  }

  // 新建kpi模版导航路由
  onDirctToCreate = () => {
    window.location.href = '/#/Handle/buildKpi';
  }

  // 去详情页
  onDirectDetail = (detail) => {
    window.location.href = `/#/Handle/detailKpi?id=${detail}`;
  }

  // 去编辑页
  onDirectEdit = (edit) => {
    window.location.href = `/#/Handle/editKpi?id=${edit}`;
  }

  // 换页
  tableChange = (page, size) => {
    const params = this.state.form.getFieldsValue();
    if (params.date == undefined) {
      delete params.date;
    } else {
      params.start_date = params.date[0] && aoaoBossTools.prctoMinuteDay(params.date[0]._d);
      params.end_date = params.date[1] && aoaoBossTools.prctoMinuteDay(params.date[1]._d);
    }
    // antd bug 判断骑士类型是否为空
    if (params.knight_type === null) {
      delete params.knight_type;
    }
    params.page = page;
    params.limit = 30;
    params.account_id = authorize.account.id;
    delete params.date;
    this.props.dispatch({
      type: 'operationManage/kpiTemplateListE',
      payload: params,
    });
  }

  // 更换城市
  onChangeCitySpelling = (e) => {
    this.setState({ citySpelling: e });
  }

  // 更换订单类型
  onChangeOrderType = (e) => {
    // 限时达-60011
    if (e === '60011') {
      this.setState({ placeholder: '无法选择骑士类型', isDisabled: true });
      this.state.form.setFieldsValue({ knight_type: null });
    } else { // 定时达-60010
      this.setState({ isDisabled: false, placeholder: '请选择骑士类型' });
    }
  }

  // 更换骑士类型
  onChangeKnightType = (e) => {
    this.setState({ knightType: e });
  }

// 更换商圈类型
  onChangeDistrict = (e) => {
    this.setState({ baiduBizDistrictType: e });
  }

  // 更换商圈等级
  onChangeDistrictLevel = (e) => {
    this.setState({ bizDistrictLevel: e });
  }

// 更换时间
  onChangeDate = (e) => {
    this.setState({ date: e });
  }

  // 更黄kpi类型
  onChangeKpiType = (e) => {
    this.setState({ kpiType: e });
  }

  // 重置
  onReset = () => {
    // 刷新列表
    this.state.form.resetFields();
  }

  // 搜索
  onSearch = () => {
    const params = this.state.form.getFieldsValue();
    // antd 搜索bug 清除数据不是undefined
    if (params.date == undefined) {
      delete params.date;
    } else {
      params.start_date = params.date[0] && aoaoBossTools.prctoMinuteDay(params.date[0]._d);
      params.end_date = params.date[1] && aoaoBossTools.prctoMinuteDay(params.date[1]._d);
    }
    // antd 搜索bug 清除数据不是undefined 骑士类型
    if (params.knight_type === null) {
      delete params.knight_type;
    }
    // antd 搜索bug 清除数据不是undefined kpi模版类型
    if (params.kpi_type) {
      params.kpi_type = params.kpi_type.map(item => (
        parseInt(item)
      ));
    }
    params.page = 1;
    params.limit = 30;
    params.account_id = authorize.account.id;
    delete params.date;
    this.props.dispatch({
      type: 'operationManage/kpiTemplateListE',
      payload: params,
    });
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const { total, districtLevelList } = this.state;
    const cities = authorize.cities(['baidu']);
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform_code_list', { initialValue: 'baidu' })(
          <Select allowClear placeholder="请选择平台">
            <Option value="baidu" key="baidu">百度</Option>
          </Select>,
        )),
      },
      {
        label: 'kpi类型',
        form: form => (form.getFieldDecorator('kpi_type')(
          <Select allowClear placeholder="请选择kpi类型" mode="multiple" onChange={this.onChangeKpiType}>
            <Option value="60081" key="60081">N-X3设置</Option>
            <Option value="60082" key="60082">kpi扣罚项</Option>
          </Select>,
        )),
      },
      {
        label: '城市',
        form: form => (form.getFieldDecorator('city_spelling')(
          <Select allowClear placeholder="请选择城市" mode="multiple" onChange={this.onChangeCitySpelling}>
            {
              cities.map(item => (
                <Option value={item.id} key={item.id}>{item.description}</Option>
              ))
            }
          </Select>,
        )),
      },
      {
        label: '订单类型',
        form: form => (form.getFieldDecorator('order_type')(
          <Select allowClear placeholder="请选择订单类型" onSelect={this.onChangeOrderType}>
            <Option value="60010" key="60010">定时达</Option>
            <Option value="60011" key="60011">限时达</Option>
          </Select>,
        )),
      },
      {
        label: '骑士类型',
        form: form => (form.getFieldDecorator('knight_type')(
          <Select
            allowClear
            disabled={this.state.isDisabled}
            placeholder={this.state.placeholder}
            onChange={this.onChangeKnightType}
          >
            <Option value="60020" key="60020">白班</Option>
            <Option value="60021" key="60021">夜班</Option>
            <Option value="60022" key="60022">不区分</Option>
          </Select>,
        )),
      },
      {
        label: '商圈类型',
        form: form => (form.getFieldDecorator('baidu_biz_district_type')(
          <Select allowClear placeholder="请选择商圈类型" onChange={this.onChangeDistrict}>
            <Option value="60031" key="60031">独家</Option>
            <Option value="60032" key="60032">非独家</Option>
            <Option value="60033" key="60033">无商圈类型</Option>
          </Select>,
        )),
      },
      {
        label: '商圈等级',
        form: form => (form.getFieldDecorator('biz_district_level')(
          <Select allowClear placeholder="请选择商圈等级" onChange={this.onChangeDistrictLevel}>
            {
              districtLevelList.map(item => (
                <Option value={item.name} key={item._id}>{item.name}级</Option>
              ))
            }
          </Select>,
        )),
      },
      {
        label: '申请创建日期',
        form: form => (form.getFieldDecorator('date')(
          <RangePicker onChange={this.onChangeDate} />,
        )),
      },
    ];
    const props = {
      items,
      expand: true,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };
    const columns = [{
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
    }, {
      title: 'kpi类型',
      dataIndex: 'kpi_type',
      key: 'kpi_type',
      render: (text) => {             // 60081 N-X3设置 60082 kpi扣罚项
        return (<span>{text === 60081 ? 'N-X3设置' : 'kpi扣罚项'}</span>);
      },
    }, {
      title: '商圈类型',
      dataIndex: 'baidu_biz_district_type',
      key: 'baidu_biz_district_type',
      render: (text) => {
        return transInt(text);
      },
    }, {
      title: '商圈等级',
      dataIndex: 'biz_district_level',
      key: 'biz_district_level',
    }, {
      title: '订单类型',
      dataIndex: 'order_type',
      key: 'order_type',
      render: (text) => {
        return transInt(text);
      },
    }, {
      title: '骑士类型',
      dataIndex: 'knight_type',
      key: 'knight_type',
      render: (text) => {
        return transInt(text);
      },
    }, {
      title: '生效日期',
      dataIndex: 'entry_into_force_date',
      key: 'entry_into_force_date',
    }, {
      title: '创建日期',
      dataIndex: 'date',
      key: 'date',
    }, {
      title: '使用状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return transInt(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        return (
          <div>
            <a style={{ color: '#FF7700' }} onClick={() => { this.onDirectDetail(record._id); }}>详情</a>
            <a style={{ color: '#FF7700', marginLeft: '10px' }} onClick={() => { this.onDirectEdit(record._id); }}>编辑</a>
          </div>
        );
      },
    }];

    return (
      <div>
        <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
          <CoreSearch {...props} />
        </CoreContent>
        <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.onDirctToCreate}>新建KPI模版</Button>
        <Table
          dataSource={this.state.dataSource} columns={columns} rowKey={(record, index) => {
            return index;
          }}
          pagination={{
            defaultPageSize: 30,
            onChange: this.tableChange,
            total,
            showQuickJumper: true,
          }}
          bordered
        />
      </div>
    );
  };
}

function mapStateToProps({ operationManage }) {
  return { operationManage };
}
export default connect(mapStateToProps)(Search);
