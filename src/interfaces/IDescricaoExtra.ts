import IEntidadeGenerica from './IEntidadeGenerica';
import IEstabelecimento from './IEstabelecimento';

export default interface IDescricaoExtra {
	id: string;
	merchant: IEstabelecimento;
	category: IEntidadeGenerica;
	memoText: string;
	matchDate: Date;
	matchIndexFrom: number;
	matchIndexTo: number;
}
