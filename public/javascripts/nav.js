$(() => {
  console.log('nav page document over.');
  $('.login').hover(() => {
    $('ul').slideToggle();
  }, () => {
    $('ul').slideToggle();
    })

  $('#search').click((e) => {
    let text = $('[name=key]').val().trim();
    let target = $(e.target);
    if (text) {
      window.location = `/search.html?key=${text}`;
    }
  })

  $(document).keydown((e) => {
    if (e.which && e.which === 13) {
      $('#search').click();
    }
  })
})
