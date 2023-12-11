import { Product } from "src/modules/product/product";
import { ProductData } from "types";
import { genUUID } from "../utils/helpers";


export class AnalyticService {
  url = '/api/sendEvent';

  init() {
    window.addEventListener("load", this.sendPath.bind(this));
  }

  sendPath() {
    let analyticsData = {
      type: 'route',
      payload: { url: window.location.href },
      timestamp: Date.now()
    }
    this._sendAnalytic(analyticsData);
  }

  observeElem(item: Product) {

    const options = {
      root: null,
      threshold: 1.0
    }

    const observer = new IntersectionObserver((entries) => {

      entries.forEach((el) => {
        if (el.isIntersecting && !this._checkSessionData(item.product.id)) {

          this._setSessionData(item.product.id);

          fetch(`/api/getProductSecretKey?id=${item.product.id}`)
            .then((res) => res.json())
            .then((secretKey) => {

              let analyticsData = {
                type: Object.keys(item.product.log).length ? 'viewCardPromo' : 'viewCard',
                payload: { secretKey: secretKey },
                timestamp: Date.now()
              }

              Object.assign(analyticsData.payload, item.product);

              this._sendAnalytic(analyticsData).then((result ) => {
                if (result.status !== 'ok') this._deleteSessionItem(item.product.id);
              });
            });
        }
      })
    }, options)

    observer.observe(item.view.root)
  }

  sendAddedProduct(item: ProductData) {
    let analyticsData = {
      type: 'addToCard',
      payload: { ...item },
      timestamp: Date.now()
    }

    this._sendAnalytic(analyticsData);
  }

  sendPurchase(items: ProductData[], totalPrice: string) {
    let idArr: number[] = [];
    items.forEach(el => idArr.push(el.id));

    let analyticsData = {
      type: 'purchase',
      payload: {
        orderId: genUUID(),
        totalPrice: totalPrice.split(' ')[0],
        productIds: idArr
      },
      timestamp: Date.now()
    }

    this._sendAnalyticPurchase(analyticsData);

  }

  private async _sendAnalytic(data: object, url = this.url,) {

    let status = 'ok';

    try {
      const response: Response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log('Ошибка при отправке данных');
        status = 'error';
      }
      return { status }
    } catch (er) {
      status = 'error';
      console.log(er);
      return { status }
    }
  }

  private _sendAnalyticPurchase(data: object, url = this.url,) {
    navigator.sendBeacon(url, JSON.stringify(data));
  }

   private _setSessionData(id: number) {
    let sessionData = sessionStorage.getItem('lookedProducts') ?? '';
    let lookedProducts = sessionData ? JSON.parse(sessionData) : [];

    lookedProducts.push(id);
    sessionStorage.setItem('lookedProducts', JSON.stringify(lookedProducts))
  }

   private _getSessionData() {
    let sessionData = sessionStorage.getItem('lookedProducts') ?? '';
    return sessionData ? JSON.parse(sessionData) : [];
  }

   private _checkSessionData(id: number) {
    let data = this._getSessionData();
    let result = false;
    if (data.includes(id)) {
      result = true;
    }
    return result;
  }

   private _deleteSessionItem(id: number) {
    let data = this._getSessionData();
    data = data.filter((el: number) => el != id);
    sessionStorage.setItem('lookedProducts', JSON.stringify(data))
  }

}

export const analyticSevice = new AnalyticService();
