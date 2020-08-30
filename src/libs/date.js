let date_obj = new Date();

const date = {
  year: date_obj.getFullYear(),
  month: date_obj.getMonth(),
  day: date_obj.getDate(),
};

date.lastWorkDay = function () {
  let day = this.day;
  if (date_obj.getDay() === 0) {
    day = day - 2;
  }
  if (date_obj.getDay() === 6) {
    day = day - 1;
  }
  return `${this.month}-${day}-${this.year}`;
};

module.exports = date;
