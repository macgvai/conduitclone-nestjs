import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform, ValidationError } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype) {
      return value;
    }
    const object = plainToClass(metadata.metatype, value);

    if (typeof value !== 'object') return value;

    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException({
      errors: this.formatErrors(errors)

    }, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, curr) => {
      if (curr.constraints) {
        acc[curr.property] = Object.values(curr.constraints);
      }

      return acc;
    }, {});
  }
}