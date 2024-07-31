import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    if (!calcBody.expression || calcBody.expression.length === 0) {
      return 0;
    }

    const stack = [];

    let current = 0;
    let operation = '+';

    let lastVisited = '';

    const charArrayExpression = calcBody.expression.split('');

    for (let i = 0; i < charArrayExpression.length; i++) {
      // check if last two visited characters are non digits
      if (lastVisited !== '') {
        if (isNaN(+lastVisited) && isNaN(+charArrayExpression[i])) {
          throw new BadRequestException('Invalid expression provided');
        }
      }

      // check if the last character is a non digit
      if (
        i === charArrayExpression.length - 1 &&
        isNaN(+charArrayExpression[i])
      ) {
        throw new BadRequestException('Invalid expression provided');
      }

      // update the last visited character
      lastVisited = charArrayExpression[i];

      if (!isNaN(+charArrayExpression[i])) {
        current = current * 10 + +charArrayExpression[i] - 0;
      }

      if (
        isNaN(+charArrayExpression[i]) ||
        i === charArrayExpression.length - 1
      ) {
        if (operation === '+') {
          stack.push(current);
        } else if (operation === '-') {
          stack.push(-current);
        } else if (operation === '*') {
          stack.push(stack.pop() * current);
        } else if (operation === '/') {
          stack.push(stack.pop() / current);
        } else {
          throw new BadRequestException('Invalid expression provided');
        }
        operation = charArrayExpression[i];
        current = 0;
      }
    }

    let result = 0;

    while (stack.length !== 0) {
      result += stack.pop();
    }

    return result;
  }
}
