/**
 * 骑士补款，创建或编辑
*/
import React, { Component } from 'react';
import dot from 'dot-prop';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, Table, DatePicker, Popconfirm, Modal, Icon, message } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';

import { KnightSalaryType, Position, FillingType, FillingEventType, DeductSubmitType, DutyState, renderReplaceAmount } from '../../../../../application/define';
import Modules from '../../../../../application/define/modules';
import { CoreContent } from '../../../../../components/core';
import { authorize } from '../../../../../application';
import ExcelModal from '../../component/modal';
import Statistic from '../../component/statistic';

const [FormItem, Option] = [Form.Item, Select.Option];

const object = {
  平台: 'platform',
  城市: 'city',
  商圈: 'district',
  骑士姓名: 'knight',
  补款项目: 'cut_event',
  补款金额: 'cut_amount',
  原因: 'cut_subsidy_other_cause',
  getItem(key) {
    if (object.hasOwnProperty(key)) {
      return object[key];
    }
  },
};

class Create extends Component {
  constructor(props) {
    super(props);
    // 默认获取当前账户的第一条平台数据
    let platform;
    if (dot.has(authorize.platform(), '0.id')) {
      platform = dot.get(authorize.platform(), '0.id');
    }
    // 设置路由跳转监控
    // const { router, route } = this.props;
    // const removeRouteLeaveHook = router.setRouteLeaveHook(route, () => { return '内容未保存，确定离开页面？'; });
    this.state = {
      columns: [{
        title: '平台',
        dataIndex: 'platform',
        key: 'platform',
        width: '8%',
        align: 'center',
        render: (text, record, tIndex) => {
          return (
            <Select
              value={record.platform} placeholder="请选择平台" style={{ width: '95px' }} onChange={(...arg) => {
                this.onTablePlatformChange(...arg, tIndex);
              }
              }
            >
              {
                authorize.platform().map((item, index) => {
                  const key = item.id + index;
                  return (<Option value={`${item.id}`} key={key}>{item.name}</Option>);
                })
              }
            </Select>
          );
        },
      }, {
        title: '城市',
        dataIndex: 'city',
        key: 'city',
        width: '10%',
        align: 'center',
        render: (text, record, tIndex) => {
          return (
            <Select
              allowClear showSearch optionFilterProp="children" value={record.city} placeholder="请选择城市" style={{ width: '110px' }} onChange={(...arg) => {
                this.onTableCityChange(...arg, tIndex);
              }}
            >
              {
                authorize.cities(record.platform).map((item, index) => {
                  const key = item + index;
                  return (<Option value={`${item.id}`} key={key}>{item.description}</Option>);
                })
              }
            </Select>
          );
        },
      }, {
        title: '商圈',
        dataIndex: 'district',
        key: 'district',
        width: '14%',
        align: 'center',
        render: (text, record, tIndex) => {
          return (
            <Select
              allowClear showSearch optionFilterProp="children" value={record.district} placeholder="请选择商圈" style={{ width: '140px' }} onChange={(...arg) => {
                this.onTableDistrictChange(...arg, tIndex);
              }}
            >
              {
                authorize.districts(record.city).map((item, index) => {
                  return <Option key={index} value={item.id}>{item.name}</Option>;
                })
              }
            </Select>
          );
        },
      }, {
        title: '骑士',
        dataIndex: 'knight',
        key: 'knight',
        width: '14%',
        render: (text, record, tIndex) => {
          const knightList = dot.get(record, 'knight') || [];
          return (
            <Select
              allowClear showSearch optionFilterProp="children" value={record.selectKnight[0]} placeholder="请选择骑士" style={{ width: '160px' }} onChange={(...arg) => {
                this.onTableKnightChange(...arg, tIndex);
              }}
            >
              {
                knightList.map((item, index) => {
                  // if (item.departure_date || item.departure_date === '') {
                  //   return <Option key={index} value={`${item.name},${item.phone}(${item.departure_date}离职)`}>{`${item.name}(${item.phone},${item.departure_date}离职)`}</Option>;
                  // }
                  // return <Option key={index} value={`${item.name},${item.phone}`}>{`${item.name}(${item.phone})`}</Option>;
                  if ((item.departure_date || item.departure_date === '') && item.state === DutyState.onResign) {
                    return <Option key={index} value={`${item._id}`}>{`${item.name}(${item.phone},${item.departure_date}离职)`}</Option>;
                  }
                  return <Option key={index} value={`${item._id}`}>{`${item.name}(${item.phone})`}</Option>;
                })
              }
            </Select>
          );
        },
      }, {
        title: '补款项目',
        dataIndex: 'cut_event',
        key: 'cut_event',
        width: '12.5%',
        render: (text, record, tIndex) => {
          return (
            <Select
              allowClear showSearch optionFilterProp="children" value={record.deductEvent} placeholder="请选择补款项目" style={{ width: '115px' }} onChange={(...arg) => {
                this.onTableDeductEventChange(...arg, tIndex);
              }}
            >
              {Object.keys(FillingEventType).map((key, index) => {
                if (key === 'description') return false;
                return Object.hasOwnProperty.call(FillingEventType, key) ? <Option key={index} value={`${FillingEventType[key]}`}>{FillingEventType.description(FillingEventType[key])}</Option> : '';
              })}
            </Select>
          );
        },
      }, {
        title: '补款金额',
        dataIndex: 'cut_amount',
        key: 'cut_amount',
        width: '12.5%',
        render: (text, record, tIndex) => {
          return (
            <Input
              value={`${record.deductAmount}`} onChange={(...arg) => {
                this.onTableDeductAmountChange(...arg, tIndex);
              }}
            />
          );
        },
      }, {
        title: '原因',
        dataIndex: 'cut_subsidy_other_cause',
        key: 'cut_subsidy_other_cause',
        width: '12.5%',
        render: (text, record, tIndex) => {
          return (
            <Input
              value={`${record.deductReason}`} onChange={(...arg) => {
                this.onTableDeductReasonChange(...arg, tIndex);
              }}
            />
          );
        },
      }, {
        title: '补款日期',
        dataIndex: 'date',
        key: 'date',
        width: '12.5%',
        render: (text, record, tIndex) => {
          const defaultValue = record.date ? moment(`${record.date}`, 'YYYY/MM/DD') : '';
          if (record.date) {
            return (
              <DatePicker
                defaultValue={defaultValue} onChange={(...arg) => {
                  this.onChangeDatePicker(...arg, tIndex);
                }}
                style={{ width: '115px' }}
              />
            );
          }
          return (
            <DatePicker
              onChange={(...arg) => {
                this.onChangeDatePicker(...arg, tIndex);
              }}
              style={{ width: '115px' }}
            />
          );
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '80px',
        render: (text, record, index) => {
          // const accountId = authorize.account.id;
          return (
            <div style={{ width: '80px' }}>
              <span className="mgl8 systemTextColor pointer" onClick={() => this.onAddRow(index)}>添加</span>
              {index !== 0 ? <Popconfirm title="确定删除?" onConfirm={() => this.onConfirmDelete(index)}>
                <span className="mgl8 systemTextColor pointer">删除</span>
              </Popconfirm> : ''}
            </div>
          );
        },
      }],
      dataSource: dot.get(props, 'materials.knightList.data', []), // 列表数据
      showExcelButton: false, // 控制显示上传按钮
      showExcelDownloadPage: false, // 控制显示下载模态框
      form: this.props.form,
      search: {
        platform,           // 平台
        city: [],           // 城市
        district: [],     // 商圈
        knight: [],       // 骑士
        selectKnight: [], // 选择的骑士
        cutEvent: '', // 项目
      },
      manualDataSource: dot.get(props, 'salaryModel.manualDataSource', []), // 表格初始化数据
      parentId: dot.get(props, 'salaryModel.parentId') || '', // 母单id
      submitAble: true, // 控制能否提交
      selectedRowKeys: [], // 未知======================
      selectedRows: [],
      visible: false, // 确认信息页modal显示key
      content: '', // 确认信息页内容显示
      cityList: [], // 城市列表
      deductionDataSource: [], // 展示数据
      deductionSubmitDataSource: [], // 提交的数据
      errorList: [],  //  骑士扣补款的错误
      detailErr: false, // 是否显示错误model
      showTip: false,  // 提示上传表格错误
    };
    this.private = {
      submitType: DeductSubmitType.waitForSubmit, // 默认为待提交类别
    };
  }

  componentWillMount() {
    const deductionDataSource = this.props.salaryModel.deductionDataSource || [];
    const deductionSubmitDataSource = this.props.salaryModel.deductionSubmitDataSource || [];
    this.setState({
      deductionDataSource, // 展示数据
      deductionSubmitDataSource, // 提交的数据
    });
  }

  componentWillReceiveProps(nextProps) {
    const manualDataSource = dot.get(nextProps, 'salaryModel.manualDataSource') || [];
    const parentId = dot.get(nextProps, 'salaryModel.parentId') || '';
    this.setState({
      manualDataSource, // 表格初始化数据
      deductionDataSource: nextProps.salaryModel.deductionDataSource || [], // 展示数据
      deductionSubmitDataSource: nextProps.salaryModel.deductionSubmitDataSource || [],  // 提交的数据
      errorList: nextProps.salaryModel.errorList,  //  骑士扣补款的错误
      detailErr: nextProps.salaryModel.detailErr, // 是否显示错误model
    });
    // // 页面结束的时候，注销刷新
    // if (this.private.removeRouteLeaveHook) {
    //   this.private.removeRouteLeaveHook();
    // }
    // window.onbeforeunload = undefined;
  }

  // 表格中平台切换
  onTablePlatformChange = (value, index) => {
    const { manualDataSource } = this.state;
    manualDataSource[index].platform = [value];
    manualDataSource[index].city = [];
    manualDataSource[index].district = [];
    manualDataSource[index].selectKnight = [];
    this.setState({
      manualDataSource, // 表格初始化数据
    });
  }
  // 选择城市Hock
  onTableCityChange = (value, index) => {
    const { manualDataSource } = this.state;
    manualDataSource[index].city = [value];
    manualDataSource[index].district = [];
    manualDataSource[index].selectKnight = [];
    this.setState({
      manualDataSource, // 表格初始化数据
    });
  }

  // 选择商圈hock
  onTableDistrictChange = (value, index) => {
    const { manualDataSource } = this.state;
    manualDataSource[index].district = [value];
    manualDataSource[index].selectKnight = [];
    this.setState({
      manualDataSource, // 表格初始化数据
    });
    if (value) {
      this.handleSearchKnight(value, index);
    }
  }

  // 选择骑士hock
  onTableKnightChange = (value, index) => {
    const { manualDataSource } = this.state;
    manualDataSource[index].selectKnight = [value];
    this.setState({
      manualDataSource, // 表格初始化数据
    });
  }

  // 补款项目修改
  onTableDeductEventChange = (value, index) => {
    const { manualDataSource } = this.state;
    manualDataSource[index].deductEvent = [value];
    this.setState({
      manualDataSource, // 表格初始化数据
    });
  }

  // 补款金额修改
  onTableDeductAmountChange = (e, index) => {
    const { manualDataSource } = this.state;
    manualDataSource[index].deductAmount = e.target.value;
    if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(e.target.value)) {
      this.setState({
        submitAble: false, // 控制能否提交
      });
      if (/(^[1-9]([0-9]+)?(\.)$|^[0-9]\.$)/.test(e.target.value)) {
        return false;
      }
      message.error('请输入正确的金额');
    } else {
      this.setState({
        manualDataSource, // 表格初始化数据
        submitAble: true, // 控制能否提交
      });
    }
  }

