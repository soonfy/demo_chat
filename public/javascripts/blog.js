$(() => {
  console.log('blog page document over.');
  $('.post').click(() => {
    let tags = $('[contenteditable="true"]');
    let data = {
      title: $(tags[0]).text().trim() || '',
      summary: $(tags[1]).text().trim() || '',
      key: $(tags[2]).text().trim() || '',
      content: $(tags[3]).text().trim() || ''
    };
    $.ajax({
      type: 'POST',
      url: '/post.html',
      data,
      success: (data, status, xhr) => {
        console.log(data);
        window.location = '/blog.html';
      }
    });
  })
})
