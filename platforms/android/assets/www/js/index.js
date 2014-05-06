// Current User
var currentUserID = "";
var clubCurrentId = '0';
// Current Page
var pageSelected = "Login";
var profilePicDirectory = "/ProtosLabs/ProtosLabs.Hop/www/resources/profile_pictures/";
var barProfilePicDirectory = "/ProtosLabs/ProtosLabs.Hop/www/resources/barprofile_pictures/"
//Home Global Variables
var clubCurrent = '3';
var notifTimer;
//User Panel Global Variables
//Search Global Variables
var areaListing = {}
var selectedArea = "NONE";
var selectedAreadId = "NONE";
var selectedBar = "NONE";
var selectedBarId = "NONE";
var selectedBarList = [];
//Profile Global Variables
var userID = "NONE";
var userFullName = "LUKE BEERWALKER";
var userTitle = "The diver";
var experience = 500;
var nextLevel = 2000;
var expBarValue = (experience / nextLevel) * 100;
var userStatus = 1;
var userLevel = "";
var userStamina = 0;
var userEmail = 0;
var userGender = "";
var userRFID = "";
var userPass = "";
var userAbout = "";
var userClass = "";

// FILTER //

var settingsFilterMale = 1;
var settingsFilterFemale = 1;
var settingsVibrate = 1;
var settingsSound = 1;


//LastModified Global Variables
var panelCurrentUserLastmodified = "";
var pageHomeLastModified = "";
var pageSearchLastModified = "";
var pageChallengesLastModified = "";
var pageProfileLastModified = "";
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
//Mingle Global Variables
var mingleExchangeID = "";
var mingleStaminaConsume = 100;
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
/*
function changePageEvent(selected,key){
alert('hi');
pageSelected = selected;
userID = currentUserID;
};
*/
function updateLoginPage() {
    checkStorage();
}

function updateHomePage() {
    clearList("activityList");
    refreshHome();
    getMingleRequests();
};

function updateSearchPage() {
    //    alert(pageSelected);
    clearList("listArea");
    getAreas();
};

function updateMainProfilePage() {
    getProfileInfo(currentUserID);
};

function updateUserProfilePage() {
    clearButton("mingleButton");
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

    var btnHopReady = $("#btnMingleYes");
    var btnHopNotReady = $("#btnMingleNo");
    var chosenElement = document.getElementById(elementId);
    chosenElement.removeClass("buttonNotSelected");
    chosenElement.addClass("buttonSelected");

    if (userStatus == 1)
        chosenElement.addClass("buttonReady");
    else
        chosenElement.addClass("buttonNotReady");

    if (elementId === "btnMingleYes") {
        btnHopNotReady.removeClass("buttonSelected");
        btnHopNotReady.removeClass("buttonNotReady");
        btnHopNotReady.addClass("buttonNotSelected");
    } else {
        btnHopReady.removeClass("buttonSelected");
        btnHopReady.removeClass("buttonReady");
        btnHopReady.addClass("buttonNotSelected");
    }
};

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
            userStamina = localStorage.getItem('stamina');
            refreshStamina();
            changePageEvent('Home');
            window.location.href = "#pageHome";
        }
    }
}

function login() {
    username = document.getElementById('txtLoginUsername').value;
    password = document.getElementById('txtLoginPassword').value;
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/login?username=' + username + '&password=' + password,
        function(jsonData) {
            if (jsonData.error == '0') {
                storeUserData(jsonData.data[0]);
                refreshStamina();
                db = window.openDatabase("HopLocalDB", "1.0", "Hop local database", 5 * 1024 * 1024);
                startNotificationUpdate();
                changePageEvent('Home');
                $.mobile.changePage("#pageHome", {
                    changeHash: true,
                    transition: "pop",
                });
            } else if (jsonData.error == '1')
                alert("Username or password invalid");
            // window.plugins.toast.showShortCenter("Username or password invalid");
        })
        .fail(function() {
            window.plugins.toast.showShortCenter("No internet connection");
            db.transaction(function(tx) {
                tx.executeSql("SELECT id,username,password,stamina,image FROM userInfo WHERE username=? AND password=?", [username, password], function(tx, res) {
                    if (res.rows.length) {
                        localStorage.setItem('id', 1);
                        localStorage.setItem('username', "superkidluigi");
                        localStorage.setItem('stamina', 80);
                        localStorage.setItem('image', "1.jpg");
                        localStorage.setItem("filterMale", 1);
                        localStorage.setItem("filterFemale", 1);
                        localStorage.setItem("vibrate", 1);
                        localStorage.setItem("sound", 1);

                        currentUserID = 1;
                        userStamina = 80;
                        userImage = "1.jpg";
                        changePageEvent('Home');
                        $.mobile.changePage("#pageHome", {
                            changeHash: true,
                            transition: "pop",
                        });
                    } else
                        alert('Username or password invalid');
                });
            });
        });
}

