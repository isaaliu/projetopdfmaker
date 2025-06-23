// relatorioController.js

const User = require('../models/relatorioModel');
const PdfPrinter = require('pdfmake');

// OBTÉM TODOS OS USUÁRIOS
exports.getAllUsers = (req, res) => {
    User.getAllUsers((users) => {
        if (Array.isArray(users)) {
            console.error("Erro no retorno de getAllUsers há um erro.");
            return res.status(500).send("Erro ao buscar usuários.");
        }
        res.render("relatorio", { users });
    });
};

// Função para gerar o PDF
async function gerarPDF(users) {

    const fonts = {
        Roboto: {
            normal: 'node_modules/pdfmake/fonts/Roboto-Regular.ttf',
            bold: 'node_modules/pdfmake/fonts/Roboto-Bold.ttf',
            italics: 'node_modules/pdfmake/fonts/Roboto-Italic.ttf',
            bolditalics: 'node_modules/pdfmake/fonts/Roboto-BoldItalic.ttf',
        }
    };

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Relatório de Clientes', style: 'header' },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', '*'],
                    body: [
                        ['ID', 'Nome', 'Email'],
                        ...users.map(user => [user.id, user.name, user.email])
                    ],
                }
                
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
            }
        }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    return new Promise((resolve, reject) => {
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);
        pdfDoc.end();
    });
}
// GERAR REFLATORIO EM PDF
exports.generatePDF = async (req, res) => {
    try{
        // Captura os valores enviados pelo formulário
        const { data_inicial, data_final } = req.query;

        // Valida se as datas foram enviadas
        if (!data_inicial || !data_final) {
            return res.status(400).send('datas inválidas. Porfavor preencha os campos corretamento.');
        }
     
        // Chama o modelo e passa as datas como parâmetros
    const users = await User.getAllUserstoPDF(data_inicial, data_final);


    // Gera o PDF com os dados filtrados
    const pdfBuffer = await gerarPDF (users);

    // Envia o PDF como resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
    res.send(pdfBuffer);
    } catch (error) { 
        console.error('Erro ao gerar PDF:', error.message);
        res.status(500).send('Erro ao gerar relatório PDF.');         
}
};