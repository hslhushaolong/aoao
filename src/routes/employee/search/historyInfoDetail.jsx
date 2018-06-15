/**
 *
 * 历史工作信息详情列表
 * @author Jay
 * @class HistoryInfoDetail
 * @extends {Component}
 */

import React, { Component } from 'react';
import { Col, Row } from 'antd';
import aoaoBossTools from './../../../utils/util';

class HistoryInfoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: { content: [] },  // 历史工作信息
    };
  }

  // 传来的数据是个json，而不是数组，呈列表展示
  getDataList=() => {
    const { information } = this.props;
    const dataList = {
      content: [{
        sm: 6,
        title: '工作时间',
        data: `${aoaoBossTools.prctoMinute(information.entry_date, 4)} - ${information.departure_date}` || '--',
      }, {
        sm: 6,
        title: '供应商',
        data: (() => {
          return information.supplier_name || '';
        })(),
      }, {
        sm: 6,
        title: '平台',
        data: (function () {
          let string = '';
          const params = information.platform_list || [];
          const len = params.length || 0;
          params.map((item, index) => {
            string += `${item.platform_name}${index < len - 1 ? '、' : ''}`;
          });
          return string;
        }()),
      }, {
        sm: 6,
        title: '城市',
        data: (function () {
          let string = '';
          const params = information.city_list || [];
          const len = params.length || 0;
          params.map((item, index) => {
            string += `${item.city_name_joint}${index < len - 1 ? '、' : ''}`;
          });
          return string;
        }()),
      }, {
        sm: 6,
        title: '商圈',
        data: (function () {
          let string = '';
          const params = information.district_description || [];
          const len = params.length || 0;
          params.map((item, index) => {
            string += `${item}${index < len - 1 ? '、' : ''}`;
          });
          return string;
        }()),
      }, {
        sm: 6,
        title: '合同归属',
        data: information.contract_belong_name || '--',
      }, {
        sm: 6,
        title: '骑士类型',
        data: information.knight_type_name || '--',
      }, {
        sm: 6,
        title: '招聘渠道',
        data: aoaoBossTools.enumerationConversion(information.recruitment_channel_id) || '--',
      }],
    };
    return dataList;
  }

  // 显示历史工作信息
  showInfoDetail = () => {
    const dataList = this.getDataList();
    return dataList.content.map((item, index) => {
      return (
        <Col sm={6} className="mgb8" key={index}>
          <Col sm={8} className="textRight">
            <span className="mgr8 ftw3">{`${item.title}${item.title != '' ? ': ' : ''}`}</span>
          </Col>
          <Col sm={16} className="textLeft">
            <b>
              <span>{`${item.data} `}</span>
            </b>
          </Col>
        </Col>
      );
    });
  }

  render() {
    return (
      <div>
        <Row>
          {this.showInfoDetail()}
        </Row>
      </div>
    );
  }
}

export default HistoryInfoDetail;
