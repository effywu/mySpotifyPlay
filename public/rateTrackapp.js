/**
 * Created by effywu on 12/4/2016.
 */
(function(exports) {
    var g_access_token = '';
    var trackid='';
    var previousRate=-1;
    var previousID=-1;
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
    exports.startRateTrack=function () {
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
            $.get("http://localhost:3000/rates",function (data) {
                data.forEach(function (rate) {
                    if (rate.trackid==trackid){
                        $("#myRating").val(parseInt(rate.rate));
                        previousRate=parseInt(rate.rate);
                        previousID=rate.id;
                    }
                });
            })
            // song.forEach(function (song) {
            //     var tracklabel=$('<div><button class="rateBtn">Rate</button> &nbsp' + song.track.name + ' - ' + song.track.artists[0].name + ' - ' + song.track.album.name + '	</div>');
            //     $('#'+item.name+'Tracks').append(tracklabel);
            //     tracklabel.attr('id',song.track.id);
            //     //$('#'+item.name+'Tracks').appendChild('<p>'+song.track.name+'</p>')
            // })
        });
        
        $('#rateTrack').click(function () {
            var myrating=$("input[name='rate']").val();
            if (myrating!='') {
                myrating=parseInt(myrating);
                if (previousRate!=myrating){
                    if (previousRate!=-1){
                        $.ajax({
                            url:"http://localhost:3000/rates/"+previousID,
                            type:'DELETE',
                            success:function (result) {
                            }
                        });
                    };
                    $.post("http://localhost:3000/rates", {'trackid': trackid, "rate": myrating}, null, "json");

                }
                alert("Success: You have rated the track");
                //window.opener.location.reload(true);
                window.close();

            };


        })
    }
})(window)/**
 * Created by effywu on 12/4/2016.
 */
