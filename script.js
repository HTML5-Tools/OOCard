const STC_btn = document.querySelector("#scrollToCard");
const card_elem = document.querySelector("#card");
const card_text_elem = document.querySelector("#card-text");
const card_prev_elem = document.querySelector("#card-prev");
const card_num_elem = document.querySelector("#card-num");
const check_button = document.querySelector("#check_button");
const gen_card_button = document.querySelector("#genCard");
const save_settings_button = document.querySelector("#saveSettings");
const filter_checked_button = document.querySelector("#filterChecked");
const hide_info_checkbox = document.querySelector("#hideInfo");
const card_info_elem = document.querySelector("#card-info");
STC_btn.addEventListener("click", () => {
    card_elem.scrollIntoView({ behavior: "smooth", block: "end" });
});
const cardText = document.querySelector("#card-text");
const cardPrev = document.querySelector("#card-prev");
const cardNum = document.querySelector("#card-num");
const card_omote_input = document.querySelector("#card_omote_input");
const card_ura_input = document.querySelector("#card_ura_input");
let isProgress = false;

let cardIndex = 0;
let cardNumber = 0;
let cardArr = [];

let newOmoteCardArr = []; 
let newUraCardArr = [];

function loadData() {
    const noData = localStorage.getItem("noData");
    if (noData === null){
        localStorage.setItem("noData", false);
        return;
    } else {
        const savedCardUra = localStorage.getItem("card_ura_input");
        const savedCardOmote = localStorage.getItem("card_omote_input");
        const savedHideInfo = localStorage.getItem("hide_info");
        card_omote_input.value = savedCardOmote;
        card_ura_input.value = savedCardUra;
        if (savedHideInfo === "true"){
            hide_info_checkbox.checked = true;
        } else {
            hide_info_checkbox.checked = false;
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
                card_elem.setAttribute("state", cardIndex % 2 === 0 ? "omote" : "ura");
                const isChecked = localStorage.getItem("isChecked");
                if (cardIndex % 2 != 0){
                    if (isChecked === "true"){
                        check_button.setAttribute("color", "green");
                        check_button.removeAttribute("hidden");
                    } else {
                        check_button.setAttribute("color", "gray");
                        check_button.removeAttribute("hidden");
                    }
                } else {
                    check_button.setAttribute("hidden", "true");
                }
                if (hide_info_checkbox.checked){
                    card_info_elem.setAttribute("hidden", "true");
                } else {
                    card_info_elem.removeAttribute("hidden");
                }
            } else {
                isProgress = false;
            }
            if (isProgress){
                filter_checked_button.setAttribute("disabled", "true");
            }
        } else {
            return;
        }
    }
};
function saveData(manual = false) {
    console.log("Saving data...");
    localStorage.setItem("card_ura_input", card_ura_input.value);
    localStorage.setItem("card_omote_input", card_omote_input.value);
    localStorage.setItem("hide_info", hide_info_checkbox.checked);
    localStorage.setItem("isProgress", isProgress);
    localStorage.setItem("cardArr", JSON.stringify(cardArr));
    localStorage.setItem("cardIndex", cardIndex);
    localStorage.setItem("cardNumber", cardNumber);
    localStorage.setItem("newOmoteCardArr", JSON.stringify(newOmoteCardArr));
    localStorage.setItem("newUraCardArr", JSON.stringify(newUraCardArr));
    localStorage.setItem("isChecked", check_button.getAttribute("color") === "green");
    if (manual) {
        window.alert("入力を保存しました");
    }
    return;
};
save_settings_button.addEventListener("click", () => saveData(true));
function shuffleCard() {
    let omoteArr = card_omote_input.value.split("\n");
    let uraArr = card_ura_input.value.split("\n");
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
    if (card_omote_input.value === ""){
        window.alert("カードの表が入力されていません。");
        return;
    }
    if (card_ura_input.value === ""){
        window.alert("カードの裏が入力されていません。");
        return;
    }
    if(card_omote_input.value.split("\n").length !== card_ura_input.value.split("\n").length){
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
    if (hide_info_checkbox.checked){
        card_info_elem.setAttribute("hidden", "true");
    } else {
        card_info_elem.removeAttribute("hidden");
    }
    isProgress = true;
    saveData(false);
    filter_checked_button.setAttribute("disabled", "true");
    check_button.setAttribute("color", "gray");
    check_button.setAttribute("hidden", "true");
    card_elem.setAttribute("state", "omote");
}
gen_card_button.addEventListener("click", genCard);
function cardClicked() {
    cardIndex++;
    saveData(false);
    if (cardIndex > cardNumber - 1){
        cardNum.setAttribute("textcolor", "red");
        window.alert("カード帳の最後尾に到達しました。");
        check_button.setAttribute("hidden", "true");
        isProgress = false;
        saveData(false);
        filter_checked_button.removeAttribute("disabled");
    } else {    
        if (cardIndex % 2 === 0) {
            cardPrev.textContent = "---";
            check_button.setAttribute("hidden", "true");
            check_button.setAttribute("color", "gray");
            card_elem.setAttribute("state", "omote");
        } else {
            cardPrev.textContent = cardText.textContent;
            check_button.setAttribute("color", "gray");
            check_button.removeAttribute("hidden");
            newOmoteCardArr.push(cardArr[cardIndex - 1]);
            newUraCardArr.push(cardArr[cardIndex]);
            card_elem.setAttribute("state", "ura");
        }
        cardText.textContent = cardArr[cardIndex];
        cardNum.textContent = `${cardIndex + 1} / ${cardNumber}`;
    }
}
function checkClicked() {
    if (check_button.getAttribute("color") === "gray"){
        check_button.setAttribute("color", "green");
        localStorage.setItem("isChecked", true);
        const index = newOmoteCardArr.indexOf(cardArr[cardIndex - 1]);
        if (index !== -1) {
            newOmoteCardArr.pop();
            newUraCardArr.pop();
        }
    } else if (check_button.getAttribute("color") === "green"){
        check_button.setAttribute("color", "gray");
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
    card_omote_input.value = newOmoteCardArr.join("\n");
    card_ura_input.value = newUraCardArr.join("\n");
}
check_button.addEventListener("click", (event) => {
    checkClicked();
    event.stopPropagation();
    event.preventDefault();
});
card_elem.addEventListener("click", (event) => {
    if (!(event && event.target.closest("#check_button"))) {
        cardClicked();
    }    
});
filter_checked_button.addEventListener("click", filterChecked);
// タイトルクリック処理
const title_elem = document.querySelector("#title");
title_elem.addEventListener("click", () =>{
    location.href = "https://html5tools.netlify.app";
});


// 初期化
loadData();
