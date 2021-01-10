using System;

namespace FinancasPessoais.Domain
{
    public class Dominio : BaseDomain<int>
    {
        public virtual string Descricao { get; set; }
        public virtual bool Ativo { get; set; }
    }
}
