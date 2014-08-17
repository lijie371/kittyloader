//必须指定在data-main中
(function () {
    var loader = {
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
                    baseUrl: temp.length ? temp.join('/') + '/' : './'
                });
                package = scriptTags[i].getAttribute('data-package');
                return src.substring(0, index + 1);
            }
        }
        throw "Cannot find script tag referencing " + scriptTagSrc;
    };

    var loaderPath = getPathToScriptTagSrc("kittyLoader.js");

    var loadBatch = function (urls, callback) {
        if (typeof (urls) != "undefined" && urls !== null) {
            if (toString.apply(urls) !== '[object Array]')
                urls = [urls];
            for (var i = 0; i < urls.length; i++) {
                if (typeof (urls[i]) != "string")
                    callback(urls[i]["src"]);
                else callback(urls[i]);
            }
        }
    };

    //加载path路径下的js/css文件, 该path路径相对kittyLoader本身,所以kittyLoader.js一般放在根目录下就好了
    loader.load = function (options) {
        var basePath = options["basePath"] || "";
        var path = loaderPath + basePath;
        if (options["module"]) {
            var result = [];
            loadBatch(options["script"], function (url) {
                result.push(basePath + url);
            });
            loadBatch(options["css"], function (url) {
                result.push("css!" + basePath + url);
            });
            define(result, function () {
            });
        } else {
            loadBatch(options["script"], function (url) {
                document.write("<script src='" + path + url + "' type='text/javascript'></script>");
            });
            loadBatch(options["css"], function (url) {
                document.write("<link  rel='stylesheet' type='text/css'  href='" + path + url + "'></link>");
            });
        }
    };
    window.loadCallback = loader.load;
    window.kittyLoader = loader;
    document.write("<script src='" + package + "' type='text/javascript'></script>");
})();