function storeUserData(data) {

    localStorage.setItem('id', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('stamina', data.stamina);
    localStorage.setItem('image', data.image);
    localStorage.setItem("filterMale", data.filterMale);
    localStorage.setItem("filterFemale", data.filterFemale);
    localStorage.setItem("vibrate", data.vibrate);
    localStorage.setItem("sound", data.sound);
    currentUserID = data.id;
    userStamina = data.stamina;
    userImage = data.image;
}

function refreshStamina() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost/ProtosLabs/HopData/index.php/hop/refreshstamina?id=' + currentUserID,
        dataType: 'json',
        async: false,
        success: function(jsonData) {
            if (jsonData.flag === 'true') {
                userStamina = jsonData.data[0].stamina;
                alert('Stamina refreshed!');
            } else
                alert('Wait for tomorrow');
        },
        fail: function(jsonData) {
            alert('No internet connection');
        }
    });
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
    if (localStorage.getItem('id') !== null)
        localStorage.removeItem('id');
    if (localStorage.getItem('username') !== null)
        localStorage.removeItem('username');
    if (localStorage.getItem('dbCreated') !== null)
        localStorage.removeItem('dbCreated');
    if (localStorage.getItem('stamina') !== null)
        localStorage.removeItem('stamina');
}

function leave() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/leave?id=' + currentUserID,
        function(jsonData) {
            document.getElementById("clubName").innerHTML = "HOP";
        })
        .fail(function() {
            alert("No internet connection")
        });
    window.location.reload();
}
// FOR HOME PAGE //
function getUsername() {
    document.getElementById("panelProfilePicThumb").src = profilePicDirectory + localStorage.getItem('image');
    document.getElementById("leaveBar").innerHTML = "Leave " + clubCurrent;
}

