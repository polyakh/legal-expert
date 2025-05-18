export class PhoneInputHandler {
    constructor(phoneFormatter) {
        this.phoneFormatter = phoneFormatter;
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event) {
        const input = event.target;
        const originalValue = input.value;
        const cursorPosition = input.selectionStart;

        const digitCountBeforeCursor = this.phoneFormatter.countDigitsBeforeCursor(originalValue, cursorPosition);
        const formattedValue = this.phoneFormatter.format(originalValue);
        input.value = formattedValue;

        const newCursorPosition = this.phoneFormatter.calculateNewCursorPosition(formattedValue, digitCountBeforeCursor);
        input.setSelectionRange(newCursorPosition, newCursorPosition);
    }

}