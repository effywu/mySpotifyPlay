/**
 * Created by effywu on 12/4/2016.
 */
(function(exports) {
    var g_access_token = '';
    var trackid='';
    function getTrack(callback){
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

    exports.startEditTags=function () {
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

        trackid=args['id'];
        g_access_token=args['g_access_token'];

        getTrack(function (song) {
            $('#trackInfo').append('<div>' + song.name+ ' - ' + song.artists[0].name + ' - ' + song.album.name +'</div>');
            // song.forEach(function (song) {
            //     var tracklabel=$('<div><button class="rateBtn">Rate</button> &nbsp' + song.track.name + ' - ' + song.track.artists[0].name + ' - ' + song.track.album.name + '	</div>');
            //     $('#'+item.name+'Tracks').append(tracklabel);
            //     tracklabel.attr('id',song.track.id);
            //     //$('#'+item.name+'Tracks').appendChild('<p>'+song.track.name+'</p>')
            // })
        });
        var previousTags="";
        $.get("http://localhost:3000/taggedTrack",function (data) {
            data.forEach(function (track) {
                if (track.trackid==trackid){
                    previousTags=track.tagid;
                }
            });
        });
        $.get("http://localhost:3000/tags",function (data) {
            data.forEach(function (tag) {
                $("#checkboxes").append('<input type="checkbox" name="tagsToTag" value="'+tag.id+'">'+tag.name);
            })
            if (previousTags!=""){
                var tags=previousTags.split(",");
                for (i=0;i<tags.length;i++){
                    var currentTag=tags[i];
                    $("input[value="+currentTag+"]").attr("checked",true);
                }
            }
        });

        $('#tagTrack').click(function () {
            var idToUpdate=-1;
            $.get("http://localhost:3000/taggedTrack",function (data) {
                data.forEach(function (track) {
                    if (track.trackid==trackid){
                        $.ajax({
                            url:"http://localhost:3000/taggedTrack/"+track.id,
                            type:'DELETE',
                            success:function (result) {
                            }
                        });
                    }
                });
            }).done(function () {
                var tagstr = "";
                var checkedtags = $("input[name='tagsToTag']:checked");
                if (checkedtags.length > 0) {
                    checkedtags.each(function () {
                        tagstr += $(this).val() + ",";
                    })
                    tagstr = tagstr.substr(0, tagstr.length - 1);
                    $.post("http://localhost:3000/taggedTrack/", {"trackid": trackid, "tagid": tagstr},function () {
                        alert("Success: You have tagged the track");
                        window.close();
                    });
                } else {
                    alert("Success: You have untagged the track");
                    window.close();
                }
            });


        })
    }
})(window)/**
 * Created by effywu on 12/4/2016.
 */