function refreshHome() {

    $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/currentbar?id=" + currentUserID,
        function(jsonData) {
            if (jsonData.error === '0') {
                clubCurrent = jsonData.data[0].name;
                clubCurrentId = jsonData.data[0].id;
                refreshCurrentUsersList();
            } else {
                clubCurrent = "Hop";
                clubCurrentId = "0";
            }
            document.getElementById("clubName").innerHTML = clubCurrent;
        })
        .fail(function() {
            db.transaction(function(tx) {
                tx.executeSql("SELECT bar_id FROM userInfo WHERE id=?", [currentUserID], function(tx, res) {
                    if (res.rows.length) {
                        tx.executeSql("SELECT id, name FROM bars WHERE id=?", [res.rows.item(0).bar_id], function(tx, checkres) {
                            if (checkres.rows.length) {
                                clubCurrent = checkres.rows.item(0).name;
                                clubCurrentId = checkres.rows.item(0).id;
                            } else {
                                clubCurrent = "Hop";
                                clubCurrentId = "0";
                            }
                            document.getElementById("clubName").innerHTML = clubCurrent;
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
    if (clubCurrentId != '0') {
        $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/users?bar=' + clubCurrentId,
            function(jsonData) {
                if (jsonData.flag === 'true') {
                    $.each(jsonData.users, function(i, data) {
                        if (data.id !== currentUserID)
                            populateCurrentUsersList(data.id, data.username, data.image, data.status_id);
                    });
                }
            })
            .fail(function() {
                alert("No internet connection");
            });
    }
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
        checkForMingleAccept()
    }, 10000);
    timerStart = true;
}

function stopNotificationUpdate() {
    if (timerStart) {
        clearInterval(notifTimer);
        timerStart = false;
    }
}

function checkForMingleAccept() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/checkmingleaccept?user_id=' + currentUserID,
        function(jsonData) {
            if (jsonData.flag === 'true') {
                $.each(jsonData.data, function(i, data) {
                    alert("Meet " + data.receiver_id + " at the counter");
                    deleteMingle(data.user_id, data.receiver_id);
                });
            }
        })
        .fail(function() {
            alert("No internet connection");
        });
    stopNotificationUpdate();
}

function deleteMingle(user_id, receiver_id) {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/deletemingle?user_id=' + user_id + '&receiver_id=' + receiver_id, function(jsonData) {});
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
            return "Qc";
            break;
        case "Makati":
            return "Bgc";
            break;
        case "Tomas Morato":
            return "Malate";
            break;
        case "Quezon City":
            return "Pasay";
            break;
        case "Pasig":
            return "Makati";
            break;
        default:
            return null;
            break;
    }
}

function getAreas() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/getallarea',
        function(jsonData) {
            $.each(jsonData.data, function(i, data) {
                populateArealist(data.id, data.name);
            });
        })
        .fail(function() {
            // alert("No internet connection");
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
    a.className = "ui-btn ui-icon-carat-r customAreaList customBtn" + getAreaId(name);
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
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/bardetails?area_id=' + id,
        function(jsonData) {
            $.each(jsonData.bar, function(i, data) {
                populateBarList(data.id, data.name, data.maleCount, data.femaleCount);
            });
        })
        .fail(function() {
            //alert("No internet connection");
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

    $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/searchbar?bar_id=" + selectedBarId,
        function(jsonData) {
            barName = jsonData.data[0].name;
            barAddress = jsonData.data[0].address;
            barDescription = jsonData.data[0].description;
            barImage = jsonData.data[0].image;
            barDaysOpen = jsonData.data[0].daysOpen;
            barBudget = jsonData.data[0].budget;
            barEntranceFee = jsonData.data[0].entranceFee;
            barPopularFor = jsonData.data[0].popular;
            barCategory = jsonData.data[0].category;
            barMaleCount = jsonData.data[0].maleCount;
            barFemaleCount = jsonData.data[0].femaleCount;
            barContactInfo = jsonData.data[0].contactNumber;
            //  barMapUrl = jsonData.data[0].mapUrl;
            //  
            barProfilePicDirectory = "/ProtosLabs/ProtosLabs.Hop/www/resources/barprofile_pictures/";
            setBarProfile();

        })
        .fail(function() {
            //alert("No internet connection");
            db.transaction(function(tx) {
                tx.executeSql("SELECT name,address,description,image,daysOpen,budget,entranceFee, " +
                    "popularFor,category,maleCount,femaleCount,contactNumber FROM bars WHERE id=?", [selectedBarId], function(tx, res) {
                        if (res.rows.length) {
                            barName = res.rows.item(0).name;
                            barAddress = res.rows.item(0).address;
                            barDescription = res.rows.item(0).description;
                            barImage = res.rows.item(0).image;
                            barDaysOpen = res.rows.item(0).daysOpen;
                            barBudget = res.rows.item(0).budget;
                            barEntranceFee = res.rows.item(0).entranceFee;
                            barPopularFor = res.rows.item(0).popularFor;
                            barCategory = res.rows.item(0).category;
                            barMaleCount = res.rows.item(0).maleCount;
                            barFemaleCount = res.rows.item(0).femaleCount;
                            barContactInfo = res.rows.item(0).contactNumber;

                            barProfilePicDirectory = "resources/barprofile_pictures/";
                            setBarProfile();

                        }
                    });
            });
        });
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
function getMingleRequests() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/getminglerequests?id=' + currentUserID,
        function(jsonData) {
            if (jsonData.error == '0') {
                $.each(jsonData.data, function(i, data) {
                    populateActivityList(data.id, data.user_id, data.username);
                });
            }
        })
        .fail(function() {
            //alert("No internet connection");
        });
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
        var currentMingleID = id;
        var currentSenderName = username;
        return function() {
            initializePopup(currentMingleID, currentSenderName);
        }
    })();
    li.appendChild(a);
    ul.appendChild(li);
}

function initializePopup(id, name) {
    mingleExchangeID = id;
    document.getElementById("challengeTitle").innerHTML = "Hop Request";
    document.getElementById("challengeContent").innerHTML = "Accept " + name + "'s Hop request?";
}

function mingleAccept() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/acceptminglerequest?id=' + mingleExchangeID,
        function(jsonData) {
            getRandomPlace();
        })
        .fail(function() {
            alert('No internet connection')
        });
}

