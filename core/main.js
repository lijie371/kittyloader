loadModule({
    basePath: "core/"
    , module: "kitty.core"
    , destSubDir: "core/"    //最好重新指定下它的发布后的路径（与basePath最好是一致的）
    , script: ["js/lib/package.js", "js/kitty/package.js"]
    , css:[{
        src: "css/font-awesome/css/font-awesome.css"
        , from: "css/font-awesome/"             //来源的基路径(如不指定则取src的dirname,即../css/font-awesome/css/)
        , to: "font-awesome"                    //目标的基路径（如未指定则取src的basename, 即font-awesome同时充当cdn替换的关键字，一组文件如bootstrap应该有相同的to）
        , assertFolders: ["font/"]              //资源文件夹
        , newFileName: "font-awesome.css"       //可以不指定（则为原来的文件名即src的basename）
        //,isExtFile:true                       //是否外部文件
    }]
});