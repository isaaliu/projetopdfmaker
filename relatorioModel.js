const db = require('../conexao/db');

const User = {

    getAllUsers: (callback) => {
        const sql = 'SELECT * FROM users';
        db.query(sql, (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },


    getAllUsersToPDF: (dataInicial, dataFinal) => {
        // Converte as datas para o formato americano (YYYY-MM-DD)
        const formatarData = (data) => {
            const partes = data.split('-'); // Supondo que a data esteja no formato YYYY-MM-DD
            if (partes.length === 3) {
                return `${partes[0]}-${partes[1].padStart(2, '0')}-${partes[2].padStart(2, '0')}`;
            }
            throw new Error('Formato de data inválido.');
        };

        const dataInicialFormatada = formatarData(dataInicial);
        const dataFinalFormatada = formatarData(dataFinal);

        const sql = 'SELECT * FROM users WHERE dtnasc BETWEEN ? AND ?'
        return new Promise((resolve, reject) => {
            db.query(sql, [dataInicialFormatada, dataFinalFormatada], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

};
module.exports = User;