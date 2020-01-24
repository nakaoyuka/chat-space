$(function() {
  function buildHTML(message){
    if (message.image){
      var html = 
        `<div class="message">
          <div class="upper-message">
            <div class="upper-message__user-name">
              ${message.user_name}
            </div>
            <div class="upper-message__date">
              ${message.created_at}
            </div>
         </div>
            <div class="lower-message">
              <p class="lower-message__content">
                ${message.content}
              </p> 
                <img class="lower-message__image" src="${message.image}">
            </div>
         </div>`
      return html;
    }
    else {
      var html =
      `<div class="message">
      <div class="upper-message">
        <div class="upper-message__user-name">
          ${message.user_name}
        </div>
        <div class="upper-message__date">
          ${message.created_at}
        </div>
     </div>
        <div class="lower-message">
          <p class="lower-message__content">
            ${message.content}
          </p>     
        </div>
     </div>`
     return html;
    };
  }

  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data) {
      var html = buildHTML(data);
      $('.chat-message').append(html);
      $('.chat-message').animate({ scrollTop: $('.chat-message')[0].scrollHeight});
      $('#new_message')[0].reset();
      $('.submit-btn').attr('disabled',false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
  });
  })
});