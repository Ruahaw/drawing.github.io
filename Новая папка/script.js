document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const brushSizeInput = document.getElementById('brushSize');
    const clearBtn = document.getElementById('clearBtn');
    const toolToggle = document.getElementById('toolToggle');
    const colorPicker = document.getElementById('colorPicker');
    const colorCategory = document.getElementById('colorCategory');
    const dynamicPalette = document.getElementById('dynamicPalette');

    // Настройки рисования
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let brushSize = 5;
    let currentColor = '#000000';
    let isEraser = false; // Режим ластика

    // Наборы цветов по категориям
    const colorSets = {
        basic: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080'],
        reds: ['#FF0000', '#E60000', '#CC0000', '#B30000', '#990000', '#800000', '#660000', '#4D0000'],
        greens: ['#00FF00', '#00E600', '#00CC00', '#00B300', '#009900', '#008000', '#006600', '#004D00'],
        blues: ['#0000FF', '#0000E6', '#0000CC', '#0000B3', '#000099', '#000080', '#000066', '#00004D'],
        grays: ['#000000', '#222222', '#444444', '#666666', '#888888', '#AAAAAA', '#CCCCCC', '#EEEEEE'],
        pastels: ['#FFD1DC', '#D5E6FB', '#D4F0C8', '#FFFACD', '#FFDAB9', '#E6BEFF', '#B5E7A0', '#FDFD96']
    };

    // Функция отрисовки палитры по выбранной категории
    function renderPalette(category) {
        dynamicPalette.innerHTML = ''; // Очищаем палитру
        const colors = colorSets[category];

        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'palette-color';
            colorOption.style.backgroundColor = color;
            colorOption.addEventListener('click', () => {
                currentColor = color;
                colorPicker.value = color; // Синхронизируем с пикером
                updateToolStyle();
            });
            dynamicPalette.appendChild(colorOption);
        });
    }

    // Обновление стиля рисования (кисть/ластик)
    function updateToolStyle() {
        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out'; // Режим стирания
            ctx.strokeStyle = '#000000'; // Цвет не важен для ластика
        } else {
            ctx.globalCompositeOperation = 'source-over'; // Обычный режим
            ctx.strokeStyle = currentColor;
        }
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    // Обработчики событий холста
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        drawLine(lastX, lastY, e.offsetX, e.offsetY);
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // Рисование линии
    function drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Изменение размера кисти
    brushSizeInput.addEventListener('change', () => {
        brushSize = parseInt(brushSizeInput.value);
        updateToolStyle();
    });

    // Переключение инструмента (кисть ↔ ластик)
    toolToggle.addEventListener('click', () => {
        isEraser = !isEraser;
        toolToggle.textContent = isEraser ? 'Кисть' : 'Ластик';
        toolToggle.classList.toggle('active', isEraser);
        updateToolStyle();
    });

    // Синхронизация цветового пикера
    colorPicker.addEventListener('change', () => {
        currentColor = colorPicker.value;
        updateToolStyle();
    });

    // Обработка выбора категории цветов
    colorCategory.addEventListener('change', (e) => {
        renderPalette(e.target.value);
    });

    // Очистка холста
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Инициализация
    renderPalette('basic'); // Отображаем основную палитру при загрузке
    updateToolStyle(); // Применяем начальные настройки
});

