import { isEmpty } from 'lodash';
import zambianProvinces from 'src/assets/iso/zambian-provinces.json';

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

export const privincesOptions = () => {
    return zambianProvinces.map((province) => {
        return {
            value: province.name === 'Select province...' ? '' : province.name,
            label: province.name,
        };
    });
};

export function getCities(provinces, provinceName) {
    const cities_towns =
        provinces && !isEmpty(provinceName)
            ? provinces.filter((province) => province.name === provinceName)[0].cities_towns
            : [];

    cities_towns[0] = 'Select city/town...';

    return cities_towns.map((city_town) => {
        return {
            value: city_town === 'Select city/town...' ? '' : city_town,
            label: city_town,
        };
    });
}
