class Validator {
    validate(value) {
        throw new Error("Method 'validate()' must be implemented.");
    }
}

export class PhoneNumberValidator extends Validator {
    constructor(countryCodePatternMap) {
        super();
        this.countryCodePatternMap = countryCodePatternMap;
    }

    validate(countryCode, phoneNumber) {
        const sanitizedNumber = this.sanitizeNumber(phoneNumber);
        const pattern = this.countryCodePatternMap[countryCode];
        if (!pattern) {
            throw new Error(`No validation pattern defined for country code: ${countryCode}`);
        }
        return pattern.test(sanitizedNumber);
    }

    formatNumber(countryCode, phoneNumber) {
        const sanitizedNumber = this.sanitizeNumber(phoneNumber);
        return `${countryCode}${sanitizedNumber}`;
    }

    sanitizeNumber(phoneNumber) {
        return phoneNumber.replace(/\s+/g, '');
    }
}