# Html to Pdf

## Usage
``` 
const htmlToPdf = require('html-to-pdf');
htmlToPdf.convert(encodedHtml, options).then(result => {
    console.log(result);
}).catch( error => {
    console.error(error);
});
```

## Options
```
{
    orientation: "landscape",
    pageSize: "letter"
}
```

## Building docker environment
```docker-compose build```

## Starting docker environment
```docker-compose run --service-ports start```

## Running test
```npm test```

## Debugging
```npm run debug```

...then attach vscode debugger