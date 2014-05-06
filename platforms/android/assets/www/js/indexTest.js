// Current User

var currentUserID = "";
var clubCurrentId = "";

// Current Page
var pageSelected = "Login";
var profilePicDirectory = "resources/profile_pictures/";
var barProfilePicDirectory = "resources/barprofile_pictures/"

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
var status = "NONE";
var userLevel = "";
var userStamina = 0;
var userEmail = 0;
var userGender = "";
var userRFID = "";

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
var rfidAvailable = false;

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

var username;
var password;
var id;
var url = "#pageHome";
var db;
var result = [];
var barsLastSyncDate;
var usersLastSycnDate;
var lastEntry = "";

//Timer Global Variables

var timerStart = false;

function showAlert() {
    navigator.notification.alert(
        'You are the winner!', // message
        alertDismissed, // callback
        'Game Over', // title
        'Done' // buttonName
    );
}

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
};

function updateHomePage() {
    //alert(pageSelected);  
    refreshHome();
};

function updateSearchPage() {
    clearList("listArea");
    getAreas();
};

function updateActivityPage() {
    //    alert(pageSelected);
    clearList("activityList");
    getMingleRequests();
};

function updateMainProfilePage() {
    getProfileInfo(currentUserID);
};

function updateUserProfilePage() {
    clearButton("mingleButton");
    getProfileInfo(userID);
};

function updateBarListPage() {
    //   alert(pageSelected);
    document.getElementById("areaName").innerHTML = selectedArea;
    clearList("listBar");
    getBars(selectedAreaId);
};

function updateBarProfilePage() {
    getBarProfile();
};

function updateStatusButton(elementId) {

    $("#" + elementId).removeClass("buttonNotSelected");
    $("#" + elementId).addClass("buttonSelected");

    if (elementId === "btnMingleYes") {
        $("#btnMingleNo").removeClass("buttonSelected");
        $("#btnMingleNo").addClass("buttonNotSelected");
    } else {
        $("#btnMingleYes").removeClass("buttonSelected");
        $("#btnMingleYes").addClass("buttonNotSelected");
    }

};

function updateAccountSettings() {
    //getProfileInfo(currentUserID);
    // setProfileSettings();
};

//EVENT AFTER DISPLAYING A PAGE
$(document).on("pageshow", '*[data-role="page"]', function() {
    //alert(pageSelected);
    //setSelectedButton();
});

