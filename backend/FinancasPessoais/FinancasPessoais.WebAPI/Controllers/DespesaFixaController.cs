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
    public class DespesaFixaController : ApiController
    {
        private IDominioRepository _dominioRepository;
        private ITransformer<DespesaFixa, DespesaFixaModel> _despesaFixaTransformer;

        public DespesaFixaController(IDominioRepository dominioRepository,
            ITransformer<DespesaFixa, DespesaFixaModel> despesaFixaTransformer)
        {
            _dominioRepository = dominioRepository;
            _despesaFixaTransformer = despesaFixaTransformer;
        }

        [HttpGet]
        public IHttpActionResult Listar(bool somenteAtivos = true)
        {
            var query = _dominioRepository.GetQueryable<DespesaFixa>();

            if (somenteAtivos)
                query = query.Where(x => x.Ativo);

            var dfs = new List<DespesaFixaModel>();
            Array.ForEach(query.ToArray(), i => dfs.Add(_despesaFixaTransformer.Transform(i)));

            return Ok(dfs);
        }
    }
}