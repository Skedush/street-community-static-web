// import { AxiosRequestConfig } from 'axios';
import request from '@/utils/request';
import Config from '@/utils/config';
import api from './api';

const { apiPrefix } = Config;

const gen = params => {
  let url = apiPrefix + params;
  let method = 'GET';

  const paramsArray = params.split(' ');
  if (paramsArray.length === 2) {
    method = paramsArray[0];
    url = apiPrefix + paramsArray[1];
    // url = paramsArray[1];
  }

  return function(data, config) {
    return request({
      url,
      data,
      method,
      ...config,
    });
  };
};

// type APIKeys = keyof typeof api;
// type APIObject = {
//   [key in APIKeys]: () => any;
// };

const APIFunction = {};
for (const key of Object.keys(api)) {
  APIFunction[key] = gen(api[key]);
}

export default APIFunction;
