// Current User
var currentUserID = "";
var clubCurrentId = '0';

// Current Page
var pageSelected = "Login";
var profilePicDirectory = "resources/profile_pictures/";
var barProfilePicDirectory = "resources/barprofile_pictures/"
var areaPicDirectory = "resources/areas/";

//Home Global Variables
var clubCurrent = '3';
var notifTimer;

//Search Global Variables
var selectedArea = "NONE";
var selectedAreadId = "NONE";
var selectedBar = "NONE";
var selectedBarId = "NONE";

//Profile Global Variables
var userID = "NONE";
var userFullName = "LUKE BEERWALKER";
var userTitle = "The diver";
var experience = 500;
var nextLevel = 2000;
var expBarValue = (experience / nextLevel) * 100;
var userStatus = 1;
var userLevel = "";
var userEmail = 0;
var userGender = "";
var userRFID = "";
var userPass = "";
var userAbout = "";
var userClass = "";

//Signup Global Variables
var usernameAvailable = false;
var passwordAvailable = false;
var emailAvailable = false;
var tagAvailable = false;
var signupRFID = "";
var signupUID = "";
var signupUsername = "";
var signupPassword = "";
var signupEmail = "";

//Hop Global Variables
var hopExchangeID = "";

//Bar Global Variables
var barName = "";
var barAddress = "";
var barImage = "";
var barDaysOpen = "";
var barCategory = "";
var barMaleCount = 0;
var barFemaleCount = 0;
var barContactInfo = "";
var barMapUrl = "";
var barDescription = "";
var barBudget = "";
var barEntranceFee = "";
var barPopularFor = "";

//Search Global Variables
var lastEntry = "";

//Timer Global Variables
var timerStart = false;

function changePageEvent(selected) {
    pageSelected = selected;
    userID = currentUserID;
};

function updateLoginPage() {
    checkStorage();
}

function updateHomePage() {
    refreshHome();
    clearList("activityList");
    getHopRequests();
    //clear("notifList");
    //getNotifications();
};

function updateSearchPage() {
    clearList("listArea");
    getAreas();
};

function updateMainProfilePage() {
    getProfileInfo(currentUserID);
};

function updateUserProfilePage() {
    clearButton("hopButton");
    getProfileInfo(userID);
};

function updateBarListPage() {
    var areaName = document.getElementById("areaName");
    areaName.innerHTML = selectedArea;
    clearList("listBar");
    getBars(selectedAreaId);
};

function updateBarProfilePage() {
    getBarProfile();
};

function updateStatusButton(elementId) {

    var html_btnHopReady = $("#btnHopYes");
    var html_btnHopNotReady = $("#btnHopNo");

    if (userStatus == 1) {
        html_btnHopReady.removeClass("buttonNotSelected");
        html_btnHopReady.addClass("buttonSelected");
        html_btnHopReady.addClass("buttonReady");

        html_btnHopNotReady.removeClass("buttonSelected");
        html_btnHopNotReady.addClass("buttonNotSelected");
    } else {
        html_btnHopReady.removeClass("buttonSelected");
        html_btnHopReady.addClass("buttonNotSelected");

        html_btnHopNotReady.removeClass("buttonNotSelected");
        html_btnHopNotReady.addClass("buttonSelected");
        html_btnHopNotReady.addClass("buttonNotReady");
    }
}

function updateAccountSettings() {
    getProfileInfo(currentUserID);
};

//EVENT AFTER DISPLAYING A PAGE
$(document).on("pageshow", '*[data-role="page"]', function() {
    switch (pageSelected) {
        case "Login":
            updateLoginPage();
            break;
        case "Home":
            updateHomePage();
            break;
        case "Search":
            updateSearchPage();
            break;
        case "MainProfile":
            updateMainProfilePage();
            break;
        case "UserProfile":
            updateUserProfilePage();
            break;
        case "BarList":
            updateBarListPage();
            break;
        case "BarProfile":
            updateBarProfilePage();
            break;
        case "AccountSettings":
            updateAccountSettings();
            break;
        default:
            alert("Something went wrong\nPage Selected: " + pageSelected);
            break;
    }
});


// //EVENT BEFORE DISPLAYING A PAGE
// $(document).on("pagebeforeshow", '*[data-role="page"]', function() {

// });


// FOR LOGIN PAGE //

function checkStorage() {
    if ('localStorage' in window && window['localStorage'] !== null) {
        if (localStorage.getItem('id') !== null) {
            db = window.openDatabase("HopLocalDB", "1.0", "Hop local database", 5 * 1024 * 1024);
            currentUserID = localStorage.getItem('id');
            changePage("Home", "#pageHome");
        }
    }
}

