# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей 
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Интерфейс карточки товара

```
interface ICard {
    id: string; // Уникальный идентификатор товара
    description: string; // Описание товара
    image: string; // URL изображения товара
    title: string; // Название товара
    category: string; // Категория товара (например, "электроника", "одежда")
    price: number | null; // Цена товара (null, если цена не указана)
}
```

Интерфейс корзины

```
interface IBasket {
    items: string[]; // Список идентификаторов товаров, добавленных в корзину
    total: number; // Общая стоимость товаров в корзине
}
```

Тип для описания способов оплаты

```
type PaymentMethod = 'cash' | 'card';
```

Интерфейс заказа
```
interface IOrder {
    payment: PaymentMethod; // Способ оплаты (наличные или карта)
    email: string; // Email пользователя, указанный при оформлении заказа
    phone: string; // Телефон пользователя, указанный при оформлении заказа
    address: string; // Адрес доставки
    items: string[]; // Список идентификаторов товаров, включенных в заказ
    total: number; // Общая стоимость заказа
}
```

Тип для описания данных заказа, необходимых для оформления
```
export type TOrder = Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>;
// Содержит только ключевые поля из IOrder:
// - payment: способ оплаты
// - email: email пользователя
// - phone: телефон пользователя
// - address: адрес доставки
```

Тип для описания данных пользователя, связанных с адресом и оплатой
```
export type TUserAdress = Pick<IOrder, 'payment' | 'address'>;
// Содержит только поля из IOrder, связанные с адресом и оплатой:
// - payment: способ оплаты
// - address: адрес доставки
```

Тип для описания данных пользователя, связанных с контактной информацией
```
export type TUserMailTel = Pick<IOrder, 'email' | 'phone'>;
// Содержит только поля из IOrder, связанные с контактной информацией:
// - email: email пользователя
// - phone: телефон пользователя
```

