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
export function calculateIntersectionPoint(points_for_intersection) {
    var before_point = points_for_intersection[0];
    var after_point = points_for_intersection[1];

    // calculate delta x (days_between) and the delta y's (change in spend and change in passive income)
    var days_between = calculateDaysBetween(before_point.date, after_point.date);
    var expense_slope = calculateSlope(before_point.spend, after_point.spend, days_between);
    var withdraw_slope = calculateSlope(before_point.passive_income, after_point.passive_income, days_between);

    // put the lines in point-slope form to calculate intersection
    var expense_line_data = formatLineData(days_between, after_point.spend, expense_slope);
    var withdraw_line_data = formatLineData(days_between, after_point.passive_income, withdraw_slope);
    
    var intersection_point = calculateIntersection(expense_line_data, withdraw_line_data);

    // convert raw number of days back into a date, offset from the original date by the number of days
    var intersection_date = getIntersectionDate(before_point.date, intersection_point.x);

    // return x and y value of intersection point
    return formatPoint(intersection_date, intersection_point.y);
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
    var x = calculateXIntersection(line1, line2);
    var y = calculateYIntersection(line1, line2);

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
    var one_day = 1000*60*60*24;    // ms * seconds * minutes * hours
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    var difference_ms = date2_ms - date1_ms;

    return Math.round(difference_ms/one_day);
};


/** Given a start date, and number of days to add, returns a new date
    after adding the number of days to the start date. */
function getIntersectionDate(start_date, days_to_add) {
    var intersection_date = new Date(start_date.getTime());
    var days_to_add = Math.round(days_to_add);

    // Note: strangely getDate() returns the number of the day in the month.
    intersection_date.setDate(intersection_date.getDate() + days_to_add);

    return intersection_date;
}

