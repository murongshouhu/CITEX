import './style.scss';
import apiBuysellList from './api-buysell-list';
import apiEntrustList from './api-entrust-list';
import apiTradeList from './api-trade-list';
import apiNewprice from './api-newprice';

//接口
$.commonApi({
    components: {
        'k-entrust-list': apiEntrustList,
        'k-buysell-list': apiBuysellList,
        'k-trade-list': apiTradeList,
        'k-newprice': apiNewprice
    }
});

if (!Api.color_set) {
    var oColor = {
        green: '#63c997',
        red: "#d15359"
    }
} else {
    var oColor = {
        green: '#d15359',
        red: "#63c997"
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var oParam = {
    symbol: $.getLocationSearch("symbol"),

}
var symbol = $.getLocationSearch('symbol');
if (symbol == null) {
    symbol = "1";
}
//console.log(TradingView,Datafeeds);
TradingView.onready(function() {
    var widget = window.tvWidget = new TradingView.widget({
        // debug: true, // uncomment this line to see Library errors and warnings in the console
        fullscreen: true,
        symbol: symbol,
        interval: localStorage.resolution || '15',
        container_id: "tv_container",
        //  BEWARE: no trailing slash is expected in feed URL
        datafeed: new Datafeeds.UDFCompatibleDatafeed("/"), //new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
        library_path: "charting_library/",
        locale: (localStorage.i18nLanguage == 'zh-CN' ? 'zh' : localStorage.i18nLanguage) || "zh",
        //  Regression Trend-related functionality is not implemented yet, so it's hidden for a while
        drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: [ /*"study_templates"*/ ],
        //charts_storage_url: 'http://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        /*定义颜色*/
        toolbar_bg: '#101824', //工具栏背景颜色
        custom_css_url: './css/style.css',
        overrides: {
            "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)", //图标底部水印
            "paneProperties.background": "#101824", //图标背景
            "paneProperties.vertGridProperties.color": "rgba(255,255,255,0.05)", //垂直网格线
            "paneProperties.horzGridProperties.color": "rgba(255,255,255,0.05)", //水平网格线

            "scalesProperties.textColor": "#fff", //轴文字颜色
            "scalesProperties.lineColor": "#787878", //轴边线颜色

            "mainSeriesProperties.candleStyle.upColor": oColor.red, //k线图升
            "mainSeriesProperties.candleStyle.downColor": oColor.green, //k线图降
            "mainSeriesProperties.candleStyle.borderUpColor": oColor.red, //升节点
            "mainSeriesProperties.candleStyle.borderDownColor": oColor.green, //降节点
            "mainSeriesProperties.candleStyle.wickUpColor": oColor.red,
            "mainSeriesProperties.candleStyle.wickDownColor": oColor.green,

            'paneProperties.legendProperties.showLegend': false, //是否隐藏左上角那个选项
            "paneProperties.legendProperties.showStudyArguments": true, //参数显示
            "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false, //不显示下拉
        },
        studies_overrides: { //体量颜色
            "volume.volume.color.0": oColor.green, //降
            "volume.volume.color.1": oColor.red, //升
            //"volume.volume.transparency": 70,//透明度
            /*"bollinger bands.median.color": "#33FF88",
            "bollinger bands.upper.linewidth": 7*/
        },
        disabled_features: [
            'timeframes_toolbar',
            'header_saveload',
            //用户本地存储
            "use_localstorage_for_settings",
            //图表右键菜单
            "pane_context_menu",
            //头部搜索
            'header_symbol_search',
            //头部分辨率
            'header_resolutions',
            //头部搜索
            //'header_settings',
            //头部比较
            'header_compare',
            //撤销按钮
            'header_undo_redo',
            //头部截图
            'header_screenshot',
            //'header_indicators',//指标
            //'edit_buttons_in_legend',
            'symbol_info',
            'context_menus',
            //整个头部
            //'header_widget',*/
            'volume_force_overlay',

            "legend_context_menu", "show_hide_button_in_legend" //研究跟symbol默认隐藏
        ], //禁用指定按钮
        time_frames: [
            { text: "15", resolution: "1", description: "1分", title: "1分" },
            { text: "30", resolution: "5", description: "5分", title: "5分" },
            { text: "60", resolution: "15", description: "15分", title: "15分" },
            { text: "1d", resolution: "D", description: "1天", title: "1天" },
            { text: "7d", resolution: "D", description: "1周", title: "1周" },
            { text: "1m", resolution: "D", description: "1个月", title: "1个月" },
            { text: "3m", resolution: "D", description: "3个月", title: "3个月" },
            { text: "6m", resolution: "D", description: "6个月", title: "6个月" },
            { text: "1y", resolution: "D", description: "1年", title: "1年" },
            { text: "1000y", resolution: "W", description: "All", title: "全部" },
        ],
        timezone: "Asia/Shanghai",
        'has-no-volume': true,
        has_fractional_volume: true,
        volume_precision: '4'
    });

    function widgetFun(widget, resolution, name) {
        widget.onChartReady(function() {
            localStorage.resolution = localStorage.resolution ? localStorage.resolution : '15'
            if (localStorage.resolution == resolution) {
                widget.createButton().on('click', function(e) {
                    widget.chart().setResolution(resolution);
                    localStorage.resolution = resolution;
                    $(e.currentTarget).addClass("active").parents('.space-single').siblings('.space-single').find('.active').removeClass("active");
                }).append('<span>' + name + '</span>').addClass("active");
            } else {
                widget.createButton().on('click', function(e) {
                    widget.chart().setResolution(resolution);
                    localStorage.resolution = resolution;
                    $(e.currentTarget).addClass("active").parents('.space-single').siblings('.space-single').find('.active').removeClass("active");
                }).append('<span>' + name + '</span>');
            }
        });
    }

    widgetFun(widget, "1", '1min');
    widgetFun(widget, "5", '5min');
    widgetFun(widget, "15", '15min');
    widgetFun(widget, "30", '30min');
    widgetFun(widget, "60", '1hour');
    widgetFun(widget, "240", '4hour');
    widgetFun(widget, "D", '1day');
    widgetFun(widget, "W", '1week');
    widgetFun(widget, "M", '1mon');

    widget.onChartReady(function() {
        widget.chart().createStudy('Moving Average', false, false, [5], null, { "plot.color.0": "#965fc4", precision: 4 });
        widget.chart().createStudy('Moving Average', false, false, [10], null, { "plot.color.0": "#84aad5", precision: 4 });
        widget.chart().createStudy('Moving Average', false, false, [30], null, { "plot.color.0": "#52ab60", precision: 4 });
        widget.chart().createStudy('Moving Average', false, false, [60], null, { "plot.color.0": "#b7248a", precision: 4 });
    });

});

(function() {
    function resize() {
        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
            // 激活的标签页
            // console.log($(e.target).text())
            if ($(e.target).text() == "历史委托") {
                $('#plczFlagBtn').hide()
            } else {
                $('#plczFlagBtn').show()
            }
        })
        var win_w = $(window).width();
        var win_h = $(window).height() < 750 ? 750 : $(window).height();
        var header_h = 80; //头高度 
        var bottom_h = 255; //底部高度

        var newprice_h = 40; //70;//最新价格高度
        var newheader_h = 35; //最新价格头高
        var k_list_w1 = 332; //
        var k_list_w2 = 322; //
        var k_list_w = k_list_w1 + k_list_w2; //右侧买卖留空宽

        var trade_h = 35; //交易列表头高

        var k_tool_w = 0; //右侧导航宽

        var able_h = win_h - bottom_h - header_h - 15; //k线可用高度 

        var sellBuy_h = (able_h - newprice_h - newheader_h - 18) / 2; //交易列表买卖高度整体

        var tlmid = 64 //交易挂单中间高度

        $('.Js-k-line,.Js-k-list').css({ height: able_h + "px" });
        $('.Js-k-ntable').css({ height: bottom_h + "px" });
        // $('.kTrade-list-sell').css({ height: (win_h - 72 - tlmid - header_h - 10) / 2 + "px" });
        // $('.kTrade-list-buy').css({ height: (win_h - 72 - tlmid - header_h - 10) / 2 + "px" });
        // $('.ktrade-list-part').css({ 'padding-top': $('.kTrade-list-buy').height() - $('.ktrade-list-part').height() })
        $('.trade-history').css({ height: win_h - header_h - 20 - $('.kBuysell-list').height() + 'px', 'max-height': win_h + 'px' })
            // $('.kTrade-bottom-main').css({ height: $('.Js-k-table').height() + 'px' })
        $('.Js-k-table .ivu-table-body').css({ height: $('.Js-k-table').height() - 70 + 'px' })
        $('.Js-k-table .ivu-table-tip').css({ height: $('.Js-k-table').height() - 70 + 'px' })
            // $('.Js-k-left').css({ width: calc('100%' - '647px') });
            // if (win_h >= 520 && win_w > 990) {
            //     $('.kTrade-tools').show();
            //     $('.Js-k-line,.Js-k-list').css({ height: able_h + "px" });
            //     $('.Js-k-buysell-list').css({ height: sellBuy_h + "px" });
            //     $('.Js-k-trade-list').css({ height: (able_h - trade_h) + "px" });

        //     $('.Js-k-line').css({ paddingRight: k_list_w + 'px' });
        //     $('.Js-k-list').css({ width: k_list_w + 'px', padding: "0px " + k_tool_w + "px 0 8px", position: 'absolute', marginTop: "0px" });

        //     $('.Js-k-bottom').css({ paddingRight: '0px' });
        //     $('.Js-k-table').css({ paddingRight: k_list_w + 'px' });
        //     $('.Js-k-sellbuy-do').css({ position: 'absolute', width: "610px" });
        //     $('.kTrade-bottom-buy,.kTrade-bottom-sell').css({ float: 'left', width: "265px", margin: "0 18px", padding: "0px" });
        // } else {
        //     var screen_h = win_h - header_h;
        //     $('.kTrade-tools').hide();
        //     $('.Js-k-line,.Js-k-list').css({ height: screen_h + "px" });
        //     $('.Js-k-buysell-list').css({ height: (screen_h - newprice_h - newheader_h - 18) / 2 + "px" });
        //     $('.Js-k-trade-list').css({ height: (screen_h - trade_h) + "px" });


        //     $('.Js-k-line').css({ paddingRight: '0px' });
        //     $('.Js-k-list').css({ width: '100%', padding: "0px", position: 'static', marginTop: "8px" });

        //     $('.Js-k-bottom').css({ paddingRight: '0px' });
        //     $('.Js-k-table').css({ paddingRight: '0px' });
        //     $('.Js-k-sellbuy-do').css({ position: 'static', width: '100%' });
        //     $('.kTrade-bottom-buy,.kTrade-bottom-sell').css({ float: 'none', width: "100%", margin: "0", padding: "0px 18px" });
        // }

        //买卖列表设置
        var sellBuy_li_h = 35; //买卖单行高度
        var sell_nodes = $('.kTrade-list-sell.Js-k-buysell-list').children("ul");
        var buy_nodes = $('.kTrade-list-buy.Js-k-buysell-list').children("ul");
        if (sell_nodes.length >= 2) {
            sell_nodes.eq(-1).width(sell_nodes.eq(0).width());
        }
        if (buy_nodes.length >= 2) {
            buy_nodes.eq(0).width(buy_nodes.eq(-1).width());
        }
        if (sell_nodes.length < 2) {
            return;
        }
        setTimeout(() => {
            //console.log(num,_this.sell_list.length)
            var sell_has_h = sell_nodes.length * sellBuy_li_h;
            var residue_h = sellBuy_h - sell_has_h; //剩余的高
            if (residue_h > 0) {
                sell_nodes.eq(0).css('margin-top', residue_h + "px");
            }
            $('.kTrade-list-sell.Js-k-buysell-list').scrollTop(1000);
        }, 400);
    };
    resize();
    $(window).resize(resize);
})();