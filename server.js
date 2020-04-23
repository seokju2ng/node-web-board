// 환경설정
const PORT = 80;
// 센터 IP
// const DB_CONFIG = { host: '192.168.30.245', user: 'buser', password: '', database: 'board' }
// 집 IP
// const DB_CONFIG = { host: '192.168.0.6', user: 'buser', password: '', database: 'board' }
// 외부 IP
const DB_CONFIG = { host: 'localhost', user: 'buser', password: '', database: 'board' }

// 모듈 로드
const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const app = new express();

var thispage = 1;

var fExecuteQuery = function(err){
   if(err){
      response.send({ errno: 9999, message: '데이터베이스 접속에 실패하였습니다.'});
   }
    else{
      con.query(sql, function(err, res){
        if(err){
          response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
        }
        else {
          response.send({
                errno: 0,
                message: '요청이 정상적으로 처리되었습니다.',
                result: res});
        }
        con.end();
      });
   }
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('public/js'));
// app.use(express.static('public/css'));

app.post('/board/add', function(request, response){
  let con = mysql.createConnection(DB_CONFIG);
  let data = request.body;
  let sql = null;
  console.log(typeof data.islike);
  if(data.islike == "true"){
    sql = "UPDATE post_info_tb set n_like = "+ (parseInt(data.cnt)+1)
    + " WHERE p_num = " + data.num;
  } else {
    sql = "UPDATE post_info_tb set n_dislike = "+ (parseInt(data.cnt)+1)
    + " WHERE p_num = " + data.num;
  }
  //   console.log("SQL실행문: "+sql);
  con.connect(function(err){
    if(err){
      response.send({ errno: 9999, message: '데이터베이스 접속에 실패하였습니다.'});
    }
    else{
      con.query(sql, function(err, res){
      if(err){
        response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
      }
      else {
        response.send({
          errno: 0,
          message: '요청이 정상적으로 처리되었습니다.',
          result: res
        });
      }
        con.end();
      });
    }
  });
});


app.post('/board/delete', function(request, response){
  let con = mysql.createConnection(DB_CONFIG);
  let num = request.body.num;
  let sql = "DELETE FROM post_info_tb WHERE p_num = '"+ num +"';"
  con.connect(function(err){
     if(err){
        response.send({ errno: 9999, message: '데이터베이스 접속에 실패하였습니다.'});
     }
      else{
        con.query(sql, function(err, res){
          if(err){
            response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
          }
          else {
            response.send({
                  errno: 0,
                  message: '요청이 정상적으로 처리되었습니다.',
                  result: res});
          }
          con.end();
        });
     }
  });
})


app.post('/board/post', function(request, response){
   let con = mysql.createConnection(DB_CONFIG);
   let num = request.body.num;
//   console.log(num);
   let sql = "SELECT "
   + "p.p_num 'num', c.c_name 'horsehead', p.title 'title', "
   + "p.writer 'writer', p.w_date 'date', p.n_like 'like', "
   + "p.n_dislike 'dislike', p.content 'content', p.password 'password', views 'views' "
   + "FROM post_info_tb AS p "
   + "INNER JOIN category_tb AS c USING(c_id) "
   + "WHERE p.p_num = " + num+";";
   console.log(sql);
   con.connect(function(err){
      if(err){
         response.send({ errno: 9999, message: '데이터베이스 접속에 실패하였습니다.'});
      }
       else{
         con.query(sql, function(err, res){
           if(err){
             response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
           }
           else {
             sql = 'UPDATE post_info_tb SET views = views+1 WHERE p_num = '+num+';';
             con.query(sql, function(err){
               if(err){
                 response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
               } else {
                 res[0].views++;
                 response.send({
                       errno: 0,
                       message: '요청이 정상적으로 처리되었습니다.',
                       result: res
                 });
               }
             })
           }
           con.end();
         });
      }
   });
});

app.post('/board/insert', function(request, response){
  let con = mysql.createConnection(DB_CONFIG);
  let data = request.body;
  let sql = "INSERT INTO post_info_tb(title, content, writer, password, c_id) VALUES('"+data.title+"', '"+data.content+"', '"+data.writer+"', '"+data.password+"', "+data.horsehead+")"
  con.connect(function(err){
    if(err){
      response.send({ errno: 9999, message: '데이터베이스 접속에 실패하였습니다.'});
    }
    else{
      con.query(sql, function(err, res){
        if(err){
          response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
        }
        else {
          response.send({
                errno: 0,
                message: '요청이 정상적으로 처리되었습니다.',
                result: res});
        }
        con.end();
      });
    }
  });
});


app.get('/board/ctgr', function(request, response){
  let con = mysql.createConnection(DB_CONFIG);
  let sql = "SELECT c_id, c_name FROM category_tb";
  console.log(sql);
  con.connect(function(err){
    if(err){
      response.send({ errno: 9999, message: '데이터베이스 접속에 실패하였습니다.'});
    }
    else{
      con.query(sql, function(err, res){
        if(err){
          response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
        }
        else {
          response.send({
                errno: 0,
                message: '요청이 정상적으로 처리되었습니다.',
                result: res});
        }
        con.end();
      });
    }
  });
});

app.get('/board', function(request, response){
  response.redirect('/main.html');
});

app.get('/board/getlist/:page/:flag', function(request, response){
  let con = mysql.createConnection(DB_CONFIG);
  let flag = request.params.flag;
  let page = request.params.page;
  let listSize = 10;
  let total = 0;
  let sql = "SELECT CEIL(COUNT(*)/"+listSize+") 'total' FROM post_info_tb;";

  if(page == 0){ page = thispage; }

  con.connect(function(err){
    if(err){
      response.send({ errno: 9999, message: '데이터베이스 접속에 실패하였습니다.'});
      console.log('데이터베이스 접속에 실패하였습니다.');
    }
    else{
      con.query(sql, function(err, res){
        if(err){
          response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
          console.log('SQL 실행에 실패하였습니다.');
        }
        else {
          total = res[0].total; // 총 페이지수
        }
        switch (flag) {
          case 'next': if(page < total) page++;
            break;
          case 'prev': if(page > 1) page--;
            break;
          case 'first': page = 1; break;
          case 'last': page = total; break;
          default: break;
        }
        thispage = page;
        let pageRange = (page - 1) * listSize;
        console.log('page:'+page+', flag:'+flag+', get board list '+listSize+' posts');
        sql = "SELECT "
        + "p.p_num 'num', c.c_name 'horsehead', p.title 'title', "
        + "p.writer 'writer', p.w_date 'date', p.n_like 'like' "
        + "FROM post_info_tb AS p "
        + "INNER JOIN category_tb AS c USING(c_id) "
        + "ORDER BY num DESC LIMIT "+(pageRange)+", "+listSize+";";

        con.query(sql, function(err, res){
          if(err){
            response.send({ errno: 9998, message: 'SQL 실행에 실패하였습니다.'});
          } else {
            response.send({
                  errno: 0,
                  message: '요청이 정상적으로 처리되었습니다.',
                  result: {board: res, page: page, total: total}
                });
          }
        });
        con.end();
      });
    }
  });
});


app.listen(PORT, function(){
  console.log('Daily Board Running at port '+PORT);
})
