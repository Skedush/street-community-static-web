import Mock from 'mockjs';
import qs from 'qs';

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
  return array.filter(_ => _[key] === value);
}

/**
 * 生成[n,m)的随机整数
 *
 * @export
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 区间内的随机整数
 */
export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 获取随机头像url
 *
 * @export
 * @returns {string} 头像url
 */
export function randomAvatar() {
  // https://uifaces.co
  const avatarList = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb',
    'https://d3iw72m71ie81c.cloudfront.net/female-17.jpg',
    'https://randomuser.me/api/portraits/men/35.jpg',
    'https://pbs.twimg.com/profile_images/835224725815246848/jdMBCxHS.jpg',
    'https://pbs.twimg.com/profile_images/584098247641300992/N25WgvW_.png',
    'https://d3iw72m71ie81c.cloudfront.net/male-5.jpg',
    'https://images.pexels.com/photos/413723/pexels-photo-413723.jpeg?h=350&auto=compress&cs=tinysrgb',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/women/65.jpg',
    'https://randomuser.me/api/portraits/men/43.jpg',
    'https://tinyfac.es/data/avatars/475605E3-69C5-4D2B-8727-61B7BB8C4699-500w.jpeg',
    'https://pbs.twimg.com/profile_images/943227488292962306/teiNNAiy.jpg',
    'https://randomuser.me/api/portraits/men/46.jpg',
  ];
  return avatarList[randomNumber(0, avatarList.length - 1)];
}

export const Constant = {
  ApiPrefix: '',
};

export const ResponseWarpper = {
  success: function(data, message = '操作成功') {
    return {
      success: true,
      msg: message,
      code: 200,
      value: data,
    };
  },
  failed: function(message = '操作失败') {
    return {
      success: false,
      msg: message,
      code: 404,
    };
  },
};

export { Mock, qs };
