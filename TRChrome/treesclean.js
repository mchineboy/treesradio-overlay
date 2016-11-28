var timer;
var chatfiltered = false;

$(function(){
   timer = setTimeout(addPageModButton, 9000);
   
});

function addPageModButton () {
    var button = $('#pagemods');
    
    if ( !button.text() ) {
        clearTimeout(timer);
        $('span[class="beta-tag"]').text("βeta+secret cannapowers");

        $('<div class="btn-group"><a class="btn btn-success" alt="Filter chat for mentions" id="filterchat">@ <i class="fa fa-filter"></i></a></div><div class="btn-group"><a class="btn btn-danger" id="pagemods">Page Mods</a></div>').insertAfter('div.nav.navbar-nav.navbar-right');
        
        $('#filterchat').click(
            function() {
                var $username = "@" + $('#username').text();
                var regex = new RegExp( $username, 'i' );
                $('ul#chatbox li').each(
                    function (c, e) {
                        if ( chatfiltered ) {
                            $(e).show('fast');
                            
                        } else {
                            $(e).hide('fast');
                            $(e).find('span').each(
                                function () {
                                    var thistext = $(this).text();
                                    
                                    if ( thistext.match(regex) ) {
                                        $(e).show('fast');
                                    }
                                }
                            );
                        }
                    }
                );
                $('div#chatscroll').scrollTop($('div#chatscroll')[0].scrollHeight);
                
                if ( chatfiltered ) {
                    chatfiltered = false;
                } else {
                    chatfiltered = true;
                }
            }
        );
        $('#pagemods').click(
            function () {
                
                var chat = $('#chatinput').val();

                $('div.show-ousers-btn.col-lg-3').click();

                $('ul[class="users-list"] li span').each(
                    function(c, e) {
                        var thisclass = $(e).attr("class");
                        if ( thisclass.match(/mod|owner|admin/i) ) {
                            chat = chat + "@" + e.innerText + " ";
                        }
                    }
                );

                $('div.show-chat-btn.col-lg-3').click();
                $('#chatinput').val(chat);
                $('#chatinput').focus();
            }
        )
     } else {
        clearTimeout(timer);
        timer = setTimeout(addPageModButton, 5000);
    }
}
