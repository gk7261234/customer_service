/**
 * Created by GK on 2017/10/10.
 */
const router = require('express').Router();
const fs = require('fs');
const path = require('path');
//生成excel
const nodeExcel = require('excel-export');
const listTpl = require("../views/note/list.marko");
const detailTpl = require("../views/note/detail.marko");

/**
 *需要改进的地方： 文件异步读取需用promise
 */

//获取绝对路径
var resolve = file => path.resolve(__dirname, file);

//获取 年-月-日 当做文件名
function getNowFormatDate() {
  let date = new Date();
  // let seperator = "-";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let year = date.getFullYear();
  let currentdate = `${year}${month}${strDate}`;
  return currentdate;
}

//获取 时-分-秒 记录提交数据时间
function getNowTime() {
  let date = new Date();
  let seperator = ":";
  let currentdate = date.getHours() + seperator + date.getMinutes() + seperator + date.getSeconds();
  return currentdate;
}

// 记录列表
router.get('/list',function (req, res, next) {
  try {
    let folderName = resolve('note');
    fs.readdir(folderName,function (err,files) {
      let fileArr = [];
      if (err){
        console.log(err);
      }else{
        console.log(files);
        for (fil of files){
          let filName = fil.substring(0,8);
          fileArr.push(filName);
        }
      }
      listTpl.render({fileArr},res);
    });
  }catch(err){
    console.log(err);
  }
});

router.get('/', function (req, res, next) {
  let noteList = '';
  let fileName = req.query.fileName;
  let timeStamp = fileName?fileName:getNowFormatDate();
  let folder = 'note/'+ timeStamp +'.txt';
  let pathStr = resolve(folder);
  if (!fs.existsSync(pathStr)){
    // 创建文件夹
    // fs.mkdirSync(pathStr);
    fs.writeFile(pathStr,'[]',function (err,data) {
      if (err){
        console.log("写入失败");
      }
    })
  }else {
    fs.readFile(pathStr, (err, data) => {
      if(err){
        console.log(err);
        process.exit(1);
      }
      console.log(JSON.parse(data));
      noteList = JSON.parse(data);
      console.log('parse',noteList);
      detailTpl.render({noteList,fileName},res);
    })
  }
});

/**
 * 提交内容
 */
router.post('/_save',function (req, res, next) {
  let file = req.query.file,
    id = req.query.id,
    actionStr = req.query.action;

  let folder = 'note/' + file + '.txt';
  let pathStr = resolve(folder);

  let newComment = {
    id:req.body.id,
    name:req.body.name,
    phone:req.body.phone,
    channel:req.body.channel,
    question:req.body.question,
    description:req.body.description,
    solution:req.body.solution,
    progress:req.body.progress,
    remark:req.body.remark,
    time:getNowTime(),
  };

  fs.readFile(pathStr, (err, data) => {
    if(err){
      console.log(err);
      process.exit(1);
    }
    let comments = JSON.parse(data);

    if(actionStr == 'add'){
      comments.push(newComment);
    }else if(actionStr == 'modify'){
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id == id) {
          comments[i] = newComment;
          break;
        }
      }
    }

    fs.writeFile(pathStr, JSON.stringify(comments), (err, data) => {
      if(err){
        console.log(err);
        process.exit(1);
      }
      res.status(200).json('success');
    });
  });
});

/**
 * 下载文件
 */
router.get("/downLoad",function (req, res, next) {

  let comments = "";
  let timeStamp = getNowFormatDate();
  let folder = 'note/'+ timeStamp +'.txt';
  let pathStr = resolve(folder);
  fs.readFile(pathStr, (err, data) => {
    if(err){
      console.log(err);
      process.exit(1);
    }
    comments = JSON.parse(data);

    let conf ={};
    conf.cols = [
      {caption: '访客ID', type: 'string'},
      {caption: '访客姓名', type: 'string'},
      {caption: '联系方式', type: 'string'},
      {caption: '客服渠道', type: 'string'},
      {caption: '反馈问题', type: 'string'},
      {caption: '问题描述', type: 'string'},
      {caption: '解决方案', type: 'string'},
      {caption: '进展', type: 'string'},
      {caption: '备注', type: 'string'},
      {caption: '提交时间', type: 'string'}
    ];

    let arr = [];
    for (let comment of comments){
      let arrComment = [comment.id,comment.name,comment.phone,comment.channel,comment.question,comment.description,comment.solution,comment.progress,comment.remark,comment.time];
      arr.push(arrComment);
    }
    conf.rows = arr;
    let result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + timeStamp +".xlsx");

    res.end(result, 'binary');

  });

});

// 记录详情
router.get('/detail',function (req, res, next) {
  detailTpl.render({},res);
});

//删除某条记录
router.get('/_delete', function (req, res, next) {
  let file = req.query.file,
    id = req.query.id;
  let noteList = '';
  let timeStamp = file;
  let folder = 'note/' + timeStamp + '.txt';
  let pathStr = resolve(folder);
  if (!fs.existsSync(pathStr)) {
    fs.writeFile(pathStr, '[]', function (err, data) {
      if (err) {
        console.log("写入失败");
        process.exit(1);
      }
    })
  } else {
    fs.readFile(pathStr, (err, data) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      noteList = JSON.parse(data);

      for (let i = 0; i < noteList.length; i++) {
        if (noteList[i].id == id) {
          noteList.splice(i, 1);
          break;
        }
      }
      fs.writeFile(pathStr, JSON.stringify(noteList), function (err, data) {
        if (err) {
          console.log("文件写入错误：", err);
          process.exit(1);
        }
        res.status(200).json('success');
      })
    })
  }
})
module.exports = router;