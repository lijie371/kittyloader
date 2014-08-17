loadModule({
    basePath: "extend/zTree/"
    , type: "dynamic"
    , module: "kitty.zTree"         //requirejs模块名（打包的时候打成一个独立的包，包名称为：zTree）
    , destSubDir:"extend/zTree/"      //对动态模块来讲，最好重新指定下它的发布后的路径（与basePath最好是一致的）
    , script: ["package.js"]        //包含哪些script文件？
});

//define(["extend/zTree/js/jquery.ztree.all-3.5", "css!extend/zTree/css/zTreeStyle/zTreeStyle.css"], function () {

//});
