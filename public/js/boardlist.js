var curpage = 0;
var listSize = 10;
var total = 0;
var startpage = 0;

$.fn.writePost = function(){
  $(this).click(function(){
    console.log('글쓰기 버튼 클릭');
    $.showForm();
  });
};

$.fn.clickPage = function(){
  $(this).click(function(){
    $(this).siblings().css('color', '');
    curpage = $(this).text();
    // console.log("페이지 번호: "+curpage);
    $.refresh();
    // $(this).css('color', '#ff0066');
  });
}

$.fn.clickTitle = function() {
   $(this).click(function() {
      let postNum = $(this).siblings().eq(0).text();
      console.log("글 번호: "+postNum);
      $.ajax('/board/post', {
            type: 'POST',
            data: {num: postNum}
       }).then(function(data, status){
          if(status == 'success'){
             let postInfo = data.result[0];
             $.showPost(postInfo);
          }
       });
   });
}

$.insertAllPost = function(board){
  for(let i = board.length-1; i >= 0; i--){
    $.insertPost(board, i, 0);
  }
}

$.insertPost = function(board, insertRow, beforeRowNum){
  // console.log(beforeRowNum+"뒤에 삽입");
  let d = new Date(board[insertRow].date);
  let date = d.getFullYear().toString().substr(2,2);
  date += '.' + (d.getMonth()+1).zf(2) + '.' + d.getDate().zf(2);

  let ul = $('<ul />');
  $('.board > .elem > ul > #n'+beforeRowNum).parent().after(ul);

  $('<li />', {text: board[insertRow].num, id:'n'+board[insertRow].num}).appendTo(ul);
  $('<li />', {text: board[insertRow].horsehead}).appendTo(ul);
  let title = $('<li class="b_title" style="cursor:pointer">'+board[insertRow].title+'</li>');
  title.appendTo(ul);
  title.clickTitle();
  $('<li />', {text: board[insertRow].writer}).appendTo(ul);
  $('<li />', {text: date}).appendTo(ul);
  $('<li />', {text: board[insertRow].like, class: 'like'+board[insertRow].num}).appendTo(ul);
}

$.refresh = function(){
  var board = null;
  let flag = 'cur';
  // console.log(arguments);
  if(arguments.length > 0) {
    console.log(arguments[0] + " page request");
    flag = arguments[0];
  }
  // console.log(flag);
  $.get('/board/getlist/'+curpage+'/'+flag, function(data, status){
    if(status == 'success'){
      board = data.result.board;
      total = data.result.total;
      // console.log("curpage :" +curpage);
      console.log("### board refresh ###");
      // console.log(board);
      // console.log(board[0].num);
      let dbi = 0;
      // if(flag != 'cur'){  // 페이지가 넘어가게 되면
      //   if(flag == 'prev' && curpage != 1){
      //     $('.board > .elem > ul:gt(0)').remove();
      //     // console.log('모든 항목 삭제');
      //   }
      //   else if(flag == 'next' && curpage != total){
      //     $('.board > .elem > ul:gt(0)').remove();
      //     // console.log('모든 항목 삭제');
      //   }
      //   else if(flag == 'first'){
      //     $('.board > .elem > ul:gt(0)').remove();
      //   }
      // }
      // switch (flag) {
      //   case 'first':
      //   case 'prev': if(curpage == 1) break; // 현재 페이지가 1이라면 이전이나 맨앞 버튼이 눌렸을 때 게시글 리스트를 지우지 않아도 된다.
      //   case 'next':
      //   case 'last': if(curpage == total) break; // 현재 페이지가 끝 페이지라면 다음이나 맨뒤 버튼이 눌렸을 때 게시글 리스트를 지우지 않아도 된다.
      //     // $('.board > .elem > ul:gt(0)').remove();
      //   default: break;
      //
      // }
      curpage = data.result.page; // 현재 페이지 수정
      // console.log("curpage:"+curpage);
      for(let i = board[0].num+30; i > 0; i--){
        // console.log("board["+dbi+"]:"+board[dbi].num+", i:"+i);
        // console.log('dbi:'+dbi);
        if(board[dbi].num == i){
          let bpost = $('.board > .elem').find('#n'+i);
          if(bpost[0] == undefined){
            // console.log(i+"번 글: DB O, 게시판 X > 추가");
            let chk = 0;
            for(let j = 0; j < board[0].num+30; j++){
              let before = $('.board > .elem').find('#n'+j);
              if(before[0] != undefined){
                if(board[dbi].num < j){
                  $.insertPost(board, dbi, j);
                  chk++;
                  // console.log(i+'번 글 '+j+'번 뒤에 삽입');
                  break;
                }
              }
            }
            if(chk == 0){
              $.insertPost(board, dbi, 0);
              // console.log(i+'번 글 헤더 밑에 삽입');
            }
          }
          else{
            let plike = $('.board > .elem').find('.like'+i);
            // console.log(bpost);
            // console.log("plike:"+plike.text()+", dblike:"+board[dbi].like);
            if(plike.text() != board[dbi].like){
              plike.text(board[dbi].like);
            }
          }
          if($('.board > .elem > ul:gt(0)').length > board.length){
            $('.board > .elem > ul:gt('+board.length+')').remove();
          }
          dbi++;
        }
        else if(board[dbi].num < i){
          let bpost = $('.board > .elem').find('#n'+i);
          if(bpost[0] != undefined){
            // console.log(i+"번 글 삭제");
            bpost.parent().remove();
          }
        }

        // else if()
        // console.log('dbi:'+dbi+',listsize:'+listSize);
        if(dbi == listSize) break; // 리스트 사이즈보다 board 인덱스가 커지면
      }
      $.insertPages();
      $('.btn-page#'+curpage+'').css('color','#ff0066');
    };
  });
}

