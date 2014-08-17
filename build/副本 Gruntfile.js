module.exports = function (grunt) {
    var packageInfo = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: packageInfo,
        distBase:"dist/"+packageInfo.version,
        cssmin: {
            core: {
                options: {
                    keepSpecialComments: 1,
                    target:'core/css/core.css',
                    noAdvanced: true
                },
                files: {
                    '<%=distBase%>/<%= pkg.name%>.core.css': ['core/css/bootstrap/css/bootstrap.css', 'core/css/font-awesome/css/font-awesome.css']
                }
            }
        },
        copy: {
            core: {
                files: [
                    { expand: true, cwd: 'core/css/assert/', src: ['**/*.*'], dest: '<%=distBase%>/assert/', filter: 'isFile' }
                    , { expand: true, cwd: 'core/css/bootstrap/', src: ['**/*.!(min|js|css|less|map)'], dest: '<%=distBase%>/bootstrap/', filter: 'isFile' }
                    , { expand: true, cwd: 'core/css/font-awesome/', src: ['**/*.!(min|js|css|less|map)'], dest: '<%=distBase%>/font-awesome/', filter: 'isFile' }
                ]
            }
        },
        concat: {
            options: {
                separator: ';',
                sourceMap:true
            },
            core: {
                dest: '<%=distBase%>/<%= pkg.name%>.core.js',
                src: [
                    'core/js/require.js'
                    ,'core/js/jquery/jquery-1.11.1.js'
                    , 'core/css/bootstrap/js/bootstrap.js'
                    , 'core/js/json/json2.js'
                    , 'core/js/cookie/jquery.cookie.js'
                    , 'core/js/ko/knockout-3.1.0.debug.js'] 
            }
        },
        uglify: {
            options: {
                preserveComments: 'some'//不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
            },
            core: {
                dest:'<%=distBase%>/<%= pkg.name%>.core.min.js',
                src:'<%=distBase%>/<%= pkg.name%>.core.js'
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("core", ["cssmin:core", "copy:core", "concat:core", "uglify:core"]);
    grunt.registerTask("default", ["core"]);
};