# Caesar cipher cli

## Installation & run:
```bash
  cd 01-caesar-cipher-cli-tool
  npm i
  my_caesar_cli -a encode -s 7 -i input.txt -o /output.txt
```
## Description:
  CLI tool should accept 4 options (short alias and full name):

1.  **-s, --shift**: a shift
2.  **-i, --input**: an input file
3.  **-o, --output**: an output file
4.  **-a, --action**: an action encode/decode

## Usage example:
1. -a (--action) is encode
```bash
  $ my_caesar_cli -a encode -s 7 -i "./input.txt" -o "./output.txt"
```
>input.txt This is secret. Message about "_" symbol!

>output.txt Aopz pz zljyla. Tlzzhnl hivba "_" zftivs!

```bash
  $ my_caesar_cli --action encode --shift 7 --input plain.txt --output encoded.txt
```
>plain.txt This is secret. Message about "_" symbol!

>encoded.txt Aopz pz zljyla. Tlzzhnl hivba "_" zftivs!

2. -a (--action) is decode

Decoding encoded initial string with the same -s(--shift) number produces the initial string.
```bash
  $ my_caesar_cli --action decode --shift 7 --input encoded.txt --output plain.txt
```
>encoded.txt Aopz pz zljyla. Tlzzhnl hivba "_" zftivs!

>plain.txt This is secret. Message about "_" symbol!

3. Negative shift handling
```bash
  $ my_caesar_cli --action encode --shift -1 --input plain.txt --output encoded.txt
```
>plain.txt This is secret. Message about "_" symbol!

>encoded.txt Sghr hr rdbqds. Ldrrzfd zants "_" rxlank!