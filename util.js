
exports.add = function Add(num1, num2){
    return num1+num2;
}

exports.sub = function Sub(num1 , num2){
    if(num1>num2){
        return num1-num2;
    }
    return num2-num1;
}
