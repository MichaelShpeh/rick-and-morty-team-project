document.addEventListener("DOMContentLoaded", () => {
    // console.log("DOM полностью загружен");

    // Проверяем, появился ли список кнопок
    const interval = setInterval(() => {
        const list = document.querySelector(".buttons-hero-list");
        // console.log("Проверяем наличие .buttons-hero-list:", list);

        if (!list) return;

        clearInterval(interval);
        // console.log(".buttons-hero-list найден, останавливаем интервал");

        // вычисляем максимальную ширину списка по кнопкам
        const buttons = list.querySelectorAll(".btn");
        // console.log("Найдено кнопок:", buttons.length);

        let maxRight = 0;
        buttons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const left = btn.offsetLeft;
            const width = rect.width;
            const right = left + width;
            if (right > maxRight) maxRight = right;
            // console.log(`Кнопка ${btn.textContent}: left=${left}, width=${width}, right=${right}`);
        });

        list.style.width = maxRight + "px";
        // console.log("Установлена ширина списка:", maxRight);

        // клонируем список
        const clone = list.cloneNode(true);
        clone.classList.add("clone");
        clone.style.left = maxRight + "px";
        list.parentNode.appendChild(clone);
        // console.log("Создан клон списка и добавлен в DOM");

        // анимация
        let x = 0;
        const speed = 0.7;
        // console.log("Запускаем анимацию");

        function frame() {
            x -= speed;
            list.style.transform = `translateX(${x}px)`;
            clone.style.transform = `translateX(${x}px)`;

            if (Math.abs(x) >= maxRight) {
                x = 0;
                // console.log("Сброс позиции до 0");
            }

            requestAnimationFrame(frame);
        }

        frame();
    }, 50);
});
