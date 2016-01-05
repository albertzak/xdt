# xDT

Parse German healthcare data interchange formats GDT, LDT and BDT. This package is a quick port from the awesome rubygem by Levin Alexander.

* Original Project page: <https://github.com/levinalex/xdt>

## Installation

    npm install xdt

## Basic Usage

```JavaScript
    var Xdt = require('xdt');
    var bdt = new Xdt();

    bdt.open('001.bdt', 'ISO-8859-1', function(err, doc) {
      doc.fields.length; // Number of fields
      doc.fields[0].value; // Access parsed fields
      doc.first('8316'); // Find first occurence
      doc.find('6228'); // Find all occurences
      doc.patient.firstName; // Parse patient record
      doc.patient.birthday.getYear(); // DoB is a JS Date object
    });
```

## File Watcher

```JavaScript
    var Xdt = require('xdt');
    var bdt = new Xdt();

    bdt = bdt.watch('path to directory, file, or array', { delete: true }, function(err, doc) {
      doc.patient.id;
      doc.patient.lastName;
    });

    bdt.watcher.close();
```

## Acknowledgements

Thank you, Levin Alexander, for all the hard work of figuring out how the xDT format works.


## License

(The MIT Licence)

Copyright (c) 2012 Levin Alexander

Copyright (c) 2016 Albert Zak

MIT License

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