//EVENT BEFORE DISPLAYING A PAGE
$(document).on("pagebeforeshow", '*[data-role="page"]', function() {
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
        case "Challenges":
            updateActivityPage();
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



// FOR LOGIN PAGE //
function checkStorage() {
    if ('localStorage' in window && window['localStorage'] !== null) {
        if (localStorage.getItem('id') !== null) {
            db = window.openDatabase("HopLocalDB", "1.0", "Hop local database", 5 * 1024 * 1024);
            currentUserID = localStorage.getItem('id');
            userStamina = localStorage.getItem('stamina');
            //refreshStamina();
            changePageEvent("Home");
            window.location.href = "#pageHome";
        }
    }
}

function login() {

    username = document.getElementById('txtLoginUsername').value;
    password = document.getElementById('txtLoginPassword').value;

    db.transaction(function(tx) {
        tx.executeSql("SELECT id,username,stamina,image FROM userInfo WHERE username=? AND password=?", [username, password], function(tx, res) {
            if (res.rows.length) {
                storeUserData(res);
                changePageEvent('Home');
                $.mobile.changePage("#pageHome", {
                    changeHash: true,
                    transition: "pop",
                });
            } else
                alert('Username or password invalid');
        });
    });
}

function storeUserData(data) {
    localStorage.setItem('id', data.rows.item(0).id);
    localStorage.setItem('username', data.rows.item(0).username);
    localStorage.setItem('stamina', data.rows.item(0).stamina);
    localStorage.setItem('image', data.rows.item(0).image);
    currentUserID = data.rows.item(0).id;
    userStamina = data.rows.item(0).stamina;
    userImage = data.rows.item(0).image;
}

function refreshStamina() {

}

function logout() {
    removeStorageItems();
    clearLoginElements();
    changePageEvent("Login");
    //stopNotificationUpdate();
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
    if (localStorage.getItem('stamina') !== null)
        localStorage.removeItem('stamina');
    if (localStorage.getItem('image') !== null)
        localStorage.removeItem('image');
}

function leave() {

    db.transaction(function(tx) {
        tx.executeSql("UPDATE userInfo SET bar_id=? WHERE id=?", [0, currentUserID], function(tx, res) {});
    });
    window.location.reload();

}



// FOR HOME PAGE //

function getUsername() {

    document.getElementById("panelProfilePicThumb").src = profilePicDirectory + localStorage.getItem('image');

    document.getElementById("leaveBar").innerHTML = "Leave " + clubCurrent;
}

function refreshHome() {

    db.transaction(function(tx) {
        tx.executeSql("SELECT bar_id FROM userInfo WHERE id=?", [currentUserID], function(tx, res) {
            if (res.rows.length) {
                clubCurrentId = res.rows.item(0).bar_id;

                refreshCurrentUsersList();
                db.transaction(function(ctx) {
                    ctx.executeSql("SELECT name FROM bars WHERE id=?", [clubCurrentId], function(tx, checkres) {
                        if (checkres.rows.length)
                            clubCurrent = checkres.rows.item(0).name;
                        else
                            clubCurrent = "Hop";

                        document.getElementById("clubName").innerHTML = clubCurrent;
                        document.getElementById("btnTwitter").setAttribute("value", "@" + clubCurrent + " right now via @Hop_Ph");
                        document.getElementById("btnFacebook").setAttribute("value", "https://www.facebook.com/consoul88");
                    });
                });
            }
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
    if (clubCurrentId != 0) {
        db.transaction(function(tx) {
            tx.executeSql("SELECT id,username,image,status_id FROM userInfo WHERE bar_id=?", [clubCurrentId], function(tx, res) {
                if (res.rows.length) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).id !== currentUserID)
                            populateCurrentUsersList(res.rows.item(i).id, res.rows.item(i).username, res.rows.item(i).image, res.rows.item(i).status_id);
                    }
                }
            });
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

    $.getJSON('http:/ / localhost / my_sites / HopData / index.php / site / checkmingleaccept ? user_id = ' + currentUserID,
        function(jsonData) {
            if (jsonData.flag === 'true ') {
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
    $.getJSON('http : //localhost/my_sites/HopData/index.php/site/deletemingle?user_id=' + user_id + '&receiver_id=' + receiver_id, function(jsonData) {});
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
    console.log('start to get areas');
    db.transaction(function(tx) {
        tx.executeSql("SELECT id,name FROM area", [], function(tx, res) {
            if (res.rows.length) {
                for (var i = 0; i < res.rows.length; i++) {
                    populateArealist(res.rows.item(i).id, res.rows.item(i).name);
                }
            }
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

    db.transaction(function(tx) {
        tx.executeSql("SELECT id,name,maleCount,femaleCount FROM bars WHERE area_id=?", [id], function(tx, res) {
            if (res.rows.length) {
                for (var i = 0; i < res.rows.length; i++) {
                    populateBarList(res.rows.item(i).id, res.rows.item(i).name, res.rows.item(i).maleCount, res.rows.item(i).femaleCount);
                }
            }
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

                    setBarProfile();
                }
            });
    });
}


function setBarProfile() {

    $('#barProfilePic').css("background-image", "url(" + barProfilePicDirectory + barImage + ")");
    $('#barProfilePic').css("background-size", "cover");
    $('#barProfileName').html(barName);
    $('#barProfileMaleCount').html("Male: " + barMaleCount);
    $('#barProfileFemaleCount').html("Female: " + barFemaleCount);
    $('#barProfileAddress').html(barAddress);
    $('#barProfileDesc').html(barDescription);
    $('#barProfileCategory').html(barCategory);
    $('#barProfileDaysOpen').html(barDaysOpen);
    $('#barProfileBudget').html(barBudget);
    $('#barProfileEntrance').html(barEntranceFee);
    $('#barProfilePopular').html(barPopularFor);
    $('#barProfileContact').html(barContactInfo);

}





// FOR ACTIVITY PAGE //




function getMingleRequests() {

    db.transaction(function(tx) {
        tx.executeSql("SELECT id,user_id FROM mingle WHERE receiver_id=?", [currentUserID], function(tx, res) {
            if (res.rows.length) {
                for (var i = 0; i < res.rows.length; i++) {

                    // TO DO : get username of mingle requestor
                    // 
                    // db.transaction(function(ctx) {
                    // ctx.executeSql("SELECT username FROM userInfo WHERE id=?", [res.rows.item(i).user_id], function(tx, checkres) {
                    populateActivityList(res.rows.item(i).id, res.rows.item(i).user_id, "Protos");
                    //});
                    //});
                }
            }
        });
    });
}

function populateActivityList(id, sender_id, username) {

    var ul = document.getElementById("activityList");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.innerHTML = username + " wants to mingle";
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
    document.getElementById("challengeTitle").innerHTML = "Mingle Request";
    document.getElementById("challengeContent").innerHTML = "Accept " + name + "'s mingle request?";

}

function mingleAccept() {


    $.getJSON('http://localhost/my_sites/HopData/index.php/site/acceptminglerequest?id=' + mingleExchangeID,
        function(jsonData) {
            getRandomPlace();
        })
        .fail(function() {
            alert('No internet connection')
        });

}

function getRandomPlace() {

    $.getJSON('http://localhost/my_sites/HopData/index.php/site/randomarea',
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

    db.transaction(function(tx) {
        tx.executeSql("SELECT id,username,status_id,level,title,currentExp,image,email,gender FROM userInfo WHERE id=?", [id], function(tx, res) {
            if (res.rows.length) {
                db.transaction(function(ctx) {
                    ctx.executeSql("SELECT expNeeded FROM level WHERE id=?", [res.rows.item(0).level], function(tx, checkres) {
                        experience = res.rows.item(0).currentExp;
                        nextLevel = checkres.rows.item(0).expNeeded;
                        expBarValue = (experience / nextLevel) * 100;
                        userStatus = res.rows.item(0).status_id;
                        userFullName = res.rows.item(0).username;
                        userTitle = res.rows.item(0).title;
                        userLevel = res.rows.item(0).level;
                        userImage = res.rows.item(0).image;
                        userEmail = res.rows.item(0).email;
                        userGender = res.rows.item(0).gender;
                        userRFID = res.rows.item(0).id;

                        if (id == currentUserID) {
                            $("#mainProfileKnob").val(expBarValue).trigger('change');
                            setMainProfileInfo();
                        } else
                            setUserProfileInfo();
                    });
                });
            }
        });
    });
}

function setMainProfileInfo() {

    if (userStatus == 1) {
        $("#btnMingleYes").removeClass("buttonNotSelected");
        $("#btnMingleNo").removeClass("buttonSelected");
        $("#btnMingleYes").addClass("buttonSelected");
        $("#btnMingleNo").addClass("buttonNotSelected");
    } else {
        $("#btnMingleYes").removeClass("buttonSelected");
        $("#btnMingleNo").removeClass("buttonNotSelected");
        $("#btnMingleYes").addClass("buttonNotSelected");
        $("#btnMingleNo").addClass("buttonSelected");
    }
    document.getElementById('mainProfilePic').src = profilePicDirectory + userImage;
    document.getElementById("mainProfileUserFullName").innerHTML = userFullName;
    document.getElementById("mainProfileUserLevel").innerHTML = "Lvl " + userLevel;
    document.getElementById("mainProfileUserTitle").innerHTML = userTitle;
    document.getElementById("mainProfileExperienceData").innerHTML = experience + "/" + nextLevel;
    document.getElementById("mainProfileStamina").innerHTML = "Stamina: " + userStamina;
}

function setUserProfileInfo() {

    document.getElementById('userProfilePic').src = profilePicDirectory + userImage;
    document.getElementById("userProfileUserFullName").innerHTML = userFullName;
    document.getElementById("userProfileUserLevel").innerHTML = "Lvl " + userLevel;
    document.getElementById("userProfileUserTitle").innerHTML = "\"" + userTitle + "\"";

    if (userStatus == 1) {
        createMingleButton();
    }
}

function createMingleButton() {
    var div = document.getElementById("mingleButton");
    var button = document.createElement("button");
    button.id = "btnMingle";
    button.className = "ui-btn ui-btn-inline ui-corner-all";
    button.innerHTML = "Mingle";
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

        db.transaction(function(tx) {
            tx.executeSql("UPDATE userInfo SET stamina=? WHERE id=?", [userStamina, currentUserID], function(tx, res) {
                localStorage.setItem('stamina', userStamina);
                sendMingleRequest();
            });
        });
    } else
        alert('No stamina left to mingle');
}

function sendMingleRequest() {

    db.transaction(function(tx) {
        tx.executeSql("SELECT id FROM mingle WHERE user_id=? AND receiver_id=?", [currentUserID, userID], function(tx, res) {
            if (res.rows.length) {
                alert('Mingle request to ' + userFullName + ' already sent');
            } else {
                tx.executeSql("INSERT INTO mingle(user_id,receiver_id) values(?,?)", [currentUserID, userID], function(tx, res) {
                    alert('Mingle request to ' + userFullName + ' success');
                });
            }
        });
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

    db.transaction(function(tx) {
        tx.executeSql("UPDATE userInfo SET status_id=? WHERE id=?", [userStatus, currentUserID], function(tx, res) {});
    });
}

// FOR SIGN UP //

function areAllFieldsValidated() {
    if (usernameAvailable && passwordAvailable && emailAvailable)
        document.getElementById('btnSigunupSubmit').disabled = false;
    else
        document.getElementById('btnSigunupSubmit').disabled = true;
}

function validateUser(username) {

    var usernamePattern = new RegExp('^[0-9A-Za-z]{6,}$');
    if (usernamePattern.test(username) && username !== "") {
        $.ajax({
            type: 'GET',
            url: 'http://localhost/my_sites/HopData/index.php/site/checkUser?username=' + username,
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

    areAllFieldsValidated();
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
    areAllFieldsValidated();
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
    areAllFieldsValidated();
}

function validateRFID(rfid) {

    var rfidPattern = new RegExp('^[0-9]{10,}$');
    if (rfidPattern.test(rfid) && rfid !== "") {
        $.ajax({
            type: 'GET',
            url: 'http://localhost/my_sites/HopData/index.php/site/checkRFID?rfid=' + rfid,
            dataType: 'json',
            async: false,
            success: function(jsonData) {
                if (jsonData.flag === 'true') {
                    console.log('rfid pass');
                    document.getElementById('btnSigunupContinue').disabled = false;
                    //alert('pass');
                } else {
                    console.log('rfid fail');
                    //           alert('RFID already in use.');
                    $("#txtSignupRFID").focus();
                    document.getElementById('btnSigunupContinue').disabled = true;
                }
            }
        });

    } else {
        console.log('rfid fail');
        rfidAvailable = false;
        // alert('Enter a valid RFID');
        $("#txtSignupRFID").focus();
        document.getElementById('btnSigunupContinue').disabled = true;
    }
}

function saveUser() {

    var signupUsername = document.getElementById('txtSignupUsername').value;
    var signupPassword = document.getElementById('txtSignupPassword').value;
    var signupRFID = document.getElementById('txtSignupRFID').value;
    var signupEmail = document.getElementById('txtSignupEmail').value;

    //save user here
    $.getJSON('http://localhost/my_sites/HopData/index.php/site/saveuser?username=' + signupUsername + '&password=' + signupPassword +
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
    document.getElementById('txtSignupUsername').value = "";
    document.getElementById('txtSignupPassword').value = "";
    document.getElementById('txtSignupRFID').value = "";
    document.getElementById('txtSignupGender').value = "";
    document.getElementById('txtSignupEmail').value = "";
}


$(document)
    .on("pageinit", document, function() {
        //set default transition to SLIDE
        $.mobile.changePage.defaults.transition = 'slide';
        $('.progress-bar').slider



        $('#homeSearch').keyup(function() {

            if ($('#homeSearch').val() !== null) {
                if ($('#homeSearch').val() != lastEntry) {
                    console.log('Search keypress');
                    var searchText = $('#homeSearch').val();
                    searchUsers(searchText);
                }
            }
            lastEntry = $('#homeSearch').val();
        });

        // EXP KNOB PROPERTIES
        var myColor = "#0095FF";
        var myKnob = $(".dial").knob({
            'min': 0,
            'max': 100,
            'readOnly': true,
            'width': 210,
            'height': 210,
            'fgColor': myColor,
            'dynamicDraw': true,
            'thickness': 0.2,
            'tickColorizeValues': true,
            'skin': 'tron'
        });
    });

function searchUsers(searchText) {

    if (searchText !== "") {
        $("#listCurrentUsers").children("li").children("a").each(function() {
            var str = this.innerHTML;
            if (str.indexOf(searchText) == 0)
                $(this).parent().css('display', 'list-item');
            else
                $(this).parent().css('display', 'none');
        });
    } else {
        $("#listCurrentUsers").children("li").each(function() {
            $(this).css('display', 'list-item');
        });
    }
}

// SETTINGS

function setProfileSettings() {
    $("#txtSettingsUsername").val(userFullName);
    $("#txtSettingsRFID").val(userRFID);
    $("#txtSettingsEmail").val(userEmail);
    $("#txtSettingsGender").val(userGender);
}

$(function() {
    $(".dial").knob();
});

function checkTimer() {
    var i = window.setInterval(function() {
        alert('hi');
    }, 2000);
}

/*
function initializeMap(){
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644)
    };
    var map=new google.maps.Map(document.getElementById("googleMap")
      ,mapOptions);

    google.maps.event.addDomListener(window, 'load', initialize);

}
*/