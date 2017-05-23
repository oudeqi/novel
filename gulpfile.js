var gulp = require("gulp");
var spritesmith = require("gulp.spritesmith");
var merge = require("merge-stream");
var changed = require("gulp-changed");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var inject = require("gulp-inject");
var angularFilesort = require("gulp-angular-filesort");
var htmlmin = require("gulp-htmlmin");
var ngTemplate = require("gulp-ng-template");
var browserSync = require("browser-sync").create();
var watch = require("gulp-watch");
var runSequence = require("run-sequence");

var useref = require("gulp-useref");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify");
var minifyCss = require("gulp-clean-css");
var htmlmin = require("gulp-htmlmin");
var rev = require("gulp-rev");
var revReplace = require("gulp-rev-replace");
var clean = require("gulp-clean");
var imagemin = require("gulp-imagemin");


var htmlMinOptions = {
   removeComments: true,//清除HTML注释
   collapseWhitespace: true,//压缩HTML
   collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
   removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
   removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
   removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
   minifyJS: true,//压缩页面JS
   minifyCSS: true//压缩页面CSS
};

/*打包流程*/
gulp.task("clean", function() {
    return gulp.src("./dist/*", {read: false})
        .pipe(clean());
});
gulp.task("useref", function() {
    return gulp.src("./src/index.html")
        .pipe(useref())
        .pipe(gulpif("*.js", uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            // preserveComments: 'all' //保留所有注释
        })))
        .pipe(gulpif("*.css", minifyCss()))
        .pipe(gulp.dest("./dist"));
});
gulp.task("htmlmin", function() {
    return gulp.src("./dist/*.html")
        .pipe(htmlmin(htmlMinOptions))
        .pipe(gulp.dest("./dist"));
});
gulp.task("imagemin", function() {
    return gulp.src("./src/assets/image/*.*")
        // .pipe(imagemin())
        .pipe(gulp.dest("./dist/assets/image"));
});
gulp.task("rev", function() {
    return gulp.src(["./dist/assets/style/*.css", "./dist/assets/script/*.js", "./dist/assets/image/*.*"], {base: "./dist"})
    .pipe(rev())
    .pipe(gulp.dest("./dist"))
    .pipe(rev.manifest({
        merge: true
    }))
    .pipe(gulp.dest("./dist"));
});
gulp.task("replacerev", function(){
  var manifest = gulp.src("./dist/rev-manifest.json");
  return gulp.src(["./dist/*.html", "./dist/assets/style/*.css", "./dist/assets/script/*.js"], {base: './dist'})
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest("./dist"));
});

gulp.task("server:build",function(cb){
    browserSync.init({
         server: "./dist"
    });
});

gulp.task("build", ["clean"], function() {
    runSequence(
        "useref",
        "htmlmin",
        "imagemin",
        "rev",
        "replacerev",
        "server:build");
});
/////////////////////////////////////////////////////$RECYCLE.BIN\
gulp.task("sprite", function() {
    var spriteData = gulp.src("./src/assets/sprite/*.png")
    .pipe(spritesmith({
        imgName: "sprite.png",
        imgPath: "../../assets/image/sprite.png",
        cssName: "_sprite.scss",
        cssFormat: "scss",
        cssTemplate: "scss.template.mustache",
        cssOpts: "spriteSrc",//定义变量名
        padding: 20,
        cssVarMap: function(sprite) {
            sprite.name = "icon-" + sprite.name;
        }
    }));
    var imgStream = spriteData.img
        .pipe(gulp.dest("src/assets/image"));
    var cssStream = spriteData.css
        .pipe(gulp.dest("./src/assets/scss"));
    return merge(imgStream, cssStream);
});

gulp.task("scss", function() {
    return gulp.src("./src/component/**/*.scss")
        .pipe(changed("./src/component", {extension: ".css"}))
        .pipe(sass({outputStyle: "expanded"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["Android >= 4.0", "last 3 Safari versions", "iOS 7", "ie >= 9"],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest("./src/component"));
});

gulp.task("scss:all", function() {
    return gulp.src("./src/component/**/*.scss")
        .pipe(sass({outputStyle: "expanded"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["Android >= 4.0", "last 3 Safari versions", "iOS 7", "ie >= 9"],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest("./src/component"));
});

gulp.task("inject", function() {
    return gulp.src("./src/index.html")
        .pipe(inject(gulp.src("./src/component/**/*.css", {read: false}), {relative: true}))
        .pipe(inject(
            gulp.src("./src/component/**/*.js", {read: true}).pipe(angularFilesort()), {relative: true}
        ))
        .pipe(gulp.dest("./src"));
});

gulp.task("tpl", function() {
  return gulp.src("./src/component/**/*.html")
    .pipe(htmlmin(htmlMinOptions))
    .pipe(ngTemplate({
      moduleName: "app.template",
      standalone: true,
      prefix: "./component/",
      filePath: "app-template.js"
    }))
    .pipe(gulp.dest("./src/component/app"));
});

gulp.task("server:dev",function(cb){
    browserSync.init({
         server: "./src",
        // proxy: "http://192.168.0.200:80/src/", //代理
        files: ["./src/component/**/*.css"]
    });
});

function staticWatch(){
    watch("./src/assets/image/*.*")
        .on("add", function(){console.log("图片增加");browserSync.reload();})
        .on("unlink", function(){console.log("图片删除");browserSync.reload();});

    watch("./src/assets/sprite/*.*")
        .on("add", function() {console.log("雪碧图增加");runSequence("sprite", "scss:all", browserSync.reload);})
        .on("unlink", function() {console.log("删除雪碧图");runSequence("sprite", "scss:all", browserSync.reload);});

    watch(["./src/component/**/*.css", "./src/component/**/*.js"])
        .on("add", function() {gulp.start("inject");})
        .on("unlink", function() {gulp.start("inject");});

    watch(["./src/component/**/*.html"])
        .on("add", function() {gulp.start("tpl");})
        .on("change", function() {gulp.start("tpl");})
        .on("unlink", function() {gulp.start("tpl");});

    watch(["./src/component/**/*.scss"])
        .on("add", function() {gulp.start("scss");})
        .on("change", function() {gulp.start("scss");})
        .on("unlink", function() {gulp.start("scss");});

    watch(["./src/component/**/*.js"]).on("change", function() {browserSync.reload();});

    gulp.watch("./src/index.html").on("change", browserSync.reload);

}

/*开发流程*/
gulp.task("default", ["sprite"], function() {
    staticWatch();
    runSequence("scss:all", "tpl", "inject", "server:dev");
});















//
