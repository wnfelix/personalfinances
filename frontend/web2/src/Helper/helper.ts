import IEntidadeGenerica from '../interfaces/IEntidadeGenerica';

/**
 * Recupera um valor tipado do localStorage
 * @param key chave do valor no localStorage
 * @param defaultValue valor padrão de retorno quando o item não existir
 */
export function GetLocalStorageValue<T>(key: string, defaultValue: T): T {
	let value = defaultValue;

	if (localStorage.getItem(key) !== null) value = JSON.parse(localStorage.getItem(key) ?? '') as T;

	return value;
}

/**
 * Faz a distinção pelo id dos itens de uma lista genérica
 * @param items lista de items para distinção
 * @param orderByProperty especifica qual propriedade será utilizada para a ordenação
 */
export function Distinct(items: IEntidadeGenerica[], orderByProperty: 'name' | 'id' = 'name'): IEntidadeGenerica[] {
	const list = items
		.filter(v => v.id !== undefined)
		.filter((v, i, a) => a.findIndex(r => r.id === v.id) === i)
		.sort((a, b) => (a[orderByProperty] > b[orderByProperty] ? 1 : -1));

	return list;
}

/**
 * Faz a distinção dos itens de uma lista genérica por uma propriedade específica
 * @param items lista de itens para distinção
 * @param key propriedade usada para distinção
 * @param orderBy propriedade usada para ordenação
 */
export function DistinctBy<T, K extends keyof T, O extends keyof T>(items: T[], key: K, orderBy: O): T[] {
	return items
		.filter(item => item[key] !== undefined)
		.filter((item, index, self) => self.findIndex(i => i[key] === item[key]) === index)
		.sort((a, b) => (a[orderBy] > b[orderBy] ? 1 : -1));
}

/**
 * Formata a data fornecida e retorna um array com [data formatada, primeiro dia do mês formatado] no fuso horário local.
 * @param {Date} date - A data a ser formatada
 * @returns {string[]} - Array com [data no formato yyyy-MM-dd, primeiro dia do mês no formato yyyy-MM-dd]
 */
export function formatDateAndFirstDay(date: Date): string[] {
	// Formata a data fornecida
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth é 0-based
	const day = String(date.getDate()).padStart(2, '0');
	const formattedDate = `${year}-${month}-${day}`;

	// Obtém e formata o primeiro dia do mês
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const firstDayYear = firstDay.getFullYear();
	const firstDayMonth = String(firstDay.getMonth() + 1).padStart(2, '0');
	const firstDayFormatted = `${firstDayYear}-${firstDayMonth}-01`;

	return [formattedDate, firstDayFormatted];
}
