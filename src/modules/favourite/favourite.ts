
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
  }
}

export const favouriteComp = new Favourite(html);
