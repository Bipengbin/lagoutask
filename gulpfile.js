/* 
* 
* gulp @4.0.2
* 制作精灵图
*
*/

const { src, dest } = require("gulp");
const spritesmith = require('gulp.spritesmith');

function streamTask(cb) {
  cb();
}

function SpritesTask() {
  
  return src("img/**/*.@(jpeg|jpg|png)").pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  })).pipe(dest("output/"));
}

exports.Sprites = SpritesTask;

exports.default = streamTask;
