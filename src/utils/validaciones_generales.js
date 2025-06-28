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

const rulesFullText = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullText.test(val) || STRINGS.onlyLetters,
]

const rulesFullTextAndNumber = [
  (val) => val != '' || STRINGS.FullTextAndNumber,
  (val) => expRegulares.FullTextAndNumber.test(val) || STRINGS.FullTextAndNumber,
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
/*Validaciones*/

export default {
  rulesOnlyNumbers,
  rulesNoEmpty,
  rulesOnlyUppercase,
  rulesFullText,
  rulesFullTextAndNumber,
  rulesNickName,
  rulesIP,
}
