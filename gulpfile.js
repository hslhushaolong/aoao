const fs =  require('fs');
const [gulp, concat, replace, clean, rename, package, config] = [
  require('gulp'),
  require('gulp-concat'),
  require('gulp-replace'),
  require('gulp-clean'),
  require('gulp-rename'),
  require('./package.json'),
  require('./config'),
];

function randomString(len) {
  const timestamp = new Date().getTime();
  const lens = len || 32;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  var pwd = '';
  　for (i = 0; i < lens; i++) {
    　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  　}
  　return `${pwd}${timestamp}`;
}

const dist = './dist/';

gulp.task('static', () => {
  // 静态文件
  gulp.src('./src/static/*.ico').pipe(gulp.dest('./dist/static'));
  gulp.src('./src/static/*.xlsx').pipe(gulp.dest('./dist/static'));
});

// 修改文件版本号
gulp.task('changeVersion', () => {

  const path = './dist/';
  // 读取静态文件目录
  fs.readdir(path, function(err, files) {
    if(err){
      console.log("error: \n"+err);
      return;
    }

    // console.log(files);
    let jsHash = '';
    let cssHash = '';
    files.forEach((file)=>{
      const regex = /(index)\.(\w*)\.(\w*)/.exec(file);
      if (regex == null || regex.length != 4) {
        return;
      }
      const hash = regex[2];
      const type = regex[3];
      if (type === 'js') {
        jsHash = hash;
      }
      if (type === 'css') {
        cssHash = hash;
      }
    })

    if (jsHash != '' && cssHash != '') {
      console.log(`.js?version`, `.${jsHash}.js?v=${package.version}`);
      console.log(`.css?version`, `.${cssHash}.css?v=${package.version}`);
      gulp.src([`${dist}index.html`])
      .pipe(replace(`.js?version`, `.${jsHash}.js?v=${package.version}`))
      .pipe(replace(`.css?version`, `.${cssHash}.css?v=${package.version}`))
      .pipe(gulp.dest('./dist/'));
    }

  });
});

gulp.task('cleanScripts', () => {
  //清除chunk文件
  gulp.src([`${dist}index.css`, `${dist}index.js`], { read: false })
    .pipe(clean());
});
