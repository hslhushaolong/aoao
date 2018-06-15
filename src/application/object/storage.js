import CoreObject from './core';
import { KnightTypeState, Platform, KnightTypeWorkProperty } from '../define/';

// 骑士类型
class KnightType extends CoreObject {
  constructor() {
    super();
    this.id = '';             // 骑士类型id
    this.supplierId = '';     // 供应商id
    this.name = '';           // 骑士类型名称
    this.property = '';       // 骑士工作性质
    this.state = '';          // 骑士类型状态
    this.platform = '';       // 骑士类型所属平台
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      knight_type: 'name',
      platform_code: { key: 'platform',
        transform: value => ({ id: value, name: Platform.description(value) }),
      },
      work_type: {
        key: 'property',
        transform(value) {
          return ({ id: value, name: KnightTypeWorkProperty.description(value) });
        },
      },
      state: {
        key: 'state',
        transform: value => ({ id: value, name: KnightTypeState.description(value) }),
      },
    };
  }

}

module.exports = {
  KnightType,   // 骑士类型
};
