const {  // 5 個方法 : 來源 / 目的 / 順序 / 同序 / 監看
  src,
  dest,
  series,
  parallel,
  watch
} = require('gulp');              // 套件引入 require()



function defaultTask(cb) {
  console.log('hello gulp 4');   // 顯示在終端機上
  console.log('hello CFD101');   // 顯示在終端機上
  cb();                          // cb()或者return的方式來告知gulp 此任務已經完成
}
      exports.do = defaultTask;  // 執行指令 gulp do , exports 導出

// ======================================================================================
function missA(cb){
  console.log('任務Ａ');
  cb();                         //  cb()或者return的方式來告知gulp 此任務已經完成
}

function missB(cb){
  console.log('任務B');
  cb();
}
    //順序 非同步  // 先執行missA , 再執行missB
    exports.async = series(missA , missB);  // 執行指令 gulp async

    //並行
    exports.sync = parallel(missA , missB); // // 執行指令 gulp sync

    

    // =================================================================================
    //=======   合併 CSS 檔案  //   合併 JS檔案    ===============
    //  src(來源檔案).pipe(concat()).pipe(dest(目的地))
    //  * 代表所有

var concat = require('gulp-concat');   // 套件引入 require()

function concatcss(){
    // 多文件(多路徑)     // 打包2個路徑的CSS檔,排除aboutus資料夾下的CSS檔
    return src(['css/**/*.css' , 'css/*.css' ,'!css/aboutus/*.css' ])
    .pipe(concat('style.css')) // 排除的css檔 若沒有排除 要先刪除 "style.css"
    .pipe(dest('css/allcss/'))

    // 單文件
    // return src('css/**/*.css') // css 資料夾內aboutus/index 的資料夾之下(css下2層) ,
    //                            // 所有 .css檔
    // .pipe(concat('style.css')) // 透過 concat() 合併 .css檔 , 產生一支 style.css
    // .pipe(dest('css/allcss/')) // 產生的 style.css , 放在 css/allcss/ 之下

    // return src('css/*.css')    // css 資料夾 之下 , 所有 .css檔
    // .pipe(concat('style.css')) // 透過 concat() 合併 .css檔 , 產生一支 style.css
    // .pipe(dest('css/allcss/')) // 產生的 style.css , 放在 css/allcss/ 之下
}

function concatjs(){
    return src('js/*.js')      // js 資料夾 之下 , 所有 .js檔
    .pipe(concat('script.js')) // 產生一支 script.js
    .pipe(dest('js/all/'))
}


exports.allcss = concatcss; // 執行指令 gulp allcss 
                            // a.css/b.css檔 , 若有修改後, 再執行一次 gulp allcss ,就會重新打包 style.css

exports.alljs = concatjs;   // // 執行指令 gulp alljs 



      // =====================================================================
      //======= 壓縮css  ===============
const cleanCSS = require('gulp-clean-css'); // 套件引入 require() 

function cleancss(){
  return src('css/allcss/*.css')
  .pipe(cleanCSS({compatibility: 'ie10'}))
  .pipe(dest('minicss'))    // 產生一支 css/minicss 檔 (壓縮來源檔 allcss/style.css )
}
exports.minicss = cleancss; // gulp minicss


    // ==============================================================
    //======= 壓縮js  ===============
const uglify = require('gulp-uglify');  // 套件引入 require() 

function ugjs(){
    return src('js/b.js')
    .pipe(uglify())
    .pipe(dest('minijs'))  //  // 產生一支 minijs 檔 (壓縮 b.js 檔)
}
exports.minijs = ugjs;


    // =====================================================================
    // 先合併 -> 再壓縮  (不能同步執行)    狀況一  狀況一  狀況一  狀況一  狀況一  狀況一  狀況一狀況一  狀況一
// function concat_css(){
//     return src('css/**/*.css')
//     .pipe(concat('style.css'))
//     .pipe(dest('minicss'))             //   產生 css/minicss/style.css 檔
// }
// function mini_css(){
//     return src('minicss/style.css')    //   壓縮來源檔
//     .pipe(cleanCSS({compatibility: 'ie10'}))
//     .pipe(dest('minicss/mini/'))       //   產生 css/minicss/mini/style.css 檔
// }
// exports.all = series(concat_css , mini_css);  // 順序執行


    // 先合併 -> 再壓縮  (不能同步執行)    狀況二  狀況二  狀況二  狀況二  狀況二  狀況二  狀況二  狀況二  狀況二
