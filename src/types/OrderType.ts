import CartItemType from "./CartItemType";

interface OrderType{
    Id:number;
    OrderDate:Date;
    Items:CartItemType;
    TotalPrice:number;
}
export default OrderType;