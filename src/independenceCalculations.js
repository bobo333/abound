import {calculateIntersectionPoint} from './geometry.js';

const WITHDRAWAL_RATE = 0.04;
const INFLATION_RATE = 0.035;
const MAX_YEARS = 100;
const MAX_MONTHS = MAX_YEARS * 12;
const GROWTH_RATE = 0.075;
const INCOME_INCREASE_RATE = 0.05;


/** Top level function that gathers information necessary for
    plotting retirement trajectory. */
export function calculateGraphData(spend, activeIncome, totalAssets) {
    const graphData = calculateGraphPoints(spend, activeIncome, totalAssets);

    return {
        graphPoints: graphData.graphPoints,
        canRetireNow: graphData.canRetireNow,
        dateOfRetirement: graphData.canRetireNow ? graphData.intersectionPoint.x : null,
    };
}


/** Given financial input, will continue to add additional points
    in financial trajectory until a point where passive income
    exceeds spending, or a cutoff is reached (100 years).

    It handles adjusting based on inflation, interest, and pay
    adjustments. */
function calculateGraphPoints(spend, activeIncome, totalAssets) {
    const monthlyGrowthRate = calculateInterestRateForPeriod(GROWTH_RATE, 12);
    const monthlyInflationRate = calculateInterestRateForPeriod(INFLATION_RATE, 12);
    let months = 0;

    let graphPoints = [];
    const passiveIncome = WITHDRAWAL_RATE * totalAssets;
    let currentPoint = formatFinancialPoint(new Date(), spend, activeIncome, totalAssets, passiveIncome);
    graphPoints.push(currentPoint);

    // keep adding points until passive income exceeds expenses, or max months is exceeded
    while (!canRetire(currentPoint) && months < MAX_MONTHS) {
        months++;
        const nextGraphPoint = getNextGraphPoint(currentPoint, months, monthlyGrowthRate, monthlyInflationRate);
        graphPoints.push(nextGraphPoint);
        currentPoint = nextGraphPoint;
    }

    // if can retire, add intersection point (store it as well) and pad graph
    let intersectionPoint = null;
    let canRetireNow = canRetire(currentPoint);
    if (canRetireNow) {
        intersectionPoint = calculateIntersectionPoint(graphPoints.slice(-2));
        console.log(intersectionPoint);

        // pad the graph by an extra 1/6 of its length
        for (let i = 0; i < graphPoints.length / 6; i++) {
            months++;
            const nextGraphPoint = getNextGraphPoint(currentPoint, months, monthlyGrowthRate, monthlyInflationRate);
            graphPoints.push(nextGraphPoint);
            currentPoint = nextGraphPoint;
        }
    }

    return {
        graphPoints, 
        intersectionPoint,
        canRetireNow,
    };
}


/** Given the current financial information, it adjusts values appropriately
    based on interest, pay adjustment, and inflation. It returns
    the next month's financial information. */
function getNextGraphPoint(currentPoint, months, monthlyGrowthRate, monthlyInflationRate) {
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(nextMonthDate.getMonth() + months);
    const newPassiveIncome = WITHDRAWAL_RATE * currentPoint.totalAssets;
    const newActiveIncome = isNewYear(months) ? addInterest(currentPoint.activeIncome, INCOME_INCREASE_RATE) : currentPoint.activeIncome;
    const newTotalAssets = addInterest(currentPoint.totalAssets, monthlyGrowthRate) + currentPoint.activeIncome - currentPoint.spend;
    const newSpend = addInterest(currentPoint.spend, monthlyInflationRate);

    return formatFinancialPoint(nextMonthDate, newSpend, newActiveIncome, newTotalAssets, newPassiveIncome);
}


/** Formats a month's financial information in a consistent format. */
function formatFinancialPoint(date, spend, activeIncome, totalAssets, passiveIncome) {
    return {
        date,
        spend,
        activeIncome,
        totalAssets,
        passiveIncome,
    };
}


/** Given a principle and an interest rate, returns the new principle. */
function addInterest(principle, interestRate) {
    return principle * (1 + interestRate);
}


/** Given a total interest rate and a number of periods to break that
    rate into, it returns the interest rate to be used for one of
    those periods.

    For example, if the interest is 5% annually, compounded monthly,
    it will calculate the interest rate per month. */
function calculateInterestRateForPeriod(overallRate, numberOfPeriods) {
    const base = overallRate + 1;
    const exponent = 1 / numberOfPeriods;
    return Math.pow((base), (exponent)) - 1;
}


/** Determines if a given number of months is an exact multiple
    of 12, meaning an exact number of years has elapsed. */
function isNewYear(months) {
    return (months > 0) && (months % 12 === 0);
}


/** Determines if, given a specific financial situation, the person in question
    can retire. Specifically, if passive income exceeds expenses. */
function canRetire(latestPoint) {
    return latestPoint.passiveIncome >= latestPoint.spend;
}
