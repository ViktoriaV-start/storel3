import { Component } from '../component';
import html from './filter.tpl.html';
import { ProductList } from '../productList/productList';
import { userService } from "../../services/user.service";

const SELECTOR_FILTER = '.filter';
const SELECTOR_HELP = '.filter__help';
const SELECTOR_INPUT = '.filter__input';
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

  //TODO - убрать метод после окончания работы.
  // ДВА ВРЕМЕННЫХ МЕТОДА: ДОБАВЛЯЕТ/ УДАЛЯЕТ display: none, для хедера и футера на время работы над модулем
  private _TEMPORARYmakeVisible() {
    document.querySelector('.header')?.classList.remove('hide');
    document.querySelector('.footer')?.classList.remove('hide');
  }

  //TODO - убрать по окончанию работы над модулем
  private _TEMPORARYmakeUnvisible() {
    document.querySelector('.header')?.classList.add('hide');
    document.querySelector('.footer')?.classList.add('hide');
  }

  render() {
    this._init();
  }

  private _init() {
    //TODO - убрать по окончанию работы над модулем
    this._TEMPORARYmakeUnvisible();

    //TODO - убрать по окончанию работы над модулем
    window.addEventListener('unload', () => {
      filterComp._TEMPORARYmakeVisible();
    });

    this.filterContainer = document.querySelector(SELECTOR_FILTER);
    this.helpContainer = document.querySelector(SELECTOR_HELP);

    this.filterContainer?.addEventListener('submit', (ev) => {
      ev.preventDefault();
        this._filter();
    })

    this.filterContainer?.addEventListener('input', () => {
      const searchValue = this.filterContainer?.querySelector('input')?.value.trim();
      if (searchValue && searchValue.length != 0) {
        this._showHelp(searchValue);
      }
    })

    document.querySelector('body')?.addEventListener('click', (ev) => {
      const { target } = ev;

      if (target && (target as HTMLButtonElement).classList.contains(CLASS_HELP_BTN)) {

        // @ts-ignore
        this.filterContainer.querySelector(SELECTOR_INPUT).value = target.textContent;
        this._filter();
      }

      if (!(target as HTMLButtonElement).classList.contains('filter__input')) {
        this.helpContainer?.classList.add('hide');
      }

    })
  }

  private async _filter() {

    const searchValue = this.filterContainer?.querySelector('input')?.value.trim() ?? '';
    const regexp = new RegExp(searchValue, 'i');

    if (searchValue && searchValue.length != 0) {
      this.fetching()?.then((products) => {
        this.filteredProducts.update(products.filter((el: any) => regexp.test(el.name)));
      })
      .then(() => {
          this.helpContainer?.classList.add('hide');
      })
    } else {
      this.helpContainer?.classList.add('hide');
    }
  }

  async fetching() {
    return fetch('/api/getProducts', {
      headers: {
       'x-userid': await userService.getId()
      }
    })
      .then((res) => res.json())
      .catch (err => {
        console.warn(err);
    });
  }

  private _showHelp(value: string) {

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
