using NHibernate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace FinancasPessoais.Data.Repositories
{
    public interface IRepository<T, TKey>
    {
        IEnumerable<T> FindBy(Expression<Func<T, bool>> expression, bool usingStatelessSession = false);

        IEnumerable<TEntitySource> FindBy<TEntitySource>(Expression<Func<TEntitySource, bool>> expression, bool usingStatelessSession = false);

        T Get(TKey id);

        TEntitySource Get<TEntitySource>(object id);

        void Save(T entity, bool doFlush = true);

        void Save(IEnumerable<T> list);

        void Save<TEntity>(TEntity entity, bool doFlush = true);

        void Save<TEntity>(IEnumerable<TEntity> list);

        ISession CurrentSession { get; }

        IEnumerable<T> List();

        IEnumerable<TEntitySource> List<TEntitySource>();

        void Delete(T entity, bool doFlush = true);

        void Delete<TEntity>(TEntity entity, bool doFlush = true);

        void Delete(IEnumerable<T> list);

        void Flush();

        IList<TProcEntity> ExecuteNamedStoredProcedure<TProcEntity>(string storedProcedure, IEnumerable<KeyValuePair<string, object>> parameters, int timeOut = 0);

        void ExecuteNamedStoredProcedure(string storedProcedure, IEnumerable<KeyValuePair<string, object>> parameters, int timeOut = 0);

        bool Exists(object id);

        bool Exists<TEntitySource>(Expression<Func<TEntitySource, bool>> expression);

        IQueryable<TEntitySource> GetQueryable<TEntitySource>();
    }
}
