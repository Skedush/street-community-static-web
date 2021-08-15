import { cloneDeep } from 'lodash';
import umiRouter from 'umi/router';
import platform from 'platform';
import pathToRegexp from 'path-to-regexp';

// 检测数组中是否有重复值
export function isRepeat(arr) {
  var hash = {};

  for (var i in arr) {
    if (hash[arr[i]]) {
      return true;
    }

    if (arr[i] !== '') {
      hash[arr[i]] = true;
    }
  }
  return false;
}

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array, key, value) {
  if (!Array.isArray(array)) {
    return;
  }
  return array.find(_ => _[key] === value);
}

/**
 * Convert an array to a tree-structured array.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @param   {string}    parentId       The alias of the parent ID of the object in the array.
 * @param   {string}    children  The alias of children of the object in the array.
 * @return  {array}    Return a tree-structured array.
 */
export function arrayToTree(array, id = 'id', parentId = 'pid', children = 'children') {
  const result = [];
  const hash = {};
  const data = cloneDeep(array);

  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach(item => {
    const hashParent = hash[item[parentId]];
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = []);
      hashParent[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

export const router = umiRouter;

/**
 * Whether the path matches the regexp if the language prefix is ignored, https://github.com/pillarjs/path-to-regexp.
 * @param   {string|regexp|array}     regexp     Specify a string, array of strings, or a regular expression.
 * @param   {string}                  pathname   Specify the pathname to match.
 * @return  {array|null}              Return the result of the match or null.
 */
export function pathMatchRegexp(regexp, pathname) {
  return pathToRegexp(regexp).exec(pathname);
}

/**
 * In an array object, traverse all parent IDs based on the value of an object.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the value of the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryPathKeys(array, current, parentId, id = 'id') {
  const result = [current];
  const hashMap = new Map();
  array.forEach(item => hashMap.set(item[id], item));

  const getPath = current => {
    const currentParentId = hashMap.get(current)[parentId];
    if (currentParentId) {
      result.push(currentParentId);
      getPath(currentParentId);
    }
  };

  getPath(current);
  return result;
}

/**
 * 从后台返回的路由树追溯到当前路由的父节点
 *
 * @export
 * @param {Array} array 根路由树
 * @param {string} pathname 当前路由路径
 * @returns {Array} 路由节点集合
 */
export function queryAncestors(array, pathname) {
  let result = [];
  if (!Array.isArray(array)) {
    return result;
  }

  const getPath = arr => {
    let match = false;
    for (let i = 0; i < arr.length; i++) {
      const { route, children } = arr[i];
      result.push(arr[i]);

      match = route && pathMatchRegexp(route, pathname);
      if (!match && children && children.length > 0) {
        match = getPath(children);
      }

      if (match) {
        break;
      } else {
        result.pop();
      }
    }

    return match;
  };

  getPath(array);
  return result;
}

/**
 * Query which layout should be used for the current path based on the configuration.
 * @param   {layouts}     layouts   Layout configuration.
 * @param   {pathname}    pathname  Path name to be queried.
 * @return  {string}   Return frist object when query success.
 */
export function queryLayout(layouts, pathname) {
  let result = 'public';

  const isMatch = regepx => {
    return regepx instanceof RegExp ? regepx.test(pathname) : pathMatchRegexp(regepx, pathname);
  };

  for (const item of layouts) {
    let include = false;
    let exlude = false;
    if (item.include) {
      for (const regepx of item.include) {
        if (isMatch(regepx)) {
          include = true;
          break;
        }
      }
    }

    if (include && item.exlude) {
      for (const regepx of item.exlude) {
        if (isMatch(regepx)) {
          exlude = true;
          break;
        }
      }
    }

    if (include && !exlude) {
      result = item.name;
      break;
    }
  }

  return result;
}

/**
 * Return name and version of browser
 *
 * @export
 * @returns {object} { name, version }
 */
export function getBrowserInfo() {
  const defaultInfo = { name: 'unknow', version: 'unknow' };
  if (!navigator || !navigator.userAgent) {
    return defaultInfo;
  }

  try {
    let ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE', version: tem[1] || '' };
    }

    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        tem = tem.slice(1);
        return { name: tem[0].replace('OPR', 'Opera'), version: tem[1] };
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return { name: M[0], version: M[1] };
  } catch (error) {
    return defaultInfo;
  }
}

/**
 * Return bit of system os
 *
 * @export
 * @returns {number} 32|64
 */
export function getPlatform() {
  const { name, version, os } = platform;
  const browerName = name || '';
  const browerVersion = version ? parseInt(version) : 0;

  const architecture = os.architecture || 32;
  return {
    brower: {
      name: browerName,
      version: browerVersion,
    },
    architecture,
  };
}

/**
 * 给数组对象排序方法
 * @param   {string}   key  数组对象里需要排序的字段
 * @return  {number}   返回1 0 给sort方法使用
 */

export function compare(key) {
  return function(value1, value2) {
    var val1 = value1[key];
    var val2 = value2[key];
    return val2 - val1;
  };
}

/**
 * 给数组交换排序方法(拖拽)
 * @param   {Array}   arr 数组
 * @param   {index}   index1 原下标
 * @param   {index}   index2 新下标
 * @return  {Array}   新数组
 */

export function swapArr(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

/**
 * 数组置顶排序
 * @param   {Array}   fieldData 数组
 * @param   {index}   index 下标
 * @return  {Array}   新数组
 */
export function toFirst(fieldData, index) {
  if (index !== 0) {
    fieldData.unshift(fieldData.splice(index, 1)[0]);
    return fieldData;
  }
}

/**
 * 时间转化
 * @param   {string}   date 非标准的时间
 * @return  {string}   返回标准时间
 */
export function renderTime(date) {
  var dateee = new Date(date).toJSON();
  return new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '');
}
/**
 * 时间转化
 * @param   {string}   time 时间毫秒
 * @return  {string}   返回年月日时分秒
 */

export function dateTime(time) {
  let newDate = new Date(time);
  let { y, M, d } = {
    y: newDate.getFullYear(),
    M: newDate.getMonth() + 1,
    d: newDate.getDate(),
    // h: newDate.getHours() < 10 && newDate.getHours(),
    // m: newDate.getMinutes() < 10 && newDate.getMinutes(),
    // s: newDate.getSeconds() < 10 && newDate.getSeconds(),
  };
  return `${y}${M < 10 ? '0' + M : '' + M}${d < 10 ? '0' + d : '' + d}`;
  // return `${y}${M < 10 ? '0' + M : '' + M}${d < 10 ? '0' + d : '' + d}${h < 10 ? '0' + h : '' + h}${
  //   m < 10 ? '0' + m : '' + m
  // }${s < 10 ? '0' + s : '' + s}`;
}

/**
 * 递归 权限树
 * @param   {Array}   data tree数组
 * @param   {Array}   newTree 空数组
 * @return  {Array}   新数组
 */

export function renderTree(data, newTree) {
  if (data && data.length > 0) {
    data.forEach((item, index) => {
      if (item.children.length === 0) {
        newTree.push(item.id);
      } else {
        renderTree(item.children, newTree);
      }
    });
  }
  return newTree;
}
/**
 *
 * @param {number} len 数字长度
 * @param {number} data 数字内容
 * @param {string} unit 单位
 */

export function judgeUnit(sign, len, data, unit) {
  const obj = { count: 0, unit };
  let val = data;
  switch (len) {
    case 5:
      val /= 10000;
      obj.count = sign ? sign + val.toFixed(2) : val.toFixed(2);
      break;
    case 8:
      val /= 10000000;
      obj.count = sign ? sign + val.toFixed(2) : val.toFixed(2);
      obj.unit = `千${obj.unit}`;
      break;
    case 9:
      val /= 100000000;
      obj.count = sign ? sign + val.toFixed(0) : val.toFixed(0);
      obj.unit = `亿${obj.unit}`;
      break;
    default:
      val /= 10000;
      obj.count = sign ? sign + val.toFixed(0) : val.toFixed(0);
    // obj.unit = obj.unit;
  }
  return obj;
}

/**
 *
 * @param {number} val 数据
 */

export function judgeLevels(value) {
  // let data = parseInt(val);
  let len;
  let sign = null;
  let obj = {};
  let result = null;
  let data = parseInt(value);
  if (data) {
    if (data < 0) {
      sign = '-';
      data = Math.abs(data);
    }
    len = data.toFixed(0).length;
    if (len > 12) {
      obj.unit = '亿亿';
      data /= 1000000000000;
      obj.count = sign ? sign + data.toFixed(0) : data.toFixed(0);
    } else if (len > 8) {
      data /= 10000;
      len = data.toFixed(0).toString().length;
      obj = judgeUnit(sign, len, data, '亿');
    } else if (len > 4) {
      obj = judgeUnit(sign, len, data, '万');
    } else {
      obj.unit = '';
      obj.count = sign ? sign + data : data;
    }
    result = obj.count + obj.unit;
  } else {
    result = value;
  }

  return result;
}
/**
 *
 * @param {number} routeArray 路径数组
 */
// let newArray = []
export function routeTree(routeArray, newArray) {
  routeArray.map((item, index) => {
    newArray.push(item);
    if (item.children && item.children.length > 0) {
      routeTree(item.children, newArray);
    }
  });
  return newArray;
}

export function construction(data, payload) {
  let payloadPanes = payload;
  payloadPanes.level = data.level;
  let newArrData = data.list;
  newArrData = newArrData.map(item => {
    return {
      ...item,
      recordCount: `${judgeLevels(item.receiveAllCount) || item.receiveAllCount} (${judgeLevels(
        item.baseReceiveRecordCount,
      ) || item.baseReceiveRecordCount}/${judgeLevels(item.personReceiveRecordCount) ||
        item.personReceiveRecordCount}/${judgeLevels(item.carReceiveRecordCount) ||
        item.carReceiveRecordCount}/${judgeLevels(item.senseReceiveRecordCount) ||
        item.senseReceiveRecordCount})`,
      errorCount: `${judgeLevels(item.errorAllCount) || item.errorAllCount} (${judgeLevels(
        item.baseErrorRecordCount,
      ) || item.baseErrorRecordCount}/${judgeLevels(item.personErrorRecordCount) ||
        item.personErrorRecordCount}/${judgeLevels(item.carErrorRecordCount) ||
        item.carErrorRecordCount}/${judgeLevels(item.senseErrorRecordCount) ||
        item.senseErrorRecordCount})`,
      pendingCount: `${judgeLevels(item.pendingAllCount) || item.pendingAllCount} (${judgeLevels(
        item.basePendingRecordCount,
      ) || item.basePendingRecordCount}/${judgeLevels(item.personPendingRecordCount) ||
        item.personPendingRecordCount}/${judgeLevels(item.carPendingRecordCount) ||
        item.carPendingRecordCount}/${judgeLevels(item.sensePendingRecordCount) ||
        item.sensePendingRecordCount})`,
      successCount: `${judgeLevels(item.successAllCount) || item.successAllCount} (${judgeLevels(
        item.baseSuccessRecordCount,
      ) || item.baseSuccessRecordCount}/${judgeLevels(item.personSuccessRecordCount) ||
        item.personSuccessRecordCount}/${judgeLevels(item.carSuccessRecordCount) ||
        item.carSuccessRecordCount}/${judgeLevels(item.senseSuccessRecordCount) ||
        item.senseSuccessRecordCount})`,
    };
  });

  payloadPanes.data = newArrData;

  return payloadPanes;
}

export function dataOnchange(ArrData) {
  const newData = {
    ...ArrData,
    recordCount: `${judgeLevels(ArrData.receiveAllCount) || ArrData.receiveAllCount} (${judgeLevels(
      ArrData.baseReceiveRecordCount,
    ) || ArrData.baseReceiveRecordCount}/${judgeLevels(ArrData.personReceiveRecordCount) ||
      ArrData.personReceiveRecordCount}/${judgeLevels(ArrData.carReceiveRecordCount) ||
      ArrData.carReceiveRecordCount}/${judgeLevels(ArrData.senseReceiveRecordCount) ||
      ArrData.senseReceiveRecordCount})`,
    errorCount: `${judgeLevels(ArrData.errorAllCount) || ArrData.errorAllCount} (${judgeLevels(
      ArrData.baseErrorRecordCount,
    ) || ArrData.baseErrorRecordCount}/${judgeLevels(ArrData.personErrorRecordCount) ||
      ArrData.personErrorRecordCount}/${judgeLevels(ArrData.carErrorRecordCount) ||
      ArrData.carErrorRecordCount}/${judgeLevels(ArrData.senseErrorRecordCount) ||
      ArrData.senseErrorRecordCount})`,
    pendingCount: `${judgeLevels(ArrData.pendingAllCount) ||
      ArrData.pendingAllCount} (${judgeLevels(ArrData.basePendingRecordCount) ||
      ArrData.basePendingRecordCount}/${judgeLevels(ArrData.personPendingRecordCount) ||
      ArrData.personPendingRecordCount}/${judgeLevels(ArrData.carPendingRecordCount) ||
      ArrData.carPendingRecordCount}/${judgeLevels(ArrData.sensePendingRecordCount) ||
      ArrData.sensePendingRecordCount})`,
    successCount: `${judgeLevels(ArrData.successAllCount) ||
      ArrData.successAllCount} (${judgeLevels(ArrData.baseSuccessRecordCount) ||
      ArrData.baseSuccessRecordCount}/${judgeLevels(ArrData.personSuccessRecordCount) ||
      ArrData.personSuccessRecordCount}/${judgeLevels(ArrData.carSuccessRecordCount) ||
      ArrData.carSuccessRecordCount}/${judgeLevels(ArrData.senseSuccessRecordCount) ||
      ArrData.senseSuccessRecordCount})`,
  };
  return newData;
}

export function bigIntSimplify(number, decimalDigit) {
  const addWan = function(integer, number, mutiple, decimalDigit) {
    var digit = getDigit(integer);
    if (digit > 6) {
      let remainder = digit % 8;
      if (remainder >= 9) {
        // ‘十万’、‘百万’、‘千万’显示为‘万’
        remainder = 8;
      }
      return (
        Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) /
          Math.pow(10, decimalDigit) +
        '千万'
      );
    } else if (digit > 3) {
      // remainder 范围（-1 ~ 4）
      let remainder = digit % 8;
      if (remainder >= 5) {
        // ‘十万’、‘百万’、‘千万’显示为‘万’
        remainder = 4;
      }
      return (
        Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) /
          Math.pow(10, decimalDigit) +
        '万'
      );
    } else {
      return Math.round(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit);
    }
  };
  const getDigit = function(integer) {
    var digit = -1;
    while (integer >= 1) {
      digit++;
      integer = integer / 10;
    }
    return digit;
  };
  decimalDigit = decimalDigit || 2;
  var integer = Math.floor(number); // 处理成移除小数位的整数
  var digit = getDigit(integer);
  // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
  var unit = [];
  if (digit > 3) {
    var multiple = Math.floor(digit / 8);
    if (multiple >= 1) {
      var tmp = Math.round(integer / Math.pow(10, 8 * multiple));
      unit.push(addWan(tmp, number, 8 * multiple, decimalDigit));
      for (var i = 0; i < multiple; i++) {
        unit.push('亿');
      }
      return unit.join('');
    } else {
      return addWan(integer, number, 0, decimalDigit);
    }
  } else {
    return number;
  }
}
