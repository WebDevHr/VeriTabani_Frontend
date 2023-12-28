// store/types.ts
import { IUserState } from './modules/user';
import { ISnackbarState } from './modules/snackbar';
import { ICartState } from './modules/cart';
import { IFavoritesState } from './modules/favorite';
import { IProductsState } from './modules/product';

export interface RootState {
    user: IUserState;
    snackbar: ISnackbarState;
    cart: ICartState;
    favorite: IFavoritesState;
    product: IProductsState;
    // ... other module states if any
}