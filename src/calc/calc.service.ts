import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  /**
   * Responsible for the calculation of a `string` mathematical expression.
   * @param calcBody object containing an `expression` property
   * which contains the mathematical expression in string format
   * @returns the result of the evaluation as a number
   */
  calculateExpression(calcBody: CalcDto) {
    // check if an expression is present, otherwise return 0 immediately
    if (!calcBody.expression || calcBody.expression.length === 0) {
      return 0;
    }

    // stack for managing the values
    // this is actually an array which is being
    // used as a stack with the push & pop methods.
    const stack = [];

    let current = 0;
    let operation = '+';

    // needed to check for a valid expression
    // keeps track of the last visited character
    let lastVisited = '';

    // convert the string to a string array for easier iteration
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

      // if the current character is a number/digit
      // we add it to current
      if (!isNaN(+charArrayExpression[i])) {
        // here we multiply by 10 as the current character/digit
        // could be part of a multi-digit number
        current = current * 10 + +charArrayExpression[i] - 0;
      }

      /**
       * The whole idea of the expression evaluation is derived from the fact that
       * `/` and `*` operators takes precedence over `+` and `-`.
       * So, first we have to evaluate the `/` & `*` operators, we store the `/` & `*` evaluation result back into the stack.
       * Everything else can be stored inside a stack as a negative or positive integer value as it comes.
       */
      // if the current character is not a digit/number
      if (
        isNaN(+charArrayExpression[i]) ||
        i === charArrayExpression.length - 1
      ) {
        switch (operation) {
          case '+':
            stack.push(current);
            break;
          case '-':
            stack.push(-current);
            break;
          case '*':
            stack.push(stack.pop() * current);
            break;
          case '/':
            stack.push(stack.pop() / current);
            break;
          default:
            // it is an invalid expression is invalid if it's come to this
            throw new BadRequestException('Invalid expression provided');
        }

        operation = charArrayExpression[i];
        current = 0;
      }
    }

    let result = 0;

    // finalize the calculation
    while (stack.length !== 0) {
      result += stack.pop();
    }

    return result;
  }
}
