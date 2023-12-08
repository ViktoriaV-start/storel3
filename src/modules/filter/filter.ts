
import { Component } from '../component';
import html from './filter.tpl.html';

import { ProductList } from '../productList/productList';

const SELECTOR_FILTER = '.filter';
const SELECTOR_HELP = '.filter__help';
const CLASS_HELP_BTN = 'filter__help-btn';

class Filter extends Component {

  filteredProducts: ProductList;
  productsNames: string[];

  filterContainer: Element | null;
  helpContainer: Element | null;

  constructor(props: any) {
    super(props);

    this.filteredProducts = new ProductList();
    this.filteredProducts.attach(this.view.filter);

    this.filterContainer = null;
    this.helpContainer = null;

    this.productsNames = [];
    this.fetching()?.then((products) => {
      products.forEach((el: any) => {
        if (el.name) this.productsNames.push(el.name)
      });
    })



  }

  render() {
    this._init();
  }

  private _init() {
    // @ts-ignore
    document.querySelector('.header').classList.add('hide');
    // @ts-ignore
    document.querySelector('.footer').classList.add('hide');

    window.addEventListener('unload', () => {
      filterComp._makeVisible();
    })

    this.filterContainer = document.querySelector(SELECTOR_FILTER);
    this.helpContainer = document.querySelector(SELECTOR_HELP);

    this.filterContainer?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      console.log(123)
        this._filter();
    })

    this.filterContainer?.addEventListener('input', () => {
      const searchValue = this.filterContainer?.querySelector('input')?.value.trim();
      if (searchValue && searchValue.length != 0) {
        this._showHelp(searchValue);
      }
    })

    this.filterContainer?.addEventListener('click', (ev) => {
      const { target } = ev;

      if (target && (target as HTMLButtonElement).classList.contains(CLASS_HELP_BTN)) {
        let text = (target as HTMLButtonElement).textContent;

        // @ts-ignore
        this.filterContainer.querySelector('input').value = target.textContent;

        // @ts-ignore
        this.helpContainer?.classList.add('hide');

        if (text && text.length != 0) this._filter();
      }
    })
  }

  private _makeVisible() {
    // @ts-ignore
    document.querySelector('.header').classList.remove('hide');
    // @ts-ignore
    document.querySelector('.footer').classList.remove('hide');
  }

  private async _filter() {

    // const helpContainer = document.querySelector(SELECTOR_HELP);
    // @ts-ignore
    this.helpContainer?.classList.add('hide');


    const searchValue = this.filterContainer?.querySelector('input')?.value.trim() ?? '';
    const regexp = new RegExp(searchValue, 'i');

    if (searchValue && searchValue.length != 0) {
      this.fetching()?.then((products) => {
        this.filteredProducts.update(products.filter((el: any) => regexp.test(el.name)));
      }).then(() => {
        console.log((this.helpContainer?.innerHTML))
        if (this.helpContainer?.innerHTML == '') {
          // @ts-ignore
          this.helpContainer?.classList.add('hide');
        }
      })
    }
  }


  fetching() {

    try {
      return fetch('/api/getProducts', {
        headers: {
          'x-userid': window.userId
        }
      })
        .then((res) => res.json())
    } catch (err) {
      console.warn(err);
      return;
    }

  }

  private _showHelp(value: string) {
    // const helpContainer = document.querySelector(SELECTOR_HELP);
    const regexp = new RegExp(value, 'i');


    let helpText = '';
    let searchVariants: string[] = [];

    for (let i = 0; i < this.productsNames.length; i++) {
      if (searchVariants.length == 5) break;

      if (regexp.test(this.productsNames[i])) {
        searchVariants.push(this.productsNames[i]);
      }
    }

      searchVariants.forEach(el => helpText += `<div class="filter__help-btn">${el}</div>`)

      if (helpText) {
        this.helpContainer?.classList.remove('hide');
        if (this.helpContainer) this.helpContainer.innerHTML = helpText;
      } else {
        this.helpContainer?.classList.add('hide');
      }


  }


}

export const filterComp = new Filter(html);