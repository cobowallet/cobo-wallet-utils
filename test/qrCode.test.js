import { splitData, assembleData } from '../qrCode'

describe('qrCode', function() {
  describe('splitData', function() {
    it('should split the Data into mutil parts', function() {
      const data = '12345678';
      const dataList = splitData(data, 4);
      const result = [
        {
          total: 2,
          index: 0,
          checkSum:'25d55ad283aa400af464c76d713c07ad',
          value: '1234',
        },
        {
          total: 2,
          index: 1,
          checkSum:'25d55ad283aa400af464c76d713c07ad',
          value: '5678',
        },
      ];

      expect(dataList).toEqual(result)
    });
    it('should split the Data into one parts', function() {
      const data = '12345678';
      const dataList = splitData(data, 10);
      const result = [
        {
          total: 1,
          index: 0,
          checkSum:'25d55ad283aa400af464c76d713c07ad',
          value: '12345678',
        }
      ];
      expect(dataList).toEqual(result)
    });
    it('should throw error if the input value is not supported', function() {
      const data = '';
      expect(() => splitData(data, 1)).toThrow('input value is not supported');
    });
  });

  describe('assembleData', function() {
    it('should assemble the data', function() {
      const dataOne = '{"total":2,"index":0,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"1234"}'
      const dataTwo = '{"total":2,"index":1,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"5678"}'
      let result = [];
      result = assembleData(dataOne, result);
      result = assembleData(dataTwo, result);
      const exceptedResult = [
        {
          total: 2,
          index: 0,
          checkSum:'25d55ad283aa400af464c76d713c07ad',
          value: '1234',
        },
        {
          total: 2,
          index: 1,
          checkSum:'25d55ad283aa400af464c76d713c07ad',
          value: '5678',
        },
      ]
      expect(result).toEqual(exceptedResult)
    });

    it('should assemble the current data when the input data is more than required', function() {
      const dataOne = '{"total":2,"index":0,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"1234"}';
      const dataTwo = '{"total":2,"index":1,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"5678"}';
      let result = [];
      result = assembleData(dataOne, result);
      result = assembleData(dataTwo, result);
      result = assembleData(dataOne, result);
      const exceptedResult = [
        {
          total: 2,
          index: 0,
          checkSum:'25d55ad283aa400af464c76d713c07ad',
          value: '1234',
        },
        {
          total: 2,
          index: 1,
          checkSum:'25d55ad283aa400af464c76d713c07ad',
          value: '5678',
        },
      ]
      expect(result).toEqual(exceptedResult)
    });

  });
});
