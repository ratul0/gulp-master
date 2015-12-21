/**
 * Created by Ratul on 12/20/2015.
 */
module.exports = function(){
    var client = './src/client/';
    var clientApp = client + 'app/';
    var server = './src/server/';
    var temp = './.temp/';

    var config = {
        /*
        * File Paths
        */
        alljs : [
            './src/**/*.js',
            './*.js'
        ],
        client: client,
        css: temp + 'styles.css',
        index: client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        less: client+ 'styles/styles.less',
        server: server,
        temp: temp,
        /*
        * browser sync
        */
        browserRelaodDelay: 1000,
        /*
        * Bower and NPM locations
        */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        /*
        * Node Settings
        **/
        defaultPort: 8080,
        nodeServer: './src/server/app.js'

    };

    config.getWiredepDefaultOptions = function(){
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        }
        return options;
    };

    return config;
};
