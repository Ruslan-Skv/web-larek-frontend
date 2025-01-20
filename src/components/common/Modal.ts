import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

// Интерфейс данных для модального окна
interface IModalData {
    content: HTMLElement; // Содержимое модального окна
}

// Класс модального окна, наследуется от базового компонента
export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
    protected _content: HTMLElement; // Контейнер для содержимого модального окна

    // Конструктор класса
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Передаем контейнер в базовый класс

        // Инициализация кнопки закрытия
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        // Инициализация контейнера для содержимого
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Добавляем обработчик события "клик" на кнопку закрытия
        this._closeButton.addEventListener('click', this.close.bind(this));

        // Добавляем обработчик события "клик" на контейнер модального окна
        this.container.addEventListener('click', this.close.bind(this));

        // Предотвращаем закрытие модального окна при клике на его содержимое
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Сеттер для обновления содержимого модального окна
    set content(value: HTMLElement) {
        // Заменяем содержимое контейнера на новое значение
        this._content.replaceChildren(value);
    }

    // Метод для открытия модального окна
    open() {
        // Добавляем CSS-класс, чтобы сделать модальное окно видимым
        this.container.classList.add('modal_active');

        // Генерируем событие "modal:open"
        this.events.emit('modal:open');
    }

    // Метод для закрытия модального окна
    close() {
        // Удаляем CSS-класс, чтобы скрыть модальное окно
        this.container.classList.remove('modal_active');

        // Очищаем содержимое модального окна
        this.content = null;

        // Генерируем событие "modal:close"
        this.events.emit('modal:close');
    }

    // Метод для рендеринга данных в модальное окно
    render(data: IModalData): HTMLElement {
        // Вызываем метод рендеринга базового класса
        super.render(data);

        // Открываем модальное окно
        this.open();

        // Возвращаем контейнер модального окна
        return this.container;
    }
}