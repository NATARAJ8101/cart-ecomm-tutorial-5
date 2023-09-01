const Validate = (fields) => {
    if (document.querySelectorAll(".error")) {
        [].forEach.call(document.querySelectorAll(".error"), function (e) {
            e.classList.remove("error");
        })
    }

    for (let i = 0; i < fields.length; i++) {
        let value;
        let element = document.querySelector("[name='" + fields[i] + "']");
        if (element !== null) {
            value = element.value
        } else {
            value = ""
        }
        if (value === "" || value === "default") {
            document.querySelector("[name='" + fields[i] + "']").classList.add("error");
        } else {
            document.querySelector("[name='" + fields[i] + "']").classList.remove("error");
        }

        const isNumeric = ["stockQty", "price"];
        let cost;
        try {
            cost = document.querySelector("[name='" + fields[i] + "']").value * 100;
        } catch {
            document.querySelector("[name='" + fields[i] + "']").classList.add(".error");
        }

        if (isNumeric.indexOf(fields[i]) !== -1) {
            cost = Math.round(cost);
            if (!Number.isInteger(cost)) {
                document.querySelector("[name='" + fields[i] + "']").classList.add("error");
            }
        }


    }
}

export default Validate;