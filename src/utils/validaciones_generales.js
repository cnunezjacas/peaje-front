import { STRINGS } from 'utils/string.js'
import { expRegulares } from 'utils/expresiones_regulares.js'

/*Validaciones*/
const rulesOnlyNumbers = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]

const rulesUppercaseAndNumber = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.uppercaseAndNumber.test(val) || STRINGS.uppercaseAndNumber,
]

const rulesOnlyUppercase = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]

const rulesOnlyText = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesFullTextAndNumber = [
  (val) => val != '' || STRINGS.TextAndNumber,
  (val) => expRegulares.TextAndNumber.test(val) || STRINGS.TextAndNumber,
]

const rulesNoEmpty = [(val) => val != '' || STRINGS.inputEmpty]

const rulesNickName = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.nickName.test(val) || STRINGS.nickName,
]

const rulesIP = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.ip.test(val) || STRINGS.ip,
]

const rulesCardOfBank = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.cardOfBank.test(val) || STRINGS.cardOfBank,
]

const rulesPhone = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.numberPhone.test(val) || STRINGS.numberPhone,
]

const rulesAddress = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyAddress.test(val) || STRINGS.onlyAddress,
]

const rulesEmail = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.email.test(val) || STRINGS.email,
]

const rulesNumberAndHyphen = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.numberAndHyphen.test(val) || STRINGS.numberAndHyphen,
]

const rulesCodeThreeLettersHyphenNumbers = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) =>
    expRegulares.codeThreeLettersHyphenNumbers.test(val) || STRINGS.codeThreeLettersHyphenNumbers,
]

const rulesExchangeRate = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => {
    const normalizedVal = val.trim().replace(',', '.')
    const isNumeric = /^\d+(?:.\d+)?$/.test(normalizedVal)

    return (isNumeric && Number(normalizedVal) >= 0) || STRINGS.decimalPositive
  },
]

const rulesCondorTextID = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.condorTextID.test(val) || STRINGS.condorTextID,
]

/*Validaciones*/

export default {
  rulesOnlyNumbers,
  rulesNoEmpty,
  rulesUppercaseAndNumber,
  rulesOnlyUppercase,
  rulesOnlyText,
  rulesFullTextAndNumber,
  rulesNickName,
  rulesIP,
  rulesCardOfBank,
  rulesPhone,
  rulesEmail,
  rulesAddress,
  rulesNumberAndHyphen,
  rulesCodeThreeLettersHyphenNumbers,
  rulesExchangeRate,
  rulesCondorTextID,
}
