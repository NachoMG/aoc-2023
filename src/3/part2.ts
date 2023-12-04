import fs from 'fs';
import readline from 'readline';

const isNumber = (string: string): boolean => /\d/.test(string);

const getNumber = (row: string[], startIndex: number, direction: 'left' | 'right' | 'both'): { number: number, stopIndex: number } => {
  let numberString = row[startIndex];
  let checkRight = direction === 'right' || direction === 'both';
  let checkLeft = direction === 'left' || direction === 'both';
  let stopIndex = startIndex;

  let windowSize = 1;
  while (checkLeft || checkRight) {
    if (checkLeft) {
      if (isNumber(row[startIndex - windowSize])) {
        numberString = row[startIndex - windowSize] + numberString;
      } else {
        checkLeft = false;
      }
    }

    if (checkRight) {
      if (isNumber(row[startIndex + windowSize])) {
        numberString = numberString + row[startIndex + windowSize];
      } else {
        stopIndex = startIndex + windowSize;
        checkRight = false;
      }
    }
    windowSize++;
  }
  return { number: parseInt(numberString), stopIndex };
}


const parseRow = (currentRow: string[], pastRow: string[], nextRow: string[]): number => {
  let total = 0;
  for (let i = 0; i < currentRow.length; i++) {
    const col = currentRow[i];
    if (col === '*') {
      const numbers = [];
      if (isNumber(currentRow[i - 1])) {
        const { number } = getNumber(currentRow, i - 1, 'left');
        numbers.push(number);
      }
      
      if (isNumber(currentRow[i + 1])) {
        const { number } = getNumber(currentRow, i + 1, 'right');
        numbers.push(number);
      }

      // todo improve top check, start from the middle, then join if mid is
      // number or return two 
      let topStopIndex = i;
      if (isNumber(pastRow[i - 1])) {
        const { number, stopIndex } = getNumber(pastRow, i - 1, 'both');
        topStopIndex = stopIndex;
        numbers.push(number);
      }

      if (topStopIndex <= i && isNumber(pastRow[i])) {
        const { number, stopIndex } = getNumber(pastRow, i, 'right');
        topStopIndex = stopIndex;
        numbers.push(number);
      }

      if (topStopIndex <= i + 1 && isNumber(pastRow[i + 1])) {
        const { number, stopIndex } = getNumber(pastRow, i + 1, 'right');
        topStopIndex = stopIndex;
        numbers.push(number);
      }

      // todo improve bottom check, same as top check
      let bottomStopIndex = i;
      if (isNumber(nextRow[i - 1])) {
        const { number, stopIndex } = getNumber(nextRow, i - 1, 'both');
        bottomStopIndex = stopIndex;
        numbers.push(number);
      }

      if (bottomStopIndex <= i && isNumber(nextRow[i])) {
        const { number, stopIndex } = getNumber(nextRow, i, 'right');
        bottomStopIndex = stopIndex;
        numbers.push(number);
      }

      if (bottomStopIndex <= i + 1 && isNumber(nextRow[i + 1])) {
        const { number, stopIndex } = getNumber(nextRow, i + 1, 'right');
        bottomStopIndex = stopIndex;
        numbers.push(number);
      }

      if (numbers.length === 2) {
        total += numbers.reduce((acc, number) => acc * number);
      } else if (numbers.length === 1) {
      }
    }
  }
  
  return total;
}

const main = async (): Promise<void> => {
  const readStream = fs.createReadStream('input.txt');
  const readLineInterface = readline.createInterface({ input: readStream });
  
  let pastRow: string[] = [];
  let currentRow: string[] = [];
  let nextRow: string[] = [];

  let total = 0;
  for await (const line of readLineInterface) {
    // only load the three needed rows into memory
    pastRow = currentRow;
    currentRow = nextRow;
    nextRow = line.split('');

    total += parseRow(currentRow, pastRow, nextRow);
  }

  // parse the last row
  total += parseRow(nextRow, currentRow, []);

  console.log(total);
}

main();
