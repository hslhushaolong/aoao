import dva from 'dva';
import { createHashHistory } from 'history';
import { useRouterHistory } from 'dva/router';
import createLoading from 'dva-loading';
import 'antd/dist/antd.css';

import moment from 'moment';
import 'moment/locale/zh-cn';
import application from './application';
import './index.html';
import './index.css';

moment.locale('zh-cn');

// 初始化应用
window.application = application;

// 1. Initialize
const app = dva({
  history: useRouterHistory(createHashHistory)({ queryKey: false }),
  ...createLoading(),
  onError(error) {
    console.error('app onError', error);
  },
});

// 2. Plugins
app.use(createLoading({
  effects: true,
}));

// 3. Model
app.model(require('./models/storage'));
app.model(require('./models/login'));
app.model(require('./models/authorize'));
app.model(require('./models/system'));
app.model(require('./models/system/download'));
app.model(require('./models/upload'));
app.model(require('./models/employee'));
app.model(require('./models/stores'));
app.model(require('./models/finance'));
app.model(require('./models/salary/salary'));
app.model(require('./models/salary/task'));
app.model(require('./models/operationManage'));
app.model(require('./models/inquire'));
app.model(require('./models/account'));
app.model(require('./models/accountException'));
app.model(require('./models/expense'));
app.model(require('./models/expense/approval'));
app.model(require('./models/analysis'));


// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
