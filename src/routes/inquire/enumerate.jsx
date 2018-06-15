// tale表头数据源
export const INQUIRE_COLUMNS = (showState, operateCallback) => [
  {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
  }, {
    title: '商圈',
    dataIndex: 'ragion',
    key: 'ragion',
  }, {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
  }, {
    title: '申请创建日期',
    dataIndex: 'date',
    key: 'date',
  }, {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  }];
// 动态创建表头
export const DYNAMIC_TABLE = (callback) => {
  if (callback && callback.length > 0) {
    return (
      {
        title: callback.title,
        dataIndex: callback.dataIndex,
        key: callback.key,
      }
    )
  }
}