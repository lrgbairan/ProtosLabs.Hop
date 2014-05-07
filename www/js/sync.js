var username;
var password;
var id;
var url = "#pageHome";
var db;
var result = [];
var barsLastSyncDate;
var usersLastSycnDate;


function init() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    checkLocalDB();
    FastClick.attach(document.body);
}


function checkLocalDB() {

    db = window.openDatabase("HopLocalDB", "1.0", "Hop local database", 5 * 1024 * 1024);
    if (localStorage.getItem('dbCreated') === null)
        db.transaction(createTablesTest, transaction_error, createTables_success);
    else
        db.transaction(syncDB, transaction_error, syncDB_success);
}

function createTables(tx) {

    tx.executeSql("DROP TABLE IF EXISTS area");
    tx.executeSql("DROP TABLE IF EXISTS level");
    tx.executeSql("DROP TABLE IF EXISTS mingle");
    tx.executeSql("DROP TABLE IF EXISTS tagList");
    tx.executeSql("DROP TABLE IF EXISTS bars");
    tx.executeSql("DROP TABLE IF EXISTS userInfo");

    console.log('tables dropped');

    var sql =
        "CREATE TABLE IF NOT EXISTS area ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name VARCHAR(50))";
    tx.executeSql(sql);

    sql =
        "CREATE TABLE IF NOT EXISTS level ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "aliasName VARCHAR(128), expNeeded INTEGER)";
    tx.executeSql(sql);

    sql =
        "CREATE TABLE IF NOT EXISTS mingle( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, user_id VARCHAR(20), " +
        "receiver_id VARCHAR(20), lastUpdate TIMESTAMP, deleted INTEGER)";
    tx.executeSql(sql);

    sql =
        "CREATE TABLE IF NOT EXISTS tagList ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, rfidTag VARCHAR(20), " +
        "isRegistered INTEGER)";
    tx.executeSql(sql);

    sql =
        "CREATE TABLE IF NOT EXISTS bars ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name VARCHAR(128), area_id INTEGER, category VARCHAR(128), image VARCHAR(128), " +
        "address VARCHAR(250), description VARCHAR(250), daysOpen VARCHAR(128), " +
        "budget VARCHAR(128), entranceFee VARCHAR(128), popularFor VARCHAR(128), " +
        "contactNumber VARCHAR(15), maleCount INTEGER, femaleCount INTEGER, lastUpdate TIMESTAMP," +
        "deleted INTEGER)";
    tx.executeSql(sql);

    sql =
        "CREATE TABLE IF NOT EXISTS userInfo ( " +
        "id VARCHAR(20) PRIMARY KEY, username VARCHAR(128), password VARCHAR(128), " +
        "level INTEGER, title VARCHAR(128), currentExp INTEGER, status_id INTEGER, " +
        "gender VARCHAR(50), email VARCHAR(128), bar_id INTEGER, " +
        "nextRefresh DATE, image VARCHAR(20), lastUpdate TIMESTAMP, deleted INTEGER)";
    tx.executeSql(sql);

    console.log('Tables created');

}

// FOR OFFLINE TESTING 
function createTablesTest(tx) {

    tx.executeSql("DROP TABLE IF EXISTS area");
    tx.executeSql("DROP TABLE IF EXISTS bars");
    tx.executeSql("DROP TABLE IF EXISTS userInfo");


    console.log('tables dropped');

    var sql =
        "CREATE TABLE IF NOT EXISTS area ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name VARCHAR(50))";
    tx.executeSql(sql);

    sql =
        "CREATE TABLE IF NOT EXISTS bars ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name VARCHAR(128), area_id INTEGER, category VARCHAR(128), image VARCHAR(128), " +
        "address VARCHAR(250), description VARCHAR(250), daysOpen VARCHAR(128), " +
        "budget VARCHAR(128), entranceFee VARCHAR(128), popularFor VARCHAR(128), " +
        "contactNumber VARCHAR(15), maleCount INTEGER, femaleCount INTEGER, lastUpdate TIMESTAMP, deleted INTEGER)";
    tx.executeSql(sql);

    sql =
        "CREATE TABLE IF NOT EXISTS userInfo ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, rfid VARCHAR(20), username VARCHAR(128), password VARCHAR(128), " +
        "class VARCHAR(50), level INTEGER, title VARCHAR(200), currentExp INTEGER, expNeeded INTEGER, status_id INTEGER, about VARCHAR(200), " +
        "gender VARCHAR(50), email VARCHAR(128), bar_id INTEGER, " +
        "image VARCHAR(5000), lastUpdate TIMESTAMP, deleted INTEGER)";
    tx.executeSql(sql);

    console.log('Tables created');
}

