document.addEventListener('DOMContentLoaded', function() {

    

    
    // Элементы DOM
    const buyButtons = document.querySelectorAll('.buy-btn');
    const statusMessage = document.getElementById('statusMessage');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const copyButton = document.querySelector('.copy-btn');
    const onlineCountElement = document.getElementById('onlineCount');
    
    // Базовые настройки - ВАЖНО: замените на ваш реальный URL!
    // const cloudDonateBaseUrl = 'https://clouddonate.ru/checkout/';
    

    
    // ДЛЯ ТЕСТА - используйте ссылку на FunPay как вы хотели изначально:
    const funPayBaseUrl = 'https://funpay.com';
    
    // Имитация изменения онлайн-статистики
    function updateOnlineStats() {
        const baseCount = 0;
        const randomChange = Math.floor(Math.random() * 21) - 10;
        const newCount = Math.max(0, Math.min(0, baseCount + randomChange));
        
        onlineCountElement.style.transform = 'scale(1.1)';
        onlineCountElement.style.color = '#6c63ff';
        
        setTimeout(() => {
            onlineCountElement.textContent = newCount;
            onlineCountElement.style.transform = 'scale(1)';
            onlineCountElement.style.color = '';
        }, 300);
        
        setTimeout(updateOnlineStats, 30000);
    }
    

    // ====================
// ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИЙ
// ====================

// ====================
// ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИЙ
// ====================

// Объект с названиями категорий и иконками
const categoryTitles = {
    'privileges': { title: 'ДОСТУПНЫЕ ПРИВИЛЕГИИ', icon: 'fa-crown', subtitle: 'Выберите уровень доступа к командам на сервере' },
    'cases': { title: 'ДОСТУПНЫЕ КЕЙСЫ', icon: 'fa-gift', subtitle: 'Испытайте удачу и получите привилегию со скидкой!' },
    'currency': { title: 'ДОСТУПНЫЕ ПРЕДМЕТЫ', icon: 'fa-coins', subtitle: 'Получите полезные предметы и дополнительные плюшки!' }
};

// Переключение категорий
categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Убираем активный класс у всех кнопок
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активный класс текущей кнопке
        this.classList.add('active');
        
        // Получаем категорию
        const category = this.getAttribute('data-category');
        
        // Показываем/скрываем содержимое категорий
        document.querySelectorAll('.category-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Показываем выбранную категорию
        const selectedContent = document.getElementById(`${category}-content`);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
        
        // Обновляем заголовок и подзаголовок
        const sectionHeader = document.querySelector('.section-header h3');
        const sectionSubtitle = document.querySelector('.section-subtitle');
        const sectionIcon = document.querySelector('.section-category-icon');
        
        if (categoryTitles[category]) {
            sectionHeader.innerHTML = `<i class="fas ${categoryTitles[category].icon}"></i> ${categoryTitles[category].title}`;
            sectionSubtitle.textContent = categoryTitles[category].subtitle;
            sectionIcon.className = `fas ${categoryTitles[category].icon}`;
        }
        
        // Показываем/скрываем легенду команд (только для привилегий)
        const commandsLegend = document.getElementById('commands-legend');
        if (category === 'privileges') {
            commandsLegend.style.display = 'block';
        } else {
            commandsLegend.style.display = 'none';
        }
        
        // Обновляем статус
        statusMessage.textContent = `Показаны товары категории: ${this.querySelector('span').textContent}`;
        statusMessage.style.color = '#6c63ff';
        
        // Анимация переключения
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// ====================
// ДОБАВИТЬ В funPayLinks ВСЕ НОВЫЕ ТОВАРЫ
// ====================

// Обновите объект funPayLinks, добавив все новые товары:

// СТАЛО (оставляем только):
const funPayLinks = {
    // Привилегии (основные)
    'GENESIS': `${funPayBaseUrl}/lots/genesis`,
    'CHIMERA': `${funPayBaseUrl}/lots/chimera`,
    'ODYSSEY': `${funPayBaseUrl}/lots/odyssey`,
    'LEVIATHAN': `${funPayBaseUrl}/lots/leviathan`,
    'VALKYRIE': `${funPayBaseUrl}/lots/valkyrie`,
    'CERBERUS': `${funPayBaseUrl}/lots/cerberus`,
    'CUSTOM': `${funPayBaseUrl}/lots/custom`,
    
    // Новогодние привилегии (только в категории "Привилегии")
    'SANTA': `${funPayBaseUrl}/lots/santa`,
    'GRINCH': `${funPayBaseUrl}/lots/grinch`,
    'CHRISTMAS': `${funPayBaseUrl}/lots/christmas`,
    
    // Кейсы
    'CASE_START': `${funPayBaseUrl}/lots/case_start`,
    'CASE_PREMIUM': `${funPayBaseUrl}/lots/case_premium`,
    'CASE_LEGENDARY': `${funPayBaseUrl}/lots/case_legendary`,
    'CASE_PACK_5': `${funPayBaseUrl}/lots/case_pack_5`,
    
    // Другое
    'CURRENCY_10K': `${funPayBaseUrl}/lots/offer?id=60940026`,
    'CURRENCY_50K': `${funPayBaseUrl}/lots/offer?id=60940026`,
    'CURRENCY_200K': `${funPayBaseUrl}/lots/offer?id=60940160`,
    'CURRENCY_1M': `${funPayBaseUrl}/lots/offer?id=60940160`
};
    
    // Обработка покупки - ИСПРАВЛЕННЫЙ КОД
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = this.getAttribute('data-price');
            
            // Сохраняем оригинальный текст кнопки
            const originalText = this.innerHTML;
            const originalBackground = this.style.background;
            
            // Показываем состояние загрузки
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Перенаправляем...';
            this.disabled = true;
            this.style.background = '#8a84ff';
            
            // Обновляем статус
            statusMessage.innerHTML = `<i class="fas fa-external-link-alt"></i> Открываем страницу оплаты для "${product}"...`;
            statusMessage.style.color = '#6c63ff';
            
            // ВАЖНО: Здесь настройте реальные ссылки на товары
            // Вариант 1: Если используете CloudDonate - раскомментируйте
            // const productIds = {
            //     'Monster': 'prod_monster_001',
            //     'Resident': 'prod_resident_002',
            //     'Ghost': 'prod_ghost_003',
            //     'Anubis': 'prod_anubis_004',
            //     'Aqua': 'prod_aqua_005'
            // };
            // const productId = productIds[product] || 'default';
            // const redirectUrl = `https://clouddonate.ru/checkout/${productId}?price=${price}`;
            
            // Вариант 2: Если используете FunPay (как в исходном запросе)
// Вариант 2: Если используете FunPay
const funPayLinks = {
    'GENESIS': `${funPayBaseUrl}/lots/offer?id=35089436`,
    'CHIMERA': `${funPayBaseUrl}/lots/offer?id=35089383`,
    'ODYSSEY': `${funPayBaseUrl}/lots/offer?id=35089284`,
    'LEVIATHAN': `${funPayBaseUrl}/lots/offer?id=35089186`,
    'VALKYRIE': `${funPayBaseUrl}/lots/offer?id=35088547`,
    'CERBERUS': `${funPayBaseUrl}/lots/offer?id=35088405`,
    'CUSTOM': `${funPayBaseUrl}/lots/offer?id=35088216`,
    'SANTA': `${funPayBaseUrl}/lots/offer?id=60938628`,
    'GRINCH': `${funPayBaseUrl}/lots/offer?id=35087453`,
    'BRAWLER': `${funPayBaseUrl}/lots/offer?id=35087453`,
    'CHRISTMAS': `${funPayBaseUrl}/lots/offer?id=60938761`,
    'CASE_START': `${funPayBaseUrl}/lots/offer?id=35089578`,
    'CASE_PREMIUM': `${funPayBaseUrl}/lots/offer?id=35089504`,
    'CASE_LEGENDARY': `${funPayBaseUrl}/lots/offer?id=35089659`,
    'CASE_PACK_5': `${funPayBaseUrl}/lots/case_pack_5`,
    'CURRENCY_10K': `${funPayBaseUrl}/lots/offer?id=60939918`,
    'CURRENCY_50K': `${funPayBaseUrl}/lots/offer?id=60939979`,
    'CURRENCY_200K': `${funPayBaseUrl}/lots/offer?id=60940026`,
    'CURRENCY_1M': `${funPayBaseUrl}/lots/offer?id=60940241`
};
            
            const redirectUrl = funPayLinks[product] || funPayBaseUrl;
            
            // Задержка для визуального эффекта (1 секунда)
            setTimeout(() => {
                // ВОТ ЭТА СТРОКА ВЫПОЛНЯЕТ ПЕРЕНАПРАВЛЕНИЕ!
                // Открывает страницу оплаты в новой вкладке
                window.open(redirectUrl, '_blank');
                
                // Восстанавливаем кнопку
                this.innerHTML = originalText;
                this.disabled = false;
                this.style.background = originalBackground;
                
                // Показываем успешное сообщение
                statusMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i> Страница оплаты открыта в новой вкладке!
                    <br><small>Завершите покупку в открывшемся окне. Не забудьте указать свой ник Minecraft!</small>
                `;
                statusMessage.style.color = '#4CAF50';
                
                // Визуальный эффект на карточке товара
                const card = this.closest('.product-card');
                card.style.boxShadow = '0 0 25px rgba(108, 99, 255, 0.4)';
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    card.style.boxShadow = '';
                    card.style.transform = '';
                }, 1500);
                
            }, 1000); // Задержка 1 секунда перед перенаправлением
        });
    });
    
    // Переключение категорий
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            statusMessage.textContent = `Здесь будет в дальнейшем будет информация!`;
            statusMessage.style.color = '#6c63ff';
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Назначаем обработчик копирования IP
    if (copyButton) {
        copyButton.addEventListener('click', copyServerIP);
    }
    
    // ====================
// DISCORD КНОПКА
// ====================

// Находим все Discord ссылки
const discordLinks = document.querySelectorAll('.discord-link, [href*="discord"]');

// Обработчик для Discord кнопок
discordLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Если это обычная ссылка внутри страницы
        if (this.getAttribute('href') === '#') {
            e.preventDefault(); // Отменяем стандартное поведение
            
            // Ссылка на ваш Discord сервер
            const discordUrl = 'https://discord.gg/ваша_ссылка';
            
            // Показываем анимацию
            this.style.transform = 'scale(0.95)';
            this.style.color = '#7289da';
            
            // Обновляем статус
            statusMessage.innerHTML = '<i class="fab fa-discord"></i> Открываю Discord сервер...';
            statusMessage.style.color = '#7289da';
            
            // Задержка для анимации
            setTimeout(() => {
                // Открываем Discord в новой вкладке
                window.open(discordUrl, '_blank');
                
                // Возвращаем стили
                this.style.transform = '';
                this.style.color = '';
                
                // Сообщение об успехе
                statusMessage.innerHTML = '<i class="fab fa-discord"></i> Discord сервер открыт в новой вкладке!';
                setTimeout(() => {
                    statusMessage.innerHTML = 'Выберите категорию и товар, затем нажмите "Купить"';
                    statusMessage.style.color = '';
                }, 3000);
            }, 300);
        }
    });
});


// ====================
// TELEGRAM КНОПКА
// ====================

const telegramLinks = document.querySelectorAll('.telegram-link, [href*="t.me"], [href*="telegram"]');
telegramLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
            
            // Ссылка на ваш Telegram канал/бот/группу
            const telegramUrl = 'https://t.me/ваш_телеграм'; // ЗАМЕНИТЕ НА СВОЮ ССЫЛКУ
            
            this.style.transform = 'scale(0.95)';
            this.style.color = '#0088cc';
            
            statusMessage.innerHTML = '<i class="fab fa-telegram"></i> Открываю Telegram...';
            statusMessage.style.color = '#0088cc';
            
            setTimeout(() => {
                window.open(telegramUrl, '_blank');
                this.style.transform = '';
                this.style.color = '';
                
                statusMessage.innerHTML = '<i class="fab fa-telegram"></i> Telegram открыт!';
                setTimeout(() => {
                    statusMessage.innerHTML = 'Выберите категорию и товар, затем нажмите "Купить"';
                    statusMessage.style.color = '';
                }, 3000);
            }, 300);
        }
    });
});
    // Инициализация
    console.log('AthensMine Donate Website initialized!');
    setTimeout(updateOnlineStats, 1000);
});
