// utils/DateHelper.ts

export class DateHelper {
  /**
   * Get today's date as a Date object
   */
  static today(): Date {
    return new Date();
  }

  /**
   * Get today's date as ISO string (UTC)
   */
  static todayISO(): string {
    return new Date().toISOString();
  }

  /**
   * return todays date as dd mm yyyy
   * @returns 
   */
  static todayDMY(): string {
    return this.formatDMY(this.today())
  }

  /**
   * Get a date N days from today
   * @param days Number of days to add (can be negative)
   */
  static relativeDate(days: number = 0): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  /**
   * Format a Date object to YYYY-MM-DD
   * @param date Date to format
   */
  static formatYMD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get a date N days from today in YYYY-MM-DD format
   * @param days Number of days to add
   */
  static relativeYMD(days: number = 0): string {
    const date = this.relativeDate(days);
    return this.formatYMD(date);
  }

  /**
   * Get a date in DD/MM/YYYY format (common for European UI)
   * @param date Date to format
   */
  static formatDMY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Get a date N days from today in DD/MM/YYYY format
   * @param days Number of days to add
   */
  static relativeDMY(days: number = 0): string {
    const date = this.relativeDate(days);
    return this.formatDMY(date);
  }
}
