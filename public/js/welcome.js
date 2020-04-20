$.fn.clickImage = function() {
   this.click(function() {
      console.log('이미지 클릭');
      location.href = '/board';
   });
};

$.showWelcome = function() {
   let welcome = $(''
   +'<div class="wrap">'
   +'   <div>'
   +'      <img src="image/welcome.gif" id="welcome" style="cursor:pointer">'
   +'      <label class="welcome" style="cursor:pointer">Daily Board</label>'
   +'   </div>'
   +'</div>').appendTo($('body'));
   welcome.find('div').clickImage();

   let wh = $(window).height();
   let ph = 533;
   let top = (wh-ph) / 2;
   welcome.children('div').css('top', top);
}