  // 补款原因修改
  onTableDeductReasonChange = (e, index) => {
    const { manualDataSource } = this.state;
    manualDataSource[index].deductReason = e.target.value;
    this.setState({
      manualDataSource, // 表格初始化数据
    });
  }

  // 补款日期修改
  onChangeDatePicker = (value, dateString, index) => {
    const { manualDataSource } = this.state;
    manualDataSource[index].date = dateString;
    this.setState({
      manualDataSource, // 表格初始化数据
    });
  }

  // 增加一行复制数据
  onAddRow = (index) => {
    const tempSource = this.state.manualDataSource.slice();
    const copyRow = _.cloneDeep(tempSource[index]);
    if (copyRow._id) delete copyRow._id;
    tempSource.splice(index + 1, 0, copyRow);
    // 修改数据源
    this.props.dispatch({
      type: 'salaryModel/addNewRowR',
      payload: { tempSource },
    });
  }

  // 删除
  onConfirmDelete = (index) => {
    const { manualDataSource } = this.state;
    if (manualDataSource[index]._id) {
      this.props.dispatch({
        type: 'salaryModel/getFillingMoneyDetailRemove',
        payload: {
          _id: manualDataSource[index]._id, // id
          index, // 下标
        },
      });
    } else {
      this.props.dispatch({
        type: 'salaryModel/deleteOneRecordOfListR',
        payload: { index },
      });
    }
  }

