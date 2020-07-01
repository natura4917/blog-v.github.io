

$(document).ready(function() {
    var widget = SC.Widget(document.getElementById('so'));
    var allSongs;

    widget.bind(SC.Widget.Events.READY, function() {
        // widget.play();
        console.log('Ready...');
        widget.getSounds(function(allSounds) {
            $('#display_song').text(allSounds[0]['title']);

            allSongs = allSounds;
            Audio.allSongs=allSongs;
            $.each(allSongs,function(i,d) {
		    // 예외처리
		    if(d.uri === undefined ){
			return true;    
		    }
                if (d.artwork_url == null) {
                    imageUrl = d.user.avatar_url;
                } else {
                    imageUrl = d.artwork_url;
                }
                $('.play-list').append($('<a/>', {
                    class: 'play',
                    "data-id": i,
                    "data-title": d.title,
                    "data-artist": d.user.username,
                    "data-albumart": imageUrl,
                    "data-album": '', // 없음 추후에 좋아요 수로 변경예정
                    "data-duration":d.duration
                }));

                
			$('.play-list .play').each(function(){
				var album,albumart,artist,title;
				album=$(this).data('album');
				albumart=$(this).data('albumart');
				artist=$(this).data('artist');
				title=$(this).data('title');

				album=album?'<span class="album">'+album+'</span>':'Unknown Album';
				albumart=albumart?'<img src="'+albumart+'">':'';
				artist=artist?'<span class="song-artist">'+artist+'</span>':'Unknown Artist';
				title=title?'<div class="song-title">'+title+'</div>':'Unknown Title';

				$(this).html('<div class="album-thumb pull-left">'+albumart+'</div><div class="songs-info pull-left">'+title+'<div class="songs-detail">'+artist+' - '+album+'</div></div></div>');
            });
            
            var id, album, artist, albumart, title, mp3;
            $('.play-list .play').each(function(){
                if($(this).data('id') == 0){
                    id = $(this).data('id');
                    album = $(this).data('album');
                    artist = $(this).data('artist');
                    albumart = $(this).data('albumart');
                    title = $(this).data('title');
                    mp3 = $(this).data('url');
                    Audio.load(id,album,artist,title,albumart,mp3);
                }
                $(this).on('click',function(e){
                    e.preventDefault();
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    // clearInterval(intval);
                    id = $(this).data('id');
                    album = $(this).data('album');
                    artist = $(this).data('artist');
                    albumart = $(this).data('albumart');
                    title = $(this).data('title');
                    mp3 = $(this).data('url');
                    Audio.load(id,album,artist,title,albumart,mp3);
                    widget.skip(id); //Go to last Song of playlist
                    // $('.music').prop('volume',$('.volume').val());
                    Audio.playlist.hide();
                });
            });
              
                
            });
            console.log(allSongs);
            var imageUrl = "";
            if (allSounds[0]['artwork_url'] == null) {
                imageUrl = allSongs[0]['user']['avatar_url'];
            } else {
                imageUrl = allSongs[0]['artwork_url'];
            }

            $('#display_coverart').css("background-image", 'url('+imageUrl+')'); 
            $('.current_playlist_header_item').text(allSounds[0]['user']['username'] + " PLAYLIST");
            var duration = allSounds[0]['duration'];
            var seconds = Math.floor((duration / 1000) % 60);
            var minutes = Math.floor((duration / (60 * 1000)) % 60);

            if (seconds < 10) {
                $('#display_time_total').text(minutes + ':0' + seconds);
            } else {
                $('#display_time_total').text(minutes + ':' + seconds);
            };
        });

        /*widget.getPosition(function(position) {
            console.log('position is: ' + position);
        });*/

        widget.isPaused(function(paused){
            if (paused == false){
                $('.play-pause').addClass('active');
            }
            else{
                $('.play-pause').removeClass('active');
            }
        });

        $(function(){
            var nav = $('#current_playlist');
            nav.addClass('showing');});
        $('#current_playlist').delay(500).fadeTo(1000, 1).delay(500).queue(function(){
            var nav = $('#current_playlist');
            nav.removeClass('showing').addClass('hiding');
        });
    });
    
    //EVENT PLAY
    widget.bind(SC.Widget.Events.PLAY, function() {
        console.log('Play');
        widget.isPaused(function(paused){
            if (paused == false){
                $('.play-pause').addClass('active');
            }
            else{
                $('.play-pause').removeClass('active');
            }
        });

        //SLIDER FOR PROGRESS BAR
        $(function() {
            var init = function() {
                var widget = SC.Widget(document.getElementById('so'));
                widget.getDuration(function(duration) {
                    console.log('duration: ' + duration);
                    //Create a slider 
                    //var duration = Math.round(duration / 1000);
                    $('#display_progress').noUiSlider2('init', {
                        start: [0],
                        scale: [0, duration],
                        handles: 1,
                        connect: "lower",
                        change: function() {
                            var values = $('#display_progress').noUiSlider2('value');
                            widget.getPosition(function(position) {
                                widget.seekTo(values[1]);
                            });
                        },
                    });
                });
            };
            init.call();
        });
        //Remove previous Progress Bar
        $(".noUi-midBar2").remove();
        $(".noUi-handle2").remove();
    
        var values = $('#volume_back').noUiSlider('value');
        widget.setVolume(values[1]);	
        widget.getCurrentSound(function(currentSound) {
            //console.log(currentSound);
            $('#display_song').text(currentSound['title']);
            var imageUrl = "";
            if (currentSound['artwork_url'] == null) {
                imageUrl = currentSound['user']['avatar_url'];
            } else {
                imageUrl = currentSound['artwork_url'];
            }
            $('#display_coverart').css("background-image", 'url('+imageUrl+')'); 
        });

        //display_time_total
        widget.getDuration(function(duration) {
            var seconds = Math.floor((duration / 1000) % 60);
            var minutes = Math.floor((duration / (60 * 1000)) % 60);
            if (seconds < 10) {
                $('#display_time_total').text(minutes + ':0' + seconds);
            } else {
                $('#display_time_total').text(minutes + ':' + seconds);
            };
        });

    });
    widget.bind(SC.Widget.Events.PAUSE, function() {
        console.log('Pause');
        widget.isPaused(function(paused){
            if (paused == false){
                $('.play-pause').addClass('active');
            }
            else{
                $('.play-pause').removeClass('active');
            }
        });

    })
    
    widget.bind(SC.Widget.Events.LOAD_PROGRESS, function() {
        //console.log('Loading...');
    });

    $('.play-pause').not(".active").click(function() {
        if(!$(this).hasClass("active")){
            console.log(widget);
            
            $("#display_progress").empty();
            widget.play(); 
            widget.seekTo(0);
         //widget["play"]();
     
        }else{
            widget.pause();
            // document.getElementById('display_progress').style.background = 'none';
            // $(".noUi-midBar2").remove();
            // $(".noUi-handle2").remove();
        }
       
    });
    
 
    
    $('#prev_button').click(function() {
        widget.getDuration(function(duration) {
            widget.getPosition(function(position) {
                widget.getCurrentSoundIndex(function(soundindex){
                    //display_time_count
                    var seconds = Math.floor((position / 1000) % 60);
                    var minutes = Math.floor((position / (60 * 1000)) % 60);
                    
                    if ((seconds < 5) && (minutes==0))
                    {
                        
                        if(soundindex == 0)
                        {
                            Audio.info(allSongs.length-1);
                            widget.skip(allSongs.length-1); //Go to last Song of playlist

                            widget.seekTo(0);

                        }
                        else
                        {
                            Audio.info(soundindex-1);
                            widget.prev();

                            widget.seekTo(0);

                        }
                    }
                    else
                    {
                    
                        //Go to the beginning of the song if the song has past the first 5 seconds
                        widget.seekTo(0); 
                    }
                });
            });
        });

    });
    $('#next_button').click(function() {
        widget.getCurrentSoundIndex(function(soundindex){
            Audio.info(soundindex+1);
            if (soundindex == allSongs.length-1){
                console.log("playlist  go to start")
                widget.skip(0);
                Audio.info(0);
                widget.seekTo(0);

            } else {
                widget.next();
                Audio.info(soundindex+1);
                widget.seekTo(0);

            }
        });
    });

    //SKIP To 0 Only if its the last song
    widget.bind(SC.Widget.Events.FINISH, function() {
            widget.getCurrentSoundIndex(function(soundindex){
                widget.isPaused(function(paused){
                    if ((soundindex == allSongs.length-1) && (paused == true)) {
                        console.log("playlist  go to start")
                        widget.skip(0);
                        Audio.info(0);
                    };
                });
            });
    });

    //WHILE PLAYING
    widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
        widget.getDuration(function(duration) {
            widget.getPosition(function(position) {
                //display_time_count
                var seconds = Math.floor((position / 1000) % 60);
                var minutes = Math.floor((position / (60 * 1000)) % 60);
                if (seconds < 10) {
                    $('#display_time_count').text(minutes + ':0' + seconds);
                } else {
                    $('#display_time_count').text(minutes + ':' + seconds);
                };

                if ((seconds<=1)&&(minutes===0)) {				
                    var values = $('#volume_back').noUiSlider('value');
                    widget.setVolume(values[1]);
                    widget.getCurrentSound(function(currentSound) {
                        //console.log(currentSound);
                        $('#display_song').text(currentSound['title']);
                        var imageUrl = "";
                        if (currentSound['artwork_url'] == null) {
                            imageUrl = currentSound['user']['avatar_url'];
                        } else {
                            imageUrl = currentSound['artwork_url'];
                        }
                        $('#display_coverart').css("background-image", 'url('+imageUrl+')'); 
                    });
                    
                    //display_time_total
                    widget.getDuration(function(duration) {
                        var seconds = Math.floor((duration / 1000) % 60);
                        var minutes = Math.floor((duration / (60 * 1000)) % 60);
                        if (seconds < 10) {
                            $('#display_time_total').text(minutes + ':0' + seconds);
                        } else {
                            $('#display_time_total').text(minutes + ':' + seconds);
                        };
                    });
                }
                
                if (position==0) {
                    document.getElementById('display_progress').style.background = 'url("images/progress.gif") repeat-x scroll 0 0 #333333';
                } else if (position>0) {
                    document.getElementById('display_progress').style.background = 'none';
                }

                $("#display_progress").noUiSlider2('move', {
                    // moving the knob selected in the dropdown...
                    scale: [0, duration],
                    // to the position in the input field.
                    to: position
                })
            });
        });
    });
});

