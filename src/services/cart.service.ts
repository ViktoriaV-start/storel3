import { GeneralService } from "./general.service";
import { ProductData } from "../../types";
import {AnalyticService} from "./analytic.service";

const DB = '__wb-cart';

class CartService extends GeneralService {

  async addProduct(product: ProductData) {
    super.addProduct(product);
    AnalyticService.sendAddedProduct(product);
  }

  async isInCart(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  async updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;

    //@ts-ignore
    document.querySelectorAll('.js__cart-counter').forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
  }

}

export const cartService = new CartService(DB);
