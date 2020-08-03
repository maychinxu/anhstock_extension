window.Util_ = window.Util_ || (function($){
	
	var exports = {};
	
	exports.getPage = function(options, success, error){
		chrome.runtime.sendMessage({
			action: 'xhttp',
			options: options
		}, function(ret) {
			if (!ret || !!ret.error) {
				!!error && error(ret ? ret.error : null);
			} else {
				success(ret.text);
			}
		});
	}

	exports.getJSON = function(options, success, error){
		exports.getPage(options, function(text){
			success(JSON.parse(text));
		}, error);
	}

	exports.tryParseJSON = function(text, df) {
		var ret = null;
		try {
			ret = JSON.parse(text);
		} catch (e) {
			console.log(e);
		}

		return ret || df;
	}

	exports.insertClip = function(useIframe, clipSrc, $target, options) {
		if (!!useIframe) {
			$("<iframe allowfullscreen frameborder='0' scrolling='no' style='width:640px;height:360px;margin-left:-16px' />")
			.attr("src", clipSrc).prependTo($target);
		} else {
			$("<video controls style='width:640px;height:360px' />") // set width/height to anti-splash
				.attr(options || {})
				.append($("<source />")
				.on("error", function(){
					var $p = $("<p />").addClass("caption_");
					var $error = $("<span />").text("Không xem được clip? ");
					var $a = $("<a />").text("Mở trong tab mới")
					.attr({
						"href": clipSrc,
						"rel": "noreferrer"})
					.css({
						"text-decoration": "underline",
						"color": "#c00"
					});
					$target.append($p.append($error).append($a));
				})
				.attr("src", clipSrc))
				.prependTo($target);
		}
		
		return $target;
	}
	
	exports.clip = function($content){
		exports.doClip($content, "div[type='VideoStream']", null, "data-src", "div", "img, a", true);
	}

	exports.clipGenk = function($content) {
		exports.doClip($content, "div[type='VideoStream']", null, "data-vid", "div", "img, a", false, "http://hls.mediacdn.vn/");
	}
	
	exports.doClip = function($content, anchor, src, srcAttr, target, thumbnail, useIframe, srcDomain){
		// now check for embeded video
		$content.find(anchor).each(function(){
			var $anchor = $(this);
			
			var $src = $anchor;
			!!src && ($src = $src.find(src));
			var clipSrc = $src.attr(srcAttr);
			
			if (!clipSrc) return;

			clipSrc = ((srcDomain || '') + clipSrc).replace("http://", "https://");
			
			var $target = $anchor;
			!!target && ($target = $target.find(target).first());
			
			// remove the thumbnail if any
			!!thumbnail && $anchor.find(thumbnail).remove();
			
			// add video
			exports.insertClip(useIframe, clipSrc, $target);
		});
	}
	
	exports.clipVNExpress = function($content){
		//https://video.vnexpress.net/parser.html?id=166960&t=2
		// now check for embeded video
		$content.find("div[data-component-type='video']").each(function(){
			var clipID = $(this).attr("data-component-value");
			var clipType = $(this).attr("data-component-typevideo");
			var clipSrc = "https://video.vnexpress.net/parser.html?id=" + clipID + "&t=" + clipType;
			var useIframe = true;
			var $clipDiv = $(this).closest("div");
			// remove the thumbnail if any
			$clipDiv.parent().find("img, a").remove();
			// add video
			exports.insertClip(useIframe, clipSrc, $clipDiv);
		});
	}
	
	exports.waitForEl = function(selector, timeOut, callback, timeOutCallBack) {
		if (timeOut < 0) {
			!!timeOutCallBack && timeOutCallBack();
			return null;
		}
		
		var el = document.querySelector(selector);
		if (!!el) {
			callback(el);
		} else {
			setTimeout(function() {
				exports.waitForEl(selector, timeOut - 100, callback, timeOutCallBack);
			}, 100);
		}
	}
	
	exports.query = function(url){
		var query = {};
		var a = (url.indexOf("?") >= 0 ? url.split("?", 2)[1] : url).split('&');
		for (var i = 0; i < a.length; i++) {
				var b = a[i].split('=');
				query[decodeURIComponent(b[0]).toLowerCase()] = decodeURIComponent(b[1] || '');
		}
		
		return query;
	}
	
	exports.showImageBox = function(src){
		var $b = $("#image-box_");
		if ($b.length === 0){
			$b = $("<div />").attr("id", "image-box_").appendTo("body");
		}
		
		$b.css("background-image", "none").on("click wheel", function(){
				$(this).fadeOut("fast");
				/*
				$("body").css({
					"overflow":"visible",
					"height":"auto"
				});
				*/
		}).fadeIn();
		/*
		$("body").css({
			"overflow":"hidden",
			"height":"100%"
		});
		*/
		
		$("<img />").on("load", function(){
			var size = "auto";
			if (this.naturalHeight > $b.height()) {
				size = "contain";
			}
			$b.css({
				"background-image": "url(" + src + ")",
				"background-size": size
			});
		}).attr("src", src);
	}

	exports.getStockID = function(value, site) {
		var id = '';
		if(value.match(/fbclid/)){
			value = value.replace(/\?fbclid=(.*?)$/g,"");
		}

		if(site=="storyblocks" || site=="videoblocks" || site=="audioblocks"||site=="soundsnap" || site=="alamy"){
			if( value.match(/http:/gi) || value.match(/https:/gi))
			{
				var res = value.split("/");
				// id = res[4];
				id = res[res.length - 1];

				if(site=="storyblocks" || site=="audioblocks"){
					var res2 = id.split(".html");
					id = res2[0];
				}else if(site=="soundsnap"){
					var res = value.split("/");
					id = res[res.length-1];
				} else if(site=="alamy"){
					var res2 = value.split(".html");
					id = res2[0];
					var regex = /\d[0-9]{3,10}/g;
					var matches = id.match(regex);
					if(matches){
						 id = matches[matches.length-1];
					}
				}
			}else if(value.match(/www/gi)){
				var res = value.split("/");
				id = res[2];
				if(site=="storyblocks"||site=="audioblocks" || site=="alamy"){
					var res2 = id.split(".html");
					id = res2[0];
				}
			}else {
				id = value;
			}
		}else if(site=="thinkstockphotos"){
			if( value.match(/http:/gi))
			{
				var res = value.split("/");
				id = res[5];
			}else {
				id = value;
			}
		}
		else if(site=="istockphoto"){
			if( value.match(/http:/gi) || value.match(/https:/gi))
			{
				var regex = /-gm(.*)-/gi;
				match = regex.exec(value);
				if(match){
					id = match[1];
				}
			}else {
				id = value;
			}
		}else if(site=="fotosearch"){
			if( value.match(/http:/gi) || value.match(/https:/gi))
			{
				var res = value.split("/");
				id = res[res.length-2];
				id  = id.replace('k','');
			}else {
				id = value;
			}
			id  = id.replace('k','');
		}
		else if(site=="envatoelements"){
			if( value.match(/http:/gi) || value.match(/https:/gi))
			{
				var res = value.split("-");
				id = res[res.length-1];
			}else {
				id = value;
			}
		}
		else if(site=="123rf"){
			var regex = /\d[0-9]{4,10}/gi;
			match = regex.exec(value);
			if(match){
				 id = match[0];
			}
		}else {
			// Normal Site
			var regex = /-\d[0-9]{3,10}\?st/gi;
			match = regex.exec(value);
			// id anh st
			if(match){
				 id = match[0];
				id  = id.replace('-','');
				id  = id.replace('?st','');
				// alert(id);
			}else {
				var regex = /\d[0-9]{3,10}/g;
				var matches = value.match(regex);
				// id anh st
				if(matches){
					 id = matches[matches.length-1];
					// alert(id);
				}
			}
		}

		return id;

	}
	
	exports.shouldExpand = function(){
		// there's hash -> came from noti/reply/mention
		// -> should not expand
		if (!!window.location.hash && (window.location.hash != "#c0-form")) {
			return false;
		}
		
		var commentCount = $(".V2-comments .V2-comment-item").length;
		
		// no comment to read -> should expand
		if (commentCount === 0){
			return true;
		}
		
		// I voted the post here -> should not expand
		if ($(".V2-link-voter-list a.user-link[href$='/" + PageInfo_.user + "']").length > 0){
			return false;
		}
		
		// I made comment here -> should not expand
		if ($(".V2-comments .V2-comment-item .V2-comment-header a[href$='/" + PageInfo_.user + "']").length > 0){
			return false;
		}
		
		// I liked a comment, or there's comment with 6+ likes
		$(".V2-comment-vote .counter[voters]").each(function(){
			if (parseInt($(this).text()) >= 6) return false;
			
			// Jean_Reno<br />domain<br />Jen0504<br />thinker<br />bellatrix<br />và 5 người khác...
			var voters = $(this).attr("voters").split("<br />");
			if (voters.indexOf(PageInfo_.user) >= 0) {
					return false;
				}
		});
		
		// Loadding too slow, I scrolled -> should not expand
		if ($(window).scrollTop() + 50 >= $("#qvLink_").offset().top) {
			return false;
		}

		// shown once -> should not expand
		var list = localStorage["qv_.viewedList"] || "";
		if (list.indexOf(PageInfo_.linkID) >= 0) {
			return false;
		}

		// It is short -> let's expand
		// Note: because images might not finish loading -> length is not very accurate
		if ($("#qvDiv_").height() <= 640) {
			return true;
		}
		
		// It is long -> expand depend on number of comments
		return (commentCount < 5);
	}

	exports.bytesToSize = function (bytes) {
		if(bytes == 0) return '0 Byte';
		var k = 1000;
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	}
	
	/*
	exports.extractDate = function($date, site){
		var result = {};
		
		var dateObj = null;
		var dateText = null;
		if (!!$date) {
			if (!site.dateAttr){
				dateText = $date.text();
				result.text = dateText;
			} else {
				dateText = $date.attr(site.dateAttr);
				var parsedDate = Date.parse(dateText);
				var dateString = dateText;
				if (!isNaN(parsedDate)) {
					dateObj = new Date(parsedDate);
					dateString = dateObj.toLocaleString();
				}
				result.text = dateString;
			}
		}
		
		if (!dateObj && !!dateText) {
			var dateMatches = dateText.match(/([0-3]\d?)(?:\/|-)(\d\d?)(?:\/|-)((?:19|20)\d\d)/);
			if (!!dateMatches && dateMatches.length === 4){
				dateObj = new Date(dateMatches[3],dateMatches[2]-1,dateMatches[1])
			}
		}
		
		if (!!dateObj){
			var dateDiff = parseInt((new Date() - dateObj)/(24*3600*1000));
			result.diff = dateDiff;
		}
	}
	
			// TEMPORARY
		// Will need to refactor into a module soon
		// "grab" the preview pane from URL only (no need to fetch HTML)
		// Could be useful for: youtube, facebook video, vimeo, giphy, etc.

		var grabUrl = function(url) {
			//https?:\/\/(?:\w+\.)?facebook\.com\/[^\/]+\/posts\/(\d+)\/?
			var matches = url.match(/https?:\/\/(?:\w+\.)?facebook\.com\/[^\/]\/videos\/(\d+)\/?/i);
			if (!!matches && (matches.length === 2)){
				var fbID = matches[1];
				alert(fbID);
				var tpl = 
					'<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FK14vn%2Fvideos%2F' +
					fbID + 
					'%2F&show_text=0&width=640" width="640" height="360" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>';
				$("<div id='qvDiv_' />").html(tpl).appendTo($(".link-summary"));
				return true;
			}
			
			return false;
		}
		
		if (!!grabUrl(url)) return;

	*/
	
	return exports;
	
})(jQuery);