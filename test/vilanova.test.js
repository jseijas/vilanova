const Vilanova = require('../lib');

function generateStep(i) {
  const obj = {
    id: i,
    name: `name ${i}`,
    bigValue: BigInt('1000000000000000000000000000000') + BigInt(`${i}`),
  };
  const str = `{"id":${i},"name":"name ${i}","bigValue":"#BigInt:${obj.bigValue}"}`;
  return { obj, str };
}

function generateTestcase(numElements) {
  if (!numElements) {
    return generateStep(1);
  }
  const result = { obj: [], str: '' };
  for (let i = 0; i < numElements; i += 1) {
    const step = generateStep(i);
    result.obj.push(step.obj);
    result.str = i > 0 ? `${result.str},${step.str}` : `[${step.str}`;
  }
  result.str = `${result.str}]`;
  return result;
}

describe('Vilanova', () => {
  describe('Stringify', () => {
    test('It should stringify a BigInt', () => {
      const input = BigInt('123456789012345678901234567890');
      const expected = '"#BigInt:123456789012345678901234567890"';
      const actual = Vilanova.stringify(input);
      expect(actual).toEqual(expected);
    });
    test('It should strinfigy an object', () => {
      const testcase = generateTestcase();
      const actual = Vilanova.stringify(testcase.obj);
      expect(actual).toEqual(testcase.str);
    });
    test('It should strinfigy an array of objects', () => {
      const testcase = generateTestcase(100);
      const actual = Vilanova.stringify(testcase.obj);
      expect(actual).toEqual(testcase.str);
    });
  });

  describe('Get Token', () => {
    test('It should return the source if is not defined', () => {
      const input = undefined;
      const expected = { type: undefined, value: undefined };
      const actual = Vilanova.getToken(input);
      expect(actual).toEqual(expected);
    });
    test('It should return the source if is not an string', () => {
      const input = [];
      const expected = { type: undefined, value: [] };
      const actual = Vilanova.getToken(input);
      expect(actual).toEqual(expected);
    });
    test('It should return the source if the length is less than 3', () => {
      const input = '#:';
      const expected = { type: undefined, value: input };
      const actual = Vilanova.getToken(input);
      expect(actual).toEqual(expected);
    });
    test('It should return the source if does not start with #', () => {
      const input = 'BigInt:123456';
      const expected = { type: undefined, value: input };
      const actual = Vilanova.getToken(input);
      expect(actual).toEqual(expected);
    });
    test('It should return the source if does not contains :', () => {
      const input = '#BigInt.123456';
      const expected = { type: undefined, value: input };
      const actual = Vilanova.getToken(input);
      expect(actual).toEqual(expected);
    });
    test('It should pop the type if the format is correct', () => {
      const input = '#BigInt:123456';
      const expected = { type: 'BigInt', value: '123456' };
      const actual = Vilanova.getToken(input);
      expect(actual).toEqual(expected);
    });
  });

  describe('Parse', () => {
    test('It should parse a BigInt', () => {
      const input = '"#BigInt:123456789012345678901234567890"';
      const expected = BigInt('123456789012345678901234567890');
      const actual = Vilanova.parse(input);
      expect(actual).toEqual(expected);
    });
    test('If the type is not supported, return the source string', () => {
      const expected = '#SmallInt:123456789012345678901234567890';
      const input = `"${expected}"`;
      const actual = Vilanova.parse(input);
      expect(actual).toEqual(expected);
    });
    test('It should parse an object with BigInt', () => {
      const testcase = generateTestcase();
      const actual = Vilanova.parse(testcase.str);
      expect(actual).toEqual(testcase.obj);
    });
    test('It should parse an array of objects with BigInts', () => {
      const testcase = generateTestcase(100);
      const actual = Vilanova.parse(testcase.str);
      expect(actual).toEqual(testcase.obj);
    });
  });
});
