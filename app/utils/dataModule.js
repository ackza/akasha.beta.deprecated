import XRegExp from 'xregexp';
import { isEmpty } from 'ramda';
/* eslint-disable no-bitwise */
export const genId = () =>
    ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
/* eslint-enable no-bitwise */

export const calculateReadingTime = (wordCount = 0, options = {}) => {
    let minutes;
    let hours = null; // hopefully not the case :)
    options.wordsPerMinute = options.wordsPerMinute || 185;

    const time = wordCount / options.wordsPerMinute;
    minutes = Math.floor(time);
    if (minutes > 60) {
        hours = Math.floor(minutes / 60);
        minutes %= 60;
    }

    return {
        hours,
        minutes
    };
};

export const getDisplayAddress = (ethAddress) => {
    if (!ethAddress || !ethAddress.length === 42 || !ethAddress.startsWith('0x')) {
        console.error(`${ethAddress} is not a valid address`);
        return '';
    }
    return `${ethAddress.slice(0, 6)}...${ethAddress.slice(38)}`;
};

export const getDisplayName = ({ akashaId, ethAddress, long }) => {
    if (akashaId) {
        return `@${akashaId}`;
    }
    if (long) {
        return ethAddress;
    }
    return getDisplayAddress(ethAddress);
};

export const getWordCount = (content) => {
    const plainText = content.getPlainText('');
    const matchWords = plainText.match(/[^~`!¡@#$%^&*()_\-+={}\[\]|\\:;"'<,>.?¿\/\s]+/g);
    return matchWords ? matchWords.length : 0;
};

export const isEthAddress = value => value && value.length === 42 && value.startsWith('0x');

export const validateTag = (tagName) => {
    const tag = tagName ? tagName.trim().toLowerCase() : '';
    const ALPHANUMERIC_REGEX = /^(?:[a-zA-Z0-9]+(?:(-|_)(?!$))?)+$/;
    let error = null;
    if (tag.length > 3 && tag.length <= 24) {
        if (!ALPHANUMERIC_REGEX.test(tag)) {
            error = 'alphanumericError';
        }
    } else if (tag.length > 24) {
        error = 'tooLongError';
    } else {
        error = 'tooShortError';
    }
    return error;
};

export function getInitials (firstName, lastName = '') {
    if (!firstName && !lastName) {
        return '';
    }
    const unicodeLetter = XRegExp('^\\pL');
    const lastNameMatch = lastName && lastName.match(unicodeLetter);
    const lastNameInitial = lastNameMatch && lastNameMatch[0] ? lastNameMatch[0] : '';
    const firstNameMatch = firstName && firstName.match(unicodeLetter);
    const firstNameInitial = lastNameInitial ?
        (firstNameMatch && firstNameMatch[0] ? firstNameMatch[0] : '') :
        firstName
            .split(' ')
            .map((str) => {
                const chars = str.match(unicodeLetter);
                if (chars && chars[0]) {
                    return chars[0];
                }
                return '';
            })
            .reduce((prev, current) => prev + current, '');
    const initials = `${firstNameInitial}${lastNameInitial}`;
    return initials ?
        initials.slice(0, 2) :
        '';
}

export function getUrl (url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `http://${url}`;
}

export function extractExcerpt (data) {
    const { blocks } = data;
    if (!blocks) {
        console.error('no blocks not found inside content param');
        return null;
    }
    if (blocks.length === 0) {
        return null;
    }
    let extractedText = '';
    for (let i = 0; i < blocks.length; i++) {
        if (
            blocks[i].type === 'unstyled' &&
            blocks[i].text &&
            !isEmpty(blocks[i].text)
        ) {
            extractedText += blocks[i].text;
            if (extractedText.length > 120) {
                break;
            }
        }
    }
    return extractedText.substr(0, 120);
}
