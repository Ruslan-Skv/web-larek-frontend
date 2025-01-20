import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { ContactsForm } from './components/ContactsForm';
import { LarekAPI } from './components/LarekApi';
import { OrderForm } from './components/OrderForm';
import { Page } from './components/Page';
import './scss/styles.scss';
import { ICard, TOrder } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';


// Создание экземпляра API-клиента
const api = new LarekAPI(CDN_URL, API_URL);

// Создание экземпляра системы событий
const events = new EventEmitter();

// Получение шаблонов из DOM
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); 
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); 
const modalCardTemplate = ensureElement<HTMLTemplateElement>('#modal-container'); 
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); 
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); 

// Создание экземпляра хранилища данных приложения
const appData = new AppData(events);

// Создание экземпляров компонентов
const modal = new Modal(modalCardTemplate, events);
const page = new Page(document.body, events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const basket = new Basket(events);
const success = new Success(cloneTemplate(successTemplate), events, {
    onClick: () => modal.close(), // Закрытие модального окна при нажатии на кнопку
});

// Обработка событий модального окна
events.on('modal:open', () => {
    page.locked = true; // Блокировка страницы при открытии модального окна
});

events.on('modal:close', () => {
    page.locked = false; // Разблокировка страницы при закрытии модального окна
});

// Обработка выбора товара
events.on('card:select', (item: ICard) => {
    appData.setPreview(item); // Установка выбранного товара для предпросмотра
});

// Обработка изменения списка товаров
events.on('items:change', (items: ICard[]) => {
    page.catalog = items.map((item) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item), // Выбор товара при клике
        });
        return card.render(item); // Рендеринг карточки товара
    });
});

// Обработка изменения предпросмотра товара
events.on('preview:change', (item: ICard) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (appData.isInBasket(item)) {
                appData.removeFromBasket(item); // Удаление товара из корзины
                card.button = 'В корзину';
            } else {
                appData.addToBasket(item); // Добавление товара в корзину
                card.button = 'Удалить из корзины';
            }
        },
    });

    card.button = appData.isInBasket(item) ? 'Удалить из корзины' : 'В корзину';
    modal.render({ content: card.render(item) }); // Отображение товара в модальном окне
});

// Обработка изменения корзины
events.on('basket:change', () => {
    page.counter = appData.basket.items.length; // Обновление счетчика корзины
    basket.items = appData.basket.items.map((id) => {
        const item = appData.items.find((item) => item.id === id);
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.removeFromBasket(item), // Удаление товара из корзины
        });
        return card.render(item);
    });

    basket.total = appData.basket.total; // Обновление общей суммы корзины
});

// Обработка открытия корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render(), // Отображение корзины в модальном окне
    });
});

// Обработка открытия формы заказа
events.on('order:open', () => {
    appData.clearOrder(); // Очистка данных заказа
    modal.render({
        content: orderForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

// Обработка отправки формы заказа
events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
});

// Обработка изменения полей формы заказа
events.on(/^order\..*:change$/, (data: { field: keyof TOrder; value: string }) => {
    appData.setOrderField(data.field, data.value);
    appData.validateOrderForm();
});

// Обработка изменения полей формы контактов
events.on(/^contacts\..*:change$/, (data: { field: keyof TOrder; value: string }) => {
    appData.setOrderField(data.field, data.value);
    appData.validateContactsForm();
});

// Обработка ошибок формы заказа
events.on('orderFormErrors:change', (error: Partial<TOrder>) => {
    const { payment, address } = error;
    const formIsValid = !payment && !address;
    orderForm.valid = formIsValid;
    orderForm.errors = formIsValid ? '' : address;
});

// Обработка ошибок формы контактов
events.on('contactsFormErrors:change', (error: Partial<TOrder>) => {
    const { email, phone } = error;
    const formIsValid = !email && !phone;
    contactsForm.valid = formIsValid;
    contactsForm.errors = formIsValid ? '' : email || phone;
});

// Обработка отправки формы контактов
events.on('contacts:submit', () => {
    api.createOrder({ ...appData.order, ...appData.basket })
        .then((data) => {
            modal.render({
                content: success.render(),
            });
            success.total = data.total; // Отображение итоговой суммы
            appData.clearBasket(); // Очистка корзины
            appData.clearOrder(); // Очистка данных заказа
        })
        .catch(console.error);
});

// Загрузка списка продуктов при запуске приложения
api.getProductList()
    .then(appData.setItems.bind(appData)) // Установка списка продуктов
    .catch(console.error);