  // 手动编辑列表查询骑士 TODO
  handleSearchKnight = (value, index) => {
    const { dispatch } = this.props;
    const accountId = authorize.account.id;
    dispatch({
      type: 'salaryModel/getKnightListE',
      payload: {
        account_id: accountId, // 员工id
        limit: 1000, // 条数
        page: 1, // 页码
        biz_district_id_list: [value], // 商圈
        permission_id: Modules.ModuleSearchInquire.id, // 权限id
        position_id_list: [Position.postmanManager, Position.postman],   // 职位列表
        index, // 当前操作行数
      },
    });
  };

  // 手动编辑列表查询骑士 TODO
  handleSearchKnightModal = (value) => {
    const { dispatch } = this.props;
    this.setState({
      bizDistrictId: value,
    });
    this.props.form.validateFields((err) => {
      if (err) {

      } else {
        dispatch({
          type: 'materials/getKnightListE',
          payload: {
            state: 50, // 状态
            position_id_list: [Position.postmanManager, Position.postman], // 职位列表
            biz_district_id_list: [value], // 商圈
            limit: 1000, // 条数
            page: 1, // 页码
          },
        });
      }
    });
  };

  onCommit = (type) => {
    const { manualDataSource } = this.state;
    let flag = true; // 检测是否所有数据都填了
    // 类型为未完成时，所有的数据都需要填写
    if (type === DeductSubmitType.unfinished) {
      manualDataSource.map((item) => {
        Object.keys(item).map((key) => {
          if (Object.hasOwnProperty.call(item, key) && item[key].length === 0) return (flag = false);
          return flag;
        });
        return flag;
      });
    } else if (type === DeductSubmitType.waitForSubmit) { // 类型为待提交时，允许金额和原因为空
      manualDataSource.map((item) => {
        Object.keys(item).map((key) => {
          if (key !== 'deductReason' && key !== 'deductAmount' && Object.hasOwnProperty.call(item, key) && item[key].length === 0) {
            return (flag = false);
          }
          return flag;
        });
        return flag;
      });
    }

    if (flag) {
      this.private.submitType = type; // 将提交状态切换为待提交
      // 确认金额是否输入
      if (!this.state.submitAble && type === DeductSubmitType.unfinished) {
        message.error('请确保所有金额输入正确');
        return false;
      }
      this.showCreateFillingModal();
    } else {
      message.error('提交前请确保所有数据都已经填写');
      this.private.submitType = DeductSubmitType.waitForSubmit; // 默认提交状态切换为未完成态
    }
  }

