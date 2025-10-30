export class AlphaNumericHelper {
  /**
   * Get random alphabetic string of given length
   * @param length Length of string, defaults to 4
   * @returns Random alphabetic string
   */
  static randomAlpha(length = 4): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Get random numeric string of given length
   * @param length Length of string, defaults to 4
   * @returns Random numeric string
   */
  static randomNumeric(length = 4): string {
    const digits = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
  }

  /**
   * Get random alphanumeric string of given length
   * @param length Length of string, defaults to 4
   * @returns Random alphanumeric string
   */
  static randomAlphanumeric(length = 4): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

 /**
   * Get random full name
   * @returns Random first and last name
   */
  static randomName(): string {
    const firstNames = ["Lucas", "Emma", "Louis", "Lotte", "Noah"];
    const lastNames = ["Peeters", "Janssens", "Maes", "Wouters", "Claes"];
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
  }

  /**
   * Get random street address
   * @returns Random street with number
   */
  static randomStraat(): string {
    const streets = [
      "Rue de la Loi",
      "Kerkstraat",
      "Langestraat",
      "Koninginnelaan",
      "Vrijheidslaan",
    ];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 200) + 1;
    return `${street} ${number}`;
  }

  /**
   * Get random phone number
   * @returns Random phone number string
   */
  static randomPhoneNumber(): string {
    let number = "04";
    for (let i = 0; i < 8; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return number;
  }

  /**
   * Get random BTW number
   * @returns Random 10-digit numeric string
   */
  static randomBtw(): string {
    const digits = this.randomNumeric(9);
    const suffix = "B01";
    return `BE${digits}${suffix}`;
  }
}
