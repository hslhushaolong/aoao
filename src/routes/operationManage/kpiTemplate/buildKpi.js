/**
 * 新建kpi
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select, DatePicker, Form, Button, Modal, Alert, Row, Col, InputNumber, Popconfirm, message } from 'antd';
import _ from 'lodash';

import { authorize } from '../../../application';
import { CoreContent } from '../../../components/core';

import TransportCapacity from './items/transportCapacity';
import TimeReach from './items/timeReach';
import Attendance from './items/attendance';

import { transRePunishNumber } from './transPunishItem';
import { Components, PunishNumber } from './enumeration';
import {
  transformX1,
  transformX2,
  transformX3,
  transformQC,
  transformOneQC,
  transformUGC,
  transformBreakRule,
  transformBadCommet,
  transformAttendanceNum,
} from './utils';

const { Option } = Select;

class BuildKpi extends Component {
  constructor(props) {
    super(props);
    this.state = {
       // 添加惩罚项的选项
       // 文档地址 kpi_template/create_kpi_template
       // 具体name都是各种骑士扣钱的扣罚项，参照文档和产品（陆玉珍）需求都能明白
      onPunishSelect: [
        { value: PunishNumber.renderQC, name: 'QC' },
        { value: PunishNumber.renderAllQC, name: '整体QC' },
        { value: PunishNumber.renderOneQC, name: '单项QC' },
        { value: PunishNumber.renderUGC, name: 'UGC评分' },
        { value: PunishNumber.renderBreakRule, name: '操作违规' },
        { value: PunishNumber.renderBadCommet, name: '用户差评率' },
        { value: PunishNumber.renderRed, name: '红字运力计划' },
        { value: PunishNumber.renderNum, name: '运力奖励扣罚' },
      ],
      // 单项QC罚款类型
      // value是定义的枚举值，name是枚举值的含义
      OneQCTemplate: [
        { value: '60001', name: '未使用餐箱取餐' },
        { value: '60002', name: '无健康证' },
        { value: '60003', name: '未按要求编制编码' },
        { value: '60004', name: '无头盔' },
        { value: '60005', name: '无臂章' },
        { value: '60006', name: '未穿工服' },
        { value: '60007', name: '抽烟' },
      ],
      confirmPunishSelect: [],                                // select onchange接收到的值
      confirmPunishOk: [],                                    // 扣罚项模版显示的值
      visible: false,                                         // 控制弹窗的值
      visibleKpi: false,                                      // 控制Kpi模版弹窗提示
      visibleConfirm: false,                                  // 控制提交键弹窗
      redMessage: '日均有效出勤数',                             // 红字运力计划底下的说明
      X1Options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],             // X1可选择范围
      city_list: dot.get(props, 'operationManage.templateInfo.city_list') || [],         // 可选城市列表
      district_level: dot.get(props, 'operationManage.templateInfo.biz_district_level') || [],  // 可选商圈等级列表
      storeKpiValue: '60081',                                 // kpi莫泰框存储值   60081-nsx设置 60082扣罚项
      // -----------------------------以下是存值位置--------------------------------------
      whichCity: [],                                          // [] 选择城市
      whichTemplate: '1',                                     // 选择模版
      selectTime: null,                                       // ''  选择生效时间
      kpiType: '60081',                                        // kpi模版类型

      // NX3设置
      onSelectNX3: {                                          // NX3设置
        distribution: '60010',                                // 订单类型
        distributionTime: '60020',                            // 骑士类型
        platformType: '60031',                                // 商圈类型
        platformGrade: null,                                  // 商圈等级
      },

      // 扣罚项设置
      basicsN: null,                                          // 基础N值     int
      // 运力达成x1
      transport: [{
        day: null,    // 单循运力达成
        per: null,    // 每单／元
      }],
      // 时效达成x2
      prescription: [{
        ontime: null,   // 订单准时率
        average: null,  // 平均配送时长
        day: null,      // 单循达成实效要求天数
        per: null,      // 每单／元
      }],
      // 最差10%
      tenPercent: {
        hour: null, // 站点单旬最末10%配送时
        day: null,  // 大于多少天
        per: null,   // 每单／元
      },

      // 存储扣罚项的值
      onStorePunish: {
        // QC
        QC: {
          per: null, // 每单
        },
        // 整体QC
        AllQC: {
          pointsOne: null,    // 第一排单均扣分
          perOne: null,       // 第一排每单
          perTwo: null,       // 第二排每单
          pointsThree: null,  // 第三排单均扣分
          perThree: null,      // 第三排每单
        },
        // 单项QC
        OneQC: {
          type: null, // QC罚款类型为
          per: null,   // 每单／元
        },
        // UGC评分
        UGC: {
          site: null, // 站点单旬UGC评
          per: null,   // 每单／元
        },
        // 操作违规
        BreakRule: {
          site: null, // 站点单旬操作违
          per: null,   // 每单／元
        },
        // 差评率
        BadCommet: {
          site: null, // 站点用户差评率
          per: null,   // 每单／元
        },
        // 红字运力
        Red: {
          per: null, // 每单扣除
        },
      },
      // 扣罚项--运力奖励扣罚
      attendanceNum: [{
        day: null,  // 日均出单骑士数
        per: null,   // 每单／元
      }],
    };
  }

  // ----------------------------------------X1和X2的组件传入函数-------------------
  // 接收参数生命周期
  componentWillReceiveProps(nextProps) {
    this.setState({
      city_list: dot.get(nextProps, 'operationManage.templateInfo.city_list') || [],     // 可选城市列表
      district_level: dot.get(nextProps, 'operationManage.templateInfo.biz_district_level') || [],  // 可选商圈等级列表
    });
  }

  // 转换数据为接口格式
  transformData = () => {
    // 传到后台的对象
    const result = {};
    // account_id
    result.account_id = authorize.account.id;

    // 模版适用范围
    // 模版选择 int
    result.template_type = parseFloat(this.state.whichTemplate);
     // 选择城市列表
    result.city_list = this.state.whichCity;
     // 生效日期
    result.date = this.state.selectTime;

    // 60081 nx3设置 60082 kpi扣罚项
    if (this.state.kpiType === '60081') {
      // NX3设置
      result.order_type = parseFloat(dot.get(this, 'state.onSelectNX3.distribution'));
      // 订单类型 int
         // 60011 限时达
      if (dot.get(this, 'state.onSelectNX3.distribution') !== '60011') {
      // 骑士类型 int
        result.knight_type = parseFloat(dot.get(this, 'state.onSelectNX3.distributionTime'));
      }
      // 商圈类型 int
      result.baidu_biz_district_type = parseFloat(dot.get(this, 'state.onSelectNX3.platformType'));
      // 商圈等级
      result.biz_district_level = dot.get(this, 'state.onSelectNX3.platformGrade');
      // 基础价N  int
      result.base_price_n_value = this.state.basicsN;
      // 运力达成x1
      result.transport_capacity_reached_x1 = transformX1(this.state.transport);
       // 实效达成X2
      result.time_reach_x2 = transformX2(this.state.prescription);
       // 最差10%达成
      result.worst_ten_percent_x3 = transformX3(this.state.tenPercent);
    } else { // 60082 kpi扣罚项
      // 扣罚项
      result.qc = dot.get(this, 'state.onStorePunish.QC.per');   // QC
      result.whole_qc = transformQC(dot.get(this, 'state.onStorePunish.AllQC'));       // 整体qc
      result.single_qc = transformOneQC(dot.get(this, 'state.onStorePunish.OneQC'));  // 单项qc
      result.ugc_score = transformUGC(dot.get(this, 'state.onStorePunish.UGC'));   // ugc评分
      result.operation_violation = transformBreakRule(dot.get(this, 'state.onStorePunish.BreakRule'));  // 违规操作
      result.user_differential_rate = transformBadCommet(dot.get(this, 'state.onStorePunish.BadCommet')); // 用户差评率
      result.red_letter_capacity_plan = dot.get(this, 'state.onStorePunish.Red.per');   // 红字运力计划
      result.attendance_award = transformAttendanceNum(this.state.attendanceNum);   // 扣罚项奖励
      result.assessment_type_list = transRePunishNumber(this.state.confirmPunishOk);  // 扣罚项模版显示的值
    }
    result.kpi_type = parseInt(this.state.kpiType);                                       // kpi模版类型
    this.props.dispatch({ type: 'operationManage/createKpiTemplateE', payload: result });  // 创建kpi模版设置
  }

  // ---------------------------------------下面是实效达成X2相关的回调------------------------------------
  /**
   * 获得x2每项值的回调函数，通过flag标志判断对应值存储位置
   * //本地定义
   * @param  {[string]} value [值]
   * @param  {[string]} flag  [属性]
   * @return {[void]}       [无]
   */
  getPrescription = (value, flag) => {
    const prescription = _.cloneDeep(this.state.prescription);
    // 记录实效达成要求天数
    if (flag.flag === 'day') {
      prescription[flag.id].day = value;
    }
    // 记录每单多少元
    if (flag.flag === 'per') {
      prescription[flag.id].per = value;
    }
     // 订单准时率
    if (flag.flag === 'ontime') {
      prescription[flag.id].ontime = value;
    }
    // 平均配送时长
    if (flag.flag === 'average') {
      prescription[flag.id].average = value;
    }

    this.setState({ prescription });  // 时效达成x2
  }

  // 增加一项X2
  addPrescription = () => {
    const prescription = _.cloneDeep(this.state.prescription);
    prescription.push({
      ontime: null,   // 订单准时率
      average: null,  // 平均配送时长
      day: null,      // 记录实效达成要求天数
      per: null,       // 记录每单多少元
    });
    this.setState({
      prescription,  // 时效达成x2
    });
  }

  // 删除一项X2。默认删最后一项
  removePrescription = () => {
    // 最少保留一项
    if (dot.get(this, 'state.prescription').length > 1) {
      // 时效达成x2
      const prescription = _.cloneDeep(this.state.prescription);
      prescription.pop();
      this.setState({
        prescription, // 时效达成x2
      });
    }
  }

  // ------------------下面是运力达成X1的相关回调------------------------------------------
  // 获得X1值的回调 flag 区分是天数还是每天单价
  getTransport = (value, flag) => {
    const transport = _.cloneDeep(this.state.transport);
     // 记录单旬运力达成
    if (flag.flag === 'day') {
      let X1Options = _.cloneDeep(this.state.X1Options);
      // 单循运力达成天数1-10天，每个值只能用一次
      X1Options = X1Options.filter(item => (
        item != value
      ));
      // 筛选出原值没有的选项，渲染天数
      this.setState({ X1Options });
      transport[flag.id].day = value;
    }
    // 记录每单单价
    if (flag.flag === 'per') {
      transport[flag.id].per = value;
    }

    this.setState({ transport });// 运力达成X1
  }

  // 增加一条运力达成X1
  addTransport = () => {
    const transport = _.cloneDeep(this.state.transport);
    transport.push({
      day: null, // 单循运力达成天数
      per: null, // 每单价格
    });
    this.setState({
      transport, // 运力达成X1
    });
  }

  // 减少一条运力达成X1，默认删除最后一条
  removeTransport = () => {
    // 运力达成X1有数据
    if (dot.get(this, 'state.transport').length > 1) {
       // 运力达成X1的值{ day: 天数, per: 每单的值 }
      const transport = _.cloneDeep(this.state.transport);
       // 选项1-10天
      let X1Options = _.cloneDeep(this.state.X1Options);

      // 删除最后一条，要把对应的选项（1-10天之一）加到选择列表中，并对列表按照从小到大的顺序重新排序
      if (transport[transport.length - 1].day != null && transport[transport.length - 1].day != '') {
        X1Options.push(parseFloat(transport[transport.length - 1].day));
      }
      // 将天数选项按从小到大排列1-10
      X1Options = X1Options.sort((a, b) => {
        return a - b;
      });
      transport.pop();
      this.setState({
        transport,      // 运力达成X1
        X1Options,       // 选项1-10天
      });
    }
  }

  // 城市选择回调
  selectWhichCity = (value) => {
    this.setState({
      whichCity: value,     // 城市
    });
  }

  // 模版选择回调
  selectWhichTemplate = (value) => {
    this.setState({
      whichTemplate: value,   // 模版 （目前只有模版一，没得选别的）
    });
  }

