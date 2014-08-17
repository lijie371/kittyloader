//必须指定在data-main中
(function () {
    var loader = {
        loadedCallbacks: [],
        isLoaded: false
    };
    var package;
    var getPathToScriptTagSrc = function (scriptTagSrc) {
        scriptTagSrc = "/" + scriptTagSrc.toLowerCase();
        var scriptTags = document.getElementsByTagName("SCRIPT");
        for (var i = 0; i < scriptTags.length; i++) {
            var src = scriptTags[i].src;
            var index = src.toLowerCase().indexOf(scriptTagSrc);
            if ((index >= 0) && index == (src.length - scriptTagSrc.length)) {
                var temp = src.split('/');
                temp.pop();
                require.config({
                    baseUrl: temp.length ? temp.join('/') + '/' : './'  //设置requirejs的baseUrl为kittyLoader所在目录
                });
                package = scriptTags[i].getAttribute('data-main');
                return src.substring(0, index + 1);
            }
        }
        throw "Cannot find script tag referencing " + scriptTagSrc;
    };

    var loaderPath = getPathToScriptTagSrc("kittyLoader.js");

    var getXhr = function () {
        try {
            if (window.ActiveXObject !== undefined) {
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            } else {
                return new window.XMLHttpRequest();
            }
        } catch (e) { }
    };

    var loadScript = function (src, onload) {
        var xhrObj = getXhr();
        xhrObj.onreadystatechange =
            function () {
                if (xhrObj.readyState != 4) return;
                onload(xhrObj.responseText);
            };
        xhrObj.open('GET', src, true);
        xhrObj.send('');
    };

    var doLoadPackage = function (queuedFiles, basePath, paths, isScript, callback) {
        if (typeof (paths) != "undefined" && paths !== null) {
            if (toString.apply(paths) !== '[object Array]')
                paths = [paths];
            queuedFiles += paths.length;
            for (var i = 0; i < paths.length; i++) {
                {
                    var temp = paths[i];
                    if (typeof (temp) != "string")
                        temp = temp["src"];
                    if (temp.match(/package.js/g)) {
                        loadScript(loaderPath + basePath + temp, function (resp) {
                            var options = eval(resp);
                            loader.loadPackage(queuedFiles,options.basePath|| "", options["css"], options["script"], callback);
                            queuedFiles--;
                            if (queuedFiles <= 0) {
                                var callbacks = loader.loadedCallbacks;
                                loader.loadedCallbacks = [];
                                loader.isLoaded = true;
                                for (var j in callbacks) {
                                    if (callbacks[j])
                                        callbacks[j]();
                                }
                            }
                        });
                    } else if (temp.match(/main.js/g)) {
                        document.write("<script src='" + loaderPath + basePath + temp + "' type='text/javascript'></script>");
                        queuedFiles--;
                    } else {
                        callback(isScript, basePath + temp);
                        queuedFiles--;
                    }
                }
            }
        }
    };

    //包的加载，返回{script:[],css:[]}
    loader.loadPackage = function (queuedFiles, basePath, csses, scripts, callback) {
        doLoadPackage(queuedFiles, basePath, csses, false, callback);
        doLoadPackage(queuedFiles, basePath, scripts, true, callback);
        if (queuedFiles <= 0) {
            var callbacks = loader.loadedCallbacks;
            loader.loadedCallbacks = [];
            loader.isLoaded = true;
            for (var j in callbacks) {
                if (callbacks[j])
                    callbacks[j]();
            }
        }
    };

    //模块的加载（分成动态和静态的加载），先把模块包含的所有文件（不关心是否为外部文件）找到
    //静态加载时，将找到的所有文件通过document.write方式写入进来即可。
    //动态加载时，将找到的所有文件都定义为该模块的依赖项(可以是css/js)。
    //{moduleName:"", basePath:"", type:"static|dynamic", script:[], css:[]}
    loader.loadModule = function (options) {
        var deps = [];
        if (options["type"] == "dynamic") {
            loader.loadedCallbacks.push(function() {
                define(deps, function () {
                });
            });
        }
        var callback = function (isScript, result) {
            if (options["type"] == "dynamic") {
                if (isScript) {
                    deps.push(result);
                }
                else {
                    deps.push("css!" + result);
                }
            } else {
                if (isScript) {
                    document.write("<script src='" + loaderPath + result + "' type='text/javascript'></script>");
                } else {
                    document.write("<link  rel='stylesheet' type='text/css'  href='" + loaderPath + result + "'></link>");
                }
            }
        };
        loader.loadPackage(0, options["basePath"] || "", options["css"], options["script"], callback);
    };
    window.loadModule = loader.loadModule;
    window.loadPackage = function (options) { return options; };
    document.write("<script src='" + package + "' type='text/javascript'></script>");

    //核心加载完毕
    define("kittyLoaded", function () {
        function kittyLoaded(callback) {
            if (loader.isLoaded) {
                callback();
            } else {
                loader.loadedCallbacks.push(callback);
            }
            return kittyLoaded;
        }

        kittyLoaded.load = function (name, req, onLoad, config) {
            if (config.isBuild) {
                onLoad(null);
            } else {
                kittyLoaded(onLoad);
            }
        };

        return kittyLoaded;
    });
})();