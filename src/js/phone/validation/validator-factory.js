// Factory Method Pattern for creating validator instance
import { PhoneNumberValidator } from './phone-number-validator'

export class ValidatorFactory {
    static createPhoneNumberValidator() {
        const countryCodePatternMap = {
            '+1': /^\+1\d{10}$/,
            '+44': /^\+44\d{10}$/,
            '+48': /^\+48\d{9}$/,
            '+380': /^\+380\d{9}$/
        };
        return new PhoneNumberValidator(countryCodePatternMap);
    }
}