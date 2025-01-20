import { ICard, IOrder, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";

// Интерфейс для API-клиента Larek
export interface ILarekAPI {
    getProductList: () => Promise<ICard[]>; // Метод для получения списка продуктов
    getProduct: (id: string) => Promise<ICard>; // Метод для получения данных о конкретном продукте
    createOrder: (order: IOrder) => Promise<IOrderResult>; // Метод для создания заказа
}

// Класс LarekAPI — специализированный API-клиент для работы с продуктами и заказами
export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string; // URL для CDN (используется для обработки изображений)

    // Конструктор класса
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options); // Вызываем конструктор базового класса Api
        this.cdn = cdn; // Устанавливаем URL для CDN
    }

    // Метод для получения списка продуктов
    getProductList(): Promise<ICard[]> {
        return this.get('/product') // Выполняем GET-запрос к API
            .then((data: ApiListResponse<ICard>) =>
                // Обрабатываем ответ, добавляя полный URL для изображений
                data.items.map((item) => ({
                    ...item, // Копируем данные продукта
                    image: this.cdn + item.image, // Добавляем полный URL для изображения
                }))
            );
    }

    // Метод для получения данных о конкретном продукте
    getProduct(id: string): Promise<ICard> {
        return this.get(`/product/${id}`) // Выполняем GET-запрос к API с ID продукта
            .then((item: ICard) => ({
                ...item, // Копируем данные продукта
                image: this.cdn + item.image, // Добавляем полный URL для изображения
            }));
    }

    // Метод для создания нового заказа
    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order) // Выполняем POST-запрос к API с данными заказа
            .then((data: IOrderResult) => data); // Возвращаем результат создания заказа
    }
}