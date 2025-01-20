import { ensureElement } from "../../utils/utils";
import { View } from "../base/Component";
import { IEvents } from "../base/events";

// Интерфейс состояния формы
interface IFormState {
    valid: boolean; // Указывает, является ли форма валидной
    errors: string[]; // Список ошибок формы
}

// Класс формы, наследуется от базового представления View
export class Form<T> extends View<IFormState> {
    protected _submit: HTMLButtonElement; // Кнопка отправки формы
    protected _errors: HTMLElement; // Контейнер для отображения ошибок

    // Конструктор класса
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        // Передаем контейнер формы и объект событий в базовый класс
        super(container, events);

        // Инициализация кнопки отправки формы
        this._submit = ensureElement<HTMLButtonElement>(
            'button[type=submit]', // Ищем кнопку с атрибутом type="submit"
            this.container
        );

        // Инициализация контейнера для ошибок
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Добавляем обработчик события "input" для отслеживания изменений в полях формы
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement; // Получаем элемент, вызвавший событие
            const field = target.name as keyof T; // Имя поля (атрибут name)
            const value = target.value; // Значение поля
            this.onInputChange(field, value); // Вызываем метод для обработки изменения
        });

        // Добавляем обработчик события "submit" для обработки отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault(); // Предотвращаем стандартное поведение формы
            this.events.emit(`${this.container.name}:submit`); // Генерируем событие отправки формы
        });
    }

    // Метод для обработки изменения значения поля формы
    protected onInputChange(field: keyof T, value: string) {
        // Генерируем событие изменения поля формы
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field, // Имя поля
            value, // Новое значение
        });
    }

    // Сеттер для управления валидностью формы
    set valid(value: boolean) {
        // Если форма валидна, кнопка отправки активна; если нет — кнопка неактивна
        this._submit.disabled = !value;
    }

    // Сеттер для отображения ошибок формы
    set errors(value: string) {
        // Устанавливаем текстовое содержимое контейнера для ошибок
        this.setText(this._errors, value);
    }

    // Метод для рендеринга состояния формы
    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state; // Извлекаем валидность, ошибки и значения полей
        super.render({ valid, errors }); // Вызываем метод рендеринга базового класса
        Object.assign(this, inputs); // Обновляем значения полей формы
        return this.container; // Возвращаем контейнер формы
    }
}