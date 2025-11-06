import { isToday, isYesterday, isThisWeek, isSameMonth, isSameYear, differenceInCalendarWeeks, differenceInMonths } from "https://esm.sh/date-fns";

export function formatDateString(dateText) {
    const date = new Date(dateText);

    return date
        .toLocaleString("en-US", {
            weekday: "short",
            month: "numeric",
            day: "numeric",
            year: "2-digit",
            hour: "numeric",
            minute: "2-digit",
        })
        .replace(/, /g, " ");
}

export function getDateGroupLabel(sentDate) {
    const todaysDate = new Date();
    let dateGroup = "";

    if (isToday(sentDate)) {
        dateGroup = "Today";
    } else if (isYesterday(sentDate)) {
        dateGroup = "Yesterday";
    } else if (isThisWeek(sentDate)) {
        dateGroup = sentDate.toLocaleDateString(undefined, { weekday: "long" });
    } else {
        const weekDifference = differenceInCalendarWeeks(todaysDate, sentDate);

        if (weekDifference === 1) {
            dateGroup = "One Week Ago";
        } else if (weekDifference === 2) {
            dateGroup = "Two Weeks Ago";
        } else if (weekDifference === 3) {
            dateGroup = "Three Weeks Ago";
        } else if (weekDifference === 4) {
            if (isSameMonth(sentDate, todaysDate)) {
                dateGroup = "Four Weeks Ago";
            } else {
                dateGroup = "Last Month";
            }
        } else {
            const monthsDifference = differenceInMonths(todaysDate, sentDate);
            if (monthsDifference === 1) {
                dateGroup = "Last Month";
            } else {
                dateGroup = sentDate.toLocaleDateString(undefined, { month: "long" });

                if (!isSameYear(todaysDate, sentDate)) {
                    dateGroup += " " + sentDate.getFullYear();
                }
            }
        }
    }

    return dateGroup;
}

export function escapeHTML(text) {
    return text.replace(/[&<>'"]/g, (c) => {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;",
        }[c];
    });
}
