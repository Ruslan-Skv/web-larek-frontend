import { TUserMailTel } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

// Класс ContactsForm — форма для ввода контактных данных
export class ContactsForm extends Form<TUserMailTel> {
    protected _email: HTMLInputElement; // Поле ввода для email
    protected _phone: HTMLInputElement; // Поле ввода для телефона

    // Конструктор класса
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Передаем контейнер формы и объект событий в базовый класс

        // Инициализация поля ввода для email
        this._email = ensureElement<HTMLInputElement>(
            '.form__input[name=email]', // Ищем элемент с атрибутом name="email"
            this.container
        );

        // Инициализация поля ввода для телефона
        this._phone = ensureElement<HTMLInputElement>(
            '.form__input[name=phone]', // Ищем элемент с атрибутом name="phone"
            this.container
        );
    }

    // Сеттер для значения поля email
    set email(value: string) {
        this._email.value = value; // Устанавливаем значение поля email
    }

    // Сеттер для значения поля phone
    set phone(value: string) {
        this._phone.value = value; // Устанавливаем значение поля phone
    }
}