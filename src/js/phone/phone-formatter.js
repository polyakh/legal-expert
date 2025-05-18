export class PhoneFormatter {
    format(value) {
        const digits = value.replace(/\D/g, '').slice(0, 9);
        return digits.match(/.{1,3}/g)?.join(' ') || '';
    }

    countDigitsBeforeCursor(value, cursorPosition) {
        return value.slice(0, cursorPosition).replace(/\D/g, '').length;
    }

    calculateNewCursorPosition(formattedValue, digitCountBeforeCursor) {
        let digitCount = 0;
        for (let i = 0; i < formattedValue.length; i++) {
            if (/\d/.test(formattedValue[i])) {
                digitCount++;
            }
            if (digitCount > digitCountBeforeCursor) {
                return i;
            }
        }
        return formattedValue.length;
    }
}