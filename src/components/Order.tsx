import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CartItemType from "../types/CartItemType";

function Order(){
    const navigate = useNavigate();
    const location = useLocation();
    const [checkedItems, setCheckedItems] = useState<CartItemType[]>([]);
    const [subTotal, setSubTotal] = useState<number>(0.0);
    const [Grandtotal, setGrandTotal] = useState(0.0)
    const [isModelOpen, setIsModelOpen] = useState(false);
    const discount = 0;
    const deliveryCharge = 0;

    function loadChekedItems(){
       const response = location.state.cartItems || [];
       setCheckedItems(response);
    }

    useEffect(()=>{
        loadChekedItems();
    },[])

    useEffect(() =>{
       const calculatedSubTotal = checkedItems.reduce((acc, item) => acc + item.price * item.quantity,0);
       setSubTotal(calculatedSubTotal);
    },[checkedItems])

    useEffect(()=>{
        const total = subTotal - (discount + deliveryCharge);
        setGrandTotal(total);
    },[checkedItems])

    function goToHome(){
        navigate('/');
    }

    function placeOrder(){
        setIsModelOpen(true);
    }

    const closeModel = () =>{
        setIsModelOpen(false);
    }

    async function handleOrderConfirmation(){

        const data = {
            items: checkedItems.map(item => ({
                productId:item.productId,
                productName:item.productName,
                price:item.price
            })),
        };

        try{
            const response = axios.post("http://localhost:5132/api/order",data);
            console.log("Order placed successfully",response);
        }catch(error){
            console.error("Error placing order",error);
        }
    };

    return(
        <div>
            <div className="bg-slate-600 w-full h-[50px] py-1 px-6 items-center">
                <i className="fa-solid fa-globe text-3xl text-purple-300 items-center rotate-globe"></i>
            </div>
            <div className="container mx-auto mt-4 grid grid-cols-1 sm:grid-cols-[2fr,1fr] gap-10">
                <div>
                    <div className="bg-zinc-100 rounded-lg border border-zinc-100 shadow-md py-2 px-4">
                        <h2 className="text-2xl">Details</h2>
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {checkedItems.map((items:CartItemType) =>{
                                return(
                                    <div className="w-full sm:w-[110px] h-[110px] border border-slate-400 rounded-lg p-2 flex flex-col justify-between items-center">
                                        <div className="flex justify-center items-center">
                                            {items.productName}
                                        </div>
                                        <div className="flex justify-center items-center w-full mt-auto bg-slate-400 text-white font-medium bg-opacity-50 border border-slate-200">
                                            LKR {items.price}
                                        </div>
                                    </div>
                                )
                            })} 
                        </div>
                    </div>
                    <div className="mt-4  bg-zinc-100 rounded-lg shadow-md p-4 ">
                        <h3>Explore more</h3>
                        <div className="pt-10 px-5 flex justify-center items-center">
                            <button className="px-4 bg-amber-500 rounded-xl hover:bg-amber-600" onClick={goToHome}>
                                More
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-100 rounded-lg border border-zinc-100 shadow-md py-2 px-4 sticky top-0 z-10 h-[350px]">
                    <h2 className="text-2xl">Summary</h2>
                    <div className="mt-10 grid grid-cols-2">
                        <div className="space-y-6">
                            <h3>Sub Total</h3>
                            <h3>Discount</h3>
                            <h3>Delivery</h3>
                            <h3 className="font-semibold mt-2">Total</h3>
                        </div>
                        <div className="text-right space-y-6">
                            <h3>{subTotal}</h3>
                            <h3>0</h3>
                            <h3>0</h3>
                            <h3 className="font-semibold text-xl">{Grandtotal}</h3>
                        </div>
                    </div>
                    <div className="mt-12">
                        <button onClick={placeOrder} className="w-full border border-orange-500 bg-orange-500 rounded-2xl py-1 font-semibold text-white hover:bg-orange-600">
                           Place Order
                        </button>
                    </div>
                    {isModelOpen && (
                        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center pt-10 px-80">
                            <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[80%] z-50 relative h-[400px] ">
                                <button className="absolute top-0 right-1 text-gray-500 text-lg z-50 hover:text-xl" onClick={closeModel}>
                                    &#x2715;
                                </button>
                                <div className="px-4">
                                    <h1 className="text-center text-2xl font-semibold mb-8">Confirmation..!</h1>
                                    <div className="grid grid-cols-1 gap-20 mb-20">
                                        <div className="font-medium">
                                            <h3>Items ({checkedItems.length})</h3>
                                        </div>
                                        <div className="flex justify-between text-2xl font-semibold">
                                            <h3>Total</h3>
                                            <h3>LKR {subTotal}</h3>
                                        </div>
                                    </div>
                                    <div className="flex space-between gap-4 mt-20 pt-10">
                                        <button onClick={() =>{handleOrderConfirmation(); alert("Order places successfully.");}} className="bg-green-600 py-2 px-8 rounded-3xl text-white font-semibold hover:bg-green-700">Confirm</button>
                                        <button onClick={closeModel} className="py-2 px-8 rounded-3xl text-green-600 border border-green-600 font-semibold hover:font-bold hover:border-semibold">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Order;
    