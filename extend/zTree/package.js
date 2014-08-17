loadPackage({
    basePath: "extend/zTree/"
    , type: "dynamic"                               //requirejs模块名（打包的时候打成一个独立的包，包名称为：zTree）
    , script: ["js/jquery.ztree.all-3.5.js"]        //包含哪些script文件？
    , css: [{                                       //包含哪些css文件？
        src: "css/zTreeStyle/zTreeStyle.css",
        assertFolders: ["img/"]
    }]        
});
