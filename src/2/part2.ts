import fs from 'fs';
import readline from 'readline';

type color = 'red' | 'green' | 'blue';


const parseGame = (string: string): number => {
  const [firstHalf, secondHalf] = string.split(': ');

  const actions = secondHalf.match(/(\d+) (blue|red|green)/g) ?? [];
  const minNumberOfCubes = actions.reduce((acc, action) => {
    const [stringifiedNumberOfCubes, color] = action.split(' ') as [string, color];
    const numberOfCubes = parseInt(stringifiedNumberOfCubes);
    if (numberOfCubes > acc[color]) {
      acc[color] = numberOfCubes;
    }
    return acc;
  }, { red: 0, green: 0, blue: 0 } as Record<color, number>);

  return Object.values(minNumberOfCubes).reduce((acc, numberOfCubes) => acc * numberOfCubes);
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