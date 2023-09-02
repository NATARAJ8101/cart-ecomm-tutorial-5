import axios from "axios";
import React, { useState, useEffect } from "react";
import uuid from "./uuid";
import usStates from "./localData/usStates";
import timestamp from "./timestamp";

const Cart = (props) => {
    let [loaded, setLoaded] = useState(false);
    let [items, setItems] = useState([]);
    let [preTax, setPreTax] = useState(0.00);
    let [itemSearch, setItemSearch] = useState("");
    let [toggle, setToggle] = useState("");
    /*let [shippingFname, setShippingFname] = useState("");
    let [shippingLname, setShippingLname] = useState("");
    let [shippingEmail, setShippingEmail] = useState("");
    let [shippingPhone, setShippingPhone] = useState("");
    let [shippingAddress, setShippingAddress] = useState("");
    let [shippingCity, setShippingCity] = useState("");
    let [shippingState, setShippingState] = useState("");
    let [shippingZipCode, setShippingZipCode] = useState("");*/
    let buyerFields = ["shippingFname", "shippingLname", "shippingEmail", "shippingPhone", "shippingAddress", "shippingCity", "shippingState", "shippingZipCode"];



    const tax = .08;



    const calculate = (tempCart) => {
        let tempPreTax = 0;
        for (let i = 0; i < tempCart.length; i++) {
            tempPreTax = Number(tempPreTax) + Number(tempCart[i].price);
        }
        setPreTax((preTax) => tempPreTax);
    }


    /*const addCartItem = (itemName, price) => {
         let tempCart = props.cartList;
         tempCart = [...tempCart, { itemName, price }];
         props.setCartList((cartList) => tempCart);
         calculate(tempCart);
 
     }*/

    const removeCartItem = (whichItem) => {
        let tempCart = [];
        for (let i = 0; i < props.cartList.length; i++) {
            if (i !== whichItem) {
                tempCart.push(props.cartList[i])
            }
        }
        props.setCartList((cartList) => tempCart);
        calculate(tempCart);

    }

    const submitCart = () => {
        //save locally for now
        //https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
        /*let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
         let timeStamp = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
         timeStamp = timeStamp.substring(0, timeStamp.indexOf("."));*/

        let tempTimeStamp = timestamp();



        let currentCart = [];
        /* if (localStorage.getItem("purchaseLog")) {
             currentCart = JSON.parse(localStorage.getItem("purchaseLog"))
         }*/
        let tempCart = [];
        for (let i = 0; i < props.cartList.length; i++) {
            tempCart.push({
                saleId: props.userEmail + ":" + tempTimeStamp,
                itemName: props.cartList[i].itemName,
                price: props.cartList[i].price,
                uuid: uuid()
            });

            //START CLIENT SIDE MAKE PURCHASE

            axios.post("/api/purchaseLog/post-purchase",
                {
                    saleId: props.userEmail + ":" + tempTimeStamp,
                    itemName: props.cartList[i].itemName,
                    price: Number(props.cartList[i].price),
                    uuid: uuid()
                }, props.config).then(
                    (res) => {
                        if (res.data.affectedRows === 0) {
                            props.showAlert("That did not work.", "warning");
                        } else {
                            tempCart = [...currentCart, ...tempCart];
                            // localStorage.setItem("purchaseLog", JSON.stringify(tempCart));
                            props.setCartList((cartList) => []);
                            props.showAlert("Purchase Submitted!", "success");

                            props.GrabAllItems(sessionStorage.getItem("token"), props.userEmail);
                            setToggle((toggle) => "");
                        }
                    }, (error) => {
                        props.showAlert("Something went wrong: " + error);
                    }
                )
        }
    }

    const updateFields = () => {
        for (let i = 0; i < buyerFields.length; i++) {
            let tempVal = document.querySelector("[name='" + buyerFields[i] + "']").value;
            localStorage.setItem(buyerFields[i], tempVal);
        }
    }

    useEffect(() => {

        if (loaded === false && props.cartList.length > 0) {
            calculate(props.cartList);


            for (let i = 0; i < buyerFields.length; i++) {
                if (localStorage.getItem(buyerFields[i])) {
                    document.querySelector("[name='" + buyerFields[i] + "']").value = localStorage.getItem(buyerFields[i]);
                }
            }


            setLoaded((loaded) => true);
        }
    }, []);


    return (

        <div className="row cartPanel">
            <div className="col-md-6">
                <h2 className="mt-3">Shipping information</h2>
                <div className="row">
                    <div className="col-md-6">
                        <label>First Name</label>
                        <input type="text" name="shippingFname" className="form-control" placeholder="First Name" onChange={() => updateFields()} />
                    </div>
                    <div className="col-md-6">
                        <label>First Name</label>
                        <input type="text" name="shippingLname" className="form-control" placeholder="Last Name" onChange={() => updateFields()} />

                    </div>

                    <div className="col-md-6">
                        <label>Email</label>
                        <input type="text" name="shippingEmail" className="form-control" placeholder="email" onChange={() => updateFields()} />
                    </div>

                    <div className="col-md-6">
                        <label>Phone</label>
                        <input type="text" name="shippingPhone" className="form-control" placeholder="phone" onChange={() => updateFields()} />
                    </div>

                    <div className="col-md-6">

                        <label>Address</label>
                        <input type="text" name="shippingAddress" className="form-control" placeholder="address" onChange={() => updateFields()} />
                    </div>

                    <div className="col-md-6">

                        <label>City</label>
                        <input type="text" name="shippingCity" className="form-control" placeholder="City" onChange={() => updateFields()} />
                    </div>

                    <div className="col-md-6">

                        <label>State</label>
                        <select className="form-control" name="shippingState" onChange={() => updateFields()} >
                            <option value="default">Select state</option>
                            {usStates ?
                                usStates.map((state, i) => {
                                    return (<option key={i} value={state}>{state}</option>)
                                })
                                : null}
                        </select>
                    </div>


                    <div className="col-md-6">
                        <label>Zip code</label>
                        <input type="text" name="shippingZipCode" className="form-control" placeholder="Zip code" onChange={() => updateFields()} />
                    </div>


                </div>


            </div>

            <div className="col-md-6">
                <h2 className="mt-3">Cart</h2>
                <div className="list-group">
                    {props.cartList.length > 0 ? props.cartList.map((cartItem, i) => {
                        return (<li key={i} className="list-group-item ">
                            <i className="fa fa-trash pointer" onClick={() => removeCartItem(i)}></i>{" "}
                            <span className="capitalize">{cartItem.itemName + " - $" + cartItem.price}</span></li>)
                    }) : null}
                </div>
                {props.cartList.length > 0 ?
                    <ul className="list-unstyled">
                        <li>Tax ${tax.toFixed(2)}</li>
                        <li><h4>Pre Tax ${preTax.toFixed(2)}</h4></li>
                        <li><div className="alert alert-success" role="alert"><h3 className="">Total ${((preTax * tax) + preTax).toFixed(2)}</h3></div>
                        </li>
                        <li>

                            {toggle !== "submitCart" ? <button className="btn btn-block btn-danger" onClick={() => setToggle((toggle) => "submitCart")}>Submit Cart</button> :
                                <div className="alert alert-danger" role="alert">
                                    <p>Are you sure you want to submit cart?</p>
                                    <button className="btn btn-warning" onClick={() => submitCart()}>Yes</button>
                                    <button className="btn btn-dark" onClick={() => setToggle((toggle) => "")}>No</button>
                                </div>}

                        </li>
                    </ul>
                    : null}
            </div>

        </div>







    )
}

export default Cart;
