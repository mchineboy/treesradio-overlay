var timer;
var chatfiltered = false;
var vidobserver;
var obsconfig = { attributes: true, attributeOldValue: true, childList: true, characterData: true };
var waitlisttimer;

$(function(){
   timer = setTimeout(initializeInterface, 9000);
   
});

function initializeInterface () {
    var button = $('#pagemods');
    
    if ( !button.text() ) {
        clearTimeout(timer);
        // Check to see if the person really is in the waitlist.
        
        checkWaitListStatus();
        waitlisttimer = setTimeout(checkWaitListStatus(), 60000);
        
        // This doesn't work because I cannot detect the iframe change. 
        // Need to talk to Gryph
        var iframe = $('div.reactplayer')[0];
        
        vidobserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                console.log(mutation);
            });
        });
        
        vidobserver.observe(iframe, obsconfig);
        
        // Make the changes to the UI.

        $('span[class="beta-tag"]').text("βeta+secret cannapowers");

        $('<div class="btn-group"><a class="btn btn-success" id="regioncheck"><i class="fa fa-youtube"></i>&nbsp;<i class="fa fa-globe"></i>&nbsp;<i class="fa fa-check"></i></div><div class="btn-group"><a class="btn btn-success" alt="Filter chat for mentions" id="filterchat">@ <i class="fa fa-filter"></i></a></div><div class="btn-group"><a class="btn btn-danger" id="pagemods">Page Mods</a></div>').insertAfter('div.nav.navbar-nav.navbar-right');
        
        // Set up events.

        // Region Check Click Event
        $('#regioncheck').click(
            function () {
                var vidurl = $('iframe#youtube-player-0').attr("src").match(/\/embed\/(.*?)\?/);
                window.open("https://polsy.org.uk/stuff/ytrestrict.cgi?ytid=" + vidurl[1]);
            }
        );

        // Filter Chat Click Event
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

        // Page Mods Click Event.

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
        timer = setTimeout(initializeInterface, 5000);
    }
}

// When initializing, check to see if we're falsely in the waitlist.
// If we fall off the waitlist, make sure that we rejoin the waitlist.
var clickwait;

function checkWaitListStatus() {
    var waitliststatus = $('div.join-waitlist div.join-waitlist-pressed').text();

    if ( waitliststatus && waitliststatus != "Leave Waitlist" )
        return;

    $('div.show-waitlist-btn.col.lg-3').click();
    var inwaitlist = false;
    $('ul.waitlist-list li').each(
        function (c, e) {
            var name = $(e).find('span.waitlist-name')[0].text();
            if ( name == $('span#username').text() ) {
                inwaitlist = true;
            }
        }
    );
    if ( !inwaitlist ) {
        $('div.join-waitlist.join-waitlist-pressed').click();
        
        clickwait = setTimeout(letsJoinWaitlist, 2000);
    }
}

function letsJoinWaitlist() {
    clearTimeout(clickwait);
    $('div.join-waitlist').click();

}