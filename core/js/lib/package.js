loadPackage({
    basePath: "core/js/lib/"
    , script: [
        "require/css.js"
        , "require/text.js"
        , "require/domReady.js"
        , {
            src: "jquery-1.11.1.js"
            , to: "jquery"
            , newFileName:"jquery.js"
            , isExtFile:true
        }
        , {
            src: "knockout.debug.js"
            , to: "knockout"
            , newFileName: "knockout.js"
            , isExtFile: true
        }
        , {
            src: "../../css/bootstrap/js/bootstrap.js"
            , isExtFile: true
        }
        , "autosize/package.js"
        , "jRating/package.js"
    ]
    , css: [{
        src: "../../css/bootstrap/css/bootstrap.css"
        , from: "../../css/bootstrap/"
        , to: "bootstrap"
        , isExtFile: true
        , assertFolders: ["fonts/"] //需要同时被拷贝的目录
    },{
        src: "../../css/bootstrap/css/bootstrap-theme.css"
            , from: "../../css/bootstrap/"
            , to: "bootstrap"
            , isExtFile: true
      }  
    ]
});