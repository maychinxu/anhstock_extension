(function () {

    // var userData = {
    //     user_email: 'hoangsonx@gmail.com',
    //     token: '322bd1678e81b504225b8ff796fc5747',
    //     user_name: "maychinxu",
    //     user_xu: 5000,
    //     plan: {
    //         active: "50.00",
    //         slot: 1,
    //         start_date: "29/09/20 11:48:27",
    //         reset_date: "30/09/20 11:48:27",
    //         end_date: "29/10/20 11:48:27"
    //     }
    // }
    // chrome.storage.local.set(userData);
    // chrome.storage.local.set({'userData': userData});


    // chrome.storage.local.set({'userData': null });

    chrome.storage.local.get('userData', function (data) {
        var userData = data && data['userData'];
        if (userData) {
            document.getElementById("userDetail").style.display = "block";
            document.getElementById("btnlogin").style.display = "none";
            document.getElementById("user_email").textContent = userData['user_email'];
            document.getElementById("user_xu").textContent = userData['user_xu'];
            if (userData['plan'] && userData['plan']['active']) {
                var plan_data = userData['plan'];
                document.getElementById("plan_slot").textContent = plan_data['slot'];
                document.getElementById("plan_total_slot").textContent = plan_data['active'];
                document.getElementById("plan_start_date").textContent = 'Bắt đầu: ' + plan_data['start_date'];
                document.getElementById("plan_end_date").textContent = 'Kết thúc: ' + plan_data['end_date'];

                chrome.browserAction.setBadgeText({text: userData['user_xu'].toString() });
            }
            // $('.user_email').html(userData['user_email']);
        } else {
            document.getElementById("userDetail").style.display = "none";
            document.getElementById("btnlogin").style.display = "block";
            // alert('not logged');
        }
        // console.log(userData);
        // alert(data.testKey)
        // logs out "Object {testKey: "Test Value"}"
    })

    var stopAsking = (localStorage["qv_.stopAsking"] === "true");
    var sendLink = function (url, title, index) {
        chrome.tabs.create({
            url: "https://linkhay.com/about.php?qvAutoSubmitLink=" + encodeURIComponent(url) +
                "&qvAutoSubmitTitle=" + encodeURIComponent(title),
            index: index
        });
        window.close();
    }

    var isLinkhayPage = function (url) {
        return (url.toLowerCase().indexOf("://linkhay.com") >= 0);
    }

    chrome.tabs.query({
        active: true, currentWindow: true
    }, function (tabs) {

        document.getElementById("btnlogout").addEventListener('click', function () {
            chrome.storage.local.set({'userData': null});
            window.location.reload();
            // alert('logout ok');
        });

         document.getElementById("btnlogin").addEventListener('click', function () {
             var userData = {
                 user_email: 'hoangsonx@gmail.com',
                 token: '322bd1678e81b504225b8ff796fc5747',
                 user_name: "maychinxu",
                 user_xu: 5000,
                 plan: {
                     active: "50.00",
                     slot: 1,
                     start_date: "29/09/20 11:48:27",
                     reset_date: "30/09/20 11:48:27",
                     end_date: "29/10/20 11:48:27"
                 }
             }
             chrome.storage.local.set(userData);
             chrome.storage.local.set({'userData': userData});
            window.location.reload();
            // alert('logout ok');
        });

        // var url = tabs[0].url,
        //     index = tabs[0].index + 1,
        //     title = tabs[0].title,
        //     isLH = !!isLinkhayPage(url);
        // if (!isLH && stopAsking) {
        //     sendLink(url, title, index);
        // } else {
        //     document.getElementById("url").textContent = url;
        //     document.getElementById("stopAskingWrap").style.display = (isLH ? "none" : "block");
        //     document.getElementById("sendLink").addEventListener('click', function () {
        //         if (!isLH) {
        //             localStorage["qv_.stopAsking"] = !!document.getElementById("stopAsking").checked;
        //         }
        //         sendLink(url, title, index);
        //         ;
        //     });
        // }
    });

})();
