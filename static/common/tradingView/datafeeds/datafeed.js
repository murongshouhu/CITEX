/*
	This class implements interaction with UDF-compatible datafeed.

	See UDF protocol reference at
	https://github.com/tradingview/charting_library/wiki/UDF
*/


function parseJSONorNot(mayBeJSON) {
    if (typeof mayBeJSON === 'string') {
        return JSON.parse(mayBeJSON);
    } else {
        return mayBeJSON;
    }
}

var Datafeeds = {};

Datafeeds.UDFCompatibleDatafeed = function(datafeedURL, updateFrequency) {
    this._datafeedURL = datafeedURL;
    this._configuration = undefined;

    this._symbolSearch = null;
    this._symbolsStorage = null;
    this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this, updateFrequency || 10 * 1000);
    //this._quotesPulseUpdater = new Datafeeds.QuotesPulseUpdater(this);

    this._enableLogging = false;
    this._initializationFinished = false;
    this._callbacks = {};

    this._initialize();
};

Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function() {
    return {
        supports_search: false,
        supports_group_request: true,
        supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
        supports_marks: false,
        supports_timescale_marks: false
    };
};

Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function(callback) {
    //console.log(1);
    /*if (this._configuration.supports_time) {
    	this._send(this._datafeedURL + '/time', {})
    		.done(function(response) {
    			callback(+response);
    		})
    		.fail(function() {
    		});
    }*/
};

