/**
 * ISBN
 *
 * @version 1.0.2
 */
export default class {
	#isbn: string;
	#isbn13 = false; // 現行規格（13桁）の ISBN か
	#isbn10 = false; // 旧規格（10桁）の ISBN か

	/**
	 * @param {string} isbn - チェックする ISBN の値
	 * @param {boolean} strict - 厳格モード（true ならハイフンなしの構文はエラーとする）
	 */
	constructor(isbn: string, strict = false) {
		this.#isbn = isbn;

		const length = isbn.length;

		if (length === 17 && /^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d$/.test(isbn)) {
			this.#isbn13 = true;
		} else if (/^\d{13}$/.test(isbn)) {
			this.#isbn13 = !strict;
		} else if (length === 13 && /^\d{1,5}-\d{1,7}-\d{1,7}-[\dX]$/.test(isbn)) {
			this.#isbn10 = true;
		} else if (/^\d{9}[\dX]$/.test(isbn)) {
			this.#isbn10 = !strict;
		}
	}

	/**
	 * verifyCheckDigit() のエイリアス
	 *
	 * @returns {boolean} フォーマット、チェックデジットともに正しい場合は true
	 */
	isValid(): boolean {
		return this.verifyCheckDigit();
	}

	/**
	 * 13桁の ISBN か
	 *
	 * @returns {boolean} 現行規格（13桁）の ISBN なら true
	 */
	isIsbn13(): boolean {
		return this.#isbn13;
	}

	/**
	 * 10桁の ISBN か
	 *
	 * @returns {boolean} 旧規格（10桁）の ISBN なら true
	 */
	isIsbn10(): boolean {
		return this.#isbn10;
	}

	/**
	 * フォーマットを検証（チェックデジットの検証はしない）
	 *
	 * @returns {boolean} フォーマットが正しい場合は true
	 */
	verifyFormat(): boolean {
		return this.#isbn13 || this.#isbn10;
	}

	/**
	 * チェックデジットも含めてフォーマットを検証（該当する出版物が存在するとは限らない）
	 *
	 * @returns {boolean} フォーマット、チェックデジットともに正しい場合は true
	 */
	verifyCheckDigit(): boolean {
		if (this.#isbn13) {
			/* ISBN-13 */
			const isbnNoHyphens = this._getNoHyphens();

			return isbnNoHyphens.substring(12) === this._getCheckDigit13(isbnNoHyphens);
		} else if (this.#isbn10) {
			/* ISBN-10 */
			const isbnNoHyphens = this._getNoHyphens();

			return isbnNoHyphens.substring(9) === this._getCheckDigit10(isbnNoHyphens);
		}

		return false;
	}

	/**
	 * ハイフンなしの ISBN を取得する
	 *
	 * @returns {string} ハイフンなしの ISBN
	 */
	private _getNoHyphens(): string {
		return this.#isbn.replace(/-/g, '');
	}

	/**
	 * ISBN-13 のチェックデジットを取得する
	 *
	 * @param {string} isbnNoHyphens - ハイフンなしの ISBN
	 *
	 * @returns {string} チェックデジット
	 */
	private _getCheckDigit13(isbnNoHyphens: string): string {
		const checkDigit = String(
			10 -
				((Number(isbnNoHyphens.substring(0, 1)) +
					Number(isbnNoHyphens.substring(1, 2)) * 3 +
					Number(isbnNoHyphens.substring(2, 3)) +
					Number(isbnNoHyphens.substring(3, 4)) * 3 +
					Number(isbnNoHyphens.substring(4, 5)) +
					Number(isbnNoHyphens.substring(5, 6)) * 3 +
					Number(isbnNoHyphens.substring(6, 7)) +
					Number(isbnNoHyphens.substring(7, 8)) * 3 +
					Number(isbnNoHyphens.substring(8, 9)) +
					Number(isbnNoHyphens.substring(9, 10)) * 3 +
					Number(isbnNoHyphens.substring(10, 11)) +
					Number(isbnNoHyphens.substring(11, 12)) * 3) %
					10)
		);

		switch (checkDigit) {
			case '10':
				return '0';
		}

		return checkDigit;
	}

	/**
	 * ISBN-10 のチェックデジットを取得する
	 *
	 * @param {string} isbnNoHyphens - ハイフンなしの ISBN
	 *
	 * @returns {string} チェックデジット
	 */
	private _getCheckDigit10(isbnNoHyphens: string): string {
		const checkDigit = String(
			11 -
				((Number(isbnNoHyphens.substring(0, 1)) * 10 +
					Number(isbnNoHyphens.substring(1, 2)) * 9 +
					Number(isbnNoHyphens.substring(2, 3)) * 8 +
					Number(isbnNoHyphens.substring(3, 4)) * 7 +
					Number(isbnNoHyphens.substring(4, 5)) * 6 +
					Number(isbnNoHyphens.substring(5, 6)) * 5 +
					Number(isbnNoHyphens.substring(6, 7)) * 4 +
					Number(isbnNoHyphens.substring(7, 8)) * 3 +
					Number(isbnNoHyphens.substring(8, 9)) * 2) %
					11)
		);

		switch (checkDigit) {
			case '10':
				return 'X';
			case '11':
				return '0';
		}

		return checkDigit;
	}
}
