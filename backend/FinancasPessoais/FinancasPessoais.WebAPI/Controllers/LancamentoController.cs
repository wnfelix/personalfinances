using CommonHelpers.Base.Transformer;
using FinancasPessoais.Domain;
using FinancasPessoais.Services;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace FinancasPessoais.WebAPI.Controllers
{
    public class LancamentoController : ApiController
    {
        private ILancamentoCommandService _lancamentoCommandService;
        private ITransformer<Lancamento, LancamentoModel> _lancamentoTransformer;

        public LancamentoController(ILancamentoCommandService lancamentoCommandService,
            ITransformer<Lancamento, LancamentoModel> lancamentoTransformer)
        {
            _lancamentoCommandService = lancamentoCommandService;
            _lancamentoTransformer = lancamentoTransformer;
        }

        [HttpPost]
        public HttpResponseMessage Upload(DateTime mesref)
        {
            try
            {
                var request = this.Request;

                if (!request.Content.IsMimeMultipartContent())
                {
                    throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
                }

                if (HttpContext.Current.Request.Files != null)
                {
                    var filePaths = new List<string>();

                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        var file = HttpContext.Current.Request.Files[i];
                        if (file.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                        {
                            var fileStream = File.Create(Path.GetTempFileName());
                            file.InputStream.CopyTo(fileStream);
                            fileStream.Close();

                            filePaths.Add(fileStream.Name);
                        }
                    }

                    if (filePaths.Any())
                    {
                        var targetPath = _lancamentoCommandService.ExportExcel(filePaths.ToArray(), mesref);

                        var fileName = $"caixa-{mesref.Month:00}{mesref.Year}.xlsx";
                        var result = new HttpResponseMessage(HttpStatusCode.OK)
                        {
                            Content = new StreamContent(new MemoryStream(File.ReadAllBytes(targetPath)))
                        };
                        result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                        result.Content.Headers.Add("FileName", string.Format("{0}{1}", fileName, "xlsx"));
                        result.Content.Headers.Add("Access-Control-Expose-Headers", "FileName");
                        result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                        result.Content.Headers.ContentDisposition.FileName = fileName;

                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

        [HttpPost]
        public IHttpActionResult Incluir([FromBody] LancamentoModel model)
        {
            var lanc = _lancamentoTransformer.Reverse(model);
            lanc = _lancamentoCommandService.Incluir(lanc);

            return Created("lancamento", _lancamentoTransformer.Transform(lanc));
        }

        [HttpGet]
        public dynamic Lancamento(DateTime mesref, bool download = false)
        {
            if (!download)
            {
                var lst = new List<LancamentoModel>();
                Array.ForEach(_lancamentoCommandService.Lancamentos(mesref).ToArray(), i => lst.Add(_lancamentoTransformer.Transform(i)));

                return Ok(lst);
            }
            else
            {
                var targetPath = _lancamentoCommandService.ExportExcel(mesref);

                var fileName = $"caixa-{mesref.Month:00}{mesref.Year}.xlsx";
                var result = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StreamContent(new MemoryStream(File.ReadAllBytes(targetPath)))
                };
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                result.Content.Headers.Add("FileName", string.Format("{0}{1}", fileName, "xlsx"));
                result.Content.Headers.Add("Access-Control-Expose-Headers", "FileName");
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = fileName;

                return result;
            }
        }
    }
}