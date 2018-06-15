/**
 * 薪资模板设置模块-添加情况
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Form, Input, InputNumber, Modal, Row, Col, Button, Select, Popconfirm, message, Icon, Collapse, Alert } from 'antd';
import { SalaryCondition, SalaryFormula } from './../../../../application/define';
// import { SalarySpecifications } from '../define';  --废弃

const { Option } = Select;
const Panel = Collapse.Panel;

class FormulaModal extends Component {
  constructor(props) {
    super(props);

    // 默认的数据
    let formulas = [{ index: [], formula: [], options: [] }];
    let condition = [`${SalaryCondition.all}`];
    let calculateFormula = '';
    // 编辑模式，默认false
    let isEdit = false;

    // 编辑下对应的数据
    const formulaData = props.formulaData ? props.formulaData : undefined;

    // 如果有编辑数据则根据编辑数据初始化模块
    if (formulaData !== undefined) {
      formulas = formulaData.formulas;
      condition = formulaData.condition;
      calculateFormula = formulaData.calculateFormula;
      isEdit = true;
    }
    this.state = {
      visible: props.visible ? props.visible : false,           // 是否显示弹窗
      parent: props.parent ? props.parent : undefined,          // 提交数据对应的父级模块
      subject: props.subject ? props.subject : undefined,       // 提交数据对应的模块
      platform: props.platform ? props.platform : undefined,    // 平台
      formulaId: props.formulaId ? props.formulaId : undefined, // 提交数据对应的数据id

      onCancle: props.onCancle ? props.onCancle : undefined,    // 可见状态变更回调
      onSubmit: props.onSubmit ? props.onSubmit : undefined,    // 提交参数

      specifications: props.specificationsPlatform || [],      // 某平台下薪资指标库
      cursorIndex: 0, // 默认的光标位置
      isEdit,     // 是否是编辑模式

      formulas,   // 条件
      condition,  // 条件关系
      calculateFormula,  // 计算公式
    };
  }

  componentWillReceiveProps = (nextProps) => {
    // 默认的数据
    let formulas = [{ index: [], formula: [], options: [] }];
    let condition = [`${SalaryCondition.all}`];
    let calculateFormula = '';
    // 编辑模式，默认false
    let isEdit = false;

    // 编辑下对应的数据
    const formulaData = nextProps.formulaData ? nextProps.formulaData : undefined;

    // 如果有编辑数据则根据编辑数据初始化模块
    if (formulaData !== undefined) {
      formulas = formulaData.formulas;
      condition = formulaData.condition;
      calculateFormula = formulaData.calculateFormula;
      isEdit = true;
    }

    this.setState({
      visible: nextProps.visible ? nextProps.visible : false,           // 是否显示弹窗
      parent: nextProps.parent ? nextProps.parent : undefined,          // 提交数据对应的父级模块
      subject: nextProps.subject ? nextProps.subject : undefined,       // 提交数据对应的项目
      platform: nextProps.platform ? nextProps.platform : undefined,    // 平台
      formulaId: nextProps.formulaId ? nextProps.formulaId : undefined, // 提交数据对应的数据id

      onCancle: nextProps.onCancle ? nextProps.onCancle : undefined,  // 可见状态变更回调
      onSubmit: nextProps.onSubmit ? nextProps.onSubmit : undefined,  // 提交参数

      specifications: nextProps.specificationsPlatform || [],   // 某平台下薪资指标库
      isEdit,     // 是否是编辑模式

      formulas,          // 条件
      condition,         // 条件关系
      calculateFormula,  // 计算公式
    });
  }

  // 设置选中项目
  onSelectFormulaItem = (e, option) => {
    const id = option.props.id;           // 数组中数据的索引
    const name = option.props.name;       // 字段名字
    const value = e;                      // 字段数值
    const formulas = this.state.formulas; // 获取数据

    // 条件描述类型变化时，重制条件参数
    if (name === 'formula') {
      dot.set(formulas, `${id}.options.x`, 0);
      dot.set(formulas, `${id}.options.y`, 0);
    }

    // 设置条件中，选中项目的数据，
    dot.set(formulas, `${id}.${name}`, value);
    this.setState({ formulas });
  }

  // 重置表单
  onReset = () => {
    // 重置
    this.setState({
      formulas: [{ index: [], formula: [], options: [] }],
      condition: [`${SalaryCondition.all}`],
      calculateFormula: '',   // 计算公式
      subject: undefined,     // 提交数据对应的项目
      platform: undefined,    // 平台
      formulaId: undefined,   // 提交数据对应的数据id
      isEdit: false,          // 编辑模式
    });
  }

  // 添加新的条件
  onCreateFormula = () => {
    const { formulas } = this.state;
    formulas.push({ index: [], formula: [], options: [] });
    this.setState({ formulas });
  }

  // 删除新的条件
  onRemoveFormula = (index) => {
    const { formulas } = this.state;
    formulas.splice(index, 1);
    this.setState({ formulas });
  }

  // 点击快捷指标，用于创建公式
  onClickFormulaSelecter = (e) => {
    const { calculateFormula, cursorIndex } = this.state;
    // 设置公式数据
    if (cursorIndex !== 0) {
      const formatString = `${calculateFormula.substring(0, cursorIndex)}{{${e.target.value}}}${calculateFormula.substring(cursorIndex)}`;
      this.setState({
        calculateFormula: formatString,
        cursorIndex: cursorIndex + e.target.value.length + 4,
      });
    } else {
      this.setState({
        calculateFormula: `${calculateFormula}{{${e.target.value}}}`,
      });
    }
  }
  // 删除textArea中的数据
  onChangeFormulaSelecter = (e) => {
    this.setState({
      calculateFormula: e.target.value,
    });
  }

  // 修改计算公式数据
  // XXX
  onTypeInCalculateFormula = (event) => {
    // console.log('event', event.key);

    // 白名单，可以输入的计算符号和操作按钮
    const whiteList = ['+', '-', '*', '/', '(', ')', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
    if (whiteList.indexOf(event.key) === -1) {
      // 辅助按键，不显示错误提示
      if (['Shift', 'Control', 'Alt', 'Tab', 'Escape', 'CapsLock', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].indexOf(event.key) === -1) {
        message.warning('请输入数字或正确的 + - * ／ ( ) . 计算符号', 3);
      }
      return;
    }

    const { calculateFormula } = this.state;
    // 判断如果是删除按钮
    if (event.key !== 'Backspace') {
      this.setState({ calculateFormula: `${calculateFormula}${event.key}` });
      return;
    }

    let content = '';
    // 内容中的最后一个字符串, 是定义的公式变量，则直接删除完整的变量
    const lastChar = calculateFormula.charAt(calculateFormula.length - 1);
    if (lastChar === '}') {
      // 贪婪模式匹配最后一个 {{选项}} , 并且直接替换删除
      content = calculateFormula.replace(/(.*){{[\W\w]+}}/, '$1');
    } else {
      // 直接删除最后一个字符
      content = calculateFormula.substr(0, calculateFormula.length - 1);
    }
    this.setState({ calculateFormula: content });
  }

  // 修改条件关系
  onChangeCondition = (value) => {
    this.setState({ condition: value });
  }

  // 提交
  onSubmit = () => {
    const { onSubmit, formulas, condition, calculateFormula, parent, subject, platform, formulaId, isEdit } = this.state;

    // 结果数据
    const result = {
      randomKey: Math.random(),
      parent,             // 提交数据对应的父级模块
      subject,            // 提交数据对应的模块
      formulaId,          // 提交数据对应的数据id
      platform,           // 平台
      formulas,           // 条件
      condition,          // 条件关系
      calculateFormula,   // 计算公式
      isEdit,             // 编辑模式
    };

    if (is.not.existy(formulas) || is.not.array(formulas) || is.empty(formulas)) {
      return message.error('请填写条件内容');
    }

    // 数据提交前的验证
    for (let i = 0; i < formulas.length; i += 1) {
      const item = formulas[i];
      if (is.empty(item.formula)) {
        return message.error(`条件${i + 1} 请完善指标`);
      }
      if (is.empty(item.index)) {
        return message.error(`条件${i + 1} 请完善条件描述类型`);
      }
      if (is.empty(item.options)) {
        return message.error(`条件${i + 1} 请完善的条件公式`);
      }
      // 判断公式 x < 指标 < y 的逻辑关系
      if (SalaryFormula.getOptionsCount(item.formula) === 2 && item.options.x >= item.options.y) {
        return message.error(`条件${i + 1} 内容公式不成立`);
      }
    }

    // 计算公式内容不能为空
    if (calculateFormula === '') {
      return message.error('请填写计算公式的内容');
    }

    // 回调
    if (onSubmit) {
      onSubmit(result);
    }

    // 重置数据
    this.onReset();
    // 隐藏弹窗
    this.setState({ visible: false });
  }

  // 取消
  onCancle = () => {
    const { onCancle } = this.state;
    if (onCancle) {
      onCancle();
    }
    // 重置数据
    this.onReset();
    // 隐藏弹窗
    this.setState({ visible: false });
  }
  // 更新光标位置
  getCursortPosition = (obj) => {
    const dom = obj.target;
    let cursorIndex = 0;
    if (window.document.selection) {
        // IE Support
      dom.focus();
      const range = window.document.selection.createRange();
      range.moveStart('character', -dom.value.length);
      cursorIndex = range.text.length;
    } else if (dom.selectionStart || dom.selectionStart === 0) {
        // another support
      cursorIndex = dom.selectionStart;
    }
    // 更新光标位置
    this.setState({
      cursorIndex,
    });
  }

  // 渲染条件公式
  renderFormulas = (id, formulaObj) => {
    const { onSelectFormulaItem, onRemoveFormula } = this;
    // 指标数据
    const { specifications } = this.state;

    // 获取当前条件公式中的各个参数
    const { index, formula, options } = formulaObj;

    // 条件描述类型的详细数值
    const valueX = dot.get(options, 'x', 0);
    const valueY = dot.get(options, 'y', 0);

    // 根据条件描述类型，获取input表单
    const optionX = <InputNumber defaultValue={valueX} size="large" onChange={(e) => { onSelectFormulaItem(e, { props: { id, name: 'options.x' } }); }} min={0} />;
    const optionY = <InputNumber defaultValue={valueY} size="large" onChange={(e) => { onSelectFormulaItem(e, { props: { id, name: 'options.y' } }); }} min={0} />;
    const content = SalaryFormula.formula(formula, { x: optionX, y: optionY });

    return (
      <Row style={{ marginBottom: '10px', height: '30px' }} key={id + Math.random()}>
        <Col span={3} style={{ paddingTop: '5px', height: '30px' }}>
          条件{id + 1}:
        </Col>
        <Col span={21}>
          <Row gutter={16}>

            {/* 渲染指标 */}
            <Col span={6}>
              <Select showSearch optionFilterProp="children" placeholder="请选择指标" onSelect={this.onSelectFormulaItem} defaultValue={`${index}`}>
                {
                  Object.values(specifications).map((targets, targetsIndex) => {
                    return dot.get(targets, 'items', []).map((item, index) => {
                      const key = targetsIndex.toString() + index.toString();
                      return <Option value={item.value} id={id} name="index" key={key}>{item.title}</Option>;
                    });
                  })
                }
              </Select>
            </Col>

            {/* 渲染条件描述类型 */}
            <Col span={4}>
              <Select showSearch optionFilterProp="children" placeholder="请选择条件描述类型" onSelect={this.onSelectFormulaItem} defaultValue={`${formula}`}>
                {
                  SalaryFormula.keys().map((item) => {
                    const name = dot.get(SalaryFormula, `${item}`);
                    return <Option value={`${item}`} id={id} name="formula" key={item + name}>{name}</Option>;
                  })
                }
              </Select>
            </Col>

            {/* 渲染掉肩描述类型的input表单, 如果没有content就不显示 */}
            <Col span={12}>
              {content}
            </Col>

            {/* 删除按钮，第一条数据不显示删除按钮 */}
            <Col span={2} style={{ height: '30px' }}>
              {id == 0 ? '' :
                <Popconfirm title="确定删除?" onConfirm={() => { onRemoveFormula(id); }} okText="确定" cancelText="取消">
                  <a href="#">删除</a>
                </Popconfirm>
              }
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  // 渲染条件关系模块
  renderCondition = () => {
    const { condition } = this.state;
    return (
      <Row style={{ marginBottom: '10px' }}>
        <Col span={3} style={{ paddingTop: '5px', height: '30px' }}>条件关系：</Col>
        <Col span={21}>
          <Select placeholder="请选择条件关系" style={{ width: '220px' }} defaultValue={`${condition}`} onChange={this.onChangeCondition}>
            <Option value={`${SalaryCondition.all}`}>{SalaryCondition.description(SalaryCondition.all)}</Option>
            <Option value={`${SalaryCondition.atLeastOne}`}>{SalaryCondition.description(SalaryCondition.atLeastOne)}</Option>
          </Select>
        </Col>
      </Row>
    );
  }

  // 渲染计算公式模块
  renderCalculate = () => {
    const { calculateFormula, specifications } = this.state;

    return (
      <Row style={{ marginBottom: '10px' }}>
        <Col span={3} style={{ paddingTop: '5px', height: '30px' }}>计算公式：</Col>
        <Col span={21}>
          <Col span={12}><Input.TextArea onMouseMove={this.getCursortPosition} onChange={this.onChangeFormulaSelecter} value={calculateFormula} placeholder="请输入计算公式" autosize={{ minRows: 10 }} /></Col>
          <Col span={2}><div className="formulaImage" style={{ width: '24px', height: '24px', margin: '80px auto' }} /></Col>
          <Col span={10}>
            <div>系统指标</div>
            <Collapse accordion>
              {
                Object.values(specifications).map((targets, targetsIndex) => {
                  return (
                    <Panel header={targets.name} key={targetsIndex}>
                      <select onClick={this.onClickFormulaSelecter} multiple="multiple" size="2" style={{ border: '0', width: '100%', height: '80px' }}>
                        {
                          dot.get(targets, 'items', []).map((item, index) => {
                            const key = targetsIndex.toString() + index.toString();
                            return <option value={`${item.title}`} key={key} style={{ lineHeight: '20px' }} >{item.title}</option>;
                          })
                        }
                      </select>
                    </Panel>
                  );
                })
              }
            </Collapse>
          </Col>
        </Col>
      </Row>
    );
  }

  render() {
    const { renderFormulas, renderCondition, renderCalculate } = this;
    const { formulas, isEdit, formulaId } = this.state;
    const title = isEdit ? `编辑情况 ${formulaId + 1}` : '添加情况';
    const message = (
      <div>
        提示信息:
        <p>1、计算公式设置，扣罚项需要在公式中标注“负号-”；输入符号时需切换到英文格式；</p>
        <p>2、条件设置时的数字标识，状态类“在职=1 离职=0，例如 在职状态”；是否类“是=1  否=0，例如 是否当月入职”；月份类“xx年xx月，例如 入职月份=201805”；天数类“xx天，例如 在职天数”；百分比类“ 0.00，例如 好评率”。</p>
      </div>
      );
    return (
      <Modal
        title={title}
        visible={this.state.visible}
        onOk={this.onSubmit}
        onCancel={this.onCancle}
        width={780}
      >
        <Form layout="horizontal" onSubmit={this.onSubmit}>
          {/* 添加提示信息 */}
          <Alert type="info" showIcon style={{ marginBottom: '10px' }} message={message} />
          {/* 渲染条件公式 */}
          {
            formulas.map((formula, id) => {
              return renderFormulas(id, formula);
            })
          }

          <Row style={{ marginBottom: '10px' }}>
            <Col span={3} />
            <Col span={21}>
              <Button type="default" onClick={this.onCreateFormula}>+ 添加条件</Button>
            </Col>
          </Row>

          {/* 渲染条件关系 */}
          {renderCondition()}

          {/* 渲染计算公式 */}
          {renderCalculate()}
        </Form>
      </Modal>

    );
  }
}

export default FormulaModal;
