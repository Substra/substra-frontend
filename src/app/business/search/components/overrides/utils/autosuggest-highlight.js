import {clean as removeDiacritics} from 'diacritic';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
const specialCharsRegex = /[.*+?^${}()|[\]\\]/g;

// http://www.ecma-international.org/ecma-262/5.1/#sec-15.10.2.6
const wordCharacterRegex = /[a-z0-9_]/i;

const whitespacesRegex = /\s+/;

function escapeRegexCharacters(str) {
    return str.replace(specialCharsRegex, '\\$&');
}

export const match = (t, q, o) => {
    const options = {
        insideWords: false,
        findAllOccurrences: false,
        requireMatchAll: false,
        ...o,
    };

    let text = removeDiacritics(t);
    const query = removeDiacritics(q);

    return (
        query
            .trim()
            .split(whitespacesRegex)
            // If query is blank, we'll get empty string here, so let's filter it out.
            .filter(word => word.length > 0)
            .reduce((result, word) => {
                const wordLen = word.length;
                const prefix = !options.insideWords && wordCharacterRegex.test(word[0]) ? '\\b' : '';
                const regex = new RegExp(prefix + escapeRegexCharacters(word), 'i');
                let occurrence;
                let index;

                occurrence = regex.exec(text);
                if (options.requireMatchAll && occurrence === null) {
                    text = '';
                    return [];
                }

                while (occurrence) {
                    index = occurrence.index;
                    result.push([index, index + wordLen]);

                    // Replace what we just found with spaces so we don't find it again.
                    text = text.slice(0, index)
                        + new Array(wordLen + 1).join(' ')
                        + text.slice(index + wordLen);

                    if (!options.findAllOccurrences) {
                        break;
                    }

                    occurrence = regex.exec(text);
                }

                return result;
            }, [])
            .sort((match1, match2) => match1[0] - match2[0])
    );
};

export const parse = (t, matches) => {
    const result = [];

    const text = t;

    if (matches.length === 0) {
        result.push({
            text,
            highlight: false,
        });
    }
    else if (matches[0][0] > 0) {
        result.push({
            text: text.slice(0, matches[0][0]),
            highlight: false,
        });
    }

    matches.forEach((match, i) => {
        const startIndex = match[0];
        const endIndex = match[1];

        result.push({
            text: text.slice(startIndex, endIndex),
            highlight: true,
        });

        if (i === matches.length - 1) {
            if (endIndex < text.length) {
                result.push({
                    text: text.slice(endIndex, text.length),
                    highlight: false,
                });
            }
        }
        else if (endIndex < matches[i + 1][0]) {
            result.push({
                text: text.slice(endIndex, matches[i + 1][0]),
                highlight: false,
            });
        }
    });

    return result;
};

export default {
    match,
    parse,
};
