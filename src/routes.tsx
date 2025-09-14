import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DescricaoExtra from './pages/DescricaoExtra';
import EditarEstabelecimento from './pages/EditarEstabelecimento';
import Estabelecimentos from './pages/Estabelecimento';
import LancamentoUpload from './pages/LancamentoUpload';
import NovaDescricaoExtra from './pages/NovaDescricaoExtra';
import NovoEstabelecimento from './pages/NovoEstabelecimento';
import NovoTipoEstabelecimento from './pages/NovoTipoEstabelecimento';
import TiposEstabelecimento from './pages/TiposEstabelecimento';
import ClassificacaoExtra from './pages/ClassificacaoExtra';

const queryClient = new QueryClient();

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path='/' element={<Estabelecimentos />} />
					<Route
						path='/estabelecimentos'
						element={<Estabelecimentos />}
					/>
					<Route
						path='/editarestabelecimento/:id'
						element={<EditarEstabelecimento />}
					/>
					<Route
						path='/novoestabelecimento'
						element={<NovoEstabelecimento />}
					/>
					<Route
						path='/tiposestabelecimento'
						element={<TiposEstabelecimento />}
					/>
					<Route
						path='/novotipoestabelecimento'
						element={<NovoTipoEstabelecimento />}
					/>
					<Route
						path='/descricaoextra'
						element={<DescricaoExtra />}
					/>
					<Route
						path='/novadescricaoextra'
						element={<NovaDescricaoExtra />}
					/>
					<Route path='/lancamentos' element={<LancamentoUpload />} />
					<Route
						path='/classificacaoextra'
						element={<ClassificacaoExtra />}
					/>
				</Routes>
			</QueryClientProvider>
		</BrowserRouter>
	);
}