function login() {
    username = document.getElementById('txtLoginUsername').value;
    password = document.getElementById('txtLoginPassword').value;

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/login?username=' + username + '&password=' + password
    $.getJSON('http://localhost/protoslabs/hopdata/index.php/hop/login?username=' + username + '&password=' + password,
        function(jsonData) {
            if (jsonData.flag === "true") {
                db = window.openDatabase("HopLocalDB", "1.0", "Hop local database", 5 * 1024 * 1024);
                storeUserData(jsonData.data[0]);
                startNotificationUpdate();
                changePage("Home", "#pageHome");
            } else if (jsonData.flag === "false")
                alert("Username or password invalid");
            //window.plugins.toast.showShortCenter("Username or password invalid");
        });
}

function changePage(page, pageId) {
    changePageEvent(page);
    $.mobile.changePage(pageId, {
        changeHash: true,
        transition: "pop",
    });
}

function storeUserData(data) {

    localStorage.setItem("id", data.id);
    localStorage.setItem("username", data.username);
    localStorage.setItem("image", data.image);
    localStorage.setItem("filterMale", data.filterMale);
    localStorage.setItem("filterFemale", data.filterFemale);
    localStorage.setItem("vibrate", data.vibrate);
    localStorage.setItem("sound", data.sound);
    currentUserID = data.id;
    userImage = data.image;

    settings_checkFilter();
}

function logout() {
    removeStorageItems();
    clearLoginElements();
    changePageEvent("Login");
    stopNotificationUpdate();
}

function clearLoginElements() {
    document.getElementById('txtLoginUsername').value = "";
    document.getElementById('txtLoginPassword').value = "";
}

function removeStorageItems() {
    if (localStorage.getItem("id") !== null)
        localStorage.removeItem("id");
    if (localStorage.getItem("username") !== null)
        localStorage.removeItem("username");
    if (localStorage.getItem("dbCreated") !== null)
        localStorage.removeItem("dbCreated");
    if (localStorage.getItem("filterMale") !== null)
        localStorage.removeItem("filterMale");
    if (localStorage.getItem("filterFemale") !== null)
        localStorage.removeItem("filterMale");
    if (localStorage.getItem("vibrate") !== null)
        localStorage.removeItem("vibrate");
    if (localStorage.getItem("sound") !== null)
        localStorage.removeItem("sound");

}

function leave() {
    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/leave?id=
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/leave?id=' + currentUserID,
        function(jsonData) {
            var clubName = document.getElementById("clubName");
            clubName.innerHTML = "HOP";
        })
        .fail(function() {
            // window.plugins.toast.showShortCenter("No internet connection");
        });
    window.location.reload();
}



// FOR HOME PAGE //
function getUsername() {

    var panelPic = document.getElementById("panelProfilePicThumb");
    var btnLeaveBar = document.getElementById("leaveBar");
    var panelImage = localStorage.getItem('image');

    panelPic.src = profilePicDirectory + panelImage;
    btnLeaveBar.innerHTML = "Leave " + clubCurrent;
}

function refreshHome() {

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/currentbar?id=
    $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/currentbar?id=" + currentUserID,
        function(jsonData) {

            if (jsonData.flag === "true") {
                clubCurrent = jsonData.data[0].name;
                clubCurrentId = jsonData.data[0].id;
                refreshCurrentUsersList();
            } else {
                clearList("listCurrentUsers");
                clubCurrent = "Hop";
                clubCurrentId = "0";
            }

            var clubName = document.getElementById("clubName");
            clubName.innerHTML = clubCurrent;
        })
        .fail(function() {
            //window.plugins.toast.showShortCenter("No internet connection");
            db.transaction(function(tx) {
                tx.executeSql("SELECT bar_id FROM userInfo WHERE id=?", [currentUserID], function(tx, res) {
                    if (res.rows.length) {
                        tx.executeSql("SELECT id, name FROM bars WHERE id=?", [res.rows.item(0).bar_id], function(tx, checkres) {
                            if (checkres.rows.length) {
                                clubCurrent = checkres.rows.item(0).name;
                                clubCurrentId = checkres.rows.item(0).id;
                            } else {
                                clearList("listCurrentUsers");
                                clubCurrent = "Hop";
                                clubCurrentId = "0";
                            }
                            var clubName = document.getElementById("clubName");
                            clubName.innerHTML = clubCurrent;
                        });
                    }
                });
            });
        });
}

function refreshCurrentUsersList() {
    clearList("listCurrentUsers");
    getCurrentUsers();
}

function clearList(elementId) {
    var ul = document.getElementById(elementId);
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
}

function getCurrentUsers() {

    var filterUsers = localStorage.getItem("filterHop");

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/users?bar=""&gender=""
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/users?bar=' + clubCurrentId + '&gender=' + filterUsers,
        function(jsonData) {
            if (jsonData.flag === 'true') {
                $.each(jsonData.users, function(i, data) {
                    if (data.id !== currentUserID)
                        populateCurrentUsersList(data.id, data.username, data.image, data.status_id);
                });
            }
        });
}

