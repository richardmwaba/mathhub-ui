export function getMobileNumber(phoneNumbers) {
    return phoneNumbers.map((phoneNumber) => {
        return phoneNumber.type === 'MOBILE' ? `${phoneNumber.countryCode} ${phoneNumber.number}` : null;
    });
}

export function getFullPhoneNumber(phoneNumber) {
    return phoneNumber ? `${phoneNumber.countryCode} ${phoneNumber.number}` : '';
}

export function getFormattedAddresses(addresses) {
    return addresses.map((address) => {
        return formatAddress(address);
    });
}

export function formatAddress(address) {
    const fullAddress =
        nonNullStringOf(address.firstAddressLine) +
        ', ' +
        nonNullStringOf(address.secondAddressLine) +
        ', ' +
        nonNullStringOf(address.thirdAddressLine) +
        ', ' +
        nonNullStringOf(address.city) +
        ', ' +
        nonNullStringOf(address.province);
    const fullAddressWithCleanStart = fullAddress.replace(/^\W+\s+/, '');

    return fullAddressWithCleanStart.replace(/\W+\s+/, ', ');
}

export function nonNullStringOf(str) {
    return str ?? '';
}

export function getFullname(firstName, middleName, lastName) {
    return middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
}
