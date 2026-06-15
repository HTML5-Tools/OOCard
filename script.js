const STCbutton = document.querySelector("#scroll-to-card");
const cardElem = document.querySelector("#card");
const cardTextElem = document.querySelector("#card-text");
const cardPrevElem = document.querySelector("#card-prev");
const cardNumElem = document.querySelector("#card-num");
const checkButton = document.querySelector("#check-button");
const genCardButton = document.querySelector("#gen-card");
const saveSettingsButton = document.querySelector("#save-settings");
const filterCheckedButton = document.querySelector("#filterChecked");
const hideInfoCheckbox = document.querySelector("#hideInfo");
const cardInfoElem = document.querySelector("#card-info");
STCbutton.addEventListener("click", () => {
    cardElem.scrollIntoView({ behavior: "smooth", block: "end" });
});
const cardText = document.querySelector("#card-text");
const cardPrev = document.querySelector("#card-prev");
const cardNum = document.querySelector("#card-num");
const cardOmoteInput = document.querySelector("#card-omote-input");
const cardUraInput = document.querySelector("#card-ura-input");

const addProfileButton = document.querySelector("#add-profile");
const profilesContainer = document.querySelector("#profiles");

let isProgress = false;

let cardIndex = 0;
let cardNumber = 0;
let cardArr = [];

let newOmoteCardArr = []; 
let newUraCardArr = [];

let profiles = new Set();

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    document.body.setAttribute("mode", "mobile");
    cardElem.setAttribute("mode", "mobile");
    cardText.setAttribute("mode", "mobile");
    cardPrev.setAttribute("mode", "mobile");
    cardNum.setAttribute("mode", "mobile");
    cardInfoElem.setAttribute("mode", "mobile");
    checkButton.setAttribute("mode", "mobile");
}

