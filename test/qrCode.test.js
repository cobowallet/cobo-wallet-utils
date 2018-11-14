const { splitData, assembleData, extractData } = require('../').qrCode

describe('qrCode', function () {
  describe('splitData', function () {
    it('should split the Data into mutil parts with compress', function () {
      const dataList = splitData('abc'.repeat(50), 20, true)
      const result = [
        {
          total: 2,
          index: 0,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b3',
          value: 'H4sIAAAAAAAAA0tMSk',
          compress: true
        },
        {
          total: 2,
          index: 1,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b3',
          value: '4cfAgA0WVYfJYAAAA=',
          compress: true
        }
      ]
      expect(dataList).toEqual(result)
    })

    it('should split the Data into mutil parts with compress by default', function () {
      const dataList = splitData('abc'.repeat(50), 20)
      const result = [
        {
          total: 2,
          index: 0,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b3',
          value: 'H4sIAAAAAAAAA0tMSk',
          compress: true
        },
        {
          total: 2,
          index: 1,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b3',
          value: '4cfAgA0WVYfJYAAAA=',
          compress: true
        }
      ]
      expect(dataList).toEqual(result)
    })

    it('should split the Data into mutil parts without compress', function () {
      const dataList = splitData('abc'.repeat(50), 50, false)
      const result = [
        {
          total: 3,
          index: 0,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcab',
          compress: false
        },
        {
          total: 3,
          index: 1,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'cabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca',
          compress: false
        },
        {
          total: 3,
          index: 2,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'bcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc',
          compress: false
        }
      ]
      expect(dataList).toEqual(result)
    })

    it('should split the chinese character into mutil parts with compress', function () {
      const dataList = splitData('测试'.repeat(50), 30, true)
      const result = [
        {
          total: 2,
          index: 0,
          checkSum: '0ad7e04b8c385496118c08d53fd65c56',
          value: 'H4sIAAAAAAAAA3u2tfvF+q',
          compress: true
        },
        {
          total: 2,
          index: 1,
          checkSum: '0ad7e04b8c385496118c08d53fd65c56',
          value: 'nPRkkiSABid/b3LAEAAA==',
          compress: true
        }
      ]
      expect(dataList).toEqual(result)
    })

    it('should split the chinese character into mutil parts without compress', function () {
      const dataList = splitData('测试'.repeat(50), 50, false)
      const result = [
        {
          total: 2,
          index: 0,
          checkSum: 'd83aa25f1256451bb41edc7949deb2e4',
          value:
            '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
          compress: false
        },
        {
          total: 2,
          index: 1,
          checkSum: 'd83aa25f1256451bb41edc7949deb2e4',
          value:
            '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
          compress: false
        }
      ]
      expect(dataList).toEqual(result)
    })

    it('should throw error if the data is empty', function () {
      expect(() => splitData('', 1)).toThrow('input value is not supported')
    })

    it('should throw error if the  data is not string', function () {
      expect(() => splitData({}, 1)).toThrow('input value is not supported')
    })

    it('should throw error if the capacity  is lower than 2', function () {
      expect(() => splitData('1111', 1)).toThrow(
        'input value is not supported'
      )
    })
  })

  describe('assembleData', function () {
    it('should assemble the data', function () {
      const dataOne =
        '{"total":2,"index":0,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"1234", "compress": true}'
      const dataTwo =
        '{"total":2,"index":1,"value":"5678", "checkSum":"25d55ad283aa400af464c76d713c07ad", "compress": true}'
      let result = []
      result = assembleData(dataOne, result)
      result = assembleData(dataTwo, result)
      const exceptedResult = [
        {
          checkSum: '25d55ad283aa400af464c76d713c07ad',
          compress: true,
          index: 0,
          total: 2,
          value: '1234'
        },
        {
          checkSum: '25d55ad283aa400af464c76d713c07ad',
          compress: true,
          index: 1,
          total: 2,
          value: '5678'
        }
      ]
      expect(result).toEqual(exceptedResult)
    })

    it('should assemble the current data when the input data is more than required', function () {
      const dataOne =
        '{"total":2,"index":0,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"1234"}'
      const dataTwo =
        '{"total":2,"index":1,"checkSum":"25d55ad283aa400af464c76d713c07ad","value":"5678"}'
      let result = []
      result = assembleData(dataOne, result)
      result = assembleData(dataTwo, result)
      result = assembleData(dataOne, result)
      const exceptedResult = [
        {
          total: 2,
          index: 0,
          checkSum: '25d55ad283aa400af464c76d713c07ad',
          value: '1234'
        },
        {
          total: 2,
          index: 1,
          checkSum: '25d55ad283aa400af464c76d713c07ad',
          value: '5678'
        }
      ]
      expect(result).toEqual(exceptedResult)
    })
  })

  describe('extractData', function () {
    it('should throw Error when data is invalid', function () {
      const data = {}
      expect(() => extractData(data)).toThrow('input value is not supported')
    })

    it('should throw Error when data is empty', function () {
      const data = []
      expect(() => extractData(data)).toThrow('input value is not supported')
    })

    it('should throw Error when received checkSums are not matched to each other', function () {
      const splitedData = [
        {
          total: 2,
          index: 0,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b3',
          value: 'H4sIAAAAAAAAA0tMSk',
          compress: true
        },
        {
          total: 2,
          index: 1,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b1',
          value: '4cfAgA0WVYfJYAAAA=',
          compress: true
        }
      ]
      expect(() => extractData(splitedData)).toThrow(
        'checkSums are not equal for all QRCode'
      )
    })

    it("should throw Error when received data's checkSum is not matched to the checkSum", function () {
      const splitedData = [
        {
          total: 2,
          index: 0,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b1',
          value: 'H4sIAAAAAAAAA0tMSk',
          compress: true
        },
        {
          total: 2,
          index: 1,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b1',
          value: '4cfAgA0WVYfJYAAAA=',
          compress: true
        }
      ]
      expect(() => extractData(splitedData)).toThrow('checkSum not valid')
    })

    it('should return base64 decoded and extracted data if the input is compressed', function () {
      const splitedData = [
        {
          total: 2,
          index: 0,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b3',
          value: 'H4sIAAAAAAAAA0tMSk',
          compress: true
        },
        {
          total: 2,
          index: 1,
          checkSum: '6414b7f289ae71119714b2ab43b7e0b3',
          value: '4cfAgA0WVYfJYAAAA=',
          compress: true
        }
      ]
      const result = extractData(splitedData)
      expect(result).toEqual('abc'.repeat(50))
    })

    it('should return  extracted data if the input is not compressed', function () {
      const splitedData = [
        {
          total: 3,
          index: 0,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcab',
          compress: false
        },
        {
          total: 3,
          index: 1,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'cabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca',
          compress: false
        },
        {
          total: 3,
          index: 2,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'bcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc',
          compress: false
        }
      ]
      const result = extractData(splitedData)
      expect(result).toEqual('abc'.repeat(50))
    })

    it('should return  extracted data if the input is not compressed(field "compress" is not specified)', function () {
      const splitedData = [
        {
          total: 3,
          index: 0,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcab'
        },
        {
          total: 3,
          index: 1,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'cabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca'
        },
        {
          total: 3,
          index: 2,
          checkSum: '278d86d27fdb35a382e68a3194dffd06',
          value: 'bcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc'
        }
      ]
      const result = extractData(splitedData)
      expect(result).toEqual('abc'.repeat(50))
    })
  })
})
