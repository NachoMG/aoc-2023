import fs from 'fs';
import readline from 'readline';

type color = 'red' | 'green' | 'blue';

const maxCubes: Record<color, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const parseGame = (string: string): number => {
  const [firstHalf, secondHalf] = string.split(': ');

  const totalCubes: Record<color, number> = { red: 0, green: 0, blue: 0 };
  const actions = secondHalf.match(/(\d+) (blue|red|green)/g) ?? [];
  for (const action of actions) {
    const [numberOfCubes, color] = action.split(' ') as [string, color];
    if (parseInt(numberOfCubes) > maxCubes[color]) {
      return 0;
    }
  }

  return  parseInt(firstHalf.match(/Game (\d+)/)?.[1] ?? '0');
}

const main = async (): Promise<void> => {
  const readStream = fs.createReadStream('input.txt');
  const readLineInterface = readline.createInterface({ input: readStream });
  
  let totalResult = 0;
  for await (const line of readLineInterface) {
    totalResult += parseGame(line);
  }
  console.log(totalResult);
}

main();