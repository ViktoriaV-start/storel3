import { GeneralService } from "./general.service";
import { ProductData } from "../../types";
import { analyticService } from "./analytic.service";


class CartService extends GeneralService {

  async addProduct(product: ProductData) {
    await super.addProduct(product);
    analyticService.sendAddedProduct(product);
  }
}

export const cartService = new CartService('cart');
