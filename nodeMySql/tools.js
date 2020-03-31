


exports.stringTrim = (textToTrim) => {
  return textToTrim.replace(/^\s+|\s+$/gm, '');
}

exports.stringLowerCase = (textToLower) => {
  return textToLower.toLowerCase();
}

exports.formattedDate = (d = new Date) => {
  let month = String(d.getMonth() +1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${year}-${month}-${day}`;
}

exports.formattedDecimal = (hoursToFormats) => {
  if (hoursToFormats) {
    hoursToFormats = (hoursToFormats.toString()).split('.')
    var hours_of_lessons = hoursToFormats[1] > 0 ? hoursToFormats[0] + '.' + (hoursToFormats[1] * 0.60).toFixed(0) : hoursToFormats[0]
    return hours_of_lessons
  }
  else {
    return hoursToFormats = "0"
  }
}

exports.checkCalendarData = (error) => {
  if (error) return console.log('The API returned an error: ' + error);
}

exports.formattedToDecimal = (hoursToFormats) => {
  //13: 00
  hoursToFormats = (hoursToFormats.toString()).split(':')
  if (hoursToFormats[1] == ' 00') {
    return hoursToFormats[0]
  }
  else {
    var hours = hoursToFormats[0] + '.' + (parseInt(hoursToFormats[1].trim(), 10) / 0.60).toFixed(0)
    console.log(hours)
    return hours
  }
}

