import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './favourite.tpl.html';

import { ProductList } from '../productList/productList';
import { favouriteService } from "../../services/favourite.service";

class Favourite extends Component {
  favouriteProducts: ProductList;

  constructor(props: any) {
    super(props);

    this.favouriteProducts = new ProductList();
    this.favouriteProducts.attach(this.view.favourite);
  }

  render() {
    favouriteService.get()
        .then((products) => {
          this.favouriteProducts.update(products);
        });

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
            'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
  }
}

export const favouriteComp = new Favourite(html);