Datafeeds.UDFCompatibleDatafeed.prototype.on = function(event, callback) {
    if (!this._callbacks.hasOwnProperty(event)) {
        this._callbacks[event] = [];
    }

    this._callbacks[event].push(callback);
    return this;
};

Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function(event, argument) {
    if (this._callbacks.hasOwnProperty(event)) {
        var callbacksChain = this._callbacks[event];
        for (var i = 0; i < callbacksChain.length; ++i) {
            callbacksChain[i](argument);
        }

        this._callbacks[event] = [];
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function() {
    this._initializationFinished = true;
    this._fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function(message) {
    if (this._enableLogging) {
        var now = new Date();
        //console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype._send = function(url, params) {
    var request = url;
    if (params) {
        for (var i = 0; i < Object.keys(params).length; ++i) {
            var key = Object.keys(params)[i];
            var value = encodeURIComponent(params[key]);
            request += (i === 0 ? '?' : '&') + key + '=' + value;
        }
    }

    this._logMessage('New request: ' + request);

    return $.ajax({
        type: 'GET',
        url: request,
        contentType: 'text/plain'
    });
};

Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function() {
    var that = this;

    that._setupWithConfiguration({
        "supports_search": true,
        "supports_group_request": false,
        "supports_marks": false,
        "supports_timescale_marks": false,
        "supports_time": true,
        "exchanges": [

        ],
        "symbols_types": [

        ],
        "supported_resolutions": ["1", "5", "15", "30", "60", "D", "2D", "3D", "W", "3W", "M", "6M"],
        "has_intraday": false,
        "intraday_multipliers": ["1", "5", "15", "30", "60"]
    });

};

Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function(callback) {
    var that = this;
    //console.log("onReady")
    if (this._configuration) {
        setTimeout(function() {
            callback(that._configuration);
        }, 0);
    } else {
        this.on('configuration_ready', function() {
            callback(that._configuration);
        });
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype._setupWithConfiguration = function(configurationData) {
    this._configuration = configurationData;

    if (!configurationData.exchanges) {
        configurationData.exchanges = [];
    }

    //	@obsolete; remove in 1.5
    var supportedResolutions = configurationData.supported_resolutions || configurationData.supportedResolutions;
    configurationData.supported_resolutions = supportedResolutions;

    //	@obsolete; remove in 1.5
    var symbolsTypes = configurationData.symbols_types || configurationData.symbolsTypes;
    configurationData.symbols_types = symbolsTypes;

    if (!configurationData.supports_search && !configurationData.supports_group_request) {
        throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
    }

    if (!configurationData.supports_search) {
        this._symbolSearch = new Datafeeds.SymbolSearchComponent(this);
    }

    if (configurationData.supports_group_request) {
        //	this component will call onInitialized() by itself
        this._symbolsStorage = new Datafeeds.SymbolsStorage(this);
    } else {
        this.onInitialized();
    }

    this._fireEvent('configuration_ready');
    this._logMessage('Initialized with ' + JSON.stringify(configurationData));
};

//	===============================================================================================================================
//	The functions set below is the implementation of JavaScript API.

Datafeeds.UDFCompatibleDatafeed.prototype.getMarks = function(symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
    onDataCallback([]);
};

Datafeeds.UDFCompatibleDatafeed.prototype.getTimescaleMarks = function(symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {

    onDataCallback([]);
};

Datafeeds.UDFCompatibleDatafeed.prototype.searchSymbols = function(searchString, exchange, type, onResultReadyCallback) {
    var MAX_SEARCH_RESULTS = 30;

    if (!this._configuration) {
        onResultReadyCallback([]);
        return;
    }

    if (this._configuration.supports_search) {
        this._send('/', {
                limit: MAX_SEARCH_RESULTS,
                query: searchString.toUpperCase(),
                type: type,
                exchange: exchange
            })
            .done(function(response) {
                if(response.code == 1000){
                    var data = parseJSONorNot(response.data.data);
                    var newData = [];
                    for (var i = 0; i < data.length; ++i) {
                        // if (!data[i].params) {
                        //     data[i].params = [];
                        // }

                        // data[i].exchange = data[i].exchange || '';
                        var obj = {
                            country:'CH',
                            description:data[i].full_name_zh,
                            exchange:'bitcoin',
                            symbol:'<em>'+ data[i].id+'</em>',
                            type:'index'
                        }
                        newData.push(obj);
                    }

                    if (typeof data.s == 'undefined' || data.s !== 'error') {
                        onResultReadyCallback(newData);
                    } else {
                        onResultReadyCallback([]);
                    }
                }
            })
            .fail(function(reason) {
                onResultReadyCallback([]);
            });
    } else {
        if (!this._symbolSearch) {
            throw new Error('Datafeed error: inconsistent configuration (symbol search)');
        }

        var searchArgument = {
            searchString: searchString,
            exchange: exchange,
            type: type,
            onResultReadyCallback: onResultReadyCallback
        };

        if (this._initializationFinished) {
            this._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
        } else {
            var that = this;

            this.on('initialized', function() {
                that._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
            });
        }
    }
};

Datafeeds.UDFCompatibleDatafeed.prototype._symbolResolveURL = '/symbols';

//	BEWARE: this function does not consider symbol's exchange
Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    //console.log("resolveSymbol",symbolName);
    var that = this;

    if (!this._initializationFinished) {
        this.on('initialized', function() {
            that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
        });

        return;
    }

    var resolveRequestStartTime = Date.now();
    that._logMessage('Resolve requested');
    //console.log('Resolve requested',symbolName,resolveRequestStartTime);
    function onResultReady(data) {
        var postProcessedData = data;

        if (that.postProcessSymbolInfo) {
            postProcessedData = that.postProcessSymbolInfo(postProcessedData);
        }

        that._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime));

        onSymbolResolvedCallback(postProcessedData);
    }
    //console.log(this._configuration,this._configuration.supports_group_request,"onResultReady");

    var symbolDescription = symbolName.split("_")[0];
    if (symbolDescription) {
        symbolDescription = symbolDescription.toUpperCase();
    }
    var symbolData = {
        "name": symbolName,
        "exchange-traded": "",
        "exchange-listed": "",
        //"timezone":"America/New_York",
        "minmov": 1,
        "minmov2": 0,
        "pointvalue": 1,
        "session": "24x7",
        "has_intraday": true,
        "has_no_volume": false,
        "description": symbolDescription,
        "type": "",
        "supported_resolutions": ["1", "5", "15", "30", "60", "240", "D", "2D", "3D", "W", "3W", "M", "6M"],
        "pricescale": 100,
        "ticker": symbolName
    }
    onResultReady(symbolData);
};

Datafeeds.UDFCompatibleDatafeed.prototype._historyURL = '/history';


function resolutionTypeFun(resolution) {
    var resolutionType = 1;
    if (resolution == "1") {
        resolutionType = 1;
    } else if (resolution == "5") {
        resolutionType = 5;
    } else if (resolution == "15") {
        resolutionType = 15;
    } else if (resolution == "30") {
        resolutionType = 30;
    } else if (resolution == "60") {
        resolutionType = 60;
    } else if (resolution == "240") {
        resolutionType = 240;
    } else if (resolution == "1D") {
        resolutionType = 1440;
    } else if (resolution == "1W") {
        resolutionType = 10080;
    } else if (resolution == "1M") {
        resolutionType = 1440 * 30;
    }
    console.log(resolutionType);
    return resolutionType;
}

Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback, firstDataRequest) {
    //	timestamp sample: 1399939200
    //console.log(11)
    if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
        throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
    }
    var resolutionType = resolutionTypeFun(resolution)

    var ajaxParam = {
        symbolInfo:symbolInfo,
        resolution:resolution,
        rangeStartDate:rangeStartDate,
        rangeEndDate:rangeEndDate
    }
    function groupingFun(grouping){
        console.log('grouping',grouping);
        switch(grouping){
          case '1':
            return 60*1000;
            break;
          case '5':
            return 5*60*1000;
            break;
          case '15':
            return 15*60*1000;
            break;
          case '30':
            return 30*60*1000;
            break;
          case '60':
            return 60*60*1000;
            break;
          case '240':
            return 4*60*60*1000;
            break;
          case 'D':
            return 24*60*60*1000;
            break;
          case 'W':
            return 7*24*60*60*1000;
            break;
          case 'M':
            return 30*24*60*60*1000;
            break;

            default :
                return grouping + "min";
                break;
        }
    }
    function ajaxFirst(param) {
        // return
        //console.log(param.rangeStartDate-param.rangeEndDate)
        console.log(2,groupingFun(param.resolution))
      var data = {
            symbol:param.symbolInfo.name,
            range:groupingFun(param.resolution),
            prevTradeTime:param.rangeStartDate,
            since:param.rangeEndDate
        };
      console.log(data);
        $.ajax({
            // url: "lib/tradingView/json/queryCandlestick.json",
            url:"/quot/queryCandlestick",
            data:data,
            dataType:'json',
            success: function(data) {
                // console.log(rangeStartDate, rangeEndDate)
                //console.log(data,"k线数据--first"+resolutionType,rangeStartDate,rangeEndDate)
                if (data.success) {
                    var bars = [];
                    if (data.data.lines.length == 0) {
                        onDataCallback([], { noData: true });
                    }
                    for (var i = 0; i < data.data.lines.length; i++) {
                        // console.log(data, 79999999)
                        var item = data.data.lines[i];
                        bars.push({
                            time: item[0], //毫秒为单位
                            open: item[1],
                            high: item[2],
                            low: item[3],
                            close: item[4],
                            volume: item[5],
                            isBarClosed: true,
                            isLastBar: false,
                        });
                    }
                    // console.log(bars, 8888)
                    onDataCallback(bars, { noData: false, nextTime: undefined }); //没有数据时请返回noData = true
                } else {
                    onDataCallback([], { noData: true });
                }
            },
            error: function(arg) {
                console.warn(['getBars(): HTTP error', arg]);
                console.log(param)
                if (!!onErrorCallback) {
                    onErrorCallback('network error: ' + JSON.stringify(arg));
                }
            }
        });
    }

    if (firstDataRequest) {
        //console.log(interval_id,"-++++++++++++++++++++++++++++++++++++")

        var resolutionType = resolutionTypeFun(resolution);

        ajaxFirst(ajaxParam);

    } else {
        //console.log(rangeStartDate, rangeEndDate,123456789);
        // var minTotal = resolutionTypeFun(resolution);
        //console.log(rangeEndDate,rangeStartDate,rangeEndDate-rangeStartDate,minTotal*60,4444444)
        // if (rangeEndDate - rangeStartDate == minTotal * 60 * 10) {
        //     onDataCallback([], { noData: true });
        // } else {
            ajaxFirst(ajaxParam);
        // }
    }
};

var interval_id = null;
Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {

    clearInterval(interval_id);
    var resolutionType = resolutionTypeFun(resolution);

    function ajaxLoadingFun() {
        return
        $.ajax({
            url: "./json/queryCandlestick.json",
            data: { symbol: symbolInfo.name, range: resolutionType * 60000 },
            // data: { symbol: symbolInfo.name, type: resolutionType },
            dataType:'json',
            success: function(data) {
                //console.log(data,"k线数据loading")
                if (data.success) {
                    var bars = [];
                    if (data.data.lines.length == 0) {
                        return;
                    }
                    for (var i = 0; i < data.data.lines.length; i++) {
                        // console.log(data, 799)
                        var item = data.data.lines[i];
                        bars.push({
                            time: item[0], //毫秒为单位
                            open: item[1],
                            high: item[2],
                            low: item[3],
                            close: item[4],
                            volume: item[5],
                            /*isBarClosed:true,
                            isLastBar:false,*/
                        });
                    }
                    // console.log(bars, 77777777)
                    onRealtimeCallback(bars[0]); //没有数据时请返回noData = true
                } else {
                    //onRealtimeCallback([], {noData: true});
                }
            },
            error: function(arg) {
                console.warn(['getBars(): HTTP error', arg]);

                /*if (!!onErrorCallback) {
                	onErrorCallback('network error: ' + JSON.stringify(arg));
                }*/
            }
        });
    }

    interval_id = setInterval(function() {
        ajaxLoadingFun();
    }, 10 * 1000);

    //console.log(symbolInfo, resolution,123987);

    this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
};

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function(listenerGUID) {
    this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};

Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function(period, resolutionBack, intervalBack) {
    //console.log(period, resolutionBack, intervalBack,"请求商品的分辨率")
};

Datafeeds.UDFCompatibleDatafeed.prototype.getQuotes = function(symbols, onDataCallback, onErrorCallback) {
    this._send(this._datafeedURL + '/quotes', { symbols: symbols })
        .done(function(response) {
            var data = parseJSONorNot(response);
            if (data.s === 'ok') {
                //	JSON format is {s: "status", [{s: "symbol_status", n: "symbol_name", v: {"field1": "value1", "field2": "value2", ..., "fieldN": "valueN"}}]}
                if (onDataCallback) {
                    onDataCallback(data.d);
                }
            } else {
                if (onErrorCallback) {
                    onErrorCallback(data.errmsg);
                }
            }
        })
        .fail(function(arg) {
            if (onErrorCallback) {
                onErrorCallback('network error: ' + arg);
            }
        });
};

Datafeeds.UDFCompatibleDatafeed.prototype.subscribeQuotes = function(symbols, fastSymbols, onRealtimeCallback, listenerGUID) {
    this._quotesPulseUpdater.subscribeDataListener(symbols, fastSymbols, onRealtimeCallback, listenerGUID);
};

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeQuotes = function(listenerGUID) {
    this._quotesPulseUpdater.unsubscribeDataListener(listenerGUID);
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	It's a symbol storage component for ExternalDatafeed. This component can
	  * interact to UDF-compatible datafeed which supports whole group info requesting
	  * do symbol resolving -- return symbol info by its name
*/
Datafeeds.SymbolsStorage = function(datafeed) {
    this._datafeed = datafeed;

    this._exchangesList = ['NYSE', 'FOREX', 'AMEX'];
    this._exchangesWaitingForData = {};
    this._exchangesDataCache = {};

    this._symbolsInfo = {};
    this._symbolsList = [];

    this._requestFullSymbolsList();
};

Datafeeds.SymbolsStorage.prototype._requestFullSymbolsList = function() {
    var that = this;

    for (var i = 0; i < this._exchangesList.length; ++i) {
        var exchange = this._exchangesList[i];

        if (this._exchangesDataCache.hasOwnProperty(exchange)) {
            continue;
        }

        this._exchangesDataCache[exchange] = true;

        this._exchangesWaitingForData[exchange] = 'waiting_for_data';

        this._datafeed._send(this._datafeed._datafeedURL + '/symbol_info', {
                group: exchange
            })
            .done((function(exchange) {
                return function(response) {
                    that._onExchangeDataReceived(exchange, parseJSONorNot(response));
                    that._onAnyExchangeResponseReceived(exchange);
                };
            })(exchange))
            .fail((function(exchange) {
                return function(reason) {
                    that._onAnyExchangeResponseReceived(exchange);
                };
            })(exchange));
    }
};

Datafeeds.SymbolsStorage.prototype._onExchangeDataReceived = function(exchangeName, data) {
    function tableField(data, name, index) {
        return data[name] instanceof Array ?
            data[name][index] :
            data[name];
    }

    try {
        for (var symbolIndex = 0; symbolIndex < data.symbol.length; ++symbolIndex) {
            var symbolName = data.symbol[symbolIndex];
            var listedExchange = tableField(data, 'exchange-listed', symbolIndex);
            var tradedExchange = tableField(data, 'exchange-traded', symbolIndex);
            var fullName = tradedExchange + ':' + symbolName;

            //	This feature support is not implemented yet
            //	var hasDWM = tableField(data, "has-dwm", symbolIndex);

            var hasIntraday = tableField(data, 'has-intraday', symbolIndex);

            var tickerPresent = typeof data.ticker != 'undefined';
            //console.log(hasIntraday,"hasIntraday");
            var symbolInfo = {
                name: symbolName,
                base_name: [listedExchange + ':' + symbolName],
                description: tableField(data, 'description', symbolIndex),
                full_name: fullName,
                legs: [fullName],
                has_intraday: hasIntraday,
                has_no_volume: tableField(data, 'has-no-volume', symbolIndex),
                listed_exchange: listedExchange,
                exchange: tradedExchange,
                minmov: tableField(data, 'minmovement', symbolIndex) || tableField(data, 'minmov', symbolIndex),
                minmove2: tableField(data, 'minmove2', symbolIndex) || tableField(data, 'minmov2', symbolIndex),
                fractional: tableField(data, 'fractional', symbolIndex),
                pointvalue: tableField(data, 'pointvalue', symbolIndex),
                pricescale: tableField(data, 'pricescale', symbolIndex),
                type: tableField(data, 'type', symbolIndex),
                session: tableField(data, 'session-regular', symbolIndex),
                ticker: tickerPresent ? tableField(data, 'ticker', symbolIndex) : symbolName,
                timezone: tableField(data, 'timezone', symbolIndex),
                supported_resolutions: tableField(data, 'supported-resolutions', symbolIndex) || this._datafeed.defaultConfiguration().supported_resolutions,
                force_session_rebuild: tableField(data, 'force-session-rebuild', symbolIndex) || false,
                has_daily: tableField(data, 'has-daily', symbolIndex) || true,
                intraday_multipliers: tableField(data, 'intraday-multipliers', symbolIndex) || ['1', '5', '15', '30', '60'],
                has_fractional_volume: tableField(data, 'has-fractional-volume', symbolIndex) || false,
                has_weekly_and_monthly: tableField(data, 'has-weekly-and-monthly', symbolIndex) || false,
                has_empty_bars: tableField(data, 'has-empty-bars', symbolIndex) || false,
                volume_precision: tableField(data, 'volume-precision', symbolIndex) || 0
            };

            this._symbolsInfo[symbolInfo.ticker] = this._symbolsInfo[symbolName] = this._symbolsInfo[fullName] = symbolInfo;
            this._symbolsList.push(symbolName);
        }
    } catch (error) {
        throw new Error('API error when processing exchange `' + exchangeName + '` symbol #' + symbolIndex + ': ' + error);
    }
};

Datafeeds.SymbolsStorage.prototype._onAnyExchangeResponseReceived = function(exchangeName) {
    delete this._exchangesWaitingForData[exchangeName];

    var allDataReady = Object.keys(this._exchangesWaitingForData).length === 0;

    if (allDataReady) {
        this._symbolsList.sort();
        this._datafeed._logMessage('All exchanges data ready');
        this._datafeed.onInitialized();
    }
};

//	BEWARE: this function does not consider symbol's exchange
Datafeeds.SymbolsStorage.prototype.resolveSymbol = function(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    var that = this;

    setTimeout(function() {
        if (!that._symbolsInfo.hasOwnProperty(symbolName)) {
            onResolveErrorCallback('invalid symbol');
        } else {
            onSymbolResolvedCallback(that._symbolsInfo[symbolName]);
        }
    }, 0);
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	It's a symbol search component for ExternalDatafeed. This component can do symbol search only.
	This component strongly depends on SymbolsDataStorage and cannot work without it. Maybe, it would be
	better to merge it to SymbolsDataStorage.
*/

Datafeeds.SymbolSearchComponent = function(datafeed) {
    this._datafeed = datafeed;
};

//	searchArgument = { searchString, onResultReadyCallback}
Datafeeds.SymbolSearchComponent.prototype.searchSymbols = function(searchArgument, maxSearchResults) {
    if (!this._datafeed._symbolsStorage) {
        throw new Error('Cannot use local symbol search when no groups information is available');
    }

    var symbolsStorage = this._datafeed._symbolsStorage;

    var results = []; // array of WeightedItem { item, weight }
    var queryIsEmpty = !searchArgument.searchString || searchArgument.searchString.length === 0;
    var searchStringUpperCase = searchArgument.searchString.toUpperCase();

    for (var i = 0; i < symbolsStorage._symbolsList.length; ++i) {
        var symbolName = symbolsStorage._symbolsList[i];
        var item = symbolsStorage._symbolsInfo[symbolName];

        if (searchArgument.type && searchArgument.type.length > 0 && item.type !== searchArgument.type) {
            continue;
        }

        if (searchArgument.exchange && searchArgument.exchange.length > 0 && item.exchange !== searchArgument.exchange) {
            continue;
        }

        var positionInName = item.name.toUpperCase().indexOf(searchStringUpperCase);
        var positionInDescription = item.description.toUpperCase().indexOf(searchStringUpperCase);

        if (queryIsEmpty || positionInName >= 0 || positionInDescription >= 0) {
            var found = false;
            for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
                if (results[resultIndex].item === item) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                var weight = positionInName >= 0 ? positionInName : 8000 + positionInDescription;
                results.push({ item: item, weight: weight });
            }
        }
    }

    searchArgument.onResultReadyCallback(
        results
        .sort(function(weightedItem1, weightedItem2) {
            return weightedItem1.weight - weightedItem2.weight;
        })
        .map(function(weightedItem) {
            var item = weightedItem.item;
            return {
                symbol: item.name,
                full_name: item.full_name,
                description: item.description,
                exchange: item.exchange,
                params: [],
                type: item.type,
                ticker: item.name
            };
        })
        .slice(0, Math.min(results.length, maxSearchResults))
    );
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	This is a pulse updating components for ExternalDatafeed. They emulates realtime updates with periodic requests.
*/

Datafeeds.DataPulseUpdater = function(datafeed, updateFrequency) {
    this._datafeed = datafeed;
    this._subscribers = {};

    this._requestsPending = 0;
    var that = this;

    var update = function() {
        if (that._requestsPending > 0) {
            return;
        }

        for (var listenerGUID in that._subscribers) {
            var subscriptionRecord = that._subscribers[listenerGUID];
            var resolution = subscriptionRecord.resolution;

            var datesRangeRight = parseInt((new Date().valueOf()) / 1000);

            //	BEWARE: please note we really need 2 bars, not the only last one
            //	see the explanation below. `10` is the `large enough` value to work around holidays
            var datesRangeLeft = datesRangeRight - that.periodLengthSeconds(resolution, 115);

            that._requestsPending++;

            (function(_subscriptionRecord) { // eslint-disable-line
                that._datafeed.getBars(_subscriptionRecord.symbolInfo, resolution, datesRangeLeft, datesRangeRight, function(bars) {
                        that._requestsPending--;

                        //	means the subscription was cancelled while waiting for data
                        if (!that._subscribers.hasOwnProperty(listenerGUID)) {
                            return;
                        }

                        if (bars.length === 0) {
                            return;
                        }

                        var lastBar = bars[bars.length - 1];
                        if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
                            return;
                        }

                        var subscribers = _subscriptionRecord.listeners;

                        //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
                        //	_subscriptionRecord.lastBarTime = NaN
                        var isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime;

                        //	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
                        //	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
                        if (isNewBar) {
                            if (bars.length < 2) {
                                throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
                            }

                            var previousBar = bars[bars.length - 2];
                            for (var i = 0; i < subscribers.length; ++i) {
                                subscribers[i](previousBar);
                            }
                        }

                        _subscriptionRecord.lastBarTime = lastBar.time;

                        for (var i = 0; i < subscribers.length; ++i) {
                            subscribers[i](lastBar);
                        }
                    },

                    //	on error
                    function() {
                        that._requestsPending--;
                    });
            })(subscriptionRecord);
        }
    };

    if (typeof updateFrequency != 'undefined' && updateFrequency > 0) {
        setInterval(update, updateFrequency);
    }
};

Datafeeds.DataPulseUpdater.prototype.unsubscribeDataListener = function(listenerGUID) {
    this._datafeed._logMessage('Unsubscribing ' + listenerGUID);
    delete this._subscribers[listenerGUID];
};

Datafeeds.DataPulseUpdater.prototype.subscribeDataListener = function(symbolInfo, resolution, newDataCallback, listenerGUID) {
    this._datafeed._logMessage('Subscribing ' + listenerGUID);

    if (!this._subscribers.hasOwnProperty(listenerGUID)) {
        this._subscribers[listenerGUID] = {
            symbolInfo: symbolInfo,
            resolution: resolution,
            lastBarTime: NaN,
            listeners: []
        };
    }

    this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.DataPulseUpdater.prototype.periodLengthSeconds = function(resolution, requiredPeriodsCount) {
    var daysCount = 0;

    if (resolution === '1D') {
        daysCount = requiredPeriodsCount;
    } else if (resolution === '1M') {
        daysCount = 31 * requiredPeriodsCount;
    } else if (resolution === '1W') {
        daysCount = 7 * requiredPeriodsCount;
    } else {
        daysCount = requiredPeriodsCount * resolution / (24 * 60);
    }

    return daysCount * 24 * 60 * 60;
};

Datafeeds.QuotesPulseUpdater = function(datafeed) {
    this._datafeed = datafeed;
    this._subscribers = {};
    this._updateInterval = 60 * 1000;
    this._fastUpdateInterval = 10 * 1000;
    this._requestsPending = 0;

    var that = this;

    setInterval(function() {
        that._updateQuotes(function(subscriptionRecord) { return subscriptionRecord.symbols; });
    }, this._updateInterval);

    setInterval(function() {
        that._updateQuotes(function(subscriptionRecord) { return subscriptionRecord.fastSymbols.length > 0 ? subscriptionRecord.fastSymbols : subscriptionRecord.symbols; });
    }, this._fastUpdateInterval);
};

Datafeeds.QuotesPulseUpdater.prototype.subscribeDataListener = function(symbols, fastSymbols, newDataCallback, listenerGUID) {
    if (!this._subscribers.hasOwnProperty(listenerGUID)) {
        this._subscribers[listenerGUID] = {
            symbols: symbols,
            fastSymbols: fastSymbols,
            listeners: []
        };
    }

    this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.QuotesPulseUpdater.prototype.unsubscribeDataListener = function(listenerGUID) {
    delete this._subscribers[listenerGUID];
};

Datafeeds.QuotesPulseUpdater.prototype._updateQuotes = function(symbolsGetter) {
    if (this._requestsPending > 0) {
        return;
    }

    var that = this;
    for (var listenerGUID in this._subscribers) {
        this._requestsPending++;

        var subscriptionRecord = this._subscribers[listenerGUID];
        this._datafeed.getQuotes(symbolsGetter(subscriptionRecord),

            // onDataCallback
            (function(subscribers, guid) { // eslint-disable-line
                return function(data) {
                    that._requestsPending--;

                    // means the subscription was cancelled while waiting for data
                    if (!that._subscribers.hasOwnProperty(guid)) {
                        return;
                    }

                    for (var i = 0; i < subscribers.length; ++i) {
                        subscribers[i](data);
                    }
                };
            }(subscriptionRecord.listeners, listenerGUID)),
            // onErrorCallback
            function(error) {
                that._requestsPending--;
            });
    }
};

if (typeof module !== 'undefined' && module && module.exports) {
    module.exports = {
        UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed,
    };
}