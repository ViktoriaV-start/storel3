import {GeneralService} from "./general.service";
import {ProductData} from "../../types";

const DB = '__wb-cart';

class CartService extends GeneralService {

    async isInCart(product: ProductData) {
        const products = await this.get();
        return products.some(({ id }) => id === product.id);
    }

}

export const cartService = new CartService(DB);
