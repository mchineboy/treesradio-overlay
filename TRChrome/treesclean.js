var timer;
var chatfiltered = false;
var vidobserver;
var obsconfig = { attributes: true, attributeOldValue: true, childList: true, characterData: true };
var waitlisttimer;
var chatobserver;
var lockscroll = false;
var lockpos;
var sorttime = "asc";
var sortalpha = "desc";
var sortplaylist;
var maxsorts = 0;

$(function(){
   timer = setTimeout(initializeInterface, 9000);
   
});



function initializeInterface () {
    var button = $('#pagemods');
    
    if ( !button.text() ) {
        clearTimeout(timer);

        // Check to see if the person really is in the waitlist.
        
        checkWaitListStatus();
        waitlisttimer = setTimeout(checkWaitListStatus(), 1000);
        
        // Try to track changes in the chat box.

        chatobserver = setTimeout(convertImageLink, 1000);

        // Make the changes to the UI.

        $('span[class="beta-tag"]').text("βeta+secret cannapowers");

        $('<div class="btn-group"><a class="btn btn-success" id="regioncheck"><i class="fa fa-youtube"></i>&nbsp;<i class="fa fa-globe"></i>&nbsp;<i class="fa fa-check"></i></div><div class="btn-group"><a class="btn btn-success" alt="Filter chat for mentions" id="filterchat">@ <i class="fa fa-filter"></i></a></div><div class="btn-group"><a class="btn btn-danger" id="pagemods">Page Mods</a></div>').insertAfter('div.nav.navbar-nav.navbar-right');
        
        $('span[class="playlist-shuffle-btn fa fa-random fa-3x"]').before(
            
            '<div id="stime" class="btn btn-sm btn-default" title="Sort Playlist by Time"><span id="timeicon" class="fa fa-sort-amount-desc fa-3x"></span></div>' +
            '<div id="salpha" class="btn btn-sm btn-default" title="Sort Playlist by Name"><span id="nameicon" class="fa fa-sort-alpha-asc fa-3x"></span></div>'
        );
        
        // Set up events.

        $('div#chatscroll').scroll( function (c,e) { 
            lockscroll = true;
            lockpos = $(e).position;
            if ( lockpos == $(e).scrollHeight ) {
                lockscroll = false;
                console.log('unlocking scroll');
            }
        });

        $('div#stime').click(
            function (c, e) {
                maxsorts = 0;
                doThisAsync(sortPlaylist('time', 0), 500);
            }
        );

        $('div#salpha').click(
            function (c, e) {
                maxsorts = 0;
                doThisAsync(sortPlaylist('alpha', 0), 500);
            }
        );


        // Region Check Click Event
        $('#regioncheck').click(
            function () {
                
                var vidurl = $('#youtube-player-0').contents().find("link[rel='canonical']")[0].attr('href');
                console.log(vidurl);
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
                            $('div#chatscroll').scrollTop($('div#chatscroll')[0].scrollHeight);
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
var seenurl;

function convertImageLink() {
    chatobserver = setTimeout(convertImageLink, 500);
    $($('ul#chatbox li').get().reverse()).each(function(c,e){
        $(e).find('span.Linkify a').each(
            function(co,el){
                if ( co >= 5 ) return; // Limit to 5 for performance. And likely page bleed.
                var href = $(el).attr('href');

                if ( $(el).children().count > 0 && $(el).children().get(0).nodeName == 'img' ) 
                    return;

                elepos = $(e).position();
                scrolltobottom = false;
                
                if ( elepos.top > 0 && href.match(/^http(s|):\/\/i\.imgur|\.jpg$|\.gif$|\.png$|\.jpeg$/i) ) {
                    if ( lockscroll == false )
                        scrolltobottom=true;

                    if ( href.match(/gifv|mp4|webm/i) ) { 
                        // For now do nothing.
                        /*
                        newhref = href.replace(/(gifv|mp4)/i, "webm");
                        newhref = newhref.replace(/http(s|):/i,"");
                        mp4href = href.replace(/(gifv|webm)/i, "mp4");
                        mp4href = mp4href.replace(/http(s|):/i, "");

                        $(el).html('<span style="width:325px"><video style="width:325px" autoplay loop muted><source src="' + newhref + '" type="video/webm"></source><source src="'+mp4href+'" type="video/mp4"></source></video></span>')
                        */
                    } else {
                        $(el).html('<img src="' + href + '" width="325px"/>');
                    }
                }
                if ( scrolltobottom )
                    $('div#chatscroll').scrollTop($('div#chatscroll')[0].scrollHeight);
            }
        )
    });
}



function sortPlaylist(sortBy, currentIndex) {
    var $sortlist = Array();
    var $toclick = Array();
    
    maxsorts++;
   
    var eleclass = "pl-time";

    if ( sortBy == 'alpha' ) eleclass="pl-media-title";

    $('ul#playlist-ul li').each(
        function (c, e) {
            
            var tosort = $(e).find("span[class='" + eleclass +"']").text();
            var sortval = tosort;
            
            if ( sortBy == "time" ) {
                time = tosort.split(':');
                sortval = (time[0] * 60) + time[1];
            }
            
            $sortlist.push( { listindex: c, val: sortval, toclick: $(e).find("i[class='fa fa-2x fa-arrow-up pl-move-to-top']")} );
        }
    );

    if ( maxsorts > $sortlist.length ) {
        maxsorts = 0;
        return;
    }
    
    $sortlist.sort(function(a,b){ 
        if ( a.val < b.val ) return -1;
        if ( a.val > b.val ) return 1;
        return 0; });
    
    if ( ( sortBy == "time" && sorttime == "desc" ) || ( sortBy =="alpha" && sortalpha == "desc")) {
        $sortlist.reverse();
    }

    $sortlist[currentIndex].toclick.click();
    
    if ( $sortlist.length == currentIndex + 1 ) { 
        console.log("We're done sorting");
        donesorting = true;
        currentIndex = 0;
        maxsorts = 0;
        if ( sortBy == "time" ) {
            if ( sorttime == "asc" ) {
                sorttime = "desc";
                $('#timeicon').attr('class', "fa fa-sort-amount-asc fa-3x");
            } else { 
                sorttime = "asc";
                $('#timeicon').attr('class', "fa fa-sort-amount-desc fa-3x");
            }
        } else {
            if ( sortalpha == "asc" ) {
                sortalpha = "desc";
                $('#nameicon').attr('class', "fa fa-sort-alpha-asc fa-3x");
            } else {
                sortalpha = "asc";
                $('#nameicon').attr('class', "fa fa-sort-alpha-desc fa-3x");
            }
        }
        console.log("timesort: " + sorttime + " alphasort: " + sortalpha);
    } else {
        setTimeout(sortPlaylist(sortBy, currentIndex+1), 1000);
    }

}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.message);
  sendResponse("ok");
});

function doThisAsync(fn, timeout) {
    setTimeout(fn, timeout);
}