import { Product } from "src/modules/product/product";
import { ProductData } from "types";
import { genUUID } from "../utils/helpers";


export class AnalyticService {
  static url = '/api/sendEvent';

  init() {
    window.addEventListener("load", function() {
      let analyticsData = {
        type: 'route',
        payload: { url: window.location.href },
        timestamp: Date.now()
      }
      AnalyticService._sendAnalytic(analyticsData);
    });
  }

  static observeElem(item: Product) {

    const options = {
      root: null,
      threshold: 1.0
    }

    const observer = new IntersectionObserver((entries) => {

      entries.forEach((el) => {
        if (el.isIntersecting && !this.checkSessionData(item.product.id)) {

          this.setSessionData(item.product.id);

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
                if (result.status !== 'ok') this.deleteSessionItem(item.product.id);
              });
            });
        }
      })
    }, options)

    observer.observe(item.view.root)
  }

  static sendAddedProduct(item: ProductData) {
    let analyticsData = {
      type: 'addToCard',
      payload: { ...item },
      timestamp: Date.now()
    }

    this._sendAnalytic(analyticsData);
  }

  static async sendPurchase(items: ProductData[], totalPrice: string) {
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

  private static async _sendAnalytic(data: object, url = this.url,) {

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

  private static _sendAnalyticPurchase(data: object, url = this.url,) {
    navigator.sendBeacon(url, JSON.stringify(data));

  }

  static setSessionData(id: number) {
    let sessionData = sessionStorage.getItem('lookedProducts') ?? '';
    let lookedProducts = sessionData ? JSON.parse(sessionData) : [];

    lookedProducts.push(id);
    sessionStorage.setItem('lookedProducts', JSON.stringify(lookedProducts))
  }

  static getSessionData() {
    let sessionData = sessionStorage.getItem('lookedProducts') ?? '';
    return sessionData ? JSON.parse(sessionData) : [];
  }

  static checkSessionData(id: number) {
    let data = this.getSessionData();
    let result = false;
    if (data.includes(id)) {
      result = true;
    }
    return result;
  }

  static deleteSessionItem(id: number) {
    let data = this.getSessionData();
    data = data.filter((el: number) => el != id);
    sessionStorage.setItem('lookedProducts', JSON.stringify(data))
  }

}
