import IDValidator from 'id-validator';
import moment from 'moment';
import store from 'store';

const Validator = new IDValidator();
const patterns = store.get('patterns') || {};
const PHONE_REGEXP = patterns.phonePattern ? patterns.phonePattern : '1[3-9][0-9]\\d{8}$';
// eslint-disable-next-line no-useless-escape
const LONGITUDE_REGEXP = /^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/; // 经度
// eslint-disable-next-line no-useless-escape
const LATITUDE_REGEXP = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,10})?)|90(([.][0]{1,10})?))$/; // 纬度
const PASSWORD_REGEXP = /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,64}$)|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,64}$)|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W]{8,64}$)|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z\W]{8,64}$))/;

export function uploadImage(rule, value, callback) {
  if (typeof value === 'object') {
    if (value.file.type !== 'image/jpeg' && value.file.type !== 'image/png') {
      callback(new Error('必须上传图片'));
    } else if (value.file.size / 1024 > 200) {
      callback(new Error('图片必须小于200kb'));
    } else {
      callback();
    }
  } else if (typeof value === 'string') {
    callback();
  } else if (value instanceof Array && !value.length) {
    callback(new Error('请选择图片'));
  } else {
    callback();
  }
}

function stringArrayIsRepeat(arr) {
  var hash = {};
  for (var i in arr) {
    if (hash[arr[i]]) {
      return true;
    }
    hash[arr[i]] = true;
  }
  return false;
}

export function uploadLess100mb(rule, value, callback) {
  if (typeof value === 'object') {
    if (value.fileList.length > 10) {
      callback(new Error('最多上传10个文件'));
    }
    const nameArray = [];
    value.fileList.forEach(item => {
      nameArray.push(item.name);
      if (item.size / 1024 / 1024 > 100) {
        callback(new Error('文件必须小于100mb'));
      }
    });
    if (stringArrayIsRepeat(nameArray)) callback(new Error('上传的文件有重复'));
    callback();
  } else if (typeof value === 'string') {
    callback();
  } else if (value instanceof Array && !value.length) {
    callback(new Error('请选择文件'));
  } else {
    callback();
  }
}

export function timeAfterNow(rule, value, callback) {
  if (value) {
    value.isAfter(moment()) ? callback() : callback(new Error('时间必须在今天之后！'));
  } else {
    callback();
  }
}

export function endTimeAfterNow(rule, value, callback) {
  if (value) {
    value[1].isAfter(moment()) ? callback() : callback(new Error('结束时间必须在今天之后！'));
  } else {
    callback();
  }
}

export function isLatitude(rule, value, callback) {
  if (value) {
    validationLatitude(value + '') ? callback() : callback(new Error('纬度格式不正确！'));
  } else {
    callback();
  }
}

export function isLongitude(rule, value, callback) {
  if (value) {
    validationLongitude(value + '') ? callback() : callback(new Error('经度格式不正确！'));
  } else {
    callback();
  }
}

export function isPhone(rule, value, callback) {
  if (value) {
    validationPhone(value) ? callback() : callback(new Error('手机号码格式不正确！'));
  } else {
    callback();
  }
}

export function isPassword(rule, value, callback) {
  if (value) {
    validationPassword(value)
      ? callback()
      : callback(
          new Error(
            '8-64位，需同时包含大写或小写字母、数字、特殊字符中的三种，不能使用账号做密码!',
          ),
        );
  } else {
    callback();
  }
}

export function validationPassword(password) {
  if (!password || password.length <= 0) {
    return false;
  }
  const arr = password.match(PASSWORD_REGEXP);
  return !!arr;
}

export function validationPhone(phone) {
  if (!phone || phone.length <= 0) {
    return false;
  }
  const arr = phone.match(PHONE_REGEXP);
  return !!arr;
}

export function validationIdCard(id) {
  return Validator.isValid(id);
}

export function validationLongitude(longitude) {
  if (!longitude || longitude.length <= 0) {
    return false;
  }
  const arr = longitude.match(LONGITUDE_REGEXP);
  return !!arr;
}

export function validationLatitude(latitude) {
  if (!latitude || latitude.length <= 0) {
    return false;
  }

  const arr = latitude.match(LATITUDE_REGEXP);
  return !!arr;
}
