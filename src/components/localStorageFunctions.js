export const getCurrUserKey = () => {
    const localStorage = window.localStorage;
    return localStorage.getItem("currUserKey");
}
export const setCurrUserKey = (newCurrUserKey) => {
    const localStorage = window.localStorage;
    localStorage.setItem("currUserKey", newCurrUserKey);
}