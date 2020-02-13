
exports.stringTrim =(textToTrim) => {
    return textToTrim.replace(/^\s+|\s+$/gm,'');
  }
 
exports.stringLowerCase = (textToLower) => {
    return textToLower.toLowerCase();
  }

exports.formattedDate = (d = new Date) => {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${day}/${month}/${year}`;
  }

exports.checkCalendarData = (error) =>{
  if (error) return console.log('The API returned an error: ' + error);
}