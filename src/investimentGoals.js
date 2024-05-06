// códigos responsáveis pelas projeções dos investimentos

function convertToMonthlyReturnRate(yearlyReturnRate) {
    return yearlyReturnRate ** (1 / 12);
}

export function generateReturnsArray(
    startingAmount = 0,
    timeHorizon = 0,
    timePeriod = "monthly" /*prazo mensal ou anual*/,
    monthlyContribution = 0,
    returnRate = 0,
    returnTimeFrame = "monthly" /*rentabilidade mensal ou anual*/
) {
    // mensal pro anual: m * (1.05)^12
    // anual pro mensal (tudo tá sendo feito por mês, mas o usuário pode colocar rentabilidade anual): 20% ao ano (1.2) = (1.2)^1/12 ao mês
    // é essencial informar a quantia inicial e o tempo - se não informar a taxa de retorno tudo bem, vai ser como se só estivesse acumulando o dinheiro
    if (!timeHorizon || !startingAmount) {
        /* se algum deles for 0 é falsy, então isso dá true */
        // ou a pessoa colocou nada ou tá usando os valores padrão
        throw new Error(
            "Investimento inicial e prazo devem ser preenchidos com valores positivos."
        );
        // manteve os valores padrão pra melhorar a legibilidade, mostrar a cara dos valores esperados - no if é a regra de negócio mesmo - tudo bem o código ser redundante
    }

    const finalReturnRate =
        returnTimeFrame === "monthly"
            ? 1 + returnRate / 100
            : convertToMonthlyReturnRate(1 + returnRate / 100);

    const finalTimeHorizon =
        timePeriod === "monthly" ? timeHorizon : timeHorizon * 12;

    const referenceInvestimentObject = {
        investedAmount: startingAmount,
        interestReturns: 0 /* retornos com juros, rendimento do último mês */,
        totalInterestReturns: 0 /* quanto já rendeu dês do início */,
        month: 0 /* quantos meses se passaram */,
        totalAmount:
            startingAmount /* tudo que já investiu e tudo que já rendeu - soma do 1º e 3º campos */,
    };

    const returnsArray = [
        referenceInvestimentObject /* informação de onde partiu */,
    ];
    for (
        let timeReference = 1;
        timeReference <= finalTimeHorizon;
        timeReference++
    ) {
        // montanto cada um dos campos pra preencher o obj padrão
        const totalAmount =
            returnsArray[timeReference - 1].totalAmount * finalReturnRate +
            monthlyContribution;
        // startingAmount * finalReturnRate +
        // monthlyContribution; /* valor total ao término do mês*/

        const interestReturns =
            returnsArray[timeReference - 1].totalAmount * (finalReturnRate - 1);

        const investedAmount =
            startingAmount + monthlyContribution * timeReference;
        const totalInterestReturns = totalAmount - investedAmount;
        returnsArray.push({
            investedAmount,
            interestReturns,
            totalInterestReturns,
            month: timeReference,
            totalAmount,
        });
    }
    return returnsArray;
}
