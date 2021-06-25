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

// =================================
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


    // ==========================================


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