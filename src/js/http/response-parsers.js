export class JsonParser {
  constructor(fieldName) {
    this.fieldName = fieldName;
  }

  async parse(response) {
    const data = await response.json();
    if (!(this.fieldName in data)) {
      throw new Error(`Missing field "${this.fieldName}" in JSON response`);
    }
    return data[this.fieldName];
  }
}
