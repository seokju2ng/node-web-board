var viewpost = null;
var likeCnt = 0;
var dislikeCnt = 0;

$.fn.clickDelete = function(password){
   this.click(function(e){
      console.log('삭제 버튼 클릭');
      // 삭제 팝업창 생성
      console.log("비밀번호:"+password.pwd);
      $.showPwd(password);
   });
}

$.fn.clickAdd = function(info){
   this.click(function(){
      //console.log('clickAdd');
      //console.log(data);
      //var lcnt = data.cnt;
      // console.log(typeof info.islike);
      $.ajax('/board/add', {
         type: 'POST',
         data: info
      }).then(function(data, status){
//         console.log("data 정보: ");
//         console.log(data);
         console.log('l원래값 '+ $('#n_like').text());
         console.log('r원래값 '+ $('#n_dislike').text());
         if(status == 'success'){
            if(info.islike == true){
               console.log(info.cnt+1);
               $('#n_like').text(info.cnt+1);
               console.log('lcnt는 이제 '+$('#lcnt').text());
            }
            else{
               console.log(info.cnt+1);
               $('#n_dislike').text(info.cnt+1);
               console.log('rcnt는 이제 '+$('#ucnt').text());
            }
         }
      });
   });
};

$.showPost = function(postInfo) {
   // console.log('showPost');
   // console.log(postInfo.date);
   let d = new Date(postInfo.date);
   let datetime = d.getFullYear();
   datetime += '.' + (d.getMonth()+1).zf(2) + '.' + d.getDate().zf(2) + '. ';
   datetime += d.getHours().zf(2) + ':' + d.getMinutes().zf(2);

   likeCnt = postInfo.like;
   dislikeCnt = postInfo.dislike;

   viewpost = $(''
   + '<div class="back3"></div>'
   + '<div class="viewForm">'
   + '  <div>'
   + '    <ul>'
   + '      <li>'+postInfo.title+'</li>'
   + '      <li>'+postInfo.horsehead+'</li>'
   + '      <li>'+datetime+'</li>'
   + '    </ul>'
   + '    <ul>'
   + '      <li>'+postInfo.views+'</li>'
   + '      <li>views</li>'
   + '      <li id="wid">'+postInfo.writer+'</li>'
   + '    </ul>'
   + '    <ul>'
   + '      <textarea class="content" disabled>'
   +         postInfo.content+'</textarea>'
   + '    </ul>'
   + '    <ul>'
   + '      <li id="n_like">'+postInfo.like+'</li>'
   + '      <li><input id="like" type="image" src="image/heart.png"></li>'
   + '      <li><input id="dislike" type="image" src="image/broken_heart.png"></li>'
   + '      <li id="n_dislike">'+postInfo.dislike+'</li>'
   + '    </ul>'
   + '    <ul>'
   + '      <li><button class="btn btn-hotpink text-white list">목록</button></li>'
   + '      <li><button class="btn btn-hotpink text-white delete">삭제</button></li>'
   + '    </ul>'
   + '  </div>'
   + '</div>').appendTo($('body'));

   viewpost.find('#like').clickAdd({
      num : postInfo.num,
      islike : true,
      cnt : postInfo.like,
   });

   viewpost.find('#dislike').clickAdd({
      num : postInfo.num,
      islike : false,
      cnt : postInfo.dislike
   });

   viewpost.find('.list').click(function(){
      viewpost.remove();
      $.refresh();
   });
   $('.delete').clickDelete({
     num: postInfo.num,
     pwd: postInfo.password
   });

   let wh = $(window).height();
   let fh = 465;
   let top = (wh-fh) / 2;
   viewpost.children('div').css('top', top+'px');

   viewpost.show();
}
