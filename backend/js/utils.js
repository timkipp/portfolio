import { isToday } from "https://esm.sh/date-fns/isToday";
import { isYesterday } from "https://esm.sh/date-fns/isYesterday";
import { isThisWeek } from "https://esm.sh/date-fns/isThisWeek";
import { isSameMonth } from "https://esm.sh/date-fns/isSameMonth";
import { isSameYear } from "https://esm.sh/date-fns/isSameYear";
import { differenceInCalendarWeeks } from "https://esm.sh/date-fns/differenceInCalendarWeeks";
import { differenceInMonths } from "https://esm.sh/date-fns/differenceInMonths";

export function textJoin(delimiter, ignoreEmpty, ...values) {
  return values
    .flat(Infinity) // handle arrays or nested arrays
    .filter(v => !ignoreEmpty || (v !== null && v !== undefined && v !== "")) // skip empty if requested
    .join(delimiter);
}

export function escapeHTML(text) {
    if (text == null) text = "";

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

export function formatAddress(name, email) {
  return name
    ? `${name} <${email}>`
    : email;
}

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