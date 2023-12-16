# Calculator

Simple calculator built for educational purposes.

## Run
```bash
node main.js 1 + 1
```

## Test
```bash
npm test
```

## Grammar

```PEG
Expression <- Sum
Sum <- Product (+ | -) Product*
Product <- Value (* | /) Value*
Value <- (-)? ([0-9]+) (.[0-9]+)? 
    | (++ | --) Value
    | Value (++ | --)
    | '(' Expression ')'
```
