let reactions = {};

exports.handler = async (event, context) => {
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            body: JSON.stringify(reactions)
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { emoji, id } = JSON.parse(event.body);

    if (!reactions[id]) {
        reactions[id] = {};
    }

    if (!reactions[id][emoji]) {
        reactions[id][emoji] = 0;
    }

    reactions[id][emoji] += 1;

    return {
        statusCode: 200,
        body: JSON.stringify({ count: reactions[id][emoji] })
    };
};
