/**
 * Created by Ratul on 12/20/2015.
 */
var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var $  = require('gulp-load-plugins')({lazy:true});
var port = process.env.PORT || config.defaultPort;
gulp.task('vet',function(){
    log('Analyzing source with JSHint and JSCS');
   return gulp
       .src(config.alljs)
       .pipe($.if(args.verbose, $.print()))
       .pipe($.jscs())
       .pipe($.jshint())
       .pipe($.jshint.reporter('jshint-stylish',{verbose: true}))
       .pipe($.jshint.reporter('fail'));
});

gulp.task('styles',['clean-styles'], function(){
    log('Compiling Less to CSS');

    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 versions','> 5%']}))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles',function(){
    var files = config.temp + '**/*.css';
    return clean(files);
});

gulp.task('less-watcher',function(){
   gulp.watch([config.less],['styles']);
});

gulp.task('wiredep', function () {
    log('Wire up Bower css and Js into the HTML');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject',['wiredep','styles'], function () {
    log('Wire up App css into the HTML, and call wiredep');;
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

gulp.task('serve-dev',['inject'],function(){
   var isDev = true;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'bulid'
        },
        watch: [config.server]
    };
    return $.nodemon(nodeOptions)
        .on('restart', function(ev){
            log('*** nodemon restarted');
            log('Files changed on Restart:\n'+ ev);
            setTimeout(function(){
                browserSync.notify('Reloading now ....');
                browserSync.reload({stream: false});
            },config.browserRelaodDelay);
        })
        .on('start',function(){
            log('*** nodemon Started');
            startBrowserSync();
        })
        .on('crash',function(){
            log('*** nodemon crashed: Script crashed for some reason.');
        })
        .on('exit',function(){
            log('*** nodemon Exited cleanly.');
        });

});
/////


function startBrowserSync(){
    if(args.nosync || browserSync.active){
        return;
    }
    log('Starting browser-sync on port' + port);
    gulp.watch([config.less],['styles']);

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify:true,
        reloadDelay: 0
    };
    browserSync(options);

}
function clean(path){
    log('Cleaning: ' + $.util.colors.red(path));
    return del(path);
}
function log(msg){
    if(typeof(msg) === 'object'){
        for(var item in msg){
            if(msg.hasOwnProperty(item)){
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    }else{
        $.util.log($.util.colors.blue(msg));
    }
}
