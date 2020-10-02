var TEST_PREVIEW_URL_ = null;
var AS_APP_NAME = 'ANHSTOCK FAST DOWNLOADER';
var DATA_KEY = 'anhstockData';
var USERNAME = 'hoangsonx';
var TOKEN = '322bd1678e81b504225b8ff796fc5747';
var API_ENDPOINT = 'http://api.anhstock.com/index.php';

window.Previewer_ = window.Previewer_ || (function ($) {

    // var userData = null;
    // var userTest = {username: 'hoangsonx@gmail.com', token: '322bd1678e81b504225b8ff796fc5747'};
    // localStorage.setItem(DATA_KEY, JSON.stringify(userTest));
    //
    // userData =  Util_.tryParseJSON(localStorage.getItem(DATA_KEY), 0);
    //
    // console.log('load userData');
    // console.log(userData);
    //
    // return false;

    // should load from template files
    var buildPreviewPane = function (site, url) {
        // alert(url)
        console.log(site)
        var source = site.source;
        var stockid = Util_.getStockID(url, source);

        // To set
        // chrome.storage.local.set({'testKey': 'Test Value'});

        // To get
        chrome.storage.local.get('testKey', function (data) {
            console.log(data);
            // alert(data.testKey)
            // logs out "Object {testKey: "Test Value"}"
        })


        var $qvLink = $("<div id='qvLinkDiv_'><div class='confirm-stock-info'>Info</div><button id='qvLink_' class='super-cta download-info-as' data-stockid='" + stockid + "' data-url='" + url + "' data-source='" + source + "' data-type='' data-size='' >  <span class='icon-down'>&darr;</span> Tải về <với></với> <img style='vertical-align: bottom; height: 20px;background-color: white;display: inline-block;border-radius: 5px;padding:3px' src='"+ chrome.extension.getURL('/icon.png')+"'> AnhStock </button></div>");


        // $(".link-summary").append($qvLink);
        // CREATE APPEND DOWNLOAD BUTTON
        // .adp-file-confirm-cancel-wrapper - istockphoto
        // #licensesContainer - 123RF
        //

        let main_select_location = null;
        if (url.match(/shutterstock.com/ig)) {
            main_select_location = $(document).find("button[data-automation='download_free_trial']").parent();
            main_select_location.prepend($qvLink);
        } else if (url.match(/istockphoto.com/ig)) {
            main_select_location = $(document).find(".adp-file-confirm-cancel-wrapper");
            main_select_location.append($qvLink);
        } else if (url.match(/123rf.com/ig)) {
            main_select_location = $(document).find("#download_button_scroll").parent();
            main_select_location.append($qvLink);
        }


        var $qv = $("<div id='qvDiv_' />")
        var qvClass = site.domain.replace(/\./g, "-");
        !!site.extraClass && (qvClass += " " + site.extraClass);
        $qv.addClass(qvClass);


        var $qvTopBar = $("<div id='qvTopBar_'><span id='qvDate_' /><span id='qvOldNews_' /></div>");
        var $qvTitle = $("<h1 id='qvTitle_' />");
        var $qvLead = $("<div id='qvLead_' />");
        var $qvLeadImg = $("<div id='qvLeadImg_' class='media_ media-img_' />");
        var $qvLeadImgCaption = $("<p id='qvLeadImgCaption_' class='caption_'/>");
        var $qvContent = $("<div id='qvContent_' />");
        var $qvBottomBar = $("<div id='qvBottomBar_'><a href='https://chrome.google.com/webstore/detail/linkhay-quickview/jdiingledcmkbdenjnfelcoomapkcbpm/support' target='_blank'>Phản hồi về Xem nhanh</a><a href='#' id='qvClose_'>[&times;] ĐÓNG</a><div>");
        var $qvOverlay = $("<div id='qvOverlay_'><button id='qvMore_'>ĐỌC TIẾP</button></div>");
        var $qvTools = $("<div id='qvTools_' title='Đổi cỡ chữ'><i data-font-size='12' class='fa fa-font' aria-hidden='true' /><i data-font-size='14' class='fa fa-font' aria-hidden='true' /><i data-font-size='16' class='fa fa-font' aria-hidden='true' /></div>");
        $qvTools.find("i").on("click", function () {
            var fontSize = $(this).attr("data-font-size") + "px";
            document.documentElement.style.fontSize = fontSize;
            if (fontSize === "16px") {
                localStorage.removeItem("qv_.customStyle");
            } else {
                localStorage["qv_.customStyle"] = "html{font-size:" + fontSize + "}"
            }
        });

        // $qv.append($qvTopBar)
        //     .append($qvTitle)
        //     .append($qvLead)
        //     .append($qvLeadImg)
        //     .append($qvLeadImgCaption)
        //     .append($qvContent)
        //     .append($qvBottomBar)
        //     .append($qvOverlay)
        //     .append($qvTools);

        // $(".link-summary").append($qv);

        // Quick View button
        // Step 1 get info
        $(document).on("click", ".download-info-as", function (event) {
            event.preventDefault();
            var info_element = $(".confirm-stock-info");
            var current_btn_text = $(this).html();
            var btn_button = $(this);

            var id = btn_button.attr("data-stockid");
            var source = btn_button.attr("data-source");

            btn_button.html('<span class="loader"></span> Đang xử lý...');
            info_element.html('<h4 class="grey">Đang lấy thông tin...</h4>').slideToggle("fast");
            btn_button.attr("disabled", true);

            var url = API_ENDPOINT + '?user=hoangsonx&token=322bd1678e81b504225b8ff796fc5747&act=down&id=' + id + '&site=' + source;
            Util_.getJSON({
                url: url
            }, function (data) {
                // console.log(data)
                if (data.status) {
                    var item_text = '<div><strong>' + AS_APP_NAME + '</strong></div>';
                    item_text = item_text + '<p class="red"><strong>Xác nhận thông tin tải:</strong></p>';
                    item_text = item_text + '<div>' + data.file_size + '</div>';
                    item_text = item_text + '<div><strong class="red">' + (data.fee && data.fee != "0" ? '-' + data.fee : 'Miễn phí tải lại 48h') + '</strong></div>';
                    info_element.html(item_text);
                    if (data.type) {
                        btn_button.attr("data-type", data.type);
                    }
                    if (data.size) {
                        btn_button.attr("data-size", data.size);
                    }
                    btn_button.html('Tải ngay').removeClass('download-info-as').addClass('download-now-as');
                } else {
                    info_element.html(data.msg);
                    btn_button.html(current_btn_text);
                }
                btn_button.removeAttr("disabled");
            }, function (errorThrown) {
                console.log(errorThrown);
                console.log(url);
            });

            // if (!$(this).hasClass("clicked_")){
            // 	$(this).addClass("clicked_");
            // 	var list = localStorage["qv_.viewedList"];
            // 	if (!!list) {
            // 		list = list.split("|");
            // 	} else {
            // 		list = [];
            // 	}
            // 	if (list.indexOf(PageInfo_.linkID) < 0) {
            // 		list.unshift(PageInfo_.linkID);
            // 		if (list.length > 100) list.length = 100;
            // 		localStorage["qv_.viewedList"] = list.join("|");
            // 	}
            // }
        });

        // Step 2 download
        $(document).on("click", ".download-now-as", function (event) {
            event.preventDefault();
            var info_element = $(".confirm-stock-info");
            var current_btn_text = $(this).html();
            var btn_button = $(this);

            var id = btn_button.attr("data-stockid");
            var source = btn_button.attr("data-source");
            var type = btn_button.attr("data-type");
            var size = btn_button.attr("data-size");

            // alert( type +'/'+  size);

            info_element.append('<br/><h4 class="red">Đang xử lý tải về, xin đợi...</h4>');
            btn_button.html('<span class="loader"></span> Đang tải về..');
            btn_button.attr("disabled", true);

            var url = API_ENDPOINT + '?user=hoangsonx&token=322bd1678e81b504225b8ff796fc5747&act=down&id=' + id + '&site=' + source + '&type=' + type + '&size=' + size + '&captcha=1';
            Util_.getJSON({
                url: url
            }, function (data) {
                console.log(data)
                if (data.status) {
                    var item_text = '<div><strong>' + AS_APP_NAME + '</strong></div>';
                    item_text = item_text + '<div><a href="' + data.url + '" target="_blank"><strong class="as_file_name as-highlight"> &darr; ' + (typeof(data.file_name) != "undefined" ? data.file_name : 'Lỗi tải') + '</strong></a><br/>(Kích cỡ: ' + (data.file_size ? '<strong>'+Util_.bytesToSize(data.file_size)+'</strong>' : 'Lỗi file, vui lòng tải lại trang rồi thử lại') + ')</div>';
                    item_text = item_text + '<div>Nếu trình duyệt không tự tải file vui lòng click vào link trên để tải file về</div>';
                    if (data.slot || data.xu) {
                        item_text = item_text + '<p class="as-highlight">Số dư còn lại: ' + (data.slot ? data.slot + ' lượt tải' : (data.xu ? data.xu + ' Xu' : '0 Xu')) + '</p>';
                    }
                    info_element.html(item_text);
                    btn_button.removeClass('download-now-as').hide();

                    if (data.url) {
                        // window.open(data.url);
                        window.location.href = data.url;
                    }

                } else {
                    info_element.html(data.msg);
                    btn_button.html(current_btn_text);
                    btn_button.removeAttr("disabled");
                }
            }, function (errorThrown) {
                console.log(errorThrown);
                console.log(url);
            });

        });

        $("#qvClose_").click(function (event) {
            event.preventDefault();
            $("#qvDiv_").hide();
            window.scrollTo(0, 0);
        });

        // "Read more" button
        $("#qvMore_").click(function (event) {
            event.preventDefault();
            $("#qvDiv_").css({
                "overflow": "visible",
                "max-height": "none"
            });
            $("#qvOverlay_").fadeOut("fast");
        });
    }

    var metaReferrer = function (value) {
        var meta = document.createElement('meta');
        meta.name = "referrer";
        meta.content = value;
        document.getElementsByTagName('head')[0].appendChild(meta);
    }

    var ensureProtocol = function (url, fullUrl) {
        if (url.indexOf("http") === 0) return url;

        var protocol = "http://";
        if (!!fullUrl && fullUrl.indexOf("https://") === 0) {
            protocol = "https://";
        }
        return protocol + url;
    }

    var getBaseUri = function ($html, site, fullUrl) {
        var baseUri = "";
        var $base = $html.find("base");
        if ($base.length > 0) {
            baseUri = $base.attr("href");
            if (!!baseUri) return baseUri;
        }

        var protocol = "http://";
        if (!!fullUrl && fullUrl.indexOf("https://") === 0) {
            protocol = "https://";
        }
        return protocol + site.domain;
    }

    // fix relative src/href
    var fixSrc = function ($dom, site, url) {
        $dom.find("img[data-src]").each(function () {
            if (!$(this).attr("src")) {
                $(this).attr("src", $(this).attr("data-src"));
            }
        });

        var baseUri = getBaseUri($dom, site, url);
        $dom.find("img[src], iframe[src]").each(function () {
            var src = $(this).attr("src");
            if (src.indexOf("http") !== 0 && src.indexOf("//") !== 0) {
                if (src.indexOf("/") !== 0) src = "/" + src;
                $(this).attr("src", baseUri + src)
            }
        });

        $dom.find("a[href]").each(function () {
            var src = $(this).attr("href");
            if (src.indexOf("http") != 0 && src.indexOf("//") !== 0) {
                if (src.indexOf("/") !== 0) src = "/" + src;
                $(this).attr("href", baseUri + src)
            }
        });
    }

    var showImageBox = function ($img) {
        if (!$img || $img.length === 0) return;
        if ($img.length === 1 && $img[0].nodeName != "IMG") {
            $img = $img.find("img");
        }

        $img.on("click", function (e) {
            e.preventDefault();
            var src = null;
            var $lb = $(this).parent("a[rel='lightbox'], a[data-lightbox], a.detail-img-lightbox, a.fancybox");
            if ($lb.length === 1) {
                src = $lb.attr("href");
            }
            if (!src) {
                src = $(this).attr("data-original") || $(this).attr("src");
            }
            !!src && Util_.showImageBox(src);
        });
    }

    var process = function (html, site, url) {
        // var nodeList = $.parseHTML("<div>" + html + "</div>", null, !!site.keepScripts);
        // var $html = $(nodeList);
        // // console.log($html)
        //
        // if (site.matchHtml) {
        // 	site = KnownSites_.get(url, $html);
        // 	if (site.replaceUrl) {
        // 		url = url.replace(site.replaceUrl[0], site.replaceUrl[1]);
        // 	}
        // }
        //
        // fixSrc($html, site, url);
        //
        // var $title = $html.find(site.title).first();
        // // if ($title.length === 0) {
        // // 	console.log("[QuickView] Article title not found: " + url);
        // // 	return;
        // // }
        //
        // var $date = null;
        // if (site.date){
        // 	$date = $html.find(site.date);
        // }
        //
        // var $lead = null;
        // if (site.lead){
        // 	$lead = $html.find(site.lead).first();
        // }
        // var $leadImg = null;
        // if (site.leadImg){
        // 	$leadImg = $html.find(site.leadImg).first();
        // }
        // var $leadImgCaption = null;
        // if (site.leadImgCaption){
        // 	$leadImgCaption = $html.find(site.leadImgCaption).first();
        // }
        //
        // // content do not use .first() since we could not guarantee
        // // there's single mother tag for content
        // // if want .first to fetch first of several articles on same page
        // // use :first in selector
        // var $content = $html.find(site.content);//.first();
        //
        // // if (($content.length === 0) &&
        // // 	($lead === null || $lead.length === 0) &&
        // // 	($leadImg === null || $leadImg.length === 0)) {
        // // 		console.log("[QuickView] Article content not found: " + url);
        // // 		return;
        // // }
        //
        // // Clean unwelcomed things
        // if (!site.keepStyle) {
        // 	$.each([$content, $lead, $leadImg], function(index, $tag){
        // 		if (!!$tag) {
        // 			$tag.find("[style]").removeAttr("style");
        // 		}
        // 	});
        // }
        //
        // !!site.p && $content.find(site.p).addClass("p_");
        // !!site.quote && $content.find(site.quote).addClass("quote_");
        // !!site.infoBox && $content.find(site.infoBox).addClass("info-box_");
        // if (!!site.media) {
        // 	var $mediaList = $content.find(site.media).addClass("media_");
        // 	$mediaList.each(function(){
        // 		var $il = $(this).find("img");
        // 		if ($il.length === 1){
        // 			$(this).addClass("media-img_")
        // 		}
        //
        // 		var $vl = $(this).find("video");
        // 		if ($vl.length === 1){
        // 			$(this).addClass("media-video_")
        // 		}
        // 	});
        // }
        // !!site.caption && $content.find(site.caption).addClass("caption_");
        // if (!!site.dynamic) {
        // 	var $newContent = site.dynamic($content, $html, {
        // 		$title: $title,
        // 		$date: $date,
        // 		$lead: $lead,
        // 		$leadImg: $leadImg,
        // 		$leadImgCaption: $leadImgCaption
        // 	});
        // 	if (($content.length === 0) && !!$newContent && ($newContent.length > 0)) {
        // 		$content = $newContent;
        // 	}
        // }
        //
        // showImageBox($leadImg);
        // showImageBox($content.find(".media_ img[src]"));
        //
        // // remove, hide, empty
        // !!site.remove && $content.find(site.remove).remove();
        // !!site.hide && $content.find(site.hide).hide();
        // !!site.empty && $content.find(site.empty).empty();
        //
        // // Clean unwelcomed things + ajust some style
        // $.each([$content, $lead, $leadImg], function(index, $tag){
        // 	if (!!$tag) {
        // 		$tag.find("style, script").remove();
        // 		$tag.find("p, div, h1, h2, h3, h4, h5, h6, a[name]").each(function() {
        // 			var $this = $(this);
        // 			var html = $this.html().replace(/\s|&nbsp;/g, '').toLowerCase();
        // 			if(html.length === 0 || html === "<br>" || html === "<br/>") {
        // 				$this.remove();
        // 			}
        // 		});
        //
        // 		$tag.find("iframe[width]").each(function(){
        // 			var ifWidth = $(this).attr("width");
        // 			if (ifWidth === "100%" || ifWidth > 640){
        // 				$(this).css({
        // 					"width": "640px",
        // 					"height": "360px",
        // 				});
        // 			}
        // 			if (ifWidth === "100%" || ifWidth > 624) {
        // 				$(this).css("margin-left", "-16px");
        // 			}
        // 		});
        //
        // 		$tag.find("video:not([controls])").attr("controls", "");
        // 	}
        // });
        //
        // // Make sure referrer is set for website which requires
        // if (!!site.referrer) {
        // 	metaReferrer(site.referrer);
        // }

        // build preview pane
        buildPreviewPane(site, url);

        // // append to preview pane
        // var dateObj = null;
        // var dateText = null;
        // if (!!$date) {
        // 	if (!site.dateAttr){
        // 		dateText = $date.text();
        // 		$("#qvDate_").text(dateText);
        // 	} else {
        // 		var dateText = $date.attr(site.dateAttr);
        // 		var parsedDate = Date.parse(dateText);
        // 		var dateString = dateText;
        // 		if (!isNaN(parsedDate)) {
        // 			dateObj = new Date(parsedDate);
        // 			dateString = dateObj.toLocaleString();
        // 		}
        // 		$("#qvDate_").text(dateString);
        // 	}
        // }
        //
        // if (!dateObj && !!dateText) {
        // 	var dateMatches = dateText.match(/([0-3]\d?)(?:\/|-)(\d\d?)(?:\/|-)((?:19|20)\d\d)/);
        // 	if (!!dateMatches && dateMatches.length === 4){
        // 		dateObj = new Date(dateMatches[3],dateMatches[2]-1,dateMatches[1])
        // 	}
        // }
        //
        // if (!!dateObj){
        // 	var dateDiff = parseInt((new Date() - dateObj)/(24*3600*1000));
        // 	if (dateDiff >= 7) {
        // 		// old article warning
        // 		$("#qvOldNews_").text(dateDiff + " ngày trước").show();
        // 	}
        // }
        //
        // var qvTitle = $title.text().trim();
        // if (qvTitle !== PageInfo_.title) {
        // 	$("#qvTitle_").text(qvTitle);
        // }
        // !!$lead && $("#qvLead_").append($lead.attr("id", "qvLeadInner_"));
        // !!$leadImg && $("#qvLeadImg_").append($leadImg.attr("id", "qvLeadImgInner_"));
        // !!$leadImgCaption && $("#qvLeadImgCaption_").text($leadImgCaption.text().trim());
        // if ($content.length > 1) {
        // 	$("#qvContent_").append("<div id='qvContentInner_' />");
        // 	$("#qvContentInner_").append($content);
        // } else {
        // 	$("#qvContent_").append($content.attr("id", "qvContentInner_"));
        // }

        // show the preview button
        $("#qvLinkDiv_").show();
        // if (Util_.shouldExpand()){
        // 	$("#qvLink_").trigger("click");
        // }
    }

    var load = function (url, site) {
        //$.get({
        Util_.getPage({
            url: url
        }, function (html) {
            process(html, site, url);
        }, function (errorThrown) {
            console.log(errorThrown);
            console.log(url);
        });
    }


    // load main
    var execute = function (url) {
        url = TEST_PREVIEW_URL_ || url || PageInfo_.targetUrl;


        var site = KnownSites_.get(url);
        if (!site) {
            console.log("[QuickView] Unsupported: " + url);
            return;
        }

        // if (!!site.replaceUrl) {
        // 	url = url.replace(site.replaceUrl[0], site.replaceUrl[1]);
        // }

        // turn t.me to embed
        // if (url.indexOf("https://t.me/") === 0 && url.indexOf("embed=1") < 0) {
        // 	url += "?embed=1";
        // }

        // console.log(site)

        // flattern javascript redirect (and meta refresh?)

        // if (url.match(/^(https?:\/\/)?(cafef|cafebiz|istockphoto|kenh14|dantri\.com)\.vn\/news-\d+(\.\w+)?/)) {
        // 	// alert('aaaaaa ' + url);
        // 	//$.get({
        // 	Util_.getPage({
        // 		url: url
        // 	}, function(html){
        //
        // 		//var find = html.match(/\<body\s+onload\s*\=\s*"(?:window\.)?location\.href\s*\=\s*'(.+?)'/i);
        // 		var find = html.match(/(?:window\.)?(?:top\.)?location(?:\.href)?\s*\=\s*'(.+?)'/i);
        // 		if (!!find) {
        // 			var newUrl = find[1];
        // 			if (newUrl.indexOf("http") !== 0) {
        // 				newUrl = ensureProtocol(site.domain, url) + find[1];
        // 			}
        // 			load(newUrl, site);
        // 		} else {
        // 			process(html, site, url);
        // 		}
        // 	});
        // } else {
        // 	// alert('bbbbb ' + url);
        // 	// load(url, site);
        // }


        load(url, site);
    }

    return {
        execute: execute
    }

})(jQuery);