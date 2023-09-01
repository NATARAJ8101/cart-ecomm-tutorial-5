import React, { useEffect, useState } from "react";


const Shop = (props) => {
    let [loaded, setLoaded] = useState(false);
    let [randomList, setRandomList] = useState([]);
    let [itemSearch, setItemSearch] = useState("");
    let [categories, setCategories] = useState([]);
    const stars = [1, 2, 3, 4, 5];


    const SelectProduct = (whichItem) => {

        props.setActiveModule((activeModule) => "productDetails");
        localStorage.setItem("activeModule", "productDetails");
        props.setSelectedItem((selectedItem) => whichItem)


    }


    const selectCategory = () => {
        let categorySelected = document.querySelector("[name='categoryMenu']").value;
        if (categorySelected === "default") {
            return false;
        } else {
            document.querySelector("[name='filterItems']").value = "";
        }
        setItemSearch((itemSearch) => categorySelected);
    }



    const filterItems = () => {
        let searchTxt = document.querySelector("[name='filterItems']").value;
        searchTxt = searchTxt.toLowerCase();
        document.querySelector("[name='categoryMenu']").selectedIndex = 0;
        setItemSearch((itemSearch) => searchTxt);
    }





    useEffect(() => {
        if (loaded === false && (typeof props.items) == "object" && props.items.length > 0) {
            let tempRandomList = [];
            let tempNumList = [];
            while (tempRandomList.length <= 7) {
                let newNum = Math.floor(Math.random() * props.items.length);
                if (tempRandomList.indexOf(newNum) === -1 && tempNumList.indexOf(newNum) === -1) {
                    tempNumList.push(newNum);
                    tempRandomList.push(props.items[newNum]);
                }
            }
            if (tempRandomList.length === 8) {
                setRandomList((randomList) => tempRandomList);
            }


            let tempCategories = [];
            for (let i = 0; i < props.items.length; i++) {
                if (tempCategories.indexOf(props.items[i].category) === -1) {
                    tempCategories.push(props.items[i].category);
                }
            }
            setCategories((categories) => tempCategories);

            setLoaded((loaded) => true);
        }
    });


    return (
        <div className="row navPadding animated bounceInUp">

            <div className="col-md-6 py-2">
                <h2 className="mt-3">Search Items</h2>
                <input type="text" name="filterItems" placeholder="Search Items" className="form-control" onChange={() => filterItems()} />

            </div>
            <div className="col-md-6 py-2">
                <h2 className="mt-3">Search Categories</h2>
                <select className="form-control" name="categoryMenu" onChange={() => selectCategory()}>
                    <option value="default">Select Category</option>
                    {categories.length > 0 ?
                        categories.map((category, i) => {
                            return (<option value={category}>{category}</option>);
                        })
                        : null}
                </select>
            </div>
            {randomList.length !== 0 ? (
                randomList.map((product, i) => {
                    if (product !== null) {
                        let tempName = product.itemName;
                        tempName = tempName + product.category;
                        tempName = tempName + product.searchWords.toString().toLowerCase();

                        if (product.reviewData !== null && (typeof product.reviewData) === "string") {
                            console.log("product.reviewData: " + product.reviewData);
                            product.reviewData = JSON.parse(product.reviewData);

                        }

                        return (
                            <div className={tempName.indexOf(itemSearch) !== -1 ? "col-md-6" : "hide"} key={i}>
                                <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative previewPanel">
                                    <div className="col p-4 d-flex flex-column position-static">
                                        <strong className="d-inline-block mb-2 text-primary text-capitalize">
                                            {product.itemName !== undefined ? product.itemName.substring(0, 25) : null}
                                            ...
                                        </strong>


                                        <div className="card-text mb-auto desktopOnly itemDescription">
                                            {product.details !== undefined ?
                                                product.details.substring(0, 90) + "..."
                                                : null}
                                        </div>

                                        {product.reviewData !== null ?
                                            <React.Fragment>
                                                <label>{product.reviewData.howManyRatings} {product.reviewData.howManyRatings > 1 ? " - Reviews" : " - Review"} </label>
                                                <div>
                                                    {stars.length > 0 ? stars.map((rating, i) => {
                                                        return (<i key={i} className={rating > product.reviewData.productAverage ? "fas fa-star pointer" : "fas fa-star pointer yellowStar"}></i>)
                                                    }) : null}
                                                </div>
                                            </React.Fragment>

                                            : <label>No Reviews</label>}
                                        <a
                                            href="#" onClick={() => SelectProduct(randomList[i])}
                                            className="btn btn-secondary w-100" data-id={randomList[i]}

                                        >
                                            View Details
                                        </a>

                                    </div>
                                    <div
                                        className="col-auto d-none d-lg-block productPreviewImg mobileShow "
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(" +
                                                product.images[0] +
                                                ")",
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    }
                })
            ) : (
                <div className="loader center"></div>
            )}
        </div>
    )
}
export default Shop;

/*

 

*/