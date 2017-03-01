$(() => {
  console.log('nav page document over.');
  $('.login').hover(() => {
    $('ul').slideToggle();
  }, () => {
    $('ul').slideToggle();
  })
})
