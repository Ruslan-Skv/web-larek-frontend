import { PaymentMethod, TUserAdress } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

// Класс OrderForm — форма для ввода данных заказа
export class OrderForm extends Form<TUserAdress> {
    protected _paymentCard: HTMLButtonElement; // Кнопка выбора оплаты картой
    protected _paymentCash: HTMLButtonElement; // Кнопка выбора оплаты наличными
    protected _address: HTMLInputElement; // Поле ввода адреса доставки

    // Конструктор класса
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Передаем контейнер формы и объект событий в базовый класс

        // Инициализация кнопки выбора оплаты картой
        this._paymentCard = ensureElement<HTMLButtonElement>(
            '.button_alt[name=card]', // Ищем элемент с атрибутом name="card"
            this.container
        );

        // Инициализация кнопки выбора оплаты наличными
        this._paymentCash = ensureElement<HTMLButtonElement>(
            '.button_alt[name=cash]', // Ищем элемент с атрибутом name="cash"
            this.container
        );

        // Инициализация поля ввода адреса доставки
        this._address = ensureElement<HTMLInputElement>(
            '.form__input[name=address]', // Ищем элемент с атрибутом name="address"
            this.container
        );

        // Добавляем обработчик события "клик" на кнопку оплаты картой
        this._paymentCard.addEventListener('click', () => {
            this.payment = 'card'; // Устанавливаем способ оплаты "карта"
            this.onInputChange('payment', 'card'); // Генерируем событие изменения
        });

        // Добавляем обработчик события "клик" на кнопку оплаты наличными
        this._paymentCash.addEventListener('click', () => {
            this.payment = 'cash'; // Устанавливаем способ оплаты "наличные"
            this.onInputChange('payment', 'cash'); // Генерируем событие изменения
        });
    }

    // Сеттер для способа оплаты
    set payment(value: PaymentMethod) {
        // Добавляем или удаляем CSS-класс "button_alt-active" в зависимости от выбранного способа оплаты
        this.toggleClass(this._paymentCard, 'button_alt-active', value === 'card');
        this.toggleClass(this._paymentCash, 'button_alt-active', value === 'cash');
    }

    // Сеттер для адреса доставки
    set address(value: string) {
        this._address.value = value; // Устанавливаем значение поля адреса
    }
}