import { ValidatorFactory } from './phone/validation/validator-factory.js'
import { FormValidatorService } from './phone/validation/form-validator-service.js'
import { PhoneInputHandler } from './phone/phone-input-handler.js'
import { PhoneFormatter } from './phone/phone-formatter.js'

// --- Service Locator ---
export class ServiceContainer {
    static init() {
        // Initialize core services
        this.phoneNumberValidator = ValidatorFactory.createPhoneNumberValidator();
        this.phoneFormatter = new PhoneFormatter();
        
        // Initialize dependent services
        this.formValidatorService = new FormValidatorService(this.phoneNumberValidator);
        this.phoneInputHandler = new PhoneInputHandler(this.phoneFormatter);
        
        
    }


    static get services() {
        return {
            validator: this.phoneNumberValidator,
            formatter: this.phoneFormatter,
            validatorService: this.formValidatorService,
            inputHandler: this.phoneInputHandler,
        };
    }
}