import React, { useEffect, useState } from "react";

const ItemSelector = (props) => {



    return (

        <select className="form-control" name="itemSelect" onChange={() => props.populateFields()}>
            <option value="default">Select Item</option>
            {props.items ? props.items.map((items, i) => {
                return (<option key={i} value={i}>{items.itemName}</option>)
            }) : null}
        </select>

    )

}

export default ItemSelector;