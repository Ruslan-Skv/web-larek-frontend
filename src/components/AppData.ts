import { IBasket, ICard, PaymentMethod, TOrder } from "../types";
import { EMAIL_REGEXP, TEL_REGEXP } from "../utils/constants";
import { IEvents } from "./base/events";

// Класс AppData — центральное хранилище данных приложения
export class AppData {
    items: ICard[] = []; // Список всех товаров
    preview: ICard | null = null; // Текущий товар для предпросмотра
    basket: IBasket = {
        items: [], // Список ID товаров в корзине
        total: 0, // Общая сумма товаров в корзине
    };
    order: TOrder = {
        email: '', // Email пользователя
        phone: '', // Телефон пользователя
        address: '', // Адрес доставки
        payment: 'card', // Способ оплаты (по умолчанию — "карта")
    };
    formErrors: Partial<Record<keyof TOrder, string>> = {}; // Ошибки форм (ключ — поле, значение — текст ошибки)

    // Конструктор принимает объект для работы с событиями
    constructor(protected events: IEvents) {}

    // Устанавливает список товаров и генерирует событие "items:change"
    setItems(items: ICard[]) {
        this.items = items;
        this.events.emit('items:change', this.items);
    }

    // Устанавливает текущий товар для предпросмотра и генерирует событие "preview:change"
    setPreview(item: ICard) {
        this.preview = item;
        this.events.emit('preview:change', this.preview);
    }

    // Проверяет, находится ли товар в корзине
    isInBasket(item: ICard) {
        return this.basket.items.includes(item.id);
    }

    // Добавляет товар в корзину и генерирует событие "basket:change"
    addToBasket(item: ICard) {
        this.basket.items.push(item.id); // Добавляем ID товара в корзину
        this.basket.total += item.price; // Увеличиваем общую сумму
        this.events.emit('basket:change', this.basket);
    }

    // Удаляет товар из корзины и генерирует событие "basket:change"
    removeFromBasket(item: ICard) {
        this.basket.items = this.basket.items.filter((id) => id !== item.id); // Удаляем ID товара из корзины
        this.basket.total -= item.price; // Уменьшаем общую сумму
        this.events.emit('basket:change', this.basket);
    }

    // Очищает корзину и генерирует событие "basket:change"
    clearBasket() {
        this.basket.items = []; // Очищаем список товаров
        this.basket.total = 0; // Сбрасываем общую сумму
        this.events.emit('basket:change');
    }

    // Устанавливает способ оплаты
    setPayment(method: PaymentMethod) {
        this.order.payment = method;
    }

    // Устанавливает значение для указанного поля заказа
    setOrderField(field: keyof TOrder, value: string) {
        if (field === 'payment') {
            this.setPayment(value as PaymentMethod); // Если поле — "payment", вызываем setPayment
        } else {
            this.order[field] = value; // В противном случае обновляем поле заказа
        }
    }

    // Валидирует форму заказа и генерирует событие "orderFormErrors:change"
    validateOrderForm() {
        const errors: typeof this.formErrors = {}; // Локальный объект для ошибок
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес'; // Проверяем наличие адреса
        }
        this.formErrors = errors; // Сохраняем ошибки
        this.events.emit('orderFormErrors:change', this.formErrors); // Генерируем событие
        return Object.keys(errors).length === 0; // Возвращаем true, если ошибок нет
    }

    // Валидирует форму контактов и генерирует событие "contactsFormErrors:change"
    validateContactsForm() {
        const errors: typeof this.formErrors = {}; // Локальный объект для ошибок
        if (!this.order.email) {
            errors.email = 'Необходимо указать email'; // Проверяем наличие email
        } else if (!EMAIL_REGEXP.test(this.order.email)) {
            errors.email = 'Неправильно указан email'; // Проверяем формат email
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон'; // Проверяем наличие телефона
        } else if (!TEL_REGEXP.test(this.order.phone)) {
            errors.phone = 'Неправильно указан телефон'; // Проверяем формат телефона
        }
        this.formErrors = errors; // Сохраняем ошибки
        this.events.emit('contactsFormErrors:change', this.formErrors); // Генерируем событие
        return Object.keys(errors).length === 0; // Возвращаем true, если ошибок нет
    }

    // Очищает данные заказа
    clearOrder() {
        this.order = {
            email: '',
            phone: '',
            address: '',
            payment: 'card',
        };
    }
}