  // 修复小数加法精度不准问题
  addNum = (num1, num2) => {
    let sq1 = 0;
    let sq2 = 0;
    let m = 0;
    try {
      sq1 = num1.toString().split('.')[1].length;
    } catch (e) {
      sq1 = 0;
    }
    try {
      sq2 = num2.toString().split('.')[1].length;
    } catch (e) {
      sq2 = 0;
    }
    m = Math.pow(10, Math.max(sq1, sq2));
    return ((num1 * m) + (num2 * m)) / m;
  }
  // 提交补款
  showCreateFillingModal = () => {
    const { manualDataSource } = this.state;
    this.setState({
      visible: true,
    });
    let money = 0;
    const total = manualDataSource.reduceRight((accumulator, value) => {
      if (!accumulator[value.selectKnight[0]]) { // 叠加对象没有重复的key值的情况下才对total值加1
        accumulator.total += 1;
        accumulator[value.selectKnight[0]] = 1;
      }
      return accumulator;
    }, { total: 0 }).total;
    manualDataSource.forEach((item) => {
      if (item.hasOwnProperty('deductAmount')) {
        money = this.addNum(Number(item.deductAmount), money);
      }
      // if (item.hasOwnProperty('knight_count')) {
      //   total += Number(item.knight_count);
      // }
    });
    const collectContent = (<div>
      <span style={{ fontSize: '14px' }}>
        <Icon type="exclamation-circle" style={{ color: '#ffbf00', marginRight: '3px' }} />
        <span className="mgr16">{`总人数:${total}`}</span>&nbsp;&nbsp;
        <span className="mgl16">{`总补款金额:${renderReplaceAmount(money)}`}</span>
      </span>
      <p style={{ fontSize: '12px' }}>您确定发送该补款申请吗？</p>
    </div>);
    this.setState({
      content: collectContent, // 确认信息页内容显示
    });
  };
  // 获取提交类型对应的key
  getTypeKey = (value) => {
    let keyName = '';
    Object.keys(FillingEventType).map((item) => {
      if (FillingEventType[item] === Number(value)) {
        keyName = item;
        return false;
      }
    });
    return keyName;
  }
  /* 获取某个数组指定的数据做非空处理
   * @param array 原始数组
   * @param key 原始数组每个对象需要比对的key
   * @param value 需要比对的原始value
   * @param 需要获取过滤对象的key值 */
  getOnePropertyOfArray = (array, key, value, name) => {
    let val = '';
    // debugger
    if (Object.prototype.toString.call(array) !== '[object Array]') return val;
    const tempArray = array.filter((ele) => {
      return ele[key] === value;
    });
    if (tempArray.length !== 0 && tempArray[0] && tempArray[0][name]) val = tempArray[0][name];
    return val;
  }
  // 创建扣补款单
  handleOk = () => {
    // 关闭弹窗确认页面
    this.setState({
      visible: false,
    });
    const { manualDataSource } = this.state;
    const values = {}; // 请求参数
    const dataList = [];
    manualDataSource.forEach((item) => {
      const obj = {};
      // 如果是已经保存过的数据则会有_id属性，需要在保存的时候传递回去
      item._id ? obj._id = item._id : '';
      // 获取汉字名称
      obj.platform_name = this.getOnePropertyOfArray(authorize.platform(), 'id', item.platform[0], 'name');
      obj.city_name = this.getOnePropertyOfArray(authorize.cities(item.platform), 'id', item.city[0], 'description');
      obj.district_id = this.getOnePropertyOfArray(authorize.districts(item.city), 'id', item.district[0], 'id');
      obj.knight_id = item.selectKnight[0];
      obj.date = item.date;
      // obj.knight_name = item.selectKnight[0];
      // const departureDate = /\((\d{4}-\d{2}-\d{2})离职\)/.exec(item.selectKnight[0]);
      // if (departureDate) {
      //   obj.departure_date = departureDate[1];
      // }
      obj.cut_subsidy_other_cause = item.deductReason;
      if (this.getTypeKey(item.deductEvent[0]) !== '') obj[this.getTypeKey(item.deductEvent[0])] = Number(item.deductAmount) === 0 ? -1 : Number(item.deductAmount);
      dataList.push(obj);
    });
    // 开始编辑回调参数
    (this.state.parentId) !== '' ? values.order_id = this.state.parentId : ''; // 如果是编辑页面则parentId不为空，需要传递给后台
    values.fund_id = KnightSalaryType.fillingMoney;  // 补款
    values.data_list = dataList;
    values.submit_state = this.private.submitType;
    this.props.dispatch({
      type: 'salaryModel/createMoneyOrderOfKnightE',
      payload: values,
    });
  };

