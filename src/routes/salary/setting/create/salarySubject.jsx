// 薪资项目
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Table, Popconfirm, message, Button, Tooltip, Icon, Row, Col } from 'antd';
import { CoreContent } from '../../../../components/core';
import SalaryModal from './salary.jsx';
import FormulaModal from './formula.jsx';
import { SalaryCondition, SalaryFormula } from './../../../../application/define';
// import { SalarySpecifications } from './../define';
import DateSlider from './dateSlider';

class SalarySubject extends Component {
  constructor(props) {
    super(props);

    // 默认的薪资项目
    const defaultSubjects = [
      { title: '底薪', color: '#72DE00', isDefault: true, subjects: [] },
      { title: '提成', color: '#0083DE', isDefault: true, subjects: [] },
      { title: '奖金', color: '#FF6C00', isDefault: true, subjects: [] },
      { title: '扣罚', color: '#DE0000', isDefault: true, subjects: [] },
    ];

    const value = props.value || {};
    this.state = {
      id: value.id,                                 // 数据的id
      subjects: (is.existy(value.subjects) && is.not.empty(value.subjects)) ? value.subjects : defaultSubjects,  // 薪资项目
      platform: value.platform || [],           // 平台数据
      onChangeSubjects: props.onChangeSubjects, // 数据更新的回调
      isShowCreateSalaryModal: false,     // 是否显示,添加薪资项目弹窗
      isShowFormulaModal: false,          // 是否显示,添加情况弹窗
      isShowCreateSubSalaryModal: false,  // 是否显示,添加子项目弹窗
      isShowUpdateSubSalaryModal: false,  // 是否显示,编辑子项目弹窗
      updateSubSalaryParentId: undefined,  // 更新子项目中，父类项目id
      updateSubSalaryId: undefined,        // 更新子项目中，项目id
      updateSubSalaryValues: undefined,    // 更新子项目中数据
      createSubSalaryParentId: undefined,  // 添加子项目的父类项目id
      selectedParent: undefined,           // 添加情况的父类项目id
      selectedSubject: undefined,          // 添加情况的项目id
      selectedFormulaId: undefined,        // 编辑情况的公式id
      selectedFormulaData: undefined,      // 编辑情况的公式数据
      allSpecifications: value.specifications || null, // 全部薪资指标库
      specificationsPlatform: this.getSpecifications(dot.get(value, 'platform')),  // 某平台下指标项
    };
    this.private = {
      selectedMaxBelongTime: 31,
    };
  }

