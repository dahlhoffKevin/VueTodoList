import { jwtDecode } from 'jwt-decode';
import authStore from '../../authStore.js';

//-------------------------------------------------------------------------------------------
/**
* returns the current date and time as array in utc format
*/
export function returnCurrentDateTimeArray() {
  //get date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const dayString = day < 10 ? '0' + day : day.toString();
  const month = currentDate.getMonth() + 1;
  const monthString = month < 10 ? '0' + month : month.toString();
  const date = `${dayString}.${monthString}.${currentDate.getFullYear()}`;

  //get time
  const minutes = currentDate.getMinutes();
  const hours = currentDate.getHours();
  const seconds = currentDate.getSeconds();
  const time = `${hours < 10 ? '0' + hours : hours}:` +
    `${minutes < 10 ? '0' + minutes : minutes}:` +
    `${seconds < 10 ? '0' + seconds : seconds} Uhr`;

  return [date, time];
}
//-------------------------------------------------------------------------------------------
/**
* checks if two arrays are equal
*/
export function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
//-------------------------------------------------------------------------------------------
/**
* returns a new todo index
*/
export function getNewTodoIndex(mainTodoArray) {
  return mainTodoArray.value.length;
}
//-------------------------------------------------------------------------------------------
/**
* formats date
*/
export function formatDate(inputDate) {
  const [year, month, day] = inputDate.split('-');
  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
}
export function formateDateAndTimeForApi(inputDateAndTime) {
  //inputDateAndTime = [date, time]
  const date = inputDateAndTime[0].split('.');
  return `${date[2]}-${date[1]}-${date[0]}T${inputDateAndTime[1].replace(' Uhr', '')}.000000`;
}
//-------------------------------------------------------------------------------------------
/**
* check if jwt expired
*/
export function isTokenExpired(token) {
  try {
    const decodedToken = jwtDecode(token);  // JWT Token decodieren
    const currentTime = Date.now() / 1000;   // Aktuelle Zeit in Sekunden (Unix-Zeit)

    // Überprüfe, ob das Ablaufdatum kleiner ist als die aktuelle Zeit
    if (decodedToken.exp < currentTime) {
      return true;  // Token ist abgelaufen
    } else {
      return false; // Token ist noch gültig
    }
  } catch (error) {
    console.error('Invalid token', error);
    return true;  // Bei Fehlern nehmen wir an, der Token ist ungültig
  }
}
//-------------------------------------------------------------------------------------------
/**
* get jwt expiration time
*/
export function getTokenExpiration(token) {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}
//-------------------------------------------------------------------------------------------
/**
* translate data object to handleble api object
*/
export function transformToApiObject(object) {
  const dataObjectId = object.todoElementId === undefined ? 'subtaskId' : 'todoElementId';

  const fieldsMap = {
    todoElementId: {
      id: 'todoElementId',
      created: ['date', 'time'],
      title: 'title',
      description: 'description',
      subtasks: 'subtasks',
      updated: ['dateAtUpdate', 'timeAtUpdate'],
      isChecked: 'isChecked',
      todoIndex: 'index'
    },
    subtaskId: {
      id: 'subtaskId',
      todo: 'todo',
      title: 'title',
      isChecked: 'isChecked'
    }
  };

  const result = {};

  const mapFields = fieldsMap[dataObjectId];

  Object.keys(mapFields).forEach((key) => {
    const value = mapFields[key];
    if (Array.isArray(value) && object[value[0]] && object[value[1]]) {
      result[key] = formateDateAndTimeForApi([object[value[0]], object[value[1]]]);
    } else if (value === 'subtasks' && Array.isArray(object.subtasks)) {
      result[key] = object.subtasks.map(subtask => ({
        id: subtask.subtaskId,
        title: subtask.title,
        isChecked: subtask.isChecked === 'true' ? 1 : 0,
        todo: { id: object.todoElementId }
      }));
    } else if (object[value] || typeof object[value] === 'boolean' || typeof object[value] === 'number') {
      if (value === 'isChecked') {
        result[key] = object[value] === 'true' ? 1 : 0;
      } else {
        result[key] = object[value];
      }
    }
  });

  result.user = { id: authStore.state.userId };
  console.log(result);
  return result;
}
/**
 * Format login response
 * @param {string} loginResponse - The raw response from the login API
 * @returns {Object|null} - Parsed user and token information, or null if parsing fails
 */
export function formatLoginResponse(loginResponse) {
  // Check if input is null or not a string
  if (!loginResponse || typeof loginResponse !== "string") return null;

  try {
    // Parse the response as JSON
    const responseArray = JSON.parse(loginResponse);

    // Extract user object and tokens
    const user = responseArray[0];
    const jwt = responseArray[1];
    const refreshToken = responseArray[2];

    // Validate extracted data
    if (!user || !jwt || !refreshToken) {
      throw new Error("Invalid response structure");
    }

    return {
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      token: {
        jwt: jwt,
        refreshToken: refreshToken,
      },
    };
  } catch (error) {
    console.error("Error parsing login response:", error.message);
    return null; // Return null if parsing fails
  }
}
