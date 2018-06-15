/**
 * kpi详情
 *
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select, Form, Button, Modal, Alert, Row, Col } from 'antd';
import _ from 'lodash';

import { authorize } from '../../../application';
import { CoreContent } from '../../../components/core';
import TransportCapacity from './detailItems/items/transportCapacity';
import TimeReach from './detailItems/items/timeReach';
import Attendance from './detailItems/items/attendance';
import transInt from './transInt';
import { transPunishNumber } from './transPunishItem';
import { Components, PunishNumber } from './enumeration';
import {
  transformX1Cont,
  transformX2Cont,
  transformX3Cont,
  transformQCCont,
  transformOneQCCont,
  transformUGCCont,
  transformBreakRuleCont,
  transformBadCommetCont,
  transformAttendanceNumCont,
} from './utils';

// const trueflag = true;
const { Option } = Select;

class detailKpi extends Component {
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
      OneQCTemplate: [
        { value: '60001', name: '未使用餐箱取餐' },
        { value: '60002', name: '无健康证' },
        { value: '60003', name: '未按要求编制编码' },
        { value: '60004', name: '无头盔' },
        { value: '60005', name: '无臂章' },
        { value: '60006', name: '未穿工服' },
        { value: '60007', name: '抽烟' },
      ],
      confirmPunishSelect: [],                      // select onchange接收到的值
      confirmPunishOk: [],                          // 扣罚项模版显示的值
      visible: false,                               // 控制弹窗的值
      redMessage: '日均有效出勤数',
      X1Options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // X1可选择范围
      receiveState: dot.get(props, 'operationManage.templateDetail'),
      // -----------------------------存值位置--------------------------------------
      whichCity: [],                                // [] 选择城市
      whichTemplate: '1',                           // 选择模版
      selectTime: null,                             // ''  选择生效时间
      kpiType: '60081',                             // kpi模版类型

      // NX3设置
      onSelectNX3: {                                // NX3设置
        distribution: '60010',                      // 订单类型
        distributionTime: '60020',                  // 骑士类型
        platformType: '60031',                      // 商圈类型
        platformGrade: null,                        // 商圈等级
      },

      // 扣罚项设置
      basicsN: 3,                                   // 基础N值     int
      transport: [{ day: '1', per: 2 }, { day: '2', per: 3 }],                // 运力达成x1
      prescription: [{ ontime: null, average: null, day: null, per: null }],  // 时效达成x2
      tenPercent: { hour: null, day: null, per: null },                       // 最差10%
      onStorePunish: {                              // 存储扣罚项的值
        QC: { per: null },                          // QC
        AllQC: {                                    // 整体QC
          pointsOne: null,                          // 第一排单均扣分
          perOne: null,                             // 第一排每单
          perTwo: null,                             // 第二排每单
          pointsThree: null,                        // 第三排单均扣分
          perThree: null },                         // 第三排每单
        OneQC: { type: '60001', per: null },        // 单项QC
        UGC: { site: null, per: null },             // UGC评分
        BreakRule: { site: null, per: null },       // 操作违规
        BadCommet: { site: null, per: null },       // 差评率
        Red: { per: null },                         // 红字运力
      },
      attendanceNum: [{ day: null, per: null }],    // 扣罚项--运力奖励扣罚
    };
  }
// ----------------------------------------X1和X2的组件传入函数-------------------
  componentWillReceiveProps = (nextProps) => {
    // 获得kpi模版详情
    this.transformState(dot.get(nextProps, 'operationManage.templateDetail'));
  }
  componentDidMount = () => {
    this.transformState(this.state.receiveState);
  }
  // 转换接口数据为state
  transformState = (resultMock) => {
    const result = resultMock;    // 传到后台的对象
    result.account_id = authorize.account.id;   // account_id

    // 模版适用范围
    const whichTemplate = result && result.template_type && result.template_type.toString();   // 模版选择 int
    const whichCity = result.city_list[0].city_name;          // 选择城市列表
    const selectTime = result.date;           // 生效日期

    // NX3设置
    const onSelectNX3 = {};
    onSelectNX3.distribution = result.order_type && result.order_type.toString(); // 订单类型 int
    onSelectNX3.distributionTime = result.knight_type === null ? null : (result.knight_type && result.knight_type.toString()); // 骑士类型 int
    onSelectNX3.platformType = result.baidu_biz_district_type && result.baidu_biz_district_type.toString(); // 商圈类型 int
    onSelectNX3.platformGrade = result.biz_district_level;  // 商圈等级['A', 'B', 'C', 'D']


    const basicsN = result.base_price_n_value;  // 基础价N  int
    const transport = result.transport_capacity_reached_x1.logics && transformX1Cont(result.transport_capacity_reached_x1.logics); // 运力达成x1
    const prescription = result.time_reach_x2.logics && transformX2Cont(result.time_reach_x2.logics);   // 实效达成X2
    const tenPercent = result.worst_ten_percent_x3.logics && transformX3Cont(result.worst_ten_percent_x3.logics);  // 最差10%达成

    // 扣罚项
    const onStorePunish = {};
    onStorePunish.QC = { per: result.qc };  // QC
    onStorePunish.AllQC = result.whole_qc.logics && transformQCCont(result.whole_qc.logics);  // 整体qc
    onStorePunish.OneQC = result.single_qc && transformOneQCCont(result.single_qc);  // 单项qc
    onStorePunish.UGC = result.ugc_score.logics && transformUGCCont(result.ugc_score.logics); // ugc评分
    onStorePunish.BreakRule = result.operation_violation.logics && transformBreakRuleCont(result.operation_violation.logics); // 违规操作
    onStorePunish.BadCommet = result.user_differential_rate.logics && transformBadCommetCont(result.user_differential_rate.logics); // 用户差评率
    onStorePunish.Red = { per: result.red_letter_capacity_plan.logics }; // 红字运力计划
    const attendanceNum = result.attendance_award.logics && transformAttendanceNumCont(result.attendance_award.logics);  // 扣罚项奖励
    const confirmPunishOk = result.assessment_type_list && transPunishNumber(result.assessment_type_list);
    const kpiType = result.kpi_type.toString();
    this.setState({
      whichTemplate,
      whichCity,
      selectTime,
      onSelectNX3,
      basicsN,
      transport,
      prescription,
      tenPercent,
      onStorePunish,
      attendanceNum,
      confirmPunishOk,
      kpiType,
    });
    if (onSelectNX3.platformType === '60031') {   // 根据不同的订单类型，渲染不同的红字运力计划字段
      this.setState({ redMessage: '日均有效出勤数' });
    } else {
      this.setState({ redMessage: '日有效出勤数' });
    }
  }

  // NX3选择枚举值
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
    this.setState({ confirmPunishSelect: value });// select onchange接收到的值
  }

  // 展示窗口
  showModal = () => { // 扣罚项模版显示的值
    this.setState({ confirmPunishSelect: this.state.confirmPunishOk });
    this.setState({ visible: true });
  }

  // 取消窗口
  handleCancel = () => { // select onchange接收到的值
    this.setState({ visible: false });
    this.setState({ confirmPunishSelect: this.state.confirmPunishOk,
    });
  }

  // 添加扣罚项的确定窗口回调
  handleOk = () => {
    const onStorePunish = _.cloneDeep(this.state.onStorePunish); // 存储扣罚项的值
    const confirmPunishSelect = this.state.confirmPunishSelect; // select onchange接收到的值

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
      this.setState({ attendanceNum: [{
        day: null, // 天
        per: null,  //  每单／元
      }] });
    }
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
    // 返回列表页
    window.location.href = '/#/Handle/kpiTemplateList';
  }
  // -----------------------------------render-----------------------------------
  // 渲染顶部提示信息
  renderUsageInfo = () => {
    const props = {
      message: 'kpi模版设置前，请先前往【操作管理】上传所需的‘运力计划下限’和‘红字运力计划’。',
      type: 'info',
      showIcon: true,
    }; // antd api
    return (
      <Alert {...props} style={{ marginBottom: '10px' }} />
    );
  }

  // 渲染模版范围
  renderRange = () => {
    const { whichCity, selectTime } = this.state;
    return (
      <CoreContent key="range" title="模版适用范围" style={{ backgroundColor: '#FAFAFA' }} >
        <Row type="flex" align="middle">
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>选择模版：</Col>
          <Col span={4}>
            <span>模版一</span>
          </Col>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>kpi类型选择：</Col>
          <Col span={4}>
            <span>{this.state.kpiType === '60081' ? 'N-X3设置' : 'kpi扣罚项'}</span>
          </Col>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>城市：</Col>
          <Col span={4}>
            <span style={{ marginRight: '3px' }} >{whichCity}</span>
          </Col>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>生效日期：</Col>
          <Col span={4}>
            <span>{selectTime}</span>
          </Col>
        </Row>
      </CoreContent>
    );
  }

  // --------------------------------NX3渲染相关-----------------------------------
  // NX3选择列表
  renderNX3Select = () => {
    const { onSelectNX3 } = this.state;
    return (
      <CoreContent key="NX3" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>订单类型：</Col>
          <Col span={4}>
            <span style={{ lineHeight: '28px' }}>{transInt(onSelectNX3.distribution)}</span>
          </Col>
          {onSelectNX3.distribution === '60010' ?
            <div>
              <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>骑士类型：</Col>
              <Col span={4}>
                <span style={{ lineHeight: '28px' }}>{transInt(onSelectNX3.distributionTime)}</span>
              </Col>
            </div> : null
          }
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>商圈类型：</Col>
          <Col span={4}>
            <span style={{ lineHeight: '28px' }}>{transInt(onSelectNX3.platformType)}</span>
          </Col>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>商圈等级：</Col>
          <Col span={4}>
            <span style={{ lineHeight: '28px' }}>{onSelectNX3.platformGrade}</span>
          </Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成基础价N值渲染
  renderN = () => {
    const { basicsN } = this.state;
    return (
      <CoreContent key="renderN" title="基础价-N值" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col style={{ lineHeight: '28px', textAlign: 'right' }} span={2}>每单：</Col>
          <Col span={1}>
            <span style={{ lineHeight: '28px' }}>{basicsN}元</span>
          </Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成运力达成X1
  renderX1 = () => {
    const { transport } = this.state;
    return (
      <CoreContent key="renderX1" title="运力达成-X1" style={{ backgroundColor: '#FAFAFA' }}>
        <TransportCapacity
          transport={transport}
        />
      </CoreContent>
    );
  }

  // 生成实效达成X2
  renderX2 = () => {
    const { prescription } = this.state;
    return (
      <CoreContent key="renderX2" title="实效达成-X2" style={{ backgroundColor: '#FAFAFA' }}>
        <TimeReach
          prescription={prescription}
        />
      </CoreContent>
    );
  }

  // 生成最差10%达成X3
  renderX3 = () => {
    const { hour, day, per } = this.state.tenPercent;
    return (
      <CoreContent key="renderX3" title="最差10%达成-X3" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={3} style={{ lineHeight: '28px', textAlign: 'right' }}>
            站点单旬最末10%配送时长&lt;=
          </Col>
          <Col span={3}>
            <span style={{ lineHeight: '28px' }}>{hour}分钟</span>
            且&gt;
              <span style={{ lineHeight: '28px' }}>{day}天</span>
          </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }} />
          <Col span={4} />
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单：
          </Col>
          <Col span={4}>
            <span style={{ lineHeight: '28px' }}>{per}元</span>
          </Col>
        </Row>
      </CoreContent>
    );
  }

  // 渲染NX3模版 根据订单类型和商圈类型渲染
  renderNX3 = () => {
    const { getComponent } = this;
    let items = [
      Components.renderN, // 基础价n值
      Components.renderX1, // 运力达成x1
      Components.renderX2, // 实效达成x2
      Components.renderX3, // 最初10%达成x3
    ];

    // 如果订单类型是限时达，只渲染基础价N值
    if (dot.get(this, 'state.onSelectNX3.distribution') === '60011') {
      items = [Components.renderN];
    }

    // 如果商圈类型是独家，不渲染运力达成X1
    if (dot.get(this, 'state.onSelectNX3.platformType') === '60031' && dot.get(this, 'state.onSelectNX3.distribution') !== '60011') {
      items = [
        Components.renderN,   // 基础价n值
        Components.renderX2, // 实效达成2
        Components.renderX3, // 最初10%达成x3
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
    return (
      <CoreContent key="renderQC" title="QC" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>每分扣除：</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{QC.per}元</span></Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成整体QC
  renderAllQC = () => {
    const { AllQC } = this.state.onStorePunish;
    return (
      <CoreContent key="renderAllQC" title="整体QC" style={{ backgroundColor: '#FAFAFA' }}>
        <Row style={{ marginBottom: '10px' }}>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            QC单均扣分&gt;</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{AllQC.pointsOne}</span>
            </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单：</Col><Col span={3}><span style={{ lineHeight: '28px' }}>{AllQC.perOne}元</span>
            </Col>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Col span={1}><span style={{ lineHeight: '28px' }}>{AllQC.pointsOne}</span></Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'left' }}>&lt;=QC单均扣分&lt;</Col>
          <Col span={5}><span style={{ lineHeight: '28px' }}>{dot.get(this, 'state.onStorePunish.AllQC.pointsThree')}</span></Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单：</Col><Col span={3}><span style={{ lineHeight: '28px' }}>{AllQC.perTwo}元</span>
            </Col>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            QC单均扣分&lt;</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{AllQC.pointsThree}</span>
            </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单：</Col><Col span={3}><span style={{ lineHeight: '28px' }}>{AllQC.perThree}元</span>
            </Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成单项QC
  renderOneQC = () => {
    const { OneQC } = this.state.onStorePunish;
    return (
      <CoreContent key="renderOneQC" title="单项QC" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            QC罚款类型为：</Col>
          <Col span={6}>
            <span style={{ lineHeight: '28px' }}>{transInt(OneQC.type)}</span>
          </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单扣除：</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{OneQC.per}元</span>
            </Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成UGC评分
  renderUGC= () => {
    const { UGC } = this.state.onStorePunish;
    return (
      <CoreContent key="renderUGC" title="UGC评分" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            站点单旬UGC评分&lt;</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{UGC.site}</span>
            </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单扣除：</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{UGC.per}元</span>
            </Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成操作违规
  renderBreakRule = () => {
    const { BreakRule } = this.state.onStorePunish;
    return (
      <CoreContent key="renderBreakRule" title="操作违规" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            站点单旬操作违规率&gt;</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{BreakRule.site}%</span>
            </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单扣除：</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{BreakRule.per}元</span>
            </Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成用户差评率
  renderBadCommet = () => {
    const { BadCommet } = this.state.onStorePunish;
    return (
      <CoreContent key="renderBadCommet" title="用户差评率" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            站点用户差评率&gt;</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{BadCommet.site}%</span>
            </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单扣除：</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{BadCommet.per}元</span>
            </Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成红字运力计划
  renderRed = () => {
    const { Red } = this.state.onStorePunish;
    const { redMessage } = this.state;
    return (
      <CoreContent key="renderRed" title="红字运力计划" style={{ backgroundColor: '#FAFAFA' }}>
        <Row>
          <Col span={8} style={{ lineHeight: '28px', textAlign: 'center' }}>
            {redMessage}&lt;红字运力计划
          </Col>
          <Col span={2} style={{ lineHeight: '28px', textAlign: 'right' }}>
            每单扣除：</Col><Col span={6}><span style={{ lineHeight: '28px' }}>{Red.per}元</span>
            </Col>
        </Row>
      </CoreContent>
    );
  }

  // 生成出勤人数奖励
  renderNum = () => {
    const { attendanceNum } = this.state;
    return (
      <CoreContent key="renderNum" title="运力奖励扣罚" style={{ backgroundColor: '#FAFAFA' }}>
        <Attendance
          attendanceNum={attendanceNum}
        />
      </CoreContent>
    );
  }

  // 扣罚项添加模版
  renderPunishSelect = () => {
    return (
      <div>
        <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.showModal}>添加考核类型</Button>
        <Modal
          title="添加考核类型"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Select
            style={{ width: '100%' }}
            mode="multiple"
            placeholder="请选择考核类型"
            value={this.state.confirmPunishSelect}
            onChange={this.handleChange}
          >
            {dot.get(this, 'state.onPunishSelect', []).map(item => (
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
    let result = [];
    result = items.map((component) => {
      return getPunishSelect(component);
    });
    return result;
  }

  // 渲染返回按钮
  renderSubmit = () => {
    return (
      <Row type="flex" justify="center">
        <Col>
          <Button type="primary" onClick={this.onSubmit}>返回</Button>
        </Col>
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
          {/* NX3的选择列表 60081 NX3设置*/}
          {this.state.kpiType === '60081' ? this.renderNX3Select() : null}
          {/* NX3渲染列表 60081 NX3设置*/}
          {this.state.kpiType === '60081' ? this.renderNX3() : null}
          {/* 扣罚项渲染列表 扣罚项生成选项 60082 扣罚项设置*/}
          {this.state.kpiType === '60082' ? this.renderPunish() : null}
          {/* 返回项 */}
          {this.renderSubmit()}
        </Form>
      </div>
    );
  }
}
function mapStateToProps({ operationManage }) {
  return { operationManage };
}
export default connect(mapStateToProps)(detailKpi);
