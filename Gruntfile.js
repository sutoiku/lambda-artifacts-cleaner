/**
 * Created by yancorneille on 15/06/2016.
 */
var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');

grunt.initConfig(
  {
    lambda_invoke : {
      default: {
        options: {
          file_name: 'index.js'
        }
      }
    },
    lambda_deploy : {
      default: {
        options : {
          region                   : 'us-west-1',
          enableVersioning         : true,
          enablePackageVersionAlias: true,
          aliases                  : 'dev'
        },
        function: 'index',
        arn     : 'arn:aws:lambda:us-west-1:309034846714:function:s3-artifacts-cleaner'

      }
    },
    lambda_package: {
      default: {},
      options: {package_folder: './es5/'},

    },
    clean         : {
      all: ['dist', 'es5']
    },
    babel         : {
      options: {
        "plugins": ["transform-object-rest-spread"],
        sourceMap: true,
        presets  : ['env']
      },
      dist   : {
        files: {
          'es5/index.js'  : './index.js',
          'es5/s3.js'     : './s3.js',
          'es5/filter.js' : './filter.js',
          'es5/utils.js'  : './utils.js',
          'es5/cleaner.js': './cleaner.js'
        }
      }
    },
    copy          : {
      dist: {
        expand: true,
        src   : 'package.json',
        dest  : 'es5/',
      }
    }
  });
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-babel');


grunt.registerTask('pack', ['copy', 'babel', 'lambda_package']);
grunt.registerTask('publish', ['clean:all', 'pack']);
grunt.registerTask('deploy', ['clean:all', 'publish', 'lambda_deploy']);
