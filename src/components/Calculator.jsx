import React, { useState } from "react";
import { create, all } from "mathjs";

const math = create(all);

export default function Calculator() {
    const [expression, setExpression] = useState("");
    const [display, setDisplay] = useState("0");

    // Replace certain symbols in the expression so mathjs can parse them
    function parseExpression(expr) {
        return expr
            .replace(/π/g, "pi")
            .replace(/√/g, "sqrt")
            .replace(/ln/g, "log") // mathjs uses log for natural log
            .replace(/\^/g, "^")
            .replace(/!/g, "factorial"); // mathjs uses factorial(...)
    }

    // Called when user presses "="
    function handleEvaluate() {
        try {
            const parsed = parseExpression(expression);
            // Evaluate safely with mathjs
            const result = math.evaluate(parsed);
            setDisplay(String(result));
            setExpression(String(result)); // so next input continues from result
        } catch (err) {
            setDisplay("Error");
        }
    }

    // Called when user presses a button (digits, operators, etc.)
    function handleButton(value) {
        // Clear
        if (value === "AC") {
            setExpression("");
            setDisplay("0");
            return;
        }
        // Delete last character
        if (value === "DEL") {
            const newExpr = expression.slice(0, -1);
            setExpression(newExpr);
            setDisplay(newExpr || "0");
            return;
        }
        // Evaluate
        if (value === "=") {
            handleEvaluate();
            return;
        }
        // Otherwise, just append to expression
        const newExpr = expression + value;
        setExpression(newExpr);
        setDisplay(newExpr);
    }

    return (
        <div className="w-full mx-auto bg-black text-white p-4 rounded-xl shadow-md">
            {/* Display */}
            <div className="text-right bg-gray-700 rounded-lg pt-2 pr-1 text-3xl mb-4 h-12 overflow-hidden">
                {display}
            </div>

            <div className="grid grid-cols-6 gap-4">
                {/* Scientific Ops (first column) */}
                <div className="grid grid-col-1 gap-y-2" >
                    <button
                        onClick={() => handleButton("sin(")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        sin
                    </button>

                    <button
                        onClick={() => handleButton("ln(")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        ln
                    </button>



                    <button
                        onClick={() => handleButton("tan(")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        tan
                    </button>
                    <button
                        onClick={() => handleButton("e")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        e
                    </button>
                    <button
                        onClick={() => handleButton("!")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        !
                    </button>

                </div>
                <div className="grid grid-col-1 gap-y-2" >
                    <button
                        onClick={() => handleButton("cos(")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        cos
                    </button>
                    <button
                        onClick={() => handleButton("log(")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        log
                    </button>
                    <button
                        onClick={() => handleButton("π")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        π
                    </button>
                    <button
                        onClick={() => handleButton("^")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        ^
                    </button>
                    <button
                        onClick={() => handleButton("√(")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        √
                    </button>
                </div>
                <div className="grid grid-col-1 gap-y-2" >
                    <button
                        onClick={() => handleButton("AC")}
                        className="bg-yellow-700 p-2 px-3 rounded"
                    >
                        AC
                    </button>
                    <button
                        onClick={() => handleButton("7")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        7
                    </button>
                    <button
                        onClick={() => handleButton("4")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        4
                    </button>
                    <button
                        onClick={() => handleButton("1")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        1
                    </button>
                    <button
                        onClick={() => handleButton("DEL")}
                        className="bg-red-600 p-2 px-3 rounded"
                    >
                        DEL
                    </button>
                </div>
                <div className="grid grid-col-1 gap-y-2" >
                    <button
                        onClick={() => handleButton("(")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        (
                    </button>
                    <button
                        onClick={() => handleButton("8")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        8
                    </button>
                    <button
                        onClick={() => handleButton("5")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        5
                    </button>
                    <button
                        onClick={() => handleButton("2")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        2
                    </button>
                    <button
                        onClick={() => handleButton("0")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        0
                    </button>
                </div>
                <div className="grid grid-col-1 gap-y-2" >
                    <button
                        onClick={() => handleButton(")")}
                        className="bg-gray-800 p-2 px-3 rounded"
                    >
                        )
                    </button>
                    <button
                        onClick={() => handleButton("9")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        9
                    </button>
                    <button
                        onClick={() => handleButton("6")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        6
                    </button>
                    <button
                        onClick={() => handleButton("3")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        3
                    </button>

                    <button
                        onClick={() => handleButton(".")}
                        className="bg-gray-700 p-2 px-3 rounded"
                    >
                        .
                    </button>
                </div>
                <div className="grid grid-col-1 gap-y-2" >
                    <button
                        onClick={() => handleButton("/")}
                        className="bg-orange-600 p-2 px-3 rounded"
                    >
                        ÷
                    </button>

                    <button
                        onClick={() => handleButton("*")}
                        className="bg-orange-600 p-2 px-3 rounded"
                    >
                        ×
                    </button>





                    <button
                        onClick={() => handleButton("-")}
                        className="bg-orange-600 p-2 px-3 rounded"
                    >
                        –
                    </button>




                    <button
                        onClick={() => handleButton("+")}
                        className="bg-orange-600 p-2 px-3 rounded"
                    >
                        +
                    </button>





                    <button
                        onClick={() => handleButton("=")}
                        className="bg-green-600 p-2 px-3 rounded row-span-2 col-span-1"
                        style={{ gridRow: "span 2 / span 2" }}
                    >
                        =
                    </button>
                </div>




            </div>
        </div>
    );
}
