var category = null;
var form = null;

$.fn.register = function(form){
  this.click(function(){
    console.log('등록 버튼 클릭');
    // 폼 데이터를 검사한다.
    if(form.find('#writer').val().trim() == ''){
      $.showPopup('작성자명을 입력하세요.', function(){
        form.find('#writer').focus();
      });
      return;
    }
    if(form.find('#horsehead').val() == '0'){
      $.showPopup('말머리를 선택하세요.', function(){
        form.find('#horsehead').focus();
      });
      return;
    }
    if(form.find('#title').val().trim() == ''){
      $.showPopup('제목을 입력하세요.', function(){
        form.find('#title').focus();
      });
      return;
    }
    if(form.find('#content').val().trim() == ''){
      $.showPopup('내용을 입력하세요.', function(){
        form.find('#content').focus();
      });
      return;
    }
    if(form.find('#password').val().trim() == ''){
      $.showPopup('비밀번호를 입력하세요.', function(){
        form.find('#password').focus();
      });
      return;
    }
    // ajax를 이용하여 폼을 서버에 전송
    let newpost = new Object;
    let cont = $('.cont');

    newpost.writer = form.find('#writer').val();
    newpost.horsehead = form.find('#horsehead').val();
    newpost.title = form.find('#title').val();
    newpost.content = form.find('#content').val();
    newpost.password = form.find('#password').val();

    console.log(newpost);

    $.ajax('/board/insert', {
      type: 'POST',
      data: newpost
    }).then(function(data, status){
      if(status == 'success'){
        $.showPopup('등록을 완료하였습니다.', function(){
          console.log('등록완료');
          form.remove();
          $.refresh();
        });
      }
    });
  });
}

$.showForm = function(){

  $('body').find('.back1').remove();
  $('body').find('.regForm').remove();
  $.createForm();
  if(category == null){
    $.get('/board/ctgr', function(data, status){
      if(status == 'success'){
        category = data.result;
        console.log(category);
        for(let i = 0; i < category.length; i++){
          let sel = $('select');
          $('<option />',{text: category[i].c_name, value: category[i].c_id}).appendTo(sel);
        }
      };
    })
  } else {
    console.log("카테고리 이미 있음 ㅋ");
    for(let i = 0; i < category.length; i++){
      let sel = $('select');
      $('<option />',{text: category[i].c_name, value: category[i].c_id}).appendTo(sel);
    }
  }
}

$.createForm = function(){
  form = $(''
  + '<div class="back1"></div>'
  + '<div class="regForm">'
  + '  <div>'
  + '   <form class="cont">'
  + '    <ul>'
  + '      <li>작성자</li>'
  + '      <li>'
  + '        <input type="text" class="typeTxt" id="writer" maxlength="12">'
  + '      </li>'
  + '      <li>&nbsp;&nbsp;* 12자리 이하</li>'
  + '    </ul>'
  + '    <ul>'
  + '      <li>말머리</li>'
  + '      <li>'
  + '        <select class="selectBox" id="horsehead">'
  + '         <option value="0" selected>선택</option>'
  + '        </select>'
  + '      </li>'
  + '    </ul>'
  + '    <ul>'
  + '      <li>제 &nbsp; 목</li>'
  + '      <li>'
  + '        <input type="text" class="typeTxt" id="title" maxlength="20">'
  + '      </li>'
  + '      <li>&nbsp;&nbsp;* 20자리 이하</li>'
  + '    </ul>'
  + '    <ul>'
  + '      <li>내 &nbsp; 용</li>'
  + '      <li>'
  + '        <textarea class="content" id="content"></textarea>'
  + '      </li>'
  + '    </ul>'
  + '    <ul>'
  + '      <li>비밀번호</li>'
  + '      <li>'
  + '        <input type="password" class="typePwd" id="password" maxlength="12">'
  + '      </li>'
  + '      <li>&nbsp;&nbsp;* 12자리 이하</li>'
  + '    </ul>'
  + '   </form>'
  + '    <ul>'
  + '      <li>'
  + '        <button class="btn btn-hotpink text-white btn-register">등록하기</button>'
  + '      </li>'
  + '      <li>'
  + '        <button class="btn btn-hotpink text-white btn-cancel">취소하기</button>'
  + '      </li>'
  + '    </ul>'
  + '  </div>'
  + '</div>').appendTo($('body'));

  form.find('.btn-register').register(form);
  form.find('.btn-cancel').click(function(){
    console.log('취소버튼');
    form.remove();
    $.refresh();
  });

  let wh = $(window).height();
  let fh = 483;
  let top = (wh-fh) / 2;
  form.children('div').css('top', top+'px');
  // console.log("??");
  form.show();
  form.find('#writer').focus();
  // form.find('.btn').click(function(){
  //   $.refresh();
  // })
}
