import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { View } from "../base/Component";
import { IEvents } from "../base/events";

// Интерфейс для представления состояния корзины
interface IBasketView {
    items: HTMLElement[]; // Список элементов товаров в корзине
    total: number;        // Общая стоимость товаров
    selected: string[];   // Список идентификаторов выбранных товаров
}

// Класс корзины, наследуется от базового представления View
export class Basket extends View<IBasketView> {
    // Шаблон корзины, который будет клонироваться для создания экземпляра
    static template = ensureElement<HTMLTemplateElement>('#basket');

    protected _list: HTMLElement;  // DOM-элемент для отображения списка товаров
    protected _total: HTMLElement; // DOM-элемент для отображения общей стоимости
    protected _button: HTMLElement; // DOM-элемент кнопки оформления заказа

    // Конструктор класса
    constructor(protected events: IEvents) {
        // Клонируем шаблон корзины и передаем его в базовый класс
        super(cloneTemplate(Basket.template), events);

        // Инициализация DOM-элементов
        this._list = ensureElement<HTMLElement>('.basket__list', this.container); // Список товаров
        this._total = this.container.querySelector('.basket__price'); // Общая стоимость
        this._button = this.container.querySelector('.basket__button'); // Кнопка действия

        // Если кнопка существует, добавляем обработчик события "клик"
        if (this._button) {
            this._button.addEventListener('click', () => {
                // При нажатии на кнопку генерируется событие "order:open"
                events.emit('order:open');
            });
        }

        // Инициализация пустого списка товаров
        this.items = [];
    }

    // Метод для управления состоянием кнопки оформления заказа
    toggleButton(state: boolean) {
        // Если state = true, кнопка активна; если false — кнопка неактивна
        this.setDisabled(this._button, !state);
    }

    // Сеттер для обновления списка товаров
    set items(items: HTMLElement[]) {
        if (items.length) {
            // Если список товаров не пуст, заменяем содержимое списка на новые элементы
            this._list.replaceChildren(...items);
            // Активируем кнопку оформления заказа
            this.toggleButton(true);
        } else {
            // Если список товаров пуст, отображаем сообщение "Корзина пуста"
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста',
                })
            );
            // Деактивируем кнопку оформления заказа
            this.toggleButton(false);
        }
    }

    // Сеттер для обновления общей стоимости товаров
    set total(total: number) {
        // Устанавливаем текстовое значение общей стоимости
        this.setText(this._total, `${total} синапсов`);
    }
}