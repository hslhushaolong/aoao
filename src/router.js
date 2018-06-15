/**
 * router center
 * */
import React from 'react';
import { Router } from 'dva/router';

const routes = require('./routes/router');

// 路由中心
export default function ({ history }) {
  return (
    <Router routes={routes} history={history} />
  );
}
