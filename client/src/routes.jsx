import CartPage from "./pages/CartPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"

const publicRoutes = [
    {
        path: "/",
        component: CartPage,
        layout: null
    },
    {
        path: "/signin",
        component: SignInPage,
        layout: null
    },
    {
        path: "/signup",
        component: SignUpPage,
        layout: null
    },
]
export default publicRoutes