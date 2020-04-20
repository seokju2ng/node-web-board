$.refresh = function(){
  var board = null;
  let flag = 'cur';
  if(arguments.length > 0) {
    console.log(arguments[0] + " page request");
    flag = arguments[0];
  }
  $.get('/board/getlist/'+curpage+'/'+flag, function(data, status){ //페이지요청
    if(status == 'success'){
      board = data.result.board;
      total = data.result.total; // 마지막 페이지번호
      console.log("### board refresh ###");
      let dbi = 0;
      curpage = data.result.page; // 현재 페이지 수정
      for(let i = board[0].num+30; i > 0; i--){
        if(board[dbi].num == i){
          let bpost = $('.board > .elem').find('#n'+i);
          if(bpost[0] == undefined){
            let chk = 0;
            for(let j = 0; j < board[0].num+30; j++){
              let before = $('.board > .elem').find('#n'+j);
              if(before[0] != undefined){
                if(board[dbi].num < j){
                  $.insertPost(board, dbi, j);
                  chk++;
                  break;
                }
              }
            }
            if(chk == 0){
              $.insertPost(board, dbi, 0);
            }
          }
          else{
            let plike = $('.board > .elem').find('.like'+i);
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

        if(dbi == listSize) break; // 리스트 사이즈보다 board 인덱스가 커지면
      }
      $.insertPages();
      $('.btn-page#'+curpage+'').css('color','#ff0066');
    };
  });
}

$.showBoard = function(){
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
