import { Product } from "src/modules/product/product";
import { ProductData } from "types";


export class AnalyticService {
  static url = 'http://localhost:8888/';

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
        if (el.isIntersecting && !item.getIsViewed()) {

          item.setIsViewed(true);

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
              if (result.status !== 'ok') item.setIsViewed(false);
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
        orderId: 'айдиНовогоЗаказа',
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

}
