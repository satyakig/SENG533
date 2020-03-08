import moment from 'moment';

export function getCurrentMillis() {
  return moment().valueOf();
}
