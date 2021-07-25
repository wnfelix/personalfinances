using CommonHelpers.Base.Transformer;
using FinancasPessoais.Data.Repositories;
using FinancasPessoais.Domain;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace FinancasPessoais.WebAPI.Controllers
{
    public class DescricaoExtraController : ApiController
    {
        private IDominioRepository _dominioRepository;
        private ITransformer<Estabelecimento, EstabelecimentoModel> _estabelecimentoTransformer;

        public DescricaoExtraController(IDominioRepository dominioRepository,
            ITransformer<Estabelecimento, EstabelecimentoModel> estabelecimentoTransformer)
        {
            _dominioRepository = dominioRepository;
            _estabelecimentoTransformer = estabelecimentoTransformer;
        }

        [HttpGet]
        public IHttpActionResult Listar()
        {
            return Ok(_dominioRepository.FindBy<DescricaoExtra>(d => d.Ativo).Select(x => new
            {
                x.Id,
                estabelecimento = _estabelecimentoTransformer.Transform(x.Estabelecimento),
                classificacao = new { x.Classificacao.Id, x.Classificacao.Descricao },
                x.Descricao,
                x.DataCompra,
                x.IndiceCompraDe,
                x.IndiceCompraAte
            })); ;
        }

        [HttpPost]
        public IHttpActionResult Incluir([FromBody] DescricaoExtraModel body)
        {
            var descricaoExtra = new DescricaoExtra
            {
                Estabelecimento = _dominioRepository.Get<Estabelecimento>(body.Estabelecimento.Id),
                Classificacao = _dominioRepository.Get<TipoDominio>(body.Classificacao.Id),
                DataCompra = body.DataCompra,
                Ativo = true,
                IndiceCompraDe = body.IndiceCompraDe,
                IndiceCompraAte = body.IndiceCompraAte,
                Descricao = body.Descricao
            };

            _dominioRepository.Save(descricaoExtra);

            return Ok();
        }
    }
}