var timer;
var chatfiltered = false;

$(function(){
   console.log("Trying to add button.");
   timer = setTimeout(addPageModButton, 6000);
});

function addPageModButton () {
    var button = $('#pagemods');
    console.log(button);
    if ( !button.innerText ) {
        clearTimeout(timer);
        console.log("adding button now");
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
                                        console.log(thistext);
                                        $(e).show('fast');
                                    }
                                }
                            );
                        }
                    }
                );
                $("ul#chatbox").animate({ scrollTop: $('ul#chatbox').offset().bottom }, 500);
                if ( chatfiltered ) {
                    chatfiltered = false;
                } else {
                    chatfiltered = true;
                }
            }
        );
        $('#pagemods').click(
            function () {
                console.log("Trying to page.");
                
                var chat = $('#chatinput').val();

                $('div.show-ousers-btn.col-lg-3').click();

                console.log($('ul[class="users-list"] li span').each(
                    function(c, e) {
                        var thisclass = $(e).attr("class");
                        console.log(e);
                        if ( thisclass.match(/mod|owner|admin/i) ) {
                            console.log(chat);
                            chat = chat + "@" + e.innerText + " ";
                        }
                    }
                ));

                $('div.show-chat-btn.col-lg-3').click();
                console.log(chat);
                $('#chatinput').val(chat);
                $('#chatinput').focus();
            }
        )
     } else {
        clearTimeout(timer);
        console.log("Trying again");
        timer = setTimeout(addPageModButton, 1000);
    }
}
