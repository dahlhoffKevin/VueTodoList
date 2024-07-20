//-------------------------------------------------------------------------------------------
/**
 * returns the current date and time as array
 */
export function returnCurrentDateTimeArray() {
    //get date
    const currentDate = new Date();
    const day = currentDate.getDate();
    const dayString = day < 10 ? '0' + day : day.toString();
    const month = currentDate.getMonth();
    const monthString = month < 10 ? '0' + month : month.toString();
    const date = `${dayString}.${monthString}.${currentDate.getFullYear()}`;

    //get time
    const minutes = currentDate.getMinutes();
    const hours = currentDate.getHours();
    const time = `${(hours < 10 ? '0' + hours : hours)}:${(minutes < 10 ? '0' + minutes : minutes)} Uhr`;

    return [date, time];
}