function getRandomPlace() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/randomarea',
        function(jsonData) {
            alert(jsonData.data[0].area);
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

    if (navigator.network.connection.type !== "none") {
        $.getJSON("http://localhost/ProtosLabs/HopData/index.php/hop/searchprofile?id=" + id,
            function(jsonData) {
                if (jsonData.error == 0) {
                    experience = jsonData.data[0].currentExp;
                    nextLevel = jsonData.data[0].nextLevel;
                    expBarValue = (experience / nextLevel) * 100;
                    userStatus = jsonData.data[0].status_id;
                    userFullName = jsonData.data[0].username;
                    userTitle = jsonData.data[0].title;
                    userLevel = jsonData.data[0].level;
                    userImage = jsonData.data[0].image;
                    userEmail = jsonData.data[0].email;
                    userGender = jsonData.data[0].gender;
                    userRFID = jsonData.data[0].RFID;
                    userPass = jsonData.data[0].password;
                    userAbout = jsonData.data[0].about;
                    userClass = jsonData.data[0].class;

                    profilePicDirectory = "/ProtosLabs/ProtosLabs.Hop/www/resources/profile_pictures/";

                    if (pageSelected === "AccountSettings")
                        setProfileSettings();
                    else if (pageSelected === "MainProfile") {
                        $(".dial").val(expBarValue).trigger('change');
                        setMainProfileInfo();
                    } else
                        setUserProfileInfo();
                }
            });
    } else {
        window.plugins.toast.showShortTop("No internet connection");
        db.transaction(function(tx) {
            tx.executeSql("SELECT id,rfid,username,password,class,about,status_id,level,title,currentExp,expNeeded,image,email,gender FROM userInfo WHERE id=?", [id], function(tx, res) {
                if (res.rows.length) {
                    experience = res.rows.item(0).currentExp;
                    nextLevel = res.rows.item(0).expNeeded;
                    expBarValue = (experience / nextLevel) * 100;
                    userStatus = res.rows.item(0).status_id;
                    userFullName = res.rows.item(0).username;
                    userTitle = res.rows.item(0).title;
                    userLevel = res.rows.item(0).level;
                    userImage = res.rows.item(0).image;
                    userEmail = res.rows.item(0).email;
                    userGender = res.rows.item(0).gender;
                    userRFID = res.rows.item(0).rfid;
                    userPass = res.rows.item(0).password;
                    userAbout = res.rows.item(0).about;
                    userClass = res.rows.item(0).class;

                    profilePicDirectory = "resources/profile_pictures/";

                    if (pageSelected === "AccountSettings")
                        setProfileSettings();
                    else if (pageSelected === "MainProfile") {
                        $(".dial").val(expBarValue).trigger('change');
                        setMainProfileInfo();
                    } else
                        setUserProfileInfo();
                }
            });
        });
    }
}

function setProfileInfo() {

    // TO DO
}


function setMainProfileInfo() {

    var html_btnHopReady = $("#btnMingleYes");
    var html_btnHopNotReady = $("#btnMingleNo");

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
    // document.getElementById("mainProfileUserLevel").innerHTML = "Lvl " + userLevel;
    document.getElementById("mainProfileUserTitle").innerHTML = userTitle;
    //document.getElementById("mainProfileExperienceData").innerHTML = experience + "/" + nextLevel;
    document.getElementById("mainProfileStamina").innerHTML = "Stamina: " + userStamina;
    document.getElementById("mainProfileClass").innerHTML = userClass;
}

function setUserProfileInfo() {
    document.getElementById('userProfilePic').src = profilePicDirectory + userImage;
    document.getElementById("userProfileUserFullName").innerHTML = "Lvl " + userLevel + " " + userFullName;
    document.getElementById("userProfileAbout").innerHTML = userAbout;
    // document.getElementById("userProfileUserLevel").innerHTML = "Lvl " + userLevel;
    document.getElementById("userProfileUserTitle").innerHTML = "\"" + userTitle + "\"";
    document.getElementById("userProfileClass").innerHTML = userClass;
    if (userStatus == 1) {
        createMingleButton();
    }
}

function createMingleButton() {
    var div = document.getElementById("mingleButton");
    var button = document.createElement("button");
    button.id = "btnMingle";
    button.className = "ui-btn ui-btn-inline ui-corner-all";
    button.innerHTML = "Hop with " + userFullName;
    button.onclick = (function() {
        return function() {
            checkStamina();
        }
    })();
    div.appendChild(button);
}

function checkStamina() {
    if ((userStamina - mingleStaminaConsume) >= 0) {
        userStamina -= mingleStaminaConsume;
        $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/consumestamina?id=' + currentUserID + '&stamina=' + userStamina,
            function(jsonData) {
                if (jsonData.flag === 'true') {
                    localStorage.setItem('stamina', userStamina);
                    sendMingleRequest();
                }
            })
            .fail(function() {
                alert("No internet connection");
            });
    } else
        alert('No stamina left to mingle');
}

