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
const dbRef = ref(db, "/data/");


//setup
function setup() {
    orderList.innerHTML = '<h1 class="title">永和雲手機管理v1</h1>';//delete div
    orderList.innerHTML =
        orderList.innerHTML +
        `<select class="orderBg" id="selectPhoneNumbers">
            <option value="choose">請選擇手機編號</option>
            <option value="addNewData">新增資料</option>
                </select>
        <select class="orderBg" id="selectWechatName">
            <option value="choose">請選擇名稱</option>
                </select>
        <div id="dataInput"></div>`;
    var selectPhoneNumbers = document.getElementById("selectPhoneNumbers")
    var selectWechatName = document.getElementById("selectWechatName")
    var dataInput = document.getElementById("dataInput")
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

//getWechatName
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

//getWechatInfo
function getWechatInfo(thisPhoneNums, thisWechatName) {
    hide(dataInput);
    perPhoneNumber = thisPhoneNums;
    perWechatName = thisWechatName;
    // dataInput.innerHTML = dataInput.innerHTML +
    //     `<button class="orderBg">編輯</button>`;
    var dbRef3 = ref(db, "/data/" + thisPhoneNums + "/" + thisWechatName + "/");
    onValue(
        dbRef3,
        (snapshot) => {
            snapshot.forEach(function (item) {
                perWechatId = item.val();
                Sort(item.key, item.val());
            });
        }
    );
}

//
function showWechatInfo() {
    hide(dataInput);
    dataInput.innerHTML = dataInput.innerHTML +
        `<button class="orderBg" id="btnWechatID">帳號：${perWechatId}</button>
        <button class="orderBg" id="btnPassword">密碼：${perPassword}</button>
        <button class="orderBg" id="btnEdit">編輯</button>`;
    const btnWechatID = document.getElementById("btnWechatID");
    const btnPassword = document.getElementById("btnPassword");
    const btnEdit = document.getElementById("btnEdit");
    btnWechatID.addEventListener("click", function () { copyContent(perWechatId) });
    btnPassword.addEventListener("click", function () { copyContent(perPassword) });
    btnEdit.addEventListener("click", function () { showInput(perPhoneNumber, perWechatName, perWechatId, perPassword, perNote) });

}

//補救措施 有錯誤
function remedy() {
    btnWechatID.innerHTML = "帳號：${perWechatId}"
    btnPassword.innerHTML = "密碼：${perPassword}"
}

//clean list
function hide(obj) {
    obj.innerHTML = "";
}

//show input when user want to edit the info
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
                alert("成功！");
                writeNewPost(phoneNums, wechatName, wechatID, password, note);
            } else {
                alert("您已取消");
            }
        }


        //post
        function writeNewPost(
            phone_number,
            wechat_name,
            wechat_ID,
            password,
            note
        ) {
            const db = getDatabase();

            // A post entry.
            const postData = {
                wechatID: wechatID,
                password: password,
                note: note,
                time: getTime(),
            };
            // Get a key for a new Post.
            // Write the new post's data simultaneously in the posts list and the user's post list.
            const updates = {};
            updates["/data/" + phone_number + "/" + wechatName] = postData;
            return update(ref(db), updates);
        }
    });

}

//sort those mesy data
function Sort(getKey, getVal) {
    if (getKey == "phoneNumber") {
        perPhoneNumber = getVal;
    } else if (getKey == "wechatName") {
        perWechatName = getVal;
    } else if (getKey == "wechatID") {
        perWechatId = getVal;
    } else if (getKey == "password") {
        perPassword = getVal;
    } else if (getKey == "time") {
        perTime = getVal;
    } else if (getKey == "note") {
        perNote = getVal;
    } else {
        console.log("error:" + getKey + "," + getVal);
    }
    showWechatInfo();
}

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

var perPhoneNumber, perWechatName, perWechatId, perPassword, perTime, perNote;
var orderList = document.getElementById("orderList");
setup();
selectPhoneNumbers.onchange = function () {
    let value = selectPhoneNumbers.value
    if (value == "addNewData") {
        showInput("", "", "", "", "");
        selectWechatName.innerHTML = `<option value="choose">請選擇名稱</option>`;

    }
    else if (value == "choose") {
        hide(dataInput);
        selectWechatName.innerHTML = `<option value="choose">請選擇名稱</option>`;

    }
    else {
        hide(dataInput);
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

