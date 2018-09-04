<template>
    <div class="tradingview mb-8">
      <div class="trend fs-18 color-999">
        <div class="fr" @click="switched(2)" :class="active?'active':''">深度图</div>
        <div class="fr" @click="switched(1)" :class="active?'':'active'">走势图</div>
      </div>
      <div v-show="!active" id="chart_container" class="f-fill" style="height:570px;"></div>
      <div v-show="active">
        <e-charts auto-resize :options="options"></e-charts>
      </div>
    </div>
</template>

<script>
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legendScroll";
import bigDecimal from "js-big-decimal";
export default {
  components: {
    ECharts
  },
  data() {
    return {
      active: false,
      priceArr: [],
      options: {
        tooltip: {
          confine: true,
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: { color: "rgba(0, 0, 0, 0)" }
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#333333",
            fontSize: "18px",
            align: "left"
          },
          extraCssText:
            "border:1px solid #D5DFE9;padding:20px 24px;line-height:28px;box-shadow: 0px 2px 3px rgba(0,0,0,.16);",
          formatter: function(a) {
            var relVal = "";
            relVal = "委托价&nbsp;&nbsp;&nbsp;&nbsp;" + a[0].axisValue + "<br>";
            if (a[0].value) {
              relVal +=
                "累计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                a[0].value;
            } else {
              relVal +=
                "累计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                a[1].value;
            }
            return relVal;
          }
        },
        grid: {
          x: 10,
          y: 10,
          x2: 20,
          y2: 20,
          borderWidth: 1
        },
        // 横轴坐标轴
        xAxis: [
          {
            type: "category",
            data: [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              ""
            ],
            splitLine: {
              //网格线
              show: true,
              lineStyle: {
                color: "#D5DFE9",
                type: "dotted"
              }
            },
            splitArea: { show: false },
            axisLine: { show: true },
            axisTick: { show: false },
            axisLabel: {
              show: false, //坐标值
              formatter: "{value}"
            },
            axisLine: {
              lineStyle: {
                color: "#3C8C5F", //改变坐标轴的颜色
                width: 1 //这里是为了突出显示加上的
              }
            },
            boundaryGap: false
          }
        ],
        // 纵轴坐标轴
        yAxis: [
          {
            // name:'交易量',
            nameLocation: "middle",
            type: "value",
            splitLine: {
              //网格线
              show: true,
              lineStyle: {
                color: "#D5DFE9",
                type: "dotted"
              }
            },
            splitArea: { show: false },
            axisLine: { show: true },
            axisTick: { show: false },
            axisLabel: {
              show: false, //坐标值
              formatter: "{value}"
            },
            axisLine: {
              lineStyle: {
                color: "#3C8C5F", //改变坐标轴的颜色
                width: 1 //这里是为了突出显示加上的
              }
            }
          }
        ],
        animation: true,
        // 数据内容数组
        series: [
          {
            name: "买方",
            data: ["", "", "", "", "", "", "", "", "", ""],
            type: "line",
            itemStyle: {
              normal: {
                color: "#3C8C5F",
                lineStyle: {
                  color: "#3C8C5F",
                  width: 1 //折线宽度
                }
              }
            },

            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#3C8C5F" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "white" // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            }
          },
          {
            name: "卖方",
            data: ["", "", "", "", "", "", "", "", "", ""],
            type: "line",
            itemStyle: {
              normal: {
                color: "#D84F4F",
                lineStyle: {
                  color: "#D84F4F",
                  width: 1 //折线宽度
                }
              }
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#D84F4F" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "white" // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            }
          }
        ]
      }
    };
  },
  sockets: {
    //订阅querySnapshot获取买卖十档的交易数据
    querySnapshot(data) {
      let asksList = data.result.asks || [];
      let placeHold = ["", "", "", "", "", "", "", "", "", ""];
      let asksQuantity = [];
      // 卖十档
      let asksCount = 0;
      asksList.forEach(item => {
        asksCount = bigDecimal.add(asksCount, item.quantity);
        asksQuantity.push(asksCount);
      });
      this.options.series[1].data = placeHold.concat(asksQuantity);

      // 买十档
      let newBidsList = data.result.bids || [];
      newBidsList = newBidsList.reverse();
      let bidsQuantity = [];
      let bidsCount = 0;
      newBidsList.forEach(item => {
        bidsCount = bigDecimal.add(bidsCount, item.quantity);
        bidsQuantity.push(bidsCount);
      });
      this.options.series[0].data = bidsQuantity.reverse().concat(placeHold);
      // X坐标轴
      let concatArr = newBidsList.concat(asksList);
      let priceArr = [];
      concatArr.forEach(item => {
        priceArr.push(item.price);
      });
      this.options.xAxis[0].data = priceArr;
    }
  },
  watch: {
    tradeItem(newValue) {
      this.initTradingView(newValue.contractId);
    }
  },
  mounted() {
    this.initTradingView(1);
  },
  methods: {
    initTradingView(newValue) {
      const this_vue = this;
      var localStorage = {
        resolution: "15",
        i18nLanguage: "en",
        symbol: "1"
      };
      var oColor = {
        red: "red",
        green: "green"
      };
      TradingView.onready(function(configurationData) {
        let widget = (window.tvWidget = new TradingView.widget({
          height: 616,
          fullscreen: false,
          autosize: true,
          symbol: newValue,
          container_id: "chart_container",
          datafeed: new Datafeeds.UDFCompatibleDatafeed("/"),
          library_path: "static/common/tradingView/charting_library/",
          locale: "en",
          timezone: "", //todo: ustawianie timezone'a po strefie usera
          charts_storage_api_version: "1.1",
          client_id: "tradingview.com",
          user_id: "public_user_id",
          debug: false,
          // loading_screen: {
          //   backgroundColor: "#000000",
          //   foregroundColor: "#000000"
          // }, //todo:do it
          interval: "1",
          timeframe: "", //todo: na koncu
          toolbar_bg: "#fff",
          // saved_data: this_vue.savedData,
          allow_symbol_change: true,
          time_frames: [],
          custom_css_url: "css/style.css",
          overrides: {
            "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)", //图标底部水印
            "paneProperties.background": "#fff", //图标背景 折线图背景颜色
            "paneProperties.vertGridProperties.color": "#EEF0F6", //垂直网格线
            "paneProperties.horzGridProperties.color": "#EEF0F6", //水平网格线

            "scalesProperties.textColor": "#fff", //轴文字颜色
            "scalesProperties.lineColor": "#787878", //轴边线颜色

            "mainSeriesProperties.candleStyle.upColor": oColor.red, //k线图升
            "mainSeriesProperties.candleStyle.downColor": oColor.green, //k线图降
            "mainSeriesProperties.candleStyle.borderUpColor": oColor.red, //升节点
            "mainSeriesProperties.candleStyle.borderDownColor": oColor.green, //降节点
            "mainSeriesProperties.candleStyle.wickUpColor": oColor.red,
            "mainSeriesProperties.candleStyle.wickDownColor": oColor.green,

            "paneProperties.legendProperties.showLegend": false, //是否隐藏左上角那个选项
            "paneProperties.legendProperties.showStudyArguments": true, //参数显示
            "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false //不显示下拉
          },
          disabled_features: [
            "use_localstorage_for_settings",
            "timeframes_toolbar",
            "header_saveload",
            "left_toolbar",
            //用户本地存储
            "use_localstorage_for_settings",
            //图表右键菜单
            "pane_context_menu",
            //头部搜索
            "header_symbol_search",
            //头部分辨率
            "header_resolutions",
            //头部搜索
            "header_settings",
            //头部比较
            "header_compare",
            //撤销按钮
            "header_undo_redo",
            //头部截图
            "header_screenshot",
            //柱状图选择
            "header_chart_type",
            "header_indicators", //指标
            // 'edit_buttons_in_legend',
            "symbol_info",
            "context_menus",
            //整个头部
            //'header_widget',*/
            "volume_force_overlay",
            "adaptive_logo",
            "legend_context_menu",
            "show_hide_button_in_legend" //研究跟symbol默认隐藏
          ],
          // enabled_features: ["study_templates"],
          charts_storage_url: "http://saveload.tradingview.com",
          charts_storage_api_version: "1.1",
          client_id: "tradingview.com",
          user_id: "public_user_id",
          timezone: "Asia/Shanghai",
          "has-no-volume": true,
          has_fractional_volume: true,
          volume_precision: "4",
          enabled_features: [
            "dont_show_boolean_study_arguments",
            "use_localstorage_for_settings",
            "remove_library_container_border",
            "save_chart_properties_to_local_storage",
            "side_toolbar_in_fullscreen_mode",
            "hide_last_na_study_output",
            "constraint_dialogs_movement" //todo: nie do końca jestem pewien
          ],
          studies_overrides: {
            "volume.volume.color.0": "#fe4761",
            "volume.volume.color.1": "#3fcfb4",
            "volume.volume.transparency": 75
          }
          // favorites: {
          //     intervals: ["1D", "3D", "3W", "W", "M"],
          //     chartTypes: ["Area", "Line"]
          // }
          // custom_css_url: "chart.css"
        }));
        function widgetFun(widget, resolution, name) {
          widget.onChartReady(function() {
            localStorage.resolution = localStorage.resolution
              ? localStorage.resolution
              : "15";
            if (localStorage.resolution == resolution) {
              widget
                .createButton()
                .on("click", function(e) {
                  widget.chart().setResolution(resolution);
                  localStorage.resolution = resolution;
                  $(e.currentTarget)
                    .addClass("active")
                    .parents(".space-single")
                    .siblings(".space-single")
                    .find(".active")
                    .removeClass("active");
                })
                .append("<span>" + name + "</span>")
                .addClass("active");
            } else {
              widget
                .createButton()
                .on("click", function(e) {
                  widget.chart().setResolution(resolution);
                  localStorage.resolution = resolution;
                  $(e.currentTarget)
                    .addClass("active")
                    .parents(".space-single")
                    .siblings(".space-single")
                    .find(".active")
                    .removeClass("active");
                })
                .append("<span>" + name + "</span>");
            }
          });
        }

        widgetFun(widget, "1", "1min");
        widgetFun(widget, "5", "5min");
        widgetFun(widget, "15", "15min");
        widgetFun(widget, "30", "30min");
        widgetFun(widget, "60", "1hour");
        widgetFun(widget, "240", "4hour");
        widgetFun(widget, "D", "1day");
        widgetFun(widget, "W", "1week");
        widgetFun(widget, "M", "1mon");
        // widgetFun(widget, "1", '1min');
        // widgetFun(widget, "5", '5min');
        // widgetFun(widget, "15", '15min');
        // widgetFun(widget, "60", '小时');
        // widgetFun(widget, "D", '天');
        // widgetFun(widget, "W", '周');
        // widgetFun(widget, "1M", '月');
        // widgetFun(widget, "3M", '季度');
        // widgetFun(widget, "240", 'YTD');
        // widgetFun(widget, "12M", '年');
        // widgetFun(widget, "", '所有');
        // //widgetFun(widget, "M", '1mon');

        widget.onChartReady(function() {
          widget
            .chart()
            .createStudy("Moving Average", false, false, [5], null, {
              "plot.color.0": "#965fc4",
              precision: 4
            });
          // widget.chart().createStudy('Moving Average', false, false, [10], null, { "plot.color.0": "#84aad5", precision: 4 });
          // widget.chart().createStudy('Moving Average', false, false, [30], null, { "plot.color.0": "#52ab60", precision: 4 });
          // widget.chart().createStudy('Moving Average', false, false, [60], null, { "plot.color.0": "#b7248a", precision: 4 });
        });
      });
    },
    switched(index) {
      if (index == 1) {
        this.active = false;
        console.log(index, "false");
      } else {
        this.active = true;
        console.log(index, "true");
      }
    }
  },
  props: ["tradeItem"]
};
</script>

<style lang='scss'>
.tradingview {
  height: 616px;
  background: #fff;
  .trend {
    line-height: 44px;
    overflow: hidden;
    > div:first-child {
      margin-right: 100px;
      margin-left: 58px;
    }
    .active {
      color: #388cff;
      border-bottom: 2px solid #388cff;
    }
  }
  .echarts {
    width: 100%;
    height: 570px;
  }
}
</style>
