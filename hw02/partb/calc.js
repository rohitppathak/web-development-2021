const calcState = {
    curVal: "0", // what is displayed
    total: 0, // counting total so far
    operation: "", // operation to perform
    newNumber: false, // this will be true after an operation has been pressed
    decimal: false // have we seen a decimal
};

(function () {
    "use strict";

    let curState = Object.create(calcState);

    function onNumberPress(num) {
        if (curState.newNumber) {
            curState.total = parseFloat(curState.curVal);
            curState.curVal = "" + num;
        } else {
            curState.curVal = curState.curVal === "0" ? "" + num : curState.curVal + num;
        }
        curState.newNumber = false;
        updateDisplay();
    }

    function onDecimalPress() {
        if (!curState.decimal) {
            curState.decimal = true;
            curState.curVal = curState.curVal + ".";
            curState.newNumber = false;
            updateDisplay();
        }
    }

    function updateDisplay() {
        let display = document.getElementById("current-number");
        display.innerText = curState.curVal;
    }

    function onOperationPress(operation) {
        const operationFunc = {
            "+": (num1, num2) => num1 + num2,
            "-": (num1, num2) => num1 - num2,
            "x": (num1, num2) => num1 * num2,
            "/": (num1, num2) => num1 / num2,
        };
        if (curState.operation && !curState.newNumber) {
            const total = operationFunc[curState.operation](curState.total, parseFloat(curState.curVal));
            curState.curVal = "" + total;
            curState.total = 0;
        }
        curState.operation = operation;
        curState.newNumber = true;
        curState.decimal = false;
        console.log(curState);
        updateDisplay();
    }

    function onCancelPress() {
        curState = Object.create(calcState);
        updateDisplay()
    }

    function init() {
        const btnFunctionMap = {
            "0": () => onNumberPress(0),
            "1": () => onNumberPress(1),
            "2": () => onNumberPress(2),
            "3": () => onNumberPress(3),
            "4": () => onNumberPress(4),
            "5": () => onNumberPress(5),
            "6": () => onNumberPress(6),
            "7": () => onNumberPress(7),
            "8": () => onNumberPress(8),
            "9": () => onNumberPress(9),
            ".": onDecimalPress,
            "+=": () => onOperationPress("+"),
            "-": () => onOperationPress("-"),
            "x": () => onOperationPress("x"),
            "/": () => onOperationPress("/"),
            "C": onCancelPress,
        };
        for (const [id, func] of Object.entries(btnFunctionMap)) {
            const btn = document.getElementById(id);
            btn.addEventListener("click", func)
        }
    }

    window.addEventListener("load", init, false);
})();
