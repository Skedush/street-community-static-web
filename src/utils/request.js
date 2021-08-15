import axios from 'axios';
import { cloneDeep, isEmpty } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { router } from 'utils';
// import Config from 'utils/config';
import {
  CANCEL_REQUEST_MESSAGE,
  ERROR_REQUEST_MESSAGE,
  MESSAGE_CONFIG_MAX_COUNT,
} from '@/utils/constant';
import qs from 'qs';

const { CancelToken } = axios;
window.cancelRequest = new Map();
message.config({
  maxCount: MESSAGE_CONFIG_MAX_COUNT,
});

axios.defaults.withCredentials = true;
// axios.defaults.headers.common['x-request-type'] = 'ajax';

/* eslint-disable */
const SYSTEM_ERROR = 9001; // 系统异常
const REQUEST_PARAM_ERROR = 9002; // 请求参数异常
const BUSINESS_ERROR = 9003; // 业务异常
const FOREIGN_KEY_ERROR = 9004; // 删除数据时，外键异常
const DATA_NOT_FIND_ERROR = 9005; // 数据未查询到
const AUTH_ERROR = 9006; // 权限异常
const DATA_EXIST_ERROR = 9007; // 数据未查询到
const NOT_BUSINESS_DOCUMENT_ERROR = 9008; // 数据未查询到
const NOT_LOGIN_ERROR = 9009; // 数据未查询到
const USER_NOT_EXIST = 90020; // 用户不存在
const USER_STOP_USING = 90021; // 用户已停用
/* eslint-enable */

/**
 * axios的请求封装，地址判断、错误处理
 *
 * @export
 * @param {object} options 请求选项
 * @returns {Promise} 请求结果
 */
// eslint-disable-next-line max-lines-per-function
export default function request(options) {
  const { data, url, method = 'get' } = options;

  if (!url) {
    throw new Error('request url none');
  }

  const cloneData = cloneDeep(data);
  const newUrl = matchRestfulUrl(url, cloneData);

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${newUrl}${isEmpty(cloneData) ? '' : '?'}${qs.stringify(cloneData)}`
      : newUrl;

  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    });
  });

  options.headers = { 'X-Request-Type': 'ajax' };
  return axios(options)
    .then(response => {
      // const { hostname } = window.location;
      // const hpptsPort = Config.httpsPort;

      if (options.responseType === 'blob') {
        let hearder = response.headers['content-type'];
        if (!hearder) {
          return {
            success: true,
            data: response.data,
          };
        } else if (hearder.indexOf('application/json') !== -1) {
          const reader = new FileReader();

          reader.onload = event => {
            const content = reader.result;
            const contentObj = JSON.parse(content);
            if (contentObj.code === NOT_LOGIN_ERROR) {
              message.error(contentObj.msg);
              if (window.location.hash === '#/dashboard/data/statistics') {
                router.push('/static/login');
              } else {
                router.push('/login');
              }
            } else {
              message.error(contentObj.msg);
            }
          };

          reader.readAsText(response.data);
          return {
            success: false,
          };
        } else {
          return {
            success: true,
            data: response.data,
          };
        }
      }
      const { success, code, msg, value } = response.data;

      if (!success) {
        if (code === NOT_LOGIN_ERROR) {
          message.error(msg);
          if (window.location.hash === '#/dashboard/data/statistics') {
            router.push('/static/login');
          } else {
            router.push('/login');
          }
          // window.location.replace(`http://${hostname}:${hpptsPort}`);
        }
        throw new Error(msg);
      } else {
        // messageWithCRUDUrl(newUrl, value);
        return Promise.resolve({
          success: success,
          message: msg,
          statusCode: code,
          data: value || {},
        });
      }
    })
    .catch(error => {
      const { response } = error;
      if (String(error.message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
          message: CANCEL_REQUEST_MESSAGE,
        };
      }
      let msg;
      let statusCode;
      if (response && response instanceof Object) {
        const { data, statusText } = response;
        statusCode = response.status;
        msg = data.message || statusText;
      } else {
        statusCode = 600;
        msg = error.message;
      }

      if (!msg || msg.length <= 0) {
        msg = ERROR_REQUEST_MESSAGE;
      }

      // Message.destroy();
      message.error(msg);
      return {
        success: false,
        statusCode,
        message: msg,
      };
    });
}

/**
 * 正则匹配restful风格请求并替换对应参数，返回新的url
 * eg: /:id/get, data参数保证必须有id属性
 *
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @returns {string} 新的地址
 */
function matchRestfulUrl(url, data) {
  let newUrl = url;

  try {
    let domain = '';
    const urlMatch = newUrl.match(/[a-zA-z]+:\/\/[^/]*/);
    if (urlMatch) {
      [domain] = urlMatch;
      newUrl = newUrl.slice(domain.length);
    }

    const match = pathToRegexp.parse(newUrl);
    newUrl = pathToRegexp.compile(newUrl)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in data) {
        delete data[item.name];
      }
    }
    newUrl = domain + newUrl;
  } catch (e) {
    newUrl = url;
  }

  return newUrl;
}

/**
 * 匹配CRUD类型的请求，做全局提示
 *
 * @param {string} url 请求地址
 * @param {*} data 请求回复数据
 */
// function messageWithCRUDUrl(url, data) {
//   if (!url || url.length <= 0 || !data) {
//     return;
//   }

//   // 后端批量操作的错误信息会存放在data里
//   if (data.success === false) {
//     return;
//   }

//   // 后端批量操作中有错误的直接提示错误信息
//   if (data.error > 0) {
//     Message.error(data.message);
//     return;
//   }

//   const array = url.split('/');
//   const action = array[array.length - 1];
//   const messages = [
//     {
//       key: 'add',
//       value: '新增成功',
//     },
//     {
//       key: 'update',
//       value: '更新成功',
//     },
//     {
//       key: 'delete',
//       value: '删除成功',
//     },
//     {
//       key: 'impower',
//       value: '授权成功',
//     },
//   ];

//   for (let i = 0; i < messages.length; i++) {
//     const { key, value } = messages[i];
//     if (action === key) {
//       Message.success(value);
//       break;
//     }
//   }
// }
