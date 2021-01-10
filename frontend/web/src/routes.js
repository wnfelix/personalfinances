import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import EditarEstabelecimento from './pages/EditarEstabelecimento';
import Estabelecimentos from './pages/Estabelecimentos';
import NovoEstabelecimento from './pages/NovoEstabelecimento';
import NovoTipo from './pages/NovoTipo';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Estabelecimentos} />
                <Route path='/editarestabelecimento/:id' component={EditarEstabelecimento} />
                <Route path='/novoestabelecimento' component={NovoEstabelecimento} />
                <Route path='/novotipo' component={NovoTipo} />
            </Switch>
        </BrowserRouter>
    )
}