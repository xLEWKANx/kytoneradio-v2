import gulp from 'gulp'
import nodemon from 'gulp-nodemon'
import eslint from 'gulp-eslint'
import rename from 'gulp-rename'
import loopbackAngular from 'gulp-loopback-sdk-angular'
import runSequence from 'run-sequence'

import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import minifycss from 'gulp-minify-css'
import notify from 'gulp-notify'
import concat from 'gulp-concat'
import ngAnnotate from 'gulp-ng-annotate'
import uglify from 'gulp-uglify'

const debugEnabled = process.env.DEBUG_API
const apiUrl = process.env.API_URL || 'http://0.0.0.0:3027/api'
const babelNode = './node_modules/.bin/babel-node'
const exec = debugEnabled ? `${babelNode} --debug` : `${babelNode}`
console.log('debugEnabled', debugEnabled)
// ESLint configuration
gulp.task('lint', () => gulp
  .src([
    'src/client/**/*.js',
    'common/**/*.js',
    'server/**/*.js',
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
)

// This task wraps around the three tasks below
gulp.task('loopback', (cb) => runSequence(
  'loopback:before',
  'loopback:codegen',
  'loopback:after',
  cb)
)

// Set the ENV env var to 'codegen' to skip some boot scripts.
gulp.task('loopback:before', () => {
  global.originalEnv = process.env.ENV
  process.env.ENV = 'codegen'
})

// Restore the original value of the ENV env var store by the loopback:before script
gulp.task('loopback:after', () => {
  process.env.ENV = global.originalEnv
})

// The actual generation of the LoopBack Angular SDK
gulp.task('loopback:codegen', () => gulp
  .src('./server/server.js')
  .pipe(loopbackAngular({ apiUrl }))
  .pipe(rename('lb-services.js'))
  .pipe(gulp.dest('./src/client/app_lib'))
  .pipe(gulp.dest('./src/dashboard/lib'))
)

// Serve the LoopBack server with nodemon
gulp.task('serve', () => nodemon({
  exec,
  script: 'server/server.js',
  watch: ['server/', 'common/'],
  ext: 'js json',
  tasks: ['lint'],
}))

// The default taks
gulp.task('default', [
  'lint',
  'loopback',
  'serve'
])

// client side TODO webpack

let _paths = {
  app: 'src/client/app',
  app_lib: 'src/client/app_lib',
  img: 'src/client/img'
}

gulp.task('styles', () => gulp
  .src('src/client/styles/*.less')
  .pipe(less()).on('error', notify.onError('Error: <%= error.message %>'))
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(minifycss({ keepSpecialComments: '0' }))
  .pipe(gulp.dest(
    'dist/client/styles'
  ))
  .pipe(notify('Styles task complete'))
)

gulp.task('app', () => gulp
  .src([
    _paths.app + '/**/module.js',
    _paths.app + '/**/*.js',
    _paths.app_lib
  ])
  .pipe(concat('main.js')).on('error', notify.onError('Error: <%= error.message %>'))
  // Annotate before uglify so the code get's min'd properly.
  .pipe(ngAnnotate({
    // true helps add where @ngInject is not used. It infers.
    // Doesn't work with resolve, so we must be explicit there
    add: true
  }))
  // .pipe(uglify()).on('error', notify.onError('Error: <%= error.message %>'))
  .pipe(gulp.dest(
    'dist/client/app'
  ))
)

gulp.task('app:lib', () => gulp
  .src([
    _paths.app_lib + '/**/jquery*.js',
    _paths.app_lib + '/**/angular.js',
    _paths.app_lib + '/**/angular*.js',
    _paths.app_lib + '/**/*.js'
  ])
  .pipe(concat('lib.js'))
  // .pipe(uglify())
  .pipe(gulp.dest(
    'dist/client/app'
  ))
)

gulp.task('img', () => gulp
  .src(_paths.img + '/**/*')
  .pipe(gulp.dest(
    'dist/client/img'
  ))
)

gulp.task('watch:client', () => {

  // server.run(['www']);
  /*require('./www');*/
  // server.listen(serverport, function() {
  //   console.log('server started, port',serverport);
  //   lrserver.listen(livereloadport);
  // })

  gulp.watch(_paths.styles + '/**/*', ['styles']);
  gulp.watch(_paths.app + '/**/*.js', ['app']);

  gulp.watch(_paths.app_lib + '/**/*.js', ['app:lib']);
  //
  // gulp.watch([_paths.views + '/**/*.jade'],['views']);
  //
  gulp.watch(_paths.img + '/**/*', ['img']);

});

gulp.task('client', ['styles', 'app', 'app:lib', 'img'])
