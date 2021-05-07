const alphabetLowerCase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const alphabetUpperCase = alphabetLowerCase.map(letter => letter.toLocaleUpperCase());

const isLowerCase = (string) => {
  if (string === string.toLowerCase()) return true
  return false
}

const encode = (message, shift) => {
  if (shift === undefined) shift = 0;
  if (shift === 0) return message;

  const splittedMessage = message.split('')
  let encodedMessage = "";
  let alphabet = null;

  for (let i = 0; i < splittedMessage.length; i++) {
    if (isLowerCase(splittedMessage[i])) {
      alphabet = alphabetLowerCase;
    } else {
      alphabet = alphabetUpperCase
    }

    const letterIndex = alphabet.indexOf(splittedMessage[i])

    if (letterIndex != -1) {
      const shiftedIndex = (letterIndex + shift) % alphabet.length
      const letter = [...alphabet].splice(shiftedIndex, 1);
      encodedMessage += letter
    } else {
      encodedMessage += splittedMessage[i]
    }
  }

  return encodedMessage
}

const decode = (message, shift) => {
  if (shift == undefined) shift = 0;
  if (shift === 0) return message;

  const splittedMessage = message.split('')
  let encodedMessage = "";
  let alphabet = null;

  for (let i = 0; i < splittedMessage.length; i++) {
    if (isLowerCase(splittedMessage[i])) {
      alphabet = alphabetLowerCase;
    } else {
      alphabet = alphabetUpperCase
    }

    const letterIndex = alphabet.indexOf(splittedMessage[i])

    if (letterIndex != -1) {
      const shiftedIndex = (letterIndex - shift) % alphabet.length
      const letter = [...alphabet].splice(shiftedIndex, 1);
      encodedMessage += letter
    } else {
      encodedMessage += splittedMessage[i]
    }
  }

  return encodedMessage
}

// const cypheredMessage = 'This is encoded "Hello world"!'
// console.log(encode('This is encoded "Hello world"!', 27))

// console.log(decode('Uijt jt fodpefe "Ifmmp xpsme"!', 27))

module.exports = { encode, decode }