/**
 * 编辑供应商模块
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Link } from 'react-router';
import { connect } from 'dva';
import {
  Select,
  Form,
  Input,
  Row,
  Col,
  Button,
  Table,
  message,
  Icon,
} from 'antd';

import aoaoBossTools from './../../../utils/util';
import AllSelect from '../../../components/AllSelect';
import { authorize } from '../../../application';
import { bizDistrictState } from './define';
import styles from './component/style.less';

const [FormItem,
  Option] = [Form.Item, Select.Option];

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: [],                  // 城市下拉框数据源
      areaList: [],                  // 商圈下拉框数据源
      platformInitValue: [],         // 平台下拉默认值
      cityInitValue: [],             // 城市下拉默认值
      areaInitValue: [],             // 商圈下拉默认值
      selectedRowKeys: [],           // 选中的表格索引
      selectedRows: [],              // 选中的商圈数据
      filtered: false,                        // 控制table栏icon图标颜色
      filteredPlatform: false,                // 平台
      filteredCity: false,                    // 城市
      filterDropdownVisible: false,           // 控制table栏过滤框展示-商圈
      filterDropdownVisiblePlatform: false,   // 平台
      filterDropdownVisibleCity: false,       // 城市
      searchText: '',                        // 保存table栏过滤条件
      searchTextPlatform: '',                // 平台
      searchTextCity: '',                    // 城市
      dataSearch: [],                        // 供应商过滤数据-过滤商圈、平台、城市
      dataSource: dot.get(props, 'system.supplierDetail.biz_district_info_list') || [],  // 供应商商圈列表
      initialSupplierValue: dot.get(props, 'system.supplierDetail'),                     // 商圈详情
      notSupplierDistrict: dot.get(props, 'system.notSupplierDistrict') || [],           // 没有供应商的商圈
      storeCityList: [],                                                                 // 存储的城市列表
      storePlatList: [],                                                                 // 存储商圈列表
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      initialSupplierValue: dot.get(nextProps, 'system.supplierDetail'),
      dataSource: dot.get(nextProps, 'system.supplierDetail.biz_district_info_list') || [],
      notSupplierDistrict: dot.get(nextProps, 'system.notSupplierDistrict', []),
    });
  }
  // 监听过滤条件-商圈
  onInputChange = (e) => {
    const text = e.target.value;
    // filtered: 有检索条件为true,否则为false
    this.setState({ searchText: text, filtered: !!text });
  }
  // 监听过滤条件-平台
  onInputChangePlatform = (e) => {
    const text = e.target.value;
    // filtered: 有检索条件为true,否则为false
    this.setState({ searchTextPlatform: text, filteredPlatform: !!text });
  }
  // 监听过滤条件-城市
  onInputChangeCity = (e) => {
    const text = e.target.value;
    // filtered: 有检索条件为true,否则为false
    this.setState({ searchTextCity: text, filteredCity: !!text });
  }
  /**
   * 过滤table数据-平台、城市、商圈独立检索
   * type代表是过滤条件：平台、城市、商圈(platform、city、 area)
   * name代表过滤字段名：平台、城市、商圈(biz_district_name、city_name_joint、platform_name)
   */
  onSearch = () => {
    const { searchText, dataSource } = this.state;
    const reg = new RegExp(searchText, 'gi');
    // 深拷贝: 检索条件全部为空时，copy-dataSource,有检索条件时copy-dataSearch
    // const temp = !(!!searchText || !!searchTextPlatform || !!searchTextCity) && dataSearch.length > 0 ? dataSearch : dataSource;
    const data = Object.assign(dataSource);

    this.setState({
      filterDropdownVisible: false,
      // filtered: searchText == ' ' ? false : !!searchText,  // 有检索条件为true,否则为false searchText 为空字符串或在 onInputChange中修改状态
      dataSearch: data.map((record) => {
        const match = record.biz_district_name && record.biz_district_name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          biz_district_name: record.biz_district_name,
        };
      }).filter(record => !!record),
    });
  }
  // 平台
  onSearchPlatform = () => {
    const { searchTextPlatform, dataSource } = this.state;
    const reg = new RegExp(searchTextPlatform, 'gi');
    // 深拷贝
    const data = Object.assign(dataSource);

    this.setState({
      filterDropdownVisible: false,
      // filtered: searchText == ' ' ? false : !!searchText,  // 有检索条件为true,否则为false searchText 为空字符串或在 onInputChange中修改状态
      dataSearch: data.map((record) => {
        const match = record.platform_name && record.platform_name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          platform_name: record.platform_name,
        };
      }).filter(record => !!record),
    });
  }
  // 城市
  onSearchCity = () => {
    const { searchTextCity, dataSource } = this.state;
    const reg = new RegExp(searchTextCity, 'gi');
    // 深拷贝
    const data = Object.assign(dataSource);

    this.setState({
      filterDropdownVisible: false,
      // filtered: searchText == ' ' ? false : !!searchText,  // 有检索条件为true,否则为false searchText 为空字符串或在 onInputChange中修改状态
      dataSearch: data.map((record) => {
        const match = record.city_name_joint && record.city_name_joint.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          city_name_joint: record.city_name_joint,
        };
      }).filter(record => !!record),
    });
  }
  // 选择商圈回调
  onSelectPlatList = (value) => {
    // 选择商圈后，拷贝之前商圈数据和新增数据；Object.assign()：一层对象时是深拷贝。
    const newObj = {};
    Object.assign(newObj, this.state.storePlatList, value);
    this.setState({
      storePlatList: value,
    });
  }

  // 批量选中
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };
  onClear = (type) => {
    const { searchText, searchTextPlatform, searchTextCity, filtered, filteredPlatform, filteredCity } = this.state;
    this.setState({
      searchText: type === 'area' ? '' : searchText,     // 过滤条件-商圈
      filtered: type === 'area' ? false : filtered,        // 是否有过滤条件-商圈：重置商圈内容后，filtered为false,
      searchTextPlatform: type === 'platform' ? '' : searchTextPlatform,
      filteredPlatform: type === 'platform' ? false : filteredPlatform,
      searchTextCity: type === 'city' ? '' : searchTextCity,
      filteredCity: type === 'city' ? false : filteredCity,
    });
  }
  // 获取城市列表
  platformChange = (data) => {
    const { form } = this.props;
    const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
    const value = aoaoBossTools.getArrayFormObject(cityList, 'city_spelling'); // 城市id列表
    this.setState({
      storeCityList: [], // 存储城市数据
      storePlatList: [], // 存储平台数据
    });
    if (this.props.form.getFieldValue('platform_code_list').length > data.length) {
      const platformValue = this.props.form.getFieldValue('platform_code_list'); // 平台改变之前的数据
      const cityValue = this.props.form.getFieldValue('city_spelling_list'); // 城市当前的数据
      const diffItem = aoaoBossTools.filterDiffOfArray(platformValue, data); // 平台更改后的差异数据
      const cityListFromPlatform = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), diffItem, 'city_name_joint'); // 平台下城市信息列表
      const value = aoaoBossTools.getArrayFormObject(cityListFromPlatform, 'city_spelling'); // 城市id列表
      const setCityValue = aoaoBossTools.removeItemOfFilter(cityValue, value); // 过滤更改前后的差异id数据
      // 如果平台列表增加，则在城市选择列表里增加对应的城市选项
      this.props.form.setFields({
        city_spelling_list: {
          value: setCityValue,
        },
      });
      this.setState({ cityList });
    } else {
      this.setState({ platformList: data, cityList });
    }
  };

  // 生成商圈下拉选项
  handleCityChange = (key) => {
    this.props.form.setFields({
      biz_district_id_list: {
        value: [],
      },
    });
    this.setState({
      storeCityList: key,
    });
    const data = {
      account_id: authorize.account.id,
      city_list: key,
    };
    this.props.dispatch({ type: 'system/getNotSupplierE', payload: data });
  };

  // 生成平台下拉选项
  createPlatformList() {
    const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
    return (dataList.map((item, index) => {
      return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>;
    }));
  }

  // 选择商圈回调
  onSelectPlatList = (value) => {
    this.setState({
      storePlatList: value,
    });
  }

  // 添加商圈
  handleSubmits = () => {
    const { notSupplierDistrict } = this.state;
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        try {
          if (values.biz_district_id_list.length == 0) {
            message.error('商圈不可为空');
            throw new Error('商圈不可为空');
          }
        } catch (e) {
          console.error(e.message);
        }
        return false;
      } else {
        // const values = this.props.form.getFieldsValue(['platform_code_list', 'city_spelling_list', 'biz_district_id_list']);
        // // 存储的城市数据
        // values.city_spelling_list = this.state.storeCityList;
        // // 存储的商圈数据
        // values.biz_district_id_list = this.state.storePlatList;

        const dataList = aoaoBossTools.readDataFromLocal(1, 'region'); // 获取当前所有平台
        const platformIndexList = aoaoBossTools.getArrayItemIndex(dataList, values.platform_code_list, 'platform_code'); // 获取平台信息所处数组的索引
        const platformInfo = []; // 筛选后表格数据容器
        const areaIds = [];
        // 从'platform_code_list', 'city_spelling_list', 'biz_district_id_list'这三组数据中筛选出数据重新组合成展示所需的数据格式
        // 亚军留下的老代码，我也看不懂，经测试功能为，城市变更之后，比较是否需要从新渲染商圈的选择项，只替换需要选择的项
        for (let z = 0; z < platformIndexList.length; z++) {
          const i = platformIndexList[z];

          for (let k = 0; k < dataList[i].city_list.length; k++) {
            for (let j = 0; j < values.city_spelling_list.length; j++) {
              if (dataList[i].city_list[k].city_spelling == values.city_spelling_list[j]) {
                // 遍历商圈-原：遍历平台->遍历城市->遍历商圈，修改为遍历可添加供应商的商圈
                // for (let h = 0; h < dataList[i].city_list[k].biz_district_list.length; h++) {
                for (let l = 0; l < values.biz_district_id_list.length; l++) {
                  for (let h = 0; h < dataList[i].city_list[k].biz_district_list.length; h++) {
                    // 如果所选的商圈在可添加供应商的商圈范围内，则执行下一步
                    if (dataList[i].city_list[k].biz_district_list[h].biz_district_id == values.biz_district_id_list[l] && !areaIds.includes(values.biz_district_id_list[l])) {
                      // 去重: !areaIds.includes(values.biz_district_id_list[l])
                      areaIds.push(values.biz_district_id_list[l]);
                      // 循环所有可分配商圈数据，匹配id，查找平台商圈id
                      for (let n = 0; n < notSupplierDistrict.length; n++) {
                        if (notSupplierDistrict[n]._id === values.biz_district_id_list[l]) {
                          platformInfo.push({
                            isNew: true,
                            platform_district_id: notSupplierDistrict[n].district_id,  // 平台商圈id
                            platform_name: dataList[i].platform_name,
                            platform_code: dataList[i].platform_code,
                            city_spelling: dataList[i].city_list[k].city_spelling,
                            city_name_joint: dataList[i].city_list[k].city_name_joint,
                            biz_district_id: dataList[i].city_list[k].biz_district_list[h].biz_district_id,  // notSupplierDistrict[h].district_id,
                            biz_district_name: dataList[i].city_list[k].biz_district_list[h].biz_district_name, // notSupplierDistrict[h].name中含有商圈ID
                            _id: dataList[i].city_list[k].biz_district_list[h].biz_district_id,
                            state: notSupplierDistrict[n].state,
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } // 筛选完成
        // 对已经添加在缓存区的商圈去重
        const addedArea = this.state.dataSource; // 已经存在的商圈信息
        const addedAreaIdList = []; // 存在的商圈id列表
        for (let i = 0; i < addedArea.length; i++) {
          addedAreaIdList.push(addedArea[i].biz_district_id);
        }
        // 去重处理
        for (let j = 0; j < platformInfo.length; j++) {
          if (addedAreaIdList.indexOf(platformInfo[j].biz_district_id) == -1) {
            addedArea.push(platformInfo[j]);
          }
        }
        dispatch({ type: 'system/setAreaBundleListR', payload: addedArea });
      }
    });
    this.setState({
      storeCityList: [],
      storePlatList: [],
    });
    form.resetFields(['platform_code_list', 'city_spelling_list', 'biz_district_id_list']);
  };

  // 单条删除数据
  deleteSingleArea = (record, index) => {
    const { searchText, dataSource, dataSearch } = this.state;
    // 有过滤条件时，dataSearch 和 dataSource 都删除；否则dataSource删除
    if (record.isNew) {
      let dataOne = [];
      let dataTwo = [];
      if (searchText) {
        dataOne = this.deleteSingleAreaMethod(dataSearch, record);
      }
      dataTwo = this.deleteSingleAreaMethod(dataSource, record);
      this.setState({
        dataSearch: dataOne,
        dataSource: dataTwo,
      });
    } else {
      this.props.dispatch({
        type: 'system/removeBizDistrictE',
        payload: {
          index,
          supplier_id: this.props.location.query.id,
          biz_district_id: record.biz_district_id,
        },
      });
    }
  }
  // 单条删除方法
  deleteSingleAreaMethod = (array, record) => {
    const data = [];
    for (let i = 0; i < array.length; i++) {
      if (record.biz_district_id != array[i].biz_district_id) {
        data.push(array[i]);
      }
    }
    return data;
  }
  // 批量删除
  batchDelete = () => {
    const { searchText, dataSource, dataSearch, selectedRows } = this.state;
    // 有过滤条件时，dataSearch 和 dataSource 都删除；否则dataSource删除
    let dataOne = [];
    let dataTwo = {};
    // if (searchText) {
    //   dataOne = this.batchDeleteMethod(dataSearch);
    // }
    dataTwo = this.batchDeleteMethod(dataSource);
    this.setState({
      dataSearch: [],
      dataSource: dataTwo.data,
      selectedRowKeys: [],
      selectedRows: [],
    });
    this.props.dispatch({
      type: 'system/removeBizDistrictE',
      payload: {
        supplier_id: this.props.location.query.id,
        biz_district_id: dataTwo.sourceData,
      },
    });
  }
  // 批量删除
  batchDeleteMethod = (array) => {
    const filter = this.state.selectedRows;
    const data = [];
    const idArray = [];
    const dataArray = [];
    // 遍历选择项，取出选择项的商圈id
    for (let i = 0; i < filter.length; i++) {
      if (filter[i].isNew) {
        idArray.push(filter[i].biz_district_id); // state直接删除的数据
      } else {
        dataArray.push(filter[i].biz_district_id); // 需要后台删除的供应商
      }
    }
    // 筛选array，判断array中的对象的biz_district_id 是否存在于 idArray中，如果不存在 取出添加对象
    for (let i = 0; i < array.length; i++) {
      if (idArray.indexOf(array[i].biz_district_id) == -1) {
        data.push(array[i]);
      }
    }
    return {
      data,
      sourceData: dataArray,
    };
  };

  // 保存添加的商圈
  saveAddArea = () => {
    const { dispatch, form } = this.props;
    const id = dot.get(this, 'state.initialSupplierValue._id');
    const state = dot.get(this, 'state.initialSupplierValue.state');
    form.validateFields((err) => {
      if (err) {
        return false;
      } else {
        const supplierName = form.getFieldsValue(['supplier_name']).supplier_name;
        const supplierId = form.getFieldsValue(['supplier_id']).supplier_id;
        if (supplierName == '') {
          message.error('请填写服务商名字');
          return false;
        } else if (supplierId == '') {
          message.error('请填写服务商ID');
          return false;
        } else {
          // 把保存的商圈读取出来
          const bizDistrictInfoList = this.state.dataSource;
          dispatch({
            type: 'system/disableSupplierE',
            payload: {
              biz_district_info_list: bizDistrictInfoList,
              supplier_name: supplierName,
              _id: id,
              supplier_id: supplierId, // 增加用户自定义id
              state,
              queryId: this.props.location.query.id,
            },
          });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const columns = [
      {
        title: '平台商圈ID',
        dataIndex: 'platform_district_id',
        key: 'platform_district_id',
        width: '20%',
      }, {
        title: '商圈',
        dataIndex: 'biz_district_name',
        key: 'biz_district_name',
        width: '20%',
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Row>
              <Input placeholder="请输入商圈" onChange={this.onInputChange} value={this.state.searchText} />
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Button type="primary" onClick={this.onSearch} size="small">查询</Button>
              <Button size="small" onClick={() => this.onClear('area')} style={{ float: 'right' }} >重置</Button>
            </Row>
          </div>
        ),
        filterIcon: <Icon type="bars" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisible: visible,
          },
            () => {
              // this.searchInput.focus();
            },
          );
        },
      }, {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
        width: '15%',
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Row>
              <Input placeholder="请输入平台" onChange={this.onInputChangePlatform} value={this.state.searchTextPlatform} />
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Button type="primary" onClick={this.onSearchPlatform} size="small">查询</Button>
              <Button size="small" onClick={() => this.onClear('platform')} style={{ float: 'right' }} >重置</Button>
            </Row>
          </div>
        ),
        filterIcon: <Icon type="bars" style={{ color: this.state.filteredPlatform ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisiblePlatform,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisiblePlatform: visible,
          },
            () => {
              // this.searchInput.focus();
            },
          );
        },
      }, {
        title: '城市',
        dataIndex: 'city_name_joint',
        key: 'city_name_joint',
        width: '20%',
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Row>
              <Input placeholder="请输入城市" onChange={this.onInputChangeCity} value={this.state.searchTextCity} />
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Button type="primary" onClick={this.onSearchCity} size="small">查询</Button>
              <Button size="small" onClick={() => this.onClear('city')} style={{ float: 'right' }} >重置</Button>
            </Row>
          </div>
        ),
        filterIcon: <Icon type="bars" style={{ color: this.state.filteredCity ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisibleCity,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisibleCity: visible,
          },
            () => {
              // this.searchInput.focus();
            },
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        filterMultiple: false, // 是否多选
        // 表头的筛选菜单项
        filters: [{
          text: '启用',
          value: '启用',
        }, {
          text: '禁用',
          value: '禁用',
        }],
        width: '10%',
        // 自定义 fiter 图标。
        filterIcon: <Icon type="bars" style={{ color: '#aaa' }} />,
        // 本地模式下，确定筛选的运行函数
        onFilter: (text, record) => bizDistrictState.description(record.state) === text,
        render: (text) => {
          return (
            <span>{bizDistrictState.description(text)}</span>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'biz_district_id',
        key: 'biz_district_id',
        width: '15%',
        render: (text, record, index) => {
          // 没有用户的时候才可以移除
          return (
            <span className="systemTextColor pointer" onClick={this.deleteSingleArea.bind(this, record, index)}>移除</span>
          );
        },
      },
    ];
    const { searchText, searchTextPlatform, searchTextCity } = this.state;
    const data = searchText || searchTextPlatform || searchTextCity ? this.state.dataSearch : this.state.dataSource;

    return (
      <div>
        <Form>
          <Row>
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'供应商名称'}>
                {getFieldDecorator('supplier_name', {
                  rules: [
                    {
                      required: false,
                      message: '请选择供应商名称',
                      trigger: 'onBlur',
                      type: 'string',
                    },
                  ],
                  initialValue: dot.get(this, 'state.initialSupplierValue.supplier_name'),
                })(<Input placeholder="请输入供应商名称" />)}
              </FormItem>
            </Col>
            {/* 新增供应商ID */}
            <Col sm={6}>
              <FormItem {...formItemLayout} label={'供应商ID'}>
                {getFieldDecorator('supplier_id', {
                  rules: [
                    {
                      required: false,
                      message: '请选择供应商ID',
                      trigger: 'onBlur',
                      type: 'string',
                    },
                  ],
                  initialValue: dot.get(this, 'state.initialSupplierValue.supplier_id'),
                })(<Input placeholder="请输入供应商ID" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormItem label="平台" {...formItemLayout}>
                {getFieldDecorator('platform_code_list', {
                  rules: [
                    {
                      type: 'array',
                      message: '请选择平台',
                    }, {
                      required: false,
                      message: '请选择平台',
                    },
                  ],
                  initialValue: this.state.platformInitValue,
                })(
                  <Select showSearch optionFilterProp="children" mode="multiple" placeholder="请选择平台" onChange={this.platformChange}>
                    {this.createPlatformList()
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem label="城市" {...formItemLayout}>
                {getFieldDecorator('city_spelling_list', {
                  rules: [
                    {
                      type: 'array',
                      message: '请选择城市',
                    }, {
                      required: false,
                      message: '请选择城市',
                    },
                  ],
                })(
                  <AllSelect
                    onChange={this.handleCityChange}
                    placeholder="请选择城市"
                  >
                    {this.state.cityList.map(item => (
                      <Option value={item.city_spelling} key={item.city_spelling}>{item.city_name_joint}</Option>
                    ))}
                  </AllSelect>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem label="商圈" {...formItemLayout}>
                {getFieldDecorator('biz_district_id_list', {
                  rules: [
                    {
                      type: 'array',
                      message: '请选择商圈',
                    }, {
                      required: false,
                      message: '请选择商圈',
                    },
                  ],
                })(
                  <AllSelect
                    onChange={this.onSelectPlatList}
                    placeholder="请选择商圈"
                  >
                    {this.state.notSupplierDistrict.map(item => (
                      <Option value={item._id} key={item._id}>{`${item.name} (${item.district_id})`}</Option>
                    ))}
                  </AllSelect>,
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <Button type="primary" className="mgl16" onClick={this.handleSubmits}>添加商圈</Button>
            </Col>
          </Row>
          <Row className="mgb16">
            <Col sm={6}>
              <Col sm={4} />
              <Button type="primary" className="mgl16" onClick={this.batchDelete}>批量移除</Button>
            </Col>
          </Row>
        </Form>
        <Table
          size="small"
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          rowKey={(record, index) => {
            return index;
          }}
          pagination={false}
          scroll={{ y: 300 }}
          bordered
        />
        <Row justify={'center'} type="flex" className="mgt16">
          <Button>
            <Link to="System/Supplier">返回</Link>
          </Button>
          {dot.get(this, 'state.dataSource').length >= 0
            ? <Button type="primary" className="mgl16" onClick={this.saveAddArea}>保存</Button>
            : ''
          }
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ system }) {
  return { system };
}
Edit = Form.create()(Edit);
export default connect(mapStateToProps)(Edit);
