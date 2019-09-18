import {calculateIntersectionPoint} from './geometry.js';

const WITHDRAWAL_RATE = 0.04;
const INFLATION_RATE = 0.035;
const MAX_YEARS = 100;
const MAX_MONTHS = MAX_YEARS * 12;
const GROWTH_RATE = 0.075;
const INCOME_INCREASE_RATE = 0.05;

const MONTHLY_GROWTH_RATE = calculateInterestRateForPeriod(GROWTH_RATE, 12);
const MONTHLY_INFLATION_RATE = calculateInterestRateForPeriod(INFLATION_RATE, 12);


/** Top level function that gathers information necessary for
    plotting retirement trajectory. */
export function calculateGraphData(spend, activeIncome, totalAssets) {
    // default non-number values to 0
    spend = spend || 0
    activeIncome = activeIncome || 0
    totalAssets = totalAssets || 0

    const graphData = calculateGraphPoints(spend, activeIncome, totalAssets);

    let intersectionPoint = graphData.intersectionPoint;
    if (graphData.canRetireNow) {
        intersectionPoint = null;
    }

    return {
        graphPoints: graphData.graphPoints,
        onCourseToRetire: graphData.onCourseToRetire,
        canRetireNow: graphData.canRetireNow,
        intersectionPoint
    };
}


/** Given financial input, will continue to add additional points
    in financial trajectory until a point where passive income
    exceeds spending, or a cutoff is reached (100 years).

    It handles adjusting based on inflation, interest, and pay
    adjustments. */
function calculateGraphPoints(spend, activeIncome, totalAssets) {
    let months = 0;
    let canRetireNow = false;

    let graphPoints = [];
    const passiveIncome = WITHDRAWAL_RATE * totalAssets;
    let currentPoint = formatFinancialPoint(new Date(), spend, activeIncome, totalAssets, passiveIncome);
    graphPoints.push(currentPoint);

    if (canRetire(currentPoint)) {
        canRetireNow = true;
        padPoints(graphPoints, currentPoint, months, 24);
    }

    // keep adding points until passive income exceeds expenses, or max months is exceeded
    while (!canRetire(currentPoint) && months < MAX_MONTHS) {
        months++;
        const nextGraphPoint = getNextGraphPoint(currentPoint, months);
        graphPoints.push(nextGraphPoint);
        currentPoint = nextGraphPoint;
    }

    // if can retire, add intersection point (store it as well) and pad graph
    let intersectionPoint = null;
    let onCourseToRetire = canRetire(currentPoint);
    if (onCourseToRetire) {
        intersectionPoint = calculateIntersectionPoint(graphPoints.slice(-2));

        // pad the graph by an extra 1/6 of its length
        padPoints(graphPoints, currentPoint, months, graphPoints.length / 6);
    }

    return {
        intersectionPoint,
        onCourseToRetire,
        canRetireNow,
        graphPoints,
    };
}


/** Given the current financial information, it adjusts values appropriately
    based on interest, pay adjustment, and inflation. It returns
    the next month's financial information. */
function getNextGraphPoint(currentPoint, months) {
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(nextMonthDate.getMonth() + months);
    const newActiveIncome = isNewYear(months) ? addInterest(currentPoint.activeIncome, INCOME_INCREASE_RATE) : currentPoint.activeIncome;
    const newSpend = addInterest(currentPoint.spend, MONTHLY_INFLATION_RATE);
    const newTotalAssets = addInterest(currentPoint.totalAssets, MONTHLY_GROWTH_RATE) + currentPoint.activeIncome - currentPoint.spend;
    const newPassiveIncome = WITHDRAWAL_RATE * newTotalAssets;

    return formatFinancialPoint(nextMonthDate, newSpend, newActiveIncome, newTotalAssets, newPassiveIncome);
}


/** Formats a month's financial information in a consistent format. */
function formatFinancialPoint(date, spend, activeIncome, totalAssets, passiveIncome) {
    return {
        date,
        spend,
        activeIncome,
        totalAssets,
        passiveIncome
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
function canRetire(financialPoint) {
    return financialPoint.passiveIncome >= financialPoint.spend;
}


function padPoints(graphPoints, currentPoint, months, paddingSize) {
    // pad the graph by an extra 1/6 of its length
    for (let i = 0; i < paddingSize; i++) {
        months++;
        const nextGraphPoint = getNextGraphPoint(currentPoint, months, MONTHLY_GROWTH_RATE, MONTHLY_INFLATION_RATE);
        graphPoints.push(nextGraphPoint);
        currentPoint = nextGraphPoint;
    }
}
