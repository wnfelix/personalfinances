using CommonHelpers;
using CommonHelpers.Enumerations;
using FinancasPessoais.Data.Maps;
using FluentNHibernate.Cfg;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;

namespace FinancasPessoais.Data
{
    public class DatabaseContext
    {
        private static ListDictionary _factories;

        private static ISessionFactory CreateSessionFactory(string connectionStringKey)
        {
            var cfg = new NHibernate.Cfg.Configuration();
            cfg.SetProperty(NHibernate.Cfg.Environment.ShowSql, "true");

            var cns = FluentNHibernate.Cfg.Db.MsSqlConfiguration.MsSql2012.ConnectionString(x => x.FromConnectionStringWithKey(connectionStringKey));

            return Fluently.Configure(cfg)
                .Database(cns)
                .Mappings(m =>
                {
                    m.FluentMappings.AddFromAssemblyOf<DominioMap>();
                }).BuildSessionFactory();
        }

        public static ISessionFactory GetSessionFactoryInstance(ConnectionStringEnum connectionString)
        {
            ISessionFactory sessionFactory = null;

            if (_factories == null)
                _factories = new ListDictionary();

            if (_factories.Contains(connectionString))
                sessionFactory = (ISessionFactory)_factories[connectionString];
            else
            {
                var connectionStringKey = EnumHelper<ConnectionStringEnum>.GetDisplayValue(connectionString);
                sessionFactory = CreateSessionFactory(connectionStringKey);
                _factories.Add(connectionString, sessionFactory);
            }

            sessionFactory = (ISessionFactory)_factories[connectionString];

            return sessionFactory;
        }
    }
}
