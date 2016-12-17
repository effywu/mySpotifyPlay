/**
 * Created by effywu on 12/4/2016.
 */
(function(exports) {
    var g_access_token = '';
    var queryStr='';
    var user_id='';
    function getTrack(trackid,callback){
        console.log('getTrack');
        var url='https://api.spotify.com/v1/tracks/'+trackid;
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + g_access_token
            },
            success: function(r) {
                console.log('got track response', r);
                callback(r);
            },
            error: function(r) {
                callback(null);
            }
        });
    }
    exports.startSearchTracks=function () {
        // Parse the URL to get access token, if there is one.
        var hash = location.hash.replace(/#/g, '');
        var all = hash.split('&');
        var args = {};
        all.forEach(function(keyvalue) {
            var idx = keyvalue.indexOf('=');
            var key = keyvalue.substring(0, idx);
            var val = keyvalue.substring(idx + 1);
            args[key] = val;
        });
        g_access_token=args['g_access_token'];
        user_id=args['userid'];

        $('.resultWrapper').hide();
        $('#searchTagsAllPnl').hide();
        $('#searchTagsAnyPnl').hide();
        $('.addPnl').hide();

        $("input[name='searchOption']").change(function () {
            $('#result').empty();
            if (this.value=='searchRate'){
                $('#myRating').val('');
                $('#searchTagsAllPnl').hide();
                $('#searchTagsAnyPnl').hide();
                $('.resultWrapper').hide();
                $('#searchRatePnl').show();
            } else if (this.value=="searchTagsAll"){
                $("#Allcheckboxes").empty();
                $.get("http://localhost:3000/tags",function (data) {
                    data.forEach(function (tag) {
                        $("#Allcheckboxes").append('<input type="checkbox" name="allTags" value="' + tag.id + '">' + tag.name);
                    })
                });
                $('#searchRatePnl').hide();
                $('#searchTagsAnyPnl').hide();
                $('.resultWrapper').hide();
                $('#searchTagsAllPnl').show();
            } else {
                $("#Anycheckboxes").empty();
                $.get("http://localhost:3000/tags",function (data) {
                    data.forEach(function (tag) {
                        $("#Anycheckboxes").append('<input type="checkbox" name="anyTags" value="' + tag.id + '">' + tag.name);
                    })
                });
                $('#searchRatePnl').hide();
                $('#searchTagsAllPnl').hide();
                $('.resultWrapper').hide();
                $('#searchTagsAnyPnl').show();
            }
        })

        $('#searchTrack').click(function () {
            $('#result').empty();
            queryStr='';
            var btn=$('#searchRate')[0];
            if (btn.checked&&$('#myRating').val()!='') {
                var find=parseInt($('#myRating').val());
                $.get("http://localhost:3000/rates",function (data) {
                    data.forEach(function (track) {
                        var currentRate=parseInt(track.rate);
                        if (currentRate>=find){
                            getTrack(track.trackid,function (song) {
                                $('#result').append('<div class="resulttracks">' + song.name+ ' - ' + song.artists[0].name +'</div>');
                                queryStr+='spotify:track:'+track.trackid+',';
                            });
                        }
                    })

                });
                queryStr=queryStr.substr(0,queryStr-1);
                $('.resultWrapper').show();
            } else if ($('#searchTagsAll')[0].checked){
                var checkedtags = $("input[name='allTags']:checked");
                if (checkedtags.length > 0) {
                    $.get("http://localhost:3000/taggedTrack",function (data) {
                        data.forEach(function (track) {
                            var containsAll=false;
                            for (i=0;i<checkedtags.length;i++){
                                var tagsforcurrenttrack=track.tagid.split(",");
                                var tomatch=$(checkedtags[i]).val();
                                if (tagsforcurrenttrack.indexOf(tomatch)<=-1){
                                    break;
                                }
                                if (i==checkedtags.length-1){containsAll=true};
                            }
                            if (containsAll){
                                getTrack(track.trackid,function (song) {
                                    $('#result').append('<div>' + song.name+ ' - ' + song.artists[0].name + ' - ' + song.album.name +'</div>');
                                });
                                queryStr+='spotify:track:'+track.id+',';
                            }
                        });
                    });
                    queryStr=queryStr.substr(0,queryStr-1);
                    $('.resultWrapper').show();
                }
            }else if ($('#searchTagsAny')[0].checked){
                var checkedtags = $("input[name='anyTags']:checked");
                if (checkedtags.length > 0) {
                    $.get("http://localhost:3000/taggedTrack",function (data) {
                        data.forEach(function (track) {
                            var containsAny=false;
                            for (i=0;i<checkedtags.length;i++){
                                var tagsforcurrenttrack=track.tagid.split(",");
                                var tomatch=$(checkedtags[i]).val();
                                if (tagsforcurrenttrack.indexOf(tomatch)>-1){
                                    containsAny=true;
                                    break;
                                }
                            }
                            if (containsAny){
                                getTrack(track.trackid,function (song) {
                                    $('#result').append('<div>' + song.name+ ' - ' + song.artists[0].name + ' - ' + song.album.name +'</div>');
                                });
                                queryStr+='spotify:track:'+track.id+',';
                            }
                        });
                    });
                    queryStr=queryStr.substr(0,queryStr-1);
                    $('.resultWrapper').show();
                }
            }
        })
        $('body').on('click',"#addList",function (){
            if ($('#newListName').val()==''){
                alert("Error: Playlist name cannot be empty.");
            } else {
                var newname=$('#newListName').val();
                var url='https://api.spotify.com/v1/users/'+user_id+'/playlists';
                var player_id='';
                $.ajax(url, {
                    dataType: 'json',
                    type: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + g_access_token,
                        'Content-Type':'application/json'
                    },
                    data:JSON.stringify({"name":newname}),
                    success: function(r) {
                        player_id=r.id;
                    },
                }).done(function () {
                    url='https://api.spotify.com/v1/users/'+user_id+'/playlists/'+player_id+'/tracks?uris=';
                    url+=queryStr;
                    $.ajax(url, {
                        dataType: 'json',
                        type: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + g_access_token,
                            'Content-Type':'application/json'
                        },
                        success: function(r) {
                        },
                    });
                })

            }
            // var trackID=$(this).parent().attr('id');
            // var x = screen.width/2 - 500/2;
            // var y = screen.height/2 - 250/2;
            // window.open("rateTrack.html#id="+trackID+"&g_access_token="+g_access_token,"_blank","width=500,height=250,top="+y+",left="+x);
            // //$.post("http://localhost:3000/tags",{"name":"Two"},null,"json");
            // //loadTags();
            // //var trackID=$(this).parentNode["id"];
            // //alert("here");
        });
    }
})(window)/**
 * Created by effywu on 12/4/2016.
 */
