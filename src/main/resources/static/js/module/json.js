// eslint-disable-next-line import/prefer-default-export
export function serializeFormJson(name) {
    const formArray = $(`form[name=${name}]`).serializeArray() ;
    const jsonObject = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const arr of formArray) {
        jsonObject[arr.name] = arr.value;
    }

    return jsonObject;
}