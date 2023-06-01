import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import New from "./pages/new/New";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import SingleOrder from "./pages/single/order/SingleOrder";
import DelhiveryIntegration from "./components/delhivery/delhivery";
import SingleUser from "./pages/single/user/SingleUser";
import Products from "./pages/products/Products";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" >
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />

            <Route path="users">
              <Route index element={<List page="users"/>} />
              <Route path=":userId" element={<SingleUser />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
            </Route>
            <Route path="orders">
              <Route index element={<List page="orders"/>} />
              <Route path=":orderId" element={<SingleOrder />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
            </Route>

            <Route path="products">
              <Route index element={<Products/>} />
              {/* <Route path=":productId" element={<Single />} /> */}
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Products" />}
              />
            </Route>

            <Route path="delhivery">
              <Route index element={<DelhiveryIntegration/>} />
              
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
