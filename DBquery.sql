CREATE TABLE post_info_tb (
  p_num INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  writer VARCHAR(20) NOT NULL,
  password VARCHAR(20) NOT NULL,
  w_date DATETIME NOT NULL CURRENT_TIMESTAMP,
  n_like INT UNSIGNED NOT NULL DEFAULT 0,
  n_dislike INT UNSIGNED NOT NULL DEFAULT 0,
  c_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (c_id) REFERENCES category_tb(c_id)
  ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE category_tb (
  c_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  c_name CHAR(4) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO category_tb(c_name) VALUES ('허언');

INSERT INTO post_info_tb(title, content, writer, password, c_id)
VALUES ('아 진짜....대박', '내가 아까 오면서 진짜 개쩌는걸 봤는데...\n\n\n\n...\n\n 내일 말해줄게..', '김현우', '12345', 5);
INSERT INTO post_info_tb(title, content, writer, password, c_id)
VALUES ('가나다', '가나다', '가나다', '12345', 1);
INSERT INTO post_info_tb(title, content, writer, password, c_id)
VALUES ('가나다', '가나다', '가나다', '12345', 2);
INSERT INTO post_info_tb(title, content, writer, password, c_id)
VALUES ('가나다', '가나다', '가나다', '12345', 3);
INSERT INTO post_info_tb(title, content, writer, password, c_id)
VALUES ('가나다', '가나다', '가나다', '12345', 4);
INSERT INTO post_info_tb(title, content, writer, password, c_id)
VALUES ('가나다', '가나다', '가나다', '12345', 5);
INSERT INTO post_info_tb(title, content, writer, password, c_id)
VALUES ('가나다', '가나다', '가나다', '12345', 6);


INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (88, 'qwe', 'qwe', 'qwe', 'qwe', 4);
INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (94, 'qwe', 'qwe', 'qwe', 'qwe', 4);
INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (102, 'qwe', 'qwe', 'qwe', 'qwe', 4);
INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (103, 'qwe', 'qwe', 'qwe', 'qwe', 4);
INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (98, 'qwe', 'qwe', 'qwe', 'qwe', 4);
INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (97, 'qwe', 'qwe', 'qwe', 'qwe', 4);
INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (92, 'qwe', 'qwe', 'qwe', 'qwe', 4);
INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (100, 'qwe', 'qwe', 'qwe', 'qwe', 4);
INSERT INTO post_info_tb(p_num, title, content, writer, password, c_id)
VALUES (15, 'qwe', 'qwe', 'qwe', 'qwe', 4);
DELETE FROM post_info_tb WHERE p_num = '103';
DELETE FROM post_info_tb WHERE p_num = '102';
DELETE FROM post_info_tb WHERE p_num = '88';
DELETE FROM post_info_tb WHERE p_num = '94';
DELETE FROM post_info_tb WHERE p_num = '98';
DELETE FROM post_info_tb WHERE p_num = '97';
DELETE FROM post_info_tb WHERE p_num = '100';
DELETE FROM post_info_tb WHERE p_num = '15';
DELETE FROM post_info_tb WHERE p_num = '92';

SELECT
p.p_num 'num', c.c_name 'horsehead', p.title 'title',
p.writer 'writer', date(p.w_date) 'date', p.n_like 'like'
FROM post_info_tb AS p
INNER JOIN category_tb AS c USING(c_id)
ORDER BY num DESC LIMIT 0, 10;

SELECT CEIL(COUNT(*)/10) 'total' FROM post_info_tb;



SELECT c_id, c_name FROM category_tb LIMIT 0, 5;

DELETE FROM post_info_tb WHERE p_num = '57';
DELETE FROM post_info_tb WHERE p_num = '';



DELETE FROM post_info_tb WHERE p_num = '99';
DELETE FROM post_info_tb WHERE p_num = '98';
DELETE FROM post_info_tb WHERE p_num = '93';
DELETE FROM post_info_tb WHERE p_num = '91';
DELETE FROM post_info_tb WHERE p_num = '82';




CREATE USER 'buser'@'%';
GRANT ALL PRIVILEGES ON board.* to 'buser'@'%';

update post_info_tb set n_dislike = 1 where p_num = 52;
update post_info_tb set n_dislike = 3 where p_num = 3;
update post_info_tb set n_dislike = 2 where p_num = 50;
update post_info_tb set n_dislike = 1 where p_num = 10;
update post_info_tb set n_dislike = 6 where p_num = 6;




mysql -ubuser -h"SERVER_IP_ADDRESS" board;
mysql -ubuser -h192.168.30.245 board;



$.showBoard = function(){
  $('body').find('.wrap').remove();
  var board = null;
  $.createBoard();
  $.get('/board/getlist', function(data, status){
    // console.log(data + " " + status);
    if(status == 'success'){
      board = data.result;
      $.insertAllPost(board);
    };
  });
};

app.get('/board/getlist', function(request, response){
  let con = mysql.createConnection(DB_CONFIG);
  let sql = "SELECT "
  + "p.p_num 'num', c.c_name 'horsehead', p.title 'title', "
  + "p.writer 'writer', p.w_date 'date', p.n_like 'like' "
  + "FROM post_info_tb AS p "
  + "INNER JOIN category_tb AS c USING(c_id) "
  + "ORDER BY num DESC;";
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


if(bpost[0] == undefined){
  console.log(i+"번 글: DB O, 게시판 X > 추가");
  let ul = $('<ul />');
  for(let j = 0; j < board[0].num+30; j++){
    let before = $('.board > .elem').find('#n'+j);
    if(before[0] != undefined){
      if(board[dbi].num < j){
        $('.board > .elem > ul > #n'+j).parent().after(ul);
        break;
      }
    }
  }
  // let ul = $('<ul />');
  // $('.board > .elem > ul:first-child').after(ul);
  $('<li />', {text: board[dbi].num, id:'n'+board[dbi].num}).appendTo(ul);
  $('<li />', {text: board[dbi].horsehead}).appendTo(ul);
  let title = $('<li class="b_title" style="cursor:pointer">'+board[dbi].title+'</li>');
  title.appendTo(ul);
  title.clickTitle();
  $('<li />', {text: board[dbi].writer}).appendTo(ul);
  $('<li />', {text: board[dbi].date.substr(2,8)}).appendTo(ul);
  // console.log(board[dbi].date);
  $('<li />', {text: board[dbi].like, class: 'like'+board[dbi].num}).appendTo(ul);
  ul.css('border-bottom', '1px solid #ffdcdc');
  // $('.b_title').clickTitle();
  console.log('삽입성공');
}
