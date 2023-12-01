import fs from 'fs';
import readline from 'readline';

const stringToNumberMap = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
]);

const validNumberStrings = [...stringToNumberMap.keys()];
const regExp = new RegExp(`(?=(\\d|${validNumberStrings.join('|')}))`, 'g');

const getCalibrationValue = (string: string): number => {
  const numbers = [...string.matchAll(regExp)].map((match) => match[1]);
  const unparsedFirstNumber = numbers?.[0] ?? '';
  const firstNumber = stringToNumberMap.get(unparsedFirstNumber) || unparsedFirstNumber;
  const unparsedSecondNumber = numbers?.[numbers.length - 1] ?? '';
  const lastNumber = stringToNumberMap.get(unparsedSecondNumber) || unparsedSecondNumber;
  return parseInt(`${firstNumber}${lastNumber}`);
};

const main = async (): Promise<void> => {
  const readStream = fs.createReadStream('input.txt');
  const readLineInterface = readline.createInterface({ input: readStream });
  
  let totalResult = 0;
  for await (const line of readLineInterface) {
    totalResult += getCalibrationValue(line);
  }
  
  console.log(totalResult);
};

main();
