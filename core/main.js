loadModule({
    basePath: "core/"
    , module: "kitty.core"
    , destSubDir: "core/"    //�������ָ�������ķ������·������basePath�����һ�µģ�
    , script: ["js/lib/package.js", "js/kitty/package.js"]
    , css:[{
        src: "css/font-awesome/css/font-awesome.css"
        , from: "css/font-awesome/"             //��Դ�Ļ�·��(�粻ָ����ȡsrc��dirname,��../css/font-awesome/css/)
        , to: "font-awesome"                    //Ŀ��Ļ�·������δָ����ȡsrc��basename, ��font-awesomeͬʱ�䵱cdn�滻�Ĺؼ��֣�һ���ļ���bootstrapӦ������ͬ��to��
        , assertFolders: ["font/"]              //��Դ�ļ���
        , newFileName: "font-awesome.css"       //���Բ�ָ������Ϊԭ�����ļ�����src��basename��
        //,isExtFile:true                       //�Ƿ��ⲿ�ļ�
    }]
});