$(function() {
  function addUser(user) {           //一致するユーザーがいた場合の処理
    let html = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">${user.name}</p>
        <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
      </div>
    `;
    $("#user-search-result").append(html);          //作ったhtmlを入れる
  }

  function addNoUser() {            //一致するユーザーがいなかった場合の処理
    let html = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">ユーザーが見つかりません</p>
      </div>
    `;
    $("#user-search-result").append(html);          //作ったhtmlを入れる
  }

  function addDeleteUser(name, id) {
    let html = `
    <div class="chat-group-user clearfix" id="${id}">
      <p class="chat-group-user__name">${name}</p>
      <div class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn" data-user-id="${id}" data-user-name="${name}">削除</div>
    </div>`;
    $(".js-add-user").append(html);
  }

  function addMember(userId){                      //ユーザーをグループに登録させるための処理
    let html =`
      <input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />`;
    $(`#${userId}`).append(html);                  //作ったhtmlを入れる
  }

  $("#user-search-field").on("keyup", function() {     //検索欄に文字入力されるたびに処理を行う
    let input = $("#user-search-field").val();         //検索欄に入力された文字をvalで取得し変数inputに代入
    $.ajax({
      type: "GET",
      url: "/users",
      data: { keyword: input },                        //keyを自分で決め(今回は"keyword"と定義)valueには先ほど検索欄から取得し代入したinputの値を使う
      dataType: "json"
    })
      .done(function(users) {
        $("#user-search-result").empty();              //if,elseどの場合においても、処理後は、すでに検索欄に出力されている情報を削除する。

        if (users.length !== 0) {                      //検索に一致するユーザーが０じゃない場合(いる場合)
          users.forEach(function(user) {
            addUser(user);
          });
        } else if (input.length == 0) {               //入力欄に文字が入力されてない場合処理を終了
          return false;
        } else {                                      //検索に一致するユーザーがいない場合はaddNoUserに飛ばす
          addNoUser();
        }
      })
      .fail(function() {
        alert("通信エラーです。ユーザーが表示できません。");
      });
  });
  
  $(document).on("click", ".chat-group-user__btn--add", function() {      //追加ボタンがクリックされた時の処理を記述する
    const userName = $(this).attr("data-user-name");                       //クリックされたところのデータを取得し各変数に代入
    const userId = $(this).attr("data-user-id");
      $(this)                                                             //クリックされたところのhtmlを親要素をごと消す（検索結果から消す）
        .parent()
        .remove();
      addDeleteUser(userName,userId);                 //削除ボタンの書いてあるhtmlを呼び出す処理に飛ばす
      addMember(userId);                              //ユーザーをグループに登録するための処理
  });
  $(document).on("click", ".chat-group-user__btn--remove", function() {
    $(this)
      .parent()
      .remove();
  });

});