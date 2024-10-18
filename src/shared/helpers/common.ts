import { ApplicationError } from '#libs/rest/types/application-error.enum.js';
import { ValidationErrorField } from '#libs/rest/types/validation-error-field.type.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

export function generateRandomValue(
  min: number,
  max: number,
  numAfterDigit = 0
) {
  return +(Math.random() * (max - min) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition =
    startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getUniqueRandomItems<T>(items: T[], maxCount: number): T[] {
  const uniqueueIndex = new Set<number>();
  while (uniqueueIndex.size !== Math.min(maxCount, items.length)) {
    uniqueueIndex.add(generateRandomValue(0, items.length - 1));
  }

  const uniqueElements: T[] = [];
  uniqueueIndex.forEach((value) => uniqueElements.push(items[value]));
  return uniqueElements;
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function fillDTO<T, V>(someDTO: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDTO, plainObject, {
    excludeExtraneousValues: true,
  });
}

export function createErrorObject(
  errorType: ApplicationError,
  error: string,
  details: ValidationErrorField[] = []
) {
  return { errorType, error, details };
}

export function reduceValidationErrors(
  errors: ValidationError[]
): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