  componentWillReceiveProps(nextProps) {
    // 默认的薪资项目
    const defaultSubjects = [
      { title: '底薪', color: '#72DE00', isDefault: true, subjects: [] },
      { title: '提成', color: '#0083DE', isDefault: true, subjects: [] },
      { title: '奖金', color: '#FF6C00', isDefault: true, subjects: [] },
      { title: '扣罚', color: '#DE0000', isDefault: true, subjects: [] },
    ];

    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      value.subjects = (is.existy(value.subjects) && is.not.empty(value.subjects)) ? value.subjects : defaultSubjects;

      this.setState(value);
      this.setState({
        allSpecifications: value.specifications || null, // 全部薪资指标库
        specificationsPlatform: this.getSpecifications(dot.get(nextProps.value, 'platform')),  // 某平台下指标项
      });
    }
  }

  // 显示添加薪资项目弹窗
  showCreateSalaryModal = () => {
    // 表单的基本信息
    const { platform } = this.state;
    if (platform.length <= 0) {
      message.warning('请先选择平台');
      return;
    }

    this.setState({
      isShowCreateSalaryModal: true,
      isShowFormulaModal: false,
      isShowCreateSubSalaryModal: false,
      isShowUpdateSubSalaryModal: false,
    });
  }

  // 显示添加子模块弹窗
  showCreateSubSalaryModal = (parentId) => {
    // 表单的基本信息
    const { platform } = this.state;
    if (platform.length <= 0) {
      message.warning('请先选择平台');
      return;
    }

    this.setState({
      createSubSalaryParentId: parentId,  // 父类id
      isShowCreateSubSalaryModal: true,
      isShowCreateSalaryModal: false,
      isShowFormulaModal: false,
      isShowUpdateSubSalaryModal: false,
    });
  }

  // 显示更新子模块弹窗
  showUpdateSubSalaryModal = (parentId, subjectId, title, values) => {
    this.setState({
      updateSubSalaryParentId: parentId,  // 更新子项目中，父类项目id
      updateSubSalaryId: subjectId,       // 更新子项目中，项目id
      updateSubSalaryValues: values,      // 跟新子项目中，子项目名称和子项目时间
      isShowCreateSubSalaryModal: false,
      isShowCreateSalaryModal: false,
      isShowFormulaModal: false,
      isShowUpdateSubSalaryModal: true,
    });
  }

  // 显示添加情况弹窗
  showFormulaModal = (parentId, subjectId, formulaId = undefined) => {
    // 添加情况对应的对象
    const selectedSubject = subjectId;
    const selectedParent = parentId;
    const selectedFormulaId = formulaId;

    // 表单的基本信息
    const { platform, subjects } = this.state;
    if (platform.length <= 0) {
      message.warning('请先选择平台');
      return;
    }

    // 获取情况数据，编辑模式
    const data = dot.get(subjects, `${parentId}.subjects.${subjectId}.subjects.${formulaId}`);

    this.setState({
      selectedParent,
      selectedSubject,
      selectedFormulaId,
      selectedFormulaData: data,
      isShowCreateSalaryModal: false,
      isShowFormulaModal: true,
      isShowCreateSubSalaryModal: false,
      isShowUpdateSubSalaryModal: false,
    });
  }

  // 隐藏添加薪资弹窗
  hideModal = () => {
    this.setState({
      createSubSalaryParentId: undefined,
      isEditSubSalaryParentId: false,
      selectedSubject: undefined,
      selectedFormulaId: undefined,
      selectedFormulaData: undefined,
      isShowCreateSalaryModal: false,
      isShowFormulaModal: false,
      isShowCreateSubSalaryModal: false,
      isShowUpdateSubSalaryModal: false,
    });
  }

  // 添加项目
  createSalary = (values) => {
    this.createSalarySubject(values);
  }

  // 添加子项目
  createSubSalary = (values) => {
    const { createSubSalaryParentId } = this.state;
    this.createSubSalarySubject(createSubSalaryParentId, values);
  }

  // 编辑子项目名称
  updateSubSalary = (values) => {
    const { title, times } = values;
    const { subjects, updateSubSalaryParentId, updateSubSalaryId } = this.state;

    // 判断父项目id
    if (updateSubSalaryParentId === undefined) {
      message.error('无法获取父项目id');
      return;
    }

    // 判断项目id
    if (updateSubSalaryId === undefined) {
      message.error('无法获取项目id');
      return;
    }
    // 更新子项目
    if (title && title !== '') {
      dot.set(subjects, `${updateSubSalaryParentId}.subjects.${updateSubSalaryId}.title`, title);
      dot.set(subjects, `${updateSubSalaryParentId}.subjects.${updateSubSalaryId}.times`, times);
      this.onChangeSubjects({ subjects });
      this.hideModal();
      message.success(`成功更新子项目 '${title}'`);
    }
  }

  // 创建薪资项目
  createSalarySubject = (values) => {
    const { subjects } = this.state;
    const { title, times } = values;
    if (title && title !== '') {
      const subject = {
        title,
        color: '#FFDA00',
        isDefault: false,
        subjects: [],
        times,
      };
      subjects.push(subject);

      this.onChangeSubjects({ subjects });
      this.hideModal();
      message.success(`成功添加薪资条目 '${title}'`);
    }
  }

  // 删除薪资项目
  removeSalarySubject = (title, id) => {
    const { subjects } = this.state;
    // 遍历元素，根据条件删除数据
    const result = [];
    subjects.forEach((subject, index) => {
      if (`${index}` !== `${id}`) {
        result.push(subject);
      }
    });
    this.onChangeSubjects({ subjects: result });
    message.success(`成功删除薪资条目 '${title}'`);
  }

  // 创建子项目
  createSubSalarySubject = (parentId, values) => {
    const { subjects } = this.state;

    // 判断父类别参数
    if (parentId === undefined) {
      message.error('无法获取父项目id');
      return;
    }
    const { title, times } = values;
    if (title && title !== '') {
      const data = dot.get(subjects, `${parentId}.subjects`, []);
      data.push({ title, subjects: [], times });
      dot.set(subjects, `${parentId}.subjects`, data);
      this.onChangeSubjects({ subjects });
      this.hideModal();
      message.success(`成功添加子项目 '${title}'`);
    }
  }

  // 删除薪资子项目
  removeSubSalarySubject = (parentId, title, subjectId) => {
    const { subjects } = this.state;

    const data = dot.get(subjects, `${parentId}.subjects`, []);
    // 遍历元素，根据条件删除数据
    const result = [];
    data.forEach((subject, index) => {
      if (`${index}` !== `${subjectId}`) {
        result.push(subject);
      }
    });
    dot.set(subjects, `${parentId}.subjects`, result);
    this.onChangeSubjects({ subjects });
    message.success(`成功删除子项目 '${title}'`);
  }

  // 删除薪资项目中数据
  removeSalarySubjectItem = (parentId, subjectId, dataIndex) => {
    const { subjects } = this.state;

    const data = dot.get(subjects, `${parentId}.subjects.${subjectId}.subjects`, []);
    // 遍历元素，根据条件删除数据
    const result = [];
    data.forEach((item, index) => {
      if (`${index}` !== `${dataIndex}`) {
        result.push(item);
      }
    });
    dot.set(subjects, `${parentId}.subjects.${subjectId}.subjects`, result);
    this.onChangeSubjects({ subjects });
    message.success('成功删除');
  }

  // 提交公式操作
  submitFormula = (values) => {
    // 判断是否是编辑模式
    const { isEdit } = values;
    if (isEdit) {
      // 更新公式数据
      this.updateFormula(values);
    } else {
      // 创建新的公式数据
      this.createFormula(values);
    }
  }

  // 添加情况
  createFormula = ({ parent, subject, platform, formulas, condition, calculateFormula }) => {
    // 获取当前的列表对象数据
    const { subjects } = this.state;
    // 获取当前的内容并赋值
    const data = dot.get(subjects, `${parent}.subjects.${subject}.subjects`, []);
    data.push({ platform, formulas, condition, calculateFormula });
    dot.set(subjects, `${parent}.subjects.${subject}.subjects`, data);
    this.onChangeSubjects({ subjects });
    this.hideModal();
  }

  // 编辑情况
  updateFormula = ({ parent, subject, formulaId, platform, formulas, condition, calculateFormula }) => {
    // 获取当前的列表对象数据
    const { subjects } = this.state;
    // 获取当前的内容并赋值
    const data = { platform, formulas, condition, calculateFormula };
    dot.set(subjects, `${parent}.subjects.${subject}.subjects.${formulaId}`, data);
    this.onChangeSubjects({ subjects });
    this.hideModal();
  }
  // 更新数据
  onChangeSubjects = ({ subjects }) => {
    this.setState({ subjects });
    const { onChangeSubjects } = this.state;
    // 调用上一级，添加新的slider
    if (onChangeSubjects) {
      onChangeSubjects(Object.assign({}, this.state, { subjects }));
    }
  }
  // 更新时间设置--废弃
  onChangeBelongTime = (value) => {
    const { id, min, selected } = value;
    const { times } = this.state;
    // if (is.not.existy(times[id])) {
    //   return;
    // }

    // 设置当前选择的时间
    // this.private.selectedMaxBelongTime = selected;

    // 如果不是最大值，不进行处理
    // if (selected !== 31) {
    //   return;
    // }
    // 设置当前时间段
    const timesIds = [];
    times.forEach((item, index) => {
      timesIds.push(item.id);
    });
    // 判断id是否在times中，有则更新times,无则新增
    if (timesIds.includes(id)) {
      times[timesIds.indexOf(id)].belongTime = selected;
    } else {
      // 添加一条新的时间
      times.push({
        id,
        belongTime: selected,
        subjects: [],
      });
    }
    this.setState({
      times,
    });
  }
  // 创建时间选项-废弃
  onCreateBelongTime = (value) => {
    const { id, min, selected } = value;
    const { times } = this.state;
    if (is.not.existy(times[id])) {
      return;
    }
    // 设置当前时间段
    times[id].belongTime = [min, selected];
    // 添加一条新的时间
    times.push({
      belongTime: [selected + 1, 31],
      subjects: [],
    });
    this.setState({
      times,
    });
    this.private.selectedMaxBelongTime = 31;
  }
  // 删除时间选项-废弃
  onDeleteBelongTime = (value) => {
    const { id } = value;
    const { times } = this.state;
    if (is.not.existy(times[id])) {
      return;
    }
    // 删除最后一条数据
    times.splice(id, 1);
    // 获取前一条数据的时间设置
    const time = times[id - 1].belongTime;
    // 重新设置前一条数据的时间
    times[id - 1].belongTime = [time[0], 31];
    // 更新
    this.setState({ times });

    this.private.selectedMaxBelongTime = 31;
  }
  // 根据类型获取薪资指标数据
  getSpecifications = (type) => {
    // type is Array
    switch (type[0]) {
      case 'baidu': return dot.get(this.state, 'allSpecifications.baidu', []);
      case 'meituan': return dot.get(this.state, 'allSpecifications.meituan', []);
      case 'elem': return dot.get(this.state, 'allSpecifications.elem', []);
      default: return [];
    }
  }
  // 渲染薪资项目
  renderSalarySubject = () => {
    const { renderSubSalarySubject, showCreateSubSalaryModal, removeSalarySubject } = this;
    const { subjects } = this.state;
    const content = [];
    // 遍历整个薪资项目数据，渲染项目
    subjects.forEach((subject, parentId) => {
      const { title, color, isDefault } = subject;
      // 默认选项
      const ext = (
        <div>
          <Button type="primary" style={{ marginRight: '5px' }} onClick={() => { showCreateSubSalaryModal(parentId); }}>添加子项目</Button>
        </div>
      );

      // 后添加的选项可以删除
      const extWithDel = (
        <div>
          <Button type="primary" style={{ marginRight: '5px' }} onClick={() => { showCreateSubSalaryModal(parentId); }}>添加子项目</Button>
          <Popconfirm title="删除该情况?" onConfirm={() => { removeSalarySubject(title, parentId); }} okText="确定" cancelText="取消">
            <Button type="dashed" style={{ marginLeft: '5px' }}>删除</Button>
          </Popconfirm>
        </div>
      );

      // 判断是默认选项还是后添加的选项
      const titleExt = isDefault ? ext : extWithDel;
      const key = `${title}${Math.random()}${parentId}-parent`;
      const titleText = (
        <Tooltip title="计算薪资时，各子项目间关系为求和，各情况之间为满足任一。" overlayStyle={{ width: '200px', color: 'red' }}>
          <span>{title}
            <Icon type="info-circle" style={{ color: 'blue', marginLeft: '10px' }} /></span>
        </Tooltip>
      );
      content.push(
        <CoreContent key={key} title={titleText} color={color} titleExt={titleExt} >
          {renderSubSalarySubject(parentId, subject.subjects)}
        </CoreContent>,
      );
    });

    return (
      <div>
        {content}
        <Button type="primary" onClick={() => { this.showCreateSalaryModal(); }}>添加薪资项目</Button>
      </div>);
  }

  // 渲染子模块
  renderSubSalarySubject = (parentId, subjects) => {
    const {
      showFormulaModal,
      showUpdateSubSalaryModal,
      removeSubSalarySubject,
      renderFormulas,
      // onChangeBelongTime,
      // onCreateBelongTime,
      // onDeleteBelongTime
    } = this;

    const { platform } = this.state;
    // 如果数据不存在则直接返回
    if (subjects === undefined || subjects === []) {
      return '';
    }
    const content = [];
    // 遍历整个薪资项目数据，渲染项目
    subjects.forEach((subject, subjectId) => {
      const { title, times } = subject;
      // 版本v5.4.1不判断，都可以编辑时间
      // const isDisabled = (`${workProperty}` === `${KnightTypeWorkProperty.fulltime}`) === false;
      const timesId = parentId.toString() + subjectId.toString();

      const dateSliderProps = {
        value: {
          id: timesId,                      // 每条子项目id-废弃
          selected: times,                  // 选中数据
          disabled: true,                  // 是否禁用(除最后一条数据不禁用，其余全部禁用)
          canCreate: platform.length > 0,   // 判断是否能够创建
        },
      };
      // 默认选项
      const ext = (
        <div>
          <Button type="dashed" title={title} onClick={() => { showFormulaModal(parentId, subjectId); }} style={{ marginRight: '5px' }}>添加情况</Button>
          <Button type="dashed" title={title} onClick={() => { showUpdateSubSalaryModal(parentId, subjectId, title, subject); }}>编辑</Button>
          <Popconfirm title="删除该情况?" onConfirm={() => { removeSubSalarySubject(parentId, title, subjectId); }} okText="确定" cancelText="取消">
            <Button type="dashed" style={{ marginLeft: '5px' }}>删除</Button>
          </Popconfirm>
        </div>
      );
      const key = `${title}${Math.random()}`;
      const text = (
        <span>
          {title}
          <DateSlider {...dateSliderProps} />
        </span>
      );
      content.push(
        <CoreContent key={key} title={text} titleExt={ext} style={{ backgroundColor: '#FFFFFF' }}>
          {renderFormulas(parentId, subjectId, subject)}
        </CoreContent>,
      );
    });

    return (<div>{content}</div>);
  }

  // 渲染情况
  renderFormulas = (parentId, subjectIndex, subject) => {
    const { showFormulaModal } = this;
    const dataSource = subject.subjects;

    const columns = [{
      title: '情况',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => { return `情况${index + 1}`; },
    }, {
      title: '条件关系',
      dataIndex: 'condition',
      key: 'condition',
      render: (text) => {
        return SalaryCondition.description(text);
      },
    }, {
      title: '条件',
      dataIndex: 'formulas',
      key: 'formulas',
      render: (text, record) => {
        // 指标项
        const { specificationsPlatform } = this.state;
        const content = [];
        text.forEach(text => {
          specificationsPlatform.forEach(items => {
            items.items.forEach(item => {
              // 获取指标的中文解释
              if (text.index === item.value) {
                // 根据指标和条件设置，显示具体的指标条件内容
                const description = SalaryFormula.formula(text.formula, text.options, item.title);
                content.push(<Row key={`formulaKey-${Math.random()}`}>{description}</Row>);
              }
            });
          });
        });
        // 获取平台参数
        // const platform = record.platform;
        // const content = [];
        // text.forEach((item) => {
        //   const specification = SalarySpecifications.description(platform, item.index);
        //   const description = SalaryFormula.formula(item.formula, item.options, specification);
        //   content.push(<Row key={`formulaKey-${Math.random()}`}>{description}</Row>);
        // });
        return <div>{content}</div>;
      },
    }, {
      title: '公式',
      dataIndex: 'calculateFormula',
      key: 'calculateFormula',
      render: (text) => { return text; },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record, dataIndex) => {
        return (
          <div>
            <a onClick={() => { showFormulaModal(parentId, subjectIndex, dataIndex); }} style={{ marginRight: '5px' }}>编辑</a>
            <Popconfirm title="删除该情况?" onConfirm={() => { this.removeSalarySubjectItem(parentId, subjectIndex, dataIndex); }} okText="确定" cancelText="取消">
              <a style={{ marginRight: '5px' }}>删除</a>
            </Popconfirm>
          </div>
        );
      },
    }];

    return (
      <Table rowKey={(record) => { return `${record.randomKey}${Math.random()}`; }} dataSource={dataSource} columns={columns} pagination={false} bordered />
    );
  }

  render() {
    return (
      <div>
        {/* 渲染项目 */}
        {this.renderSalarySubject()}

        {/* 添加薪资项目弹窗 */}
        <SalaryModal
          title="添加薪资项目"
          onSubmit={this.createSalary}
          onCancle={this.hideModal}
          visible={this.state.isShowCreateSalaryModal}
        />

        {/* 添加子模块弹窗 */}
        <SalaryModal
          title="添加子项目"
          onSubmit={this.createSubSalary}
          onCancle={this.hideModal}
          visible={this.state.isShowCreateSubSalaryModal}
        />

        {/* 编辑子模块弹窗 */}
        <SalaryModal
          title="编辑子项目"
          value={this.state.updateSubSalaryValues}
          onSubmit={this.updateSubSalary}
          onCancle={this.hideModal}
          visible={this.state.isShowUpdateSubSalaryModal}
        />

        {/* 添加情况弹窗 */}
        <FormulaModal
          specificationsPlatform={dot.get(this.state, 'specificationsPlatform')}
          platform={dot.get(this.state, 'platform.0')}
          parent={`${dot.get(this.state, 'selectedParent')}`}
          subject={`${dot.get(this.state, 'selectedSubject')}`}
          formulaId={`${dot.get(this.state, 'selectedFormulaId')}`}
          formulaData={dot.get(this.state, 'selectedFormulaData')}
          onSubmit={this.submitFormula}
          onCancle={this.hideModal}
          visible={this.state.isShowFormulaModal}
        />
      </div>
    );
  }
}
export default SalarySubject;
