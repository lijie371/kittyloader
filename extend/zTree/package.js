loadPackage({
    basePath: "extend/zTree/"
    , type: "dynamic"                               //requirejsģ�����������ʱ����һ�������İ���������Ϊ��zTree��
    , script: ["js/jquery.ztree.all-3.5.js"]        //������Щscript�ļ���
    , css: [{                                       //������Щcss�ļ���
        src: "css/zTreeStyle/zTreeStyle.css",
        assertFolders: ["img/"]
    }]        
});
