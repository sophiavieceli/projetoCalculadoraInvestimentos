import { generateReturnsArray } from "./src/investimentGoals";

// const calculateButton = document.getElementById("calculate-results");
const form = document.getElementById("investiment-form");
const clearFormButton = document.getElementById("clear-form");

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector(".error")) {
        return;
        // não permite que o cálculo seja executado se ainda tiver um erro
    }

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

    console.log(returnsArray);
}

function clearForm() {
    form["starting-amount"].value = "";
    form["additional-contribution"].value = "";
    form["time-amount"].value = "";
    form["return-rate"].value = "";
    form["tax-rate"].value = "";

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
