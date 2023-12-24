import { ProductData } from 'types';
import { GeneralService } from "./general.service";
import { ProductDetail } from '../modules/productDetail/productDetail';

const DB = '__wb-fav';
const HEAD_HREF = '.header__favourite';
const HEAD_COUNTER = '.js__fav-counter';

class FavouriteService extends GeneralService {

  init() {
    super.init();
    this.checkFav();
  }

  async updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;

    //@ts-ignore
    document.querySelectorAll(HEAD_COUNTER).forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
  }

  async isInFav(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  checkFav() {
    this.get().then((res) => {
      if (res.length) {
        document.querySelector(HEAD_HREF)?.classList.remove('hide');
      } else {
        document.querySelector(HEAD_HREF)?.classList.add('hide');
      }
    })
  }

  async handleClick(item: ProductDetail) {

    return new Promise(async (resolve) => {
      if (!item.product) return;
      if (await this.isInFav(item.product)) {
        await this.removeProduct(item.product);
        resolve('ok');
      } else {
        await this.addProduct(item.product)
        resolve('ok');
      }
    }).then(() => this.checkFav());

  }
}

export const favouriteService = new FavouriteService(DB);
