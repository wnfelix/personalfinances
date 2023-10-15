[assembly: WebActivator.PostApplicationStartMethod(typeof(FinancasPessoais.WebAPI.App_Start.SimpleInjectorWebApiInitializer), "Initialize")]

namespace FinancasPessoais.WebAPI.App_Start
{
    using System.Web.Http;
    using CommonHelpers.Base;
    using CommonHelpers.Base.Transformer;
    using FinancasPessoais.Data.Repositories;
    using FinancasPessoais.Domain;
    using FinancasPessoais.Services;
    using FinancasPessoais.Services.Validators;
    using FinancasPessoais.WebAPI.Models;
    using FinancasPessoais.WebAPI.Sessions;
    using FinancasPessoais.WebAPI.Transformers;
    using SimpleInjector;
    using SimpleInjector.Integration.WebApi;
    using SimpleInjector.Lifestyles;

    public static class SimpleInjectorWebApiInitializer
    {
        /// <summary>Initialize the container and register it as Web API Dependency Resolver.</summary>
        public static void Initialize()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new AsyncScopedLifestyle();
            
            InitializeContainer(container);
            container.Register<IFinancasPessoaisSession, FinancasPessoaisSession>();

            container.RegisterWebApiControllers(GlobalConfiguration.Configuration);
       
            container.Verify();
            
            GlobalConfiguration.Configuration.DependencyResolver =
                new SimpleInjectorWebApiDependencyResolver(container);
        }

        private static void InitializeContainer(Container container)
        {
            #region repository

            container.Register<IDominioRepository, DominioRepository>();

            #endregion

            #region validators

            container.Register<IValidator<Estabelecimento>, EstabelecimentoValidator>();

            #endregion

            #region commandServices

            container.Register<IEstabelecimentoCommandService, EstabelecimentoCommandService>();
            container.Register<ILancamentoCommandService, LancamentoCommandService>();

            #endregion

            #region transformers

            container.Register<ITransformer<Estabelecimento, EstabelecimentoModel>, EstabelecimentoTransformer>();
            container.Register<ITransformer<TipoDominio, TipoDominioModel>, TipoDominioTransformer>();
            container.Register<ITransformer<Lancamento, LancamentoModel>, LancamentoTransformer>();
            container.Register<ITransformer<ClassificacaoExtra, ClassificacaoExtraModel>, ClassificacaoExtraTransformer>();
            container.Register<ITransformer<dynamic, EntidadeGenericaModel<int>>, EntidadeGenericaTransformer>();
            container.Register<ITransformer<DescricaoExtra, DescricaoExtraModel>, DescricaoExtraTransformer>();
            container.Register<ITransformer<DespesaFixa, DespesaFixaModel>, DespesaFixaTransformer>();

            #endregion

            // For instance:
            // container.Register<IUserRepository, SqlUserRepository>(Lifestyle.Scoped);
        }
    }
}