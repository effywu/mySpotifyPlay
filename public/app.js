/*
 *  Starter code for University of Waterloo CS349 Fall 2016.
 *  
 *  bwbecker 20161113
 *  
 *  Some code adapted from https://github.com/possan/playlistcreator-example
 */
"use strict";

// An anonymous function that is executed passing "window" to the
// parameter "exports".  That is, it exports startApp to the window
// environment.
(function(exports) {
	var client_id = '9efd54703eee4f829e078d52b2491808';		// Fill in with your value from Spotify
	var redirect_uri = 'http://localhost:3000/index.html';
	var g_access_token = '';
	var user_id='';

	/*
	 * Get the playlists of the logged-in user.
	 */
	function getPlaylists(callback) {
		console.log('getPlaylists');
		var url = 'https://api.spotify.com/v1/me/playlists';
		$.ajax(url, {
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + g_access_token
			},
			success: function(r) {
				console.log('got playlist response', r);
				callback(r.items);
			},
			error: function(r) {
				callback(null);
			}
		});
	}

	function getTracks(id,callback){
		console.log('getTracks');
		var url='https://api.spotify.com/v1/users/'+user_id+'/playlists/'+id+'/tracks';
		$.ajax(url, {
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + g_access_token
			},
			success: function(r) {
				console.log('got playlist tracks response', r);
				callback(r.items);
			},
			error: function(r) {
				callback(null);
			}
		});
	}

	function getUserID(callback) {
		var url='https://api.spotify.com/v1/me';
		$.ajax(url, {
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + g_access_token
			},
			success: function(r) {
				console.log('got user info response', r);
				callback(r);
			},
			error: function(r) {
				callback(null);
			}
		});
	}
	/*
	 * Redirect to Spotify to login.  Spotify will show a login page, if
	 * the user hasn't already authorized this app (identified by client_id).
	 * 
	 */
	var doLogin = function(callback) {
		//var scope="playlist-modify-public";
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private playlist-modify-public' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);

		console.log("doLogin url = " + url);
		window.location = url;
	}

	function loadTags(){
		$('#tags').empty();
		//$("#tags").append('<div class="currenttags">'+'Current tags: '+'</div>');
		$.get("http://localhost:3000/tags",function (data) {
			data.forEach(function (tag) {
				$("#tags").append('<div class="mytag">'+tag.name+'</div>');
			})
		})
	}

	function loadTracks(items) {
		$('#playlists').empty();
		items.forEach(function(item){
			var playlist=$('<li>' + item.name + '&nbsp&nbsp&nbsp<button class="expand">'+'...'+'</button>'+'</li>');
			//playlist.attr('id',item.name);
			playlist.attr('id',item.id);
			playlist.attr('class','lists');
			$('#playlists').append(playlist);
			var tracks=$('<div>'+'</div>');
			tracks.attr('id',item.id+'Tracks');

			$('#'+item.id).after(tracks);
			getTracks(item.id,function (songs) {
				songs.forEach(function (song) {
					var tracklabel=$('<div class="trackInLists"><button id="deleteTrack">Delete</button>&nbsp<button class="editTag">Edit Tag</button>&nbsp<button class="rateBtn">Rate</button> &nbsp' + song.track.name + ' - ' + song.track.artists[0].name + '</div>');
					$('#'+item.id+'Tracks').append(tracklabel);
					tracklabel.attr('id',song.track.id);
					//$('#'+item.id+'Tracks').appendChild('<p>'+song.track.name+'</p>')
				})

			})
			$('#'+item.id+'Tracks').hide();
			$('#'+item.id).click(function () {
				if ($('#'+item.id+'Tracks').is(':visible')){
					//alert("hide tracks!");
					$('#'+item.id+' .expand').removeClass("selected");
					$('#'+item.id+'Tracks').hide();
				} else {
					//alert("show tracks!");
					if (!$('#'+item.id+' .expand').hasClass("selected")){
						$('#'+item.id+' .expand').addClass("selected");
					}
					$('#'+item.id+'Tracks').show();

				}
				//alert("hello");
			});
		});
	}

	/*
	 * What to do once the user is logged in.
	 */
	function loggedIn() {
		$('#login').hide();
		$('#loggedin').show();
		getUserID(function (data) {
			user_id=data.id;
			$('#helloInfo').text("Hello "+user_id+"!");
		});


		getPlaylists(function(items) {
			console.log('items = ', items);
			loadTracks(items);
		});

		loadTags();
		$('#editTagPnl').hide();
		$('#add').click(function () {
			var x = screen.width/2 - 300/2;
			var y = screen.height/2 - 200/2;
			window.open("addTag.html","_blank","width=300,height=200,top="+y+",left="+x);
			//$.post("http://localhost:3000/tags",{"name":"Two"},null,"json");

		});
		$('#delete').click(function () {
			var x = screen.width/2 - 300/2;
			var y = screen.height/2 - 200/2;
			window.open("deleteTag.html","_blank","width=300,height=200,top="+y+",left="+x);
			//$.post("http://localhost:3000/tags",{"name":"Two"},null,"json");

		});

		$('#search').click(function () {
			var x = screen.width/2 - 700/2;
			var y = screen.height/2 - 500/2;
			window.open("searchTracks.html#g_access_token="+g_access_token+"&userid="+user_id,"_blank","width=700,height=500,top="+y+",left="+x);
			//$.post("http://localhost:3000/tags",{"name":"Two"},null,"json");
		})

		$('body').on('click',".rateBtn",function (){
			var trackID=$(this).parent().attr('id');
			var x = screen.width/2 - 500/2;
			var y = screen.height/2 - 250/2;
			window.open("rateTrack.html#id="+trackID+"&g_access_token="+g_access_token,"_blank","width=500,height=250,top="+y+",left="+x);
			//$.post("http://localhost:3000/tags",{"name":"Two"},null,"json");
			//loadTags();
			//var trackID=$(this).parentNode["id"];
			//alert("here");
		});

		$('body').on('click',".editTag",function (){
			var trackID=$(this).parent().attr('id');
			var x = screen.width/2 - 500/2;
			var y = screen.height/2 - 250/2;
			window.open("editTags.html#id="+trackID+"&g_access_token="+g_access_token,"_blank","width=500,height=250,top="+y+",left="+x);
			//$.post("http://localhost:3000/tags",{"name":"Two"},null,"json");
			//loadTags();
			//var trackID=$(this).parentNode["id"];
			//alert("here");
		});

		$('body').on('click',"#deleteTrack",function (){
			var trackID=$(this).parent().attr('id');
			var player_id=$(this).parent().parent().prev().attr('id');
			var url='https://api.spotify.com/v1/users/'+user_id+'/playlists/'+player_id+'/tracks';
			$.ajax(url, {
				dataType: 'json',
				type: 'DELETE',
				headers: {
					'Authorization': 'Bearer ' + g_access_token,
					'Content-Type':'application/json'
				},
				data:JSON.stringify({"tracks":[{"uri":"spotify:track:"+trackID}]}),
				success: function(r) {
					alert("You have deleted the track.");
					getPlaylists(function(items) {
						loadTracks(items);
					});
				},
			});
			//this.reload();
		});

		$('#myplaylists').click(function () {
			$('#mytags').removeClass("selected");
			if (!$('#myplaylists').hasClass("selected")){
				$('#myplaylists').addClass("selected");
				$('#editTagPnl').hide();
				$('#playlists').show();
			}
		})
		$('#mytags').click(function () {
			$('#myplaylists').removeClass("selected");
			if (!$('#mytags').hasClass("selected")){
				$('#mytags').addClass("selected");
				$('#playlists').hide();
				$('#editTagPnl').show();
			}

		});


		// Post data to a server-side database.  See 
		// https://github.com/typicode/json-server
		var now = new Date();
		$.post("http://localhost:3000/demo", {"msg": "accessed at " + now.toISOString()}, null, "json");
	}

	/*
	 * Export startApp to the window so it can be called from the HTML's
	 * onLoad event.
	 */
	exports.startApp = function() {
		console.log('start app.');

		console.log('location = ' + location);

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
		console.log('args', args);

		if (typeof(args['access_token']) == 'undefined') {
			$('#start').click(function() {
				doLogin(function() {});
			});
			$('#login').show();
			$('#loggedin').hide();
		} else {
			g_access_token = args['access_token'];
			loggedIn();
		}
	}

})(window);
