import fs from 'fs';
import readline from 'readline';

const isNumber = (string: string): boolean => /\d/.test(string);
const isSymbol = (candidate: string): boolean => !!(candidate && /[^0-9.]/.test(candidate));

const parseRow = (currentRow: string[], pastRow: string[], nextRow: string[]): number => {
  let numberString = '';
  let hasSymbol = false;
  let total = 0;

  for (let i = 0; i < currentRow.length; i++) {
    const col = currentRow[i];
    if (isNumber(col)) {

      // if start of number and not first column, check the left boundary:
      // x
      // x n
      // x
      if (numberString === '' && i > 0) {
        hasSymbol = isSymbol(pastRow[i - 1]) || isSymbol(currentRow[i - 1]) || isSymbol(nextRow[i - 1])
      }
      
      // check up and down if symbol hasn't been found already
      // x
      // n
      // x
      if (!hasSymbol && (isSymbol(pastRow[i]) || isSymbol(nextRow[i]))) {
        hasSymbol = true;
      }

      numberString += col;

      // if is the last position of the row and a symbol has been found, add
      // the current numberString to the total
      if (i === currentRow.length - 1 && hasSymbol) {
        total += parseInt(numberString);
      }
    } else {
      if (numberString !== '') {
        // check right boundary if symbol hasn't been found already
        //   x
        // n x
        //   x
        if (!hasSymbol && (isSymbol(pastRow[i]) || isSymbol(currentRow[i]) || isSymbol(nextRow[i]))) {
          hasSymbol = true;
        }

        if (hasSymbol) {
          total += parseInt(numberString);
        }
      }
      hasSymbol = false;
      numberString = '';
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
