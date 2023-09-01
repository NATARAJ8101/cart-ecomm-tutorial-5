import React, { useState, useEffect } from "react";
import axios from "axios";
import timestamp from "./timestamp";

const LeaveReview = (props) => {

    let [loaded, setLoaded] = useState(false);
    let [showReviewBt, setShowReviewBt] = useState(false);
    let [star, setStar] = useState(null);
    let [allRatings, setAllRatings] = useState([]);
    let [theAverage, setTheAverage] = useState(null);
    let [reviews, setReviews] = useState([]);

    const stars = [1, 2, 3, 4, 5];
    /*WE WILL BUILD THE AVERAGE FROM ALL REVIEW HERE IN THE BROWSER, THEN SEND THE RESULT TO THE "items" TABLE TO BE UTILIZED
    EVERYWHERE WITHOUT HAVING TO FORCE THE SERVER TO CONSTANLY DU THE MATH FOR EACH PRODUCT ON THE SHOP PAGE./*/
    const sendReviewAverage = (newRating) => {
        let tempList = allRatings;

        if (newRating !== "loading") {
            tempList.push(newRating);
        }

        let allRatingsSum = 0;
        for (let i = 0; i < tempList.length; i++) {
            allRatingsSum = allRatingsSum + allRatings[i];
        }
        let tempAverage = (allRatingsSum / tempList.length);
        setTheAverage((theAverage) => tempAverage);

        let updatedReview = {
            reviewData: JSON.stringify({ productAverage: tempAverage, howManyRatings: tempList.length }),
            itemName: props.selectedItem.itemName
        };
        if (newRating !== "loading") {
            axios.put("/api/items/update-review/", updatedReview, props.config).then(
                (res) => {
                    if (res.data.affectedRows === 0) {
                        props.showAlert("That did not work", "danger");
                    } else {
                        props.showAlert("Your review has been posted.", "success");
                        props.GrabAllItems(sessionStorage.getItem("token"));
                    }
                }, (error) => {
                    props.showAlert("That did not work: " + error, "danger");
                }
            )
        }

    }

    const sendReview = () => {
        let comment = "default";
        const commentField = document.querySelector("textarea[name='comment']");
        if (commentField.value) {
            comment = commentField.value.replace(/[|&;$%@"<>'()+,]/g, "");
        }

        if (star !== null && comment !== "default") {
            axios
                .post(
                    "/api/reviews/add-review",
                    {
                        email: props.userEmail,
                        itemName: props.selectedItem.itemName,
                        rating: star,
                        userTimestamp: props.userEmail + ":" + timestamp(),
                        comment: encodeURIComponent(comment),
                    },
                    props.config
                )
                .then(
                    (res) => {
                        sendReviewAverage(star);
                        props.showAlert("Success submitting review.", "success");
                        setStar((star) => null);
                        commentField.value = "";
                    },
                    (error) => {
                        console.log(error);
                        props.showAlert("That didn't work: " + error, "danger");
                    }
                );
        } else {
            props.showAlert(
                "Please select a star and put something in the review textbox.",
                "danger"
            );
        }
    };


    useEffect(() => {

        if (loaded === false && props.selectedItem.itemName) {


            //determin if user has bought this item
            //START CLIENT SIDE GET PURCHASE LOG DATA BASE ON TIME SELECTED
            axios.get("/api/purchaseLog/ordersFromUser/" + props.userEmail, props.config).then(
                (res) => {
                    // console.log("res.data: " + JSON.stringify(res.data))


                    for (let i = 0; i < res.data.length; i++) {
                        if (props.userEmail === res.data[i].saleId.substring(0, res.data[i].saleId.indexOf(":")) && props.selectedItem.itemName === res.data[i].itemName) {

                            setShowReviewBt((showReviewBt) => true);
                        }
                    }


                    axios.get("/api/reviews/" + props.selectedItem.itemName).then(
                        (res) => {

                            let tempRatingList = [];

                            for (let i = 0; i < res.data.length; i++) {


                                tempRatingList.push(res.data[i].rating);

                                res.data[i].comment = decodeURIComponent(res.data[i].comment);
                                if (props.userEmail === res.data[i].email) {
                                    document.querySelector("[name='comment']").value = "Your comment: " + res.data[i].comment;
                                    setStar((star) => res.data[i].rating);
                                    document.getElementById("reviewBT").classList.add("hide");
                                }
                                console.log("JSON.stringify(res.data[i]): " + JSON.stringify(res.data[i]));
                            }
                            setReviews((reviews) => res.data);
                            setAllRatings((allRatings) => tempRatingList);
                            sendReviewAverage("loading");


                        },
                        (error) => {
                            console.log(error);
                            props.showAlert("Reviews did not make it: " + error, "danger");
                        }
                    );
                }, (error) => {
                    props.showAlert("That did not work.", "danger");
                }
            )



            setLoaded((loaded) => true);
        }
    });


    return (
        <div className="pb-5">


            {showReviewBt === true ? (<div >
                <label>Leave a confirmed purchase review.</label>
                {stars.length > 0 ? stars.map((rating, i) => {
                    return (<i key={i} data-star={i + 1} className={rating > star ? "fas fa-star pointer" : "fas fa-star pointer yellowStar"} onClick={() => setStar((star) => i + 1)}></i>)
                }) : null}





                <textarea
                    className="form-control"
                    placeholder="Leave Confirmed Purchase Review"
                    rows="3"
                    name="comment"
                ></textarea>
                <button
                    className="btn btn-primary btn-block" id="reviewBT"
                    onClick={() => sendReview()}
                >
                    Submit Review
                </button>
            </div>
            ) : null}



            <ul className="list-unstyled pt-3 pb-5">
                {reviews.length > 0 ? <li><h3>Confirmed purchase reviews:</h3></li> : null}
                {reviews.length > 0 ?

                    reviews.map((review, i) => {
                        return (<li>

                            {stars.length > 0 ? stars.map((rating, i) => {
                                return (<i key={i} data-star={i + 1} className={rating > review.rating ? "fas fa-star pointer" : "fas fa-star pointer yellowStar"} onClick={() => setStar((star) => i + 1)}></i>)
                            }) : null}
                            <p>{review.comment}</p><small><i>{review.userTimestamp}</i></small><hr /></li>)
                    })

                    : null}
            </ul>



        </div>)

}

export default LeaveReview;
