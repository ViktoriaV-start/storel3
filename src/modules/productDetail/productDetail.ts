import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import {favouriteService} from "../../services/favourite.service";

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);

  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    this.view.btnFav.onclick = this._addFavourite.bind(this);
    this.view.btnFavColor.onclick = this._removeFavourite.bind(this);

    await this._setFav();

    const isInCart = await cartService.isInCart(this.product);

    if (isInCart) this._setInCart();

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;
    cartService.addProduct(this.product);
    this._setInCart();
  }

  private _addFavourite() {
    if (!this.product) return;
    favouriteService.addProduct(this.product).then(() => this._setFav());
  }

  private _removeFavourite() {
    if (!this.product) return;
    favouriteService.removeProduct(this.product).then(() => this._setFav());
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }

  private async _setFav() {
    if (!this.product) return;

    if (await favouriteService.isInFav(this.product)) {
      document.querySelector('.btnFav[data-tag="btnFav"]')?.classList.add('hide');
      document.querySelector('.btnFav[data-tag="btnFavColor"]')?.classList.remove('hide');
    } else {
      document.querySelector('.btnFav[data-tag="btnFav"]')?.classList.remove('hide');
      document.querySelector('.btnFav[data-tag="btnFavColor"]')?.classList.add('hide');
    }

    favouriteService.checkFav();
  }
}

export const productDetailComp = new ProductDetail(html);
