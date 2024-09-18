import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    const helpText = this.getCommandsFormat(`
          --version:                   # выводит номер версии
          --help:                      # печатает этот текст
          --import <path>:             # импортирует данные из TSV
          --generate <n> <path> <url>: # генерирует произвольное количество тестовых данных`);

    console.info(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            ${chalk.green('cli.js --<command> [--arguments]')}
        Команды: ${helpText}
    `);
  }

  private getCommandsFormat(text: string): string {
    return text
      .split('\n')
      .map((line) => {
        if (!line.trim().length) {
          return line;
        }
        const textCols = line.split(':');
        return [chalk.blue(textCols[0]), textCols[1]].join(':');
      })
      .join('\n');
  }
}
