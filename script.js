const STC_btn = document.querySelector("#scrollToCard");
const card_elem = document.querySelector("#card");
const card_text_elem = document.querySelector("#card-text");
const card_prev_elem = document.querySelector("#card-prev");
const card_num_elem = document.querySelector("#card-num");
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
            if (savedCardArr) {
                cardArr = JSON.parse(savedCardArr);
                cardText.textContent = cardArr[cardIndex];
                cardNum.textContent = `${cardIndex + 1} / ${cardNumber}`;
                const prevCard = cardArr[cardIndex - 1];
                cardPrev.textContent = cardIndex % 2 != 0 ? prevCard : "---";
                if (hide_info_checkbox.checked){
                    card_info_elem.setAttribute("hidden", "true");
                } else {
                    card_info_elem.removeAttribute("hidden");
                }
            } else {
                isProgress = false;
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
    if (manual) {
        window.alert("入力を保存しました");
    }
    return;
};
save_settings_button.addEventListener("click", () => saveData(true));
let cardArr = [];
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
}
gen_card_button.addEventListener("click", genCard);
function cardClicked() {
    cardIndex++;
    saveData(false);
    if (cardIndex > cardNumber - 1){
        cardNum.setAttribute("textcolor", "red");
        window.alert("カード帳の最後尾に到達しました。");
        isProgress = false;
        saveData(false);
    } else {    
        if (cardIndex % 2 === 0) {
            cardPrev.textContent = "---";
        } else {
            cardPrev.textContent = cardText.textContent;
        }
        cardText.textContent = cardArr[cardIndex];
        cardNum.textContent = `${cardIndex + 1} / ${cardNumber}`;
    }
}
card_elem.addEventListener("click", cardClicked);
// タイトルクリック処理
const title_elem = document.querySelector("#title");
title_elem.addEventListener("click", () =>{
    location.href = "https://html5tools.netlify.app";
});


// 初期化
loadData();