var Audio = {
    allSongs:{},
    info:function(id){
        var this2 = $(".play-list .play").eq(id);
        id = $(this2).data('id');
        album = $(this2).data('album');
        artist = $(this2).data('artist');
        albumart = $(this2).data('albumart');
        title = $(this2).data('title');
        mp3 = $(this2).data('url');
        this.load(id,album,artist,title,albumart,mp3);
    },
    load:function(id,album,artist,title,albumart,mp3){
        var currentTrack;
        var totalTrack=this.allSongs.length-1;
        totalTrack = $('.play-list>a').length;
        currentTrack = $('.play-list a').index($('.play-list .active'))+1;
        $('.play-position').text((id+1)+' / '+totalTrack);
        albumart=albumart?'<img src="'+albumart+'">':''; 
        album=album?album:'Unknown Album';
        title=title?title:'Unknown Title';
        artist=artist?artist:'Unknown Artist';
        $('.album-art').html(albumart);
        $('.current-info .song-album').html('<i class="fa fa-music"></i> '+album);
        $('.current-info .song-title').html('<i class="fa fa-headphones"></i> '+title);
        $('.current-info .song-artist').html('<i class="fa fa-user"></i> '+artist);
    },
    playlist:{
		show:function(){
			$('.play-list').fadeIn(500);
			$('.toggle-play-list').addClass('active');
			$('.album-art').addClass('blur');
		},
		hide:function(){
			$('.play-list').fadeOut(500);
			$('.toggle-play-list').removeClass('active');
			$('.album-art').removeClass('blur');
		}
    }
}



