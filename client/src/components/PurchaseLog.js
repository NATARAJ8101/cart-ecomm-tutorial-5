import react, { useEffect, useState } from "react";

const PurchaseLog = (props) => {
    let [loaded, setLoaded] = useState(false);
    let [userList, setUserList] = useState([]);
    let [userSearch, setUserSearch] = useState("");



    const searchEmployee = () => {

        let tempUserSearch = document.querySelector("select[name='selectUser']").value;
        setUserSearch((userSearch) => tempUserSearch);

    }


    useEffect(() => {
        if (props.timeSelected.length > 0 && loaded === false) {
            let tempUsers = [];
            for (let i = 0; i < props.timeSelected.length; i++) {
                let userEmail = props.timeSelected[i].saleId.substring(0, props.timeSelected[i].saleId.indexOf(":"));
                if (tempUsers.indexOf(userEmail) === -1) {
                    tempUsers.push(userEmail);
                }
            }
            setUserList((userList) => tempUsers);
            setLoaded((loaded) => true);
        }
    });

    return (

        <div className="row">
            <div className="col-md-12">
                <h1 className="my-3">Purchase Log</h1>
                <select className="form-control" name="selectUser" onChange={() => searchEmployee()}>
                    <option value="">All Users</option>
                    {userList.length > 0 ? userList.map((email, i) => { return <option key={i} value={email}>{email}</option> }) : null}
                </select>
            </div>
            <div className="col-md-12">
                <ul className="list-group mb-5">
                    {props.timeSelected ?
                        props.timeSelected.map((sale, i) => {
                            return <li key={i} className={sale.saleId.indexOf(userSearch) !== -1 ? "list-group-item" : "list-group-item hide"}><span className="capitalize">{sale.itemName}</span>{" - $" + sale.price} <span className="badge badge-secondary">{sale.saleId}</span></li>
                        })
                        : null}
                </ul>
            </div>
        </div>)
}

export default PurchaseLog;