// kpi类型选择
  selectKpiType = (value) => {
    this.setState({
      visibleKpi: true,          //  开启弹窗，切换扣罚项 （nx3/扣罚项）
      storeKpiValue: value,     // 60081-nx3  60082-扣罚项
    });
  }

// kpi确认回调
  kpiHandleok = () => {
    this.setState({
      visibleKpi: false,         // 关闭弹窗，切换扣罚项 （nx3/扣罚项）
      kpiType: this.state.storeKpiValue, // 60081-nx3  60082-扣罚项
    });
  }

// kpi取消回调
  kpiHandleCancel = () => {
    this.setState({
      visibleKpi: false,  // 关闭弹窗，切换扣罚项 （nx3/扣罚项）
      storeKpiValue: '60081', // 默认60081-nx3设置，60082-扣罚项
    });
  }

  // 时间选择回调
  onSelectTime = (value, dateString) => {
    this.setState({
      selectTime: dateString,   // 选择生效日期
    });
  }

  // --------------------------------NX3渲染相关-----------------------------------

  // NX3设置-订单类型回调
  onDistribution = (value) => {
    let { platformType, platformGrade, distributionTime } = this.state.onSelectNX3;
    if (value === '60011') {     // 当订单类型选到限时达时，下方应只显示基础价N值，因此重置其他值为初始值null
      distributionTime = null;
      this.setState({
        transport: [{
          day: null,  // 单循运力达成天数
          per: null,   // 每单／元
        }],                                      // 运力达成x1
        prescription: [{
          ontime: null,   // 订单准时率
          average: null,  // 平均配送时长／分钟
          day: null,      // 单循达成实效要求天数
          per: null,      // 每单
        }],      // 时效达成x2
        tenPercent: {
          hour: null,   // 站点单旬最末10%配送时长／分钟
          day: null,   // 大于的天数／天
          per: null,    // 每单／元
        },                           // 最差10%达成
        X1Options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 1-10天的单循选项
      });
    }
    this.setState({
      onSelectNX3: {              // nX3设置元信息
        distribution: value,      // 订单类型
        distributionTime,   // 骑士类型
        platformType,             // 商圈类型
        platformGrade,            // 商圈等级
      },
    });
  }

