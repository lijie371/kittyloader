loadCallback({
    basePath: "extend/lhgcalendar/"
    , module: "lhgcalendar"                            //requirejs模块名（打包的时候打成一个独立的包，包名称为：zTree）
    , script: ["lhgcalendar.min"]        //包含哪些script文件？
    , css: ["skins/lhgcalendar.css"]     //包含哪些css文件？
});

//define(["extend/zTree/js/jquery.ztree.all-3.5", "css!extend/zTree/css/zTreeStyle/zTreeStyle.css"], function () {

//});
