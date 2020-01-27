$(function() {
  function buildHTML(message){  
      var image = message.image? `<img class="lower-message__image" src='${message.image}'>`:"";          //三項演算子を使ってmessage.imageにtrueならHTML要素、faiseなら空の値を代入。
      var html = 
        `<div class="message", data-message-id='${message.id}'>
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
                ${image}
            </div>
         </div>`
      return html;
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
  var reloadMessages = function() {
    last_message_id = $('.message:last').data("message-id");     //ブラウザに表示されている最後のメッセージからidを取得して変数に代入
    $.ajax({
      url: "api/messages",                            //ルーティングで設定した通りのURLを指定
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}                     //キーを自分で決め（今回はid)そこに先ほど定義したlast_message_idを代入。これはコントローラーのparamsで取得される。
    })
    .done(function(messages) {                        //通信成功したら、controllerから受け取ったデータ（messages)を引数にとって以下のことを行う
      if (messages.length !== 0) {
        var insertHTML = '';                            //追加するHTMLの入れ物を作る
        $.each(messages, function(i, message) {         //取得したメッセージたちをEach文で分解
          insertHTML += buildHTML(message)              //htmlを作り出して、それを変数に代入(作り出す処理は非同期の時に作った)
        });
        $('.chat-message').append(insertHTML);             //メッセージが入ったHTMLに、入れ物ごと追加
        $('.chat-message').animate({ scrollTop: $('.chat-message')[0].scrollHeight});    //メッセージ分だけスクロールするように
        $("#new_message")[0].reset();
        $(".form__submit").prop("disabled", false);
      }
    })
    .fail(function(){
      alert('自動更新に失敗しました');
    });
  };

  if (document.location.href.match(/\/groups\/\d+\/messages/)) {      //メッセージ一覧のみ自動更新されるように
    setInterval(reloadMessages, 7000);
    }
});