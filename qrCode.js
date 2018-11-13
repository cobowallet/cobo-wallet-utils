import md5 from "crypto-js/md5";
import { find, propEq, sort } from "ramda";
import zlib from "browserify-zlib";
import { Buffer } from "safe-buffer";

const regexString = MaxStringLength => `.{1,${MaxStringLength}}`;

export const splitData = (data, capacity, compress = true, rate) => {
  if (typeof data !== "string" || data.length <= 0 || capacity < 2) {
    throw Error("input value is not supported");
  }
  const maybeCompressedData = compress
    ? zlib.gzipSync(data).toString("base64")
    : data;
  const checkSum = md5(maybeCompressedData).toString();
  const partCount = Math.ceil(maybeCompressedData.length / capacity);
  const partLength = Math.ceil(maybeCompressedData.length / partCount);
  const parts = [];
  for (let i = 0; i < partCount; i++) {
    parts.push(
      maybeCompressedData.substring(
        partLength * i,
        Math.min(partLength * i + partLength, maybeCompressedData.length)
      )
    );
  }
  return parts.map((code, index) => {
    return index === 0
      ? {
          total: partCount,
          index,
          checkSum,
          value: code,
          compress
        }
      : {
          total: partCount,
          index,
          value: code
        };
  });
};

export const assembleData = (data, result = []) => {
  const dataObject = JSON.parse(data);
  if (typeof find(propEq("index", dataObject.index))(result) === "undefined") {
    return [...result, dataObject];
  }
  return result;
};

const diff = (a, b) => a.index - b.index;

export const extractData = data => {
  const received = sort(diff, data);
  if (
    received.length <= 0 ||
    !received[0].checkSum ||
    typeof received[0].compress === "undefined"
  ) {
    throw Error("input value is not supported");
  }
  const { compress, checkSum } = received[0];
  const maybeCompressedData = received.reduce(
    (acc, current) => acc + current.value,
    ""
  );
  if (verifyCheckSum(maybeCompressedData, checkSum)) {
    return compress
      ? zlib.gunzipSync(Buffer.from(maybeCompressedData, "base64")).toString()
      : maybeCompressedData;
  } else {
    throw Error("checkSum not valid");
  }
};

export const verifyCheckSum = (data, checkSum) => {
  return md5(data).toString() === checkSum;
};

export default {
  splitData,
  assembleData,
  verifyCheckSum
};