function populateCurrentUsersList(id, name, image, status_id) {

    var ul = document.getElementById("listCurrentUsers");
    var li = document.createElement("li");
    var a = document.createElement('a');
    var img = document.createElement("img");
    img.className += " thumbnail ui-li-icon";
    img.src = profilePicDirectory + image;
    a.className = "rightPanel ui-btn ui-btn-icon-right";
    if (status_id == 1)
        a.className += " ui-icon-heart";
    else
        a.className += " ui-icon-forbidden";
    a.innerHTML = name;
    a.onclick = (function() {
        var userId = id;
        var userName = name;
        return function() {
            initializeProfile(userId, userName, image);
        }
    })();
    a.appendChild(img);
    li.appendChild(a);
    ul.appendChild(li);
}

function startNotificationUpdate() {
    notifTimer = setInterval(function() {
        checkForHopAccept();
    }, 10000);
    timerStart = true;
}

function stopNotificationUpdate() {
    if (timerStart) {
        clearInterval(notifTimer);
        timerStart = false;
    }
}

function checkForHopAccept() {

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/checkhopaccept?user_id=""
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/checkhopaccept?user_id=' + currentUserID,
        function(jsonData) {
            if (jsonData.flag === 'true') {
                $.each(jsonData.data, function(i, data) {
                    alert("Meet " + data.receiver_id + " at the counter");
                    deleteHop(data.user_id, data.receiver_id);
                    checkIfLevelUp(jsonData.data[0].level, jsonData.data[0].currentExp, jsonData.data[0].expNeeded);
                });
            }
        });
    // .fail(function() {
    //     alert("No internet connection");
    // });

    stopNotificationUpdate();
}

function deleteHop(user_id, receiver_id) {
    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/deletehop?user_id=""&receiver_id=""
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/deletehop?user_id=' + user_id + '&receiver_id=' + receiver_id);
}

function getNotifications() {

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/getnotif?id=""
    $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/getnotif?id=" + currentUserID,
        function(jsonData) {

            populateNotification(jsonData.data[0].description);
            //REFRESH HERE
            //ONLY GET 10 LATEST NOTIF
        });
}

function populateNotification(description) {
    // POPULATE HERE

    var ul = document.getElementById("notifList");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.innerHTML = description;
    a.className = "ui-btn ui-btn-icon-right ui-icon-carat-r customBtn";
    li.appendChild(a);
    ul.appendChild(li);
}


// FOR SEARCH PAGE //
function initializeAreaList(areaName, areaId) {
    selectedArea = areaName;
    selectedAreaId = areaId;
    changePageEvent("BarList");
}

function initializeBarList(barName, barId) {
    selectedBar = barName;
    selectedBarId = barId;
    changePageEvent("BarProfile");
}

function getAreaId(areaName) {
    switch (areaName) {
        case "Taguig":
            return "Taguig.jpg";
            break;
        case "Makati":
            return "Makati.jpg";
            break;
        case "Tomas Morato":
            return "TomasMorato.jpg";
            break;
        case "Quezon City":
            return "Qc.jpg";
            break;
        case "Pasig":
            return "Pasig.jpg";
            break;
        default:
            return null;
            break;
    }
}

function getAreas() {

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/getallarea
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/getallarea',
        function(jsonData) {
            $.each(jsonData.data, function(i, data) {
                populateArealist(data.id, data.name);
            });
        })
        .fail(function() {
            //window.plugins.toast.showShortTop("No internet connection");
            db.transaction(function(tx) {
                tx.executeSql("SELECT id,name FROM area", [], function(tx, res) {
                    if (res.rows.length) {
                        for (var i = 0; i < res.rows.length; i++) {
                            populateArealist(res.rows.item(i).id, res.rows.item(i).name);
                        }
                    }
                });
            });
        });
}

function populateArealist(id, name) {
    var ul = document.getElementById("listArea");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.innerHTML = name;
    a.href = "#pageBarList";
    a.style.backgroundImage = "url(" + areaPicDirectory + getAreaId(name) + ")";
    a.style.background.size = "cover";
    a.className = "ui-btn ui-icon-carat-r customAreaList";
    a.onclick = (function() {
        var currentArea = name;
        var currentAreaId = id;
        return function() {
            initializeAreaList(currentArea, currentAreaId);
        }
    })();
    li.appendChild(a);
    ul.appendChild(li);
}

function getBars(id) {
    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/bardetails?area_id=""
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/bardetails?area_id=' + id,
        function(jsonData) {
            $.each(jsonData.bar, function(i, data) {
                populateBarList(data.id, data.name, data.maleCount, data.femaleCount);
            });
        })
        .fail(function() {
            //window.plugins.toast.showShortTop("No internet connection");
            db.transaction(function(tx) {
                tx.executeSql("SELECT id,name,maleCount,femaleCount FROM bars WHERE area_id=?", [id], function(tx, res) {
                    if (res.rows.length) {
                        for (var i = 0; i < res.rows.length; i++) {
                            populateBarList(res.rows.item(i).id, res.rows.item(i).name, res.rows.item(i).maleCount, res.rows.item(i).femaleCount);
                        }
                    }
                });
            });
        });
}

