import moment from 'moment';

export const getCookie = (cname: string) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const setCookie = (cname: string, cvalue: string) => {
  const expiryDate = moment().add(4, 'h').toDate();
  const expires = `expires=${expiryDate.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
};