// NX3设置-骑士类型回调
  onDistributionTime = (value) => {
    const { platformType, platformGrade, distribution } = this.state.onSelectNX3;
    this.setState({
      // nX3设置基本信息
      onSelectNX3: {
        distribution,             // 订单类型
        distributionTime: value,  // 骑士类型
        platformType,             // 商圈类型
        platformGrade,            // 商圈等级
      },
    });
  }

// NX3设置-商圈类型回调
  onPlatformType = (value) => {
    const { distribution, platformGrade, distributionTime } = this.state.onSelectNX3;
     // 如果商圈类型是独家，则使运力达成X1的值初始化，并隐藏该项，60031独家
    if (value === '60031') {
      this.setState({  // 天数      每单单价
        transport: [{
          day: null, // 天数
          per: null, // 每单单价
        }],
          // 运力达成x1
        X1Options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // 选项1-10天
        redMessage: '日均有效出勤数',   // 红字运力计划下的提示文案
      });
      // 如果是非独家 60032-非独家，60033-无商圈类型
    } else {
      this.setState({ redMessage: '日有效出勤数' });// 更改红字运力计划下的提示文案
    }
    this.setState({  // nX3设置基本信息
      onSelectNX3: {
        distribution,   // 订单类型
        distributionTime,  // 骑士类型
        platformType: value,  // 商圈类型
        platformGrade,  // 商圈等级
      },
    });
  }

  // NX3设置-商圈等级回调
  onPlatformGrade = (value) => {
    const { platformType, distribution, distributionTime } = this.state.onSelectNX3;
    this.setState({
      onSelectNX3: {  // nX3设置基本信息
        distribution,  // 订单类型
        distributionTime, // 骑士类型
        platformType,  // 商圈类型
        platformGrade: value, // 商圈等级
      },
    });
  }

  // 生成基础价N值回调
  setBasicsN = (value) => {
    this.setState({ basicsN: value }); // 基础价n值
  }

  // 最差10%X3回调
  setTenPercent = (value, flag) => {
    const { hour, day, per } = this.state.tenPercent;
    // 记录站点单旬配送时长的值
    if (flag === 'hour') {
      this.setState({
        tenPercent: {      // 最差10%达成-X3
          hour: value,   // 站点单旬最末10%配送时长-分钟
          day,   // 站点单旬最末10%配送时长--天
          per, // 单价
        },
      });
    }
     // 记录且>天的值
    if (flag === 'day') {
      this.setState({
        tenPercent: { // 最差10%达成-X3
          hour, // 站点单旬最末10%配送时长-分钟
          day: value, // 站点单旬最末10%配送时长--天
          per, // 单价
        },
      });
    }
    // 记录每单多少元
    if (flag === 'per') {
      this.setState({
        tenPercent: { // 最差10%达成-X3
          hour, // 站点单旬最末10%配送时长-分钟
          day, // 站点单旬最末10%配送时长--天
          per: value, // 单价
        },
      });
    }
  }

  // 将NX3选择的枚举值转换成对应的渲染函数
  getComponent = (component) => {
    switch (component) {
      case Components.renderN:
        return this.renderN();  // 转换基础价n值
      case Components.renderX1:
        return this.renderX1(); // 转换运力计划X1
      case Components.renderX2:
        return this.renderX2(); // 转换实效达成-X2
      case Components.renderX3:
        return this.renderX3(); // 转换最差10%达成-X3
      default:
        return '';
    }
  }

  // --------------------------------------扣罚项渲染相关-----------------------------------
  // 运力奖励扣罚相关函数-Onchange回调
  getattendanceNum = (value, flag) => {
    //  扣罚项--运力奖励扣罚
    const attendanceNum = _.cloneDeep(this.state.attendanceNum);
     // 记录日出单骑士数
    if (flag.flag === 'day') {
      attendanceNum[flag.id].day = value;
    }
    // 记录每单多少元
    if (flag.flag === 'per') {
      attendanceNum[flag.id].per = value;
    }
    this.setState({ attendanceNum });  // 扣罚项--运力奖励扣罚
  }

  // 增加一项
  addattendanceNum = () => {
     // 扣罚项--运力奖励扣罚
    const attendanceNum = _.cloneDeep(this.state.attendanceNum);
    attendanceNum.push({
      day: null, // 天
      per: null, // 每单／元
    });
    this.setState({
      attendanceNum, // 扣罚项--运力奖励扣罚
    });
  }

  // 删除一项
  removeattendanceNum = () => {
    // 最少保留一项
    if (dot.get(this, 'state.attendanceNum').length > 1) {
      // 扣罚项--运力奖励扣罚
      const attendanceNum = _.cloneDeep(this.state.attendanceNum);
      // 删除最后一项
      attendanceNum.pop();
      this.setState({
        attendanceNum, // 扣罚项--运力奖励扣罚
      });
    }
  }

  // 扣罚项标签的删除功能回调
  removeQC = (flag) => {
    // 判断删除了哪项，然后同步到渲染列表记录数据confirmPunishOk中
    const onStorePunish = _.cloneDeep(this.state.onStorePunish);   // 扣罚项的值
    const confirmPunishOk = dot.get(this, 'state.confirmPunishOk').filter(item => (
      item !== PunishNumber[flag]   // 将不是删除项的加入数组
    ));
    this.setState({ confirmPunishOk });  // 扣罚项的所有子项
    // 删除了哪项就将那项内部数据数据清空
    switch (flag) {
      case 'renderQC':   // QC
        onStorePunish.QC.per = null;  // 每单
        this.setState({ onStorePunish });  // qc
        break;
      case 'renderAllQC':  // 整体QC
        onStorePunish.AllQC.pointsOne = null;   // QC单均扣分
        onStorePunish.AllQC.perOne = null;  // 每单
        onStorePunish.AllQC.perTwo = null; // <=QC单均扣分
        onStorePunish.AllQC.pointsthree = null; // QC单均扣分<
        onStorePunish.AllQC.perThree = null; //  每单
        this.setState({ onStorePunish });  // 整体QC
        break;
      case 'renderOneQC':   // 单项QC
        onStorePunish.OneQC.type = null;  // QC罚款类型为
        onStorePunish.OneQC.per = null; // 每单扣除
        this.setState({ onStorePunish }); // 单项QC
        break;
      case 'renderUGC': // UGC评分
        onStorePunish.UGC.site = null; // 站点单旬UGC评分
        onStorePunish.UGC.per = null; // 每单扣除
        this.setState({ onStorePunish }); // UGC评分
        break;
      case 'renderBreakRule':  // 操作违规
        onStorePunish.BreakRule.site = null;   // 站点单旬操作违规率
        onStorePunish.BreakRule.per = null; // 每单扣除
        this.setState({ onStorePunish }); // 操作违规
        break;
      case 'renderBadCommet':   // 用户差评率
        onStorePunish.BadCommet.site = null; // 站点用户差评率%
        onStorePunish.BadCommet.per = null;  // 每单扣除/元
        this.setState({ onStorePunish }); // 用户差评率
        break;
      case 'renderRed': // 红字运力计划
        onStorePunish.Red.per = null;  // 每单／元
        this.setState({ onStorePunish });  // 红字运力计划
        break;
      case 'renderNum': // 运力奖励扣罚     // 天       每单／元
        this.setState({ attendanceNum: [{ day: null, per: null }] });
        break;
      default:
        return '';
    }
  }

  // 接收储存惩罚项的值
  storePunish = (e, flag) => {
    const onStorePunish = _.cloneDeep(this.state.onStorePunish);  // 扣罚项的值
    switch (flag) {
      case 'QC': // QC
        onStorePunish.QC.per = e; // 每单
        this.setState({ onStorePunish }); // QC
        break;
      case 'AllQCPointsOne':  // 整体QC
        onStorePunish.AllQC.pointsOne = e;  // QC单均扣分
        this.setState({ onStorePunish });
        break;
      case 'AllQCPerOne':  // 每单
        onStorePunish.AllQC.perOne = e;
        this.setState({ onStorePunish });
        break;
      case 'AllQCPerTwo':   // <=QC单均扣分
        onStorePunish.AllQC.perTwo = e;
        this.setState({ onStorePunish });
        break;
      case 'AllQCPointsThree':  // QC单均扣分<
        onStorePunish.AllQC.pointsThree = e;
        this.setState({ onStorePunish });
        break;
      case 'AllQCPerThree':   //  每单
        onStorePunish.AllQC.perThree = e;
        this.setState({ onStorePunish });
        break;
      case 'OneQCType':  // QC罚款类型为
        onStorePunish.OneQC.type = e;
        this.setState({ onStorePunish });
        break;
      case 'OneQCPer':  // 每单扣除
        onStorePunish.OneQC.per = e;
        this.setState({ onStorePunish });
        break;
      case 'UGCSite': // 站点单旬UGC评分
        onStorePunish.UGC.site = e;
        this.setState({ onStorePunish });
        break;
      case 'UGCPer':  // 每单扣除
        onStorePunish.UGC.per = e;
        this.setState({ onStorePunish });
        break;
      case 'BreakRuleSite':  // 站点单旬操作违规率
        onStorePunish.BreakRule.site = e;
        this.setState({ onStorePunish });
        break;
      case 'BreakRulePer': // 每单扣除
        onStorePunish.BreakRule.per = e;
        this.setState({ onStorePunish });
        break;
      case 'BadCommetSite': // 用户差评率
        onStorePunish.BadCommet.site = e;
        this.setState({ onStorePunish });
        break;
      case 'BadCommetPer': // 每单扣除/元
        onStorePunish.BadCommet.per = e;
        this.setState({ onStorePunish });
        break;
      case 'RedPer':  // 红字运力计划 每单／元
        onStorePunish.Red.per = e;
        this.setState({ onStorePunish });
        break;
      case 'NumNum':  // 运力奖励扣罚
        onStorePunish.Num.num = e;
        this.setState({ onStorePunish });
        break;
      case 'NumPer':   // 运力奖励扣罚每单
        onStorePunish.Num.per = e;
        this.setState({ onStorePunish });
        break;
      default:
        return '';
    }
  }

  // select 选项变更
  handleChange = (value) => {
    this.setState({ confirmPunishSelect: value }); // select onchange接收到的值
  }

  // 展示窗口
  showModal = () => {   // 扣罚项模版显示的值
    this.setState({
      visible: true,
      confirmPunishSelect: this.state.confirmPunishOk, // 扣罚项模版显示的值
    });
  }

  // 取消窗口
  handleCancel = () => {
    this.setState({
      visible: false,
      confirmPunishSelect: this.state.confirmPunishOk, // 扣罚项模版显示的值
    });
  }

  // 添加扣罚项的确定窗口回调
  handleOk = () => {
    const onStorePunish = _.cloneDeep(this.state.onStorePunish); // 存储扣罚项的值
    const confirmPunishSelect = this.state.confirmPunishSelect; // select onchange接收到的值

    // 1,2,3,4,5,6对应枚举值，定义文件为./transPunishItem.js

    // 判断模版列表里是否包含对应项，如果不包含就讲该项值清空
    // QC
    if (!confirmPunishSelect.includes('1')) {
      onStorePunish.QC.per = null;  // 每单
      this.setState({ onStorePunish });
    }
    // 整体qc
    if (!confirmPunishSelect.includes('2')) {
      onStorePunish.AllQC.pointsOne = null;  // QC单均扣分
      onStorePunish.AllQC.perOne = null;   // 每单
      onStorePunish.AllQC.perTwo = null;  // <=QC单均扣分
      onStorePunish.AllQC.pointsthree = null; // QC单均扣分<
      onStorePunish.AllQC.perThree = null; //  每单
      this.setState({ onStorePunish });
    }
     // 单项QC
    if (!confirmPunishSelect.includes('3')) {
      onStorePunish.OneQC.type = null; // QC罚款类型为
      onStorePunish.OneQC.per = null; // 每单扣除
      this.setState({ onStorePunish });
    }
    // UGC评分
    if (!confirmPunishSelect.includes('4')) {
      onStorePunish.UGC.site = null;// 站点单旬UGC评分
      onStorePunish.UGC.per = null; // 每单扣除
      this.setState({ onStorePunish });
    }
    // 操作违规
    if (!confirmPunishSelect.includes('5')) {
      onStorePunish.BreakRule.site = null; // 站点单旬操作违规率
      onStorePunish.BreakRule.per = null; // 每单扣除
      this.setState({ onStorePunish });
    }
     // 用户差评率
    if (!confirmPunishSelect.includes('6')) {
      onStorePunish.BadCommet.site = null; // 站点用户差评率%
      onStorePunish.BadCommet.per = null;  // 每单扣除/元
      this.setState({ onStorePunish });
    }
    // 红字运力计划
    if (!confirmPunishSelect.includes('7')) {
      onStorePunish.Red.per = null; // 每单／元
      this.setState({ onStorePunish });
    }
    // 运力奖励扣罚
    if (!confirmPunishSelect.includes('8')) {
      this.setState({ attendanceNum: [{ day: null, per: null }] });
    }                                       // 天       每单／元
    this.setState({ visible: false, // 关闭选择扣罚项的表单
      confirmPunishOk: this.state.confirmPunishSelect, // select onchange接收到的值
    });
  }

  // 扣罚项枚举值
  getPunishSelect = (component) => {
    switch (component) {
      case PunishNumber.renderQC:   // QC
        return this.renderQC();
      case PunishNumber.renderAllQC:  // 整体qc
        return this.renderAllQC();
      case PunishNumber.renderOneQC: // 单项QC
        return this.renderOneQC();
      case PunishNumber.renderUGC: // UGC评分
        return this.renderUGC();
      case PunishNumber.renderBreakRule: // 操作违规
        return this.renderBreakRule();
      case PunishNumber.renderBadCommet: // 用户差评率
        return this.renderBadCommet();
      case PunishNumber.renderRed: // 红字运力计划
        return this.renderRed();
      case PunishNumber.renderNum: // 运力奖励扣罚
        return this.renderNum();
      default:
        return '';
    }
  }

  // 提交时检测扣罚项有多少项的枚举址
  putPunishSelect = (component) => {
    switch (component) {
      case PunishNumber.renderQC: // QC
        return 'QC';
      case PunishNumber.renderAllQC: // 整体qc
        return 'AllQC';
      case PunishNumber.renderOneQC: // 单项QC
        return 'OneQC';
      case PunishNumber.renderUGC: // UGC评分
        return 'UGC';
      case PunishNumber.renderBreakRule: // 操作违规
        return 'BreakRule';
      case PunishNumber.renderBadCommet: // 用户差评率
        return 'BadCommet';
      case PunishNumber.renderRed: // 红字运力计划
        return 'Red';
      case PunishNumber.renderNum: // 运力奖励扣罚
        return 'Num';
      default:
        return '';
    }
  }

  // 提交按钮
  onSubmit = () => {
    // ！！以下功能都是为了验证提交的数据是不是空，没有用到表单都用的State因此要自己验证
    // 包含所有要提交数据的验证
    // 判断扣罚项有没有没填项
    let isPunishEmpty = true;
    // 判断X1有没有没填项
    let isX1Empty = true;
    // 判断X2有没有没填项
    let isX2Empty = true;
    // 将展示的扣罚项加到数组
    const whichPunish = {};
    // 将扣罚项所有项的值保存到whichPunish
    dot.get(this, 'state.confirmPunishOk', []).forEach((item) => {
      // 8-运力奖励扣罚 判断扣罚项中有没有运力奖励扣罚，因为运力奖励扣罚项的值的读取路径和扣罚项其他路径不同
      if (item === '8') {
        whichPunish[this.putPunishSelect(item)] = this.state.attendanceNum;
      } else {
        // 如果没有运力奖励扣罚
        whichPunish[this.putPunishSelect(item)] =
        this.state.onStorePunish[this.putPunishSelect(item)];
      }
    });
    // 扣罚项
    // 遍历对象看有没有空的属性，发现空属性就判断扣罚项有空
    for (const i in whichPunish) {
      // Num- 运力奖惩扣罚项   如果是运力奖惩扣罚项，因为选项多少不定，所以要循环全部
      if (i === 'Num') {
        // 因为运力奖惩扣罚项是二维数组所以要再次循环遍历
        for (const j in whichPunish[i]) {
          for (const k in whichPunish[i][j]) {
             // 如果有null或则空字符串则扣罚项有空值
            if (whichPunish[i][j][k] == null || whichPunish[i][j][k] === '') {
               // 扣罚项有空值
              isPunishEmpty = false;
            }
          }
        }
      } else {
         // 如果不是运力奖惩扣罚项，则都是一纬数组，因此循环遍历就行
        for (const j in whichPunish[i]) {
          if (whichPunish[i][j] == null || whichPunish[i][j] === '') {
            // 扣罚项有空
            isPunishEmpty = false;
          }
        }
      }
    }
      // 如果是扣罚项 60082-扣罚项
      // 城市不为空
    if (this.state.kpiType === '60082') {
      // 判断城市，模版，时间，扣罚项是否有空项
      if (this.state.whichCity != null && dot.get(this, 'state.whichCity.length') !== 0
      // 时间不为空
        && this.state.selectTime != null && this.state.selectTime !== ''
         // 扣罚项不能一项不选
        && isPunishEmpty && dot.get(this, 'state.confirmPunishOk.length') !== 0
      ) {
        // 关闭提交框
        this.setState({ visibleConfirm: false });
        // 将数据提交后台
        this.transformData();
      } else {
         // 数据有空提示填写全部信息
        message.warning('请填写全部信息');
      }
    }
    // 判断运力计划X1有没有空项，如果有就isX1Empty为false
    dot.get(this, 'state.transport', []).forEach((item) => {
      if (item.day == null || item.day === '' || item.per == null || item.per === '') {
        // 判断运力计划x1的每单／每天都不为空
        // 运力计划x1为空
        isX1Empty = false;
      }
    });
     // 判断是实效达成X2有没有空项
    dot.get(this, 'state.prescription', []).forEach((item) => {
      if (item.day == null || item.day === '' || item.per == null || item.per === ''
        && item.ontime == null || item.ontime === '' || item.average == null || item.average === '') {
          // 订单准时率  平均配送时长  单循达成实效要求天数 每单
          // 实效达成X2为空
        isX2Empty = false;
      }
    });
     // 判断nx3基本信息有没有空
       // 判断城市，模版，时间，扣罚项是否有空项
    if (this.state.whichCity != null && dot.get(this, 'state.whichCity.length') !== 0
      && this.state.selectTime != null && this.state.selectTime !== ''
      && isPunishEmpty && dot.get(this, 'state.onSelectNX3.distribution') != null
    ) {
      // 60011-限时达
       // 判断如果是限时达，则只需商圈类型，商圈等级，基础n值是否空
      if (dot.get(this, 'state.onSelectNX3.distribution') === '60011') {
        if (dot.get(this, 'state.onSelectNX3.platformGrade') != null && dot.get(this, 'state.onSelectNX3.platformType') != null
          && this.state.basicsN != null && this.state.basicsN !== '') {
            // 60081-nx3设置
          if (this.state.kpiType === '60081') {
            // 关闭提交窗
            this.setState({ visibleConfirm: false });
            // 数据提交后台
            this.transformData();
          } // 60081-nx3设置
        } else if (this.state.kpiType === '60081') { message.warning('请填写全部信息'); }
      } else if (dot.get(this, 'state.onSelectNX3.platformGrade') != null && dot.get(this, 'state.onSelectNX3.platformType') != null
           // 基础家n值
          && this.state.basicsN != null && this.state.basicsN !== ''
          // 最差10%达成-X3
          && dot.get(this, 'state.onSelectNX3.distributionTime') != null
            // 小时
          && dot.get(this, 'state.tenPercent.hour') != null && dot.get(this, 'state.tenPercent.hour') !== ''
           // 天使
          && dot.get(this, 'state.tenPercent.day') != null && dot.get(this, 'state.tenPercent.day') !== ''
          // 单价
          && dot.get(this, 'state.tenPercent.per') != null && dot.get(this, 'state.tenPercent.per') !== '') {
              // 判断商圈类型是不是独家，独家不需要判断X1
        if (dot.get(this, 'state.onSelectNX3.platformType') === '60031') {
          if (isX2Empty) {
              // 60031-独家
               // 60081-nx3设置
            if (this.state.kpiType === '60081') {
              this.setState({ visibleConfirm: false });
               // 提交服务器
              this.transformData();
            }
          // 60081-nx3设置
          } else if (this.state.kpiType === '60081') { message.warning('请填写全部信息'); }
        } else if (isX1Empty && isX2Empty) {
          if (this.state.kpiType === '60081') {
            this.setState({ visibleConfirm: false });
            this.transformData();
          }
           // 60081-nx3设置
        } else if (this.state.kpiType === '60081') { message.warning('请填写全部信息'); }
      } else if (this.state.kpiType === '60081') { message.warning('请填写全部信息'); }
    } else if (this.state.kpiType === '60081') { message.warning('请填写全部信息'); }
  }

  // 取消提交对话框
  handleCancelConfirm = () => {
    this.setState({ visibleConfirm: false });
  }

  // 确认提交对话框
  handleOkConfirm = () => {
    this.setState({ visibleConfirm: true });
  }

  // ------------------------------------------------------render-----------------------
  // 渲染顶部提示信息
  renderUsageInfo = () => {
    const props = {
      message: 'kpi模版设置前，请先前往【操作管理】上传所需的‘运力计划下限’和‘红字运力计划’。',
      type: 'info',
      showIcon: true,
    };        // antd api
    return (
      <Alert {...props} style={{ marginBottom: '10px' }} />
    );
  }

  // 渲染模版范围
  renderRange = () => {
    const { city_list } = this.state;
    const { selectWhichTemplate, selectWhichCity, onSelectTime, selectKpiType } = this;
    return (
      <CoreContent key="range" title="模版适用范围" style={{ backgroundColor: '#FAFAFA' }}>
        <Row type="flex" align="middle">
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>选择模版：</Col>
          <Col span={4}>
            <Select defaultValue="1" onChange={selectWhichTemplate}>
              <Option value="1">模版一</Option>
            </Select>
          </Col>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>kpi类型选择：</Col>
          <Col span={4}>
            <Select value={this.state.kpiType} onChange={selectKpiType}>
              {/* 60081-N-X3设置 60082-kpi扣罚项 */}
              <Option value="60081">N-X3设置</Option>
              <Option value="60082">kpi扣罚项</Option>
            </Select>
          </Col>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>城市：</Col>
          <Col span={4}>
            <Select mode="multiple" placeholder="请选择城市" onChange={selectWhichCity}>
              {
                // 城市列表
                city_list.map((item, index) => (
                  <Option value={item.city_spelling} key={item.city_spelling}>{item.city_name}</Option>
                ))
              }
            </Select>
          </Col>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>生效日期：</Col>
          <Col span={4}>
            <DatePicker onChange={onSelectTime} />
          </Col>
        </Row>
      </CoreContent>
    );
  }

  // NX3选择列表
  renderNX3Select = () => {
    const { onSelectNX3, district_level } = this.state;
    const { onDistribution, onDistributionTime, onPlatformType, onPlatformGrade } = this;
    return (
      <CoreContent key="NX3" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>订单类型：</Col>
          <Col span={4}>
            {/* 60010-定时达 60011-限时达 */}
            <Select defaultValue="60010" onChange={onDistribution}>
              <Option value="60010" key="60010">定时达</Option>
              <Option value="60011" key="60011">限时达</Option>
            </Select>
          </Col>

          {
            // 定时达能选择骑士工作类型 60020-白班，60021-夜班， 60022-不区分
            onSelectNX3.distribution === '60010' ?
              <div>
                <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>骑士类型：</Col>
                <Col span={4}>
                  <Select defaultValue="60020" onChange={onDistributionTime}>
                    <Option value="60020" key="60020">白班</Option>
                    <Option value="60021" key="60021">夜班</Option>
                    <Option value="60022" key="60022">不区分</Option>
                  </Select>
                </Col>
              </div> : null
          }

          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>商圈类型：</Col>
          <Col span={4}>
            <Select defaultValue="60031" onChange={onPlatformType}>
              {/* 60031-独家 60032-非独家 60033-无商圈类型 */}
              <Option value="60031" key="60031">独家</Option>
              <Option value="60032" key="60032">非独家</Option>
              <Option value="60033" key="60033">无商圈类型</Option>
            </Select>
          </Col>

          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>商圈等级：</Col>
          <Col span={4}>
            <Select onChange={onPlatformGrade}>
              {
                district_level.map(item => (
                  <Option value={item.name} key={item._id}>{item.name}级</Option>
                ))
              }
            </Select>
          </Col>
        </Row>
      </CoreContent>
    );
  }

