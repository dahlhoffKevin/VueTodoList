export const alertType = {
    primary: "primary",
    secondary: "secondary",
    success: "success",
    error: "danger",
    warning: "warning",
    info: "info",
    light: "light",
    dark: "dark"
}

export function displayAlert(alertText, alertType) {
    if (document.getElementById('liveAlert') !== null) return;
    var alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    var alert = document.createElement('div');
    alert.setAttribute('role', 'alert');
    alert.setAttribute('id', 'liveAlert');
    alert.setAttribute('class', `alert alert-${alertType}`);
    alert.innerHTML = `
        <strong>${alertText}</strong>
    `;
    alertPlaceholder?.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

export function displayGlobalAlert(alertText, alertType) {
    if (document.getElementById("globalAlert") !== null) return;
    var alertPlaceholder = document.getElementById('globalAlertPlaceholder');
    var alert = document.createElement('div');
    alert.setAttribute('role', 'alert');
    alert.setAttribute('id', 'globalAlert');
    alert.setAttribute('class', `alert alert-${alertType}`);
    alert.innerHTML = `
        <strong>${alertText}</strong>
    `;
    alertPlaceholder?.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}