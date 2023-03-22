﻿using CommonHelpers.Base.Transformer;
using FinancasPessoais.Data.Repositories;
using FinancasPessoais.Domain;
using FinancasPessoais.Services;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace FinancasPessoais.WebAPI.Controllers
{

    public class EstabelecimentoController : ApiController
    {
        private IDominioRepository _dominioRepository;
        private IEstabelecimentoCommandService _estabelecimentoCommandService;
        private ITransformer<Estabelecimento, EstabelecimentoModel> _estabelecimentoTransformer;

        public EstabelecimentoController(IDominioRepository dominioRepository,
            IEstabelecimentoCommandService estabelecimentoCommandService,
            ITransformer<Estabelecimento, EstabelecimentoModel> estabelecimentoTransformer)
        {
            _dominioRepository = dominioRepository;
            _estabelecimentoCommandService = estabelecimentoCommandService;
            _estabelecimentoTransformer = estabelecimentoTransformer;
        }

        // GET: Estabelecimento
        [HttpGet]
        public IHttpActionResult Listar(int exibicao = 0)
        {
            var estabelecimentos = new List<EstabelecimentoModel>();

            var lst = _dominioRepository.GetQueryable<Estabelecimento>();

            if (exibicao == 1)
                lst = from estab in lst
                      where estab.Lancamentos.Count > 0
                      select estab;

            var result = from estab in lst
                         where estab.Ativo
                         select new
                         {
                             Estabecimento = estab,
                             Lancamentos = estab.Lancamentos.Count,
                             DescricoesExtras = estab.Lancamentos.Count(x => x.DescricaoExtra != null)
                         };

            Array.ForEach(result.ToArray(), e => estabelecimentos.Add(_estabelecimentoTransformer.Transform(e.Estabecimento, e.Lancamentos, e.DescricoesExtras)));

            return Ok(estabelecimentos.ToArray());
        }

        [HttpPost]
        public IHttpActionResult Cadastrar([FromBody] EstabelecimentoModel estabelecimento)
        {
            _estabelecimentoCommandService.Salvar(_estabelecimentoTransformer.Reverse(estabelecimento));

            return Ok();
        }

        [HttpPut]
        public IHttpActionResult Atualizar([FromBody] EstabelecimentoModel estabelecimento)
        {
            _estabelecimentoCommandService.Salvar(_estabelecimentoTransformer.Reverse(estabelecimento));

            return Ok();
        }

        [HttpGet]
        public IHttpActionResult Show(int id)
        {
            return Ok(_estabelecimentoTransformer.Transform(_dominioRepository.Get<Estabelecimento>(id)));
        }

        [HttpDelete]
        public IHttpActionResult Apagar(int id)
        {
            _estabelecimentoCommandService.ApagarEstabelecimento(id);

            return Ok();
        }
    }
}