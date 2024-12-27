import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cover from "../assets/img/cover.jpg";
import CartItemType from "../types/CartItemType";
import ProductType from "../types/ProductType";

 
function ProductsList(){
    const [ProductList, setProductList] = useState<ProductType[]>([]);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
    const [selectedItems, setSelectedItems] = useState<ProductType | null>(null);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    async function loadProducts(){
        const response = await axios.get("http://localhost:5132/api/products");
        setProductList(response.data);
    }

    async function loadCart(){
        const response = await axios.get("http://localhost:5132/api/cart");
        setCartItems(response.data);
    }

    useEffect(() =>{
        loadProducts();
        loadCart();
    },[]);

    const goToCart = ()=>{
        navigate('/cart');
    }

    async function handleAddToCart(e:React.MouseEvent) {
        e.stopPropagation();

        if(!selectedItems) return;
        
        const data = {
            productId:selectedItems.id,
            productName:selectedItems.name,
            price:selectedItems.price,
            quantity:1
        };
        try{
            const response = await axios.post("http://localhost:5132/api/cart",data);
            const newCartItem = response.data;
            setCartItems((prevItems) => [...prevItems, newCartItem]);
        }catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error adding cart item:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    const handleProductClick = (product:ProductType) =>{
        setSelectedItems(product);
        setIsModelOpen(true);
    }

    const closeModel = ()=> {
        setIsModelOpen(false);
        setSelectedItems(null);
    };

    function searchProduct(){
        const filteredProducts = ProductList.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setProductList(filteredProducts);
    };
    
    return( 
        <div>
            <div className="sticky top-0 z-10">
                <div className="py-2 pl-4 pr-9 flex justify-between items-center bg-white">
                    <div className="flex items-center">
                        <i className="fa-solid fa-globe text-3xl text-purple-800 items-center rotate-globe"></i>
                        <input value={searchQuery} 
                            type="text"
                            onChange={(e) =>setSearchQuery(e.target.value)} 
                            className="w-full sm:w-[500px] border border-slate-800 rounded-2xl py-1 px-2 ml-4 items-center" 
                            placeholder="Search..."/>
                        <button onClick={searchProduct} className="ml-2 border border-slate-800 text-white bg-slate-800 py-1 px-2 rounded-3xl text-sm items-center"><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <div className="items-center my-2/1">
                        <button className="mr-4 text-2xl hover:text-slate-700" onClick={goToCart}>
                            <i className="fa-solid fa-cart-shopping"></i>
                            <label className="ml-1 text-sm font-medium">cart ({cartItems.length})</label>
                        </button>
                    </div>
                </div>
                <div className="bg-slate-900 text-white flex justify-between items-center py-4 px-9">
                    <select className="w-[300px] py-2 px-4 text-black rounded-3xl">
                        <option value="">All Categories</option>
                        {ProductList.map((product) =>(
                            <option value="">{product.name}</option>
                        ))}
                    </select>
                    <nav className="w-full sm:w-auto">
                        <ul className="flex flex-wrap sm:flex-nowrap sm:space-x-8">
                            <li>Home</li>
                            <li>Top Brands</li>
                            <li>More</li>
                        </ul>
                    </nav>
                </div>
            </div>
         
            <div className="container mx-auto w-full">
                <div className="border border-slate-100 my-2 rounded-xl shadow-xl"
                    style={{
                        backgroundImage:`url(${cover})`,
                        backgroundSize:'cover',
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
                    }}>
                    <div className="mt-20 ml-10 mb-40">
                        <h2 className="text-5xl mb-2 text-white font-semibold">Explore your favorites</h2>
                        <p className="text-white">Better choices better prices</p>
                    </div>
                </div>
           
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
                    {ProductList.map((products) =>(
                        <div key={products.id} className="grid grid-cols-1 gap-2 bg-white p-4 rounded-xl shadow-lg border border-slate-200 py-2 px-2 transition-transform duration-500 ease-out transform hover:translate-y-[-8px]" onClick={()=> handleProductClick(products)}>
                            <div className="bg-slate-100 border border-slate-300 rounded-lg w-full h-[200px] sm:h-[250px] text-center" 
                                style={{
                                    backgroundImage:`url(/assets/img/${products.name}.jpg)`,
                                    backgroundSize:'cover',
                                    backgroundPosition:'center',
                                    backgroundRepeat:'no-repeat',
                                    }}>
                            </div>
                            <div className="text-lg font-medium">
                                {products.name}
                            </div>
                            <div>
                                {products.description}
                            </div>
                            <div className="text-lg font-medium">
                                LKR {products.price}
                            </div>
                        </div>
                    ))}
                </div>
                {isModelOpen && selectedItems && (
                    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[50%] max-w-lg z-50 relative">
                            <button onClick={closeModel} className="absolute top-0 right-1 text-gray-500 font-bold text-xl z-50">
                                &#x2715;
                            </button>
                            <h2 className="text-3xl mb-2">{selectedItems.name}</h2>
                            <p className="text-lg">{selectedItems.description}</p>
                            <p className="text-xl font-semibold mt-4">Price: LKR {selectedItems.price}</p>
                            <div className="flex justify-center">
                                <button onClick={handleAddToCart} className="bg-slate-800 w-[150px] text-white border border-slate-500 rounded-3xl py-2 px-4 hover:bg-slate-900">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default ProductsList;