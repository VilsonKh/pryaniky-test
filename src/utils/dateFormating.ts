export const formatDate = (dateString: string, locale: string = "ru-RU") => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
};