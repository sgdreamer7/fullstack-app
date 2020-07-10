class BaseError extends Error {
  constructor(args = {}) {
    super();

    if (!args.message) /* c8 ignore next */ throw new Error('"message" is required');
    if (!args.field) /* c8 ignore next */ throw new Error('"field" required');

    this.message = args.message;
    this.field = args.field;
    this.parent = args.parent;
  }
}

class WrongId extends BaseError {}
class NotUnique extends BaseError {}
class Fatal extends BaseError {}
class InactiveObject extends BaseError {}
class WrongParameterValue extends BaseError {}

module.exports = { BaseError, NotUnique, WrongId, InactiveObject, WrongParameterValue, Fatal };
