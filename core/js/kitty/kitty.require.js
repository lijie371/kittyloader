(function() {
    var setRequireConfig = function (scriptTagSrc) {
        scriptTagSrc = "/" + scriptTagSrc.toLowerCase();
        var scriptTags = document.getElementsByTagName("SCRIPT");
        for (var i = 0; i < scriptTags.length; i++) {
            var src = scriptTags[i].src;
            var index = src.toLowerCase().indexOf(scriptTagSrc);
            if ((index >= 0) && index == (src.length - scriptTagSrc.length)) {
                if (!scriptTags[i].getAttribute('data-main')) {
                    var temp = src.split('/');
                    temp.pop();
                    require.config({
                        baseUrl: temp.length ? temp.join('/') + '/' : './'  //����requirejs��baseUrlΪkittyLoader����Ŀ¼
                    }); 
                }
                return ;
            }
        }
        throw "Cannot find script tag referencing " + scriptTagSrc;
    };

    setRequireConfig("require.js");
})();