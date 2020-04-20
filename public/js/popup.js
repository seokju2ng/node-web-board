$.showPopup = function(){
  // console.log('showpopup 진입');
  let msg = "등록되었습니다.";
  let callback = null;
  if(arguments.length > 0){
    msg = arguments[0];
  }
  if(arguments.length > 1){
    callback = arguments[1];
  }
  $('body').find('.back2').remove();
  $('body').find('.popup').remove();
  let popup = $(''
    + '<div class="back2"></div>'
    + '<div class="popup">'
    + '  <div>'
    + '    <ul>'
    + '      <li class="msg"></li>'
    + '      <li><button class="btn btn-hotpink text-white">확인</button></li>'
    + '    </ul>'
    + '  </div>'
    + '</div>').appendTo($('body'));

  popup.find('.msg').text(msg);
  popup.find('button').click(function(){
    popup.remove();
    if(callback) callback();
  });
  let wh = $(window).height();
  // console.log('popup: ',wh);
  let ph = 141;
  let top = (wh-ph) / 2;
  popup.children('div').css('top', top);
  popup.show();
  // popup.show(0, function(){
  //   setTimeout(function(){
  //     popup.remove();
  //     if(callback) callback();
  //   }, 5000);
  // });
}
