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
