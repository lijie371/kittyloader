var path = require('path'); //����path���
module.exports = function (grunt) {
    var packageInfo = grunt.file.readJSON('package.json');
    var srcRoot = "../";                                        //Դ�ĸ�·��
    var destRoot = "../dist/" 
        + packageInfo.name + "." + packageInfo.version;         //Ŀ��ĸ�·��
    var destMinRoot = destRoot + ".min";                        //min�汾�ĸ�·��
    grunt.initConfig({
        pkg: packageInfo,                                                     
        build: {
            core: { src: "../core/main.js" },
            extend: { src:"../extend/zTree/main.js" }
        },
        copy: {
            require: {
                files: [{
                        src:srcRoot+ "require.js",
                        dest:destRoot + "/" + "require.js"
                    }
                ]
            }
        },
        uglify: {
            options: {
                    preserveComments: 'some'//��ɾ��ע�ͣ�������Ϊ false��ɾ��ȫ��ע�ͣ���some������@preserve @license @cc_on��ע�ͣ�
                },
                "require": {
                files: [{
                        src:destRoot + "/" + "require.js",
                        dest:destMinRoot + "/" + "require.js"
                    }
                ]}
        }
    });

    var deleteFiles = [];

    grunt.registerTask('deleteTemp', 'delete temp files', function() {
        deleteFiles.forEach(function(file) {
            grunt.file.delete(file, {force: true});
        });
        deleteFiles = [];
    });

    grunt.registerMultiTask('build', 'Build', function () {
        if (!this.errorCount) {
            this.files.forEach(function (file) {
                file.src.filter(function(filepath) {
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.writeln('ģ�鶨���ļ� "' + filepath + '" ������.');
                        return false;
                    } else {
                        return true;
                    }
                }).forEach(function(srcFile) {
                    //ÿһ��Դ�ļ���Ӧ����һ��ģ�鶨����ļ�����main�ļ���
                    loadAndBuildModule(srcFile);
                });
            });
        }
        return !this.errorCount;
    });
    
    global.loadModule = function (o) { return o; };
    global.loadPackage = function (o) { return o; };

    function loadAndBuildModule(moduleFileName) {
        var moduleOptions = eval(grunt.file.read(moduleFileName));
        var result = [], moduleName = moduleOptions["module"];
        var destSubDir = moduleName;
        if (moduleOptions["destSubDir"]) {
            destSubDir = moduleOptions["destSubDir"];
        }
        var destFolder = path.join(destRoot, destSubDir); //Ŀ���ļ���
        loadFromPackage(result, moduleOptions);
        
        var tasks = [];
        var cssminConfig = {};
        //����css�ϲ�Ϊһ���ļ�������js�ϲ�Ϊһ���ļ����ٶ��ڲ�������define,����define�Ķ����Լ���������
        //�ⲿcss���ⲿjs��¼���·������
        var allFiles = [];
        var innerCssFiles = [];
        var innerScriptFiles = [];
        var processFunc = function (info) {
            var srcFile = path.join(srcRoot, info.from, info.folderName, info.fileName);
            var destFile1 = path.join(info.to, info.folderName, info.newFileName);
            var destFile = path.join(destFolder, destFile1);
            var hasCdn = false;
            if (info.isExtFile) {
                //������cdn�����,��cdn��ʱ�򣬲���Ҫ������ȥ
                if (packageInfo["cdn"] && packageInfo["cdn"][info.to] 
                    && packageInfo["cdn"][info.to][info.newFileName]) {
                    hasCdn = true;
                    var cdnPath = packageInfo["cdn"][info.to][info.newFileName];
                    allFiles.push({ isCdn: true, isScript: info.isScript, src: cdnPath });
                } else {
                    allFiles.push({isScript:info.isScript, src:destFile1});
                    grunt.file.copy(srcFile, destFile);
                }
            }else if (info.isScript) {
                innerScriptFiles.push(srcFile);
            } else {
                grunt.file.copy(srcFile, destFile);
                innerCssFiles.push(destFile);
            }
            grunt.log.writeln("from:" + srcFile, "\t to:" + destFile);
            //��������Դ�ļ��������塢ͼƬ�ȣ�������ȥ
            if((!hasCdn) && info.assertFolders)
                info.assertFolders.forEach(function(folder) {
                    grunt.file.recurse(path.join(srcRoot, info.from, folder), function (abspath, rootdir, subdir, filename) {
                        grunt.log.writeln("\t assert:" + abspath);
                        grunt.file.copy(abspath, path.join(destFolder, info.to, folder, subdir || "", filename));
                    });
                });
        };
            
        //�ȼ���css�ļ�
        result.filter(function(info) {
            return !info.isScript;
        }).forEach(processFunc);
        if (innerCssFiles.length > 0) {
            //��css�ļ�
            var mainCssName = moduleName+".css";
            allFiles.push({isScript:false, src:mainCssName});
            mainCssName = path.join(destFolder, mainCssName);
            cssminConfig["main"] = {
                options: {
                    keepSpecialComments: 1,
                    target: mainCssName,
                    noAdvanced: true
                },
                src: innerCssFiles,
                dest: mainCssName
            };
            innerCssFiles.forEach(function(cssFile) {
                deleteFiles.push(cssFile);
            });
            tasks.push('cssmin:main');
            tasks.push('deleteTemp');
        }

        //�ٴ���js�ļ�
        result.filter(function(info) {
            return info.isScript;
        }).forEach(processFunc);
            
        if (innerScriptFiles.length > 0) {
                //��js�ļ�
            var mainScriptName = moduleName+".js";
            allFiles.push({isScript:true, src:mainScriptName});
            mainScriptName = path.join(destFolder, mainScriptName);
            grunt.file.write(mainScriptName, innerScriptFiles.map(function(scriptFile) {
                return grunt.file.read(scriptFile);
            }).join('').replace(/\r\n/g, '\n'));
        }
        
        var allContents =[];
        if (moduleOptions["type"] == "dynamic") {
            allContents.push("define([");
            var isFirst = true;
            allFiles.forEach(function(file) {
                var temp = ",";
                if (isFirst) {
                    isFirst = false;
                    temp = "";
                }
                if (!file.isScript)
                    temp += "'css!" + path.join(destSubDir, file.src) + "'";
                else
                    temp += "'"  + path.join(destSubDir, file.src.replace(".js", "")) + "'";
                temp = temp.replace(/\\/ig, "/");
                allContents.push(temp);
            });
            allContents.push("], function(){});");
            grunt.file.write(path.join(destFolder, "main.js"), allContents.join(''));
        } else {
            //�������һ���ļ�����ϲ���һ��д��һ��demo.html
            if (allFiles.length > 1) {
                allContents.push("<html>\n<head>\n<title>demo</title>");
                allContents = allContents.concat(allFiles.map(function (file) {
                    var filePath = file.src.replace(/\\/ig, "/");
                    if (!file.isScript)
                        return "<link  rel=\"stylesheet\" type=\"text/css\"  href=\"" + filePath + "\"></link>";
                    return "<script src=\"" + filePath + "\" type=\"text/javascript\"></script>";
                }));
                allContents.push("</head><body><h1>hello,world!</h1></body>");
                grunt.file.write(path.join(destFolder, "demo.html"), allContents.join('\n'));
            }
        }
        
        //������kitty.core�а��ļ�������kitty.core.min�ļ����У���������Դ�ļ�������ȥ��css��С����js���û���ѹ����
        grunt.config("copy", {   
                "all": {
                    files: [{ expand: true, filter: "isFile", cwd: destFolder, src: ['**/*.!(js|css)'], dest: path.join(destMinRoot, destSubDir) }]
                }
            });
            
            grunt.config("uglify", {
                options: {
                    preserveComments: 'some'//��ɾ��ע�ͣ�������Ϊ false��ɾ��ȫ��ע�ͣ���some������@preserve @license @cc_on��ע�ͣ�
                },
                "all": {
                    files: [{ expand: true, filter: "isFile", cwd: destFolder, src: ['**/*.js'], dest: path.join(destMinRoot, destSubDir) }]
                    }
                });
            cssminConfig["all"] = {
                files: [{ expand: true, filter: "isFile", cwd: destFolder, src: ['**/*.css'], dest: path.join(destMinRoot, destSubDir) }]
            };
            grunt.config("cssmin", cssminConfig);
            tasks.push("copy:all");
            tasks.push("uglify:all");
            tasks.push("cssmin:all");
            grunt.task.run(tasks);
    };

    function loadFromPackage(result, options) {
        var basePath = options["basePath"] || "";
        basePath = basePath;
        doLoadFromPackage(result, basePath, options["css"], false);
        doLoadFromPackage(result, basePath, options["script"], true);
    };

    function doLoadFromPackage(result, basePath, paths, isScript) {
        if (typeof (paths) != "undefined" && paths !== null) {
            if (toString.apply(paths) !== '[object Array]')
                paths = [paths];
            for (var i = 0; i < paths.length; i++) {
                var temp = paths[i], src = temp;
                if (typeof(temp) != "string")
                    src = temp["src"];
                if (src.match(/package.js/ig) || src.match(/main.js/ig)) {
                    var options = eval(grunt.file.read(srcRoot +basePath + temp));
                    loadFromPackage(result, options);
                } else {
                    var copyInfo = { isScript: isScript, isExtFile: false };
                    copyInfo.from = path.dirname(src);
                    copyInfo.to = path.basename(src, isScript ? ".js" : ".css");
                    copyInfo.fileName = path.basename(src);
                    copyInfo.folderName = "";
                    copyInfo.newFileName = copyInfo.fileName;
                    copyInfo.assertFolders = null;
                    //�� from+folderName+fileName ������to+folderName+newFileName
                    if (typeof(temp) != "string") {
                        if (temp["isExtFile"])
                            copyInfo.isExtFile = true;
                        if (temp["to"])
                            copyInfo.to = temp["to"];
                        if(temp["newFileName"])
                            copyInfo.newFileName = temp["newFileName"];
                        if (temp["from"]) {
                            copyInfo.from = temp["from"];
                            copyInfo.folderName = path.dirname(src.replace(temp["from"], ""));
                        }
                        if (temp["assertFolders"])
                            copyInfo.assertFolders = temp["assertFolders"];
                    }
                    copyInfo.from = basePath + copyInfo.from;
                    result.push(copyInfo);
                }
            }
        }
    };

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    //grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    
    grunt.registerTask("require", ["copy:require", "uglify:require"]);
    grunt.registerTask("core", ["build:core"]);
    grunt.registerTask("extend", ["build:extend"]);
    grunt.registerTask("default", ["require", "core", "extend"]);
};