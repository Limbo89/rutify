let audio = document.getElementById("audio");    // Берём элемент audio
let time = document.querySelector(".time");      // Берём аудио дорожку
let btnPlay = document.querySelector(".play");   // Берём кнопку проигрывания
let btnPause = document.querySelector(".pause"); // Берём кнопку паузы
let btnPrev = document.querySelector(".prev");   // Берём кнопку переключения предыдущего трека
let btnNext = document.querySelector(".next");   // Берём кнопку переключение следующего трека
let inputs = document.querySelectorAll(".src");
let playlist = [];
inputs.forEach((element) => {
    playlist.push(element.value);
})
let treck; // Переменная с индексом трека
let coutOfTracks = playlist.length;

// Событие перед загрузкой страницы
window.onload = function () {
    treck = 0; // Присваиваем переменной ноль
}

function switchTreck(numTreck) {
    // Меняем значение атрибута src
    audio.src = playlist[numTreck];
    // Назначаем время песни ноль
    audio.currentTime = 0;
    // Включаем песню
    audio.play();
}

btnPlay.addEventListener("click", function () {
    audio.play(); // Запуск песни
    // Запуск интервала 
    audioPlay = setInterval(function () {
        // Получаем значение на какой секунде песня
        let audioTime = Math.round(audio.currentTime);
        // Получаем всё время песни
        let audioLength = Math.round(audio.duration)
        // Назначаем ширину элементу time
        time.style.width = (audioTime * 100) / audioLength + '%';
        // Сравниваем, на какой секунде сейчас трек и всего сколько времени длится
        // И проверяем что переменная treck меньше четырёх
        if (audioTime == audioLength && treck < coutOfTracks) {
            treck++; // То Увеличиваем переменную 
            switchTreck(treck); // Меняем трек
            // Иначе проверяем тоже самое, но переменная treck больше или равна четырём
        } else if (audioTime == audioLength && treck >= coutOfTracks) {
            treck = 0; // То присваиваем treck ноль
            switchTreck(treck); // Меняем трек
        }
    }, 10)
});

btnPause.addEventListener("click", function () {
    audio.pause(); // Останавливает песню
    clearInterval(audioPlay) // Останавливает интервал
});

btnPrev.addEventListener("click", function() {
    // Проверяем что переменная treck больше нуля
    if (treck > 0) {
        treck--; // Если верно, то уменьшаем переменную на один
        switchTreck(treck); // Меняем песню.
    } else { // Иначе
        treck = coutOfTracks; // Присваиваем три
        switchTreck(treck); // Меняем песню
    }
});

btnNext.addEventListener("click", function() {
    // Проверяем что переменная treck больше трёх
    if (treck < coutOfTracks) { // Если да, то
        treck++; // Увеличиваем её на один
        switchTreck(treck); // Меняем песню 
    } else { // Иначе
        treck = 0; // Присваиваем ей ноль
        switchTreck(treck); // Меняем песню
    }
});