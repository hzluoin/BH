<template>
  <div class="candlestick">
    <div class="menu">
      <ul>
        <li>分时</li>
        <li>日线</li>
        <li>周线</li>
        <li>
          <el-select v-model="mainValue" placeholder="主指标">
            <el-option
              v-for="item in main"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div id="kline"></div>
  </div>
</template>

<script>
import pako from 'pako'
export default {
  data () {
    return {
      // 图表对象
      chart: null,
      // WebSocket对象
      ws: null,
      // 数据源地址
      address: 'wss://api.huobi.br.com/ws',
      // 数据
      rawData: null,
      req: '15min',
      // K线请求地址列表
      kLineReqList: {
        '1min': 'market.btcusdt.kline.1min',
        '5min': 'market.btcusdt.kline.5min',
        '15min': 'market.btcusdt.kline.15min',
        '30min': 'market.btcusdt.kline.30min',
        '60min': 'market.btcusdt.kline.60min',
        '4hour': 'market.btcusdt.kline.4hour',
        '1day': 'market.btcusdt.kline.1day',
        '1week': 'market.btcusdt.kline.1week'
      },
      mainValue: '',
      main: [
        {label: 'MA', value: 'MA'},
        {label: 'EMA', value: 'EMA'},
        {label: 'BOLL', value: 'BOLL'},
        {label: 'SAR', value: 'SAR'},
        {label: '关闭', value: 'CLOSE'}
      ],
      options: []
    }
  },
  computed: {
    // X轴时间线数据
    timeAxis () {
      if (/15min/.test(this.req)) {
        const distance = 900000
        let now = new Date()
        now = now - now % distance
        let timeAxisArray = []
        for (let i = 0; i < 300; i++) {
          timeAxisArray.unshift(new Date(now -= distance))
        }
        return timeAxisArray
      } else {
        return new Array(300)
      }
    }
  },
  methods: {
    // 创建数据源的WebSocket连接
    createWebSocket (address) {
      this.ws = new WebSocket(address)
      this.ws.onopen = () => {
        this.subOrReq('req', this.kLineReqList[this.req])
        this.subOrReq('sub', this.kLineReqList[this.req])
      }
      this.ws.onerror = () => {
        this.createWebSocket(address)
      }
      this.ws.onmessage = messageEvent => {
        const buffer = messageEvent.data
        const reader = new FileReader()
        reader.onloadend = () => {
          const compressed = new Uint8Array(reader.result)
          const result = pako.inflate(compressed)
          const blob = new Blob([result])
          const fr = new FileReader()
          fr.onloadend = () => {
            this.refactor(fr.result)
          }
          fr.readAsText(blob)
        }
        reader.readAsArrayBuffer(buffer)
      }
    },
    // 订阅/请求数据
    subOrReq (type, url) {
      // {
      //   "req": "market.btcusdt.kline.1min",
      //   "id": "id10"
      // }
      this.ws.send('{"' + type + '": "' + url + '","id": "id10"}')
    },
    // 处理WebSocket接收的数据
    refactor (str) {
      if (/^{.*}$/.test(str)) {
        const response = JSON.parse(str)
        if (response['ping']) {
          // @_@处理心跳数据
          const ping = response['ping']
          this.ws.send('{"pong": ' + ping + '}')
        } else if (response['rep']) {
          // @_@处理K线请求数据
          const data = response.data
          this.rawData = data
          const candlestickData = []
          const barData = []
          const barColor = []
          for (let i in data) {
            candlestickData.unshift([data[i]['open'], data[i]['close'], data[i]['low'], data[i]['high']])
            barData.unshift(data[i]['vol'])
            barColor.unshift(Number(data[i]['open']) <= Number(data[i]['close']))
          }
          this.chart.setOption({
            xAxis: [
              {
                data: this.timeAxis
              },
              {
                data: this.timeAxis
              }
            ],
            series: [
              {
                name: '日K',
                data: candlestickData
              },
              {
                name: '交易量',
                data: barData,
                itemStyle: {
                  normal: {
                    color (params) {
                      return barColor[params.dataIndex] ? '#643a3a' : '#67af64'
                    },
                    borderColor (params) {
                      return barColor[params.dataIndex] ? '#bb5f58' : '#67af64'
                    }
                  }
                }
              }
            ]
          })
        } else if (response['ch']) {
          // @_@处理K线订阅数据
          // console.log(response)
        }
      }
    },
    calculateMA (dayCount, data) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-')
          continue
        }
        var sum = 0
        for (var j = 0; j < dayCount; j++) {
          sum += data[i - j][1]
        }
        result.push(sum / dayCount)
      }
      return result
    }
  },
  mounted () {
    // const rawData = require('../../assets/data/kLineData')['rawData']
    // let dates = rawData.map(function (item) {
    //   return item[0]
    // })
    // let data = rawData.map(function (item) {
    //   return [+item[1], +item[2], +item[5], +item[6]]
    // })
    let option = {
      backgroundColor: '#1a1f28',
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        showContent: false,
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#9A9A9A',
            width: 1,
            opacity: 1
          },
          crossStyle: {
            type: 'solid'
          }
        }
      },
      axisPointer: {
        link: {xAxisIndex: 'all'}
      },
      grid: [
        {
          left: '0%',
          right: '8%',
          height: '50%'
        },
        {
          left: '0%',
          right: '8%',
          top: '63%',
          height: '16%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: [],
          show: false,
          boundaryGap: false,
          axisPointer: {
            z: 100
          }
        },
        {
          gridIndex: 1,
          type: 'category',
          data: [],
          axisLine: {onZero: false},
          axisTick: {show: false},
          splitLine: {show: false},
          axisLabel: {
            color: '#8b8c8d',
            formatter: function (value) {
              return new Date(value).format('hh:mm')
            }

          },
          boundaryGap: ['30%', '20%']
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          position: 'right',
          axisLine: {show: false},
          axisLabel: {color: '#8b8c8d'},
          splitLine: { show: false }
        },
        {
          gridIndex: 1,
          type: 'value',
          scale: true,
          position: 'right',
          axisLine: {show: false},
          axisLabel: {color: '#8b8c8d'},
          splitLine: { show: false }
        }
      ],
      dataZoom: [{
        type: 'inside'
      }],
      animation: false,
      series: [
        {
          name: '日K',
          type: 'candlestick',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: [],
          itemStyle: {
            normal: {
              color: '#ed8772',
              borderColor: '#ed8772',
              color0: '#1a1f28',
              borderColor0: '#67af64'
            }
          }
        },
        // {
        //   name: 'MA5',
        //   type: 'line',
        //   yAxisIndex: 0,
        //   // data: this.calculateMA(5, data),
        //   data: [],
        //   smooth: true,
        //   showSymbol: false,
        //   lineStyle: {
        //     normal: {
        //       width: 1
        //     }
        //   }
        // },
        // {
        //   name: 'MA10',
        //   type: 'line',
        //   yAxisIndex: 0,
        //   // data: this.calculateMA(10, data),
        //   data: [],
        //   smooth: true,
        //   showSymbol: false,
        //   lineStyle: {
        //     normal: {
        //       width: 1
        //     }
        //   }
        // },
        // {
        //   name: 'MA20',
        //   type: 'line',
        //   yAxisIndex: 0,
        //   // data: this.calculateMA(20, data),
        //   data: [],
        //   smooth: true,
        //   showSymbol: false,
        //   lineStyle: {
        //     normal: {
        //       width: 1
        //     }
        //   }
        // },
        // {
        //   name: 'MA30',
        //   type: 'line',
        //   yAxisIndex: 0,
        //   // data: this.calculateMA(30, data),
        //   data: [],
        //   smooth: true,
        //   showSymbol: false,
        //   lineStyle: {
        //     normal: {
        //       width: 1
        //     }
        //   }
        // },
        {
          name: '交易量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: []
        }
      ]
    }

    const echarts = require('echarts')
    this.chart = echarts.init(document.getElementById('kline'))
    this.chart.setOption(option)
  },
  created () {
    this.createWebSocket(this.address)
  }
}
</script>
<style>
  div[id='chatBtn'] {
    display: none !important;
  }

  .candlestick {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  #kline {
    width: 100%;
    height: 100%;
    position: relative;
    margin-top: -40px;
    z-index: 0;
  }

  .menu {
    background-color: #14171f;
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: white;
    z-index: 1;
  }

  .menu ul {
    list-style: none;
  }
  .menu li {
    display: inline-block;
  }
</style>