// 生成基础价N值渲染
  renderN = () => {
    const { basicsN } = this.state;
    const { setBasicsN } = this;
    return (
      <CoreContent key="renderN" title="基础价-N值" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>每单：</Col>
          <Col span={2}>
            <InputNumber value={basicsN} onChange={setBasicsN} />元
        </Col>
        </Row>
      </CoreContent>
    );
  }

// 生成运力达成X1
  renderX1 = () => {
    const { X1Options, transport } = this.state;
    const { getTransport, addTransport, removeTransport } = this;
    return (
      <CoreContent key="renderX1" title="运力达成-X1" style={{ backgroundColor: '#FAFAFA' }}>
        <TransportCapacity
          X1Options={X1Options}               // 1-10天的选项
          transport={transport}               // 运力达成X1值
          getTransport={getTransport}         // 得到值回调
          addTransport={addTransport}         // 增加一条回调
          removeTransport={removeTransport}   // 减少一条回调
        />
      </CoreContent>
    );
  }

  // 生成实效达成X2
  renderX2 = () => {
    // 实效达成X2数据
    const { prescription } = this.state;

    // 传入组件的回调函数
    const {
      getPrescription,    // 取值
      addPrescription,    // 增加一个
      removePrescription,  // 删除一个
    } = this;
    return (
      <CoreContent key="renderX2" title="实效达成-X2" style={{ backgroundColor: '#FAFAFA' }}>
        <TimeReach
          prescription={prescription}             // 实效达成X2数据
          getPrescription={getPrescription}       // 取值
          addPrescription={addPrescription}       // 增加一个
          removePrescription={removePrescription} // 删除一个
        />
      </CoreContent>
    );
  }

  // 生成最差10%达成X3
  renderX3 = () => {
    const { hour, day, per } = this.state.tenPercent;
    const { setTenPercent } = this;
    return (
      <CoreContent key="renderX3" title="最差10%达成-X3" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={3} style={{ lineHeight: '28px', textAlign: 'right' }}>
          站点单旬最末10%配送时长&lt;=
        </Col>
          <Col span={3}>
            <InputNumber precision={0} value={hour} onChange={(value) => { setTenPercent(value, 'hour'); }} />分钟
        </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          且&gt;
        </Col>
          <Col span={4}>
            <InputNumber precision={0} value={day} onChange={(value) => { setTenPercent(value, 'day'); }} />天
        </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单
        </Col>
          <Col span={4}>
            <InputNumber value={per} onChange={(value) => { setTenPercent(value, 'per'); }} />元
        </Col>
        </Row>
      </CoreContent>
    );
  }

  // 渲染NX3模版 根据订单类型和商圈类型渲染
  renderNX3 = () => {
    const { distribution, platformType } = this.state.onSelectNX3;
    const { getComponent } = this;
    let items = [
      Components.renderN,   // 基础价n值
      Components.renderX1,  // 运力达成x1
      Components.renderX2,  // 实效达成x2
      Components.renderX3,  // 最初10%达成x3
    ];

    // 如果订单类型是限时达，只渲染基础价N值  60011-限时达。60031-独家
    if (distribution === '60011') {
      items = [Components.renderN];
    }

    // 如果商圈类型是独家，不渲染运力达成X1 60011-限时达。60031-独家
    if (platformType === '60031' && distribution !== '60011') {
      items = [
        Components.renderN,     // 基础价n值
        Components.renderX2,    // 实效达成2
        Components.renderX3,    // 最初10%达成x3
      ];
    }

    const result = [];
    items.forEach((component) => {
      result.push(getComponent(component));
    });
    return result;
  }

  // 生成QC
  renderQC = () => {
    const { QC } = this.state.onStorePunish;
    const { storePunish } = this;
    const ext = (
      <Popconfirm
        title={<p>你确定要删除该项吗？</p>}
        onConfirm={() => { this.removeQC('renderQC'); }}
        okText="确认"
        cancelText="取消"
      >
        <Button>删除</Button>
      </Popconfirm>
    );
    return (
      <CoreContent key="renderQC" title="QC" titleExt={ext} style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>每分扣除：</Col><Col span={6}><InputNumber defaultValue={QC.per} onChange={(e) => { storePunish(e, 'QC'); }} />元</Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成整体QC
  renderAllQC = () => {
    const { AllQC } = this.state.onStorePunish;
    const { storePunish } = this;
    const ext = (
      <Popconfirm
        title={<p>你确定要删除该项吗？</p>}
        onConfirm={() => { this.removeQC('renderAllQC'); }}
        okText="确认"
        cancelText="取消"
      >
        <Button>删除</Button>
      </Popconfirm>
    );
    return (
      <CoreContent key="renderAllQC" titleExt={ext} title="整体QC" style={{ backgroundColor: '#FAFAFA' }}>
        <Row style={{ marginBottom: '10px' }}>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          QC单均扣分&gt;</Col><Col span={6}><InputNumber defaultValue={AllQC.pointsOne} onChange={(e) => { storePunish(e, 'AllQCPointsOne'); }} />
          </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单：</Col><Col span={3}><InputNumber defaultValue={AllQC.perOne} onChange={(e) => { storePunish(e, 'AllQCPerOne'); }} />元
        </Col>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Col span={2}>
            <InputNumber value={AllQC.pointsOne} /></Col><Col span={2} style={{ lineHeight: '28px', textAlign: 'left' }}>&lt;=QC单均扣分&lt;</Col><Col span={4}><InputNumber value={AllQC.pointsThree} />
            </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单：</Col><Col span={3}><InputNumber defaultValue={AllQC.perTwo} onChange={(e) => { storePunish(e, 'AllQCPerTwo'); }} />元
        </Col>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          QC单均扣分&lt;</Col><Col span={6}><InputNumber defaultValue={AllQC.pointsThree} onChange={(e) => { storePunish(e, 'AllQCPointsThree'); }} />
          </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单：</Col><Col span={3}><InputNumber defaultValue={AllQC.perThree} onChange={(e) => { storePunish(e, 'AllQCPerThree'); }} />元
        </Col>
        </Row>
      </CoreContent>
    );
  }

// 生成单项QC
  renderOneQC = () => {
    const { OneQC } = this.state.onStorePunish;
    const { OneQCTemplate } = this.state;
    const { storePunish } = this;
    const ext = (
      <Popconfirm
        title={<p>你确定要删除该项吗？</p>}
        onConfirm={() => { this.removeQC('renderOneQC'); }}
        okText="确认"
        cancelText="取消"
      >
        <Button>删除</Button>
      </Popconfirm>
  );
    return (
      <CoreContent key="renderOneQC" titleExt={ext} title="单项QC" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          QC罚款类型为：</Col>
          <Col span={6}>
            <Select defaultValue={OneQC.type} onChange={(e) => { storePunish(e, 'OneQCType'); }}>
              {OneQCTemplate.map(item => (
                <Option value={item.value} key={item.value}>{item.name}</Option>
            ))}
            </Select>
          </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单扣除：</Col><Col span={6}><InputNumber defaultValue={OneQC.per} onChange={(e) => { storePunish(e, 'OneQCPer'); }} />元
        </Col>
        </Row>
      </CoreContent>
    );
  }

// 生成UGC评分
  renderUGC= () => {
    const { UGC } = this.state.onStorePunish;
    const { storePunish } = this;
    const ext = (
      <Popconfirm
        title={<p>你确定要删除该项吗？</p>}
        onConfirm={() => { this.removeQC('renderUGC'); }}
        okText="确认"
        cancelText="取消"
      >
        <Button>删除</Button>
      </Popconfirm>
  );
    return (
      <CoreContent key="renderUGC" titleExt={ext} title="UGC评分" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          站点单旬UGC评分&lt;</Col><Col span={6}><InputNumber defaultValue={UGC.site} onChange={(e) => { storePunish(e, 'UGCSite'); }} />
          </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单扣除：</Col><Col span={6}><InputNumber defaultValue={UGC.per} onChange={(e) => { storePunish(e, 'UGCPer'); }} />元
        </Col>
        </Row>
      </CoreContent>
    );
  }

// 生成操作违规
  renderBreakRule = () => {
    const { BreakRule } = this.state.onStorePunish;
    const { storePunish } = this;
    const ext = (
      <Popconfirm
        title={<p>你确定要删除该项吗？</p>}
        onConfirm={() => { this.removeQC('renderBreakRule'); }}
        okText="确认"
        cancelText="取消"
      >
        <Button>删除</Button>
      </Popconfirm>
  );
    return (
      <CoreContent key="renderBreakRule" titleExt={ext} title="操作违规" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          站点单旬操作违规率&gt;</Col><Col span={6}><InputNumber precision={0} defaultValue={BreakRule.site} onChange={(e) => { storePunish(e, 'BreakRuleSite'); }} />%
        </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单扣除：</Col><Col span={6}><InputNumber defaultValue={BreakRule.per} onChange={(e) => { storePunish(e, 'BreakRulePer'); }} />元
        </Col>
        </Row>
      </CoreContent>
    );
  }

// 生成用户差评率
  renderBadCommet = () => {
    const { BadCommet } = this.state.onStorePunish;
    const { storePunish } = this;
    const ext = (
      <Popconfirm
        title={<p>你确定要删除该项吗？</p>}
        onConfirm={() => { this.removeQC('renderBadCommet'); }}
        okText="确认"
        cancelText="取消"
      >
        <Button>删除</Button>
      </Popconfirm>
  );
    return (
      <CoreContent key="renderBadCommet" titleExt={ext} title="用户差评率" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          站点用户差评率&gt;</Col><Col span={6}><InputNumber precision={0} defaultValue={BadCommet.site} onChange={(e) => { storePunish(e, 'BadCommetSite'); }} />%
        </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单扣除：</Col><Col span={6}><InputNumber defaultValue={BadCommet.per} onChange={(e) => { storePunish(e, 'BadCommetPer'); }} />元
        </Col>
        </Row>
      </CoreContent>
    );
  }

// 生成红字运力计划
  renderRed = () => {
    const { Red } = this.state.onStorePunish;
    const { redMessage } = this.state;
    const { storePunish } = this;
    const ext = (
      <Popconfirm
        title={<p>你确定要删除该项吗？</p>}
        onConfirm={() => { this.removeQC('renderRed'); }}
        okText="确认"
        cancelText="取消"
      >
        <Button>删除</Button>
      </Popconfirm>
  );
    return (
      <CoreContent key="renderRed" titleExt={ext} title="红字运力计划" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={8} style={{ lineHeight: '28px', textAlign: 'center' }}>
            {redMessage}&lt;红字运力计划
        </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
          每单扣除：</Col><Col span={6}><InputNumber defaultValue={Red.per} onChange={(e) => { storePunish(e, 'RedPer'); }} />元
        </Col>
        </Row>
      </CoreContent>
    );
  }

// 生成出勤人数奖励
  renderNum = () => {
    const { attendanceNum } = this.state;
        // 出勤人数奖励的  取值      增加一项            删除一项
    const { getattendanceNum, addattendanceNum, removeattendanceNum } = this;
    const ext = (
      <Popconfirm
        title={<p>你确定要删除该项吗？</p>}
        onConfirm={() => { this.removeQC('renderNum'); }}
        okText="确认"
        cancelText="取消"
      >
        <Button>删除</Button>
      </Popconfirm>
  );
    return (
      <CoreContent key="renderNum" titleExt={ext} title="运力奖励扣罚" style={{ backgroundColor: '#FAFAFA' }}>
        <Attendance
          attendanceNum={attendanceNum}
          getattendanceNum={getattendanceNum}
          addattendanceNum={addattendanceNum}
          removeattendanceNum={removeattendanceNum}
        />
      </CoreContent>
    );
  }

// 扣罚项添加模版
  renderPunishSelect = () => {
    const { visible, confirmPunishSelect, onPunishSelect } = this.state;
    const { showModal, handleOk, handleCancel, handleChange } = this;
    return (
      <div>
        <Button type="primary" style={{ marginBottom: '10px' }} onClick={showModal}>添加考核类型</Button>
        <Modal
          title="添加考核类型"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Select
            style={{ width: '100%' }}
            mode="multiple"
            placeholder="请选择考核类型"
            value={confirmPunishSelect}
            onChange={handleChange}
          >
            {onPunishSelect.map(item => (
              <Option value={item.value} key={item.value}>{item.name}</Option>
          ))}
          </Select>
        </Modal>
      </div>
    );
  }

// 渲染扣罚项模版
  renderPunish = () => {
    const { getPunishSelect } = this;
    const items = this.state.confirmPunishOk;
    const result = [];
    items.forEach((component) => {
      result.push(getPunishSelect(component));
    });
    return result;
  }

// 渲染nx-3模版设置
  renderNX3N = () => {
    return (
    this.renderNX3Select(),
    this.renderNX3()
    );
  }

// 渲染扣罚项
  renderPunishAll = () => {
    return (
    this.renderPunishSelect(),
    this.renderPunish()
    );
  }
  // 渲染提交项
  renderSubmit = () => {
    const { visibleConfirm, visibleKpi } = this.state;
    const { onSubmit, handleOkConfirm, handleCancelConfirm, kpiHandleok, kpiHandleCancel } = this;
    return (
      <Row type="flex" justify="center">
        <Col>
          <Button onClick={handleOkConfirm} type="primary">提交</Button>
        </Col>
        <Modal
          title="确认要提交吗"
          visible={visibleConfirm}
          onOk={onSubmit}
          onCancel={handleCancelConfirm}
        >
          <p>只有填完全部信息才可以提交哦...</p>
        </Modal>
        <Modal
          title="是否切换"
          visible={visibleKpi}
          onOk={kpiHandleok}
          onCancel={kpiHandleCancel}
        >
          <p>确定即切换，取消或关闭即页面保持不变</p>
        </Modal>
      </Row>
    );
  }

  render() {
    return (
      <div>
        <Form>
          {/* 页面提示 */}
          {this.renderUsageInfo()}
          {/* 模版适用范围 */}
          {this.renderRange()}
          {/* NX3的选择列表  60081- NX3设置*/}
          {this.state.kpiType === '60081' ? this.renderNX3Select() : null}
          {/* NX3渲染列表 60081- NX3设置**/}
          {this.state.kpiType === '60081' ? this.renderNX3() : null}
          {/* 扣罚项生成选项 60082-扣罚项设置*/}
          {this.state.kpiType === '60082' ? this.renderPunishSelect() : null}
          {/* 扣罚项渲染列表 60082-扣罚项设置*/}
          {this.state.kpiType === '60082' ? this.renderPunish() : null}
          {/* 提交按钮渲染 */}
          {this.renderSubmit()}
        </Form>
      </div>
    );
  }
}
function mapStateToProps({ operationManage }) {
  return { operationManage };
}
export default connect(mapStateToProps)(BuildKpi);