function createTables_success() {

    // Offline mode testing. Server not up
    db.transaction(populateDBTest, transaction_error, populateDB_success);

    // Online mode testing. Server up
    //db.transaction(populateDB, transaction_error, populateDB_success);
}


// OFFLINE TESTING

function populateDBTest(tx) {

    // SAMPLE DATA

    // FOR AREA
    tx.executeSql("INSERT into area(name) values('Taguig')");
    tx.executeSql("INSERT into area(name) values('Makati')");
    tx.executeSql("INSERT into area(name) values('Quezon City')");
    tx.executeSql("INSERT into area(name) values('Tomas Morato')");
    tx.executeSql("INSERT into area(name) values('Pasig')");

    //FOR BAR INFO
    tx.executeSql("INSERT into userInfo(rfid,username,password,class,level,title,currentExp,expNeeded,status_id,about,gender,email, " +
        "bar_id, image, lastUpdate,deleted) values('0000000001','superkidluigi','a','Admin',1,'Novice Chode',50,100,1,'Hello','Male','superkidluigi@gmail.com',1,'1.jpg','2014-04-30 00:48:35',0)");
    tx.executeSql("INSERT into userInfo(id,rfid,username,password,class,level,title,currentExp,expNeeded,status_id,about,gender,email, " +
        "bar_id, image, lastUpdate, deleted) values(2,'0000000002','lrgbairan','b','Promoter',2,'Admiral Glasser',88,200,1,'World','Male','lrgbairan@gmail.com',1,'3.jpg','2014-04-30 00:48:35',0)");

    //FOR USER INFO
    tx.executeSql("INSERT into bars(name, area_id, category, image, address, description, " +
        "daysOpen,budget,entranceFee,popularFor,contactNumber,maleCount, femaleCount, lastUpdate, deleted) " +
        "values('Imperial',1,'Club','imperial.jpg','The Fort BGC', 'Icy club environment', 'Mon - Thu: 9:00 pm - 4:00 am, Fri - Sat: 9:00 pm','P300','P500','Icy feel drinks','09209293849', 30,50,'2014-04-30 00:48:35',0)");

}


// TO EDIT WHEN SERVER IS UP
// 
function populateDB(tx) {

    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/getallarea',
        function(jsonData) {
            $.each(jsonData.data, function(i, data) {
                db.transaction(function(tx) {
                    tx.executeSql("insert into area(id,name) values(?,?)", [data.id, data.name]);
                });
            });
        });

    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/getallbars',
        function(jsonData) {
            $.each(jsonData.data, function(i, data) {
                var date = convertToTimestamp(data.lastUpdate);
                db.transaction(function(tx) {
                    tx.executeSql("INSERT into bars(name, area_id, category, image, address, description, " +
                        "daysOpen,budget,entranceFee,popularFor,contactNumber,maleCount, femaleCount, " +
                        "lastUpdate, deleted) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [data.name, data.area_id, data.category, data.image, data.address, data.description, data.daysOpen, data.budget, data.entranceFee, data.popularFor, data.contactNumber, data.maleCount, data.femaleCount, date, data.deleted]);
                });
            });
        });

    $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/getallusers',
        function(jsonData) {
            $.each(jsonData.data, function(i, data) {
                var date = convertToTimestamp(data.lastUpdate);
                db.transaction(function(tx) {
                    tx.executeSql("INSERT into userInfo(rfid,username,password,class,level,title,currentExp,expNeeded " +
                        "status_id,about,gender,email,bar_id, image, lastUpdate,deleted) values(?,?,?,?,?,?,?, " +
                        "?,?,?,?,?,?,?,?,?)", [data.rfid, data.username, data.password, data.class, data.level, data.title, data.currentExp, data.expNeeded, data.status_id, data.about, data.gender, data.email, data.bar_id, data.image, date, data.deleted]);
                });
            });
        });

}

function populateDB_success() {

    // localStorage.setItem('dbCreated', '1');
    console.log('Create and populate db complete');
}