Интерфейс для описания результата создания заказа
```
interface IOrderResult {
    id: string; // Уникальный идентификатор созданного заказа
    total: number; // Общая стоимость заказа
}
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов.\
Свойства класса Api:
- baseUrl: string - Базовый URL для всех запросов.
- options: RequestInit - Описание: Общие настройки для всех запросов. Эти настройки включают заголовки, параметры авторизации и другие параметры, поддерживаемые fetch.\

Конструктор класса Api принимает два параметра:
- baseUrl: string — базовый URL для всех запросов. Это строка, которая указывает на корневой адрес API;
- options: RequestInit — объект с настройками для запросов. Эти настройки включают заголовки, параметры авторизации и другие параметры, поддерживаемые fetch.

Методы класса Api: 
- get(uri: string): Promise<object> - Выполняет HTTP GET-запрос на указанный URI. Параметры: uri: string — URI, который будет добавлен к baseUrl. Возвращает: Promise<object> — промис, который разрешается в объект с данными ответа;
- post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> - Выполняет HTTP POST, PUT или DELETE-запрос на указанный URI с переданными данными. Параметры: uri: string — URI, который будет добавлен к baseUrl. data: object — объект с данными, которые будут отправлены в теле запроса. method: ApiPostMethods (опционально) — HTTP-метод запроса. По умолчанию используется POST. Возможные значения: 'POST', 'PUT', 'DELETE'. Возвращает: Promise<object> — промис, который разрешается в объект с данными ответа;
- protected handleResponse(response: Response): Promise<object> - Обрабатывает ответ от сервера. Если запрос успешен (response.ok), возвращает данные в формате JSON. Если запрос завершился с ошибкой, извлекает сообщение об ошибке из тела ответа. Параметры: response: Response — объект ответа от fetch.
Возвращает: Promise<object> — промис, который разрешается в объект с данными ответа или отклоняется с ошибкой. Этот метод используется внутри методов get и post для обработки ответа.
Класс использует типы:
type ApiListResponse<Type> = {
    total: number, // Общее количество элементов
    items: Type[] // Список элементов
};
Для методов HTTP-запросов, используемых в методе post используются типы:
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

#### Класс EventEmitter

Модуль events.ts предоставляет реализацию брокера событий (EventEmitter), который используется для управления событиями в проекте. Этот модуль позволяет подписываться на события, инициировать их и управлять обработчиками. Реализация поддерживает подписку на конкретные события, шаблоны событий (с использованием регулярных выражений) и глобальную подписку на все события. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. \
Конструктор класса EventEmitter инициализирует объект для хранения событий и их подписчиков. Конструктор не принимает параметров. \

Свойства класса EventEmitter:
- `_events: Map<EventName, Set<Subscriber>>` - Хранилище всех событий и их подписчиков. Тип: `Map<EventName, Set<Subscriber>>`. EventName — имя события (строка или регулярное выражение). Set<Subscriber> — множество функций-обработчиков, подписанных на событие.

Методы класса EventEmitter:
- on<T extends object>(event: EventName, callback: (data: T) => void): void - Устанавливает обработчик на указанное событие. Параметры:
event: EventName — имя события (строка или регулярное выражение). callback: (data: T) => void — функция-обработчик, которая будет вызвана при возникновении события. Возвращает: void;
- off(event: EventName, callback: Subscriber): void - Удаляет обработчик с указанного события. event: EventName — имя события (строка или регулярное выражение). callback: Subscriber — функция-обработчик, которую нужно удалить. Возвращает: void
- emit<T extends object>(event: string, data?: T): void - Инициирует событие с указанным именем и передает данные подписчикам. event: string — имя события.
data?: T — данные, которые будут переданы подписчикам. Возвращает: void;
- onAll(callback: (event: EmitterEvent) => void): void - Устанавливает обработчик, который будет вызван для всех событий. callback: (event: EmitterEvent) => void — функция-обработчик, которая будет вызвана для всех событий. Объект события содержит имя события и данные. Возвращает: void;
- offAll(): void - Удаляет все обработчики для всех событий;
- trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void - Создает функцию-триггер, которая генерирует событие при вызове. event: string — имя события. context?: Partial<T> — дополнительные данные, которые будут добавлены к событию. Возвращает: (data: T) => void — функция, которая генерирует событие.


#### Класс Component

Класс Component используется для создания компонентов пользовательского интерфейса в проекте. Это абстрактный базовый класс, который предоставляет методы для работы с DOM-элементами.  Его нельзя использовать напрямую. Он предназначен для наследования.\
  Класс предоставляет методы для работы с DOM-элементами:
- toggleClass - Переключает класс у элемента;
- setText - Устанавливает текстовое содержимое элемента;
- setDisabled - Устанавливает или снимает блокировку элемента;
- setHidden и setVisible - Управляют видимостью элемента;
- setImage - Устанавливает изображение и альтернативный текст.
- render - возвращает корневой DOM-элемент компонента и позволяет обновлять его состояние.


#### Класс View

Класс View расширяет функциональность Component, добавляя поддержку событий через интерфейс IEvents. Используется для компонентов, которые должны взаимодействовать с системой событий.

### Слой данных


#### Класс AppData

Класс отвечает за хранение и логику работы с данными приложения.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- items: ICard[] - Список всех товаров;
- preview: ICard | null -  Текущий товар для предпросмотра;
- basket: IBasket = {
        items - Список ID товаров в корзине
        total - Общая сумма товаров в корзине
    };
- order: TOrder = {
        email: - Email пользователя
        phone: - Телефон пользователя
        address: - Адрес доставки
        payment: - Способ оплаты (по умолчанию — "карта")
    };
- formErrors: Partial<Record<keyof TOrder, string>>  - Ошибки форм (ключ — поле, значение — текст ошибки)\

Также класс предоставляет набор методов для взаимодействия с этими данными,
для изменения состояния и валидации данных, а также генерирует события для уведомления других частей приложения об изменениях:

- Метод setItems - обновляет список товаров и генерирует событие items:change;
- Метод setPreview - устанавливает текущий товар для предпросмотра и генерирует событие preview:change;
- Методы addToBasket, removeFromBasket и clearBasket изменяют состояние корзины и генерируют событие basket:change;
- Метод setOrderField - позволяет обновлять отдельные поля заказа;
- Метод setPayment - обновляет способ оплаты.
- Метод validateOrderForm - проверяет корректность данных формы заказа;
- Метод validateContactsForm - проверяет корректность данных формы контактов.
Оба метода сохраняют ошибки в formErrors и генерируют соответствующие события.\
Все изменения состояния сопровождаются генерацией событий, чтобы другие части приложения могли реагировать на них.


### Слой отображения

#### Класс Basket

Класс представляет собой компонент корзины для веб-приложения. Этот компонент отвечает за отображение списка товаров, общей стоимости товаров, а также за управление состоянием кнопки оформления заказа.\

В полях класса хранятся следующие данные:
- static template - Шаблон корзины, который будет клонироваться для создания экземпляра;
- protected _list: HTMLElement - DOM-элемент для отображения списка товаров;
- protected _total: HTMLElement - DOM-элемент для отображения общей стоимости;
- protected _button: HTMLElement - DOM-элемент кнопки оформления заказа.\

В конструкторе происходит инициализация корзины.\

Класс предоставляет набор методов:
- Метод toggleButton - управляет состоянием кнопки оформления заказа.
Если переданный параметр state равен true, кнопка становится активной. Если false — кнопка деактивируется;
- Сеттер items - Этот метод обновляет список товаров в корзине;
- Сеттер total - Этот метод обновляет текстовое значение общей стоимости товаров в корзине.


#### Класс Form

Класс представляет собой компонент для работы с HTML-формами в веб-приложении. Этот компонент eправляет состоянием формы, включая её валидность и отображение ошибок. Обрабатывает события ввода данных и отправки формы. 

В полях класса хранятся следующие данные:
- protected _submit: HTMLButtonElement - Кнопка отправки формы;
- protected _errors: HTMLElement - Контейнер для отображения ошибок.

В конструкторе происходит инициализация формы.
Используется метод ensureElement для получения обязательных DOM-элементов, таких как кнопка отправки (button[type=submit]) и контейнер для ошибок (.form__errors).
Добавляются обработчики событий:
input: вызывается при изменении значения любого поля формы. Генерируется событие <имя_формы>.<имя_поля>:change.
submit: вызывается при отправке формы. Генерируется событие <имя_формы>:submit.

Класс предоставляет набор методов:
- Метод onInputChange - вызывается при изменении значения поля формы. Генерируется событие, содержащее имя поля и его новое значение;
- Сеттер valid - Управляет состоянием кнопки отправки формы. Если форма валидна (valid = true), кнопка становится активной. Если нет — кнопка деактивируется;
- Сеттер errors - Отображает ошибки формы в контейнере для ошибок;
- Метод render - Обновляет состояние формы, включая её валидность, ошибки и значения полей. Вызывает метод render базового класса для обновления состояния.


#### Класс Modal

Класс представляет собой компонент модального окна для веб-приложения. Этот компонент управляет отображением модального окна (открытие и закрытие).
Обрабатывает события взаимодействия с модальным окном, такие как нажатие на кнопку закрытия или клик вне содержимого. Позволяет динамически изменять содержимое модального окна. Генерирует события (modal:open и modal:close).

В полях класса хранятся следующие данные:
- protected _closeButton: HTMLButtonElement - Кнопка закрытия модального окна;
- protected _content: HTMLElement - Контейнер для содержимого модального окна.\

Класс предоставляет набор методов:
- Сеттер content - Позволяет обновлять содержимое модального окна;
- Метод open - Делает модальное окно видимым, добавляя CSS-класс modal_active.
Генерирует событие modal:open;
- Метод close - Скрывает модальное окно, удаляя CSS-класс modal_active.
Очищает содержимое модального окна. Генерирует событие modal:close;
- Метод render - Обновляет содержимое модального окна с помощью метода render базового класса. Автоматически открывает модальное окно после обновления содержимого.

#### Класс Success

Класс представляет собой компонент для отображения сообщения об успешном завершении какого-либо действия (оформления заказа). Отображает сообщение с информацией о списанной сумме. Обрабатывает событие нажатия на кнопку закрытия. Позволяет динамически обновлять отображаемую информацию.\

В полях класса хранятся следующие данные:
- protected _close: HTMLButtonElement - Кнопка закрытия;
- protected _total: HTMLElement - Элемент для отображения суммы списанных синапсов.\

Класс предоставляет набор методов:
- Сеттер total -Позволяет обновлять текстовое содержимое элемента _total, отображая сумму списанных синапсов.\


#### Класс Card

Класс представляет собой компонент карточки товара в веб-приложении. Отображает информацию о товаре, такую как название, изображение, цена, категория и описание.
Позволяет динамически обновлять данные карточки. Обрабатывает события взаимодействия с карточкой, такие как нажатие на кнопку.

В полях класса хранятся следующие данные:
- protected _title: HTMLElement - Элемент для отображения названия товара;
- protected _image?: HTMLImageElement - Элемент для отображения изображения товара;
- protected _price: HTMLElement - Элемент для отображения цены товара;
- protected _category?: HTMLElement - Элемент для отображения категории товара;
- protected _description?: HTMLElement - Элемент для отображения описания товара;
- protected _button?: HTMLButtonElement -  Кнопка взаимодействия с карточкой.\

Класс предоставляет набор методов:
- для каждого элемента карточки (название, цена, категория, изображение, описание, кнопка) предусмотрены сеттеры и геттеры. Сеттеры позволяют динамически обновлять данные карточки. Геттеры позволяют получать текущие данные карточки.
Работа с категориями: При установке категории добавляется CSS-класс, соответствующий категории.


#### Класс ContactsForm

Класс представляет собой компонент формы для ввода контактных данных пользователя (email и телефон). Этот компонент наследуется от базового класса Form, который предоставляет общую функциональность для работы с формами. Управляет полями ввода для email и телефона. Позволяет динамически устанавливать значения для полей формы. Использует события для взаимодействия с другими частями приложения.

В полях класса хранятся следующие данные:
- protected _email: HTMLInputElement - Поле ввода для email;
- protected _phone: HTMLInputElement - Поле ввода для телефона.\

В конструкторе происходит инициализация формы.
Используется метод ensureElement для получения обязательных DOM-элементов:
Поле ввода для email (.form__input[name=email]).
Поле ввода для телефона (.form__input[name=phone]).\

Класс предоставляет набор методов:
- Сеттеры email и phone.



#### Класс OrderForm

Класс представляет собой компонент формы для ввода данных заказа. Этот компонент управляет полями формы, такими как адрес доставки и способ оплаты. Позволяет динамически изменять значения полей формы. Обрабатывает события взаимодействия с элементами формы, такие как выбор способа оплаты. Наследуется от базового класса Form, который предоставляет общую функциональность для работы с формами.

В полях класса хранятся следующие данные:
- protected _paymentCard: HTMLButtonElement - Кнопка выбора оплаты картой;
- protected _paymentCash: HTMLButtonElement - Кнопка выбора оплаты наличными;
- protected _address: HTMLInputElement - Поле ввода адреса доставки.\

В конструкторе происходит инициализация формы.
Используется метод ensureElement для получения обязательных DOM-элементов:
Кнопка выбора оплаты картой (.button_alt[name=card]).
Кнопка выбора оплаты наличными (.button_alt[name=cash]).
Поле ввода адреса доставки (.form__input[name=address]).
Добавляются обработчики событий для кнопок выбора способа оплаты:
При нажатии на кнопку обновляется способ оплаты и генерируется событие изменения.

Класс предоставляет набор методов:
- Сеттер payment - Позволяет установить способ оплаты (карта или наличные).
Добавляет или удаляет CSS-класс button_alt-active для кнопок в зависимости от выбранного способа оплаты;
- Сеттер address - Позволяет установить значение для поля адреса доставки.\


#### Класс Page

Класс представляет собой компонент страницы веб-приложения. Этот компонент управляет основными элементами страницы, такими как каталог товаров, счетчик корзины, и состояние блокировки страницы. Обрабатывает события взаимодействия с элементами страницы, например, открытие корзины. Позволяет динамически обновлять содержимое страницы, включая каталог товаров и счетчик корзины.\

В полях класса хранятся следующие данные:
- protected _counter: HTMLElement - Элемент для отображения счетчика корзины;
- protected _catalog: HTMLElement - Элемент для отображения каталога товаров;
- protected _wrapper: HTMLElement - Обертка страницы;
- protected _basket: HTMLElement - Элемент корзины.\

Класс предоставляет набор методов:
- Сеттер counter - Позволяет обновлять текст счетчика товаров в корзине. Использует метод setText базового класса View для безопасного обновления текста элемента;
- Сеттер catalog - Позволяет заменять содержимое каталога товаров. Использует метод replaceChildren для замены всех дочерних элементов каталога на переданные элементы;
- Сеттер locked - Управляет состоянием блокировки страницы. Добавляет или удаляет CSS-класс page__wrapper_locked для обертки страницы в зависимости от значения.



### Слой коммуникации

#### Класс LarekAPI
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Модуль index.ts является точкой входа для приложения «web-larek-frontend». Этот модуль bнициализирует основные компоненты приложения, такие как API-клиент, модальные окна, формы, корзина и страница. Настраивает обработку событий, связывая компоненты между собой. Выполняет начальную загрузку данных (списка товаров) и их отображение. Управляет взаимодействием пользователя с приложением, включая выбор товаров, работу с корзиной, оформление заказа и обработку форм.\
Основные функции модуля:
- Инициализация компонентов: Создаются экземпляры всех основных компонентов приложения, таких как AppData, Modal, Page, Basket, OrderForm, ContactsForm, и Success;
- Настройка событий: Используется EventEmitter для обработки событий, таких как открытие модального окна, выбор товара, изменение корзины, отправка заказа и валидация форм;
- Работа с API: Используется LarekAPI для взаимодействия с сервером, включая получение списка продуктов и создание заказа;
- Обработка пользовательских действий: Реализуется логика для работы с корзиной, модальными окнами, формами и заказами;
- Начальная загрузка данных: При запуске приложения загружается список продуктов с сервера и отображается на странице.

Основные события:

События модального окна:
- modal:open - Открытие модального окна;
- modal:close - Закрытие модального окна.\

События корзины:
- basket:open - Открытие корзины;
- basket:change - Изменение содержимого корзины.\

События товаров:
- items:change - Изменение списка товаров;
- card:select - Выбор товара для предпросмотра.\

События заказа:
- order:open - Открытие формы заказа;
- order:submit-  Отправка формы заказа;
- orderFormErrors:change - Изменение ошибок формы заказа.\

События контактов:
- contacts:submit - Отправка формы контактов;
- contactsFormErrors:change - Изменение ошибок формы контактов.

