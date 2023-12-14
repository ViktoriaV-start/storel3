import localforage from 'localforage';
import { ProductData } from 'types';

const MAP = {
  cart: {
    db: '__wb-cart',
    counter: '.js__cart-counter'
  },
  favourite: {
    db: '__wb-fav',
    counter: '.js__fav-counter'
  }
}

export class GeneralService {

  DB: string;
  classCounter: string;

  constructor(component: string) {
    // @ts-ignore
    this.DB = MAP[component].db;
    // @ts-ignore
    this.classCounter = MAP[component].counter;
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
    await this.updCounters();
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(this.DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(this.DB, data);
    await this.updCounters();
  }

  async updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;

    //@ts-ignore
    document.querySelectorAll(this.classCounter).forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
  }

  async isAdded(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

}
