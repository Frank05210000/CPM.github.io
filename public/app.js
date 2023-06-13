import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import {
    getDatabase,
    ref,
    get,
    set,
    child,
    onValue,
    push,
    update,
    remove,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyBHr9zAcW9Tx8IC0CaEVO7WH07YdSZnBEQ",
    authDomain: "cloudphonemanage.firebaseapp.com",
    databaseURL:
        "https://cloudphonemanage-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cloudphonemanage",
    storageBucket: "cloudphonemanage.appspot.com",
    messagingSenderId: "468431764606",
    appId: "1:468431764606:web:e5f6ef5f3fa19b65c5ac2f",
    measurementId: "G-BNF4WF65E3",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const presenceRef = ref(db, "disconnectmessage");
const dbRef = ref(db, "/data/");

//setup
function setup() {
    initializationOption();
    addOption();
}

function initializationOption() {
    var List = document.getElementById("List");
    // List.innerHTML = '<h1 class="title">永和雲手機管理v1</h1>';
    // List.innerHTML =
    //     List.innerHTML +
    //     `<select class="orderBg" id="selectPhoneNumbers">
    //         <option value="choose">請選擇手機編號</option>
    //         <option value="addNewData">新增資料</option>
    //             </select>
    //     <select class="orderBg" id="selectWechatName">
    //         <option value="choose">請選擇名稱</option>
    //             </select>
    //     <div id="dataInput"></div>`;
    var selectPhoneNumbers = document.getElementById("selectPhoneNumbers");
    var selectWechatName = document.getElementById("selectWechatName");
    var dataInput = document.getElementById("dataInput");
}

function addOption() {
    onValue(
        dbRef,
        (snapshot) => {
            snapshot.forEach(function (item) {
                let a1 = item.key;
                selectPhoneNumbers.innerHTML =
                    selectPhoneNumbers.innerHTML +
                    `<option value="${a1}">${a1}</option>`;
            });
        },
        {
            onlyOnce: true,
        }
    );
}

function selectEventListener() {
    selectPhoneNumbers.onchange = function () {
        var selectStyle = document.querySelector(".select")
        let value = selectPhoneNumbers.value
        if (value == "addNewData") {
            selectStyle.style.display = "none"
            showInput("", "", "", "", "");
            selectWechatName.innerHTML = `<option value="choose">請選擇名稱</option>`;

        }
        else if (value == "choose") {
            hide(dataInput);
            selectStyle.style.display = "none"
            selectWechatName.innerHTML = `<option value="choose">請選擇名稱</option>`;

        }
        else {
            hide(dataInput);
            selectStyle.style.display = "block"
            getWechatName(value);
        }
    };

    //第二個選擇項清除
    selectWechatName.onchange = function () {
        let value = selectWechatName.value
        if (value == "choose") {
            hide(dataInput);
        }
        else {
            let value = selectPhoneNumbers.value;
            let value2 = selectWechatName.value;
            showWechatInfo();
            getWechatInfo(value, value2);
        }
    };
}

function getWechatName(thisPhoneNums) {
    var dbRef2 = ref(db, "/data/" + thisPhoneNums + "/");
    selectWechatName.innerHTML = `<option value="choose">請選擇名稱</option>`;
    onValue(
        dbRef2,
        (snapshot) => {
            snapshot.forEach(function (item) {
                let a1 = item.key
                selectWechatName.innerHTML = selectWechatName.innerHTML +
                    `<option value="${a1}">${a1}</option>`;
            });
        },
        {
            onlyOnce: true,
        }
    );
}

function getWechatInfo(thisPhoneNums, thisWechatName) {
    hide(dataInput);
    currentPhoneNumber = thisPhoneNums;
    currentWechatName = thisWechatName;
    var dbRef3 = ref(db, "/data/" + thisPhoneNums + "/" + thisWechatName + "/");
    onValue(
        dbRef3,
        (snapshot) => {
            snapshot.forEach(function (item) {
                currentWechatId = item.val();
                Sort(item.key, item.val());
            });
        }
    );
}

function showWechatInfo() {
    hide(dataInput);
    dataInput.innerHTML = dataInput.innerHTML +
        `<button class="orderBg" id="btnWechatID">帳號：${currentWechatId}</button>
        <button class="orderBg" id="btnPassword">密碼：${currentPassword}</button>
        <button class="orderBg" id="btnEdit">編輯</button>
        <button class="orderBg" id="btnDelete">刪除</button>`;

    const btnWechatID = document.getElementById("btnWechatID");
    const btnPassword = document.getElementById("btnPassword");
    const btnEdit = document.getElementById("btnEdit");
    const btnDelete = document.getElementById("btnDelete");

    btnWechatID.addEventListener("click", function () { copyContent(currentWechatId) });
    btnPassword.addEventListener("click", function () { copyContent(currentPassword) });
    btnEdit.addEventListener("click", function () { showInput(currentPhoneNumber, currentWechatName, currentWechatId, currentPassword, currentNote) });
    btnDelete.addEventListener("click", function () {
        var confirm = window.confirm("確認刪除？");
        if (confirm == true) {
            remove(ref(db, "/data/" + currentPhoneNumber + "/" + currentWechatName + "/"));
            alert("刪除成功");
            hide(dataInput);
        } else {
            alert("您已取消");
        }
    });

}
//show up input when user want to edit the info
function showInput(a, b, c, d, e) {
    dataInput.innerHTML =
        `<textarea
            rows="1"
            type="text"
            class="orderBg"
            id="phoneNumber"
            placeholder="手機編號"
            required>${a}</textarea>
        <textarea
            rows="1"
            type="text"
            class="orderBg"
            id="wechatName"
            placeholder="ＷeChat名稱"
            required>${b}</textarea>
        <textarea
            rows="1"
            type="text"
            class="orderBg"
            id="wechatId"
            placeholder="ＷeChat ID"
            >${c}</textarea>
        <textarea
            rows="1"
            type="text"
            class="orderBg"
            id="password"
            placeholder="Password"
            >${d}</textarea>
        <textarea
            rows="1"
            type="text"
            class="orderBg" 
            id="note" 
            placeholder="備註"
            >${e}</textarea>
            <button class="orderBg" id="btnSubmit">送出</button>`;

    const inputPhoneNums = document.getElementById("phoneNumber");
    const inputWechatName = document.getElementById("wechatName");
    const inputWechatID = document.getElementById("wechatId");
    const inputPassword = document.getElementById("password");
    const inputNote = document.getElementById("note");
    const btnSubmit = document.getElementById("btnSubmit");

    btnSubmit.addEventListener("click", function () {
        let phoneNums = inputPhoneNums.value;
        let wechatName = inputWechatName.value;
        let wechatID = inputWechatID.value;
        let password = inputPassword.value;
        let note = inputNote.value;

        if (phoneNums == "" || wechatName == "") {
            alert("請輸入'手機編號'及‘名稱’");
        } else {
            var confirm = window.confirm("確認資料無誤？");
            if (confirm == true) {
                try {
                    if (a != "" || b != "") {
                        remove(ref(db, "/data/" + currentPhoneNumber + "/" + currentWechatName + "/"));
                    }
                    writeNewPost(phoneNums, wechatName, wechatID, password, note);
                    document.location.href = "https://cloudphonemanage.web.app/";
                }
                catch {
                    alert("失敗！\n請檢查網路");
                }
            } else {
                alert("您已取消");
            }
        }
    });
}

//post
function writeNewPost(
    phoneNumber,
    wechatName,
    wechatID,
    password,
    note
) {
    const postData = {
        wechatID: wechatID,
        password: password,
        note: note,
        time: getTime(),
    };

    const updates = {};
    updates["/data/" + phoneNumber + "/" + wechatName] = postData;
    return update(ref(db), updates).then(() => {
        alert("成功！");
    }).catch((error) => {
        alert("失敗！\n請檢查網路");
    });;
}

//無使用
// function remedy() {
//     btnWechatID.innerHTML = "帳號：${currentWechatId}"
//     btnPassword.innerHTML = "密碼：${currentPassword}"
// }

//clean list
function hide(obj) {
    obj.innerHTML = "";
}

//sort those mesy data
function Sort(getKey, getVal) {
    if (getKey == "phoneNumber") {
        currentPhoneNumber = getVal;
    } else if (getKey == "wechatName") {
        currentWechatName = getVal;
    } else if (getKey == "wechatID") {
        currentWechatId = getVal;
    } else if (getKey == "password") {
        currentPassword = getVal;
    } else if (getKey == "time") {
        currentTime = getVal;
    } else if (getKey == "note") {
        currentNote = getVal;
    } else {
        console.log("error:" + getKey + "," + getVal);
    }
    showWechatInfo();
}

//copy sth to copybroad
async function copyContent(obj) {
    try {
        await navigator.clipboard.writeText(obj);
        alert("複製成功")
        /* Resolved - 文本被成功复制到剪贴板 */
    } catch (err) {
        alert("複製失敗，請檢查手機權限。")
        /* Rejected - 文本未被复制到剪贴板 */
    }
}

//get get current time
function getTime() {
    const dt = new Date();
    const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
    let time =
        dt.getFullYear() +
        "/" +
        padL(dt.getMonth() + 1) +
        "/" +
        padL(dt.getDate()) +
        " " +
        padL(dt.getHours()) +
        ":" +
        padL(dt.getMinutes()) +
        ":" +
        padL(dt.getSeconds());
    return time;
}

//start
var currentPhoneNumber, currentWechatName, currentWechatId, currentPassword, currentTime, currentNote;
setup();
selectEventListener();



