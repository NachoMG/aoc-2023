import fs from 'fs/promises';

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
  return guessedNumbersCount;
}

const main = async (): Promise<void> => {
  const lines = (await fs.readFile('input.txt')).toString().split('\n');
  
  const strachCardQuantities = Array(lines.length).fill(1);

  for (let i = 0; i < lines.length; i++) {
    const guessedNumbersCount = parseScratchCard(lines[i]);
    for (let j = i + 1; j <= i + guessedNumbersCount; j++) {
      strachCardQuantities[j] += strachCardQuantities[i];
    }
  }
  
  console.log(strachCardQuantities.reduce((acc, stratchCardQuantity) => acc + stratchCardQuantity));
}

main();