function populateBarList(id, name, maleCount, femaleCount) {
    var ul = document.getElementById("listBar");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.innerHTML = name + "  Male:" + maleCount + "  Female:" + femaleCount;
    a.href = "#pageBarProfile";
    a.className = "ui-btn ui-icon-carat-r";
    a.onclick = (function() {
        var currentBarIndex = id;
        var currentBarName = name;
        return function() {
            initializeBarList(currentBarName, currentBarIndex);
        }
    })();
    li.appendChild(a);
    ul.appendChild(li);
}

function getBarProfile() {

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/searchbar?bar_id=""
    $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/searchbar?bar_id=" + selectedBarId,
        function(jsonData) {
            barProfilePicDirectory = "/ProtosLabs/ProtosLabs.Hop/www/resources/barprofile_pictures/";
            setBarInfo(jsonData.data[0]);
        })
        .fail(function() {
            // window.plugins.toast.showShortTop("No internet connection");
            db.transaction(function(tx) {
                tx.executeSql("SELECT name,address,description,image,daysOpen,budget,entranceFee, " +
                    "popularFor,category,maleCount,femaleCount,contactNumber FROM bars WHERE id=?", [selectedBarId], function(tx, res) {
                        if (res.rows.length) {
                            barProfilePicDirectory = "resources/barprofile_pictures/";
                            setBarInfo(res.rows.item(0));
                        }
                    });
            });
        });
}

function setBarInfo(data) {

    barName = data.name;
    barAddress = data.address;
    barDescription = data.description;
    barImage = data.image;
    barDaysOpen = data.daysOpen;
    barBudget = data.budget;
    barEntranceFee = data.entranceFee;
    barPopularFor = data.popularFor;
    barCategory = data.category;
    barMaleCount = data.maleCount;
    barFemaleCount = data.femaleCount;
    barContactInfo = data.contactNumber;
    //  barMapUrl = data.mapUrl;

    setBarProfile();
}

function setBarProfile() {

    var html_barProfilePic = document.getElementById("barProfilePic");
    html_barProfilePic.style.backgroundImage = "url(" + barProfilePicDirectory + barImage + ")";
    html_barProfilePic.style.background.size = "cover";

    document.getElementById("barProfileName").innerHTML = barName;
    document.getElementById("barProfileMaleCount").innerHTML = "Male: " + barMaleCount;
    document.getElementById("barProfileFemaleCount").innerHTML = "Female: " + barFemaleCount;
    document.getElementById("barProfileAddress").innerHTML = barAddress;
    document.getElementById("barProfileDesc").innerHTML = barDescription;
    document.getElementById("barProfileCategory").innerHTML = barCategory;
    document.getElementById("barProfileDaysOpen").innerHTML = barDaysOpen;
    document.getElementById("barProfileBudget").innerHTML = barBudget;
    document.getElementById("barProfileEntrance").innerHTML = barEntranceFee;
    document.getElementById("barProfilePopular").innerHTML = barPopularFor;
    document.getElementById("barProfileContact").innerHTML = barContactInfo;
}



// FOR ACTIVITY PAGE //
function getHopRequests() {

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/gethoprequests?id=""
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/gethoprequests?id=' + currentUserID,
        function(jsonData) {
            if (jsonData.flag === "true") {
                $.each(jsonData.data, function(i, data) {
                    populateActivityList(data.id, data.user_id, data.username);
                });
            }
        });
    // .fail(function() {
    //     //alert("No internet connection");
    // });
}

function populateActivityList(id, sender_id, username) {
    var ul = document.getElementById("activityList");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.innerHTML = username + " wants to Hop with you";
    a.href = "#myPopupDialog";
    a.setAttribute('data-rel', 'popup');
    a.setAttribute('data-position', 'window');
    a.setAttribute('data-transition', 'slidedown');
    a.className = "ui-btn ui-btn-icon-right ui-icon-carat-r customBtn";
    a.onclick = (function() {
        var currentHopID = id;
        var currentSenderName = username;
        return function() {
            initializePopup(currentHopID, currentSenderName);
        }
    })();
    li.appendChild(a);
    ul.appendChild(li);
}

function initializePopup(id, name) {
    hopExchangeID = id;
    document.getElementById("challengeTitle").innerHTML = "Hop Request";
    document.getElementById("challengeContent").innerHTML = "Accept " + name + "'s Hop request?";
}

function hopAccept() {

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/accepthoprequest?id=""
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/accepthoprequest?id=' + hopExchangeID,
        function(jsonData) {
            checkIfLevelUp(jsonData.data[0].level, jsonData.data[0].currentExp, jsonData.data[0].expNeeded);
            getRandomPlace();
        })
        .fail(function() {
            // window.plugins.toast.showShortTop("No internet connection");
        });
}

