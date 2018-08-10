# Vilanova

`JSON` stringify and parse where transformations for types can be defined in a pluggable way in Node.js.

By default, it is able to stringify and parse objects that contains `BigInt` numbers.

### TABLE OF CONTENTS

* [Installation](#installation)
* [Example of use](#example-of-use)
* [Adding custom types](#adding-custom-types)
* [Contributing](#contributing)
* [Code of Conduct](#code-of-conduct)
* [Who is behind it](#who-is-behind-it)
* [License](#license)

## Installation

```sh
npm install vilanova
```

## Example of use

```javascript
const Vilanova = require('vilanova');

const obj = { id: 1, name: 'name', value: 123456789012345678901234567890n };
const str = Vilanova.stringify(obj);
const newObj = Vilanova.parse(str);
```

## Adding custom types

To add a custom type, you can use `Vilanova.addType` method. You must provide the name of the type, the reviver function and the replacer function.
The reviver function should always return an string that starts with `#<type>:`, where `<type>` should be an string where it's lower case is the name of the type that you're adding.
The replacer is the way to create the target object from the string.
Example:

```javascript
Vilanova.addType('bigint', value => `#BigInt:${value}`, value => BigInt(value));
```

## Contributing

You can read the guide of how to contribute at [Contributing](https://github.com/jseijas/vilanova/blob/master/CONTRIBUTING.md).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](https://github.com/jseijas/vilanova/blob/master/CODE_OF_CONDUCT.md).

## Who is behind it?

This project is developed by Jesus seijas.

If you need to contact me, you can do it at the email jseijas@gmail.com

## License

Copyright (c) Jesus Seijas.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.