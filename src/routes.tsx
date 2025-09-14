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
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Routes>
						{/* Public route */}
						<Route path='/' element={<Login />} />

						{/* Protected routes */}
						<Route
							path='/lancamentos'
							element={
								<ProtectedRoute>
									<LancamentoUpload />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/estabelecimentos'
							element={
								<ProtectedRoute>
									<Estabelecimentos />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/editarestabelecimento/:id'
							element={
								<ProtectedRoute>
									<EditarEstabelecimento />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/novoestabelecimento'
							element={
								<ProtectedRoute>
									<NovoEstabelecimento />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/tiposestabelecimento'
							element={
								<ProtectedRoute>
									<TiposEstabelecimento />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/novotipoestabelecimento'
							element={
								<ProtectedRoute>
									<NovoTipoEstabelecimento />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/descricaoextra'
							element={
								<ProtectedRoute>
									<DescricaoExtra />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/novadescricaoextra'
							element={
								<ProtectedRoute>
									<NovaDescricaoExtra />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/lancamentos'
							element={
								<ProtectedRoute>
									<LancamentoUpload />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/classificacaoextra'
							element={
								<ProtectedRoute>
									<ClassificacaoExtra />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</AuthProvider>
			</QueryClientProvider>
		</BrowserRouter>
	);
}
