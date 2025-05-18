import libphonenumber from 'libphonenumber-js'

export const SELECTORS = {
    phone: 'phone'
};

export  const phone = document.getElementById(SELECTORS.phone);

const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    return digits.match(/.{1,3}/g)?.join(' ') || '';
};

export const handlePhoneInput = (event) => { 
    const input = event.target;
    const cursorPosition = input.selectionStart;
    const originalValue = input.value;
    

    const digitCountBeforeCursor = originalValue
        .slice(0, cursorPosition)
        .replace(/\D/g, '')
        .length;
    
    const formatted = formatPhone(originalValue);
    input.value = formatted;
    
    let newPosition = 0;
    let digitCount = 0;
    
    for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
            digitCount++;
        }
        if (digitCount > digitCountBeforeCursor) {
            break;
        }
        newPosition = i + 1;
    }
    
    input.setSelectionRange(newPosition, newPosition);
};

export const validatePhone = (phone) => {
    try {
        const digits = phone.replace(/\D/g, ''); // Remove all non-digits
        if (digits.length !== 9) return false; // Ensure 9 digits
        const phoneNumber = libphonenumber.parsePhoneNumber(`+48${digits}`);
        return phoneNumber.isValid() && phoneNumber.country === 'PL';
    } catch (error) {
        return false;
    }
};