function sendMingleRequest() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/sendminglerequest?user_id=' + currentUserID + '&receiver_id=' + userID,
        function(jsonData) {
            if (jsonData.flag === 'false')
                alert('Mingle request to ' + userFullName + ' already sent');
            else
                alert('Mingle request to ' + userFullName + ' success');
        })
        .fail(function() {
            alert("No internet connection");
        });
}
// FOR STATUS //
function toggleStatus(elementId) {
    if (userID === currentUserID) {
        if (userStatus == 1)
            userStatus = 2;
        else
            userStatus = 1;
        saveNewStatus();
        updateStatusButton(elementId);
    }
}

function saveNewStatus() {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/savestatus?id=' + userID + '&statusId=' + userStatus, function(jsonData) {})
        .fail(function() {
            alert("No internet connection")
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
    if (tagAvailable)
        return true;
    else
        return false;
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
            }
        });
    } else {
        alert('Incorrect format');
        console.log('tag fail');
        tagAvailable = false;
        // alert('Enter a valid RFID');
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
                    // document.getElementById('labelSignupUsername').value = "Username valid";
                } else {
                    usernameAvailable = false;
                    console.log('username fail');
                    // document.getElementById('labelSignupUsername').value = "Username already in use";
                    //          alert('Username already in use.');
                    $("#txtSignupUsername").focus();
                }
            }
        });
    } else {
        usernameAvailable = false;
        console.log('username fail');
        //alert('Username should at least be 6 characters');
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
        //   alert("Not a valid email address");
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
        //     alert("Password should be at least 6 characters");
        $("#txtSignupPassword").focus();
    }
    allFieldsValidated();
}

function saveUser() {
    signupUsername = document.getElementById('txtSignupUsername').value;
    signupPassword = document.getElementById('txtSignupPassword').value;
    signupEmail = document.getElementById('txtSignupEmail').value;
    //save user here
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/saveuser?username=' + signupUsername + '&password=' + signupPassword +
        '&RFID=' + signupRFID + '&gender=Male' + '&email=' + signupEmail,
        function(jsonData) {
            if (jsonData.flag === "true")
                alert("Save success");
        })
        .fail(function() {
            alert("No internet connection");
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
        $('.progress-bar').slider
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

    document.getElementById("txtSettingsUsername").value = userFullName;
    document.getElementById("txtSettingsRFID").value = userRFID;
    document.getElementById("txtSettingsEmail").value = userEmail;
    document.getElementById("txtSettingsGender").value = userGender;
    document.getElementById("txtSettingsPass").value = userPass;
    document.getElementById("txtSettingsAbout").value = userAbout;
    document.getElementById("filterMale").checked = localStorage.getItem("filterMale");
    document.getElementById("filterFemale").checked = localStorage.getItem("filterFemale");
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
        alert('Incorrect password');
}

function settings_updateRFID(newRFID, newUID) {
    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/updaterfid?id=' + currentUserID + '&rfid=' + newRFID + '&uid=' + newUID,
        function(jsonData) {
            if (jsonData.flag === "true") {
                userRFID = newRFID;
                alert("Save success");
            } else
                alert("Save failed");
            changePageEvent('Home');
        })
        .fail(function() {
            changePageEvent('Home');
            alert("No internet connection");
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
                    alert('New password set');
                } else
                    alert("Password save failed");
                changePageEvent('Home');
            });
    } else
        alert("Incorrect password");
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
                    alert('Update success');
                } else {
                    flag = false;
                    alert("Update failed");
                }
            },
            fail: function(jsonData) {
                flag = false;
                alert('No internet connection');
            }
        });
    } else {
        alert("Fields in wrong format");
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
}


$(function() {
    $(".dial ").knob();
});

function checkTimer() {
    var i = window.setInterval(function() {
        alert('hi');
    }, 2000);
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
            else
                alert("Image not saved");
        })
        .fail(function() {
            alert("No internet connection");
            db.transaction(function(tx) {
                tx.executeSql("UPDATE userInfo SET image=? WHERE id=?", [imageBase64, currentUserID]);

                tx.executeSql("SELECT image FROM userInfo WHERE id=?", [currentUserID], function(tx, res) {
                    var largeImage = document.getElementById("mainProfilePic");

                    largeImage.src = res.rows.item(0).image;
                });
            });
        });
}

function onFail(message) {
    alert('Failed because: ' + message);
}


/*
function initializeMap(){
var mapOptions = {
zoom: 8,
center: new google.maps.LatLng(-34.397, 150.644)
};
var map=new google.maps.Map(document.getElementById("
googleMap ")
,mapOptions);
google.maps.event.addDomListener(window, 'load', initialize);
}
*/