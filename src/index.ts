import "./icons";
import Router from "./router";
import { cartService } from "./services/cart.service";
import { userService } from "./services/user.service";
import { favouriteService } from "./services/favourite.service";
import { analyticSevice } from "./services/analytic.service";


new Router();
cartService.init();
userService.init();
favouriteService.init();
analyticSevice.init();

setTimeout(() => {
  document.body.classList.add("is__ready");
}, 250);
