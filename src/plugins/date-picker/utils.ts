export const transformNamedDate = (namedDate: string) => {
    switch (namedDate) {
        case "today":
            // fr-CA is one of the few locales with a day format of YYYY-MM-DD
            return new Intl.DateTimeFormat("fr-CA").format(new Date());

        case "tomorrow":
            return new Intl.DateTimeFormat("fr-CA").format(
                new Date().setDate(new Date().getDate() + 1),
            );

        case "yesterday":
            return new Intl.DateTimeFormat("fr-CA").format(
                new Date().setDate(new Date().getDate() - 1),
            );
    }

    return namedDate;
};

export const formatDate = (date: Date, enableTime: boolean, locale: string) => {
    return new Intl.DateTimeFormat(
        locale,
        enableTime
            ? {
                hour: "2-digit",
                minute: "2-digit",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }
            : {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            },
    )
        .format(date)
        .replace(",", "")
        .replace("am", "AM")
        .replace("a.m.", "AM")
        .replace("a. m.", "AM")
        .replace("pm", "PM")
        .replace("p.m.", "PM")
        .replace("p. m.", "PM");
};