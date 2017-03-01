$(() => {
  console.log('entry page document over.');

  // 验证
  let verification = false;
    
  $('.navs a')
    .click((e) => {
      console.log('toggle navs.');
      let target = e.target;
      $(target).siblings().removeClass('active');
      $(target).addClass('active');
      $('.signin').fadeToggle();
      $('.signup').fadeToggle();
    })

  $('[name=name]')
    .keydown((e) => {
      console.log('name keydown.');
      // let num = e.which;
      // let label = $(e.target).prev();
      // label.css('display', 'none');
      // if (num >= 48 && num <= 57) {
      //   // shuzi
      // } else if (num >= 65 && num <= 90) {
      //   // zimu
      // } else if (num === 189 || num === 8 || num === 46 || num === 13 || num === 16 || num === 20) {
      //   // xiahuaxian, tuige, delte, huiche, shift, caps
      // } else {
      //   label.css('display', 'inline-block');
      // }
    })

  $('input')
    .blur((e) => {
      console.log('input blur.');
      verification = true;
      let input = $(e.target);
      let label = input.next();
      let len = input.val().trim().length;
      label.css('display', 'none');
      if (len === 0) {
        label.css('display', 'inline-block');
        verification = !verification;
      } else if (input.attr('name') === 'name' && (len < 2 || len > 10)) {
        verification = !verification;
        input.prev().css('display', 'none');
        label.css('display', 'inline-block');
      } else if (input.attr('name') === 'password' && (len < 2 || len > 20)) {
        verification = !verification;
        label.css('display', 'inline-block');
      }
    })

  $('form > button')
    .click((e) => {
      e.preventDefault();
      let inputs = $(e.target).prevAll('input');
      inputs.map((index, input) => {
        if (($(input).val().trim().length) === 0) {
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
