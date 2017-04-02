$(() => {
  console.log('index page document over.');

  // 验证
  let verification = true;
    
  $('.navs a')
    .click((e) => {
      console.log('toggle navs.');
      let target = e.target;
      $(target).siblings().removeClass('active');
      $(target).addClass('active');
      $('.signin').fadeToggle();
      $('.signup').fadeToggle();
    })

  $('form > button')
    .click((e) => {
      e.preventDefault();
      let inputs = $(e.target).prevAll('input');
      inputs.map((index, input) => {
        if (($(input).val().trim().length) === 0) {
          verification = false;
          $(input).blur();
        }
      })
      console.log(verification);
      if (verification) {
        console.log($(e.target).parent());
        $(e.target).parent('form')[0].submit();
      }
    })
})
