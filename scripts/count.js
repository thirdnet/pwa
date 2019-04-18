var dbName = 'testDB';
var dbVersion = '1';
var storeName  = 'testStore';
var count = 0;
var db;

// DBオープン
var openReq  = indexedDB.open(dbName, dbVersion);
openReq.onerror = function (event) {
    console.log('indexedDB 接続失敗');
}

// DB新規またはバージョン更新時
openReq.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore(storeName, {keyPath : 'id'})
    objectStore.createIndex("id", "id", { unique: true });
    objectStore.createIndex("testkey", "cnt", { unique: false });
    console.log('DB更新');
}

// onsuccess
openReq.onsuccess = function (event) {
    db = event.target.result;
    var trans_g = db.transaction(storeName, 'readonly');
    var store_g = trans_g.objectStore(storeName);
    var getReq_g = store_g.get(1);

    getReq_g.onsuccess = function (event) {
        // 取得したデータがundefinedだったら0をセット
        // でーたがあれば++
        if (typeof event.target.result === 'undefined') {
            count = 0;
        } else {
            count = event.target.result.cnt;
            document.querySelector("#countlabel").textContent = count;
            //alert(count);
            //count++;
        }
    }
}

document.querySelector('#countbtn').addEventListener('click', function(){
    count++;
    document.querySelector("#countlabel").textContent = count;
    
    var trans = db.transaction(storeName, "readwrite");
    var store = trans.objectStore(storeName);
    var putReq = store.put({

        id: 1,
        cnt: count
    });    

    putReq.onsuccess = function (event) {
        console.log('DB更新成功');
    }

});
                                                            
                                                            
                                                            