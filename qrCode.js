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
}



export const combineMutilQrCode = (data, result = []) => {
  const dataObject = JSON.parse(data);
  if(checkResult(result, dataObject)) {
    return result;
  } else {
    if (typeof find(propEq('index', dataObject.index))(result) === 'undefined') {
      const next = [...result, dataObject];
      if(checkResult(next, dataObject)){
        return next
      }
      return next
    }
  }
};

const checkResult = (result, data) => {
  if(result.length === data.total) {
    const resultString = result.reduce((acc, current) => acc + current.value, '');
    if(md5(resultString).toString() === data.checkSum) {
      return true
    } else {
      throw Error('data is not matched')
    }
  }
  return false
};

export default {
  splitData,
  assembleData
}