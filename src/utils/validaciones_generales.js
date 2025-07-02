import { STRINGS } from 'utils/string.js'
import { expRegulares } from 'utils/expresiones_regulares.js'

/*Validaciones*/
const rulesOnlyNumbers = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]

const rulesOnlyUppercase = [
  (val) => val != '' || STRINGS.onlyUppercase,
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

const rulesNumberAndHyphen = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.numberAndHyphen.test(val) || STRINGS.numberAndHyphen,
]

/*Validaciones*/

export default {
  rulesOnlyNumbers,
  rulesNoEmpty,
  rulesOnlyUppercase,
  rulesOnlyText,
  rulesFullTextAndNumber,
  rulesNickName,
  rulesIP,
  rulesCardOfBank,
  rulesPhone,
  rulesAddress,
  rulesNumberAndHyphen,
}
