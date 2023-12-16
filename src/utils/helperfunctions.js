const missingFieldsErrorMsg = (fields) => {
  let missingFields = '';
  for (let fieldName in fields) {
    if (fields[fieldName] === undefined) {
      missingFields += `${fieldName}, `;
    }
  }
  if (missingFields) {
    const errorMsg = `Send reamining required fields: ${missingFields.slice(0, -2)}`;
    return errorMsg;
  }
  return null;
};

export { missingFieldsErrorMsg };