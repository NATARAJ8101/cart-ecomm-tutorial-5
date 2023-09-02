import React, { useEffect, useState } from "react";
import Validate from "./Validate";
import ItemSelector from "./ItemSelector";
import axios from "axios";

const CMS = (props) => {
    let [loaded, setLoaded] = useState(false);
    let [activeFunc, setActiveFunc] = useState("add");
    let [toggle, setToggle] = useState("default");
    let [searchWords, setSearchWords] = useState([]);
    let [images, setImages] = useState([]);


    const clearForm = () => {
        [].forEach.call(document.querySelectorAll("input, textarea"), function (e) {
            e.value = "";
        });
        [].forEach.call(document.querySelectorAll("select"), function (e) {
            e.selectedIndex = 0;
        })
    }


    const addItem = () => {
        Validate(["itemName", "stockQty", "price", "category", "details"]);
        if (document.querySelector(".error") || searchWords === null) {
            props.showAlert("There is an error in your form.", "danger");
            return false;
        } else {
            let tempItems = props.items;
            let itemName = document.querySelector("[name='itemName']").value.toLowerCase().replace(/[|&;$%@"<>'()+,]/g, "");
            let stockQty = document.querySelector("[name='stockQty']").value;
            let price = document.querySelector("[name='price']").value;
            let category = document.querySelector("[name='category']").value.toLowerCase();
            let details = document.querySelector("[name='details']").value.toLowerCase();

            //CLIENT SIDE POST NEW ITEM
            const data = {
                itemName,
                stockQty: Number(stockQty),
                category,
                price: Number(price),
                details,
                searchWords: encodeURIComponent(searchWords),//need to encode to escape characters for storing in a sql database.
                images: encodeURIComponent(images)
            };

            axios.post("/api/items/post-item", data, props.config).then(
                (res) => {
                    if (res.data.affectedRow === 0) {
                        props.showAlert("Message: " + res.data.message, "danger");
                    } else {
                        tempItems = [...props.items, { itemName, stockQty, price, category, details, searchWords }];
                        props.setItems((items) => tempItems);
                        //localStorage.setItem("items", JSON.stringify(tempItems));
                        props.showAlert(itemName + " added successfully.", "success");
                        props.GrabAllItems(sessionStorage.getItem("token"), props.userEmail);
                        setSearchWords((searchWords) => []);
                        setImages((images) => []);
                        clearForm();
                    }
                }
            )
        }
    }

    const editItem = () => {
        Validate(["itemName", "stockQty", "price", "category", "details"]);
        if (document.querySelector(".error")) {
            props.showAlert("There is an error in your form.", "danger");
            return false;
        } else {
            let itemName = document.querySelector("[name='itemName']").value.toLowerCase().replace(/[|&;$%@"<>'()+,]/g, "");
            let stockQty = document.querySelector("[name='stockQty']").value;
            let price = document.querySelector("[name='price']").value;
            let category = document.querySelector("[name='category']").value.toLowerCase();
            let details = document.querySelector("[name='details']").value.toLowerCase();

            //CLIENT SIDE UPDATE/EDIT ITEM
            const data = {
                itemName,
                stockQty: Number(stockQty),
                category,
                price: Number(price),
                details,
                searchWords: encodeURIComponent(searchWords),//need to encode to escape characters for storing in a sql database.
                images: encodeURIComponent(images)
            };

            axios.put("/api/items/updateItem/", data, props.config).then(
                (res) => {
                    if (res.data.affectedRows === 0) {
                        props.showAlert("That did not work", "danger");
                    } else {
                        let tempItems = props.items
                        let selectedItem = document.querySelector("select[name='itemSelect']").value;
                        tempItems[Number(selectedItem)].itemName = document.querySelector("[name='itemName']").value.toLowerCase();
                        tempItems[Number(selectedItem)].price = document.querySelector("[name='price']").value;
                        tempItems[Number(selectedItem)].stockQty = document.querySelector("[name='stockQty']").value;
                        tempItems[Number(selectedItem)].category = document.querySelector("[name='category']").value.toLowerCase();
                        tempItems[Number(selectedItem)].details = document.querySelector("[name='details']").value.toLowerCase();
                        props.setItems((items) => tempItems);
                        //localStorage.setItem("items", JSON.stringify(tempItems));
                        setSearchWords((searchWords) => []);
                        setImages((images) => []);
                        props.showAlert(tempItems[Number(selectedItem)].itemName + " updated.", "success");
                        props.GrabAllItems(sessionStorage.getItem("token"), props.userEmail);
                    }
                }
            )
        }
    }

    const populateFields = () => {
        let selectedItem = document.querySelector("select[name='itemSelect']").value;
        if (selectedItem === "defaut") {
            return false;
        }
        if (activeFunc !== "delete") {
            document.querySelector("[name='itemName']").value = props.items[Number(selectedItem)].itemName;
            document.querySelector("[name='stockQty']").value = props.items[Number(selectedItem)].stockQty;
            document.querySelector("[name='price']").value = props.items[Number(selectedItem)].price;
            document.querySelector("[name='category']").value = props.items[Number(selectedItem)].category;
            document.querySelector("[name='details']").value = props.items[Number(selectedItem)].details;
            setSearchWords((searchWords) => props.items[Number(selectedItem)].searchWords);
            setImages((images) => props.items[Number(selectedItem)].images)
        }

    }

    const deleteItem = () => {
        let tempItems = [];
        let selectedItem = document.querySelector("select[name='itemSelect']").value;


        axios.delete("/api/items/delete-item/" + props.items[Number(selectedItem)].itemName, props.config).then(
            (res) => {
                for (let i = 0; i < props.items.length; i++) {
                    if (i !== Number(selectedItem)) {
                        tempItems.push(props.items[i])
                    }
                }
                props.setItems((items) => tempItems);
                //localStorage.setItem("items", JSON.stringify(tempItems));
                props.showAlert("Item Deleted.", "success");
                props.GrabAllItems();
                clearForm();
                setToggle((toggle) => "");
            }, (error) => {
                props.showAlert("That didn't work: " + error, "danger");
            }
        )




    }

    const switchFunc = (func) => {
        if (func === "edit") {
            document.querySelector("input[name='itemName']").classList.add("hide");
        } else if (document.querySelector("input[name='itemName']")) {
            document.querySelector("input[name='itemName']").classList.remove("hide");
        }
        setImages((images) => []);
        setSearchWords((searchWords) => []);
        setActiveFunc((activeFunc) => func);
        clearForm();

    }

    const updateSearchWords = (func, num) => {
        let tempSearchWords = searchWords;
        let tempArr = []
        if (func === "add") {
            if ((typeof searchWords) !== "object") {
                tempSearchWords = [];
            }
            Validate(["searchWords"]);
            if (document.querySelector(".error[name='searchWords']")) {
                props.showAlert("What search term is that?", "danger");
                return false;
            }
            let newTerm = document.querySelector("input[name='searchWords']").value.toLowerCase();
            if (searchWords.indexOf(newTerm) !== -1) {
                props.showAlert("This term is already listed.", "warning");
                return false;
            }
            setSearchWords((searchWords) => [...tempSearchWords, newTerm]);
        }
        if (func === "delete") {
            for (let i = 0; i < tempSearchWords.length; i++) {
                if (i !== parseInt(num)) {
                    tempArr.push(tempSearchWords[i]);
                }
            }
            setSearchWords((searchWords) => tempArr);
        }
        document.querySelector("input[name='searchWords']").value = "";
    }


    const updateImgList = (func, num) => {
        let tempImages = images;
        let tempArr = []
        if (func === "add") {
            if ((typeof images) !== "object") {
                tempImages = [];
            }
            Validate(["images"]);
            if (document.querySelector(".error[name='images']")) {
                props.showAlert("What image address is that?", "danger");
                return false;
            }
            let newImage = document.querySelector("input[name='images']").value;
            if (images.indexOf(newImage) !== -1) {
                props.showAlert("This image is already posted.", "warning");
                return false;
            }
            setImages((images) => [...tempImages, newImage]);
        }
        if (func === "delete") {
            for (let i = 0; i < tempImages.length; i++) {
                if (i !== parseInt(num)) {
                    tempArr.push(tempImages[i]);
                }
            }
            setImages((images) => tempArr);
        }
        document.querySelector("input[name='images']").value = "";
    }




    useEffect(() => {
        if (loaded === false && (typeof props.items.searchWords) === "object" && (typeof props.items.images) === "object") {
            setSearchWords((searchWords) => props.items.searchWords);
            setImages((images) => props.items.images);
            setLoaded((loaded) => true);
        }
    }, []);

    console.log("(typeof images): " + (typeof images) + " - images: " + images);

    return (<div className="row">
        <div className="col-md-12">
            <h2 className="my-3">Inventory</h2>

            <div className="btn-group form-control" role="group">
                <button className={activeFunc === "add" ? "btn btn-secondary active" : "btn btn-secondary"} onClick={() => switchFunc("add")}>Add</button>
                <button className={activeFunc === "edit" ? "btn btn-secondary active" : "btn btn-secondary"} onClick={() => switchFunc("edit")}>Edit</button>
                <button className={activeFunc === "delete" ? "btn btn-secondary active" : "btn btn-secondary"} onClick={() => switchFunc("delete")}>Delete</button>
            </div>
        </div>
        {props.items.length > 0 && activeFunc !== "add" ?
            <div className="col-md-12 my-2">
                <ItemSelector populateFields={populateFields} items={props.items} />
            </div>
            : null}
        {activeFunc !== "delete" ?
            <div className="col-md-12">
                <ul className="list-unstyled">
                    <li>
                        <input type="text" placeholder="Item Name" name="itemName" maxLength="500" className="form-control" />
                    </li>
                    <input type="text" placeholder="Quantity in stock" name="stockQty" className="form-control" />
                    <li>
                        <input type="text" placeholder="Item Price" name="price" className="form-control" maxLength="10" />
                    </li>
                    <li><input type="text" placeholder="Item Category" name="category" className="form-control" maxLength="55" /></li>
                    <li>
                        <textarea name="details" placeholder="Item Details" className="form-control" rows="5" maxLength="5000"></textarea>
                    </li>
                    <li>
                        {(typeof searchWords) === "object" && searchWords.length > 0 ?

                            searchWords.map((item, i) => {
                                return (<button className="btn btn-info text-dark m-1" data-num={i} key={i} onClick={() => updateSearchWords("delete", i)}><i className="fa fa-trash" ></i> {item} </button>)
                            }) : null}


                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Submit search words/terms" name="searchWords" />
                            <button className="btn btn-outline-info" type="button" onClick={() => updateSearchWords("add", null)}>Add Search Term</button>
                        </div>

                    </li>
                    <li>
                        {(typeof images) === "object" && images.length > 0 ?

                            images.map((img, i) => {
                                return (<div key={i} className="inventoryWrapper"><img src={img} className="inventoryImg" /><button className="btn btn-info text-dark" data-num={i} onClick={() => updateImgList("delete", i)}><i className="fa fa-trash" ></i> Remove </button></div>)
                            }) : null}


                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Submit image url/web address" name="images" />
                            <button className="btn btn-outline-info" type="button" onClick={() => updateImgList("add", null)}>Add Image</button>
                        </div>

                    </li>
                    {activeFunc === "add" ? <li><button className="btn btn-danger btn-block" onClick={() => addItem()}>Add Item</button></li> :
                        <li><button className="btn btn-danger btn-block" onClick={() => editItem()}>Edit Item</button></li>}
                </ul>
            </div> :
            <div className="col-md-12">

                {toggle !== "deleteItem" ? <button className="btn btn-block btn-danger" onClick={() => setToggle((toggle) => "deleteItem")}>Delete Item</button> :
                    <div className="alert alert-danger" role="alert">
                        <p>Are you sure you want to delete this item?</p>
                        <button className="btn btn-warning" onClick={() => deleteItem()}>Yes</button>
                        <button className="btn btn-dark" onClick={() => setToggle((toggle) => "")}>No</button>
                    </div>}





            </div>}
    </div>)

}

export default CMS;

/*
 [
                    { itemName: "ice", price: 2.99, details: "5 lb bag" },
                    { itemName: "salt", price: 1.95, details: "1 lb bag" },
                    { itemName: "plates", price: 4.90, details: "12 paper" },
                    { itemName: "firewood", price: 6.25, details: "bundle cedar" },
                    { itemName: "matches", price: .99, details: "long stem 30 count" },
                    { itemName: "butter", price: 2.45, details: "4 cups" },
                    { itemName: "yogurt", price: 3.99, details: "6 ounce blueberry" },
                    { itemName: "cottage cheese", price: 4.90, details: "6 ounce regular flavor" },
                    { itemName: "comb", price: 1.99, details: "6 inch plastic" },
                    { itemName: "sun glasses", price: 8.99, details: "women/men variety" }
                ]
*/