function checkIfLevelUp(level, current, needed) {

    if ((currentExp + 20) > expNeeded) {
        //SHOW POP UP(User has gained a level)
        //window.plugins.toast.showLongCenter("You have gained a level!");
    }

    currentExp = current;
    expNeeded = needed;
    userLevel = level;
}

function getRandomPlace() {

    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/randomarea
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/randomarea',
        function(jsonData) {
            alert(jsonData.data[0].area);
            //POP UP HERE
        });
}
// FOR PROFILE PAGE //
function initializeProfile(userId, userName, image) {
    userID = userId;
    pageSelected = 'UserProfile';
    window.location.href = "#pageUserProfile"
}

function clearButton(elementId) {
    var div = document.getElementById(elementId);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function getProfileInfo(id) {

    //Comment navigator if working through localhost

    //if (navigator.network.connection.type !== "none") {
    // for staging change url to : http://protoslabs.com/protoslabs/hopdata/index.php/hop/searchprofile?id=""
    $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/searchprofile?id=" + id,
        function(jsonData) {
            if (jsonData.flag === "true") {
                profilePicDirectory = "/ProtosLabs/ProtosLabs.Hop/www/resources/profile_pictures/";
                setProfileInfo(jsonData.data[0]);
            }
        });
    // } else {
    //     // window.plugins.toast.showShortTop("No internet connection");
    //     db.transaction(function(tx) {
    //         tx.executeSql("SELECT id,rfid,username,password,class,about,status_id,level,title,currentExp,expNeeded,image,email,gender FROM userInfo WHERE id=?", [id], function(tx, res) {
    //             if (res.rows.length) {
    //                 profilePicDirectory = "resources/profile_pictures/";
    //                 setProfileInfo(res.rows.item(0));
    //             }
    //         });
    //     });
    // }
}

function setProfileInfo(data) {

    experience = data.currentExp;
    nextLevel = data.nextLevel;
    expBarValue = (experience / nextLevel) * 100;
    userStatus = data.status_id;
    userFullName = data.username;
    userTitle = data.title;
    userLevel = data.level;
    userImage = data.image;
    userEmail = data.email;
    userGender = data.gender;
    userRFID = data.rfid;
    userPass = data.password;
    userAbout = data.about;
    userClass = data.class;

    if (pageSelected === "AccountSettings")
        setProfileSettings();
    else if (pageSelected === "MainProfile") {
        $(".dial").val(expBarValue).trigger('change');
        setMainProfileInfo();
    } else
        setUserProfileInfo();
}


function setMainProfileInfo() {

    var html_btnHopReady = $("#btnHopYes");
    var html_btnHopNotReady = $("#btnHopNo");

    if (userStatus == 1) {
        html_btnHopReady.removeClass("buttonNotSelected");
        html_btnHopReady.addClass("buttonSelected");
        html_btnHopReady.addClass("buttonReady");

        html_btnHopNotReady.removeClass("buttonSelected");
        html_btnHopNotReady.addClass("buttonNotSelected");
    } else {
        html_btnHopReady.removeClass("buttonSelected");
        html_btnHopReady.addClass("buttonNotSelected");

        html_btnHopNotReady.removeClass("buttonNotSelected");
        html_btnHopNotReady.addClass("buttonSelected");
        html_btnHopNotReady.addClass("buttonNotReady");
    }

    document.getElementById('mainProfilePic').src = profilePicDirectory + userImage;
    document.getElementById("mainProfileUserFullName").innerHTML = userFullName;
    document.getElementById("mainProfileLevel").innerHTML = "Lvl. " + userLevel;
    document.getElementById("mainProfileAbout").innerHTML = userAbout;
    document.getElementById("mainProfileUserTitle").innerHTML = userTitle;
    document.getElementById("mainProfileClass").innerHTML = userClass;
}

function setUserProfileInfo() {
    document.getElementById('userProfilePic').src = profilePicDirectory + userImage;
    document.getElementById("userProfileUserFullName").innerHTML = userFullName;
    document.getElementById("userProfileLevel").innerHTML = "Lvl. " + userLevel;
    document.getElementById("userProfileAbout").innerHTML = userAbout;
    document.getElementById("userProfileUserTitle").innerHTML = "\"" + userTitle + "\"";
    document.getElementById("userProfileClass").innerHTML = userClass;
    if (userStatus == 1) {
        createHopButton();
    }
}

function createHopButton() {
    var div = document.getElementById("hopButton");
    var button = document.createElement("button");
    button.id = "btnHop";
    button.className = "ui-btn ui-btn-inline ui-corner-all";
    button.innerHTML = "Hop with " + userFullName;
    button.onclick = (function() {
        return function() {
            sendHopRequest();
        }
    })();
    div.appendChild(button);
}