$(document).ready(function() {
    //first hide #scroll to top
    // hide #back-top first
    $("#top_button").hide();

    $('.toggle-play-list').on('click',function(e){
        e.preventDefault();
        var toggle = $(this);
        if(toggle.hasClass('active')){
            Audio.playlist.hide();
        }else{
            Audio.playlist.show();
        }
    });

  

    //SLIDER FOR VOLUME_BACK
    $(function() {
        var oldVolume=100;
        var init = function() { /* Create a slider */
            $('#volume_back').noUiSlider('init', {
                start: [100],
                scale: [0, 100],
                handles: 1,
                connect: "lower",
                change: function() {
                    var values = $(this).noUiSlider('value');
                    var widget = SC.Widget(document.getElementById('so'));
                    widget.getVolume(function(volume) {
                        widget.setVolume(values[1]);
                     
                        //console.log('current volume value is ' + volume);
                        oldVolume = values[1];
                        //console.log('OLD VOLUME:' + oldVolume);
                        if (values[1] > 0) $("#volume_speaker").attr("class", "volume_on");
                        else if ((values[1] <= 50) && (values[1] >= 1)) $("#volume_speaker").attr("class", "volume_middle");
                        else $("#volume_speaker").attr("class", "volume_off");
                    });
                },
            });
        };
        init.call();
        
        //ON/OFF SPEAKER BUTTON
        $('#volume_speaker').bind("click", function() {
            var widget = SC.Widget(document.getElementById('so'));
            widget.getVolume(function(volume) {
                var values = $('#volume_back').noUiSlider('value');
                if (values[1] > 0) {
                    $('#volume_back').noUiSlider('move', {
                        // moving the knob selected in the dropdown...
                        scale: [0, 100],
                        // to the position in the input field.
                        to: 0
                    })
                    //VOLUME OFF IN SOUNDCLOUD    
                    widget.setVolume(0);
                    $('#volume_speaker').attr("class", "volume_off");
                } else {
                    if ((oldVolume>0) && (oldVolume<=50)) {
                        widget.setVolume(oldVolume/100);			
                        $("#volume_speaker").attr("class", "volume_middle");
                        $("#volume_back").noUiSlider('move', {
                            // moving the knob selected in the dropdown...
                            scale: [0, 100],
                            // to the position in the input field.
                            to: oldVolume
                        });
                    } else if (oldVolume>50) {
                        widget.setVolume(oldVolume/100);			
                        $("#volume_speaker").attr("class", "volume_on");
                        $("#volume_back").noUiSlider('move', {
                            // moving the knob selected in the dropdown...
                            scale: [0, 100],
                            // to the position in the input field.
                            to: oldVolume
                        });
                    } else if (oldVolume==0) {
                        $("#volume_back").noUiSlider('move', {
                            // moving the knob selected in the dropdown...
                            scale: [0, 100],
                            // to the position in the input field.
                            to: 100
                        });
                        $("#volume_speaker").attr("class", "volume_on");
                        widget.setVolume(1);
                    }
                }
            });
        });
    });
});
