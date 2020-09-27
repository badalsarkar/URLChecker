# URLChecker

Node.js command-line tool to bulk check URL status codes

## Installation



## Usage:

Find and check URLs inside file:

```urlcheck -f filename```

## Version information:

```urlcheck -v```

## Help:

```urcheck or urlcheck -h```

## Features

* The script matches all URLs in a given file and bulk-checks their status codes
* Links with successful responses are printed in green, 400 and 404 status codes are printed in red; all others (unknown) are printed in grey.
* Code is optimized to only request headers.
* Results contain clickable links
