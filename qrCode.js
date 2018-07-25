import md5 from 'crypto-js/md5'
import { find, propEq } from 'ramda';

const regexString = MaxStringLength => `.{1,${MaxStringLength}}`;

export const splitData = (data, capacity) => {
  if(typeof data !== 'string' || data.length <= 0 || capacity < 2) {
    throw Error('input value is not supported')
  }
  const checkSum = md5(data).toString();
  const dataList = data.match(new RegExp(regexString(capacity), 'g'));
  const dataLength = dataList.length;
  return dataList.map((code, index) => ({
    total: dataLength,
    index,
    checkSum,
    value: code,
  }));
};

export const assembleData = (data, result = []) => {
  const dataObject = JSON.parse(data);
  if (typeof find(propEq('index', dataObject.index))(result) === 'undefined') {
    return [...result, dataObject];
  }
  return result
};

export const verifyCheckSum = (data, checkSum) => {
  return md5(data).toString() === checkSum;
};



export default {
  splitData,
  assembleData,
  verifyCheckSum,
}