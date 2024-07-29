export function addDays(myDate: Date, days: number): Date {
    myDate.setDate(myDate.getDate() + days);
    return myDate;
}

export interface DateMonthYear {
    month: number;
    year: number;
}

export function getCurrentDateMonthYear(): DateMonthYear {
    const dateObj = new Date();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return { month, year };
}
