/**
 * Static class for stringify/parse objects with plugable serializers for types.
 */
class Vilanova {
  /**
   * Adds a new type to stringify/parse
   * @param {String} name - Name of the type
   * @param {Function} replacer - Function for the replacer of this type.
   * @param {Function} reviver - Function for the reviver of this type.
   */
  static addType(name, replacer, reviver) {
    Vilanova.types[name] = { replacer, reviver };
  }

  /**
   * Add the default types for Vilanova.
   */
  static addDefaultTypes() {
    // eslint-disable-next-line
    Vilanova.addType('bigint', value => `#bigint:${value}`, value => BigInt(value));
  }

  /**
   * A function that alters the behavior of the stringification process.
   * This function is binded to the source object, so using this inside here
   * is referncing the parent object of the property.
   * @param {String} key - Key of the property being stringified.
   * @param {Object} value - Value being stringified.
   * @returns {Object} Stringified version or the source object.
   */
  static replacer(key, value) {
    const type = Vilanova.types[(typeof value)];
    if (type) {
      return type.replacer(value);
    }
    return value;
  }

  /**
   * Converts a JavaScript value to a JSON string, using replacers for types
   * that can be intercepted.
   * @param {Object} obj - Input object.
   * @param {Function} fn - Function that performs the stringify, undefined for JSON.stringify.
   * @returns {String} Stringified version of the object.
   */
  static stringify(obj, fn) {
    const stringifyFn = fn || JSON.stringify;
    return stringifyFn(obj, Vilanova.replacer);
  }

  /**
   * Given an string, identify if it starts with "#<type>:", and returns
   * a token object with the type infered or undefined if this does not
   * contains a type, and the value.
   * Example:
   * #BigInt:12345 returns { type: 'BigInt', value: '12345' }
   * @param {*} str - String to be tokenized.
   * @returns {Object} Token object with the type and the value.
   */
  static getToken(str) {
    if (!str || typeof str !== 'string' || str.length < 3 || str[0] !== '#') {
      return { type: undefined, value: str };
    }
    const index = str.indexOf(':');
    if (index === -1) {
      return { type: undefined, value: str };
    }
    return { type: str.substring(1, index), value: str.slice(index + 1) };
  }

  /**
   * Function that prescribes how the value originally produced by parsing is transformed.
   * @param {String} key - Key of the property.
   * @param {Object} value - Value of the property to be revived.
   * @returns {Object} The value revived using the types that Vilanova knows.
   */
  static reviver(key, value) {
    if (typeof value !== 'string') {
      return value;
    }
    const token = Vilanova.getToken(value);
    if (token.type) {
      const type = Vilanova.types[token.type];
      if (type) {
        return type.reviver(token.value);
      }
    }
    return value;
  }

  /**
   * Parses a JSON string, constructing the JavaScript value or object described by the string.
   * @param {String} str - String to be parsed.
   * @param {Function} fn - Function for the parse, undefined for default JSON.parse.
   * @returns {Object} The object parsed from the string.
   */
  static parse(str, fn) {
    const parseFn = fn || JSON.parse;
    return parseFn(str, Vilanova.reviver);
  }
}

Vilanova.types = {};
Vilanova.addDefaultTypes();

module.exports = Vilanova;
