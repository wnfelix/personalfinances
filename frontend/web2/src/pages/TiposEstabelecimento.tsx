import React from 'react';
import HeaderToolBar from '../components/HeaderToolBar';
import Master from './Master';

export default function TiposEstabelecimento() {
	return (
		<Master title='Tipos de Estabelecimento'>
			<div className='tiposestabelecimentos'>
				<div className='application-header'>
					<HeaderToolBar
						title={{ text: 'Tipos de Estabelecimento', url: '/tiposestabelecimento' }}
						links={[{ text: 'Novo', url: '/novotipoestabelecimento' }]}
					/>
				</div>
				<div className='application-body'></div>
			</div>
		</Master>
	);
}