function loadData() {
    const noData = localStorage.getItem("noData");
    if (noData === null){
        localStorage.setItem("noData", false);
        return;
    } else {
        const savedCardUra = localStorage.getItem("card-ura-input");
        const savedCardOmote = localStorage.getItem("card-omote-input");
        const savedHideInfo = localStorage.getItem("hide-info");
        const savedProfiles = localStorage.getItem("profiles");
        if (savedProfiles) {
            profiles = new Set(JSON.parse(savedProfiles));
            profiles.forEach(profile => {
                const profileData = localStorage.getItem("profile_" + profile);
                if (!profileData) {
                    profiles.delete(profile);
                    alert(`プロファイル${profile}のデータが見つかりませんでした。プロファイルを削除します。`);
                }
                const profileButton = document.createElement("button");
                profileButton.textContent = profile;
                profileButton.addEventListener("click", () => {
                    const profileData = localStorage.getItem("profile_" + profile);
                    if (profileData) {
                        if(!window.confirm("プロファイルを切り替えますか？現在のデータは保存されません。")){
                            return;
                        }
                        const { omote, ura } = JSON.parse(profileData);
                        cardOmoteInput.value = omote;
                        cardUraInput.value = ura;
                        cardArr = [];
                        newOmoteCardArr = [];
                        newUraCardArr = [];
                        cardIndex = 0;
                        cardNumber = 0;
                        cardText.textContent = "---";
                        cardPrev.textContent = "---";
                        cardNum.textContent = "--- / ---";
                        saveData(false);
                    } else {
                        alert("プロファイルデータが見つかりません。");
                    }
                });
                const deleteButton = document.createElement("span");
                deleteButton.className = "delete-button";
                deleteButton.textContent = "☒";
                deleteButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (window.confirm("プロファイルを削除しますか？")) {
                        profiles.delete(profile);
                        localStorage.removeItem("profile_" + profile);
                        updateProfilesUI();
                        saveData(false);
                    }
                });
                profileButton.appendChild(deleteButton);
                profilesContainer.appendChild(profileButton);
            });
            updateProfilesUI();
        } else {
            profiles = new Set();
        }
        cardOmoteInput.value = savedCardOmote;
        cardUraInput.value = savedCardUra;
        if (savedHideInfo === "true"){
            hideInfoCheckbox.checked = true;
        } else {
            hideInfoCheckbox.checked = false;
        }
        isProgress = localStorage.getItem("isProgress") === "true";
        if (isProgress){
            cardNumber = parseInt(localStorage.getItem("cardNumber")) || 0;
            cardIndex = parseInt(localStorage.getItem("cardIndex")) || 0;
            const savedCardArr = localStorage.getItem("cardArr");
            const savedNewOmoteCardArr = localStorage.getItem("newOmoteCardArr");
            const savedNewUraCardArr = localStorage.getItem("newUraCardArr");
            if (savedCardArr) {
                cardArr = JSON.parse(savedCardArr);
                newOmoteCardArr = savedNewOmoteCardArr ? JSON.parse(savedNewOmoteCardArr) : [];
                newUraCardArr = savedNewUraCardArr ? JSON.parse(savedNewUraCardArr) : [];
                cardText.textContent = cardArr[cardIndex];
                cardNum.textContent = `${cardIndex + 1} / ${cardNumber}`;
                const prevCard = cardArr[cardIndex - 1];
                cardPrev.textContent = cardIndex % 2 != 0 ? prevCard : "---";
                cardElem.setAttribute("state", cardIndex % 2 === 0 ? "omote" : "ura");
                const isChecked = localStorage.getItem("isChecked");
                if (cardIndex % 2 != 0){
                    if (isChecked === "true"){
                        checkButton.setAttribute("color", "green");
                        checkButton.removeAttribute("hidden");
                    } else {
                        checkButton.setAttribute("color", "gray");
                        checkButton.removeAttribute("hidden");
                    }
                } else {
                    checkButton.setAttribute("hidden", "true");
                }
                if (hideInfoCheckbox.checked){
                    cardInfoElem.setAttribute("hidden", "true");
                } else {
                    cardInfoElem.removeAttribute("hidden");
                }
            } else {
                isProgress = false;
            }
            if (isProgress){
                filterCheckedButton.setAttribute("disabled", "true");
            }
        } else {
            return;
        }
    }
};
function saveData(manual = false) {
    console.log("Saving data...");
    localStorage.setItem("card-ura-input", cardUraInput.value);
    localStorage.setItem("card-omote-input", cardOmoteInput.value);
    localStorage.setItem("hide-info", hideInfoCheckbox.checked);
    localStorage.setItem("isProgress", isProgress);
    localStorage.setItem("cardArr", JSON.stringify(cardArr));
    localStorage.setItem("cardIndex", cardIndex);
    localStorage.setItem("cardNumber", cardNumber);
    localStorage.setItem("newOmoteCardArr", JSON.stringify(newOmoteCardArr));
    localStorage.setItem("newUraCardArr", JSON.stringify(newUraCardArr));
    localStorage.setItem("isChecked", checkButton.getAttribute("color") === "green");
    localStorage.setItem("profiles", JSON.stringify(Array.from(profiles)));
    if (manual) {
        window.alert("入力を保存しました");
    }
    return;
};
saveSettingsButton.addEventListener("click", () => saveData(true));
function shuffleCard() {
    let omoteArr = cardOmoteInput.value.split("\n");
    let uraArr = cardUraInput.value.split("\n");
    let cardData = omoteArr.map((omote, index) => ({ omote, ura: uraArr[index] }));
    cardData.sort(() => Math.random() - 0.5);
    omoteArr = cardData.map(data => data.omote);
    uraArr = cardData.map(data => data.ura);
    const cardLength = omoteArr.length;
    for (let i = 0; i < cardLength; i++){
        cardArr.push(omoteArr[i]);
        cardArr.push(uraArr[i]);
    }
}
function genCard() {
    if (cardOmoteInput.value === ""){
        window.alert("カードの表が入力されていません。");
        return;
    }
    if (cardUraInput.value === ""){
        window.alert("カードの裏が入力されていません。");
        return;
    }
    if(cardOmoteInput.value.split("\n").length !== cardUraInput.value.split("\n").length){
        window.alert("カードの表と裏の入力の行数が一致しません。");
        return;
    }
    cardArr = [];
    newOmoteCardArr = [];
    newUraCardArr = [];
    shuffleCard();
    cardPrev.textContent = "---";
    cardText.textContent = cardArr[0];
    cardIndex = 0;
    cardNumber = cardArr.length;
    cardNum.textContent = `${cardIndex + 1} / ${cardNumber}`;
    cardNum.removeAttribute("textcolor");
    if (hideInfoCheckbox.checked){
        cardInfoElem.setAttribute("hidden", "true");
    } else {
        cardInfoElem.removeAttribute("hidden");
    }
    isProgress = true;
    saveData(false);
    filterCheckedButton.setAttribute("disabled", "true");
    checkButton.setAttribute("color", "gray");
    checkButton.setAttribute("hidden", "true");
    cardElem.setAttribute("state", "omote");
}
genCardButton.addEventListener("click", genCard);
function cardClicked() {
    cardIndex++;
    saveData(false);
    if (cardIndex > cardNumber - 1){
        cardNum.setAttribute("textcolor", "red");
        window.alert("カード帳の最後尾に到達しました。");
        checkButton.setAttribute("hidden", "true");
        isProgress = false;
        saveData(false);
        filterCheckedButton.removeAttribute("disabled");
    } else {    
        if (cardIndex % 2 === 0) {
            cardPrev.textContent = "---";
            checkButton.setAttribute("hidden", "true");
            checkButton.setAttribute("color", "gray");
            cardElem.setAttribute("state", "omote");
        } else {
            cardPrev.textContent = cardText.textContent;
            checkButton.setAttribute("color", "gray");
            checkButton.removeAttribute("hidden");
            newOmoteCardArr.push(cardArr[cardIndex - 1]);
            newUraCardArr.push(cardArr[cardIndex]);
            cardElem.setAttribute("state", "ura");
        }
        cardText.textContent = cardArr[cardIndex];
        cardNum.textContent = `${cardIndex + 1} / ${cardNumber}`;
    }
}
function checkClicked() {
    if (checkButton.getAttribute("color") === "gray"){
        checkButton.setAttribute("color", "green");
        localStorage.setItem("isChecked", true);
        const index = newOmoteCardArr.indexOf(cardArr[cardIndex - 1]);
        if (index !== -1) {
            newOmoteCardArr.pop();
            newUraCardArr.pop();
        }
    } else if (checkButton.getAttribute("color") === "green"){
        checkButton.setAttribute("color", "gray");
        localStorage.setItem("isChecked", false);
        newOmoteCardArr.push(cardArr[cardIndex - 1]);
        newUraCardArr.push(cardArr[cardIndex]);
    }
}
function filterChecked() {
    if (!window.confirm("✓がついたカードを除外しますか？")){
        return;
    }
    if (newOmoteCardArr.length === 0){
        window.alert("カードがすべて除外されました！");
    }
    cardOmoteInput.value = newOmoteCardArr.join("\n");
    cardUraInput.value = newUraCardArr.join("\n");
    saveData(false);
}
checkButton.addEventListener("click", (event) => {
    checkClicked();
    event.stopPropagation();
    event.preventDefault();
});
cardElem.addEventListener("click", (event) => {
    if (!(event && event.target.closest("#check-button"))) {
        cardClicked();
    }    
});
filterCheckedButton.addEventListener("click", filterChecked);
function updateProfilesUI() {
    profilesContainer.innerHTML = "";
    profiles.forEach(profile => {
        const profileButton = document.createElement("button");
        profileButton.textContent = profile;
        profileButton.addEventListener("click", () => {
            const profileData = localStorage.getItem("profile_" + profile);
            if (profileData) {
                if(!window.confirm("プロファイルを切り替えますか？現在のデータは保存されません。")){   
                    return;
                }
                const { omote, ura } = JSON.parse(profileData);
                cardOmoteInput.value = omote;
                cardUraInput.value = ura;
                cardArr = [];
                newOmoteCardArr = [];
                newUraCardArr = [];
                cardIndex = 0;
                cardNumber = 0;
                cardText.textContent = "---";
                cardPrev.textContent = "---";
                cardNum.textContent = "--- / ---";
                saveData(false);
            } else {
                alert("プロファイルデータが見つかりません。");
            }
        });
        const deleteButton = document.createElement("span");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "☒";
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            if (window.confirm("プロファイルを削除しますか？")) {
                profiles.delete(profile);
                localStorage.removeItem("profile_" + profile);
                updateProfilesUI();
                saveData(false);
            }
        });
        profileButton.appendChild(deleteButton);
        profilesContainer.appendChild(profileButton);
    });
};
function addProfile() {
    const profileName = prompt("プロファイル名を入力してください:");
    if (profileName) {
        if (profiles.has(profileName)) {
            if (!window.confirm(`"${profileName}"は既に存在します。上書きしますか？`)) {
                return;
            }
        }
        profiles.add(profileName);
        localStorage.setItem("profile_" + profileName, JSON.stringify({
            omote: cardOmoteInput.value,
            ura: cardUraInput.value
        }));
        updateProfilesUI();
        saveData(false);
    } else {
        alert("プロファイル名を入力してください。");
    }
}
addProfileButton.addEventListener("click", addProfile);
// タイトルクリック処理
const titleElem = document.querySelector("#title");
titleElem.addEventListener("click", () => {
    location.href = "https://html5tools.netlify.app";
});


// 初期化
loadData();
