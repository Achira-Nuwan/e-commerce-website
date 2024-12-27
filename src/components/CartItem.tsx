import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItemType from "../types/CartItemType";

function CartItems(){

    const [cartItems, setCartItems] = useState<CartItemType[]>([]); //location.state?.cartItems || []
    const [subTotal, setSubTotal] = useState<number>(0);
    const navigate = useNavigate();
    const [Grandtotal, setGrandTotal] = useState(0.0);
    const discount = 0;
    const delivery = 0;
    
    async function loadCart(){
        const response = await axios.get("http://localhost:5132/api/cart");
        const cartData = response.data.map((item:CartItemType) => ({
            ...item,
            isChecked:true,
        }));
        console.log('Cart data feted successfully',cartData);
        setCartItems(cartData);
    }

    const removeCartItems = (itemId:number) => {
        axios.delete(`http://localhost:5132/api/cart/${itemId}`)
            .then(()=>{
                setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
            })
            .catch(error => console.error("Error removing item:",error));
    };

    useEffect(() => {
        loadCart();
    },[]);

    const handleCheckBox = (itemId:number) => {
        setCartItems((prevItems) => 
            prevItems.map((item) =>
                item.id === itemId ? {...item, isChecked: !item.isChecked} : item
            )
        );
    };

    useEffect(() =>{
       const subTotal = cartItems
            .filter(item => item.isChecked)
            .reduce((acc, item) => acc + item.price * item.quantity,0);
       setSubTotal(subTotal);
    },[cartItems]);

    useEffect(() =>{
        const total = subTotal - (discount + delivery);
        setGrandTotal(total)
    },[cartItems]);

    const quantityDecrement = (itemId:number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId && item.quantity > 1 ?
                    {...item, quantity: item.quantity - 1} : item
            )
        );
    };
    
    const quantityIncrement = (itemId:number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id == itemId ?
                    {...item, quantity: item.quantity + 1} : item
            )
        );
    };
    
    // Handle item quantity input change
    const handleItemQty = (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
        const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity) && newQuantity > 0) {
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === itemId ? { ...item, quantity: newQuantity } : item
                    )
                );
            }
    };

    async function handleCheckOut(){
        const checkedItems = cartItems.filter(item => item.isChecked);

        if (checkedItems.length === 0) {
            alert("Please select items to checkout.");
            return;  // Early exit if no items are selected
        }

        for(let item of checkedItems){
            await axios.put(`http://localhost:5132/api/cart/update-quantity/${item.id}?newQuantity=${item.quantity}`)
        }

        // navigate to the order page and pass the checked items
        navigate('/order', {state: {cartItems:checkedItems}});
    };

    

    return(
        <div className="min-h-screen">
            <div className="border border-slate-300 py-2 px-2 sm:px-4 bg-gray-100 w-ful">
                <nav className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <i className="fa-solid fa-globe text-3xl text-purple-800 items-center rotate-globe"></i>
                        <button className="hover:text-slate-300">
                            <i className="fa-solid fa-list text-lg"></i>
                        </button>
                        <input type="text" className="border border-slate-500 w-[125px] sm:w-[500px] lg:w-[600] rounded-3xl py-0 sm:py-1 px-2" placeholder="Search..." />
                        <button className="border border-slate-800 text-white bg-slate-800 py-1 px-3 rounded-3xl text-sm items-center"><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <div className="flex space-between gap-4 items-center">
                        <button className="mr-2 sm:mr-4 text-2xl hover:text-slate-700">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <label className="ml-1 text-sm font-medium">cart ({cartItems.length})</label>
                    </button>
                    </div>
                </nav>
            </div>
            <div className="container mx-auto mt-4 grid grid-cols-1 sm:grid-cols-[2fr,1fr] gap-10">
                <div className="py-2 px-4 border border-zinc-100 rounded-xl shadow-md bg-zinc-50">
                    <h1 className="text-2xl font-medium">Cart ({cartItems.length})</h1>
                    <div className="grid grid-cols-1">
                        {cartItems.length === 0 ? (
                            <h2>Your cart is empty</h2>
                        ) : (
                            cartItems.map((item:CartItemType) => {
                                return(
                                    <div className="border-b border-zinc-300 py-5 px-2 flex flex-col sm:flex-row justify-between items-center">
                                        <div className="flex space-x-6 sm:space-x-4">
                                            <div className="flex justify-center items-center">
                                                <label htmlFor="" className="checkbox-button">
                                                    <input type="checkbox" className="w-4 h-4" checked={item.isChecked} onChange={()=> {handleCheckBox(item.id)}}/>
                                                </label>
                                            </div>
                                            <div className="w-[100px] h-[100px] border border-slate-500 rounded-xl flex justify-center items-center p-2">
                                                <h1 key={item.id} className="">
                                                    {item.productName}
                                                </h1>
                                            </div>
                                            <div className="grid grid-cols-1 gap-9">
                                                <p></p>
                                                <p className="text-xl font-medium">LKR {item.price}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-8 justify-items-end">
                                            <div className="">
                                                <button className="text-lg w-8 h-8 flex justify-center items-center hover:text-2xl" onClick={() =>removeCartItems(item.id)}>&#x2715;</button>
                                            </div>
                                            <div className="text-xl font-medium text-gray-500 flex  bg-zinc-100 border border-zinc-100 px-4 rounded-xl">
                                                <button onClick={() =>quantityDecrement(item.id)} className="mr-2">-</button>
                                                <input type="text" 
                                                value={item.quantity} 
                                                onChange={(e) =>handleItemQty(e,item.id)} 
                                                className="w-16 bg-zinc-100 text-center border-0 focus:ring-0"/>
                                                <button onClick={() =>quantityIncrement(item.id)} className="ml-2">+</button>
                                            </div>
                                        </div>
                                        
                                    </div>
                                )  
                            })
                        )}
                    </div>
                </div>
                <div className="py-2 px-4 border border-zinc-100 rounded-xl shadow-md bg-zinc-50 sticky top-0 z-10 h-[350px]">
                    <h1 className="text-2xl font-medium mb-6">Summary</h1>
                    <div className="grid grid-cols-2">
                        <div className="">
                            <h3 className="mb-6">SubTotal</h3>
                            <h3 className="mb-6">Discount</h3>
                            <h3 className="mb-8">Delivery</h3>
                            <h3 className="font-semibold">Total</h3>
                        </div>
                        <div className="text-right">
                            <h3 className="mb-6">LKR {subTotal}</h3>
                            <h3 className="mb-6">0</h3>
                            <h3 className="mb-6">0</h3>
                            <h3 className="mb-6 text-2xl font-semibold">LKR {Grandtotal}</h3>
                        </div>
                    </div>
                    <div>
                        <button className="border border-orange-500 text-white w-full rounded-3xl py-2 font-semibold bg-orange-500 hover:bg-orange-600" onClick={()=>handleCheckOut()}>
                            Checkout ({cartItems.filter(item => item.isChecked).length})
                        </button>
                    </div>
                </div>
            </div>     
        </div>
         
    )
}
export default CartItems;