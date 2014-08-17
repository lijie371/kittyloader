require.config({
    baseUrl:'../core/js',
    paths: {
        'jquery': 'jquery/jquery-1.11.1'
        , 'json': 'json/json2'
        , 'ko': 'ko/knockout-3.1.0.debug'
        , 'cookie': 'cookie/jquery.cookie'
        , 'bootstrap':'../css/bootstrap/js/bootstrap'
    },
    shim: {
        'bootstrap': ['jquery']
    }
});
define('kitty.core', ['json', 'bootstrap', 'ko', 'cookie','text', 'domReady!'], function (doc) {
    //do nth.
});

require(['kitty.core'], function (k) {
    
});