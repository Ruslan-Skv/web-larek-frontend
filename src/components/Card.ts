import { ICard } from "../types";
import { categories } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

// Интерфейс действий для карточки
interface ICardActions {
    onClick: (event: MouseEvent) => void; // Обработчик события нажатия
}

// Класс Card — компонент карточки товара
export class Card extends Component<ICard> {
    protected _title: HTMLElement; // Элемент для отображения названия товара
    protected _image?: HTMLImageElement; // Элемент для отображения изображения товара
    protected _price: HTMLElement; // Элемент для отображения цены товара
    protected _category?: HTMLElement; // Элемент для отображения категории товара
    protected _description?: HTMLElement; // Элемент для отображения описания товара
    protected _button?: HTMLButtonElement; // Кнопка взаимодействия с карточкой

    // Конструктор класса
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container); // Передаем контейнер в базовый класс

        // Инициализация элементов карточки
        this._title = ensureElement<HTMLElement>('.card__title', container); // Заголовок
        this._image = container.querySelector('.card__image'); // Изображение
        this._price = ensureElement<HTMLImageElement>('.card__price', container); // Цена
        this._category = container.querySelector('.card__category'); // Категория
        this._button = container.querySelector('.card__button'); // Кнопка
        this._description = container.querySelector('.card__description'); // Описание

        // Если передан обработчик onClick, привязываем его к кнопке или всей карточке
        if (actions?.onClick) {
            if (this._button) {
                // Если кнопка существует, привязываем обработчик к кнопке
                this._button.addEventListener('click', actions.onClick);
            } else {
                // Если кнопки нет, привязываем обработчик к контейнеру карточки
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Сеттер и геттер для ID карточки
    set id(value: string) {
        this.container.dataset.id = value; // Устанавливаем ID в атрибут data-id контейнера
    }

    get id(): string {
        return this.container.dataset.id || ''; // Возвращаем ID из атрибута data-id
    }

    // Сеттер и геттер для названия товара
    set title(value: string) {
        this.setText(this._title, value); // Устанавливаем текст заголовка
    }

    get title(): string {
        return this._title.textContent || ''; // Возвращаем текст заголовка
    }

    // Сеттер и геттер для цены товара
    set price(value: string) {
        // Устанавливаем текст цены (добавляем "синапсов" или "Бесценно")
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        if (this._button) {
            // Если кнопка существует, делаем её неактивной, если цена отсутствует
            this.setDisabled(this._button, !value);
        }
    }

    get price(): string {
        return this._price.textContent || ''; // Возвращаем текст цены
    }

    // Сеттер и геттер для категории товара
    set category(value: string) {
        this.setText(this._category, value); // Устанавливаем текст категории
        if (this._category) {
            // Добавляем CSS-класс для категории (если категория не найдена, используется "other")
            this.toggleClass(this._category, `card__category_${
                    categories.get(value) ? categories.get(value) : 'other'
                }`, true);
        }
    }

    get category(): string {
        return this._category.textContent || ''; // Возвращаем текст категории
    }

    // Сеттер для изображения товара
    set image(src: string) {
        this.setImage(this._image, src, this.title); // Устанавливаем источник изображения и alt-текст
    }

    // Сеттер для описания товара
    set description(value: string) {
        this.setText(this._description, value); // Устанавливаем текст описания
    }

    // Сеттер для текста кнопки
    set button(value: string) {
        this.setText(this._button, value); // Устанавливаем текст кнопки
    }
}