  // Modal取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 下载模版
  downloadExcel = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        const value = this.props.form.getFieldsValue();
        if (value.date) {
          delete value.date;
        }
        value.platform_code_list = [values.platform_code_list];
        value.fund_id = KnightSalaryType.fillingMoney; // 补款
        this.props.dispatch({
          type: 'salaryModel/downloadStaffListE',
          payload: value,
        });
      }
    });
  }

  // 点击上传按钮
  onClickUpload = () => {
    this.textInput.click();
    this.eventListenerOnTextInput(this.textInput);
  }

  // 添加上传文件监听
  eventListenerOnTextInput(textInput) {
    textInput.addEventListener('change', this.handleFileChange.bind(this));
  }

  // 上传文件变化执行
  handleFileChange(ev) {
    this.setState(() => {
      return { showTip: true };
    });
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (ev) => {
      // 通过XLSX的reade方法去解析二进制数据data，得到可读的表格信息。
      const data = ev.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      // 用来存放表格数据
      const excelData = [];
      // excelData添加表名sheetName、表头sheetHead、表体sheetContent属性
      excelData.push({
        sheetName,
        sheetHead: [],
        sheetContent: [],
      });

      const worksheet = workbook.Sheets[sheetName];
      // 标题列字母
      const colArr = [];

      // sheetHead添加数据
      for (const item in worksheet) {
        if (item.substr(1) === '1') {
          colArr.push(item.substr(0, 1));
          excelData[0].sheetHead.push(worksheet[item].v);
        }
      }

      // sheetContent添加数据
      let keys = Object.keys(worksheet);
      keys = keys.filter(item => item[0] !== '!' && item.substr(1) !== '1');
      keys.forEach((item) => {
        const row = item.substr(1); // 所在行
        const col = item.substr(0, 1); // 所在列
        const val = worksheet[item].v; // 值

        if (!excelData[0].sheetContent[row - 2]) {
          excelData[0].sheetContent[row - 2] = {};
        }

        const index = colArr.indexOf(col);
        // 缺位补0
        if (index !== 2 && typeof val === 'number') {
          excelData[0].sheetContent[row - 2][excelData[0].sheetHead[index]] = Number(val).toFixed(2);
        } else {
          excelData[0].sheetContent[row - 2][excelData[0].sheetHead[index]] = val;
        }
      });

      // 骑士补款合计的字符串
      const totalName = excelData[0].sheetHead[excelData[0].sheetHead.length - 1];

      // 判断表头的数量和表头内容
      let headAmount = false;
      let headTitle = false;
      const fromTo = worksheet['!ref'];
      if (fromTo[0] === 'A' && fromTo[3] === 'G') {
        headAmount = true;
      }
      const headStr = '城市,商圈名称,骑士姓名,手机号,补款项目,金额,原因';
      if (excelData[0].sheetHead.join(',') === headStr) {
        headTitle = true;
      }
      if (!headAmount || !headTitle) {
        if (this.state.showTip) {
          this.setState(() => {
            return { showTip: false };
          }, () => {
            message.error('请上传骑士补款表格');
          });
        }
        return;
      }

      this.setState({
        excelData, // 表格数据
        totalName, // 骑士补款合计的字符串
        total: excelData[0].sheetContent.length,  // 总数量
      });
    };

    // 读取Excel文件
    reader.readAsBinaryString(file);
  }

  // 内容错误模态框
  handleDetailErrCancel = () => {
    this.setState({
      detailErr: false, // 是否显示错误model
    });
    this.props.dispatch({
      type: 'salaryModel/showErrorDetailModalR',
      payload: false,
    });
  }

  showErrorModalDetail = () => {
    const { errorList, deductionSubmitDataSource } = this.state;
    const errInfos = [];
    errorList.map((item, index) => {
      deductionSubmitDataSource.forEach((ele, idx) => {
        const fileKey = ele.file_key;
        if (fileKey === item.file_key) {
          const arrObj = {};
          arrObj.arrIndex = index;
          arrObj.arrInfo = item.errors_line;
          errInfos.push(arrObj);
        }
      });
    });
    return (
      errInfos.map((item, index) => {
        return (<div key={index} style={{ marginBottom: '5px' }}>
          <p className="mgl16"><Icon type="exclamation-circle-o" style={{ fontSize: 12, color: '#08c' }} /> 第 {item.arrIndex + 1} 行excel表信息有误，信息如下：</p>
          {
            item.arrInfo.map((element, idx) => {
              return <span key={index} style={{ display: 'block', marginLeft: '23px' }}> 第 {element.error_index + 1} 行 {element.error_message}</span>;
            })
          }
        </div>);
      })
    );
  }
  // ======================重新写
  onDownloadExcelPageShow = () => {
    this.setState({
      showExcelDownloadPage: true,
    });
  }
  // 控制显示上传按钮
  onFillingTypeChange = (value) => {
    this.setState({
      showExcelButton: value === `${FillingType.excelUpload}`,
    });
  }
  // 渲染顶部补款方式选择块
  renderOptionBlock = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { showExcelButton } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        {/* <Row>
          <Col sm={8}>
            <FormItem label="补款方式" {...formItemLayout}>
              {getFieldDecorator('FillingType', {
                rules: [{ required: true, message: '请选择补款方式' }],
              })(
                <Select placeholder="请选择补款方式" onChange={this.onFillingTypeChange}>
                  {[
                    <Option value={`${FillingType.pageInput}`} key={FillingType.pageInput}>{FillingType.description(FillingType.pageInput)}</Option>,
                    <Option value={`${FillingType.excelUpload}`} key={FillingType.excelUpload}>{FillingType.description(FillingType.excelUpload)}</Option>,
                  ]}
                </Select>,
                )}
            </FormItem>
          </Col>
        </Row> */}
        <Row>
          {showExcelButton && <Col sm={8}>
            <Button style={{ marginRight: '15px', marginLeft: '10px' }} onClick={this.onDownloadExcelPageShow}>
              <Icon type="download" />
              下载模板
            </Button>
            <input type="file" id="file" ref={(input) => { this.textInput = input; }} style={{ display: 'none' }} />
            <Button onClick={this.onClickUpload}>
              <Icon type="upload" />
              上传文件
            </Button>
          </Col>}
        </Row>
      </Form>
    );
  }

  onDownload = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'salaryModel/downloadStaffListE',
      payload: {
        platform_code_list: search.platform, // 平台
        fund_item: FillingEventType.description(Number(search.cutEvent)), // 款项类型中文字符串
        city_spelling_list: search.city, // 城市
        biz_district_id_list: search.district, // 商圈
        knight_id_list: search.selectKnight, // 骑士
      },
    });
  }
  // 渲染下载模态框
  renderExcelDownloadPage = () => {
    return <ExcelModal search={this.state.search} show={this.state.showExcelDownloadPage} onDownload={this.onDownload} />;
  }

  // 重新渲染表格
  renderEditableTable = () => {
    return (<CoreContent>
      <Table
        columns={this.state.columns} dataSource={this.state.manualDataSource}
        pagination={false}
        rowKey={(record, index) => {
          return index;
        }}
      />
      <Row type="flex" justify="center">
        <Col className="mgt16">
          {/* 暂时隐藏功能 */}
          {
            this.state.manualDataSource && this.state.manualDataSource.length > 0 ? <Button
              className="mgl16" type="primary" onClick={() => {
                this.onCommit(DeductSubmitType.unfinished);
              }}
            >提交
            </Button> : ''
          }
          {/* <Button className="mgl16"><Link to="Salary/FillingMoney">返回</Link></Button> */}
        </Col>
        <Col className="mgt16">
          {/* 暂时隐藏功能 */}
          {
            this.state.manualDataSource && this.state.manualDataSource.length > 0 ? <Button
              className="mgl16" type="default" onClick={() => {
                this.onCommit(DeductSubmitType.waitForSubmit);
              }}
            >保存
            </Button> : ''
          }
          {/* <Button className="mgl16"><Link to="Salary/FillingMoney">返回</Link></Button> */}
        </Col>
      </Row>
    </CoreContent>);
  }

  // 创建确认model
  renderConfirmModal = () => {
    return (<Modal
      title={'确认信息'} visible={this.state.visible}
      onOk={this.handleOk} onCancel={this.handleCancel}
      okText="确认" cancelText="取消"
    >
      <Row type="flex" justify="center">
        <Col className="mgt16">
          {this.state.content}
        </Col>
      </Row>
    </Modal>);
  }

  // 创建错误model
  renderErrorModal = () => {
    return (<Modal visible={this.state.detailErr} title="错误" footer={null} onCancel={this.handleDetailErrCancel.bind(this)}>
      {
        this.showErrorModalDetail()
      }
    </Modal>);
  }

  // 创建汇总页面
  renderStatisticsPage = () => {
    return <Statistic data={this.state.manualDataSource} event={FillingEventType} />;
  }
  render() {
    // 页面刷新的弹窗提示
    // window.onbeforeunload = function (event) {
    //   return '内容未保存，确定离开页面？';
    // };
    return (<div className="mgt8">
      {this.renderOptionBlock()}
      {this.renderExcelDownloadPage()}
      {this.renderStatisticsPage()}
      {this.renderEditableTable()}
      {/* 暂时隐藏功能 */}
      {this.renderConfirmModal()}
      {/** *  上传内容错误提示信息列表   ***/}
      {this.renderErrorModal()}
    </div>);
  }
}

const mapStateToProps = ({ inquireModel, salaryModel, materials }) => {
  return { inquireModel, salaryModel, materials };
};

export default connect(mapStateToProps)(Form.create()(Create));
