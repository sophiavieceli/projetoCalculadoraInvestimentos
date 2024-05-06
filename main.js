import { generateReturnsArray } from "./src/investimentGoals";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
// const calculateButton = document.getElementById("calculate-results");
const form = document.getElementById("investiment-form");
const clearFormButton = document.getElementById("clear-form");

let doughnutChartReference = {};
let progressionChartReference = {};
// declara aqui porque vão ser alteradas dentro de uma função, se declarasse dentro não daria pra usar fora

function formatCurrency(value) {
    return value.toFixed(2);
}

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector(".error")) {
        return;
        // não permite que o cálculo seja executado se ainda tiver um erro
    }
    resetCharts();
    // const startingAmount = Number(form["starting-amount"].value);

    const startingAmount = Number(
        document.getElementById("starting-amount").value.replace(",", ".")
    );
    const additionalContribution = Number(
        document
            .getElementById("additional-contribution")
            .value.replace(",", ".")
    );
    const timeAmount = Number(document.getElementById("time-amount").value);
    const timeAmountPeriod =
        document.getElementById("time-amount-period").value;
    const returnRate = Number(
        document.getElementById("return-rate").value.replace(",", ".")
    );
    const returnRatePeriod = document.getElementById("evaluation-period").value;
    const taxRate = Number(
        document.getElementById("tax-rate").value.replace(",", ".")
    );

    const returnsArray = generateReturnsArray(
        startingAmount,
        timeAmount,
        timeAmountPeriod,
        additionalContribution,
        returnRate,
        returnRatePeriod
    );

    const finalInvestimentObject = returnsArray[returnsArray.length - 1];

    doughnutChartReference = new Chart(finalMoneyChart, {
        type: "doughnut",
        data: {
            labels: ["Total investido", "Rendimento", "Imposto"],
            datasets: [
                {
                    data: [
                        formatCurrency(finalInvestimentObject.investedAmount),
                        formatCurrency(
                            finalInvestimentObject.totalInterestReturns *
                                (1 - taxRate / 100)
                        ),
                        formatCurrency(
                            finalInvestimentObject.totalInterestReturns *
                                (taxRate / 100)
                        ),
                    ],
                    backgroundColor: [
                        "rgb(255, 99, 132)",
                        "rgb(54, 162, 235)",
                        "rgb(255, 205, 86)",
                    ],
                    hoverOffset: 4,
                },
            ],
        },
    });

    progressionChartReference = new Chart(progressionChart, {
        type: "bar",
        data: {
            labels: returnsArray.map(
                (investmentObject) => investmentObject.month
            ),
            datasets: [
                {
                    label: "Total Investido",
                    data: returnsArray.map((investmentObject) =>
                        formatCurrency(investmentObject.investedAmount)
                    ),
                    // mapeando a primeira lista numa segunda, que só vai ter a quantidade investida ao término de cada mês
                    backgroundColor: "rgb(255, 99, 132)",
                },
                {
                    label: "Retorno do Investimento",
                    data: returnsArray.map((investmentObject) =>
                        formatCurrency(investmentObject.interestReturns)
                    ),
                    backgroundColor: "rgb(54, 162, 235)",
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
    });
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
    // método que retorna uma lista de todas as chaves do objeto
}

function resetCharts() {
    if (
        !isObjectEmpty(doughnutChartReference) &&
        !isObjectEmpty(progressionChartReference)
    ) {
        doughnutChartReference.destroy();
        progressionChartReference.destroy();
        // destroy é um método dos objetos chart dessa biblioteca
    }
}

function clearForm() {
    form["starting-amount"].value = "";
    form["additional-contribution"].value = "";
    form["time-amount"].value = "";
    form["return-rate"].value = "";
    form["tax-rate"].value = "";
    resetCharts();

    const errorInputContainers = document.querySelectorAll(".error");
    // querySelector devolve o primeiro elemento que encontrar
    // querySelectorAll devolve todos
    for (const errorInputContainer of errorInputContainers) {
        errorInputContainer.classList.remove("error");
        errorInputContainer.parentElement.querySelector("p").remove();
    }
}

function validateInput(evt) {
    if (evt.target.value === "") {
        return;
    }

    // const parentElement = evt.target.parentElement;
    const { parentElement } = evt.target;
    const grandParentElement = evt.target.parentElement.parentElement;
    const inputValue = evt.target.value.replace(",", ".");

    if (
        (!parentElement.classList.contains("error") && isNaN(inputValue)) ||
        Number(inputValue) <= 0
        // colocar a verificação da já existência da mensagem de erro antes pra dar mais prioridade
    ) {
        // <p class="text-red-600 text-start font-medium text-sm">Insira um valor numérico e maior que zero</p>
        const errorTextElement = document.createElement("p");
        errorTextElement.classList.add("text-red-600");
        errorTextElement.classList.add("text-start");
        errorTextElement.classList.add("font-medium");
        errorTextElement.classList.add("text-sm");
        errorTextElement.innerText =
            "Insira um valor numérico e maior que zero";

        parentElement.classList.add("error");
        grandParentElement.appendChild(errorTextElement);
        // adiciona no final
    } else if (
        parentElement.classList.contains("error") &&
        !isNaN(inputValue) &&
        Number(inputValue) > 0
    ) {
        parentElement.classList.remove("error");
        grandParentElement.querySelector("p").remove();
        // querySelector é pra selecionar um elemento entre os descendentes - pode ser por tag, classe, id, ... - entrega o primeiro elemento encontrado
    }
}

for (const formElement of form) {
    if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
        formElement.addEventListener("blur", validateInput);
    }
}

// calculateButton.addEventListener("click", renderProgression);

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
