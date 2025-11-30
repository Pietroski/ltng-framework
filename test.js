// Div
function Div(props, children) {
    const div = document.createElement('div')

    if (props?.class == undefined) {
        props.class = 'div'
    }
    if (props?.id === undefined) {
        props.id = generateUUIDv7()
    }

    for (const [key, value] of Object.entries(props)) {
        div.setAttribute(key, value)
    }
    div.appendChild(children)

    return div
}

// how to generate a random uuid in javascript?
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// how to generate a random uuid v7 in javascript?
// Native approach (modern browsers/Node.js 19+)
const uuid = crypto.randomUUID(); // Note: This generates v4, not v7

// For true UUID v7 (timestamp-based), use a library or manual implementation:

// Manual UUID v7 implementation
function uuidv7() {
    const timestamp = Date.now();
    const timestampHex = timestamp.toString(16).padStart(12, '0');

    const randomBytes = crypto.getRandomValues(new Uint8Array(10));
    const randomHex = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    // Format: tttttttt-tttt-7xxx-yxxx-xxxxxxxxxxxx
    return (
        timestampHex.slice(0, 8) + '-' +
        timestampHex.slice(8, 12) + '-' +
        '7' + randomHex.slice(0, 3) + '-' +
        ((parseInt(randomHex.slice(3, 4), 16) & 0x3f) | 0x80).toString(16) + randomHex.slice(4, 7) + '-' +
        randomHex.slice(7, 19)
    );
}

console.log(uuidv7());

// Or using the popular uuid package:
import { v7 as uuidv7 } from 'uuid';

const id = uuidv7();

//
function generateUUIDv7() {
    // 1. Get current timestamp in milliseconds
    const timestamp = Date.now();

    // 2. Generate 16 bytes (128 bits) of random data
    const value = new Uint8Array(16);
    crypto.getRandomValues(value);

    // 3. Encode timestamp into the first 48 bits (6 bytes)
    // High 32 bits
    value[0] = (timestamp >> 40) & 0xff;
    value[1] = (timestamp >> 32) & 0xff;
    value[2] = (timestamp >> 24) & 0xff;
    value[3] = (timestamp >> 16) & 0xff;
    // Low 16 bits
    value[4] = (timestamp >> 8) & 0xff;
    value[5] = timestamp & 0xff;

    // 4. Set Version to 7 (0111) in the 4 high bits of the 7th byte
    value[6] = (value[6] & 0x0f) | 0x70;

    // 5. Set Variant to 10xx in the 2 high bits of the 9th byte
    value[8] = (value[8] & 0x3f) | 0x80;

    // 6. Convert array to standard UUID string format
    return [...value].map((b, i) => {
        const hex = b.toString(16).padStart(2, '0');
        // Insert hyphens at specific positions
        return (i === 4 || i === 6 || i === 8 || i === 10) ? `-${hex}` : hex;
    }).join('');
}

console.log(generateUUIDv7());
