import React, { useEffect, useState } from "react";


const TimeSelector = (props) => {

    let [loaded, setLoaded] = useState(false);

    let counter = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

    useEffect(() => {
        if (loaded === false && document.querySelector("[name='purchaseYr']")) {
            props.timeSearch()
            setLoaded((loaded) => true);
        }
    })



    return (<div className="row ">
        <div className="col-md-12">
            <h2 className="my-3">Select Date to review</h2>
        </div>
        <div className="col-md-3">
            <select name="purchaseYr" className="form-control" onChange={() => props.timeSearch()}>
                <option value={props.year}>{props.year}</option>
                <option value={(Number(props.year) - 1)}>{(Number(props.year) - 1)}</option>

            </select>
        </div>
        <div className="col-md-3">
            <select name="purchaseMo" className="form-control" onChange={() => props.timeSearch()}>
                <option value="default">Select Month</option>

                {counter.length > 0 ? counter.map((num, i) => {
                    if (Number(num) < 13) {
                        return <option key={i} value={num} selected={props.month == num ? true : false}>{num}</option>
                    }

                }) : null}

            </select>
        </div>

        <div className="col-md-3">
            <select name="purchaseDay" className="form-control" onChange={() => props.timeSearch()}>
                <option value="default">Select Day</option>

                {counter.length > 0 ? counter.map((num, i) => {
                    if (Number(num) < 32) {
                        return <option key={i} value={num} >{num}</option>
                    }

                }) : null}


            </select>
        </div>

        <div className="col-md-3">
            <select name="purchaseHr" className="form-control" onChange={() => props.timeSearch()}>

                <option value="default">Select Hour</option>

                {counter.length > 0 ? counter.map((num, i) => {
                    if (Number(num) < 25) {
                        return <option key={i} value={num} >{num}</option>
                    }

                }) : null}

            </select>
        </div>
    </div>)
}

export default TimeSelector;