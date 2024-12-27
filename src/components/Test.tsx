import axios from "axios";
import { useEffect, useState } from "react";
import CartItemType from "../types/CartItemType";

function Test() {
    const [cartItem, setCartItems] = useState<CartItemType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);  // Add a loading state
    const [error, setError] = useState<string | null>(null);  // Add an error state

    const [productId, setProductId] = useState<number>(0);
    const [productName, setProductName] = useState<string>("");
    const [price, setPrice] = useState<number>(0.0);
    const [quantity, setQuantity] = useState<number>(1);

    async function loadCart() {
        try {
            const response = await axios.get("http://localhost:5132/api/cart");
            console.log(response.data);  // Log the data to see its structure
            if (Array.isArray(response.data)) {
                setCartItems(response.data);
            } else {
                throw new Error("Unexpected data format");
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setError("Failed to load data.");
        } finally {
            setIsLoading(false);  // Stop loading after the API call is finished
        }
    }

    useEffect(() => {
        loadCart();
    }, []); // Run once when the component is mounted

    function handleProductId(e:any){
        setProductId(e.target.value);
    }
    function handleProductName(e:any){
        setProductName(e.target.value);
    }
    function handlePrice(e:any){
        setPrice(e.target.value);
    }


    async function handleAddToCart(){
        const data = {
            productId:productId,
            productName:productName,
            price:price,
        };
        await axios.post("http://localhost:5132/api/cart",data);
        loadCart();
    }

    return (
        <div>
            <h2>This is the test page</h2>
            {cartItem.map((item)=> {
                return(
                    <div>
                        <label onChange={handleProductId}>{item.productId}</label>
                        <label onChange={handleProductName}>{item.productName}</label>
                        <label onChange={handlePrice}>{item.price}</label>
                    </div>
                    
                )
            })}
            <button className="border border-slate-500" onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}

export default Test;




/*import axios from "axios";
import { useEffect, useState } from "react";
import CartItemType from "../types/CartItemType";

function Test(){
    const [cartItem, setCartItems] = useState<CartItemType[]>([]);

    async function loadCart(){
        try{
            const response = await axios.get("http://localhost:5132/api/cart");
            console.log(response.data);
            setCartItems(response.data);
        }catch(error){
            console.error("Error loading data:",error);
        }
        
    }

    useEffect(() =>{
        loadCart();
    },[])

    return(
        <div>
            <h2>This is test page</h2>
            <ul>
                {cartItem.map((item:CartItemType) =>(
                    <li key={item.Id}>
                        {item.ProductName}
                    </li>
                ))}
            </ul>

        </div>
    )
}
export default Test;*/