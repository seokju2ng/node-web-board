var pwd = null;

$.deleteOnDB = function(num) {
  $.ajax('/board/delete', {
    type: 'POST',
    data: {num: num}
  }).then(function(data, status){
    if(status == 'success'){
      $.showPopup('삭제를 완료하였습니다.', function(){
        console.log('삭제완료');
        pwd.remove();
        viewpost.remove();
        $.refresh();
      });
    }
  });
}

$.showPwd = function(password){
   console.log('showPWD()');

   pwd = $(''
    +'<div class="back4"></div>'
    +'  <div class="popup_pwd">'
    +'     <div>'
    +'        <ul>'
    +'           <li class="msg">비밀번호를 입력하세요.</li>'
    +'           <li><input type="password" class="typePwd" id="password"></li>'
    +'           <li>'
    +'              <button class="btn btn-hotpink text-white btn-check">확인</button>'
    +'              <button class="btn btn-hotpink text-white btn-cancel">취소</button>'
    +'         </li>'
    +'      </ul>'
    +'    </div>'
    +'  </div>').appendTo($('body'));

   let wh = $(window).height();
   let fh = 197;
   let top = (wh-fh) / 2;
   pwd.children('div').css('top', top);


   pwd.find('.btn-check').click(function(){
     console.log("password.pwd:"+password.pwd);
     // console.log("pwd.find('.typePwd').text():"+pwd.find('.typePwd').text());
     // console.log(pwd.find('.typePwd'));
      if(password.pwd == pwd.find('.typePwd').val()){
        $.deleteOnDB(password.num);
      } else {
        $.showPopup('비밀번호가 틀렸습니다.', function(){
          pwd.find('.typePwd').focus();
        });
      }
   });

   pwd.find('.btn-cancel').click(function(){
      pwd.remove();
   });

   pwd.show();
   pwd.find('.typePwd').focus();
}
