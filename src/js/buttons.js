(function(){
  const SPEED = 0.6; // px per frame — увеличь или уменьшай
  const GAP_AFTER_TELEPORT = 20; // отступ слева при телепортации

  const container = document.querySelector('.buttons-hero-div');
  const buttons = Array.from(document.querySelectorAll('.btn'));

  if (!container || buttons.length === 0) {
    console.warn('Контейнер или кнопки не найдены');
    return;
  }

  // Стартовая инициализация
  function init() {
    const contRect = container.getBoundingClientRect();

    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();

      // вычисляем позицию кнопки относительно левого края контейнера
      const posRelative = rect.left - contRect.left;

      // фиксируем ширину (она понадобится)
      btn.dataset.w = rect.width;

      // установим left:0 чтобы не конфликтовало с transform
      btn.style.left = '0px';

      // сохраним текущую позицию в dataset (в пикселях)
      btn.dataset.pos = posRelative;

      // применяем transform с начальной позицией
      btn.style.transform = `translateX(${posRelative}px)`;
    });
  }

  // Основной цикл
  let lastTime = 0;
  function tick(time) {
    // time — DOMHighResTimeStamp, но мы делаем постоянный шаг в px/frame для простоты.
    // Можно сделать на основе delta, но px/frame даёт стабильный результат.
    const contRect = container.getBoundingClientRect();

    buttons.forEach(btn => {
      let pos = parseFloat(btn.dataset.pos);
      const w = parseFloat(btn.dataset.w) || btn.offsetWidth;

      pos += SPEED; // передвигаем вправо

      // текущая абсолютная позиция левого края кнопки = contRect.left + pos
      const absLeft = contRect.left + pos;

      // если левый край полностью вышел за правую границу контейнера — телепортируем влево
      if (absLeft > contRect.right) {
        pos = -w - GAP_AFTER_TELEPORT;
      }

      // сохраняем позицию и применяем трансформ
      btn.dataset.pos = pos;
      btn.style.transform = `translateX(${pos}px)`;
    });

    requestAnimationFrame(tick);
  }

  // Запуск
  init();
  requestAnimationFrame(tick);

  // Если окно ресайзится — пересчитываем начальные позиции
  window.addEventListener('resize', () => {
    init();
  });

  // Опция: остановка при наведении (если хочешь) — тут просто уменьшает скорость
  container.addEventListener('mouseenter', ()=> { /* можно: SPEED = 0; но const — поэтому оставил пустым */ });
})();