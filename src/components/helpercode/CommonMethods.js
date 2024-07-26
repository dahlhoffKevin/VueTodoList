//-------------------------------------------------------------------------------------------
/**
 * returns the current date and time as array
 */
export function returnCurrentDateTimeArray() {
  //get date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const dayString = day < 10 ? "0" + day : day.toString();
  const month = currentDate.getMonth() + 1;
  const monthString = month < 10 ? "0" + month : month.toString();
  const date = `${dayString}.${monthString}.${currentDate.getFullYear()}`;

  //get time
  const minutes = currentDate.getMinutes();
  const hours = currentDate.getHours();
  const seconds = currentDate.getSeconds();
  const time = `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds} Uhr`;

  return [date, time];
}

export function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
