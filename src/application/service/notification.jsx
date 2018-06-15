import _ from 'lodash';
import { notification } from 'antd';
import RequestNotification from '../library/notification';

// 全局的接口请求信息显示
export default function Notification() {
  const request = new RequestNotification();

  // 正常请求的回调钩子处理
  request.hook('notification.hook', (isRequestFinish, loadingCount, successCount, failureCount) => {
    // 调试信息
    // console.log('isRequestFinish, loadingCount, successCount, failureCount', isRequestFinish, loadingCount, successCount, failureCount);

    // 显示信息
    notification.close('AppNotificationLoading');
    notification.open({
      key: 'AppNotificationLoading',
      message: '数据加载中...',
      description: `加载中 ${loadingCount} / 已完成 ${successCount} / 错误 ${failureCount}`,
      duration: null,
    });

    // 判断请求是否完成
    if (isRequestFinish && failureCount === 0) {
      notification.close('AppNotificationLoading');
    }
  });

  // 错误信息的回调钩子处理
  request.hook('message.hook', (isRequestFinish, loadingCount, successCount, failureCount, message) => {
    // 调试信息
    // console.log('isRequestFinish, loadingCount, successCount, failureCount', isRequestFinish, loadingCount, successCount, failureCount);

    // 显示信息
    notification.close('AppNotificationMessage');

    const description = [];
    _.uniq(message).forEach((item, index) => {
      description.push(<p key={index}>{index}: {item}</p>);
    });

    // 判断请求是否完成，是否有错误信息
    if (isRequestFinish && failureCount !== 0) {
      notification.error({
        key: 'AppNotificationMessage',
        message: '详细信息',
        description,
        duration: null,
      });
    }
  });

  return request;
}
