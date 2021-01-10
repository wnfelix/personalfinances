using ExcelDocumentToolKit.CrossCutting.Infra.OpenXml;
using ExcelDocumentToolKit.Domain.IServices;
using ExcelDocumentToolKit.Domain.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Windows.Forms;

namespace ExcelDocumentToolKit.Application.Test
{
    public partial class ExcelToolKitForm : Form
    {
        public ExcelToolKitForm()
        {
            InitializeComponent();
        }

        private void btnAbrir_Click(object sender, EventArgs e)
        {
            using (var dialog = new OpenFileDialog())
            {
                dialog.Filter = "Excel Files|*.xls;*.xlsx;";

                var result = dialog.ShowDialog();
                if (result == DialogResult.OK)
                {
                    txtLocal.Text = dialog.FileName;
                    FillDataGrid(dialog.FileName);
                    ExcelDocumentService.DeleteExcelDocument(dialog.FileName);
                    MessageBox.Show("Documento carregado com sucesso. Após o carregamento o arquivo foi removido.");
                }                
            }
        }

        //Exemplo de implementação para escrita de objetos fortemente tipados para excel
        private void btnCriar_Click(object sender, EventArgs e)
        {
            if (dgvExcelDocument.Rows.Count > 0)
            {
                var path = Path.GetDirectoryName(txtLocal.Text);
                var filePath = $"{path}\\Signus_{DateTime.Now.ToString("dd-MM-yyyy-hh-mm-ss")}.xlsx";
                using (var ExcelDocumentService = new ExcelDocumentService(filePath, new OpenXmlApplication(filePath)))
                {
                    var lst = new List<Signus>();
                    foreach (DataGridViewRow row in dgvExcelDocument.Rows)
                        lst.Add(row.DataBoundItem as Signus);

                    ExcelDocumentService.WriteExcelDocument(lst);
                }

                ClearDataGrid();
            }
            else
                MessageBox.Show("Carregue algum documento antes de criar.");
        }

        //Exemplo de implementação para leitura do excel e parse para objetos fortemente tipados
        private void FillDataGrid(string filePath)
        {            
            using (var ExcelDocumentService = new ExcelDocumentService(filePath, new OpenXmlApplication(filePath)))
            {
                //O objeto para retorno deve possuir as properties iguais às colunas header do documento
                var lst = ExcelDocumentService.ReadExcelDocument<Signus>("Global");                

                var source = new BindingSource { DataSource = lst };
                dgvExcelDocument.DataSource = source;
            }                       
        }
        private void ClearDataGrid()
        {
            dgvExcelDocument.Rows.Clear();
            dgvExcelDocument.Refresh();
        }
    }

    public class Signus
    {
        public string RequestId { get; set; }
        public string Operation { get; set; }
        public string IntegrationLogCreatedOn { get; set; }
        public string SuccessCreatedOn { get; set; }
        public string FailReason { get; set; }
        public string Fail { get; set; }
        public string InnerException { get; set; }
        public string Success { get; set; }        
    }
}
