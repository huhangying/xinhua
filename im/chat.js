/**
 * Created by hhu on 2016/5/15.
 */
$(function() {
    var FADE_TIME = 150; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    var BASE_API_URL = 'http://139.224.68.92:3000/';
    var DEMO_DOCTOR_ID = '57458db10791dcb26e74cb5a';
    var DEMO_USER_ID = '57480161bcddf2c706028319';

    // Initialize variables
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box


    var $chatPage = $('.chat.page'); // The chatroom page



    // Sends msg to doctor (direction = 0)
    var sendMsgToDoctor = function() {
        var message = $inputMessage.val();

        // populate data
        $.get(BASE_API_URL + "user/" + DEMO_USER_ID,
            function(result) {
                if (!result) {
                    return console.log('get no user!');
                }

                var data = {
                    user_name: result.name,
                    user: DEMO_USER_ID,
                    doctor: DEMO_DOCTOR_ID,
                    direction: 0,
                    type: 0,
                    data: message
                };

                sendMessage(data);
            });
    }


    // Sends a chat message
    var sendMessage = function(chat) {

        // if there is a non-empty message and a send request
        if (chat.data) {
            $inputMessage.val(''); // clean text input
            addChatMessage({
                username: chat.user_name || '',
                //doctorname: chat.doctor_name || '',
                message: chat.data
            });

            console.log(JSON.stringify(chat));

            // tell server to execute 'new message' and send along one parameter
            $.ajax({
                url: BASE_API_URL + "chat/send",
                type: "POST",
                dataType: "json", // expected format for response
                contentType: "application/json", // send as JSON
                data: JSON.stringify(chat),

                success: function(result) {
                    //called when successful
                    console.log(result)
                },

                error: function() {
                    //called when there is an error
                    alert('error')
                },
            });
        }
    }


    // Adds the visual chat message to the message list
    function addChatMessage (data, options) {

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }



    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    function addMessageElement (el, options) {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }


    // Gets the color of a username through our hash function
    function getUsernameColor (username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // Focus input when clicking on the message input's border
    $inputMessage.click(function () {
        $inputMessage.focus();
    });

    $('#chatSend').click(function(){
        sendMsgToDoctor();
    });

    $inputMessage.keypress(function(e){
        if(e.keyCode==13)
            sendMsgToDoctor();
    });

});
