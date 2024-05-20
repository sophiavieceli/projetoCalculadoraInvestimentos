// como essa parte é bem independente do projeto, as verificações e mensagens de erro são destinadas ao uso por outros desenvolvedores

const isNonEmptyArray = (arrayElement) => {
    return Array.isArray(arrayElement) && arrayElement.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
    if (
        !isNonEmptyArray(columnsArray) ||
        !isNonEmptyArray(dataArray) ||
        !tableId /* se não tiver valor é undefined, que é falsy, e o negativo é true */
    ) {
        throw new Error(
            "Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado"
        );
    }

    const tableElement = document.getElementById(tableId);

    if (!tableElement || tableElement.nodeName !== "TABLE") {
        throw new Error(
            "O ID informado não corresponde a nenhum elemento table"
        );
    }

    createTableHeader(tableElement, columnsArray);
    createTableBody(tableElement, dataArray, columnsArray);
};

// definida como function normal pra ser içada e poder ser escrita aqui embaixo
function createTableHeader(tableReference, columnsArray) {
    function createTheadElement(tableReference) {
        const thead = document.createElement("thead");
        tableReference.appendChild(thead);
        return thead;
    }
    // caso a tabela já tenha thead criada:
    // querySelector pesquisa o primeiro elemento com o seletor informado
    const tableHeaderReference =
        tableReference.querySelector("thead") ??
        /* se for null ou undefined */ createTheadElement(tableReference);
    // vai entregar um thead ele já existindo ou não
    const headerRow = document.createElement("tr");
    ["bg-blue-900", "text-slate-200", "sticky", "top-0"].forEach((cssClass) =>
        headerRow.classList.add(cssClass)
    );
    for (const tableColumnObject of columnsArray) {
        const headerElement =
            /*html*/
            `<th class="text-center">
                ${tableColumnObject.columnLabel}
            </th>`;
        /* o html aqui como string não fica formatado, a não ser que use a extensão es6-string-html e coloque o comentário html antes */
        headerRow.innerHTML += headerElement;
    }
    tableHeaderReference.appendChild(headerRow);
}

function createTableBody(tableReference, tableItems, columnsArray) {
    function createTbodyElement(tableReference) {
        const tbody = document.createElement("tbody");
        tableReference.appendChild(tbody);
        return tbody;
    }
    // caso a tabela já tenha thead criada:
    // querySelector pesquisa o primeiro elemento com o seletor informado
    const tableBodyReference =
        tableReference.querySelector("tbody") ??
        /* se for null ou undefined */ createTbodyElement(tableReference);

    for (const [intemIndex, tableItem] of tableItems.entries()) {
        // entries retorna um Array Iterator, que é um objeto que guarda as iterações
        // next retorna o próximo elemento do iterador com as informações de done: se a iteração já acabou (sim só se for o último) e value: um array com o número do valor e o próprio valor
        // dá pra fazer a desestruturação entre colchetes pra pegar esses dois valores
        // quando itera sobre o iterator, retorna cada elemento.value
        const tableRow = document.createElement("tr");

        if (intemIndex % 2 !== 0) {
            tableRow.classList.add("bg-blue-200");
        }

        for (const tableColumn of columnsArray) {
            const formatFn = tableColumn.format ?? ((info) => info);
            // se a coluna tiver o campo format, a função é atribuída a formatFn
            tableRow.innerHTML += /*html*/ `<td class="text-center">${formatFn(
                tableItem[tableColumn.accessor]
            )}</td>`;
        }
        tableBodyReference.appendChild(tableRow);
    }
}
