using NHibernate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace FinancasPessoais.Data.Repositories
{
    public abstract class BaseRepository<TEntity, TKey> : IRepository<TEntity, TKey> where TEntity : class
    {
        protected ISession _session;
        protected IStatelessSession _statelessSession;

        protected BaseRepository()
        {

        }

        public BaseRepository(ISession session)
        {
            _session = session;
        }

        public BaseRepository(ISession session, IStatelessSession statelessSession)
        {
            _session = session;
            _statelessSession = statelessSession;
        }

        public ISession CurrentSession
        {
            get { return _session; }
        }

        public virtual IEnumerable<TEntity> FindBy(Expression<Func<TEntity, bool>> expression, bool usingStatelessSession = false)
        {
            IQueryable<TEntity> entities = null;

            if (usingStatelessSession)
                entities = _statelessSession.Query<TEntity>().Where(expression);
            else
                entities = _session.Query<TEntity>().Where(expression);

            FindByBaseQueryBeforeExecute(ref entities);

            if (entities != null)
                foreach (var item in entities)
                    FillAgregatedEntities(item);

            return entities;
        }

        public IEnumerable<TEntitySource> FindBy<TEntitySource>(Expression<Func<TEntitySource, bool>> expression, bool usingStatelessSession = false)
        {
            IQueryable<TEntitySource> entities = null;

            if (usingStatelessSession)
                entities = _statelessSession.Query<TEntitySource>().Where(expression);
            else
                entities = _session.Query<TEntitySource>().Where(expression);

            return entities;
        }

        public virtual TEntity Get(TKey id)
        {
            var entity = _session.Get<TEntity>(id);
            if (entity != null)
                FillAgregatedEntities(entity);

            return entity;
        }

        public virtual TEntitySource Get<TEntitySource>(object id)
        {
            var entity = _session == null ? _statelessSession.Get<TEntitySource>(id) : _session.Get<TEntitySource>(id);

            return entity;
        }

        /// <summary>
        /// Método utilizado para o preenchimento de entidades agregadas que não puderam ser mapeadas no Fluent
        /// </summary>
        /// <param name="entity"></param>
        public virtual void FillAgregatedEntities(TEntity entity) { }

        /// <summary>
        /// Possibilita incluir alguma cláusula adicional na query antes que ela seja executada
        /// </summary>
        /// <param name="query"></param>
        protected virtual void FindByBaseQueryBeforeExecute(ref IQueryable<TEntity> query) { }

        public virtual IEnumerable<TEntity> List()
        {
            var entities = _session.Query<TEntity>().ToList();
            foreach (var item in entities)
                FillAgregatedEntities(item);

            return entities;
        }

        public virtual IEnumerable<TEntitySource> List<TEntitySource>()
        {
            var entities = _session.Query<TEntitySource>().ToList();

            return entities;
        }

        public virtual void Save(TEntity entity, bool doFlush = true)
        {
            _session.Save(entity);
            if (doFlush)
                _session.Flush();
        }

        public virtual void Save<TEntitySource>(IEnumerable<TEntitySource> list, int batchSize)
        {
            if (_statelessSession == null)
                throw new InvalidOperationException("stateless connection not created for batch insert");

            using (var transaction = _statelessSession.BeginTransaction())
            {
                _statelessSession.SetBatchSize(batchSize);

                foreach (var entity in list)
                    _statelessSession.Insert(entity);

                transaction.Commit();
            }
        }

        public virtual void Dispose()
        {
            if (_session != null && _session.IsOpen)
            {
                _session.Close();
                _session.Dispose();
            }

            if (_statelessSession != null && _statelessSession.IsOpen)
            {
                _statelessSession.Close();
                _statelessSession.Dispose();
            }
        }

        public virtual void Save(IEnumerable<TEntity> list)
        {
            Save(list, 100);
        }

        public virtual void Flush()
        {
            if (_session != null && _session.IsOpen)
                _session.Flush();
        }

        #region Delete

        public virtual void Delete(TEntity entity, bool doFlush = true)
        {
            _session.Delete(entity);
            if (doFlush)
                _session.Flush();
        }

        public virtual void Delete<TEntitySource>(TEntitySource entity, bool doFlush = true)
        {
            _session.Delete(entity);
            if (doFlush)
                _session.Flush();
        }

        public virtual void Delete(IEnumerable<TEntity> list)
        {
            Delete(list, 100);
        }

        #endregion

        public virtual void Delete(IEnumerable<TEntity> list, int batchSize)
        {
            if (_statelessSession == null)
                throw new InvalidOperationException("stateless connection not created for batch delete");

            using (var transaction = _statelessSession.BeginTransaction())
            {
                _statelessSession.SetBatchSize(batchSize);

                foreach (var entity in list)
                    _statelessSession.Delete(entity);

                transaction.Commit();
            }
        }

        public virtual IList<TProcEntity> ExecuteNamedStoredProcedure<TProcEntity>(string storedProcedure, IEnumerable<KeyValuePair<string, object>> parameters, int timeOut = 0)
        {
            var query = GenerateQuery(storedProcedure, parameters, timeOut);

            return query.List<TProcEntity>();
        }

        public virtual void ExecuteNamedStoredProcedure(string storedProcedure, IEnumerable<KeyValuePair<string, object>> parameters, int timeOut = 0)
        {
            var query = GenerateQuery(storedProcedure, parameters, timeOut);

            query.ExecuteUpdate();
        }

        private ISQLQuery GenerateQuery(string storedProcedure, IEnumerable<KeyValuePair<string, object>> parameters, int timeOut)
        {
            var sb = new StringBuilder($"exec {storedProcedure} ");

            if (parameters != null)
                for (int i = 0; i < parameters.Count(); i++)
                {
                    var param = parameters.Skip(i).Take(1).Single();
                    if (i > 0)
                        sb.Append(", ");
                    sb.Append($":{param.Key}");
                }

            var query = _session.CreateSQLQuery(sb.ToString());

            if (timeOut > 0)
                query.SetTimeout(timeOut);

            if (parameters != null)
                foreach (var param in parameters.Where(p => p.Value != null))
                    query.SetParameter(param.Key, param.Value);

            return query;
        }

        public virtual bool Exists(object id)
        {
            return _session.Get<TEntity>(id) != null;
        }

        public virtual bool Exists<TEntitySource>(Expression<Func<TEntitySource, bool>> expression)
        {
            return _session.Query<TEntitySource>().Where(expression).Any();
        }

        public void Save<TEntitySource>(TEntitySource entity, bool doFlush = true)
        {
            _session.Save(entity);
            if (doFlush)
                _session.Flush();
        }

        public void Save<TEntitySource>(IEnumerable<TEntitySource> list)
        {
            Save(list, 100);
        }

        public virtual int ExecuteSql(string query)
        {
            var cmd = _session.CreateSQLQuery(query);
            return cmd.ExecuteUpdate();
        }

        public virtual IQueryable<TEntitySource> GetQueryable<TEntitySource>()
        {
            return _session.Query<TEntitySource>();
        }
    }
}