function sendHopRequest() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/sendhoprequest?user_id=' + currentUserID + '&receiver_id=' + userID,
        function(jsonData) {

            //POP UP HERE

            if (jsonData.flag === 'false')
                alert("Hop request to ' + userFullName + ' already sent");
            // window.plugins.toast.showShortCenter("Hop request to ' + userFullName + ' already sent");
            else
                alert("Hop request to ' + userFullName + ' success");
            //window.plugins.toast.showShortCenter("Hop request to ' + userFullName + ' success");
        })
        .fail(function() {
            //window.plugins.toast.showShortCenter("No internet connection");
        });
}
// FOR STATUS //
function toggleStatus(elementId) {

    if (elementId === "btnHopYes")
        userStatus = 1;
    else
        userStatus = 2;

    saveNewStatus();
    updateStatusButton();
}

function saveNewStatus() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/savestatus?id=' + userID + '&statusId=' + userStatus, function(jsonData) {})
        .fail(function() {
            // window.plugins.toast.showShortCenter("No internet connection");
        });
}
// FOR SIGN UP //
function allFieldsValidated() {
    if (usernameAvailable && passwordAvailable && emailAvailable)
        document.getElementById('btnSigunupSubmit').disabled = false;
    else
        document.getElementById('btnSigunupSubmit').disabled = true;
}

function rfidFieldsValidated() {
    signupRFID = document.getElementById("txtSignupRFID").value;
    signupUID = document.getElementById("txtSignupUID").value;
    validateTag(signupRFID, signupUID);
    if (tagAvailable) {
        return true;
    } else {
        alert("Tag not available");
        //window.plugins.toast.showShortCenter("Tag not available");
        return false;
    }
}

function validateTag(rfid, uid) {
    var rfidPattern = new RegExp('^[0-9]{10,}$');
    var uidPattern = new RegExp('^[0-9A-Za-z]{4}$');
    if (rfidPattern.test(rfid) && uidPattern.test(uid) && uid !== "" && rfid !== "") {
        $.ajax({
            type: 'GET',
            url: 'http://localhost/ProtosLabs/HopData/index.php/hop/validatetagid?rfid=' + rfid + '&uid=' + uid,
            dataType: 'json',
            async: false,
            success: function(jsonData) {
                if (jsonData.flag === 'true') {
                    console.log('Tag available');
                    tagAvailable = true;
                    //alert('pass');
                } else {
                    console.log('Tag not available');
                    tagAvailable = false;
                }
            },
        });
    } else {
        // window.plugins.toast.showShortCenter("Incorrect format");
        console.log('tag fail');
        tagAvailable = false;
    }
}

function validateUser(username) {
    var usernamePattern = new RegExp('^[0-9A-Za-z]{6,}$');
    if (usernamePattern.test(username) && username !== "") {
        $.ajax({
            type: 'GET',
            url: 'http://localhost/ProtosLabs/HopData/index.php/hop/checkUser?username=' + username,
            dataType: 'json',
            async: false,
            success: function(jsonData) {
                if (jsonData.flag === 'true') {
                    usernameAvailable = true;
                    console.log('username pass');
                } else {
                    usernameAvailable = false;
                    console.log('username fail');
                    $("#txtSignupUsername").focus();
                }
            }
        });
    } else {
        usernameAvailable = false;
        console.log('username fail');
        // window.plugins.toast.showShortCenter("Username should at least be 6 characters");
        $("#txtSignupUsername").focus();
    }
    allFieldsValidated();
}

function validateEmail(email) {
    var emailPattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    if (emailPattern.test(email) && email !== "") {
        console.log('email pass');
        emailAvailable = true;
    } else {
        console.log('email fail');
        emailAvailable = false;
        // window.plugins.toast.showShortCenter("Not a valid email address");
        $("#txtSignupEmail").focus();
    }
    allFieldsValidated();
}

function validatePassword(password) {
    var passwordPattern = new RegExp('^[0-9A-Za-z]{6,}$');
    if (passwordPattern.test(password) && password !== "") {
        console.log('password pass');
        passwordAvailable = true;
    } else {
        console.log('password fail');
        passwordAvailable = false;
        //window.plugins.toast.showShortCenter("Password should be at least 6 characters");
        $("#txtSignupPassword").focus();
    }
    allFieldsValidated();
}

function saveUser() {
    signupUsername = document.getElementById('txtSignupUsername').value;
    signupPassword = document.getElementById('txtSignupPassword').value;
    signupEmail = document.getElementById('txtSignupEmail').value;

    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/saveuser?username=' + signupUsername + '&password=' + signupPassword +
        '&RFID=' + signupRFID + '&gender=Male' + '&email=' + signupEmail,
        function(jsonData) {
            if (jsonData.flag === "true")
                alert("Save success!");
            //window.plugins.toast.showShortCenter("Save success!");
        })
        .fail(function() {
            //window.plugins.toast.showShortCenter("No internet connection");
        });
}

