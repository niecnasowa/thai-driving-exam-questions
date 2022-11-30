// Questions and Images copied from this site:
// https://khaorot.com/drive-safely/%E0%B8%A3%E0%B8%A7%E0%B8%A1%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B9%83%E0%B8%9A%E0%B8%82%E0%B8%B1%E0%B8%9A%E0%B8%82%E0%B8%B5%E0%B9%88-%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%81%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%AD%E0%B8%9A-%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%9C%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%89%E0%B8%A5%E0%B8%B8%E0%B8%A2-aid20191021111521148
// 
// To run script: node index.js
// 

const ObjectsToCsv = require('objects-to-csv');

const content = require('./content');

const globalRegex = /(((<p>)\d+\.(\s*))(.)*<\/p>\n)(<div class="dvg_photo_box">\n.+\n<\/div>\n)?(<p>\n(\s(<strong>)?ก\.(.)+(<strong>)?<br \/>\n)(\s(<strong>)?ข\.(.)+(<strong>)?<br \/>\n)(\s(<strong>)?ค\.(.)+(<strong>)?<br \/>\n)(\s(<strong>)?ง\.(.)+(<strong>)?\n)(<\/p>))/g;

const found = content.match(globalRegex);

// Process Answers
const processedAnswers = found.map(
  (foundQuestion) => {

    console.log('foundQuestion', foundQuestion);

    const questionRegex = /<p>\d+\.\s*(.*)<\/p>\n/g;
    const aAnswerRegex = /\s(<strong>)?ก\.(.+)<br \/>\n/g;
    const bAnswerRegex = /\s(<strong>)?ข\.(.+)<br \/>\n/g;
    const cAnswerRegex = /\s(<strong>)?ค\.(.+)<br \/>\n/g;
    const dAnswerRegex = /\s(<strong>)?ง\.(.+)\n/g;
    const imageRegex = /https:\/\/img.khaorot.com\/2019\/10\/24\/5Cq7JfHF\/(.+).jpg/g;

    let correctAnswer = '';

    const [, question] = questionRegex.exec(foundQuestion);

    // A
    const [, aStrong, aAnswer] = aAnswerRegex.exec(foundQuestion);

    const isACorrect = aStrong === '<strong>';

    if (isACorrect) {
      correctAnswer = 'a';
    }

    // B
    const [, bStrong, bAnswer] = bAnswerRegex.exec(foundQuestion);

    const isBCorrect = bStrong === '<strong>';

    if (isBCorrect) {
      correctAnswer = 'b';
    }

    // C
    const [, cStrong, cAnswer] = cAnswerRegex.exec(foundQuestion);

    const isCCorrect = cStrong === '<strong>';

    if (isCCorrect) {
      correctAnswer = 'c';
    }

    // D
    const [, dStrong, dAnswer] = dAnswerRegex.exec(foundQuestion);

    const isDCorrect = dStrong === '<strong>';

    if (isDCorrect) {
      correctAnswer = 'd';
    }

    // Image
    const [, image] = imageRegex.exec(foundQuestion) || [];
    const imageFile = image ? image + '.jpg' : '';

    // Result
    const result = {
      question,
      aAnswer: aAnswer.replace('</strong>', ''),
      bAnswer: bAnswer.replace('</strong>', ''),
      cAnswer: cAnswer.replace('</strong>', ''),
      dAnswer: dAnswer.replace('</strong>', ''),
      correctAnswer,
      imageFile,
    };

    return result;
  }
);

// Export to CSV
(async () => {
  const csv = new ObjectsToCsv(processedAnswers);
 
  // Save to file:
  await csv.toDisk('./result.csv');
 
  // Return the CSV file as string:
  console.log(await csv.toString());
})();
