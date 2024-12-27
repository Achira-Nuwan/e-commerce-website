import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CartItem from './components/CartItem';
import Order from './components/Order';
import ProductsList from './components/ProductList';
import Test from './components/Test';


//Parent component
function App() { //functional component
    return(
      //<Home/>
      <BrowserRouter>
          <Routes>
                <Route path='/' element={<ProductsList/>} />
                <Route path='/cart' element={<CartItem/>} />
                <Route path='/test' element={<Test/>} />
                <Route path='/order' element={<Order/>} />
          </Routes>
      </BrowserRouter>
    )
}




export default App;
