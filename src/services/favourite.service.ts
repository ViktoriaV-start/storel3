import { GeneralService } from "./general.service";

const HEAD_HREF = '.header__favourite';

class FavouriteService extends GeneralService {

  init() {
    super.init();
    this.checkFav();
  }

  checkFav() {
    this.get().then((res) => {
      if (res.length) {
        document.querySelector(HEAD_HREF)?.classList.remove('hide');
      } else {
        document.querySelector(HEAD_HREF)?.classList.add('hide');
      }
    })
  }
}

export const favouriteService = new FavouriteService('favourite');