function clearSignUp() {
    document.getElementById("txtSignupUsername").value = "";
    document.getElementById("txtSignupPassword").value = "";
    document.getElementById("txtSignupRFID").value = "";
    document.getElementById("txtSignupGender").value = "";
    document.getElementById("txtSignupEmail").value = "";
    document.getElementById("txtSignupUID").value = "";
}

$(document)
    .on("pageinit", document, function() {
        //set default transition to SLIDE
        $.mobile.changePage.defaults.transition = 'slide';
        $('#homeSearch').keyup(function() {
            if ($('#homeSearch').val() != lastEntry) {
                var searchText = $('#homeSearch').val();
                searchUsers(searchText);
            }
            lastEntry = $('#homeSearch').val();
        });

        // EXP KNOB PROPERTIES
        var myColor = "#0095FF";

        var myKnob = $(".dial").knob({

            'min': 0,
            'max': 100,
            'fgColor': myColor,
            'width': 167,
            'height': 167,
            'thickness': 0.18,
            'skin': 'tron',
            'readOnly': true,

            draw: function() {
                if (this.$.data('skin') === 'tron') {
                    var a = this.angle(this.cv) // Angle
                        ,
                        sa = this.startAngle // Previous start angle
                        ,
                        sat = this.startAngle // Start angle
                        ,
                        ea // Previous end angle
                        , eat = sat + a // End angle
                        ,
                        r = true;

                    this.g.lineWidth = this.lineWidth;

                    this.o.cursor && (sat = eat - 0.3) && (eat = eat + 0.3);

                    if (this.o.displayPrevious) {
                        ea = this.startAngle + this.angle(this.value);
                        this.o.cursor && (sa = ea - 0.3) && (ea = ea + 0.3);
                        this.g.beginPath();
                        this.g.strokeStyle = this.previousColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                        this.g.stroke();
                    }

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();

                    return false;
                }
            }
        });
    });


function searchUsers(searchText) {
    var listCurrentUsers = $("#listCurrentUsers");
    if (searchText !== "") {
        listCurrentUsers.children("li").children("a").each(function() {
            var str = this.innerHTML;
            if (str.indexOf(searchText) == 0)
                $(this).parent().css('display', 'list-item');
            else
                $(this).parent().css('display', 'none');
        });
    } else {
        listCurrentUsers.children("li").each(function() {
            $(this).css('display', 'list-item');
        });
    }
}

// SETTINGS
function setProfileSettings() {

    var filterHop = localStorage.getItem("filterHop");
    var filterMale = document.getElementById("filterMale");
    var filterFemale = document.getElementById("filterFemale");

    document.getElementById("txtSettingsUsername").value = userFullName;
    document.getElementById("txtSettingsRFID").value = userRFID;
    document.getElementById("txtSettingsEmail").value = userEmail;
    document.getElementById("txtSettingsGender").value = userGender;
    document.getElementById("txtSettingsPass").value = userPass;
    document.getElementById("txtSettingsAbout").value = userAbout;

    if (filterHop === "Both") {
        filterMale.checked = true;
        filterFemale.checked = true;
    } else if (filterHop === "Male") {
        filterMale.checked = true;
        filterFemale.checked = false;
    } else {
        filterMale.checked = false;
        filterFemale.checked = true;
    }

    document.getElementById("vibrate").checked = localStorage.getItem("vibrate");
    document.getElementById("sound").checked = localStorage.getItem("sound");
}

function settings_changeRFID() {
    rfid = document.getElementById("txtNewRFID").value;
    uid = document.getElementById("txtNewUID").value;
    settings_checkRFID(rfid, uid);
    if (tagAvailable) {
        settings_updateRFID(rfid, uid);
    }
}

function settings_checkRFID(rfid, uid) {
    // set tag checker flag initially to false
    tagAvailable = false;
    //check if user types in correct password. Validate tag if correct
    if (document.getElementById("txtRFIDChangePass").value === userPass) {
        validateTag(rfid, uid);
    } else
        alert("Incorrect password");
    // window.plugins.toast.showShortCenter("Incorrect password");
}

function settings_updateRFID(newRFID, newUID) {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/updaterfid?id=' + currentUserID + '&rfid=' + newRFID + '&uid=' + newUID,
        function(jsonData) {
            if (jsonData.flag === "true") {
                userRFID = newRFID;
                // window.plugins.toast.showShortCenter("Save success");
            } else
            //window.plugins.toast.showShortCenter("Save failed");
                changePageEvent('Home');
        })
        .fail(function() {
            changePageEvent('Home');
            // window.plugins.toast.showShortCenter("No internet connection");
        });
}

function settings_clearRFID() {
    document.getElementById("txtNewRFID").value = "";
    document.getElementById("txtNewUID").value = "";
    document.getElementById("txtRFIDChangePass").value = "";
}

