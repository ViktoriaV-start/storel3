import { Component } from '../component';
import html from './search.tpl.html';


const RECOMMENDATION_TEXT = ['Например,', ',', 'или']

class Search extends Component {

  recommendedProducts = ['чехол iphone 13 pro', 'коляски agex', 'яндекс станция 2'];

  //TODO - убрать метод после окончания работы.
  // ДВА ВРЕМЕННЫХ МЕТОДА: ДОБАВЛЯЕТ/ УДАЛЯЕТ display: none, для хедера и футера на время работы над модулем
  private _TEMPORARYmakeVisible() {
    let selectors = ['.header', '.footer', '.js__temporary-btn'];
    for (let elem of selectors) {
      // @ts-ignore
      document.querySelector(elem).classList.remove('hide');
    }
  }

  //TODO - убрать по окончанию работы над модулем
  private _TEMPORARYmakeUnvisible() {
    let selectors = ['.header', '.footer', '.js__temporary-btn'];
    for (let elem of selectors) {
      // @ts-ignore
      document.querySelector(elem).classList.add('hide');
    }
  }

  render() {
    this.view.recommendations.innerHTML = this._getRecommendationString();
    this._init();
  }

  private _init() {
    //TODO - убрать по окончанию работы над модулем
    this._TEMPORARYmakeUnvisible();

    //TODO - убрать по окончанию работы над модулем
    window.addEventListener('unload', () => {
      searchComp._TEMPORARYmakeVisible();
    });

    this.view.form.addEventListener('submit', (ev: Event) => {
      ev.preventDefault();
      console.log(this.view.search.value.trim() ?? '');
    });

  }

  private _getRecommendationString() {
    let products: string[] = [];
    let text: string[] = [];

    for (let elem of this.recommendedProducts) {
      products.push(`<div class="search__colored"><span class="search__text_cl">${elem}</span></div>`);
    }

    for (let elem of RECOMMENDATION_TEXT) {
      text.push(`<div class="search__text-standart">${elem}</div>`);
    }

    let string = text[0];
    let length = this.recommendedProducts.length;

    for (let i = 0; i < length - 1; i++) {
      string += products[i];
      if (i != length - 2) string += text[1];
    }

    string = string + text[2] + products[length - 1];
    return string;
  }

}

export const searchComp = new Search(html);