function concat_css(){               //  合併完直接壓縮 , 不產生合併檔 , 只產生壓縮檔
  return src('css/**/*.css')
  .pipe(concat('style.css'))
  .pipe(cleanCSS({compatibility: 'ie10'}))  //  壓縮 , 及處理跨瀏覽器問題
  .pipe(dest('minicss'))                    //  產生 css/minicss/style.css 檔
}
exports.all = series(concat_css);           //  順序執行


    // 合併 + 壓縮css + 更改檔名          狀況三  狀況三  狀況三  狀況三  狀況三  狀況三  狀況三  狀況三  狀況三
    // === rename 更改檔案名稱 ===
const rename = require('gulp-rename');       // 套件引入 require()
function concat_css(){                       //  合併完直接壓縮 , 不產生合併檔 , 只產生壓縮檔
  return src('css/**/*.css')
  .pipe(concat('style.css'))                 //  合併
  .pipe(cleanCSS({compatibility: 'ie10'}))   //  壓縮 , 及處理跨瀏覽器問題
  .pipe(rename({
         extname: '.min.css'
                      }))      //  更改副檔名 
  .pipe(dest('css/'))          //  產生 css/style.min.css 檔 
  // .pipe(dest('minicss'))    //  產生 css/minicss/style.min.css 檔 , (打包不要再放在下2層)
}
exports.all = series(concat_css);    //  順序執行


      // ====================================================================================
      // 監看任務 自動執行打包
// function watchfile(){
//     watch('css/**/*.css' ,concat_css) // 監看來源檔 , 執行的函式
//     // watch('js/**/*.js' ,任務)      // 可以同時監看 js ...
// }

// exports.w = watchfile;  // gulp w  / ctol + c  (跳出監看)


    // =============================================================================
    // sourcemaps

const sass = require('gulp-sass');            // 套件引入 require()
const sourcemaps = require('gulp-sourcemaps');// 回朔到原本開發的檔案

function sass_style() {
    return src('dev/sass/*.scss')
        .pipe(sourcemaps.init())  // 可以在控制台 看到檔案來源 ex: header{} ==> _header.scss
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // on() , 為了顯示執行的錯誤資訊
        .pipe(sourcemaps.write()) // 可以在控制台 看到檔案來源 ex: header{} ==> _header.scss
        //.pipe(cleanCSS({compatibility: 'ie10'}))  //壓縮省略,因為上方 sass({outputStyle: 'compressed'}) 已壓縮
        .pipe(dest('dist/css'));
}
exports.styles = sass_style;

// function watchsass(){  // 監看
//   watch(['dev/sass/**/*.scss','dev/sass/*.scss'] ,sass_style) // 監看來源檔 , 執行的函式
//   // watch('dev/js/**/*.js' ,任務)      // 可以同時監看 js ...
// }

// exports.styles = watchsass;  


    // ===================================================================================
    // gulp-file-include 合併 html
const fileinclude = require('gulp-file-include'); // 套件引入 require()

function html(){
    // return src(['dev/*.html','dev/**/*.html'])   // 來源路徑
    return src(['dev/*.html'])   // 打包的 *.html 來源路徑
    .pipe(fileinclude({                          // 函式
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(dest('./'))   // 打包的html,自動產生在"根目錄下"  ==> " ./ "   
}
exports.template = html;  // 自動產生一支 index.html , 在 dist/index.html

function watch_sass_html(){  // 監看
  watch(['dev/sass/**/*.scss','dev/sass/*.scss'] ,sass_style) // 監看 sass
  watch(['dev/*.html','dev/**/*.html'] ,html)         // 監看 html
  // watch('js/**/*.js' ,任務)      // 可以同時監看 js ...
  // console.log('執行成功')
}

// exports.default = watch_sass_html;  // 指令 只需要 "gulp"


    // ==================================================================
    // 瀏覽器同步檢視 (整合 watch 監看 sass/html)
const browserSync = require('browser-sync'); // 套件引入 require()
const reload = browserSync.reload;           // 瀏覽器重啟

function browser(done){
  browserSync.init({
    server: {
        baseDir : "./",       // 來源檔 index.html 的存放路徑 "根目錄下"
        index: 'index.html'   // 要開啟的預設檔案
    },
    port : 3000  
  });
  watch(['dev/sass/**/*.css' , 'dev/sass/*.scss'] , sass_style).on('change' , reload)
  watch(['dev/*.html' , 'dev/**/*.html'] , html).on('change' , reload)
  done();  // 監看 file 變動 , 會透過change事件 , 重新啟動 browser
}

// exports.default = series(cleanfile ,browser);
exports.default = browser;  // http://localhost:3001   ,    http://localhost:3000










