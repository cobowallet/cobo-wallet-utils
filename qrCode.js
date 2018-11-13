import md5 from 'crypto-js/md5'
import { find, propEq } from 'ramda';

const regexString = MaxStringLength => `.{1,${MaxStringLength}}`;

export const splitData = (data, capacity) => {
  if(typeof data !== 'string' || data.length <= 0 || capacity < 2) {
    throw Error('input value is not supported')
  }
  const checkSum = md5(data).toString();
  const partCount = Math.ceil(data.length / capacity)
  const partLength = Math.ceil(data.length / partCount)
  const parts = []
  for (let i = 0; i < partCount; i++) {
    parts.push(data.substring(partLength * i, Math.min(partLength * i + partLength, data.length)))
  }
  return parts.map((code, index) => ({
    total: partCount,
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