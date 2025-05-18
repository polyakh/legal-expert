export class FormValidatorService {
    constructor(phoneNumberValidator) {
        this.phoneNumberValidator = phoneNumberValidator;
    }

    validateAndFormatPhoneNumber(countryCode, phoneNumber) {
        const formattedPhoneNumber = this.phoneNumberValidator.formatNumber(countryCode, phoneNumber);
        const isValid = this.phoneNumberValidator.validate(countryCode, formattedPhoneNumber);

        return {
            isValid,
            formattedPhoneNumber,
            errors: isValid ? [] : ["Invalid phone number for the selected country."]
        };
    }
}