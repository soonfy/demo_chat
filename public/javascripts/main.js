$(() => {
  console.log('document over.');
  $('.navs a')
    .click((e) => {
      console.log('toggle navs.');
      let target = e.target;
      $(target).siblings().removeClass('active');
      $(target).addClass('active');
      $('.signin').fadeToggle();
      $('.signup').fadeToggle();
    })
  
  $('.anon')
    .click((e) => {
      console.log('anon visit.');
      
    })
})
