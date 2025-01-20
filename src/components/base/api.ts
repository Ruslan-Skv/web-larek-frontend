// Тип для ответа API, который возвращает список элементов
export type ApiListResponse<Type> = {
    total: number, // Общее количество элементов
    items: Type[] // Список элементов
};

// Тип для методов HTTP-запросов, используемых в методе post
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Класс Api — универсальный клиент для работы с API
export class Api {
    readonly baseUrl: string; // Базовый URL для всех запросов
    protected options: RequestInit; // Общие настройки для запросов

    // Конструктор класса
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl; // Устанавливаем базовый URL

        // Устанавливаем общие настройки для запросов
        this.options = {
            headers: {
                'Content-Type': 'application/json', // Устанавливаем заголовок Content-Type
                ...(options.headers as object ?? {}) // Добавляем дополнительные заголовки, если они переданы
            }
        };
    }

    // Метод для обработки ответа от сервера
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) {
            // Если запрос успешен, возвращаем данные в формате JSON
            return response.json();
        } else {
            // Если запрос завершился с ошибкой, извлекаем ошибку из тела ответа
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText));
        }
    }

    // Метод для выполнения GET-запроса
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options, // Используем общие настройки
            method: 'GET' // Устанавливаем метод запроса
        }).then(this.handleResponse); // Обрабатываем ответ
    }

    // Метод для выполнения POST/PUT/DELETE-запроса
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options, // Используем общие настройки
            method, // Устанавливаем метод запроса (по умолчанию POST)
            body: JSON.stringify(data) // Преобразуем данные в JSON-строку
        }).then(this.handleResponse); // Обрабатываем ответ
    }
}
