import { ensureElement } from "../utils/utils";
import { View } from "./base/Component";
import { IEvents } from "./base/events";

// Интерфейс данных для страницы
interface IPage {
    counter: number; // Счетчик товаров в корзине
    catalog: HTMLElement[]; // Список элементов каталога
    locked: boolean; // Состояние блокировки страницы
}

// Класс Page — компонент страницы
export class Page extends View<IPage> {
    protected _counter: HTMLElement; // Элемент для отображения счетчика корзины
    protected _catalog: HTMLElement; // Элемент для отображения каталога товаров
    protected _wrapper: HTMLElement; // Обертка страницы
    protected _basket: HTMLElement; // Элемент корзины

    // Конструктор класса
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events); // Передаем контейнер страницы и объект событий в базовый класс

        // Инициализация обертки страницы
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

        // Инициализация элемента корзины
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // Инициализация элемента счетчика корзины
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');

        // Инициализация элемента каталога товаров
        this._catalog = ensureElement<HTMLElement>('.gallery');

        // Добавляем обработчик события "клик" на корзину
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open'); // Генерируем событие "basket:open"
        });
    }

    // Сеттер для обновления счетчика товаров в корзине
    set counter(value: number) {
        this.setText(this._counter, String(value)); // Устанавливаем текст счетчика
    }

    // Сеттер для обновления содержимого каталога товаров
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items); // Заменяем содержимое каталога на новые элементы
    }

    // Сеттер для управления состоянием блокировки страницы
    set locked(value: boolean) {
        // Добавляем или удаляем CSS-класс "page__wrapper_locked" в зависимости от значения
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }
}