const timestamp = () => {
    //https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
    let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    let timeStamp = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    timeStamp = timeStamp.substring(0, timeStamp.indexOf("."));
    return timeStamp;

}

export default timestamp;