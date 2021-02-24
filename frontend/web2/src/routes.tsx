import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import EditarEstabelecimento from './pages/EditarEstabelecimento';
import Estabelecimentos from './pages/Estabelecimentos';
import NovoEstabelecimento from './pages/NovoEstabelecimento';
import NovoTipoEstabelecimento from './pages/NovoTipoEstabelecimento';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Estabelecimentos} />
                <Route path='/estabelecimentos' component={Estabelecimentos} />
                <Route path='/editarestabelecimento/:id' component={EditarEstabelecimento} />
                <Route path='/novoestabelecimento' component={NovoEstabelecimento} />
                <Route path='/novotipoestabelecimento' component={NovoTipoEstabelecimento} />
            </Switch>
        </BrowserRouter>
    )
}