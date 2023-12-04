import fs from 'fs';
import readline from 'readline';

const parseScratchCard = (string: string): number => {
  const [leftPart, rightPart] = string.split('|');
  const [cardInfo, winningNumbersString] = leftPart.split(':');
  
  const winningNumbers = new Set(winningNumbersString.trim().split(/\s+/));
  const playedNumbers = rightPart.trim().split(/\s+/);
  
  let guessedNumbersCount = 0;
  for (let playedNumber of playedNumbers) {
    if (winningNumbers.has(playedNumber)) {
      guessedNumbersCount++;
    }
  }
  
  if (guessedNumbersCount === 0) {
    return 0;
  }
  return 2 ** (guessedNumbersCount - 1);
}

const main = async (): Promise<void> => {
  const readStream = fs.createReadStream('input.txt');
  const readLineInterface = readline.createInterface({ input: readStream });
  
  let totalResult = 0;
  for await (const line of readLineInterface) {
    totalResult += parseScratchCard(line);
  }
  console.log(totalResult);
}

main();
