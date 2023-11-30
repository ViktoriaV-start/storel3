import localforage from 'localforage';
import { ProductData } from 'types';


export class GeneralService {

    DB: string;

    constructor(db: string) {
        this.DB = db;
    }

    init() {
        this.updCounters();
    }

    async addProduct(product: ProductData) {
        const products = await this.get();
        await this.set([...products, product]);
    }

    async removeProduct(product: ProductData) {
        const products = await this.get();
        await this.set(products.filter(({ id }) => id !== product.id));
    }

    async clear() {
        await localforage.removeItem(this.DB);
        this.updCounters();
    }

    async get(): Promise<ProductData[]> {
        return (await localforage.getItem(this.DB)) || [];
    }

    async set(data: ProductData[]) {
        await localforage.setItem(this.DB, data);
        this.updCounters();
    }

     async updCounters() {
        const products = await this.get();
        const count = products.length >= 10 ? '9+' : products.length;

        //@ts-ignore
        document.querySelectorAll('.js__cart-counter').forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
    }


}
