export * from './cache';
export * from './redis.cache';
export * from './message-crypto';

/**
 * 指定长度随机字符串
 * 
 * @param length 
 * @returns 
 */
export function createNonceStr (length = 16): string {
  length = length > 32 ? 32 : length;
  let str = '';
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

/**
 * 从error message中截取rid
 * @param errMsg 
 * @returns 
 */
export function parseRid (errMsg: string): string {
  if (typeof errMsg !== 'string') {
    return '';
  }
  const index = errMsg.indexOf('rid:');
  if (index >= 0) {
    return errMsg.substring(index + 5);
  } else {
    return '';
  }
}
