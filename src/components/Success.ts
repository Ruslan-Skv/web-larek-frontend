import { ensureElement } from "../utils/utils";
import { View } from "./base/Component";
import { IEvents } from "./base/events";

// Интерфейс данных для компонента Success
interface ISuccess {
    total: number; // Сумма списанных синапсов
}

// Интерфейс действий для компонента Success
interface ISuccessActions {
    onClick: () => void; // Обработчик события нажатия на кнопку закрытия
}

// Класс Success, наследуется от базового представления View
export class Success extends View<ISuccess> {
    protected _close: HTMLButtonElement; // Кнопка закрытия
    protected _total: HTMLElement; // Элемент для отображения суммы списанных синапсов

    // Конструктор класса
    constructor(
        container: HTMLElement, // Контейнер компонента
        events: IEvents, // Объект для работы с событиями
        actions: ISuccessActions // Объект с действиями (например, обработчик нажатия)
    ) {
        super(container, events); // Передаем контейнер и события в базовый класс

        // Инициализация кнопки закрытия
        this._close = ensureElement<HTMLButtonElement>(
            '.order-success__close', // Ищем элемент с классом .order-success__close
            this.container
        );

        // Инициализация элемента для отображения суммы
        this._total = ensureElement<HTMLElement>(
            '.order-success__description', // Ищем элемент с классом .order-success__description
            this.container
        );

        // Если передан обработчик onClick, привязываем его к кнопке закрытия
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    // Сеттер для обновления суммы списанных синапсов
    set total(value: number) {
        // Устанавливаем текстовое содержимое элемента _total
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}