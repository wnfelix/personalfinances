import IEntidadeGenerica from './IEntidadeGenerica';

export default interface IEstabelecimento {
	id: string;
	name: string;
	pattern: string;
	category: IEntidadeGenerica;
	totalExpense: number;
	totalMemoRule: number;
}