// TO EDIT WHEN SERVER IS UP
function syncDB() {

    db.transaction(function(tx) {
        tx.executeSql("SELECT max(lastUpdate) AS lastdate FROM bars", [], function(tx, result) {
            barsLastSyncDate = result.rows.item(0).lastdate ? result.rows.item(0).lastdate : '';
            $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/modifiedbars?date=' + barsLastSyncDate,
                function(jsonData) {
                    if (jsonData.error === '0') {
                        $.each(jsonData.data, function(i, data) {
                            db.transaction(function(ctx) {
                                ctx.executeSql("SELECT id from bars where id=?", [data.id], function(tx, checkres) {
                                    if (checkres.rows.length) {
                                        if (data.deleted === '0') {
                                            console.log("updating " + data.name + " " + data.lastUpdate);
                                            tx.executeSql("UPDATE bars set maleCount=?,femaleCount=?,lastUpdate=? WHERE id=?", [data.maleCount, data.femaleCount, data.lastUpdate, data.id]);
                                        } else {
                                            console.log("updating " + data.name + " " + data.lastUpdate);
                                            tx.executeSql("DELETE from bars where id=?", [data.id]);
                                        }
                                    } else {
                                        console.log("possible insert");
                                        if (data.deleted === '0') {
                                            console.log("inserting " + data.name + " " + data.lastUpdate);
                                            var date = convertToTimestamp(data.lastUpdate);
                                            tx.executeSql("insert into bars(name,area_id,maleCount,femaleCount,lastUpdate,deleted) values(?,?,?,?,?,?)", [data.name, data.area_id, data.maleCount, data.femaleCount, date, data.deleted]);
                                            console.log("insert done");
                                        }
                                    }
                                });
                            });
                        });
                    } else {
                        console.log("No data to update");
                    }
                    if (jsonData.error === '0') {
                        localStorage.setItem('barsLastSyncDate', jsonData.data[jsonData.data.length - 1].lastUpdate);
                    }
                });
        });
    });

    db.transaction(function(tx) {
        tx.executeSql("SELECT max(lastUpdate) AS lastdate FROM userInfo", [], function(tx, result) {
            usersLastSyncDate = result.rows.item(0).lastdate ? result.rows.item(0).lastdate : '';
            $.getJSON('http://localhost/ProtosLabs/HopData/index.php/hop/modifiedusers?date=' + usersLastSyncDate,
                function(jsonData) {
                    if (jsonData.error === '0') {
                        $.each(jsonData.data, function(i, data) {
                            db.transaction(function(ctx) {
                                ctx.executeSql("SELECT id from userInfo where id=?", [data.id], function(tx, checkres) {
                                    if (checkres.rows.length) {
                                        console.log('data');
                                        if (data.deleted === '0') {
                                            console.log("updating " + data.username + " " + data.lastUpdate);
                                            tx.executeSql("UPDATE userInfo set rfid=?, username=?, password=?, class=?, level=?, title=?, currentExp=?, expNeeded=?, status_id=?, about=?,gender=?,email=?, bar_id=?,image=?, lastUpdate=?, deleted=? WHERE id=?", [data.rfid, data.username, data.password, data.class, data.level, data.title, data.currentExp, data.expNeeded,
                                                data.status_id, data.about, data.gender, data.email, data.bar_id, data.image, data.lastUpdate, data.deleted, data.id
                                            ]);
                                        } else {
                                            console.log("updating " + data.username + " " + data.lastUpdate);
                                            tx.executeSql("DELETE from userInfo where id=?", [data.id]);
                                        }
                                    } else {
                                        console.log("possible insert");
                                        if (data.deleted === '0') {
                                            var date = convertToTimestamp(data.lastUpdate);
                                            console.log("inserting " + data.username + " " + data.lastUpdate);
                                            tx.executeSql("INSERT into userInfo(rfid,username,password,class,level,title,currentExp,expNeeded " +
                                                "status_id,about,gender,email, bar_id, image, lastUpdate,deleted) values(?,?,?,?,?,?,?,?, " +
                                                "?,?,?,?,?,?,?,?)", [data.rfid, data.username, data.password, data.class, data.level, data.title, data.currentExp, data.expNeeded, data.status_id, data.about, data.gender, data.email, data.bar_id, data.image, date, data.deleted]);
                                        }
                                    }
                                });
                            });
                        });
                    } else {
                        console.log("No data to update");
                    }
                    if (jsonData.error === '0') {
                        localStorage.setItem('usersLastSyncDate', jsonData.data[jsonData.data.length - 1].lastUpdate);
                    }
                });
        });
    });
}

function syncDB_success() {

    console.log("Sync success");
}

function transaction_error(tx, error) {

    alert("Database Error: " + error);
}

function convertToTimestamp(lastUpdate) {

    var date = new Date(lastUpdate);
    var month = (date.getMonth() < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
    var formattedDate = date.getFullYear() + "-" + month + "-" + day;
    var hours = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    var minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
    var formattedTime = hours + ":" + minutes + ":" + seconds;
    formattedDate = formattedDate + " " + formattedTime;

    return formattedDate;
}

/* CHECK INTERNET CONNECTIVITY

checkConnection = function() {

    if (navigator.network && navigator.network.connection.type != Connection.NONE) {
        alert('Internet available');
        //createLocalDB();
    } else
        alert('No internet connection');
}

*/