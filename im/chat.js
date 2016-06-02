/**
 * Created by hhu on 2016/5/15.
 */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

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

    var userName = '';
    var doctorName = '';
    var direction = getUrlParameter('direction') == '1' ? 1 : 0;
    var init = function (){
        $.get(BASE_API_URL + "user/" + DEMO_USER_ID,
            function(result) {
                if (!result) {
                    return console.log('get no user!');
                }
                userName = result.name;
            });

        $.get(BASE_API_URL + "doctor/" + DEMO_DOCTOR_ID,
            function(result) {
                if (!result) {
                    return console.log('get no doctor!');
                }
                doctorName = result.name;
            });
    }
    init();


    var checkReqUrl = BASE_API_URL + (direction == 1 ? 'chatrooms/check/doctor/' +  DEMO_DOCTOR_ID : 'chatrooms/check/user/' + DEMO_USER_ID);

    var checkNewMsg = function() {

        // check chatroom
        $.get(checkReqUrl,
            function(chatrooms) {
                if (chatrooms && chatrooms.length > 0) {
                    //var peer = direction == 1 ? DEMO_USER_ID : DEMO_DOCTOR_ID;
                    // receive message
                    //console.log(JSON.stringify(chatrooms));
                    _.forEach(chatrooms, function(chatroom){
                        if (chatroom.user == DEMO_USER_ID && chatroom.doctor == DEMO_DOCTOR_ID) {
                            receiveMsg(chatroom._id);
                        }
                    });
                }

            });
    }

    setInterval(checkNewMsg,2000);

    var receiveMsg = function(chatroom) {
        var params = {
            chatroom: chatroom,
            direction: direction
        };

        $.ajax({
            url: BASE_API_URL + "chats/receive",
            type: "POST",
            dataType: "json", // expected format for response
            contentType: "application/json", // send as JSON
            data: JSON.stringify(params),

            success: function(chats) {
                //called when successful
                console.log(chats);
                var data = {};
                _.forEach(chats, function(chat){

                    if (direction !== chat.direction){
                        data = {
                            username: userName,
                            doctorname: doctorName,
                            message: chat.data
                        }

                        receiveChatMessage(data);
                    }

                })

            },

            error: function() {
                //called when there is an error
                alert('error')
            },
        });
    }

    // Sends a chat message
    var sendMessage = function() {

        var message = $inputMessage.val();

        // populate data
        var chat = {
            user: DEMO_USER_ID,
            doctor: DEMO_DOCTOR_ID,
            direction: direction,
            type: 0,
            data: message
        };

        // if there is a non-empty message and a send request
        if (chat.data) {
            $inputMessage.val(''); // clean text input

            addChatMessage({
                username: userName,
                doctorname: doctorName,
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

        var name = direction == 1 ? data.doctorname : data.username;
        var name_class = direction == 1 ? 'name-right' : 'name-left';

        var $usernameDiv = (direction == 1 ? $('<span class="name-right"/>') : $('<span class="name-left"/>'))
            .text(name)
            .css('color', getUsernameColor(name));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = (direction == 1 ? $('<li class="message right"/>') :  $('<li class="message"/>'))
            .data('username', name)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    // Adds the visual chat message to the message list
    function receiveChatMessage (data, options) {

        var name = !(direction == 1) ? data.doctorname : data.username;
        var name_class = !(direction == 1) ? 'name-right' : 'name-left';

        var $usernameDiv = (!(direction == 1) ? $('<span class="name-right"/>') : $('<span class="name-left"/>'))
            .text(name)
            .css('color', getUsernameColor(name));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = (!(direction == 1) ? $('<li class="message right"/>') :  $('<li class="message"/>'))
            .data('username', name)
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
        sendMessage();
    });

    $inputMessage.keypress(function(e){
        if(e.keyCode==13){
            sendMessage();
        }
    });

});
