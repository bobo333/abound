import {calculateIntersectionPoint} from './geometry.js';

const withdrawal_rate = 0.04;
const inflation_rate = 0.035;
const MAX_YEARS = 100;
const MAX_MONTHS = MAX_YEARS * 12;
const growth_rate = 0.075;
const income_increase_rate = 0.05;


/** Top level function that gathers information necessary for
    plotting retirement trajectory. */
export function calculateGraphData(spend, active_income, total_assets) {
    const graph_data = calculateGraphPoints(spend, active_income, total_assets);

    return {
        graph_points: graph_data.graph_points,
        can_retire: graph_data.can_retire,
        date_of_retirement: graph_data.can_retire ? graph_data.intersection_point.x : null,
    }
}


/** Given financial input, will continue to add additional points
    in financial trajectory until a point where passive income
    exceeds spending, or a cutoff is reached (100 years).

    It handles adjusting based on inflation, interest, and pay
    adjustments. */
function calculateGraphPoints(spend, active_income, total_assets) {
    const monthly_growth_rate = calculateInterestRateForPeriod(growth_rate, 12);
    const monthly_inflation_rate = calculateInterestRateForPeriod(inflation_rate, 12);
    var months = 0;

    const graph_points = [];
    const passive_income = withdrawal_rate * total_assets;
    var current_point = formatFinancialPoint(new Date(), spend, active_income, total_assets, passive_income);
    graph_points.push(current_point);

    // keep adding points until passive income exceeds expenses, or max months is exceeded
    while (!canRetire(current_point) && months < MAX_MONTHS) {
        months++;
        const next_graph_point = getNextGraphPoint(current_point, months, monthly_growth_rate, monthly_inflation_rate);
        graph_points.push(next_graph_point);
        current_point = next_graph_point;
    }

    // if can retire, add intersection point (store it as well) and pad graph
    var intersection_point = null;
    var can_retire = canRetire(current_point);
    if (can_retire) {
        intersection_point = calculateIntersectionPoint(graph_points.slice(-2));

        // pad the graph by an extra 1/6 of its length
        for (var i = 0; i < graph_points.length / 6; i++) {
            months++;
            const next_graph_point = getNextGraphPoint(current_point, months, monthly_growth_rate, monthly_inflation_rate);
            graph_points.push(next_graph_point);
            current_point = next_graph_point;
        }
    }

    return {
        graph_points: graph_points, 
        intersection_point: intersection_point,
        can_retire: can_retire
    };
}


/** Given the current financial information, it adjusts values appropriately
    based on interest, pay adjustment, and inflation. It returns
    the next month's financial information. */
function getNextGraphPoint(current_point, months, monthly_growth_rate, monthly_inflation_rate) {
    const next_month_date = new Date();
    next_month_date.setMonth(next_month_date.getMonth() + months);
    const new_passive_income = withdrawal_rate * current_point.total_assets;
    const new_active_income = isNewYear(months) ? addInterest(current_point.active_income, income_increase_rate) : current_point.active_income;
    const new_total_assets = addInterest(current_point.total_assets, monthly_growth_rate) + current_point.active_income - current_point.spend;
    const new_spend = addInterest(current_point.spend, monthly_inflation_rate);

    return formatFinancialPoint(next_month_date, new_spend, new_active_income, new_total_assets, new_passive_income);
}


/** Formats a month's financial information in a consistent format. */
function formatFinancialPoint(date, spend, active_income, total_assets, passive_income) {
    return {
        date: date,
        spend: spend,
        active_income: active_income,
        total_assets: total_assets,
        passive_income: passive_income,
    }
}


/** Given a principle and an interest rate, returns the new principle. */
function addInterest(principle, interest_rate) {
    return principle * (1 + interest_rate);
}


/** Given a total interest rate and a number of periods to break that
    rate into, it returns the interest rate to be used for one of
    those periods.

    For example, if the interest is 5% annually, compounded monthly,
    it will calculate the interest rate per month. */
function calculateInterestRateForPeriod(overall_rate, number_of_periods) {
    const base = overall_rate + 1;
    const exponent = 1 / number_of_periods;
    return Math.pow((base), (exponent)) - 1;
}


/** Determines if a given number of months is an exact multiple
    of 12, meaning an exact number of years has elapsed. */
function isNewYear(months) {
    return (months > 0) && (months % 12 === 0);
}


/** Determines if, given a specific financial situation, the person in question
    can retire. Specifically, if passive income exceeds expenses. */
function canRetire(latest_point) {
    return latest_point.passive_income >= latest_point.spend;
}
