import { splitData, assembleData, extractData } from "../qrCode";
import zlib from "browserify-zlib";
import { Buffer } from "safe-buffer";

describe("qrCode", function() {
  describe("splitData", function() {
    it("should split the Data into mutil parts", function() {
      const data = "12345678";
      const dataList = splitData(data, 4, true);
      const result = [
        {
          checkSum: "070ad62969ef903b5d39a979e61d40a0",
          compress: true,
          index: 0,
          total: 10,
          value: "H4sI"
        },
        { index: 1, total: 10, value: "AAAA" },
        { index: 2, total: 10, value: "AAAA" },
        { index: 3, total: 10, value: "AzM0" },
        { index: 4, total: 10, value: "MjYx" },
        { index: 5, total: 10, value: "NTO3" },
        { index: 6, total: 10, value: "AACv" },
        { index: 7, total: 10, value: "2uCa" },
        { index: 8, total: 10, value: "CAAA" },
        { index: 9, total: 10, value: "AA==" }
      ];
      expect(dataList).toEqual(result);
    });
    it("should split the Data into one parts", function() {
      const data = "12345678";
      const dataList = splitData(data, 10, false);
      const result = [
        {
          total: 1,
          index: 0,
          checkSum: "25d55ad283aa400af464c76d713c07ad",
          value: "12345678",
          compress: false
        }
      ];
      expect(dataList).toEqual(result);
    });
    it("should split the Chinese Character into mutil parts", function() {
      const data = "测试测试测试测试测试测";
      const dataList = splitData(data, 3);
      const result = [
        {
          checkSum: "6f8c4a28dd7084fdf8336ff7b0ca95a0",
          compress: true,
          index: 0,
          total: 14,
          value: "H4s"
        },
        { index: 1, total: 14, value: "IAA" },
        { index: 2, total: 14, value: "AAA" },
        { index: 3, total: 14, value: "AAA" },
        { index: 4, total: 14, value: "A3u" },
        { index: 5, total: 14, value: "2tf" },
        { index: 6, total: 14, value: "vF+" },
        { index: 7, total: 14, value: "qnP" },
        { index: 8, total: 14, value: "cJM" },
        { index: 9, total: 14, value: "A4k" },
        { index: 10, total: 14, value: "Bsc" },
        { index: 11, total: 14, value: "iEA" },
        { index: 12, total: 14, value: "AAA" },
        { index: 13, total: 14, value: "=" }
      ];
      expect(dataList).toEqual(result);
    });
    it("should throw error if the input value is not supported", function() {
      const data = "";
      expect(() => splitData(data, 1)).toThrow("input value is not supported");
    });
  });

  describe("assembleData", function() {
    it("should assemble the data", function() {
      const dataOne =
        '{"total":2,"index":0,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"1234", "compress": true}';
      const dataTwo = '{"total":2,"index":1,"value":"5678"}';
      let result = [];
      result = assembleData(dataOne, result);
      result = assembleData(dataTwo, result);
      const exceptedResult = [
        {
          total: 2,
          index: 0,
          checkSum: "25d55ad283aa400af464c76d713c07ad",
          value: "1234",
          compress: true
        },
        {
          total: 2,
          index: 1,
          value: "5678"
        }
      ];
      expect(result).toEqual(exceptedResult);
    });

    it("should assemble the current data when the input data is more than required", function() {
      const dataOne =
        '{"total":2,"index":0,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"1234"}';
      const dataTwo =
        '{"total":2,"index":1,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"5678"}';
      let result = [];
      result = assembleData(dataOne, result);
      result = assembleData(dataTwo, result);
      result = assembleData(dataOne, result);
      const exceptedResult = [
        {
          total: 2,
          index: 0,
          checkSum: "25d55ad283aa400af464c76d713c07ad",
          value: "1234"
        },
        {
          total: 2,
          index: 1,
          checkSum: "25d55ad283aa400af464c76d713c07ad",
          value: "5678"
        }
      ];
      expect(result).toEqual(exceptedResult);
    });
  });
  describe("extractData", function() {
    it("should throw Error when data is invalid", function() {
      const data = {};
      expect(() => extractData(data)).toThrow("input value is not supported");
    });
    it("should throw Error when checkSum not match", function() {
      const splitedData = [
        { checkSum: "123", compress: true, index: 0, total: 10, value: "H4sI" },
        { index: 1, total: 10, value: "AAAA" },
        { index: 2, total: 10, value: "AAAA" },
        { index: 3, total: 10, value: "AzM0" },
        { index: 4, total: 10, value: "MjYx" },
        { index: 5, total: 10, value: "NTO3" },
        { index: 6, total: 10, value: "AACv" },
        { index: 7, total: 10, value: "2uCa" },
        { index: 8, total: 10, value: "CAAA" },
        { index: 9, total: 10, value: "AA==" }
      ];
      expect(() => extractData(splitedData)).toThrow("checkSum not valid");
    });
    it("should return base64 decoded and extracted data", function() {
      const splitedData = [
        {
          checkSum: "070ad62969ef903b5d39a979e61d40a0",
          compress: true,
          index: 0,
          total: 10,
          value: "H4sI"
        },
        { index: 1, total: 10, value: "AAAA" },
        { index: 2, total: 10, value: "AAAA" },
        { index: 3, total: 10, value: "AzM0" },
        { index: 4, total: 10, value: "MjYx" },
        { index: 5, total: 10, value: "NTO3" },
        { index: 6, total: 10, value: "AACv" },
        { index: 7, total: 10, value: "2uCa" },
        { index: 8, total: 10, value: "CAAA" },
        { index: 9, total: 10, value: "AA==" }
      ];
      const result = extractData(splitedData);
      expect(result).toEqual("12345678");
    });
  });
});
