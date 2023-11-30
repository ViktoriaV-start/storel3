// TODO Я бы сделала здесь наследование от общего родителя для FavouriteService и CartService, если можно, но тогда придется менять имеющийся код

import { ProductData } from 'types';
import { GeneralService } from "./general.service";

const DB = '__wb-fav';

class FavouriteService extends GeneralService {

     async updCounters() {
        const products = await this.get();
        const count = products.length >= 10 ? '9+' : products.length;

        console.log(document.querySelectorAll('.js__fav-counter'))

        //@ts-ignore
        document.querySelectorAll('.js__fav-counter').forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
    }

    async isInFav(product: ProductData) {
        const products = await this.get();
        return products.some(({ id }) => id === product.id);
    }

    checkFav() {
        this.get().then((res) => {
            if (res.length) {
                document.querySelector('.header__favourite')?.classList.remove('hide');
            } else {
                document.querySelector('.header__favourite')?.classList.add('hide');
            }
        })
    }

}

export const favouriteService = new FavouriteService(DB);
