const ONE_DAY = 1000*60*60*24;    // ms * seconds * minutes * hours


/** Given two financial points, including their dates, monthly spend, and monthly passive income,
     this calculates the intersection of the lines of monthly spend and monthly passive income.

     The date is treated as the x value, while the monthly spend and
     monthly passive income are the y values. 

     It treats these as lines, which isn't exactly correct given the trajectories
     are generally curved lines. However, it is close enough for our approximation.
     Especially since D3 also connects the specific points via straight lines. 

     Note: this makes the assumption that the first financial point provided 
     has passive income below monthly spend, and the second point has passive income
     above monthly spend. This means that the intersection of these 2 points
     is the exact day where passive income surpasses monthly spend. */
export function calculateIntersectionPoint(pointsForIntersection) {
    const beforePoint = pointsForIntersection[0];
    const afterPoint = pointsForIntersection[1];

    // calculate delta x (daysBetween) and the delta y's (change in spend and change in passive income)
    const daysBetween = calculateDaysBetween(beforePoint.date, afterPoint.date);
    const expenseSlope = calculateSlope(beforePoint.spend, afterPoint.spend, daysBetween);
    const withdrawSlope = calculateSlope(beforePoint.passiveIncome, afterPoint.passiveIncome, daysBetween);

    // put the lines in point-slope form to calculate intersection
    const expenseLineData = formatLineData(daysBetween, afterPoint.spend, expenseSlope);
    const withdrawLineData = formatLineData(daysBetween, afterPoint.passiveIncome, withdrawSlope);
    
    const intersectionPoint = calculateIntersection(expenseLineData, withdrawLineData);

    // convert raw number of days back into a date, offset from the original date by the number of days
    const intersectionDate = getIntersectionDate(beforePoint.date, intersectionPoint.x);

    // return x and y value of intersection point
    return formatPoint(intersectionDate, intersectionPoint.y);
}


/** Puts the points in a consistent format. */
function formatPoint(x, y) {
    return {
        x: x,
        y: y
    }
};


/** Puts the line data in consistent format of point slope form: y - y1 = m(x - x1) */
function formatLineData(x1, y1, m) {
    return {
        x: x1,
        y: y1,
        m: m
    };
};


/** Calculates the slope from information about the line. */
function calculateSlope(y1, y2, dx) {
    return (y2 - y1) / dx;
};


/** Calculates the x and y intersection, returning it as a point. */
function calculateIntersection(line1, line2) {
    const x = calculateXIntersection(line1, line2);
    const y = calculateYIntersection(line1, line2);

    return formatPoint(x, y);
};


/** This is the formula for finding the x intersection of 2 lines given in point-slope form. */
function calculateXIntersection(line1, line2) {
    return (line1.m * line1.x - line2.m * line2.x + line2.y - line1.y) / (line1.m - line2.m);
};


/** This is the formula for finding the y intersection of 2 lines given in point-slope form. */
function calculateYIntersection(line1, line2) {
    return (line1.m * line2.m * (line2.x - line1.x) + line1.y * line2.m - line2.y * line1.m) / (line2.m - line1.m);
};


/** Given 2 dates, calculates the number of days between them. */
function calculateDaysBetween(date1, date2) {
    const date1Ms = date1.getTime();
    const date2Ms = date2.getTime();

    const differenceMs = date2Ms - date1Ms;

    return Math.round(differenceMs / ONE_DAY);
};


/** Given a start date, and number of days to add, returns a new date
    after adding the number of days to the start date. */
function getIntersectionDate(startDate, daysToAdd) {
    const intersectionDate = new Date(startDate.getTime());
    const roundedDaysToAdd = Math.round(daysToAdd);

    // Note: strangely getDate() returns the number of the day in the month.
    intersectionDate.setDate(intersectionDate.getDate() + roundedDaysToAdd);

    return intersectionDate;
}