function settings_changePass() {
    if (document.getElementById("txtPasswordChangePass").value === userPass && document.getElementById("txtPasswordNewPass").value === document.getElementById("txtPasswordConfirmPass").value) {
        var newPass = document.getElementById("txtPasswordNewPass").value;
        $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/updatepass?id=' + currentUserID + '&password=' + newPass,
            function(jsonData) {
                if (jsonData.flag === "true") {
                    userPass = newPass;
                    // window.plugins.toast.showShortCenter("New password set");
                } else
                // window.plugins.toast.showShortCenter("Password save failed");
                    changePageEvent('Home');
            });
    } else
        alert("Incorrect password");
    // window.plugins.toast.showShortCenter("Incorrect password");
}

function settings_clearPass() {
    document.getElementById("txtPasswordChangePass").value = "";
    document.getElementById("txtPasswordNewPass").value = "";
    document.getElementById("txtPasswordConfirmPass").value = "";
}

function settings_showPass() {
    if (document.getElementById("txtSettingsPass").getAttribute("type") === "password")
        document.getElementById("txtSettingsPass").setAttribute("type", "text");
    else
        document.getElementById("txtSettingsPass").setAttribute("type", "password");
}

function settings_editUser() {
    var flag = false;
    var username = document.getElementById("txtSettingsUsername").value;
    var about = document.getElementById("txtSettingsAbout").value;
    var email = document.getElementById("txtSettingsEmail").value;
    var gender = document.getElementById("txtSettingsGender").value;
    if (username !== userFullName)
        validateUser(username);
    else
        usernameAvailable = true;
    validateEmail(email);
    if (usernameAvailable && emailAvailable) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost/ProtosLabs/HopData/index.php/hop/updateuserprofile?id=' + currentUserID + '&username=' + username +
                '&email=' + email + '&about=' + about + '&gender=' + gender,
            dataType: 'json',
            async: false,
            success: function(jsonData) {
                if (jsonData.flag === 'true') {
                    userFullName = username;
                    userAbout = about;
                    userEmail = email;
                    userGender = gender;
                    flag = true;
                    // window.plugins.toast.showShortCenter("Update success");
                } else {
                    flag = false;
                    // window.plugins.toast.showShortCenter("Update failed");
                }
            },
            fail: function(jsonData) {
                flag = false;
                //  window.plugins.toast.showShortCenter("No internet connection");
            }
        });
    } else {
        //window.plugins.toast.showShortCenter("Fields are in wrong format");
        flag = false;
    }
    if (flag)
        return true;
    else
        return false;
}

function settings_filterCheckbox(checkbox) {

    var filterBox = document.getElementById(checkbox);

    if (filterBox.checked) {
        $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/updatefilter?id=" + currentUserID + "&type=" + checkbox + "&value=" + 1);
        localStorage.setItem(checkbox, 1);
    } else {
        $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/updatefilter?id=" + currentUserID + "&type=" + checkbox + "&value=" + 0);
        localStorage.setItem(checkbox, 0);
    }

    if (checkbox === "filterMale" || checkbox === "filterFemale")
        settings_checkFilter();
}

function settings_checkFilter() {

    var filterMale = localStorage.getItem("filterMale");
    var filterFemale = localStorage.getItem("filterFemale");
    if (filterMale == 1 && filterFemale == 1)
        localStorage.setItem("filterHop", "Both");
    else if (filterMale == 1)
        localStorage.setItem("filterHop", "Male");
    else
        localStorage.setItem("filterHop", "Female");
}


// PHONE API TEST

function testVibrate() {
    navigator.notification.vibrate(2000);
}

function showAlert() {
    navigator.notification.alert(
        'You are the winner!', // message
        alertDismissed, // callback
        'Game Over', // title
        'Done' // buttonName
    );
}

function alertDismissed() {
    // do something
}

function getPhoto() {
    var destinationType = navigator.camera.DestinationType;
    var pictureSource = navigator.camera.PictureSourceType;
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 100,
        // targetWidth: 500,
        // targetHeight: 500,
        encodingType: navigator.camera.EncodingType.JPEG,
        destinationType: destinationType.DATA_URL,
        sourceType: pictureSource.SAVEDPHOTOALBUM
    });
}

function onPhotoURISuccess(imageURI) {

    var imageBase64 = "data:image/jpeg;base64," + imageURI;

    $.post("http://localhost/ProtosLabs/HopData/index.php/hop/updateimage?", {
            id: currentUserID,
            image: imageBase64
        },
        function(jsonData) {
            if (jsonData.flag === "true")
                alert("Image saved");
            // window.plugins.toast.showShortCenter("Image saved");
            else
                alert("Image not saved");
            // window.plugins.toast.showShortCenter("Image not saved");
        })
        .fail(function() {
            //window.plugins.toast.showShortCenter("No internet connection");
        });
}

function onFail(message) {
    //window.plugins.toast.showShortCenter("Failed because: " + message);
}