$.showBoard = function(){
  // $('body').find('.wrap').remove();
  var board = null;
  $.createBoard();
  $.get('/board/getlist/'+curpage+'/cur', function(data, status){
    // console.log(data + " " + status);
    if(status == 'success'){
      board = data.result.board;
      total = data.result.total;
      curpage = data.result.page;
      $.insertAllPost(board);
      $.insertPages();
      $('.btn-page#'+curpage+'').css('color','#ff0066');
    };
  });
};

$.insertPages = function(){
  let bt_num;
  if(total > 5) bt_num = 5;
  else bt_num = total;
  let pages = $('.pages').css('width', (20 * bt_num)+'px');
  // let startpage = 1;
  if(curpage >= total - 2){
    if(startpage === total - 4) return;
    startpage = total - 4;
  }
  else if(curpage > 3){
    if(startpage === curpage - 2) return;
    startpage = curpage - 2;
  } else{
    if(startpage === 1) return;
    startpage = 1;
  }
  // console.log("startpage:"+startpage);
  // console.log($('.pages .btn-page'));
  // if(startpage == $('.pages:first-child').id) console.log('same');
  // console.log('startpage:'+startpage);
  pages.children().remove();
  // console.log("page button remove all!!");
  for(let i = 0; i < bt_num; i++){
    let btn_page = $('<button />', {id:i+startpage, text:i+startpage, class:'btn-page'});
    btn_page.appendTo(pages);
    btn_page.clickPage();
    btn_page.css('color', '');
    // if(startpage+i == curpage){
    //   btn_page.css('color','#ff0066');
    //   console.log('startpage:'+startpage+' curpage:'+curpage);
    // }
  }
}

$.createBoard = function(){
  // $('body').find('.board').remove();
  let board = $(''
  + '<div class="title">일상 게시판</div>'
  + '<div class="board">'
  + ' <div class="elem">'
  + '  <ul>'
  + '    <li id="n0">글번호</li>'
  + '    <li>말머리</li>'
  + '    <li>제목</li>'
  + '    <li>작성자</li>'
  + '    <li>작성일자</li>'
  + '    <li>♥</li>'
  + '  </ul>'
  + ' </div>'
  + ' <div class="btns">'
  + '  <ul>'
  + '   <li>'
  + '    <button class="btn btn-hotpink text-white btn-write">글쓰기</button>'
  + '   </li>'
  + '   <li class="no-margin"><button id="last" class="btn btn-white text-hotpink">맨뒤</button></li>'
  + '   <li><button id="next" class="btn btn-white text-hotpink">다음</button></li>'
  + '   <li class="pages">'
  //      <buttons> class="btn-page"
  + '   </li>'
  + '   <li><button id="prev" class="btn btn-white text-hotpink">이전</button></li>'
  + '   <li class="no-margin"><button id="first" class="btn btn-white text-hotpink">맨앞</button></li>'
  + '  </ul>'
  + ' </div>'
  + '</div>').appendTo($('body'));
  board.find('.btn-write').writePost();
  board.find('.btn-white').click(function(){
    // console.log($(this).attr('id'));
    // console.log($('.btn-page#'+curpage+''));
    $('.btn-page#'+curpage+'').css('color','');
    $.refresh($(this).attr('id'));
  })
  setInterval(function(){
    $.refresh();
  }, 5000);
};
